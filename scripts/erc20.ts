import {task} from "hardhat/config";
import {TaskArguments} from "hardhat/types";

const {
    createERCDepositData,
    expandDecimals,
    waitForTx,
    parseUnit
} = require("./helper");

task("add:Minter", "Add a new minter to the contract")
    .addParam('url', "Chain RPC URL")
    .addParam('minter', "ERC20 Handler Contract Address")
    .addParam('token', "WIS Token Contract Address")
    .addOptionalParam('maxFeePerGas', 'maxFeePerGas')
    .addOptionalParam('maxPriorityFeePerGas', 'maxPriorityFeePerGas')
    .setAction(async function (taskArguments: TaskArguments, hre
    ) {
        const ERC20Contract = require("../artifacts/contracts/ERC20Custom.sol/ERC20Custom.json");
        const {url, minter, token, maxFeePerGas, maxPriorityFeePerGas} = taskArguments

        const provider = new hre.ethers.providers.JsonRpcProvider(url);
        const wallet = new hre.ethers.Wallet(process.env.PRIVATE_KEY || "", provider);

        const instance = new hre.ethers.Contract(token, ERC20Contract.abi, wallet);
        const MINTER_ROLE = await instance.MINTER_ROLE();

        console.log(`Adding ${minter} as a minter ${MINTER_ROLE} on contract ${token}`);
        const tx = await instance.grantRole(MINTER_ROLE, minter, {
            maxFeePerGas: maxFeePerGas ? parseUnit(maxFeePerGas, 'gwei') : undefined,
            maxPriorityFeePerGas: maxPriorityFeePerGas ? parseUnit(maxPriorityFeePerGas, 'gwei') : undefined
        });
        await waitForTx(provider, tx.hash);
        console.log(`Transaction ${tx.hash} complete!`)
    });

task("approve:ERC20", "Approve tokens for transfer")
    .addParam('url', "Chain RPC URL")
    .addParam('privatekey', "Private key of the sender account")
    .addParam('token', "WiS Token Contract Address")
    .addParam('recipient', "ERC20 Handler Contract Address")
    .addParam('amount', "Amount to transfer")
    .addOptionalParam('maxFeePerGas', 'maxFeePerGas')
    .addOptionalParam('maxPriorityFeePerGas', 'maxPriorityFeePerGas')
    .setAction(async function (taskArguments: TaskArguments, hre
    ) {
        const ERC20Contract = require("../artifacts/contracts/ERC20Custom.sol/ERC20Custom.json");
        const {url, privatekey, token, recipient, amount, maxFeePerGas, maxPriorityFeePerGas} = taskArguments

        const provider = new hre.ethers.providers.JsonRpcProvider(url);
        const wallet = new hre.ethers.Wallet(privatekey, provider);

        const instance = new hre.ethers.Contract(token, ERC20Contract.abi, wallet);

        console.log(`Approving ${recipient} to spend ${amount} tokens from ${wallet.address}`);
        const tx = await instance.approve(recipient, expandDecimals(amount), {
            maxFeePerGas: maxFeePerGas ? parseUnit(maxFeePerGas, 'gwei') : undefined,
            maxPriorityFeePerGas: maxPriorityFeePerGas ? parseUnit(maxPriorityFeePerGas, 'gwei') : undefined
        });

        await waitForTx(provider, tx.hash);
        console.log(`Transaction ${tx.hash} complete!`)
    });

task("deposit:ERC20", "deposit ERC20 token")
    .addParam('url', "Chain RPC URL")
    .addParam('privatekey', "Private key of the sender account")
    .addParam('dest', "destination Chain Id")
    .addParam('bridge', "Bridge Contract Address")
    .addParam('recipient', 'Destination recipient address')
    .addParam('amount', 'Amount to transfer')
    .addParam('resourceid', 'Resource Id')
    .addOptionalParam('maxFeePerGas', 'maxFeePerGas')
    .addOptionalParam('maxPriorityFeePerGas', 'maxPriorityFeePerGas')
    .setAction(async function (taskArguments: TaskArguments, hre
    ) {
        const BridgeContract = require("../artifacts/contracts/Bridge.sol/Bridge.json");
        const {url, privatekey, dest, bridge, recipient, amount, resourceid, maxFeePerGas, maxPriorityFeePerGas} = taskArguments

        const provider = new hre.ethers.providers.JsonRpcProvider(url);
        const wallet = new hre.ethers.Wallet(privatekey, provider);

        const bridgeInstance = new hre.ethers.Contract(bridge, BridgeContract.abi, wallet);

        console.log('params', maxFeePerGas, maxPriorityFeePerGas)

        const tx = await bridgeInstance.deposit(dest,
            resourceid,
            createERCDepositData(
                expandDecimals(amount),
                20,
                recipient
            ), {
                maxFeePerGas: maxFeePerGas ? parseUnit(maxFeePerGas, 'gwei') : undefined,
                maxPriorityFeePerGas: maxPriorityFeePerGas ? parseUnit(maxPriorityFeePerGas, 'gwei') : undefined
            });

        console.log('deposited ERC20 token', tx.hash);
        await waitForTx(provider, tx.hash);
        console.log(`Transaction ${tx.hash} complete!`)
    });

task("balance:ERC20", "Get the balance for an account")
    .addParam('url', "Chain RPC URL")
    .addParam('privatekey', "Private key of the sender account")
    .addParam('address', "ERC20 contract address")
    .addParam('token', "")
    .addOptionalParam('maxFeePerGas', 'maxFeePerGas')
    .addOptionalParam('maxPriorityFeePerGas', 'maxPriorityFeePerGas')
    .setAction(async function (taskArguments: TaskArguments, hre
    ) {
        const ERC20Contract = require("../artifacts/contracts/ERC20Custom.sol/ERC20Custom.json");
        const {url, privatekey, address, token, maxFeePerGas, maxPriorityFeePerGas} = taskArguments

        const provider = new hre.ethers.providers.JsonRpcProvider(url);
        const wallet = new hre.ethers.Wallet(privatekey, provider);

        const instance = new hre.ethers.Contract(token, ERC20Contract.abi, wallet);

        const balance = await instance.balanceOf(address, {
            maxFeePerGas: maxFeePerGas ? parseUnit(maxFeePerGas, 'gwei') : undefined,
            maxPriorityFeePerGas: maxPriorityFeePerGas ? parseUnit(maxPriorityFeePerGas, 'gwei') : undefined
        });

        console.log(`Account ${address} has a balance of ${expandDecimals(balance)}`);
    });

task("allowance:ERC20", "Get the allowance of a spender for an address")
    .addParam('url', "Chain RPC URL")
    .addParam('privatekey', "Private key of the sender account")
    .addParam('spender', "Address of spender")
    .addParam('owner', "Address of token owner")
    .addParam('token', "ERC20 contract address")
    .addOptionalParam('maxFeePerGas', 'maxFeePerGas')
    .addOptionalParam('maxPriorityFeePerGas', 'maxPriorityFeePerGas')
    .setAction(async function (taskArguments: TaskArguments, hre
    ) {
        const ERC20Contract = require("../artifacts/contracts/ERC20Custom.sol/ERC20Custom.json");
        const {url, privatekey, spender, owner, token, maxFeePerGas, maxPriorityFeePerGas} = taskArguments

        const provider = new hre.ethers.providers.JsonRpcProvider(url);
        const wallet = new hre.ethers.Wallet(privatekey, provider);

        const instance = new hre.ethers.Contract(token, ERC20Contract.abi, wallet);

        const balance = await instance.allowance(owner, spender, {
            maxFeePerGas: maxFeePerGas ? parseUnit(maxFeePerGas, 'gwei') : undefined,
            maxPriorityFeePerGas: maxPriorityFeePerGas ? parseUnit(maxPriorityFeePerGas, 'gwei') : undefined
        });

        console.log(`Spender ${spender} is allowed to spend ${expandDecimals(balance)} tokens behalf of ${owner}`);
    });
