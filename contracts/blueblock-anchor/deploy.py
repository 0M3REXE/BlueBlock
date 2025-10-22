"""
Deployment script for BlueBlock Anchor Smart Contract

This script deploys the anchor contract to Algorand TestNet or MainNet.
"""

import os
import sys
from algosdk.v2client import algod
from algosdk import account, mnemonic
from anchor_contract import AnchorContract
import json

# Algorand node configuration
ALGOD_ADDRESS = "https://testnet-api.algonode.cloud"
ALGOD_TOKEN = ""  # Public node, no token needed

def get_algod_client():
    """Create and return an Algod client"""
    return algod.AlgodClient(ALGOD_TOKEN, ALGOD_ADDRESS)

def load_or_create_account():
    """
    Load account from environment or create a new one.
    For production, use secure key management (e.g., KMS, hardware wallet).
    """
    
    # Check for mnemonic in environment
    deployer_mnemonic = os.environ.get('DEPLOYER_MNEMONIC')
    
    if deployer_mnemonic:
        private_key = mnemonic.to_private_key(deployer_mnemonic)
        address = account.address_from_private_key(private_key)
        print(f"Using account from environment: {address}")
        return address, private_key
    
    # Create new account (for testing only)
    print("\n⚠️  WARNING: Creating new test account")
    print("For production, set DEPLOYER_MNEMONIC environment variable\n")
    
    private_key, address = account.generate_account()
    account_mnemonic = mnemonic.from_private_key(private_key)
    
    print(f"Generated new account: {address}")
    print(f"Mnemonic (SAVE THIS): {account_mnemonic}")
    print(f"\nFund this account with ALGO from the TestNet dispenser:")
    print(f"https://bank.testnet.algorand.network/?account={address}\n")
    
    input("Press Enter after funding the account...")
    
    return address, private_key

def save_deployment_info(app_id: int, address: str, network: str):
    """Save deployment information to a file"""
    
    deployment_info = {
        "app_id": app_id,
        "deployer_address": address,
        "network": network,
        "contract_address": "",  # Will be calculated
        "algod_address": ALGOD_ADDRESS,
    }
    
    # Save to JSON file
    output_file = "deployment.json"
    with open(output_file, 'w') as f:
        json.dump(deployment_info, f, indent=2)
    
    print(f"\n✅ Deployment info saved to {output_file}")
    
    # Also save for Next.js app
    env_file = "../../.env.local"
    env_content = f"\n# BlueBlock Anchor Contract\nNEXT_PUBLIC_ANCHOR_APP_ID={app_id}\n"
    
    try:
        # Append to .env.local
        with open(env_file, 'a') as f:
            f.write(env_content)
        print(f"✅ Added app ID to {env_file}")
    except Exception as e:
        print(f"⚠️  Could not update .env.local: {e}")
        print(f"Manually add: NEXT_PUBLIC_ANCHOR_APP_ID={app_id}")

def main():
    """Main deployment function"""
    
    print("=" * 60)
    print("BlueBlock Anchor Contract Deployment")
    print("=" * 60)
    
    # Get Algod client
    print("\n1. Connecting to Algorand TestNet...")
    algod_client = get_algod_client()
    
    try:
        status = algod_client.status()
        print(f"   ✅ Connected to network (round: {status['last-round']})")
    except Exception as e:
        print(f"   ❌ Failed to connect: {e}")
        sys.exit(1)
    
    # Load or create account
    print("\n2. Loading deployer account...")
    address, private_key = load_or_create_account()
    
    # Check balance
    try:
        account_info = algod_client.account_info(address)
        balance = account_info['amount'] / 1_000_000  # Convert microAlgos to Algos
        print(f"   Account balance: {balance} ALGO")
        
        if balance < 0.5:
            print("   ⚠️  Warning: Low balance. You need at least 0.5 ALGO to deploy.")
            if balance == 0:
                print("\n   Please fund your account first:")
                print(f"   https://bank.testnet.algorand.network/?account={address}")
                sys.exit(1)
    except Exception as e:
        print(f"   ⚠️  Could not check balance: {e}")
    
    # Create contract instance
    print("\n3. Deploying smart contract...")
    contract = AnchorContract(algod_client)
    
    try:
        app_id = contract.create_app(address, private_key)
        print(f"   ✅ Contract deployed successfully!")
        print(f"   Application ID: {app_id}")
        print(f"   View on explorer: https://testnet.explorer.perawallet.app/application/{app_id}")
    except Exception as e:
        print(f"   ❌ Deployment failed: {e}")
        sys.exit(1)
    
    # Save deployment info
    print("\n4. Saving deployment information...")
    save_deployment_info(app_id, address, "testnet")
    
    print("\n" + "=" * 60)
    print("Deployment Complete! 🎉")
    print("=" * 60)
    print(f"\nApplication ID: {app_id}")
    print(f"Deployer: {address}")
    print(f"\nNext steps:")
    print("1. Update your .env.local with the app ID (if not auto-updated)")
    print("2. Test the contract with test_contract.py")
    print("3. Integrate with your Next.js app API routes")
    print("\n")

if __name__ == "__main__":
    main()
