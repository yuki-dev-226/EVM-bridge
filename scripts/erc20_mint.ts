import * as ethers from "ethers";
import * as dotenv from "dotenv";
dotenv.config();

const {expandDecimals} = require("./helper");

const ERC20Contract = require("../artifacts/contracts/ERC20Custom.sol/ERC20Custom.json");
const url = process.env.POLYGON_URL;
const polygon_address = "0x59d31da327ea624f8Eea89B4D60f33769b941043";
const mumbai_address = "0xAc075764F066a3418faD7E78E3d809ABBdE3b6D4";
const ropsten_address = "0x59d31da327ea624f8Eea89B4D60f33769b941043";
const privateKey = process.env.PRIVATE_KEY || '';


const main = async () => {
    const provider = new ethers.providers.JsonRpcProvider(url);
    const wallet = new ethers.Wallet(privateKey, provider);

    const erc20Instance = new ethers.Contract(polygon_address, ERC20Contract.abi, wallet);
    console.log('wallet', wallet.address);

    // const tx = await erc20Instance.mint(
    //     wallet.address,
    //     expandDecimals(5000)
    // );

    const tx = await erc20Instance.getRoleMemberCount('0x0000000000000000000000000000000000000000000000000000000000000000');

    console.log('deposited ERC20 token', tx);


}

main().then();

