// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract Lotero {
    struct Player {
        bool voted; //if true, that person already voted
        uint256 betId; //index of the bet
        uint256 amount; //player bet
        uint8 selectedNumber; //selected number
    }

    struct Bet {
        uint256 amount; //number of money accumulated in the bet
        mapping(address => Player) players; //map of players in the bet
        mapping(uint8 => address[]) playersByChoosenNumber; //map of addresses by bet number
        mapping(uint8 => uint256) amountByChoosenNumber;
        uint256 numberOfPlayers; //number of players in the bet
        ValidNumber winnerNumber;
    }

    struct User {
        address user; //the user
        uint256 moneyAdded; //money added to the contract by the user
        uint256 moneyEarned; //money earned by the user
        uint256 totalDebt; //amount of money the user can claim
        bool active; //if true, user has activated the account
        address referringUser; //the one who refers the user
    }

    struct Quota {
        uint8 number; //the number
        uint256 availableQuota; //available quota per number
    }

    enum ValidNumber {
        ZERO,
        ONE,
        TWO,
        THREE,
        FOUR,
        FIVE,
        SIX,
        SEVEN,
        EIGHT,
        NINE,
        NOT_VALID
    }

    Bet[] public bets;

    uint8 public constant MAX_WIN_MULTIPLIER = 5;

    uint256 public activeBet;

    mapping(address => User) public infoPerUser; //information per user
    User[] public users; //users

    uint256 public totalMoneyAdded; //total money added to the contract by users
    uint256 public totalMoneyEarned; //total money earned by users in the contract
    uint256 public totalBets; //total bets

    constructor() payable {
        Bet storage firstBet = bets.push();
        firstBet.amount = 0;
        firstBet.numberOfPlayers = 0;
        firstBet.winnerNumber = ValidNumber.NOT_VALID;

        activeBet = 0;
        totalBets++;
    }

    /**
     * @dev Add money to the bet with index betId
     * @param betId index of bet in the bets array
     * @param referringUser the one who refers the current user
     */
    function bet(
        uint256 betId,
        uint8 betNumber,
        address referringUser
    )
        public
        payable
        isValidNumber(betNumber)
        checkBetCouldBePayed(betId, msg.value, betNumber)
    {
        //Bet should be greater than 0
        require(msg.value > 0, "Amount should be greater than 0");

        //Get current player
        Player memory currentPlayer = bets[betId].players[msg.sender];
        require(!currentPlayer.voted, "Already in the current bet.");

        //Update player state
        currentPlayer.voted = true;
        currentPlayer.betId = betId;
        currentPlayer.amount = msg.value;
        currentPlayer.selectedNumber = betNumber;

        //Update bet
        bets[betId].amount += currentPlayer.amount;
        bets[betId].numberOfPlayers++;
        bets[betId].playersByChoosenNumber[betNumber].push(msg.sender);
        bets[betId].amountByChoosenNumber[betNumber] += currentPlayer.amount;

        //Add user to contract if this is the first time adding money
        User memory currentUser = infoPerUser[msg.sender];
        if (currentUser.active == false) {
            currentUser.active = true;
            currentUser.user = msg.sender;
            currentUser.moneyAdded = msg.value;
            currentUser.moneyEarned = 0;
            currentUser.totalDebt = 0;
            currentUser.referringUser = referringUser;

            //Add to users array
            users.push(currentUser);

            //Add to map
            infoPerUser[msg.sender] = currentUser;
        }

        //Update general stats
        totalMoneyAdded += currentPlayer.amount;
    }

    /**
     *@dev Get number of players in bet with given index
     *@param betId the bet index
     */
    function getNumberOfPlayersInBet(uint256 betId)
        public
        view
        returns (uint256)
    {
        return bets[betId].numberOfPlayers;
    }

    /**
     *@dev Get amount of money in bet with index betId
     *@param betId the bet index
     */
    function getTotalMoneyInBet(uint256 betId) public view returns (uint256) {
        return bets[betId].amount;
    }

    /**
     *@dev Get total money in contract
     */
    function getMoneyInContract() public view returns (uint256) {
        return address(this).balance;
    }

    /**
     *@dev Get players who choose choosenNumber in bet with index betId
     *@param betId the bet index
     *@param choosenNumber the choosen number
     */
    function getPlayersWhoChooseNumberInBet(uint256 betId, uint8 choosenNumber)
        public
        view
        returns (address[] memory)
    {
        return bets[betId].playersByChoosenNumber[choosenNumber];
    }

    /**
     *@dev Get available quota to add in the bet
     *@param betId the bet index
     */
    function getAvailableQuotaInBet(uint256 betId)
        public
        view
        returns (Quota[10] memory)
    {
        Quota[10] memory quotas;
        for (uint8 i = 0; i <= 9; i++) {
            Quota memory quota;
            quota.number = i;
            quota.availableQuota =
                (address(this).balance -
                    (getMaxBetAmountInBet(betId, i) * MAX_WIN_MULTIPLIER)) /
                MAX_WIN_MULTIPLIER;
            quotas[i] = quota;
        }

        return quotas;
    }

    /**
     *@dev Get available quota to add in the bet per number
     *@param betId the bet index
     *@param choosenNumber the choosen number
     */
    function getAvailableQuotaInBetPerNumber(uint256 betId, uint8 choosenNumber)
        public
        view
        returns (uint256)
    {
        return
            (address(this).balance -
                (getMaxBetAmountInBet(betId, choosenNumber) *
                    MAX_WIN_MULTIPLIER)) / MAX_WIN_MULTIPLIER;
    }

    /**
     *@dev Get user information in a specific bet
     *@param betId the bet index
     *@param user the user
     */
    function getUserInfoInBet(uint256 betId, address user)
        public
        view
        returns (uint256 amount, uint8 betNumber)
    {
        Player memory currentPlayer = bets[betId].players[user];

        return (currentPlayer.amount, currentPlayer.selectedNumber);
    }

    /**
     *@dev Close bet, pay to winners and increase the bet index.
     *
     */
    function closeBet(ValidNumber winningNumber)
        public
        payable
        currentBetIsActive
        isValidNumber(uint8(winningNumber))
    {
        address[] memory winners = bets[activeBet].playersByChoosenNumber[
            uint8(winningNumber)
        ];

        //Get the winning multiplier (from 2 to 5)
        //uint8 winningMultiplier = getWinnerMultiplier(winningNumber);

        //Pay to winners - Fix this. The contract should not pay to winners. Winners should claim their earnings.
        for (uint8 i = 0; i < winners.length; i++) {
            User memory currentWinner = infoPerUser[winners[i]];

            uint256 winnerAmount = bets[activeBet].players[winners[i]].amount *
                MAX_WIN_MULTIPLIER;

            currentWinner.moneyEarned += winnerAmount;
            currentWinner.totalDebt += winnerAmount;

            totalMoneyEarned += winnerAmount;

            //address payable winner = payable(winners[i]);
            //winner.transfer(bets[activeBet].players[winner].amount * MAX_WIN_MULTIPLIER);
        }

        //Increase bet index
        activeBet++;

        //Create new bet
        Bet storage nextBet = bets.push();
        nextBet.amount = 0;
        nextBet.numberOfPlayers = 0;
        nextBet.winnerNumber = ValidNumber.NOT_VALID;
        totalBets++;
    }

    /**
     *@dev Get max amount bet on any number
     *@param betId the bet index
     */
    function getMaxBetAmountInBet(uint256 betId, uint8 choosenNumber)
        public
        view
        returns (uint256)
    {
        return bets[betId].amountByChoosenNumber[choosenNumber];
    }

    /**
     *@dev Get total money in bet with index betId who choose choosenNumber
     *@param betId the bet index
     *@param choosenNumber the choosen number
     */
    function getTotalMoneyBetWithNumber(uint256 betId, uint8 choosenNumber)
        private
        view
        returns (uint256)
    {
        return bets[betId].amountByChoosenNumber[choosenNumber];
    }

    /**
     *@dev Get total users in contract
     */
    function getTotalUsers() public view returns (uint256) {
        return users.length;
    }

    receive() external payable {}

    /**
     *@dev Check if number is between 0 and 9
     *@param number the number to be validated
     */
    modifier isValidNumber(uint8 number) {
        require(number >= 0 && number <= 9, "Not a valid number");
        _;
    }

    /**
    *@dev Check if the bet can be added
    @param betId bet index
    *@param amount the amount to be validated
    */
    modifier checkBetCouldBePayed(
        uint256 betId,
        uint256 amount,
        uint8 choosenNumber
    ) {
        require(amount <= 10 ether, "Amount should be equal or less than 10");
        uint256 possibleNewAmount = amount +
            getMaxBetAmountInBet(betId, choosenNumber);
        require(
            address(this).balance >= possibleNewAmount * MAX_WIN_MULTIPLIER,
            "Not enough money in contract to add this bet"
        );
        _;
    }

    /**
     *@dev Check if current bet is active
     */
    modifier currentBetIsActive() {
        require(
            bets[activeBet].winnerNumber == ValidNumber.NOT_VALID,
            "Current bet is not active"
        );
        _;
    }
}
