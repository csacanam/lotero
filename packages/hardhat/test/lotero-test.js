const { ethers } = require("hardhat");
const { expect } = require("chai");

const provider = ethers.getDefaultProvider();

describe("DApp Testing", async function () {
  let myContract;

  describe("Lotero Contract", function () {
    //1. Contract deployment
    it("Should deploy Lotero contract", async function () {
      const Lotero = await ethers.getContractFactory("Lotero");

      myContract = await Lotero.deploy({ value: 100 });
    });

    //2. First bet by first player
    describe("First Bet - First Player", function () {
      it("Should be increased the total amount in the bet and in the contract", async function () {
        //Get balance previous to bet
        const previousBalance = Number(
          await ethers.provider.getBalance(myContract.address)
        );

        //Add 10 wei to bet 0 with number 1
        await myContract.bet(0, 1, ethers.constants.AddressZero, { value: 10 });

        //Get current balance
        const currentBalance = Number(
          await ethers.provider.getBalance(myContract.address)
        );

        //Get first bet
        const bet = await myContract.bets(0);

        expect(Number(bet.amount)).to.be.equal(10);
        expect(currentBalance).to.be.equal(previousBalance + 10);
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

      it("First user should have added 10 wei", async function () {
        const player1 = await myContract.users(0);

        expect(player1.moneyAdded).to.be.equal(10);
      });

      it("Total money added in contract should be equal to 10 wei", async function () {
        const totalMoneyAdded = await myContract.totalMoneyAdded();

        expect(totalMoneyAdded).to.be.equal(10);
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

      it("The current bet should have 10 wei in deposited amount", async function () {
        const bet = await myContract.bets(0);

        expect(Number(bet.amount)).to.be.equal(10);
      });

      it("Active bet should be bet 0", async function () {
        const bet = await myContract.activeBet();

        expect(Number(bet)).to.be.equal(0);
      });

      it("There should be only 1 player who choose number 1", async function () {
        const numberOfPlayersWhoChoose1 =
          await myContract.getPlayersWhoChooseNumberInBet(0, 1);

        expect(numberOfPlayersWhoChoose1.length).to.be.equal(1);
      });

      it("The total money in contract should be 110", async function () {
        const moneyInContract = await myContract.getMoneyInContract();

        expect(Number(moneyInContract)).to.be.equal(110);
      });

      it("The current available quota for any number different than 1 should be 22", async function () {
        const quotaFor0 = await myContract.getAvailableQuotaInBetPerNumber(
          0,
          0
        );
        const quotaFor2 = await myContract.getAvailableQuotaInBetPerNumber(
          0,
          2
        );
        const quotaFor3 = await myContract.getAvailableQuotaInBetPerNumber(
          0,
          3
        );
        const quotaFor4 = await myContract.getAvailableQuotaInBetPerNumber(
          0,
          4
        );
        const quotaFor5 = await myContract.getAvailableQuotaInBetPerNumber(
          0,
          5
        );
        const quotaFor6 = await myContract.getAvailableQuotaInBetPerNumber(
          0,
          6
        );
        const quotaFor7 = await myContract.getAvailableQuotaInBetPerNumber(
          0,
          7
        );
        const quotaFor8 = await myContract.getAvailableQuotaInBetPerNumber(
          0,
          8
        );
        const quotaFor9 = await myContract.getAvailableQuotaInBetPerNumber(
          0,
          9
        );

        expect(Number(quotaFor0)).to.be.equal(22);
        expect(Number(quotaFor2)).to.be.equal(22);
        expect(Number(quotaFor3)).to.be.equal(22);
        expect(Number(quotaFor4)).to.be.equal(22);
        expect(Number(quotaFor5)).to.be.equal(22);
        expect(Number(quotaFor6)).to.be.equal(22);
        expect(Number(quotaFor7)).to.be.equal(22);
        expect(Number(quotaFor8)).to.be.equal(22);
        expect(Number(quotaFor9)).to.be.equal(22);
      });

      it("The current available quota for number 1 should be 12", async function () {
        const quotaFor1 = await myContract.getAvailableQuotaInBetPerNumber(
          0,
          1
        );

        expect(Number(quotaFor1)).to.be.equal(12);
      });

      it("Get max amount in bet for number 1 should be equal to 10", async function () {
        const maxAmountFor1 = await myContract.getMaxBetAmountInBet(0, 1);

        expect(Number(maxAmountFor1)).to.be.equal(10);
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

      it("Quota for 1 should be 10. The rest should be 22", async function () {
        const quotas = await myContract.getAvailableQuotaInBet(0);

        expect(Number(quotas[0].availableQuota)).to.be.equal(22);
        expect(Number(quotas[1].availableQuota)).to.be.equal(12);
        expect(Number(quotas[2].availableQuota)).to.be.equal(22);
        expect(Number(quotas[3].availableQuota)).to.be.equal(22);
        expect(Number(quotas[4].availableQuota)).to.be.equal(22);
        expect(Number(quotas[5].availableQuota)).to.be.equal(22);
        expect(Number(quotas[6].availableQuota)).to.be.equal(22);
        expect(Number(quotas[7].availableQuota)).to.be.equal(22);
        expect(Number(quotas[8].availableQuota)).to.be.equal(22);
        expect(Number(quotas[9].availableQuota)).to.be.equal(22);
      });
    });

    //First bet by second player
    describe("First Bet - Second Player", function () {
      it("Should be increased the total amount in the bet and in the contract", async function () {
        const [account1, account2] = await ethers.getSigners();

        let contractAsAccount2 = myContract.connect(account2);

        //Get balance previous to bet
        const previousBalance = Number(
          await ethers.provider.getBalance(myContract.address)
        );

        //Add 10 wei to bet 0 with number 2
        await contractAsAccount2.bet(0, 2, ethers.constants.AddressZero, {
          value: 10,
        });

        //Get current balance
        const currentBalance = Number(
          await ethers.provider.getBalance(myContract.address)
        );

        //Get first bet
        const bet = await myContract.bets(0);

        expect(Number(bet.amount)).to.be.equal(20);
        expect(currentBalance).to.be.equal(previousBalance + 10);
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

      it("First and second users should have added 10 wei", async function () {
        const player1 = await myContract.users(0);
        const player2 = await myContract.users(1);

        expect(player1.moneyAdded).to.be.equal(10);
        expect(player2.moneyAdded).to.be.equal(10);
      });

      it("Total money added in contract should be equal to 20 weis", async function () {
        const totalMoneyAdded = await myContract.totalMoneyAdded();

        expect(totalMoneyAdded).to.be.equal(20);
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

      it("The current bet should have 20 weis in deposited amount", async function () {
        const bet = await myContract.bets(0);

        expect(Number(bet.amount)).to.be.equal(20);
      });

      it("Active bet should be bet 0", async function () {
        const bet = await myContract.activeBet();

        expect(Number(bet)).to.be.equal(0);
      });

      it("There should be only 1 player who choose number 1 and number 2", async function () {
        const numberOfPlayersWhoChoose1 =
          await myContract.getPlayersWhoChooseNumberInBet(0, 1);
        const numberOfPlayersWhoChoose2 =
          await myContract.getPlayersWhoChooseNumberInBet(0, 2);

        expect(numberOfPlayersWhoChoose1.length).to.be.equal(1);
        expect(numberOfPlayersWhoChoose2.length).to.be.equal(1);
      });

      it("The total money in contract should be 120", async function () {
        const moneyInContract = await myContract.getMoneyInContract();

        expect(Number(moneyInContract)).to.be.equal(120);
      });

      it("The current available quota for any number different than 1 and 2 should be 2", async function () {
        const quotaFor0 = await myContract.getAvailableQuotaInBetPerNumber(
          0,
          0
        );
        const quotaFor3 = await myContract.getAvailableQuotaInBetPerNumber(
          0,
          3
        );
        const quotaFor4 = await myContract.getAvailableQuotaInBetPerNumber(
          0,
          4
        );
        const quotaFor5 = await myContract.getAvailableQuotaInBetPerNumber(
          0,
          5
        );
        const quotaFor6 = await myContract.getAvailableQuotaInBetPerNumber(
          0,
          6
        );
        const quotaFor7 = await myContract.getAvailableQuotaInBetPerNumber(
          0,
          7
        );
        const quotaFor8 = await myContract.getAvailableQuotaInBetPerNumber(
          0,
          8
        );
        const quotaFor9 = await myContract.getAvailableQuotaInBetPerNumber(
          0,
          9
        );

        expect(Number(quotaFor0)).to.be.equal(24);
        expect(Number(quotaFor3)).to.be.equal(24);
        expect(Number(quotaFor4)).to.be.equal(24);
        expect(Number(quotaFor5)).to.be.equal(24);
        expect(Number(quotaFor6)).to.be.equal(24);
        expect(Number(quotaFor7)).to.be.equal(24);
        expect(Number(quotaFor8)).to.be.equal(24);
        expect(Number(quotaFor9)).to.be.equal(24);
      });

      it("The current available quota for number 1 and number 2 should be 14", async function () {
        const quotaFor1 = await myContract.getAvailableQuotaInBetPerNumber(
          0,
          1
        );
        const quotaFor2 = await myContract.getAvailableQuotaInBetPerNumber(
          0,
          2
        );

        expect(Number(quotaFor1)).to.be.equal(14);
        expect(Number(quotaFor2)).to.be.equal(14);
      });

      it("Get max amount in bet for number 1 and number 2 should be equal to 1", async function () {
        const maxAmountFor1 = await myContract.getMaxBetAmountInBet(0, 1);
        const maxAmountFor2 = await myContract.getMaxBetAmountInBet(0, 2);

        expect(Number(maxAmountFor1)).to.be.equal(10);
        expect(Number(maxAmountFor2)).to.be.equal(10);
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

      it("Quota for 1 and 2 should be 10. The rest should be 20.", async function () {
        const quotas = await myContract.getAvailableQuotaInBet(0);

        expect(Number(quotas[0].availableQuota)).to.be.equal(24);
        expect(Number(quotas[1].availableQuota)).to.be.equal(14);
        expect(Number(quotas[2].availableQuota)).to.be.equal(14);
        expect(Number(quotas[3].availableQuota)).to.be.equal(24);
        expect(Number(quotas[4].availableQuota)).to.be.equal(24);
        expect(Number(quotas[5].availableQuota)).to.be.equal(24);
        expect(Number(quotas[6].availableQuota)).to.be.equal(24);
        expect(Number(quotas[7].availableQuota)).to.be.equal(24);
        expect(Number(quotas[8].availableQuota)).to.be.equal(24);
        expect(Number(quotas[9].availableQuota)).to.be.equal(24);
      });
    });

    //Test Dev Logic
    describe("Dev Logic", async function () {
      it("There should be one dev in members list", async function () {
        const [owner, dev1, dev2] = await ethers.getSigners();

        await myContract.addTeamMember(dev1.address, 10);

        expect(Number(await myContract.getTeamMembersLength())).to.be.equal(1);
      });

      it("Member cannot be added twice", async function () {
        const [owner, dev1, dev2] = await ethers.getSigners();

        //Add a team member
        await expect(
          myContract.addTeamMember(dev1.address, 20)
        ).to.be.revertedWith("There is a member with given address");
      });

      it("The new member cannot be added because his percentage is too high", async function () {
        const [owner, dev1, dev2] = await ethers.getSigners();

        //Add a team member
        await expect(
          myContract.addTeamMember(dev2.address, 100)
        ).to.be.revertedWith(
          "The total new percentage cannot be more than 100"
        );
      });

      it("There should be two devs in members list", async function () {
        const [owner, dev1, dev2] = await ethers.getSigners();

        await myContract.addTeamMember(dev2.address, 90);

        expect(Number(await myContract.getTeamMembersLength())).to.be.equal(2);
      });

      it("Cannot be added a new member", async function () {
        const [owner, dev1, dev2, dev3] = await ethers.getSigners();

        //Add a team member
        await expect(
          myContract.addTeamMember(dev3.address, 10)
        ).to.be.revertedWith(
          "There is not available space to add a team member"
        );
      });

      it("Dev2 was removed", async function () {
        const [owner, dev1, dev2, dev3] = await ethers.getSigners();

        //Remove a team member
        await myContract.removeTeamMember(dev2.address);

        expect(Number(await myContract.getTeamMembersLength())).to.be.equal(1);
      });

      it("Only owner can add a new dev", async function () {
        const [owner, dev1, dev2, dev3] = await ethers.getSigners();

        let contractAsDev2 = myContract.connect(dev2);

        await expect(
          contractAsDev2.addTeamMember(dev2.address, 20)
        ).to.be.revertedWith("Ownable: caller is not the owner");
        expect(Number(await myContract.getTeamMembersLength())).to.be.equal(1);
      });

      it("Only owner can remove a dev", async function () {
        const [owner, dev1, dev2, dev3] = await ethers.getSigners();

        let contractAsDev2 = myContract.connect(dev2);

        await expect(
          contractAsDev2.removeTeamMember(dev1.address)
        ).to.be.revertedWith("Ownable: caller is not the owner");

        expect(Number(await myContract.getTeamMembersLength())).to.be.equal(1);
      });

      it("Total money earned by devs should be 2", async function () {
        const totalMoneyEarnedByDevs =
          await myContract.totalMoneyEarnedByDevs();

        expect(Number(totalMoneyEarnedByDevs)).to.be.equal(2);
      });

      it("Bet Player 3 - Should be increased the total amount in the bet and in the contract", async function () {
        const [account1, account2, account3] = await ethers.getSigners();

        let contractAsAccount3 = myContract.connect(account3);

        //Get balance previous to bet
        const previousBalance = Number(
          await ethers.provider.getBalance(myContract.address)
        );

        //Add 20 wei to bet 0 with number 3
        await contractAsAccount3.bet(0, 3, ethers.constants.AddressZero, {
          value: 20,
        });

        //Get current balance
        const currentBalance = Number(
          await ethers.provider.getBalance(myContract.address)
        );

        //Get first bet
        const bet = await myContract.bets(0);

        expect(Number(bet.amount)).to.be.equal(40);
        expect(currentBalance).to.be.equal(previousBalance + 20);
      });

      it("Total money earned by devs should be 3", async function () {
        const totalMoneyEarnedByDevs =
          await myContract.totalMoneyEarnedByDevs();

        expect(Number(totalMoneyEarnedByDevs)).to.be.equal(3);
      });
    });
  });
});
