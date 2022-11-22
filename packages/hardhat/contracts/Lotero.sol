// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Lotero is Ownable {
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
        uint256 moneyEarned; //money earned by the user
        uint256 moneyClaimed; //amount of money the user can claim
        bool active; //if true, user has activated the account
        address referringUserAddress; //the one who refers the user
        uint256 earnedByReferrals; //total money earned by referrals in the contract
        uint256 claimedByReferrals; //total money claimed by referrals in the contract
    }

    struct Quota {
        uint8 number; //the number
        uint256 availableQuota; //available quota per number
    }

    struct TeamMember {
        address devAddress;
        uint8 percentage;
        uint256 moneyClaimed;
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
    uint256 public totalMoneyEarnedByPlayers; //total money earned by players in the contract
    uint256 public totalMoneyClaimedByPlayers; //total money claimed by players in the contract
    uint256 public totalBets; //total bets
    uint256 public totalMoneyEarnedByDevs; //total money earned by devs
    uint256 public totalMoneyClaimedByDevs; //total money claimed by devs
    uint256 public totalMoneyEarnedByReferrals; //total money earned by referrals in the contract
    uint256 public totalMoneyClaimedByReferrals; //total money claimed by referrals in the contract

    //Dev Team
    TeamMember[] public teamMembers; //list of devs

    uint8 public constant DEV_FEE = 5; //Dev Fee - 5%
    uint8 public constant REFERRAL_FEE = 1; //Referrral Fee - 1%

    constructor() payable {
        Bet storage firstBet = bets.push();
        firstBet.amount = 0;
        firstBet.numberOfPlayers = 0;
        firstBet.winnerNumber = ValidNumber.NOT_VALID;

        activeBet = 0;
        totalBets++;
    }

    //1. CORE LOGIC

    /**
     * @dev Add money to the bet with index betId
     * @param betId index of bet in the bets array
     * @param referringUserAddress the one who refers the current user
     */
    function bet(
        uint256 betId,
        uint8 betNumber,
        address referringUserAddress
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
        currentPlayer.amount = msg.value - getDevFee(msg.value);
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
            currentUser.moneyEarned = 0;
            currentUser.moneyClaimed = 0;
            currentUser.referringUserAddress = referringUserAddress;

            //Add to users array
            users.push(currentUser);

            //Add to map
            infoPerUser[msg.sender] = currentUser;
        }

        //Update general stats
        totalMoneyAdded += currentPlayer.amount;

        totalMoneyEarnedByDevs += getDevFee(currentPlayer.amount);
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
                    getCurrentDebt() -
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
                getCurrentDebt() -
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
    function closeBet() public payable currentBetIsActive {
        ValidNumber winningNumber = getWinningNumber();

        require(
            uint8(winningNumber) >= 0 && uint8(winningNumber) <= 9,
            "Not a valid number"
        );

        address[] memory winners = bets[activeBet].playersByChoosenNumber[
            uint8(winningNumber)
        ];

        for (uint8 i = 0; i < winners.length; i++) {
            User memory currentWinner = infoPerUser[winners[i]];

            uint256 winnerAmount = bets[activeBet].players[winners[i]].amount *
                MAX_WIN_MULTIPLIER;

            currentWinner.moneyEarned += winnerAmount;

            totalMoneyEarnedByPlayers += winnerAmount;

            //Update referral
            if (currentWinner.referringUserAddress != address(0)) {
                updateReferralEarnings(
                    currentWinner.referringUserAddress,
                    winnerAmount
                );
            }
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
     *@dev Get winning number
     */
    function getWinningNumber() private pure returns (ValidNumber) {
        ValidNumber winningNumber = ValidNumber.NINE;
        //Add integration to oracle
        return winningNumber;
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

    /**
     *@dev Get total debt in contract
     */
    function getCurrentDebt() public view returns (uint256) {
        uint256 debtWithPlayers = totalMoneyEarnedByPlayers -
            totalMoneyClaimedByPlayers;
        uint256 debtWithDevs = totalMoneyEarnedByDevs - totalMoneyClaimedByDevs;
        uint256 debtWithReferrals = totalMoneyEarnedByReferrals -
            totalMoneyClaimedByReferrals;

        return debtWithPlayers + debtWithDevs + debtWithReferrals;
    }

    /**
     *@dev Get dev fee given a specific amount
     */
    function getDevFee(uint256 amount) private pure returns (uint256) {
        return ((amount * DEV_FEE) / 100);
    }

    /**
     *@dev Get referral fee given a specific amount
     */
    function getReferralFee(uint256 amount) private pure returns (uint256) {
        return ((amount * REFERRAL_FEE) / 100);
    }

    /**
     *@dev Update referral earnings
     *@param referringUserAddress referring user addresss
     *@param amountToAdd amount to add to the referring user
     */
    function updateReferralEarnings(
        address referringUserAddress,
        uint256 amountToAdd
    ) private {
        totalMoneyEarnedByReferrals += ((amountToAdd * REFERRAL_FEE) / 100);

        User memory referringUser = infoPerUser[referringUserAddress];
        referringUser.earnedByReferrals += ((amountToAdd * REFERRAL_FEE) / 100);
    }

    //2. DEV LOGIC

    /**
     *@dev Add a dev to the list of members
     *@param teamMemberAddress the address
     *@param percentage the share for the user (ex: 10 means 10% of the commission to this dev)
     */
    function addTeamMember(address teamMemberAddress, uint8 percentage)
        public
        onlyOwner
    {
        bool existingMember = false;
        uint8 currentPercentage = 0;

        for (uint8 i = 0; i < teamMembers.length; i++) {
            TeamMember memory teamMember = teamMembers[i];
            currentPercentage += teamMember.percentage;

            if (teamMemberAddress == teamMember.devAddress) {
                existingMember = true;
            }
        }

        require(!existingMember, "There is a member with given address");

        require(
            currentPercentage < 100,
            "There is not available space to add a team member"
        );

        require(
            (currentPercentage + percentage) <= 100,
            "The total new percentage cannot be more than 100"
        );

        //Add new member
        TeamMember memory newTeamMember = TeamMember(
            teamMemberAddress,
            percentage,
            0
        );
        teamMembers.push(newTeamMember);
    }

    /**
     *@dev Remove a dev from the list of members
     *@param teamMemberAddress the address
     */
    function removeTeamMember(address teamMemberAddress) public onlyOwner {
        for (uint8 i = 0; i < teamMembers.length; i++) {
            TeamMember memory teamMember = teamMembers[i];
            if (teamMember.devAddress == teamMemberAddress) {
                //Move last member to spot i
                teamMembers[i] = teamMembers[teamMembers.length - 1];
                //Remove last member in the array
                teamMembers.pop();
                break;
            }
        }
    }

    /**
     *@dev Claim dev earnings
     */
    function claimDevEarnings() public onlyTeamMember {
        uint256 totalPendingMoney = totalMoneyEarnedByDevs -
            totalMoneyClaimedByDevs;

        require(
            totalPendingMoney > 0,
            "There is no total pending money to pay to devs"
        );

        for (uint8 i = 0; i < teamMembers.length; i++) {
            TeamMember memory teamMember = teamMembers[i];

            uint256 amounToPay = (totalPendingMoney * teamMember.percentage) /
                100;

            address payable devAddressPayable = payable(teamMember.devAddress);
            devAddressPayable.transfer(amounToPay);

            totalMoneyClaimedByDevs += amounToPay;

            teamMember.moneyClaimed += amounToPay;
        }
    }

    /**
     *@dev Get total team members in contract
     */
    function getTeamMembersLength() public view returns (uint256) {
        return teamMembers.length;
    }

    /**
     *@dev Get total team members list
     */
    function getTeamMemberList() public view returns (TeamMember[] memory) {
        return teamMembers;
    }

    //3. MODIFIERS AND OTHERS

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
        //require(amount <= 50 ether, "Amount should be equal or less than 10");
        uint256 possibleNewAmount = amount +
            getMaxBetAmountInBet(betId, choosenNumber);
        require(
            address(this).balance - getCurrentDebt() >=
                possibleNewAmount * MAX_WIN_MULTIPLIER,
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

    /**
     *@dev Check if current user is part of the member list
     */
    modifier onlyTeamMember() {
        bool isMember = false;

        for (uint8 i = 0; i < teamMembers.length; i++) {
            TeamMember memory teamMember = teamMembers[i];

            if (msg.sender == teamMember.devAddress) {
                isMember = true;
                break;
            }
        }

        require(isMember, "User is not part of the team members");
        _;
    }
}
