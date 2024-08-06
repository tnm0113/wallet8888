import { Keyring } from "@polkadot/keyring"
import { cryptoWaitReady, mnemonicGenerate } from "@polkadot/util-crypto"
import { HDNodeWallet } from "ethers";
import { appendFileSync } from "node:fs";
import { Account } from "@aptos-labs/ts-sdk";
import 'dotenv/config';

function sleep(ms: number){
    return new Promise(resolve => setTimeout(resolve, ms))
}

function isMatchWith(address: string){
    if (process.env.POSTFIXS){
        let postfixs = process.env.POSTFIXS.split(" ");
        for (let index = 0; index < postfixs.length; index++) {
            const postfix = postfixs[index];
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

        const seperate = "==========================================="

        if (process.env.SS58_ENABLE){
            const keyring = new Keyring({type: 'sr25519'});
            const substrateWallet = keyring.createFromUri(`${mnemonic}`);
            let substrateAddress = substrateWallet.address
            console.log("substrate ", substrateAddress)
            if (isMatchWith(substrateAddress)){
                console.log("**************FOUND SUBSTRATE****************")
                appendFileSync("result_substrate.txt", seperate + "\n" )
                appendFileSync("result_substrate.txt", substrateWallet.address + "\n" )
                appendFileSync("result_substrate.txt", mnemonic + "\n")
            }
        }

        if (process.env.EVM_ENABLE) {
            let etherWallet = HDNodeWallet.fromPhrase(mnemonic);
            let evmAddress = etherWallet.address;
            console.log("evm ", evmAddress)
            if (isMatchWith(evmAddress)){
                console.log("**************FOUND EVM****************")
                appendFileSync("result_substrate.txt", seperate + "\n" )
                appendFileSync("result_evm.txt", etherWallet.address + "\n")
                appendFileSync("result_evm.txt", mnemonic + "\n")
            }
        }

        if (process.env.APTOS_ENABLE) {
            const path = "m/44'/637'/0'/0'/0";
            const account = Account.fromDerivationPath({ path, mnemonic });
            let address = account.accountAddress.toString();
            console.log("evm ", address)
            if (isMatchWith(address)){
                console.log("**************FOUND APTOS****************")
                appendFileSync("result_substrate.txt", seperate + "\n" )
                appendFileSync("result_evm.txt", address + "\n")
                appendFileSync("result_evm.txt", mnemonic + "\n")
            }
        }
    }
}

generate()