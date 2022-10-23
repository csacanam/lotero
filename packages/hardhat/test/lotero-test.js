const { ethers } = require("hardhat");
const { expect } = require("chai");

const provider = ethers.getDefaultProvider();

describe("DApp Testing", function () {
  let myContract;

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

        expect(Number(bet.amount)).to.be.equal(1);
      });

      it("Should be increased the total amount in contract", async function () {
        const [account1, account2] = await ethers.getSigners();

        let contractAsAccount2 = myContract.connect(account2);

        const previousBalance = Number(await ethers.provider.getBalance(myContract.address));

        //Add 1 wei to bet 0 with number 2
        await contractAsAccount2.bet(0, 2, { value: 1 });

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

      it("There should be two players in first bet", async function () {
        const bet = await myContract.bets(0);

        expect(bet.numberOfPlayers).to.be.equal(Number(2));
      });

      it("The winner number should be 10 because there is not a winner", async function () {
        const bet = await myContract.bets(0);

        expect(bet.winnerNumber).to.be.equal(Number(10));
      });

      it("The current bet should have 2 wei in deposited amount", async function () {
        const bet = await myContract.bets(0);

        expect(Number(bet.amount)).to.be.equal(2);
      });

      it("Active bet should be bet 0", async function () {
        const bet = await myContract.activeBet();

        expect(Number(bet)).to.be.equal(0);
      });

      it("There should be only 1 player who choose number 1 and number 2", async function () {
        const numberOfPlayersWhoChoose1 = await myContract.getPlayersWhoChooseNumberInBet(0,1);
        const numberOfPlayersWhoChoose2 = await myContract.getPlayersWhoChooseNumberInBet(0,2);

        expect(numberOfPlayersWhoChoose1.length).to.be.equal(1);
        expect(numberOfPlayersWhoChoose2.length).to.be.equal(1);
      });

      it("The total money in contract should be 12", async function () {
        const moneyInContract = await myContract.getMoneyInContract();

        expect(Number(moneyInContract)).to.be.equal(12);
      });

      it("The current available quota should be 1", async function () {
        const quota = await myContract.getAvailableQuotaInBet(0);

        expect(Number(quota)).to.be.equal(1);
      });

      it("Get max amount in bet should be equals to 1", async function () {
        const maxAmount = await myContract.getMaxBetAmountInBet(0);

        expect(Number(maxAmount)).to.be.equal(1);
      });


    });

  });
});
