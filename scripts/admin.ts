import {task} from "hardhat/config";
import {TaskArguments} from "hardhat/types";
import {ADMIN_ROLE} from "./params";

const {
    waitForTx,
    parseUnit
} = require("./helper");

task("is:Relayer", "Check if address is relayer")
    .addParam('url', "Chain RPC URL")
    .addParam('relayer', "Address to check")
    .addParam('bridge', "Bridge contract address")
    .addOptionalParam('maxFeePerGas', 'maxFeePerGas')
    .addOptionalParam('maxPriorityFeePerGas', 'maxPriorityFeePerGas')
    .setAction(async function (taskArguments: TaskArguments, hre
    ) {
        const BridgeContract = require("../artifacts/contracts/Bridge.sol/Bridge.json");
        const {url, relayer, bridge, maxFeePerGas, maxPriorityFeePerGas} = taskArguments

        const provider = new hre.ethers.providers.JsonRpcProvider(url);
        const wallet = new hre.ethers.Wallet(process.env.PRIVATE_KEY || "", provider);

        const instance = new hre.ethers.Contract(bridge, BridgeContract.abi, wallet);

        const res = await instance.isRelayer(relayer, {
            maxFeePerGas: maxFeePerGas ? parseUnit(maxFeePerGas, 'gwei') : undefined,
            maxPriorityFeePerGas: maxPriorityFeePerGas ? parseUnit(maxPriorityFeePerGas, 'gwei') : undefined
        });
        console.log(`Address ${relayer} ${res ? "is" : "is not"} a relayer.`)
    });

task("add:Admin", "Adds an admin")
    .addParam('url', "Chain RPC URL")
    .addParam('admin', "Address of admin")
    .addParam('bridge', "Bridge contract address")
    .addOptionalParam('maxFeePerGas', 'maxFeePerGas')
    .addOptionalParam('maxPriorityFeePerGas', 'maxPriorityFeePerGas')
    .setAction(async function (taskArguments: TaskArguments, hre
    ) {
        const BridgeContract = require("../artifacts/contracts/Bridge.sol/Bridge.json");
        const {url, admin, bridge, maxFeePerGas, maxPriorityFeePerGas} = taskArguments

        const provider = new hre.ethers.providers.JsonRpcProvider(url);
        const wallet = new hre.ethers.Wallet(process.env.PRIVATE_KEY || "", provider);

        const instance = new hre.ethers.Contract(bridge, BridgeContract.abi, wallet);

        console.log(`Adding ${admin} as a admin`);
        const tx = await instance.grantRole(
            ADMIN_ROLE,
            admin, {
                maxFeePerGas: maxFeePerGas ? parseUnit(maxFeePerGas, 'gwei') : undefined,
                maxPriorityFeePerGas: maxPriorityFeePerGas ? parseUnit(maxPriorityFeePerGas, 'gwei') : undefined
            });
        await waitForTx(provider, tx.hash);
    });

task("remove:Admin", "Remove a admin")
    .addParam('url', "Chain RPC URL")
    .addParam('admin', "Address of admin")
    .addParam('bridge', "Bridge contract address")
    .addOptionalParam('maxFeePerGas', 'maxFeePerGas')
    .addOptionalParam('maxPriorityFeePerGas', 'maxPriorityFeePerGas')
    .setAction(async function (taskArguments: TaskArguments, hre
    ) {
        const BridgeContract = require("../artifacts/contracts/Bridge.sol/Bridge.json");
        const {url, admin, bridge, maxFeePerGas, maxPriorityFeePerGas} = taskArguments

        const provider = new hre.ethers.providers.JsonRpcProvider(url);
        const wallet = new hre.ethers.Wallet(process.env.PRIVATE_KEY || "", provider);

        const instance = new hre.ethers.Contract(bridge, BridgeContract.abi, wallet);

        console.log(`Removing ${admin} as a admin`);
        const tx = await instance.revokeRole(
            ADMIN_ROLE,
            admin
            , {
                maxFeePerGas: maxFeePerGas ? parseUnit(maxFeePerGas, 'gwei') : undefined,
                maxPriorityFeePerGas: maxPriorityFeePerGas ? parseUnit(maxPriorityFeePerGas, 'gwei') : undefined
            });

        await waitForTx(provider, tx.hash);
        console.log(`Transaction ${tx.hash} complete!`)
    });

task("add:Relayer", "Add a relayer")
    .addParam('url', "Chain RPC URL")
    .addParam('relayer', "Address of relayer")
    .addParam('bridge', "Bridge contract address")
    .addOptionalParam('maxFeePerGas', 'maxFeePerGas')
    .addOptionalParam('maxPriorityFeePerGas', 'maxPriorityFeePerGas')
    .setAction(async function (taskArguments: TaskArguments, hre
    ) {
        const BridgeContract = require("../artifacts/contracts/Bridge.sol/Bridge.json");
        const {url, relayer, bridge, maxFeePerGas, maxPriorityFeePerGas} = taskArguments

        const provider = new hre.ethers.providers.JsonRpcProvider(url);
        const wallet = new hre.ethers.Wallet(process.env.PRIVATE_KEY || "", provider);

        const instance = new hre.ethers.Contract(bridge, BridgeContract.abi, wallet);

        console.log(`Adding ${relayer} as a relayer`);
        const tx = await instance.adminAddRelayer(relayer, {
            maxFeePerGas: maxFeePerGas ? parseUnit(maxFeePerGas, 'gwei') : undefined,
            maxPriorityFeePerGas: maxPriorityFeePerGas ? parseUnit(maxPriorityFeePerGas, 'gwei') : undefined
        });
        await waitForTx(provider, tx.hash);
    });

task("remove:Relayer", "Remove a relayer")
    .addParam('url', "Chain RPC URL")
    .addParam('relayer', "Address of relayer")
    .addParam('bridge', "Bridge contract address")
    .addOptionalParam('maxFeePerGas', 'maxFeePerGas')
    .addOptionalParam('maxPriorityFeePerGas', 'maxPriorityFeePerGas')
    .setAction(async function (taskArguments: TaskArguments, hre
    ) {
        const BridgeContract = require("../artifacts/contracts/Bridge.sol/Bridge.json");
        const {url, relayer, bridge, maxFeePerGas, maxPriorityFeePerGas} = taskArguments

        const provider = new hre.ethers.providers.JsonRpcProvider(url);
        const wallet = new hre.ethers.Wallet(process.env.PRIVATE_KEY || "", provider);

        const instance = new hre.ethers.Contract(bridge, BridgeContract.abi, wallet);

        console.log(`Removing relayer ${relayer}`);
        const tx = await instance.adminRemoveRelayer(
            relayer
            , {
                maxFeePerGas: maxFeePerGas ? parseUnit(maxFeePerGas, 'gwei') : undefined,
                maxPriorityFeePerGas: maxPriorityFeePerGas ? parseUnit(maxPriorityFeePerGas, 'gwei') : undefined
            });

        await waitForTx(provider, tx.hash);
        console.log(`Transaction ${tx.hash} complete!`)
    });

task("set:Threshold", "Set relayer threshold")
    .addParam('url', "Chain RPC URL")
    .addParam('bridge', "Bridge contract address")
    .addParam('threshold', "New relayer threshold")
    .addOptionalParam('maxFeePerGas', 'maxFeePerGas')
    .addOptionalParam('maxPriorityFeePerGas', 'maxPriorityFeePerGas')
    .setAction(async function (taskArguments: TaskArguments, hre
    ) {
        const BridgeContract = require("../artifacts/contracts/Bridge.sol/Bridge.json");
        const {url, bridge, threshold, maxFeePerGas, maxPriorityFeePerGas} = taskArguments

        const provider = new hre.ethers.providers.JsonRpcProvider(url);
        const wallet = new hre.ethers.Wallet(process.env.PRIVATE_KEY || "", provider);

        const instance = new hre.ethers.Contract(bridge, BridgeContract.abi, wallet);

        console.log(`Setting relayer threshold to  ${threshold}`);
        const tx = await instance.adminChangeRelayerThreshold(
            threshold
            , {
                maxFeePerGas: maxFeePerGas ? parseUnit(maxFeePerGas, 'gwei') : undefined,
                maxPriorityFeePerGas: maxPriorityFeePerGas ? parseUnit(maxPriorityFeePerGas, 'gwei') : undefined
            });

        await waitForTx(provider, tx.hash);
        console.log(`Transaction ${tx.hash} complete!`)
    });

task("pause:Transfers", "Pause deposits and proposal on the bridge")
    .addParam('url', "Chain RPC URL")
    .addParam('bridge', "Bridge contract address")
    .addOptionalParam('maxFeePerGas', 'maxFeePerGas')
    .addOptionalParam('maxPriorityFeePerGas', 'maxPriorityFeePerGas')
    .setAction(async function (taskArguments: TaskArguments, hre
    ) {
        const BridgeContract = require("../artifacts/contracts/Bridge.sol/Bridge.json");
        const {url, bridge, maxFeePerGas, maxPriorityFeePerGas} = taskArguments

        const provider = new hre.ethers.providers.JsonRpcProvider(url);
        const wallet = new hre.ethers.Wallet(process.env.PRIVATE_KEY || "", provider);

        const instance = new hre.ethers.Contract(bridge, BridgeContract.abi, wallet);

        console.log(`Pausing deposits and proposals`);

        const tx = await instance.adminPauseTransfers({
            maxFeePerGas: maxFeePerGas ? parseUnit(maxFeePerGas, 'gwei') : undefined,
            maxPriorityFeePerGas: maxPriorityFeePerGas ? parseUnit(maxPriorityFeePerGas, 'gwei') : undefined
        });

        await waitForTx(provider, tx.hash);
        console.log(`Transaction ${tx.hash} complete!`)
    });

task("unpause:Transfers", "Unpause deposits and proposals on the bridge")
    .addParam('url', "Chain RPC URL")
    .addParam('bridge', "Bridge contract address")
    .addOptionalParam('maxFeePerGas', 'maxFeePerGas')
    .addOptionalParam('maxPriorityFeePerGas', 'maxPriorityFeePerGas')
    .setAction(async function (taskArguments: TaskArguments, hre
    ) {
        const BridgeContract = require("../artifacts/contracts/Bridge.sol/Bridge.json");
        const {url, bridge, maxFeePerGas, maxPriorityFeePerGas} = taskArguments

        const provider = new hre.ethers.providers.JsonRpcProvider(url);
        const wallet = new hre.ethers.Wallet(process.env.PRIVATE_KEY || "", provider);

        const instance = new hre.ethers.Contract(bridge, BridgeContract.abi, wallet);

        console.log(`Unpausing deposits and proposals`);

        const tx = await instance.adminUnpauseTransfers({
            maxFeePerGas: maxFeePerGas ? parseUnit(maxFeePerGas, 'gwei') : undefined,
            maxPriorityFeePerGas: maxPriorityFeePerGas ? parseUnit(maxPriorityFeePerGas, 'gwei') : undefined
        });

        await waitForTx(provider, tx.hash);
        console.log(`Transaction ${tx.hash} complete!`)
    });

task("set:Fee", "Set a new fee for deposits")
    .addParam('url', "Chain RPC URL")
    .addParam('bridge', "Bridge contract address")
    .addParam('fee', "New fee (in wei)")
    .addOptionalParam('maxFeePerGas', 'maxFeePerGas')
    .addOptionalParam('maxPriorityFeePerGas', 'maxPriorityFeePerGas')
    .setAction(async function (taskArguments: TaskArguments, hre
    ) {
        const BridgeContract = require("../artifacts/contracts/Bridge.sol/Bridge.json");
        const {url, bridge, fee, maxFeePerGas, maxPriorityFeePerGas} = taskArguments

        const provider = new hre.ethers.providers.JsonRpcProvider(url);
        const wallet = new hre.ethers.Wallet(process.env.PRIVATE_KEY || "", provider);

        const instance = new hre.ethers.Contract(bridge, BridgeContract.abi, wallet);

        console.log(`Setting fee to ${fee} wei`);

        const tx = await instance.adminChangeFee(fee, {
            maxFeePerGas: maxFeePerGas ? parseUnit(maxFeePerGas, 'gwei') : undefined,
            maxPriorityFeePerGas: maxPriorityFeePerGas ? parseUnit(maxPriorityFeePerGas, 'gwei') : undefined
        });

        await waitForTx(provider, tx.hash);
        console.log(`Transaction ${tx.hash} complete!`)
    });

task("withdrawal", "Withdraw funds collected from fees")
    .addParam('url', "Chain RPC URL")
    .addParam('bridge', "Bridge contract address")
    .addParam('handler', "Handler contract address")
    .addParam('token', "ERC20 or ERC721 token contract address")
    .addParam('recipient', "Address to withdraw to")
    .addParam('amountOrId', "Token ID or amount to withdraw")
    .addOptionalParam('maxFeePerGas', 'maxFeePerGas')
    .addOptionalParam('maxPriorityFeePerGas', 'maxPriorityFeePerGas')
    .setAction(async function (taskArguments: TaskArguments, hre
    ) {
        const BridgeContract = require("../artifacts/contracts/Bridge.sol/Bridge.json");
        const {url, bridge, handler, token, recipient, amountOrId, maxFeePerGas, maxPriorityFeePerGas} = taskArguments

        const provider = new hre.ethers.providers.JsonRpcProvider(url);
        const wallet = new hre.ethers.Wallet(process.env.PRIVATE_KEY || "", provider);

        const instance = new hre.ethers.Contract(bridge, BridgeContract.abi, wallet);

        console.log(`Withdrawing tokens (${amountOrId}) in contract ${token} to recipient ${recipient}`);

        const tx = await instance.adminWithdraw(handler, token, recipient, amountOrId, {
            maxFeePerGas: maxFeePerGas ? parseUnit(maxFeePerGas, 'gwei') : undefined,
            maxPriorityFeePerGas: maxPriorityFeePerGas ? parseUnit(maxPriorityFeePerGas, 'gwei') : undefined
        });

        await waitForTx(provider, tx.hash);
        console.log(`Transaction ${tx.hash} complete!`)
    });
