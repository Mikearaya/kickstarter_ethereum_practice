const hdWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');

const {abi, evm}  = require('./compile');


const provider = new hdWalletProvider(
    'erode fever jacket blood space lift liquid agree clump cram fruit pumpkin',
    'https://rinkeby.infura.io/v3/6e2e115dc6f44593bf5b03d2a1237726'
);

const web3 = new Web3(provider);

const deploy  = async () => {
    const accounts = await web3.eth.getAccounts();
    const result = await new web3.eth.Contract(abi)
    		.deploy({ data: '0x'+ evm.bytecode["object"] })
		    .send({ from: accounts[0], gas: "1000000" });


console.log(abi);
        console.log('Contract deployed to ', result.options.address);
};
deploy();
