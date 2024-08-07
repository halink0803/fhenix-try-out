import { expect } from "chai";
import hre  from "hardhat";
import type { Signers } from "./types";
import { createFheInstance } from "../utils/instance";

describe('Counter test', function() {
    async function getTokensFromFaucet() {
    if (hre.network.name === "localfhenix") {
        const signers = await hre.ethers.getSigners();
        if ((await hre.ethers.provider.getBalance(signers[0].address)).toString() === "0") {
            await hre.fhenixjs.getFunds(signers[0].address);
        }
    }
    }

    before(async function() {
        this.signers = {} as Signers;
        // get tokens from faucet
        await getTokensFromFaucet();
        const signers = await hre.ethers.getSigners();
        this.signers.admin = signers[0];
    })

    it('should trigger console log', async function() {
        this.skip();
        const Counter = await hre.ethers.getContractFactory("Counter");
        const c = await Counter.deploy();
        const cAddress = await c.getAddress();

        // initiate fhenixjs
        console.log(cAddress);
        this.instance = await createFheInstance(hre, cAddress);

        const eInput = await this.instance.instance.encrypt_uint32(10);

        // await c.getCounter(eInput);

        console.log(await c.decryptInputView(eInput));

        await expect(c.decryptInput(eInput))
        .to.emit(c, "DecryptInput")
        .withArgs(20);
    })

    it('should public call', async function() {
        const Counter = await hre.ethers.getContractFactory("Counter");
        const c = await Counter.deploy();
        const cAddress = await c.getAddress();

        // initiate fhenixjs
        console.log(cAddress);
        this.instance = await createFheInstance(hre, cAddress);

        const inputAmount = 20;
        const input = await this.instance.instance.encrypt_uint32(inputAmount);

        console.log(await c.testComparePublic(input));
    })

    it('should external call', async function() {
        const Counter = await hre.ethers.getContractFactory("Counter");
        const c = await Counter.deploy();
        const cAddress = await c.getAddress();

        // initiate fhenixjs
        console.log(cAddress);
        this.instance = await createFheInstance(hre, cAddress);

        const inputAmount = 20;
        const input = await this.instance.instance.encrypt_uint32(inputAmount);

        console.log(await c.testCompare(input));
    })

});