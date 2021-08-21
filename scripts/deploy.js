const fs=require('fs');

async  function  main(){
    const [deployer]= await ethers.getSigners();
    console.log('deploying contracts with the account: %s',deployer.address);
    const balance= await deployer.getBalance();
    console.log('Account balance: %s',balance);
    const Swash=await ethers.getContractFactory('SWASH');
    const swash=await Swash.deploy();
    console.log("Swash is deployed with address: %s",swash.address);
    const data={
        
        address:swash.address,
        abi:JSON.parse(swash.interface.format('json'))
    }
    fs.writeFileSync('frontend/src/contracts/swash.json',JSON.stringify(data));
}
main()
    .then(()=>process.exit(0))
    .catch((error)=>{
        console.error(error);
        process.exit(1);
    });
