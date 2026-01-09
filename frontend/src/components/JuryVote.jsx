// import { useState } from "react"
// import { getContract } from "../services/contract"
// import { uploadJSONToPinata } from "../services/pinata"


// export default function JuryVote({ conflictId }) {
//   const [stake, setStake] = useState("")
//   const [side, setSide] = useState(true)
//   const [reason, setReason] = useState("")
//   const [reputation, setReputation] = useState(0)

// useEffect(() => {
//   const loadRep = async () => {
//     const c = await getContract()
//     const accounts = await window.ethereum.request({ method: "eth_accounts" })
//     const rep = await c.reputation(accounts[0])
//     setReputation(Number(rep))
//   }
//   loadRep()
// }, [])

// const vote = async () => {
//   if (!stake || !reason) {
//     alert("Stake and explanation required")
//     return
//   }

//   const accounts = await window.ethereum.request({
//     method: "eth_accounts",
//   })
//   const voter = accounts[0]

//   // 1️⃣ create official jury explanation object
//   const explanation = {
//     type: "JURY_EXPLANATION",
//     conflictId,
//     voter,
//     side: side ? "Accuser" : "Accused",
//     reason,
//     time: Date.now(),
//   }

//   // 2️⃣ upload explanation to IPFS
//   const res = await uploadJSONToPinata(explanation)

//   // 3️⃣ submit vote on-chain
//   const c = await getContract()
//   await c.juryVote(
//     conflictId,
//     side,
//     BigInt(stake) * 10n ** 18n
//   )

//   // 4️⃣ auto-write explanation to chat
//   window.dispatchEvent(
//     new CustomEvent("juryExplanation", {
//       detail: explanation,
//     })
//   )

//   alert("Vote submitted with public explanation")
// }

//   return (
//     <div>
//       <select onChange={e => setSide(e.target.value === "true")}>
//         <option value="true">Support Accuser</option>
//         <option value="false">Support Accused</option>
//       </select>

//       <textarea
//         placeholder="Why are you voting this way?"
//         onChange={e => setReason(e.target.value)}
//       />

//       <input
//         placeholder="Stake FAIR"
//         onChange={e => setStake(e.target.value)}
//       />

// {reputation >= 10 ? (
//   <button onClick={vote}>Vote</button>
// ) : (
//   <p>You are an audience member</p>
// )}
//     </div>
//   )
// }

























"use client"

import { useState, useEffect } from "react"
import { getContract } from "../services/contract"
import { uploadJSONToPinata } from "../services/pinata"

export default function JuryVote({ conflictId }) {
  const [stake, setStake] = useState("")
  const [side, setSide] = useState(true)
  const [reason, setReason] = useState("")
  const [reputation, setReputation] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadRep = async () => {
      const c = await getContract()
      const accounts = await window.ethereum.request({ method: "eth_accounts" })
      const rep = await c.reputation(accounts[0])
      setReputation(Number(rep))
    }
    loadRep()
  }, [])

  const vote = async () => {
    if (!stake || !reason) {
      alert("Stake and explanation required")
      return
    }

    try {
      setLoading(true)
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      })
      const voter = accounts[0]

      const explanation = {
        type: "JURY_EXPLANATION",
        conflictId,
        voter,
        side: side ? "Accuser" : "Accused",
        reason,
        time: Date.now(),
      }

      const res = await uploadJSONToPinata(explanation)
      const c = await getContract()
      await c.juryVote(conflictId, side, BigInt(stake) * 10n ** 18n)

      window.dispatchEvent(
        new CustomEvent("juryExplanation", {
          detail: explanation,
        }),
      )

      alert("Vote submitted!")
      setStake("")
      setReason("")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
        border: "2px solid #ffd700",
        borderRadius: "16px",
        padding: "28px",
        boxShadow: "0 0 30px rgba(255, 215, 0, 0.2), inset 0 0 20px rgba(255, 215, 0, 0.1)",
      }}
    >
      <h3
        style={{
          color: "#ffd700",
          fontSize: "22px",
          fontWeight: "bold",
          margin: "0 0 24px 0",
          textShadow: "0 0 15px rgba(255, 215, 0, 0.4)",
        }}
      >
        ⚖ Cast Your Vote
      </h3>

      {reputation < 10 ? (
        <div
          style={{
            background: "rgba(255, 215, 0, 0.1)",
            border: "1px solid #ffd700",
            borderRadius: "8px",
            padding: "16px",
            color: "#ffd700",
            textAlign: "center",
          }}
        >
          <p style={{ margin: 0 }}>👁 Audience Member</p>
          <p style={{ fontSize: "12px", margin: "8px 0 0 0", opacity: 0.7 }}>Gain 10 REP to become an eligible juror</p>
        </div>
      ) : (
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
              Your Vote
            </label>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
              }}
            >
              <button
                onClick={() => setSide(true)}
                style={{
                  background: side ? "linear-gradient(135deg, #00d9ff 0%, #39ff14 100%)" : "rgba(0, 217, 255, 0.1)",
                  border: `2px solid ${side ? "#00d9ff" : "rgba(0, 217, 255, 0.3)"}`,
                  color: side ? "#0f172a" : "#00d9ff",
                  padding: "12px",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
              >
                Support Accuser
              </button>
              <button
                onClick={() => setSide(false)}
                style={{
                  background: !side ? "linear-gradient(135deg, #ff6b6b 0%, #ffd700 100%)" : "rgba(255, 107, 107, 0.1)",
                  border: `2px solid ${!side ? "#ff6b6b" : "rgba(255, 107, 107, 0.3)"}`,
                  color: !side ? "#0f172a" : "#ff6b6b",
                  padding: "12px",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
              >
                Support Accused
              </button>
            </div>
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
              Your Reasoning
            </label>
            <textarea
              placeholder="Explain your vote thoroughly..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                background: "rgba(15, 23, 42, 0.6)",
                border: "1px solid #39ff14",
                borderRadius: "8px",
                color: "#39ff14",
                fontSize: "14px",
                minHeight: "100px",
                boxSizing: "border-box",
              }}
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
              placeholder="10"
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
                boxSizing: "border-box",
              }}
            />
          </div>

          <button
            onClick={vote}
            disabled={loading}
            style={{
              background: "linear-gradient(135deg, #ffd700 0%, #39ff14 100%)",
              border: "none",
              color: "#0f172a",
              padding: "14px",
              fontSize: "16px",
              fontWeight: "bold",
              borderRadius: "10px",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1,
              transition: "all 0.3s ease",
              boxShadow: "0 0 20px rgba(255, 215, 0, 0.4)",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            {loading ? "Submitting..." : "SUBMIT VOTE"}
          </button>
        </div>
      )}
    </div>
  )
}
