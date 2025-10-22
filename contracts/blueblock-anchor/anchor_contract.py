"""
BlueBlock Data Anchor Smart Contract

This smart contract handles the anchoring of Merkle roots from the BlueBlock
Blue Carbon MRV platform onto the Algorand blockchain.
"""

from algosdk.v2client import algod
from algosdk import account, mnemonic, transaction
from algosdk.transaction import StateSchema, OnComplete
from algosdk.logic import get_application_address
import base64
import hashlib

# TEAL Smart Contract Code
APPROVAL_PROGRAM = """#pragma version 8

// BlueBlock Anchor Contract
// Stores Merkle roots for Blue Carbon MRV data

// Handle different transaction types
txn ApplicationID
int 0
==
bnz handle_creation

txn OnCompletion
int NoOp
==
bnz handle_noop

txn OnCompletion
int OptIn
==
bnz handle_optin

txn OnCompletion
int DeleteApplication
==
bnz handle_delete

txn OnCompletion
int UpdateApplication
==
bnz handle_update

// Reject all other transaction types
int 0
return

handle_creation:
    // Store creator as owner
    byte "owner"
    txn Sender
    app_global_put
    
    // Initialize anchor count
    byte "anchor_count"
    int 0
    app_global_put
    
    // Initialize project count
    byte "project_count"
    int 0
    app_global_put
    
    int 1
    return

handle_optin:
    // Allow any account to opt-in
    int 1
    return

handle_noop:
    // Check for method call
    txna ApplicationArgs 0
    byte "anchor"
    ==
    bnz anchor_data
    
    txna ApplicationArgs 0
    byte "get_anchor"
    ==
    bnz get_anchor_data
    
    // Unknown method
    int 0
    return

anchor_data:
    // Verify sender is authorized (owner or approved account)
    byte "owner"
    app_global_get
    txn Sender
    ==
    bnz anchor_authorized
    
    // Check if sender has opted-in and is approved
    txn Sender
    byte "approved"
    app_local_get
    int 1
    ==
    bnz anchor_authorized
    
    // Not authorized
    int 0
    return

anchor_authorized:
    // Store the anchor data
    // ApplicationArgs[0] = "anchor"
    // ApplicationArgs[1] = project_id (bytes)
    // ApplicationArgs[2] = merkle_root (32 bytes)
    // ApplicationArgs[3] = record_count (uint64)
    // ApplicationArgs[4] = from_timestamp (uint64)
    // ApplicationArgs[5] = to_timestamp (uint64)
    
    // Increment anchor count
    byte "anchor_count"
    byte "anchor_count"
    app_global_get
    int 1
    +
    dup
    app_global_put
    
    // Create key for this anchor: "anchor_" + count
    byte "anchor_"
    byte "anchor_count"
    app_global_get
    itob
    concat
    
    // Store merkle root at this key
    txna ApplicationArgs 2
    app_global_put
    
    // Store metadata
    byte "anchor_"
    byte "anchor_count"
    app_global_get
    itob
    concat
    byte "_project"
    concat
    txna ApplicationArgs 1
    app_global_put
    
    byte "anchor_"
    byte "anchor_count"
    app_global_get
    itob
    concat
    byte "_count"
    concat
    txna ApplicationArgs 3
    app_global_put
    
    byte "anchor_"
    byte "anchor_count"
    app_global_get
    itob
    concat
    byte "_from"
    concat
    txna ApplicationArgs 4
    app_global_put
    
    byte "anchor_"
    byte "anchor_count"
    app_global_get
    itob
    concat
    byte "_to"
    concat
    txna ApplicationArgs 5
    app_global_put
    
    byte "anchor_"
    byte "anchor_count"
    app_global_get
    itob
    concat
    byte "_timestamp"
    concat
    global LatestTimestamp
    itob
    app_global_put
    
    // Log the anchor event
    byte "Anchor stored"
    log
    
    int 1
    return

get_anchor_data:
    // Anyone can read anchor data
    // ApplicationArgs[0] = "get_anchor"
    // ApplicationArgs[1] = anchor_index (uint64)
    
    // Just approve - data is read via app state
    int 1
    return

handle_delete:
    // Only owner can delete
    byte "owner"
    app_global_get
    txn Sender
    ==
    return

handle_update:
    // Only owner can update
    byte "owner"
    app_global_get
    txn Sender
    ==
    return
"""

CLEAR_PROGRAM = """#pragma version 8
// Clear state program - always approve
int 1
return
"""

class AnchorContract:
    """Wrapper for the BlueBlock Anchor smart contract"""
    
    def __init__(self, algod_client: algod.AlgodClient):
        self.algod_client = algod_client
        self.app_id = None
        
    def compile_program(self, source_code: str) -> bytes:
        """Compile TEAL source code"""
        compile_response = self.algod_client.compile(source_code)
        return base64.b64decode(compile_response['result'])
    
    def create_app(self, sender_address: str, private_key: str) -> int:
        """Deploy the smart contract"""
        
        # Compile programs
        approval_program_compiled = self.compile_program(APPROVAL_PROGRAM)
        clear_program_compiled = self.compile_program(CLEAR_PROGRAM)
        
        # Define schema
        global_schema = StateSchema(num_uints=32, num_byte_slices=32)
        local_schema = StateSchema(num_uints=4, num_byte_slices=4)
        
        # Get suggested params
        params = self.algod_client.suggested_params()
        
        # Create transaction
        txn = transaction.ApplicationCreateTxn(
            sender=sender_address,
            sp=params,
            on_complete=OnComplete.NoOpOC,
            approval_program=approval_program_compiled,
            clear_program=clear_program_compiled,
            global_schema=global_schema,
            local_schema=local_schema,
        )
        
        # Sign transaction
        signed_txn = txn.sign(private_key)
        
        # Send transaction
        tx_id = self.algod_client.send_transaction(signed_txn)
        
        # Wait for confirmation
        confirmed_txn = transaction.wait_for_confirmation(self.algod_client, tx_id, 4)
        
        # Get application ID
        self.app_id = confirmed_txn['application-index']
        
        print(f"Created app with ID: {self.app_id}")
        return self.app_id
    
    def anchor_merkle_root(
        self,
        sender_address: str,
        private_key: str,
        project_id: str,
        merkle_root: bytes,
        record_count: int,
        from_timestamp: int,
        to_timestamp: int
    ) -> str:
        """Store a Merkle root on-chain"""
        
        if not self.app_id:
            raise ValueError("App ID not set. Deploy contract first.")
        
        # Get suggested params
        params = self.algod_client.suggested_params()
        
        # Prepare app arguments
        app_args = [
            b"anchor",
            project_id.encode('utf-8'),
            merkle_root,
            record_count.to_bytes(8, 'big'),
            from_timestamp.to_bytes(8, 'big'),
            to_timestamp.to_bytes(8, 'big'),
        ]
        
        # Create transaction
        txn = transaction.ApplicationCallTxn(
            sender=sender_address,
            sp=params,
            index=self.app_id,
            on_complete=OnComplete.NoOpOC,
            app_args=app_args,
        )
        
        # Sign transaction
        signed_txn = txn.sign(private_key)
        
        # Send transaction
        tx_id = self.algod_client.send_transaction(signed_txn)
        
        # Wait for confirmation
        transaction.wait_for_confirmation(self.algod_client, tx_id, 4)
        
        print(f"Anchored Merkle root in transaction: {tx_id}")
        return tx_id
    
    def opt_in(self, sender_address: str, private_key: str) -> str:
        """Opt-in to the application"""
        
        if not self.app_id:
            raise ValueError("App ID not set")
        
        params = self.algod_client.suggested_params()
        
        txn = transaction.ApplicationOptInTxn(
            sender=sender_address,
            sp=params,
            index=self.app_id,
        )
        
        signed_txn = txn.sign(private_key)
        tx_id = self.algod_client.send_transaction(signed_txn)
        
        transaction.wait_for_confirmation(self.algod_client, tx_id, 4)
        
        return tx_id
    
    def get_application_state(self) -> dict:
        """Read the global state of the application"""
        
        if not self.app_id:
            raise ValueError("App ID not set")
        
        app_info = self.algod_client.application_info(self.app_id)
        global_state = {}
        
        if 'params' in app_info and 'global-state' in app_info['params']:
            for item in app_info['params']['global-state']:
                key = base64.b64decode(item['key']).decode('utf-8')
                value = item['value']
                
                if value['type'] == 1:  # bytes
                    global_state[key] = base64.b64decode(value['bytes'])
                elif value['type'] == 2:  # uint
                    global_state[key] = value['uint']
        
        return global_state


def create_merkle_root(data_items: list) -> bytes:
    """
    Create a simple Merkle root from a list of data items.
    This is a simplified implementation for demonstration.
    """
    if not data_items:
        return hashlib.sha256(b"").digest()
    
    # Hash all items
    leaves = [hashlib.sha256(str(item).encode()).digest() for item in data_items]
    
    # Build tree
    while len(leaves) > 1:
        if len(leaves) % 2 == 1:
            leaves.append(leaves[-1])  # Duplicate last leaf if odd
        
        parent_level = []
        for i in range(0, len(leaves), 2):
            combined = leaves[i] + leaves[i + 1]
            parent_hash = hashlib.sha256(combined).digest()
            parent_level.append(parent_hash)
        
        leaves = parent_level
    
    return leaves[0]


if __name__ == "__main__":
    # Example usage
    print("BlueBlock Anchor Smart Contract")
    print("=" * 50)
    print("\nThis contract enables:")
    print("- Anchoring Merkle roots of MRV data")
    print("- Immutable timestamping")
    print("- Third-party verification")
    print("\nTo deploy, use deploy.py script")
