const { expect } = require("chai");
const signers = {};

let contractFactory;
let contractInstance;

const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
const ONE_DAY_IN_SECS = 24 * 60 * 60;
const ACTUAL_TIME = Math.floor(Date.now() / 1000)
const YESTERDAY = ACTUAL_TIME - ONE_DAY_IN_SECS;
const START_TIME = ACTUAL_TIME + ONE_DAY_IN_SECS
const END_TIME = ACTUAL_TIME + ONE_YEAR_IN_SECS;

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}


describe("Testing on CrowFunding Contract", function () {

  it("Should deploy the smart contract", async function () {

    const [deployer, firstUser, secondUser] = await ethers.getSigners();
    signers.deployer = deployer;
    signers.firstUser = firstUser;
    signers.secondUser = secondUser;


    contractFactory = await ethers.getContractFactory("CrowdFund");
    contractInstance = await contractFactory.deploy(10);
    await contractInstance.deployed();
  })

  describe('Tests on Launching', async () => {

    it("Should not add campaign if actual date is bigger than start date set", async function () {
      const addCampaign = contractInstance.launch(10, YESTERDAY, END_TIME)
      await expect(addCampaign).to.be.revertedWith("Cannot initialize on a past date")
    })


    it("Should not allow to run campaign if launcher its not the owner", async function () {
      const contractInstanceFirstUser = await contractInstance.connect(signers.firstUser)
      const addCampaign = contractInstanceFirstUser.launch(10, START_TIME, END_TIME)
      await expect(addCampaign).to.be.revertedWith('Ownable: caller is not the owner')
    })
  })

  describe('Tests on Canceling', async () => {

    it("Should not allow other user to cancel the campaign", async function () {
      const contractInstanceFirstUser = await contractInstance.connect(signers.firstUser)
      const cancelCampaign = contractInstanceFirstUser.cancel("Motivo X")
      await expect(cancelCampaign).to.be.revertedWith('Ownable: caller is not the owner')
    })

    it("Should cancel Campaign if Start Date didnt arrive", async function () {
      const addCampaign = await contractInstance.launch(10, START_TIME, END_TIME)
      const cancelCampaign = await contractInstance.cancel("Motivo X")
    })

  })

  describe('Tests on Pledging', async () => {

    it("Should not allow other user to pledge if campaign is not running", async function () {
      const addCampaign = await contractInstance.launch(10, START_TIME, END_TIME)
      const contractInstanceFirstUser = await contractInstance.connect(signers.firstUser)
      const pledge = contractInstanceFirstUser.pledge(3)
      await expect(pledge).to.be.revertedWith('This Campaign didnt start')
      const cancelCampaign = await contractInstance.cancel("Motivo X")

    })

    it("Pledger should receive Tokens", async function () {
      const addCampaign = await contractInstance.launch(10, ACTUAL_TIME + 10, ACTUAL_TIME + 15)
      const contractInstanceFirstUser = await contractInstance.connect(signers.firstUser)
      const pledge = await contractInstanceFirstUser.pledge(3, {
        value: ethers.utils.parseEther("3.0")
      })
      
      const balanceOfPledger = (await contractInstance.balanceOf(signers.firstUser.address)).toNumber()
      expect(balanceOfPledger).to.equal(3)

    })

    it("Contract should have less tokens when someone pledges", async function () {
      
      const balanceofContract = (await contractInstance.balanceOf(contractInstance.address)).toNumber()
      expect(balanceofContract).to.equal(7)

    })

  })


  describe('Tests on Refund', async () => {

    it("Should not allow other user to ask for Refund if campaign is running", async function () {
      const contractInstanceFirstUser = await contractInstance.connect(signers.firstUser)
      const askRefund = contractInstanceFirstUser.refund()
      await expect(askRefund).to.be.revertedWith('Campaign is still running')
    })
    
    it("Should burn tokens from user if Refund done", async function () {

      sleep(8000)
      const contractInstanceFirstUser = await contractInstance.connect(signers.firstUser)
      const askRefund = await contractInstanceFirstUser.refund()
      const balanceOfPledger = (await contractInstance.balanceOf(signers.firstUser.address)).toNumber()
      expect(balanceOfPledger).to.equal(0)
      
    })


  })

})