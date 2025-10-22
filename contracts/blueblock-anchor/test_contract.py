"""
Test script for BlueBlock Anchor Smart Contract

This script tests the deployed contract's functionality.
"""

import json
import time
from algosdk.v2client import algod
from algosdk import account, mnemonic
from anchor_contract import AnchorContract, create_merkle_root

ALGOD_ADDRESS = "https://testnet-api.algonode.cloud"
ALGOD_TOKEN = ""

def load_deployment_info():
    """Load deployment information"""
    try:
        with open('deployment.json', 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        print("❌ deployment.json not found. Run deploy.py first.")
        return None

def test_contract():
    """Test the deployed contract"""
    
    print("=" * 60)
    print("BlueBlock Anchor Contract Testing")
    print("=" * 60)
    
    # Load deployment info
    print("\n1. Loading deployment information...")
    deployment = load_deployment_info()
    if not deployment:
        return
    
    app_id = deployment['app_id']
    print(f"   App ID: {app_id}")
    
    # Get Algod client
    print("\n2. Connecting to Algorand TestNet...")
    algod_client = algod.AlgodClient(ALGOD_TOKEN, ALGOD_ADDRESS)
    
    # Create contract instance
    contract = AnchorContract(algod_client)
    contract.app_id = app_id
    
    # Read initial state
    print("\n3. Reading initial contract state...")
    try:
        state = contract.get_application_state()
        print(f"   Owner: {state.get('owner', 'Not set')}")
        print(f"   Anchor count: {state.get('anchor_count', 0)}")
        print(f"   Project count: {state.get('project_count', 0)}")
    except Exception as e:
        print(f"   ⚠️  Could not read state: {e}")
    
    # Test data anchoring (requires deployer account)
    print("\n4. Testing data anchoring...")
    print("   Note: This requires the deployer's private key")
    
    # Create sample data for Merkle tree
    sample_measurements = [
        {"site_id": "site_001", "height": 45.2, "survival_rate": 0.92},
        {"site_id": "site_002", "height": 38.7, "survival_rate": 0.88},
        {"site_id": "site_003", "height": 52.1, "survival_rate": 0.95},
    ]
    
    # Generate Merkle root
    merkle_root = create_merkle_root(sample_measurements)
    print(f"   Generated Merkle root: {merkle_root.hex()[:16]}...")
    
    # For actual anchoring, uncomment and provide credentials:
    """
    deployer_mnemonic = input("Enter deployer mnemonic (or press Enter to skip): ")
    if deployer_mnemonic:
        try:
            private_key = mnemonic.to_private_key(deployer_mnemonic)
            address = account.address_from_private_key(private_key)
            
            tx_id = contract.anchor_merkle_root(
                sender_address=address,
                private_key=private_key,
                project_id="project_001",
                merkle_root=merkle_root,
                record_count=len(sample_measurements),
                from_timestamp=int(time.time()) - 86400,
                to_timestamp=int(time.time()),
            )
            
            print(f"   ✅ Data anchored! Transaction: {tx_id}")
            print(f"   View: https://testnet.explorer.perawallet.app/tx/{tx_id}")
            
            # Read updated state
            time.sleep(5)  # Wait for block
            state = contract.get_application_state()
            print(f"   Updated anchor count: {state.get('anchor_count', 0)}")
            
        except Exception as e:
            print(f"   ❌ Anchoring failed: {e}")
    else:
        print("   ⏭️  Skipping anchoring test")
    """
    print("   ⏭️  Skipping anchoring test (requires deployer key)")
    
    print("\n5. Verifying contract is accessible...")
    try:
        app_info = algod_client.application_info(app_id)
        print(f"   ✅ Contract is active")
        print(f"   Creator: {app_info['params']['creator']}")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    print("\n" + "=" * 60)
    print("Testing Complete!")
    print("=" * 60)
    print(f"\nContract URL: https://testnet.explorer.perawallet.app/application/{app_id}")
    print("\n")

if __name__ == "__main__":
    test_contract()
