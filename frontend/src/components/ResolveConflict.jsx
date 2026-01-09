import { getContract } from "../services/contract"

export default function ResolveConflict({ id }) {
  const resolve = async () => {
    const contract = await getContract()
    await contract.resolveConflict(id)
    alert("Conflict resolved")
  }

  return <button onClick={resolve}>Resolve</button>
}
