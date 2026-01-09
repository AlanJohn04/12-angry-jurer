import { getContract } from "../services/contract"

export default function Faucet() {
  const mint = async () => {
    const c = await getContract()
    await c.faucet(100000n * 10n ** 18n)
    alert("FAIR received")
  }

  return <button onClick={mint}>Get FAIR</button>
}
