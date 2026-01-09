// import { ethers } from "ethers";
// import abi1 from "../abi/ConflictNet.json";
// const abi = abi1.ABI;
// export const CONTRACT_ADDRESS = abi1.CONTRACT_ADDRESS


// export const getProvider = () => {
//   if (!window.ethereum) throw new Error("MetaMask not found")
//   return new ethers.BrowserProvider(window.ethereum)
// }

// export const getSigner = async () => {
//   const provider = getProvider()
//   return await provider.getSigner()
// }

// export const getContract = async () => {
//   const signer = await getSigner()
//   return new ethers.Contract(CONTRACT_ADDRESS, abi, signer)
// }

// export const getBalance = async (address) => {
//   const contract = await getContract()
//   return await contract.balanceOf(address)
// }

// export const faucet = async (amount) => {
//   const contract = await getContract()
//   const tx = await contract.faucet(amount)
//   await tx.wait()
// }



































import { ethers } from "ethers"
import abi1 from "../abi/ConflictNet.json"

export const CONTRACT_ADDRESS = abi1.CONTRACT_ADDRESS;
const abi = abi1.ABI;

export async function getContract() {
  const provider = new ethers.BrowserProvider(window.ethereum)
  const signer = await provider.getSigner()
  return new ethers.Contract(CONTRACT_ADDRESS, abi, signer)
}
export async function getFairBalance(account) {
  const c = await getContract()
  const bal = await c.fairBalance(account)
  return Number(bal) / 1e18
}

