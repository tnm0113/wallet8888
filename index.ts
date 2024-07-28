import { Keyring } from "@polkadot/keyring"
import { cryptoWaitReady, mnemonicGenerate } from "@polkadot/util-crypto"
import { HDNodeWallet } from "ethers";
import { appendFile } from "node:fs";
import 'dotenv/config';

function sleep(ms: number){
    return new Promise(resolve => setTimeout(resolve, ms))
}

function isMatchWith(address: string){
    if (process.env.POSTFIXS){
        for (let index = 0; index < process.env.POSTFIXS.length; index++) {
            const postfix = process.env.POSTFIXS[index];
            if (address.endsWith(postfix)){
                return true
            }
        }
    }
    return false
}

async function generate() {
    await cryptoWaitReady();

    while (true) {
        sleep(100);

        const mnemonic = mnemonicGenerate();

        if (process.env.SS58_ENABLE){
            const keyring = new Keyring({type: 'sr25519'});
            const substrateWallet = keyring.createFromUri(`${mnemonic}`);
            let substrateAddress = substrateWallet.address
            if (isMatchWith(substrateAddress)){
                appendFile("./result_substrate.txt", substrateAddress + "\n", err => {
                    if (err){
                        console.log(err)
                    }
                })
                appendFile("./result_substrate.txt", mnemonic + "\n", err => {
                    if (err){
                        console.log(err)
                    }
                })
            }
        }

        if (process.env.EVM_ENABLE) {
            let etherWallet = HDNodeWallet.fromPhrase(mnemonic);
            let evmAddress = etherWallet.address;
            if (isMatchWith(evmAddress)){
                appendFile("./result_evm.txt", evmAddress + "\n", err => {
                    if (err){
                        console.log(err)
                    }
                })
                appendFile("./result_evm.txt", mnemonic + "\n", err => {
                    if (err){
                        console.log(err)
                    }
                })
            }
        }
    }
}

generate()