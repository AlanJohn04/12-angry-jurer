import { useState } from "react"
import { getContract } from "../services/contract"

export default function CreateComplaint({ reload }) {
  const [accused, setAccused] = useState("")
  const [statement, setStatement] = useState("")
  const [stake, setStake] = useState("")

  const submit = async () => {
    const contract = await getContract()
    await contract.createComplaint(
      accused,
      statement,
      BigInt(stake) * 10n ** 18n
    )
    reload()
  }

  return (
    <div>
      <h3>Create Complaint</h3>
      <input placeholder="Enemy address" onChange={e => setAccused(e.target.value)} />
      <textarea placeholder="Your statement" onChange={e => setStatement(e.target.value)} />
      <input placeholder="Stake FAIR" onChange={e => setStake(e.target.value)} />
      <button onClick={submit}>Publish</button>
    </div>
  )
}
