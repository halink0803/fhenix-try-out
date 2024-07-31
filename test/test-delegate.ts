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

    it('should delegate call', async function() {
        const B = await hre.ethers.getContractFactory("B");
        const b = await B.deploy();

        const badress= await b.getAddress();
        console.log("B Address", badress);

        const A = await hre.ethers.getContractFactory("A");
        const a = await A.deploy();

        const aadress= await a.getAddress();
        console.log("A Address", aadress);

        // delegate call
        const AContract = await hre.ethers.getContractAt("A", aadress);
        await AContract.setVars(badress, 123);

        const numA = await AContract.num();
        expect(numA).to.be.equal(123);
    })

});