const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const { abi, evm } = require("../compile");

//set a testing etherium network
const web3 = new Web3(ganache.provider());

const compiledFactory = require("../ethereum/build/CampaignFactory.json");
const compiledCampaign = require("../ethereum/build/Campaign.json");

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
	accounts = await web3.eth.getAccounts();
	factory = await new web3.eth.Contract(compiledFactory.abi)
		.deploy({ data: evm.bytecode["object"] })
		.send({ from: accounts[0], gas: "1000000" });
});
