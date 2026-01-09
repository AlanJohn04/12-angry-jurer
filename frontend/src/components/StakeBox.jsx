// import { useState } from "react"
// import { getContract } from "../services/contract"

// export default function StakeBox({ conflictId }) {
//   const [amount, setAmount] = useState("")

//   const stake = async () => {
//     if (!amount) return alert("Enter amount")

//     const contract = await getContract()
//     const value = BigInt(amount) * 10n ** 18n

//     const tx = await contract.stakeOnConflict(conflictId, value)
//     await tx.wait()

//     alert("Stake successful")
//     setAmount("")
//   }

//   return (
//     <div style={{ marginTop: 8 }}>
//       <input
//         type="number"
//         placeholder="FAIR amount"
//         value={amount}
//         onChange={e => setAmount(e.target.value)}
//       />
//       <button onClick={stake}>Stake</button>
//     </div>
//   )
// }













