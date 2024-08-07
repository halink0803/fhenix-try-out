// SPDX-License-Identifier: MIT

pragma solidity >=0.8.13 <0.9.0;

import "@fhenixprotocol/contracts/FHE.sol";
import {Permissioned, Permission} from "@fhenixprotocol/contracts/access/Permissioned.sol";
import { Console } from "@fhenixprotocol/contracts/utils/debug/Console.sol";

contract Counter is Permissioned {
  euint32 private counter;
  address public owner;

  event DecryptInput(
    uint256 value
  );

  constructor() {
    owner = msg.sender;
  }

  modifier requireGreaterThanZero(uint256 amount) {
        require(amount > 0, "failed");
        _;
    }

  function add(inEuint32 calldata encryptedValue) public {
    euint32 value = FHE.asEuint32(encryptedValue);
    counter = counter + value; 
  }

  function decryptInputView(inEuint32 calldata _amount) external view returns(uint256) {
      euint32 amountRedeem = FHE.asEuint32(_amount);
      uint256 amountToRedeem = FHE.decrypt(amountRedeem);
      return amountToRedeem;
  }

  function getCounter(inEuint32 calldata _eInput) external {
    euint32 encryptedInput = FHE.asEuint32(_eInput);
    uint256 decryptedInput = FHE.decrypt(encryptedInput);

    Console.log("decrypted input: ", decryptedInput);

    uint256 decrypted = FHE.decrypt(counter);
    require(decrypted >= decryptedInput, "counter must be greater than input");

    FHE.req(FHE.gt(counter, encryptedInput));
    counter = counter - encryptedInput;
    Console.log(decrypted);

    require(decrypted > 100, "counter have to bigger than 100 to get");
  }

  function testDecrypt(inEuint32 calldata input) public pure returns (uint256) {
    euint32 data = FHE.asEuint32(input);
    return FHE.decrypt(data);
  }

  function testCompare(inEuint32 calldata input) external returns(bool) {
    uint256 counterDecrypt = 100;
    Console.log("plain uint256", counterDecrypt);

    euint32 i = FHE.asEuint32(input);
    uint256 decryptedInput = FHE.decrypt(i);
    Console.log("decrypted uint256", decryptedInput);

    require(counterDecrypt >= decryptedInput, "not pass required");

    return counterDecrypt >= decryptedInput;
  }

  function testComparePublic(inEuint32 calldata input) public view returns(bool) {
    uint256 counterDecrypt = 100;
    Console.log("public plain uint256", counterDecrypt);

    euint32 i = FHE.asEuint32(input);
    uint256 decryptedInput = FHE.decrypt(i);
    Console.log("public decrypted uint256", decryptedInput);

    require(counterDecrypt >= decryptedInput, "not pass required");

    return counterDecrypt >= decryptedInput;
  }

  function getCounterPermit(
    Permission memory permission
  ) public view onlySender(permission) returns (uint256) {
    return FHE.decrypt(counter);
  }

  function getCounterPermitSealed(
    Permission memory permission
  ) public view onlySender(permission) returns (string memory) {
    return FHE.sealoutput(counter, permission.publicKey);
  }
}