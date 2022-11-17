// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract CrowdFund is ERC20, Ownable {
    address _owner;
    uint TOKEN_PRICE = 1000000 gwei;

    //@dev events to be emited while running the contract/functions
    event Launch(
        address indexed caller,
        uint amount,
        uint startDate,
        uint finishDate
    );
    event Cancel(uint actualDate, address indexed caller, string reason);
    event Pledge(address indexed caller, uint amountPledged, uint actualDate);
    event Claim(uint actualDate, uint amount);
    event Refund(address indexed caller, uint amount);

    //@dev structure for the campaign
    struct Campaign {
        address creator; // Creator of campaign
        uint goal; // Amount of tokens to raise
        uint pledged; // Total amount pledged
        uint32 startAt; // Timestamp of start of campaign
        uint32 endAt; // Timestamp of end of campaign
        bool claimed; // True if goal was reached and creator has claimed the tokens.
        bool launched; // True if campaign has started
    }

    Campaign newCampaign;

    //@dev Mapping containing amount pledged by each address
    mapping(address => uint) pledgedByAddress;

    //@dev Constructor. Indicates Token initial supply.
    constructor(uint256 initialSupply) ERC20("EwolCrowfunding", "EWC") {
        _owner = msg.sender;
        _mint(address(this), initialSupply * (10**18));
    }

    //@dev Function for launching the Campaign. Only owner can run this function
    //@dev Owner sets Goal, Start Date and End Date
    function launch(
        uint _goal,
        uint32 _startAt,
        uint32 _endAt
    ) public onlyOwner {
        require(newCampaign.launched == false, "Campaign is already running");
        require(
            _startAt >= block.timestamp,
            "Cannot initialize on a past date"
        );
        require(_endAt > _startAt, "Cannot end before it starts");
        require(
            _goal <= balanceOf(address(this)),
            "Not enough tokens for this goal."
        );

        newCampaign.creator = _owner;
        newCampaign.pledged = 0;
        newCampaign.goal = _goal;
        newCampaign.startAt = _startAt;
        newCampaign.endAt = _endAt;
        newCampaign.claimed = false;
        newCampaign.launched = true;

        emit Launch(msg.sender, _goal, _startAt, _endAt);
    }

    //@dev Owner can cancel the Campaign before it is initiziated.
    //@dev Only owner can cancel his own campaign
    function cancel(string memory reason) public onlyOwner {
        require(
            block.timestamp < newCampaign.startAt,
            "Campaign has already started"
        );
        require(newCampaign.pledged == 0, "Campaign had sold tokens");

        newCampaign.launched = false;
        emit Cancel(block.timestamp, msg.sender, reason);
    }

    //@dev Function for pledge. User buy tokens. Contract receives ETH.
    function pledge(uint amountToBuy) public payable {
        require(
            block.timestamp >= newCampaign.startAt,
            "This Campaign didnt start"
        );
        require(
            block.timestamp < newCampaign.endAt,
            "This Campaign has finished"
        );
        require(newCampaign.launched == true, "This Campaign is not active");
        require(
            msg.value == amountToBuy * TOKEN_PRICE,
            "Wrong Amount of Ether sent"
        );
        uint tokenAvailables = newCampaign.goal - newCampaign.pledged;

        require(tokenAvailables >= amountToBuy, "Not enough Tokens Availables");

        this.transfer(msg.sender, amountToBuy);

        pledgedByAddress[msg.sender] += amountToBuy;
        newCampaign.pledged += amountToBuy;

        emit Pledge(msg.sender, amountToBuy, block.timestamp);
    }

    //@dev Function for owner to claim funds.
    //@dev Should only allow to claim if campaign reachs Goal & Campaign has finished
    function claim() external onlyOwner {
        require(
            block.timestamp > newCampaign.endAt,
            "Campaign is still running"
        );
        require(
            newCampaign.pledged >= newCampaign.goal,
            "Campaign didnt reach the Goal"
        );

        uint _ethBalance = address(this).balance;
        payable(msg.sender).transfer(_ethBalance);

        emit Claim(block.timestamp, _ethBalance);
    }

    //@dev Refunds users if campaign didnt reach the goal & Campaign has finished
    function refund() external {
        //Primero mira que la campaña no esté cancelada/pausada
        if (newCampaign.launched == true) {
            require(
                block.timestamp > newCampaign.endAt,
                "Campaign is still running"
            );
            require(
                newCampaign.pledged < newCampaign.goal,
                "Campaign passed the goal"
            );
        }

        uint256 tokensToRefund = balanceOf(msg.sender); //Mira cuantos tokens tiene el user
        require(tokensToRefund > 0, "You dont have tokens");

        uint256 etherToRefund = tokensToRefund * TOKEN_PRICE; // Calcula equivalente en ETH

        _burn(msg.sender, tokensToRefund); //Quema los tokens en el usuario
        payable(msg.sender).transfer(etherToRefund); // Devuelve ethers al usuario

        emit Refund(msg.sender, tokensToRefund);
    }
}
