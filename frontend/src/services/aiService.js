// import { keccak256, toUtf8Bytes } from "ethers"

// export const analyzeConflict = async (textA, textB) => {
//   const aiResult = {
//     summary: "Miscommunication due to emotional tone",
//     emotions: ["anger", "defensiveness"],
//     resolution: "Both sides clarify intent calmly"
//   }

//   const jsonString = JSON.stringify(aiResult)
//   const hash = keccak256(toUtf8Bytes(jsonString))

//   return { aiResult, hash }
// }
import { keccak256, toUtf8Bytes } from "ethers"

export const analyzeAndHash = async (a, b) => {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
  const res = await fetch(`${apiUrl}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ textA: a, textB: b })
  })

  const data = await res.json()
  const hash = keccak256(toUtf8Bytes(JSON.stringify(data)))

  return hash
}
