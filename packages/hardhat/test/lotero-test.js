const { ethers } = require("hardhat");
const { expect } = require("chai");

const provider = ethers.getDefaultProvider();

describe("DApp Testing", function () {
  let myContract;

  // quick fix to let gas reporter fetch data from gas station & coinmarketcap
  before((done) => {
    setTimeout(done, 2000);
  });

  describe("Lotero Contract", function () {

    it("Should deploy Lotero contract", async function () {
      const Lotero = await ethers.getContractFactory("Lotero");

      myContract = await Lotero.deploy({ value: 10 });

    });

    describe("bet()", function () {
      it("Should be increased the total amount in the bet", async function () {
        
        //Add 1 wei to bet 0 with number 1
        await myContract.bet(0, 1, { value: 1 });

        //Get first bet
        const bet = await myContract.bets(0);


        //Print first bet object
        //console.log(bet);

        //Print money in first bet
        //console.log(Number(await bet[0]));

        //Print number of players in first bet
        //console.log(Number(await bet[1]));addre

        //Print winner number in first bet
        //console.log(Number(await bet[2]));

        expect(Number(await bet[0])).to.be.equal(1);
      });

      it("Should be increased the total amount in contract", async function () {
        const [account1, account2] = await ethers.getSigners();

        let contractAsAccount2 = myContract.connect(account2);

        const previousBalance = Number(await ethers.provider.getBalance(myContract.address));

        //Add 1 wei to bet 0 with number 1
        await contractAsAccount2.bet(0, 1, { value: 1 });

        const currentBalance = Number(await ethers.provider.getBalance(myContract.address));

        expect(currentBalance).to.be.equal(previousBalance + 1);

      });

      /*it("Should emit a SetPurpose event ", async function () {
        const [owner] = await ethers.getSigners();

        const newPurpose = "Another Test Purpose";

        expect(await myContract.setPurpose(newPurpose))
          .to.emit(myContract, "SetPurpose")
          .withArgs(owner.address, newPurpose);
      });*/
    });

  });
});
