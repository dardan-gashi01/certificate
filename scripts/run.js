const main = async () => {
    const CertificateContractFactory = await hre.ethers.getContractFactory("certificate");
    const CertificateContract = await CertificateContractFactory.deploy();
    await CertificateContract.deployed();
    console.log('contract deployed to:', CertificateContract.address);

    let certificateTxn = await CertificateContract.createCertificate('imageURI','Title','Artist','Year');
    await certificateTxn.wait();

    const [_, random] = await hre.ethers.getSigners();
    certificateTxn = await CertificateContract.createCertificate('imageURI2','Title2','Artist2','Year2');
    await certificateTxn.wait();

    let allCertificates = await CertificateContract.getCertificate();
    console.log(allCertificates);
};

const runMain = async () => {
    try{
        await main();
        process.exit(0);
    }catch (err){
        console.error(err);
        process.exit(1);
    }
};
runMain();