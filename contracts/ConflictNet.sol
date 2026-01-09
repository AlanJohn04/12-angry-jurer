// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ConflictNet {
    /*//////////////////////////////////////////////////////////////
                              TOKEN
    //////////////////////////////////////////////////////////////*/

    mapping(address => uint256) public balanceOf;
    uint256 public totalSupply;
}

    uint256 public constant MIN_STAKE = 1 ether;

    function faucet(uint256 amount) external {
        balanceOf[msg.sender] += amount;
        totalSupply += amount;
    }

    /*//////////////////////////////////////////////////////////////
                           REPUTATION
    //////////////////////////////////////////////////////////////*/

    mapping(address => uint256) public reputation;

    function _rewardRep(address user, uint256 amt) internal {
        reputation[user] += amt;
    }

    function _penalizeRep(address user, uint256 amt) internal {
        reputation[user] = reputation[user] > amt
            ? reputation[user] - amt
            : 0;
    }

    /*//////////////////////////////////////////////////////////////
                              ROLES
    //////////////////////////////////////////////////////////////*/

    address public admin;
    mapping(address => bool) public isJudge;

    uint256 public constant MIN_JUROR_REP = 10;
    uint256 public constant JUDGE_WEIGHT = 5;

    constructor() {
        admin = msg.sender;
    }

    function grantJudge(address user) external {
        require(msg.sender == admin, "Only admin");
        isJudge[user] = true;
    }

    /*//////////////////////////////////////////////////////////////
                            CONFLICT
    //////////////////////////////////////////////////////////////*/

    enum Status {
        AwaitingResponse,
        JuryOpen,
        Resolved,
        Appealed
    }

    struct Conflict {
        address accuser;
        address accused;

        uint256 stakeAccuser;
        uint256 stakeAccused;

        string accuserCID;
        string accusedCID;
        string aiCID;

        uint256 juryYes;
        uint256 juryNo;
        uint256 juryPool;

        uint256 juryEnd;

        bool verdict;
        bool finalized;
        Status status;
    }

    uint256 public conflictCount;
    mapping(uint256 => Conflict) public conflicts;
    mapping(uint256 => mapping(address => bool)) public hasVoted;

    /*//////////////////////////////////////////////////////////////
                        CREATE / RESPOND
    //////////////////////////////////////////////////////////////*/

    function createConflict(
        address accused,
        string calldata accuserCID,
        uint256 stake
    ) external {
        require(stake >= MIN_STAKE, "Stake too low");
        require(balanceOf[msg.sender] >= stake, "Insufficient FAIR");

        balanceOf[msg.sender] -= stake;

        conflictCount++;

        conflicts[conflictCount] = Conflict({
            accuser: msg.sender,
            accused: accused,
            stakeAccuser: stake,
            stakeAccused: 0,
            accuserCID: accuserCID,
            accusedCID: "",
            aiCID: "",
            juryYes: 0,
            juryNo: 0,
            juryPool: 0,
            juryEnd: 0,
            verdict: false,
            finalized: false,
            status: Status.AwaitingResponse
        });
    }

    function respondConflict(
        uint256 id,
        string calldata accusedCID,
        uint256 stake,
        string calldata aiCID
    ) external {
        Conflict storage c = conflicts[id];

        require(msg.sender == c.accused, "Not accused");
        require(c.status == Status.AwaitingResponse, "Invalid status");
        require(stake >= MIN_STAKE, "Stake too low");
        require(balanceOf[msg.sender] >= stake, "Insufficient FAIR");

        balanceOf[msg.sender] -= stake;

        c.stakeAccused = stake;
        c.accusedCID = accusedCID;
        c.aiCID = aiCID;
        c.juryEnd = block.timestamp + 3 days;
        c.status = Status.JuryOpen;
    }

    /*//////////////////////////////////////////////////////////////
                             JURY VOTE
    //////////////////////////////////////////////////////////////*/

    function vote(uint256 id, bool supportAccuser) external {
        Conflict storage c = conflicts[id];

        require(c.status == Status.JuryOpen, "Jury closed");
        require(block.timestamp <= c.juryEnd, "Voting ended");
        require(!hasVoted[id][msg.sender], "Already voted");

        uint256 weight;

        if (isJudge[msg.sender]) {
            weight = JUDGE_WEIGHT;
        } else {
            require(reputation[msg.sender] >= MIN_JUROR_REP, "Not juror");
            weight = reputation[msg.sender] + 1;
        }

        hasVoted[id][msg.sender] = true;

        if (supportAccuser) {
            c.juryYes += weight;
        } else {
            c.juryNo += weight;
        }

        c.juryPool += weight;
    }

    /*//////////////////////////////////////////////////////////////
                           FINALIZE
    //////////////////////////////////////////////////////////////*/

    function finalize(uint256 id) external {
        Conflict storage c = conflicts[id];

        require(c.status == Status.JuryOpen, "Not open");
        require(block.timestamp > c.juryEnd, "Voting ongoing");
        require(!c.finalized, "Already finalized");

        c.finalized = true;
        c.verdict = c.juryYes >= c.juryNo;
        c.status = Status.Resolved;

        address winner = c.verdict ? c.accuser : c.accused;
        address loser = c.verdict ? c.accused : c.accuser;

        uint256 loserStake = c.verdict
            ? c.stakeAccused
            : c.stakeAccuser;

        balanceOf[winner] += loserStake + c.juryPool;

        _rewardRep(winner, 20);
        _penalizeRep(loser, 10);
    }

    /*//////////////////////////////////////////////////////////////
                             APPEAL
    //////////////////////////////////////////////////////////////*/

    function appeal(uint256 id) external {
        Conflict storage c = conflicts[id];

        require(c.status == Status.Resolved, "Not resolved");
        require(
            msg.sender == c.accuser || msg.sender == c.accused,
            "Not party"
        );

        c.status = Status.Appealed;
        c.juryYes = 0;
        c.juryNo = 0;
        c.juryPool = 0;
        c.finalized = false;
        c.juryEnd = block.timestamp + 2 days;
    }
}
