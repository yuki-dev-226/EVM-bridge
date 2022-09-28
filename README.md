# ChainBridge Contracts for Newwit

ChainBridge is a modular multi-directional blockchain bridge supporting EVM and Substrate compatible chains. 
It allows users to transfer $WIS token between sidechain and whatever another chain.

## Architecture

In ChainBridge, there are three types of contracts called Bridge/Handler/Target in each chain and relayers to communicate between chains.

###Bridge contract
A Bridge contract that manages requests, votes, executions needs to be deployed in each chain. Users will call deposit in Bridge to start a transfer and Bridge delegates the process to Handler contract corresponding to Target contract. Once Handler contract has been successful in call Target contract, Bridge contract emits Deposit event to notify relayers.

###Handler contract
Handler contract interacts with Target contract to execute deposit or proposal. It validates the user's request, calls Target contract and manages deposit records and some settings for Target contract. There are some Handler contracts to call each Target contract that has a different interface. The indirect calls by Handler contract make the bridge enable to transfer whatever kind of assets or data.

Currently, there are three types of Handler contracts implemented by ChainBridge: ERC20Handler, ERC721Handler, and GenericHandler.

###Target contract
A contract that manages assets to be exchanged or processes messages to be transferred between chains.

###Relayer
Relayer is an application that monitors events from every chain and votes for a proposal in the Bridge contract of the destination chain when it receives Deposit event from a chain. A relayer calls a method in the Bridge contract to execute the proposal after the required number of votes are submitted. Bridge delegates execution to Handler contract.


## Requirement

- Node.js >= 16.13.0
- Git

## Accounts

| Type    | Description                                                                                                                                                                                                                                                                                 | 
|---------|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| admin   | The account that deploys Bridge contract. This account will be given admin role as default and will be able to do certain actions in Bridge. The admin account pays the gas fees when deploying contracts, registering resource IDs, updating settings in the contracts, or minting tokens. |
| relayer | The account used in the relayer to create transactions to vote or execute a proposal. The relayer accounts pay gas fees when sending transactions for voting and execution in the destination chain.                                                                                        |
| user    | The sender/recipient account that sends/receives assets. The sender account pays the gas fees when approving token transfers and calling deposit in the Bridge contract to begin a transfer.                                                                                                |

## Deploy Contracts
You will deploy required contracts to the sidechain and polygon mumbai testnet. 
```
// deploy all required contracts into the sidechain
$ yarn deploy:Contracts sidechain --chainid 100 --relayers 0x5356bDf68cdccB1a8c9219bD42ad50CbeeF7924a --threshold 1 
```

```
// deploy all required contracts into the polygon mumbai testnet.
$ yarn deploy:Contracts mumbai --chainid 99 --relayers 0x5356bDf68cdccB1a8c9219bD42ad50CbeeF7924a --threshold 1
```
Once the contracts have been deployed, you will get the following result:
```
Deploying contracts...
✓ Bridge contract deployed to: 0xA442F2001F951f4A5C358805aFB23d14f133B2da
✓ ERC20Handler contract deployed to: 0x0f6ee5791766c2B48f30c7B64F561a253Cd0f18b
✓ GenericHandler contract deployed to: 0x1F54e9F4fc60F4C990b76123fcACE3B93DA62a04
```

##Relayer Setup 
You will start a relayer to transfer tokens from one chain to another chain.
We need to clone and build the ChainBridge repository.

```
$ git clone https://github.com/ChainSafe/ChainBridge.git
$ cd chainBridge && make install
```
You need to create config.json and set JSON-RPC URLs, relayer address, and contracts address for each chain.
```
{
  "chains": [
    {
      "name": "mumbai",
      "type": "ethereum",
      "id": "99",
      "endpoint": "https://rpc-mumbai.matic.today",
      "from": "<RELAYER_ACCOUNT_ADDRESS>",
      "opts": {
        "bridge": "<BRIDGE_CONTRACT_ADDRESS>",
        "erc20Handler": "<ERC20_HANDLER_CONTRACT_ADDRESS>",        
        "genericHandler": "<GENERIC_HANDLER_CONTRACT_ADDRESS>",
        "minGasPrice": "1",
        "http": "true"
      }
    },
    {
      "name": "polygon-edge",
      "type": "ethereum",
      "id": "100",
      "endpoint": "http://54.179.2.21:8545/",
      "from": "<RELAYER_ACCOUNT_ADDRESS>",
      "opts": {
        "bridge": "<BRIDGE_CONTRACT_ADDRESS>",
        "erc20Handler": "<ERC20_HANDLER_CONTRACT_ADDRESS>",        
        "genericHandler": "<GENERIC_HANDLER_CONTRACT_ADDRESS>",
        "minGasPrice": "1",
        "http": "true"
      }
    }
  ]
}
```

To start a relayer, you need to import the private key corresponding to the relayer account address. 
```
$ chainbridge accounts import --privateKey [RELAYER_ACCOUNT_PRIVATE_KEY]
```

Then, you can start the relayer. You will need to input the same password when you inputted to store the key in the beginning.

```
$ chainbridge --config config.json --latest
```

##WIS Token Transfer
###Register resource ID
Firstly, you will register a resource ID that associates resources in a cross-chain environment. A Resource ID is a 32-byte value that must be unique to the resource that we are transferring between these blockchains. The Resource IDs are arbitrary, but they may have the chain ID of the home chain in the last byte, as a convention (home chain referring to the network on which these resources originated from).
```
// generate resourece id
$ yarn generate:ResourceId --contract CONTRACT_ADDRESS --chainid CHAIN_ID
```

```
// reigster resource id into the sidechain
$ yarn register:Resource --url http://54.179.2.21:8545/ --resourceid RESOURCE_ID --bridge BRIDGE_CONTRACT_ADDRESS --handler ERC20_HANDLER_CONTRACT_ADDRESS --token WIS_TOKEN_CONTRACT_ADDRESS
```

```
// reigster resource id into the polygon mumbai testnet
$ yarn register:Resource --url https://rpc-mumbai.matic.today/ --resourceid RESOURCE_ID --bridge BRIDGE_CONTRACT_ADDRESS --handler ERC20_HANDLER_CONTRACT_ADDRESS --token WIS_TOKEN_CONTRACT_ADDRESS
```

###(Optional) Make contracts mintable/burnable
When transferring ERC20 tokens between chains, tokens can be processed in two different modes:

(1) Lock/Release mode

Source chain: The tokens you are sending will be locked in the ERC20 Handler Contract
Destination chain: The same amount of tokens as you sent in the source chain would be unlocked and transferred from the ERC20 Handler contract to the recipient account in the destination chain.

(2) Burn/Mint mode

Source chain: The tokens you are sending will be burned
Destination chain: The same amount of tokens as you sent and burned on the source chain will be minted on the destination chain and sent to the recipient account.

You can use different modes in each chain. It means that you can lock an ERC20 token in the main chain while minting an ERC20 token in the subchain for transfer. For instance, it may make sense to lock/release tokens if the total supply or mint schedule is controlled. Tokens would be minted/burned if the contract in the sub chain has to follow the supply in the main chain.

The default mode is lock/release mode. If you want to make the Tokens mintable/burnable, you need to call adminSetBurnable method. If you want to mint tokens on execution, you will need to grant minter role to the ERC20 Handler contract.
```
// Let WIS contract burn and mint on the mumbai testnet
$ yarn set:Burn --url https://rpc-mumbai.matic.today/ --bridge BRIDGE_CONTRACT_ADDRESS --handler ERC20_HANDLER_CONTRACT_ADDRESS --token WIS_TOKEN_CONTRACT_ADDRESS
```

```
// Grant minter role to ERC20 Handler contract on the mumbai testnet
$ yarn add:Minter --url https://rpc-mumbai.matic.today/ --minter ERC20_HANDLER_CONTRACT_ADDRESS --token WIS_TOKEN_CONTRACT_ADDRESS
```

Transfer WIS Token
```
// Approve the hanlder address to spend WIS tokens from the sender  
$ yarn approve:ERC20 --url https://rpc-mumbai.matic.today/ --privatekey SENDER_PRIVATE_KEY --recipient ERC20_HANDLER_CONTRACT_ADDRESS --token WIS_TOKEN_CONTRACT_ADDRESS --amount WIS_TOKEN_AMOUNT
```

```
// Transfer WIS Token from sidechain to the polygon mumbai testnet  
$ yarn deposit:ERC20 --url http://54.179.2.21:8545/  --privatekey SENDER_PRIVATE_KEY --dest DESTINATION_CHAINID --bridge BRIDGE_CONTRACT_ADDRESS --recipient RECIPIENT_ADDRESS --amount WIS_TOKEN_AMOUNT
```
