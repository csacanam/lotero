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

    describe("First Bet - First Player", function () {
      it("Should be increased the total amount in the bet and in the contract", async function () {

        //Get balance previous to bet
        const previousBalance = Number(await ethers.provider.getBalance(myContract.address));

        //Add 1 wei to bet 0 with number 1
        await myContract.bet(0, 1, ethers.constants.AddressZero, { value: 1 });

        //Get current balance
        const currentBalance = Number(await ethers.provider.getBalance(myContract.address));

        //Get first bet
        const bet = await myContract.bets(0);

        expect(Number(bet.amount)).to.be.equal(1);
        expect(currentBalance).to.be.equal(previousBalance + 1);
      });

      /*it("Should be increased the total amount in contract", async function () {
        const [account1, account2] = await ethers.getSigners();

        let contractAsAccount2 = myContract.connect(account2);

        const previousBalance = Number(await ethers.provider.getBalance(myContract.address));

        //Add 1 wei to bet 0 with number 2
        await contractAsAccount2.bet(0, 2, { value: 1 });

        const currentBalance = Number(await ethers.provider.getBalance(myContract.address));

        expect(currentBalance).to.be.equal(previousBalance + 1);

      });*/

      it("There should be one player in contract", async function () {
        const players = await myContract.getTotalUsers();

        expect(players).to.be.equal(Number(1));

      });

      it("First user should be active", async function () {
        const player1 = await myContract.users(0);

        expect(player1.active).to.be.equal(true);
      });

      it("First user should have added 1 wei", async function () {
        const player1 = await myContract.users(0);
        
        expect(player1.moneyAdded).to.be.equal(1);
      });

      it("Total money added in contract should be equal to 1 wei", async function () {
        const totalMoneyAdded = await myContract.totalMoneyAdded();

        expect(totalMoneyAdded).to.be.equal(1);
      });

      it("Total money earned in contract should be equal to 0 wei", async function () {
        const totalMoneyEarned = await myContract.totalMoneyEarned();

        expect(totalMoneyEarned).to.be.equal(0);
      });

      it("Total bets in contract should be equal to 1", async function () {
        const totalBets = await myContract.totalBets();

        expect(totalBets).to.be.equal(1);
      });

      it("There should be one player in first bet", async function () {
        const bet = await myContract.bets(0);

        expect(bet.numberOfPlayers).to.be.equal(Number(1));
      });

      it("The winner number should be 10 because there is not a winner", async function () {
        const bet = await myContract.bets(0);

        expect(bet.winnerNumber).to.be.equal(Number(10));
      });

      it("The current bet should have 1 wei in deposited amount", async function () {
        const bet = await myContract.bets(0);

        expect(Number(bet.amount)).to.be.equal(1);
      });

      it("Active bet should be bet 0", async function () {
        const bet = await myContract.activeBet();

        expect(Number(bet)).to.be.equal(0);
      });

      it("There should be only 1 player who choose number 1", async function () {
        const numberOfPlayersWhoChoose1 = await myContract.getPlayersWhoChooseNumberInBet(0,1);

        expect(numberOfPlayersWhoChoose1.length).to.be.equal(1);
      });

      it("The total money in contract should be 11", async function () {
        const moneyInContract = await myContract.getMoneyInContract();

        expect(Number(moneyInContract)).to.be.equal(11);
      });

      it("The current available quota for any number different than 1 should be 2", async function () {
        const quotaFor0 = await myContract.getAvailableQuotaInBetPerNumber(0, 0);
        const quotaFor2 = await myContract.getAvailableQuotaInBetPerNumber(0, 2);
        const quotaFor3 = await myContract.getAvailableQuotaInBetPerNumber(0, 3);
        const quotaFor4 = await myContract.getAvailableQuotaInBetPerNumber(0, 4);
        const quotaFor5 = await myContract.getAvailableQuotaInBetPerNumber(0, 5);
        const quotaFor6 = await myContract.getAvailableQuotaInBetPerNumber(0, 6);
        const quotaFor7 = await myContract.getAvailableQuotaInBetPerNumber(0, 7);
        const quotaFor8 = await myContract.getAvailableQuotaInBetPerNumber(0, 8);
        const quotaFor9 = await myContract.getAvailableQuotaInBetPerNumber(0, 9);

        expect(Number(quotaFor0)).to.be.equal(2);
        expect(Number(quotaFor2)).to.be.equal(2);
        expect(Number(quotaFor3)).to.be.equal(2);
        expect(Number(quotaFor4)).to.be.equal(2);
        expect(Number(quotaFor5)).to.be.equal(2);
        expect(Number(quotaFor6)).to.be.equal(2);
        expect(Number(quotaFor7)).to.be.equal(2);
        expect(Number(quotaFor8)).to.be.equal(2);
        expect(Number(quotaFor9)).to.be.equal(2);
      });

      it("The current available quota for number 1 should be 1", async function () {
        const quotaFor1 = await myContract.getAvailableQuotaInBetPerNumber(0, 1);

        expect(Number(quotaFor1)).to.be.equal(1);
      });

      it("Get max amount in bet for number 1 should be equal to 1", async function () {
        const maxAmountFor1 = await myContract.getMaxBetAmountInBet(0, 1);

        expect(Number(maxAmountFor1)).to.be.equal(1);

      });

      it("Get max amount in bet for any number different than 1 should be equal to 0", async function () {
        const maxAmountFor0 = await myContract.getMaxBetAmountInBet(0, 0);
        const maxAmountFor2 = await myContract.getMaxBetAmountInBet(0, 2);
        const maxAmountFor3 = await myContract.getMaxBetAmountInBet(0, 3);
        const maxAmountFor4 = await myContract.getMaxBetAmountInBet(0, 4);
        const maxAmountFor5 = await myContract.getMaxBetAmountInBet(0, 5);
        const maxAmountFor6 = await myContract.getMaxBetAmountInBet(0, 6);
        const maxAmountFor7 = await myContract.getMaxBetAmountInBet(0, 7);
        const maxAmountFor8 = await myContract.getMaxBetAmountInBet(0, 8);
        const maxAmountFor9 = await myContract.getMaxBetAmountInBet(0, 9);

        expect(Number(maxAmountFor0)).to.be.equal(0);
        expect(Number(maxAmountFor2)).to.be.equal(0);
        expect(Number(maxAmountFor3)).to.be.equal(0);
        expect(Number(maxAmountFor4)).to.be.equal(0);
        expect(Number(maxAmountFor5)).to.be.equal(0);
        expect(Number(maxAmountFor6)).to.be.equal(0);
        expect(Number(maxAmountFor7)).to.be.equal(0);
        expect(Number(maxAmountFor8)).to.be.equal(0);
        expect(Number(maxAmountFor9)).to.be.equal(0);

      });

      it("Quota for 1 should be 1. The rest should be 2.", async function () {
        const quotas = await myContract.getAvailableQuotaInBet(0);

        expect(Number(quotas[0].availableQuota)).to.be.equal(2);
        expect(Number(quotas[1].availableQuota)).to.be.equal(1);
        expect(Number(quotas[2].availableQuota)).to.be.equal(2);
        expect(Number(quotas[3].availableQuota)).to.be.equal(2);
        expect(Number(quotas[4].availableQuota)).to.be.equal(2);
        expect(Number(quotas[5].availableQuota)).to.be.equal(2);
        expect(Number(quotas[6].availableQuota)).to.be.equal(2);
        expect(Number(quotas[7].availableQuota)).to.be.equal(2);
        expect(Number(quotas[8].availableQuota)).to.be.equal(2);
        expect(Number(quotas[9].availableQuota)).to.be.equal(2);

      });

    });

    describe("First Bet - Second Player", function () {
      it("Should be increased the total amount in the bet and in the contract", async function () {

        const [account1, account2] = await ethers.getSigners();

        let contractAsAccount2 = myContract.connect(account2);

        //Get balance previous to bet
        const previousBalance = Number(await ethers.provider.getBalance(myContract.address));

        //Add 1 wei to bet 0 with number 1
        await contractAsAccount2.bet(0, 2, ethers.constants.AddressZero, { value: 1 });

        //Get current balance
        const currentBalance = Number(await ethers.provider.getBalance(myContract.address));

        //Get first bet
        const bet = await myContract.bets(0);

        expect(Number(bet.amount)).to.be.equal(2);
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

      it("First and second users should have added 1 wei", async function () {
        const player1 = await myContract.users(0);
        const player2 = await myContract.users(1);
        
        expect(player1.moneyAdded).to.be.equal(1);
        expect(player2.moneyAdded).to.be.equal(1);
      });

      it("Total money added in contract should be equal to 2 weis", async function () {
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

      it("The current bet should have 2 weis in deposited amount", async function () {
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

      it("The current available quota for any number different than 1 and 2 should be 2", async function () {
        const quotaFor0 = await myContract.getAvailableQuotaInBetPerNumber(0, 0);
        const quotaFor3 = await myContract.getAvailableQuotaInBetPerNumber(0, 3);
        const quotaFor4 = await myContract.getAvailableQuotaInBetPerNumber(0, 4);
        const quotaFor5 = await myContract.getAvailableQuotaInBetPerNumber(0, 5);
        const quotaFor6 = await myContract.getAvailableQuotaInBetPerNumber(0, 6);
        const quotaFor7 = await myContract.getAvailableQuotaInBetPerNumber(0, 7);
        const quotaFor8 = await myContract.getAvailableQuotaInBetPerNumber(0, 8);
        const quotaFor9 = await myContract.getAvailableQuotaInBetPerNumber(0, 9);

        expect(Number(quotaFor0)).to.be.equal(2);
        expect(Number(quotaFor3)).to.be.equal(2);
        expect(Number(quotaFor4)).to.be.equal(2);
        expect(Number(quotaFor5)).to.be.equal(2);
        expect(Number(quotaFor6)).to.be.equal(2);
        expect(Number(quotaFor7)).to.be.equal(2);
        expect(Number(quotaFor8)).to.be.equal(2);
        expect(Number(quotaFor9)).to.be.equal(2);
      });

      it("The current available quota for number 1 and number 2 should be 1", async function () {
        const quotaFor1 = await myContract.getAvailableQuotaInBetPerNumber(0, 1);
        const quotaFor2 = await myContract.getAvailableQuotaInBetPerNumber(0, 2);

        expect(Number(quotaFor1)).to.be.equal(1);
        expect(Number(quotaFor2)).to.be.equal(1);
      });

      it("Get max amount in bet for number 1 and number 2 should be equal to 1", async function () {
        const maxAmountFor1 = await myContract.getMaxBetAmountInBet(0, 1);
        const maxAmountFor2 = await myContract.getMaxBetAmountInBet(0, 2);

        expect(Number(maxAmountFor1)).to.be.equal(1);
        expect(Number(maxAmountFor2)).to.be.equal(1);

      });

      it("Get max amount in bet for any number different than 1 and 2 should be equal to 0", async function () {
        const maxAmountFor0 = await myContract.getMaxBetAmountInBet(0, 0);
        const maxAmountFor3 = await myContract.getMaxBetAmountInBet(0, 3);
        const maxAmountFor4 = await myContract.getMaxBetAmountInBet(0, 4);
        const maxAmountFor5 = await myContract.getMaxBetAmountInBet(0, 5);
        const maxAmountFor6 = await myContract.getMaxBetAmountInBet(0, 6);
        const maxAmountFor7 = await myContract.getMaxBetAmountInBet(0, 7);
        const maxAmountFor8 = await myContract.getMaxBetAmountInBet(0, 8);
        const maxAmountFor9 = await myContract.getMaxBetAmountInBet(0, 9);

        expect(Number(maxAmountFor0)).to.be.equal(0);
        expect(Number(maxAmountFor3)).to.be.equal(0);
        expect(Number(maxAmountFor4)).to.be.equal(0);
        expect(Number(maxAmountFor5)).to.be.equal(0);
        expect(Number(maxAmountFor6)).to.be.equal(0);
        expect(Number(maxAmountFor7)).to.be.equal(0);
        expect(Number(maxAmountFor8)).to.be.equal(0);
        expect(Number(maxAmountFor9)).to.be.equal(0);

      });

      it("Quota for 1 and 2 should be 1. The rest should be 2.", async function () {
        const quotas = await myContract.getAvailableQuotaInBet(0);

        expect(Number(quotas[0].availableQuota)).to.be.equal(2);
        expect(Number(quotas[1].availableQuota)).to.be.equal(1);
        expect(Number(quotas[2].availableQuota)).to.be.equal(1);
        expect(Number(quotas[3].availableQuota)).to.be.equal(2);
        expect(Number(quotas[4].availableQuota)).to.be.equal(2);
        expect(Number(quotas[5].availableQuota)).to.be.equal(2);
        expect(Number(quotas[6].availableQuota)).to.be.equal(2);
        expect(Number(quotas[7].availableQuota)).to.be.equal(2);
        expect(Number(quotas[8].availableQuota)).to.be.equal(2);
        expect(Number(quotas[9].availableQuota)).to.be.equal(2);

      });

    });

  });
});
