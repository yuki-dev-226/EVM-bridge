import {JsonRpcProvider} from "@ethersproject/providers/src.ts/json-rpc-provider";

const ethers = require('ethers');

const toHex = (covertThis: Number, padding: Number) => {
    return ethers.utils.hexZeroPad(ethers.utils.hexlify(covertThis), padding);
};

const createERCDepositData = (tokenAmountOrID : Number, lenRecipientAddress: Number, recipientAddress: String) => {
    return '0x' +
        toHex(tokenAmountOrID, 32).substr(2) +          // Token amount or ID to deposit (32 bytes)
        toHex(lenRecipientAddress, 32).substr(2) +      // len(recipientAddress)          (32 bytes)
        recipientAddress.substr(2);                             // recipientAddress               (?? bytes)
};

const expandDecimals = (amount: Number, decimals: Number = 18) => {
    return ethers.utils.parseUnits(String(amount), decimals);
}

const createResourceID = (contractAddress: String, domainID: Number) => {
    return toHex(contractAddress + toHex(domainID, 1).substr(2), 32)
};

const waitForTx = async (provider: JsonRpcProvider, hash: string) => {
    console.log(`Waiting for tx: ${hash}...`)
    while (!await provider.getTransactionReceipt(hash)) {
        sleep(5000)
    }
}

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const parseUnit = (value: number, unit: string) => {
    return ethers.utils.parseUnits(
        Math.ceil(value) + '',
        unit
    )
}

module.exports = {
    expandDecimals,
    createResourceID,
    createERCDepositData,
    waitForTx,
    parseUnit
}
