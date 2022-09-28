import {task} from "hardhat/config";
import {TaskArguments} from "hardhat/types";

const {
    createResourceID,
    expandDecimals,
    waitForTx,
    parseUnit,
} = require("./helper");

task("generate:ResourceId", "Generate resource Id")
    .addParam('contract', 'Contract Address')
    .addParam('chainid', 'chain ID')
    .setAction(async function (
    taskArguments: TaskArguments, hre
) {
    const BridgeContract = require("../artifacts/contracts/Bridge.sol/Bridge.json");
    const {contract, chainid} = taskArguments;
    console.log('Resource Id', createResourceID(contract, Number(chainid)));
})

task("register:Resource", "Register a resource ID with a contract address for a handler")
    .addParam('url', "Chain RPC URL")
    .addParam('resourceid', 'Resource ID')
    .addParam('bridge', "Bridget Contract Address")
    .addParam('handler', "ERC20 Handler Contract Address")
    .addParam('token', "WIS Token Contract Address")
    .addOptionalParam('maxFeePerGas', 'maxFeePerGas')
    .addOptionalParam('maxPriorityFeePerGas', 'maxPriorityFeePerGas')
    .setAction(async function (taskArguments: TaskArguments, hre
    ) {
        const BridgeContract = require("../artifacts/contracts/Bridge.sol/Bridge.json");
        const {url, resourceid, bridge, handler, token, maxFeePerGas, maxPriorityFeePerGas} = taskArguments;
        const provider = new hre.ethers.providers.JsonRpcProvider(url);
        const wallet = new hre.ethers.Wallet(process.env.PRIVATE_KEY || "", provider);

        const instance = new hre.ethers.Contract(bridge, BridgeContract.abi, wallet);

        const tx = await instance.adminSetResource(handler, resourceid, token, {
                maxFeePerGas: maxFeePerGas ? parseUnit(maxFeePerGas, 'gwei') : undefined,
                maxPriorityFeePerGas: maxPriorityFeePerGas ? parseUnit(maxPriorityFeePerGas, 'gwei') : undefined
            }
        );

        console.log(`Registering contract ${token} with resource Id ${resourceid} on handler ${handler}`);

        await waitForTx(provider, tx.hash);
        console.log(`Transaction ${tx.hash} complete!`)
    });

task("register:GenericResource", "Register a resource ID with a generic handler")
    .addParam('url', "Chain RPC URL")
    .addParam('resourceid', 'Resource ID')
    .addParam('bridge', "Bridget Contract Address")
    .addParam('handler', "ERC20 Handler Contract Address")
    .addParam('token', "WIS Token Contract Address")
    .addOptionalParam('maxFeePerGas', 'maxFeePerGas')
    .addOptionalParam('maxPriorityFeePerGas', 'maxPriorityFeePerGas')
    .setAction(async function (taskArguments: TaskArguments, hre
    ) {
        const BridgeContract = require("../artifacts/contracts/Bridge.sol/Bridge.json");
        const {url, resourceid, bridge, handler, token, maxFeePerGas, maxPriorityFeePerGas} = taskArguments;
        const provider = new hre.ethers.providers.JsonRpcProvider(url);
        const wallet = new hre.ethers.Wallet(process.env.PRIVATE_KEY || "", provider);

        const instance = new hre.ethers.Contract(bridge, BridgeContract.abi, wallet);

        const tx = await instance.adminSetResource(handler, resourceid, token, {
            maxFeePerGas: maxFeePerGas ? parseUnit(maxFeePerGas, 'gwei') : undefined,
            maxPriorityFeePerGas: maxPriorityFeePerGas ? parseUnit(maxPriorityFeePerGas, 'gwei') : undefined
        });

        console.log(`Registering contract ${token} with resource Id ${resourceid} on handler ${handler}`);

        await waitForTx(provider, tx.hash);
        console.log(`Transaction ${tx.hash} complete!`)
    });

task("set:Burn", "Set a token contract as burnable in a handler")
    .addParam('url', "Chain RPC URL")
    .addParam('bridge', "Bridget Contract Address")
    .addParam('handler', "ERC20 Handler Contract Address")
    .addParam('token', "WIS Token Contract Address")
    .addOptionalParam('maxFeePerGas', 'maxFeePerGas')
    .addOptionalParam('maxPriorityFeePerGas', 'maxPriorityFeePerGas')
    .setAction(async function (taskArguments: TaskArguments, hre
    ) {
        const BridgeContract = require("../artifacts/contracts/Bridge.sol/Bridge.json");
        const {url, bridge, handler, token, maxFeePerGas, maxPriorityFeePerGas} = taskArguments

        const provider = new hre.ethers.providers.JsonRpcProvider(url);
        const wallet = new hre.ethers.Wallet(process.env.PRIVATE_KEY || "", provider);

        const instance = new hre.ethers.Contract(bridge, BridgeContract.abi, wallet);

        const tx = await instance.adminSetBurnable(handler, token, {
            maxFeePerGas: maxFeePerGas ? parseUnit(maxFeePerGas, 'gwei') : undefined,
            maxPriorityFeePerGas: maxPriorityFeePerGas ? parseUnit(maxPriorityFeePerGas, 'gwei') : undefined
        });

        console.log(`set contract ${token} as burnable at`, tx.hash);

        await waitForTx(provider, tx.hash);
        console.log(`Transaction ${tx.hash} complete!`)
    });

