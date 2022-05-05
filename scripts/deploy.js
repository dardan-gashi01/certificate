const main = async () => {
    const [deployer] = await hre.ethers.getSigners();
    const accountBalance = await deployer.getBalance();
    console.log("Deploying contract with the account: ", deployer.address);
    console.log("Account Balance: ", accountBalance.toString());

    const certificateContractFactory = await hre.ethers.getContractFactory("certificate");
    const certificateContract = await certificateContractFactory.deploy();
    await certificateContract.deployed();
    
    console.log("certificateSystem address: ", certificateContract.address);
}; 

const runMain = async () => {
    try{
        await main();
        process.exit(0);
    }catch(err){
        console.error(err);
        process.exit(1);
    }
};
runMain();