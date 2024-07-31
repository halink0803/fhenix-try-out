import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import chalk from "chalk";

const hre = require("hardhat");

const func: DeployFunction = async function () {
  const { fhenixjs, ethers } = hre;
  const { deploy, execute } = hre.deployments;
  const [signer] = await ethers.getSigners();

  if ((await ethers.provider.getBalance(signer.address)).toString() === "0") {
    if (hre.network.name === "localfhenix") {
      await fhenixjs.getFunds(signer.address);
    } else {
        console.log(
            chalk.red("Please fund your account with testnet FHE from https://faucet.fhenix.zone"));
        return;
    }
  }

  const contractA = await deploy("A", {
    from: signer.address,
    args: [],
    log: true,
    skipIfAlreadyDeployed: false,
  });

  console.log(`A contract: `, contractA.address);

  const contractB = await deploy("B", {
    from: signer.address,
    args: [],
    log: true,
    skipIfAlreadyDeployed: false,
  });

  await execute(
    "A",
    {
      from: signer.address,
      log: true,
    },
    "setVars(address, uint256)",
    contractB.address,
    123,
  )

};

export default func;
func.id = "deploy_delegate";
func.tags = ["delegate"];
