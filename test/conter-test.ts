import { expect } from "chai";
import hre  from "hardhat";
import type { Signers } from "./types";

describe('DelegateCall', function() {
    async function getTokensFromFaucet() {
    if (hre.network.name === "localfhenix") {
        const signers = await hre.ethers.getSigners();

        if (
        (await hre.ethers.provider.getBalance(signers[0].address)).toString() ===
        "0"
        ) {
        await hre.fhenixjs.getFunds(signers[0].address);
        }
    }
    }

    before(async function() {
        this.signers = {} as Signers;
        // get tokens from faucet
        await getTokensFromFaucet();
        // initiate fhenixjs
        // this.instance = await createFheInstance(hre, address);
        const signers = await hre.ethers.getSigners();
        this.signers.admin = signers[0];
    })

    it('should trigger console log', async function() {
        const Counter = await hre.ethers.getContractFactory("Counter");
        const c = await Counter.deploy();

        await c.getCounter();
    })

});