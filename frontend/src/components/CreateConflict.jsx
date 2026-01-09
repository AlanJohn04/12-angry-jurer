
// import { useState } from "react"
// import { getContract } from "../services/contract"
// import { analyzeConflict } from "../services/aiService"

// export default function CreateConflict({ onCreated }) {
//   const [partyB, setPartyB] = useState("")
//   const [textA, setTextA] = useState("")
//   const [textB, setTextB] = useState("")
//   const [loading, setLoading] = useState(false)

//   const submit = async () => {
//     try {
//       setLoading(true)

//       const { hash } = await analyzeConflict(textA, textB)
//       const contract = await getContract()
//       const tx = await contract.createConflict(partyB, hash)
//       await tx.wait()

//       setPartyB("")
//       setTextA("")
//       setTextB("")

//       onCreated() // 🔥 reload conflicts
//       alert("Conflict created successfully")
//     } catch (err) {
//       console.error(err)
//       alert("Error creating conflict")
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div style={{ marginBottom: "20px" }}>
//       <h3>Create Conflict</h3>

//       <input
//         placeholder="Party B address"
//         value={partyB}
//         onChange={e => setPartyB(e.target.value)}
//       />

//       <br />

//       <textarea
//         placeholder="Your statement"
//         value={textA}
//         onChange={e => setTextA(e.target.value)}
//       />

//       <br />

//       <textarea
//         placeholder="Other side statement"
//         value={textB}
//         onChange={e => setTextB(e.target.value)}
//       />

//       <br />

//       <button onClick={submit} disabled={loading}>
//         {loading ? "Submitting..." : "Submit"}
//       </button>
//     </div>
//   )
// }





"use client"

import { useState } from "react"
import { getContract } from "../services/contract"

export default function CreateConflict({ account }) {
  const [accused, setAccused] = useState("")
  const [statement, setStatement] = useState("")
  const [stake, setStake] = useState("")
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    if (!accused || !statement || !stake) {
      alert("Fill all fields")
      return
    }
    try {
      setLoading(true)
      const contract = await getContract()
      await contract.createConflict(accused, statement, BigInt(stake) * 10n ** 18n)
      setAccused("")
      setStatement("")
      setStake("")
      alert("Conflict created!")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
        border: "2px solid #00d9ff",
        borderRadius: "16px",
        padding: "28px",
        boxShadow: "0 0 30px rgba(0, 217, 255, 0.2), inset 0 0 20px rgba(0, 217, 255, 0.1)",
      }}
    >
      <h2
        style={{
          color: "#00d9ff",
          fontSize: "24px",
          fontWeight: "bold",
          margin: "0 0 24px 0",
          textShadow: "0 0 15px rgba(0, 217, 255, 0.4)",
        }}
      >
        ⚔ Create Conflict
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div>
          <label
            style={{
              display: "block",
              color: "#64748b",
              fontSize: "12px",
              textTransform: "uppercase",
              letterSpacing: "1px",
              marginBottom: "8px",
            }}
          >
            Accused Address
          </label>
          <input
            placeholder="0x..."
            value={accused}
            onChange={(e) => setAccused(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              background: "rgba(15, 23, 42, 0.6)",
              border: "1px solid #39ff14",
              borderRadius: "8px",
              color: "#39ff14",
              fontSize: "14px",
              fontFamily: "monospace",
              transition: "all 0.3s ease",
              boxSizing: "border-box",
            }}
            onFocus={(e) => (e.target.style.boxShadow = "0 0 15px rgba(57, 255, 20, 0.3)")}
            onBlur={(e) => (e.target.style.boxShadow = "none")}
          />
        </div>

        <div>
          <label
            style={{
              display: "block",
              color: "#64748b",
              fontSize: "12px",
              textTransform: "uppercase",
              letterSpacing: "1px",
              marginBottom: "8px",
            }}
          >
            Your Statement
          </label>
          <textarea
            placeholder="Describe the conflict..."
            value={statement}
            onChange={(e) => setStatement(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              background: "rgba(15, 23, 42, 0.6)",
              border: "1px solid #00d9ff",
              borderRadius: "8px",
              color: "#00d9ff",
              fontSize: "14px",
              minHeight: "100px",
              fontFamily: "inherit",
              transition: "all 0.3s ease",
              boxSizing: "border-box",
            }}
            onFocus={(e) => (e.target.style.boxShadow = "0 0 15px rgba(0, 217, 255, 0.3)")}
            onBlur={(e) => (e.target.style.boxShadow = "none")}
          />
        </div>

        <div>
          <label
            style={{
              display: "block",
              color: "#64748b",
              fontSize: "12px",
              textTransform: "uppercase",
              letterSpacing: "1px",
              marginBottom: "8px",
            }}
          >
            Stake (FAIR)
          </label>
          <input
            placeholder="100"
            value={stake}
            onChange={(e) => setStake(e.target.value)}
            type="number"
            style={{
              width: "100%",
              padding: "12px",
              background: "rgba(15, 23, 42, 0.6)",
              border: "1px solid #ffd700",
              borderRadius: "8px",
              color: "#ffd700",
              fontSize: "14px",
              transition: "all 0.3s ease",
              boxSizing: "border-box",
            }}
            onFocus={(e) => (e.target.style.boxShadow = "0 0 15px rgba(255, 215, 0, 0.3)")}
            onBlur={(e) => (e.target.style.boxShadow = "none")}
          />
        </div>

        <button
          onClick={submit}
          disabled={loading}
          style={{
            background: "linear-gradient(135deg, #00d9ff 0%, #39ff14 100%)",
            border: "none",
            color: "#0f172a",
            padding: "14px",
            fontSize: "16px",
            fontWeight: "bold",
            borderRadius: "10px",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.6 : 1,
            transition: "all 0.3s ease",
            boxShadow: "0 0 20px rgba(0, 217, 255, 0.3)",
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}
          onMouseEnter={(e) => !loading && (e.target.style.boxShadow = "0 0 30px rgba(0, 217, 255, 0.5)")}
          onMouseLeave={(e) => !loading && (e.target.style.boxShadow = "0 0 20px rgba(0, 217, 255, 0.3)")}
        >
          {loading ? "Creating..." : "PUBLISH CONFLICT"}
        </button>
      </div>
    </div>
  )
}
