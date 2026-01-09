export async function fetchFromIPFS(cid) {
  if (!cid || !cid.startsWith("ipfs://")) return null
  const hash = cid.replace("ipfs://", "")
  const url = `https://gateway.pinata.cloud/ipfs/${hash}`

  const res = await fetch(url)
  if (!res.ok) return null
  return res.json()
}
