const path = require("path");
const fs = require("fs-extra");
const solc = require("solc");

const buildPath = path.resolve(__dirname, "build");
fs.removeSync(buildPath);

const lotteryPath = path.resolve(__dirname, "contracts", "Campaign.sol");
const source = fs.readFileSync(lotteryPath, "utf8");

let jsonContractSource = JSON.stringify({
	language: "Solidity",
	sources: {
		Task: {
			content: source
		}
	},
	settings: {
		outputSelection: {
			"*": {
				"*": ["abi", "evm.bytecode"]
				// here point out the output of the compiled result
			}
		}
	}
});

const ex = JSON.parse(solc.compile(jsonContractSource)).contracts["Task"];
fs.ensureDirSync(buildPath);

console.log(ex);

for (let contract in ex) {
	fs.outputJsonSync(path.resolve(buildPath, contract + ".json"), ex[contract]);
}

module.exports = ex;
