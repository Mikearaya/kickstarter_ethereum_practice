pragma solidity ^0.5.0;


contract CampaignFactory {
    Campaign[] public deployedCampaigns;
    
    function createCampaign(uint minimum) public {
        Campaign newCampaign = new Campaign(minimum, msg.sender);
        deployedCampaigns.push(newCampaign);
    }
    
    function getDeployedCampaigns() public view returns(Campaign[] memory) {
        return deployedCampaigns;
    }
}

contract Campaign {
    
    struct Request {
        string description;
        uint value;
        address payable recipient; // rec. of the ethereum. i.e. vendor
        bool complete;  // if voting has been complete
        uint approvalCount;
        mapping(address => bool) approvals;
    }

    Request[] public requests;
    address public manager;
    uint public minimumContribution;
    mapping(address => bool) public approvers;
    uint public approversCount;

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    // constructor function
    constructor(uint minimum, address creator) public {
        manager = creator;
        minimumContribution = minimum;
    }

    function contribute() public payable {
        require(msg.value > minimumContribution);
        // the user contributing is added to a list of approvers
        approvers[msg.sender] = true;
        approversCount++;
    }

    // the manager can create a request to fund a recepeient with certain amount of ether (value)
    function createRequest(string memory description, uint value, address payable recipient) public restricted {
        Request memory newRequest = Request({
           description: description,
           value: value,
           recipient: recipient,
           complete: false,
           approvalCount: 0
        });

        requests.push(newRequest);
    }

    // the contributor/approver can vote to approve the request
    function approveRequest(uint index) public {
        Request storage request = requests[index];

        // make sure that only approver can approve request
        require(approvers[msg.sender]);
        // if person already voted on a request, prevent them from voting again
        require(!request.approvals[msg.sender]);

         // mark a contibutor that he already approved the request so s/he cannot approve again
        request.approvals[msg.sender] = true;
        request.approvalCount++; // keep track of tototal number of approvers
    }

    // once we get enough votes, manager can send the ether value to intended recipient
    function finalizeRequest(uint index) public restricted {
        Request storage request = requests[index];

        // to finalize, need at least 50% of approvers (approversCount) to approve
        require(request.approvalCount > (approversCount / 2));
        // make sure if request is complete, you cannot finalize it again
        require(!request.complete);

        request.recipient.transfer(request.value);
        request.complete = true;
    }

    // get summar of specific campaign
    function getSummary() public view returns (
      uint, uint, uint, uint, address
      ) {
        return (
          minimumContribution,
          address(this).balance,
          requests.length,
          approversCount,
          manager
        );
    }

    function getRequestsCount() public view returns (uint) {
        return requests.length;
    }
    
}