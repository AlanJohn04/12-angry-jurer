

// import { useEffect, useState } from "react"
// import { getContract } from "../services/contract"

// export default function Header({ account }) {
//   const [rep, setRep] = useState(0)
//   const [balance, setBalance] = useState("0.00")

//   // Load FAIR balance + reputation from ConflictNet contract
//   const loadProfile = async () => {
//     if (!account) return

//     const contract = await getContract()

//     const repVal = await contract.reputation(account)
//     const balVal = await contract.balanceOf(account)

//     setRep(Number(repVal))
//     setBalance((Number(balVal) / 1e18).toFixed(2))
//   }

//   // Faucet: mint FAIR internally
//   const getFair = async () => {
//     const contract = await getContract()
//     const tx = await contract.faucet(100n * 10n ** 18n)
//     await tx.wait()          // wait for mining
//     await loadProfile()      // refresh UI
//   }

//   useEffect(() => {
//     loadProfile()
//   }, [account])

//   return (
//     <div style={{ marginBottom: "20px" }}>
//       <h1>CONFLICTNET</h1>

//       <p><b>Address:</b> {account || "Not connected"}</p>
//       <p><b>FAIR Balance:</b> {balance}</p>
//       <p><b>Reputation:</b> {rep}</p>

//       <button onClick={getFair}>Get FAIR</button>
//     </div>
//   )
// }













"use client"

import { useEffect, useState } from "react"
import { getContract } from "../services/contract"

export default function Header({ account }) {
  const [rep, setRep] = useState(0)
  const [balance, setBalance] = useState("0.00")

  const loadProfile = async () => {
    if (!account) return
    const contract = await getContract()
    const repVal = await contract.reputation(account)
    const balVal = await contract.balanceOf(account)
    setRep(Number(repVal))
    setBalance((Number(balVal) / 1e18).toFixed(2))
  }

  const getFair = async () => {
    const contract = await getContract()
    const tx = await contract.faucet(100n * 10n ** 18n)
    await tx.wait()
    await loadProfile()
  }

  useEffect(() => {
    loadProfile()
  }, [account])

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        padding: "24px",
        borderBottom: "2px solid #00d9ff",
        boxShadow: "0 0 20px rgba(0, 217, 255, 0.2)",
        marginBottom: "20px",
      }}
    >
      <style>{`
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 10px rgba(0, 217, 255, 0.3), inset 0 0 10px rgba(0, 217, 255, 0.1); }
          50% { box-shadow: 0 0 20px rgba(0, 217, 255, 0.5), inset 0 0 15px rgba(0, 217, 255, 0.2); }
        }
        .stat-glow {
          animation: glow 3s ease-in-out infinite;
        }
      `}</style>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h1
          style={{
            fontSize: "32px",
            fontWeight: "900",
            color: "#00d9ff",
            textShadow: "0 0 20px rgba(0, 217, 255, 0.6), 0 0 40px rgba(0, 217, 255, 0.3)",
            margin: 0,
            letterSpacing: "2px",
          }}
        >
          ⚔ CONFLICTNET ⚔
        </h1>

        <button
          onClick={getFair}
          style={{
            background: "linear-gradient(135deg, #39ff14 0%, #00d9ff 100%)",
            border: "2px solid #39ff14",
            color: "#0f172a",
            padding: "10px 20px",
            borderRadius: "8px",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "all 0.3s ease",
            boxShadow: "0 0 15px rgba(57, 255, 20, 0.4)",
          }}
          onMouseEnter={(e) => (e.target.style.boxShadow = "0 0 25px rgba(57, 255, 20, 0.7)")}
          onMouseLeave={(e) => (e.target.style.boxShadow = "0 0 15px rgba(57, 255, 20, 0.4)")}
        >
          Get FAIR
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "16px",
        }}
      >
        {/* Address Stat */}
        <div
          className="stat-glow"
          style={{
            background: "rgba(30, 41, 59, 0.8)",
            border: "1px solid #00d9ff",
            padding: "16px",
            borderRadius: "12px",
            backdropFilter: "blur(10px)",
          }}
        >
          <p
            style={{
              color: "#64748b",
              fontSize: "12px",
              margin: "0 0 8px 0",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            Wallet
          </p>
          <p style={{ color: "#00d9ff", fontSize: "13px", margin: 0, wordBreak: "break-all", fontFamily: "monospace" }}>
            {account ? `${account.slice(0, 10)}...${account.slice(-8)}` : "Not connected"}
          </p>
        </div>

        {/* Balance Stat */}
        <div
          className="stat-glow"
          style={{
            background: "rgba(30, 41, 59, 0.8)",
            border: "1px solid #39ff14",
            padding: "16px",
            borderRadius: "12px",
            backdropFilter: "blur(10px)",
          }}
        >
          <p
            style={{
              color: "#64748b",
              fontSize: "12px",
              margin: "0 0 8px 0",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            FAIR Balance
          </p>
          <p
            style={{
              color: "#39ff14",
              fontSize: "20px",
              fontWeight: "bold",
              margin: 0,
              textShadow: "0 0 10px rgba(57, 255, 20, 0.5)",
            }}
          >
            {balance} FAIR
          </p>
        </div>

        {/* Reputation Stat */}
        <div
          className="stat-glow"
          style={{
            background: "rgba(30, 41, 59, 0.8)",
            border: "1px solid #ffd700",
            padding: "16px",
            borderRadius: "12px",
            backdropFilter: "blur(10px)",
          }}
        >
          <p
            style={{
              color: "#64748b",
              fontSize: "12px",
              margin: "0 0 8px 0",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            Reputation
          </p>
          <p
            style={{
              color: "#ffd700",
              fontSize: "20px",
              fontWeight: "bold",
              margin: 0,
              textShadow: "0 0 10px rgba(255, 215, 0, 0.5)",
            }}
          >
            {rep} REP
          </p>
        </div>
      </div>
    </div>
  )
}
