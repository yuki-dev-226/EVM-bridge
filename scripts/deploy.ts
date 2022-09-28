import {task} from "hardhat/config";
import {TaskArguments} from "hardhat/types";


task("deploy:Contracts", "Deploy Bridge Smart Contract")
    .addParam('chainid', 'Chain Id')
    .addParam('relayers', 'Relayer Account Address')
    .addParam('threshold', 'Relayer Threshold')
    .setAction(async function (
        taskArguments: TaskArguments, hre
    ) {
        console.log("Deploying contracts...")
        const {chainid, relayers, threshold} = taskArguments

        // deploy bridge contract
        const BridgeFactory = await hre.ethers.getContractFactory("Bridge");
        const bridge = await BridgeFactory.deploy(
            Number(chainid),
            [relayers],
            threshold,
            0,
            100,
        );
        await bridge.deployed();

        console.log("✓ Bridge contract deployed to:", bridge.address);

        const ERC20HandlerFactory = await hre.ethers.getContractFactory("ERC20Handler");
        const erc20Handler = await ERC20HandlerFactory.deploy(
            bridge.address,
            [],
            [],
            []
        );
        await erc20Handler.deployed();

        console.log("✓ ERC20Handler contract deployed to:", erc20Handler.address);

        // const ERC721HandlerFactory = await hre.ethers.getContractFactory("ERC721Handler");
        // const erc721Handler = await ERC721HandlerFactory.deploy(
        //     bridge.address,
        //     [],
        //     [],
        //     []
        // );
        // await erc721Handler.deployed();
        //
        // console.log("✓ ERC721Handler contract deployed to:", erc721Handler.address);

        const GenericHandlerFactory = await hre.ethers.getContractFactory("GenericHandler");
        const genericHandler = await GenericHandlerFactory.deploy(
            bridge.address,
            [],
            [],
            [],
            []
        );
        await genericHandler.deployed();

        console.log("✓ GenericHandler contract deployed to:", genericHandler.address);
    });

