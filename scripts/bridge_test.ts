import * as ethers from "ethers";
import * as dotenv from "dotenv";
dotenv.config();

const {createERCDepositData, expandDecimals} = require("./helper");

const BridgeContract = require("../artifacts/contracts/Bridge.sol/Bridge.json");
const url = process.env.SIDECHAIN_URL;
const bridge = "0xdD4063554b55f6550608831A2A698Fd07FF38d2e";
const dest = "99";
const privateKey = process.env.PRIVATE_KEY || '';
const recipient = "0xa1339b179e415550E7E20C859780E45c77752123";
const amount = "1";
const resourceid = "0x000000000000000000000000000000c76ebe4a02bbc34786d860b355f5a5ce00";

const main = async () => {
    const provider = new ethers.providers.JsonRpcProvider(url);
    const wallet = new ethers.Wallet(privateKey, provider);

    const bridgeInstance = new ethers.Contract(bridge, BridgeContract.abi, wallet);

    // for (let i = 0; i < 58; i ++) {
    //     console.log('loop', i);
        const tx = await bridgeInstance.deposit(
            dest,
            resourceid,
            createERCDepositData(
                expandDecimals(amount),
                20,
                recipient
            )
        );

        console.log('deposited ERC20 token', tx.hash);
    // }

}

main().then();

