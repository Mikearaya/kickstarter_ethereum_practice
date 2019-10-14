const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");

//set a testing etherium network
const web3 = new Web3(ganache.provider());

const compiledFactory = require("../ethereum/build/CampaignFactory.json");
const compiledCampaign = require("../ethereum/build/Campaign.json");

let accounts;
let factory;
let campaignAddress;
let campaign;

/* console.log(compiledFactory.evm.bytecode["object"]); */
beforeEach(async () => {
	accounts = await web3.eth.getAccounts();
	console.log(web3.utils.toHex(compiledFactory.evm.bytecode.object));

	factory = await new web3.eth.Contract(compiledFactory.abi)
		.deploy({
			data: web3.utils.toHex(compiledFactory.evm.bytecode.object)
		})
		.send({ from: accounts[0], gas: "1000000" });

	campaign = await factory.methods
		.createCampaign("100")
		.send({ from: accounts[0], gas: "1000000" });

	const [campaignAddress] = await factory.methods.getDeployedCampaigns().call();

	campaign = await web3.eth.contract(compiledCampaign.abi, campaignAddress);
});

describe("Campaigns", () => {
	it("deployes a factory and a campaign", () => {
		assert.ok(factory.options.address);
	});
});
