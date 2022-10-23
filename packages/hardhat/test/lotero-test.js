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

      it("There should be two players in contract", async function () {
        const players = await myContract.getTotalUsers();

        expect(players).to.be.equal(Number(2));

      });

      it("First and second users should be active", async function () {
        const player1 = await myContract.users(0);
        const player2 = await myContract.users(1);

        expect(player1.active).to.be.equal(true);
        expect(player2.active).to.be.equal(true);

      });

      it("First and second users should have added 1 wei each one", async function () {
        const player1 = await myContract.users(0);
        const player2 = await myContract.users(1);
        
        expect(player1.moneyAdded).to.be.equal(1);
        expect(player2.moneyAdded).to.be.equal(1);

      });

      it("Total money added in contract should be equal to 2 wei", async function () {
        const totalMoneyAdded = await myContract.totalMoneyAdded();

        expect(totalMoneyAdded).to.be.equal(2);
      });

      it("Total money earned in contract should be equal to 0 wei", async function () {
        const totalMoneyEarned = await myContract.totalMoneyEarned();

        expect(totalMoneyEarned).to.be.equal(0);
      });

      it("Total bets in contract should be equal to 1", async function () {
        const totalBets = await myContract.totalBets();

        expect(totalBets).to.be.equal(1);
      });

    });

  });
});
