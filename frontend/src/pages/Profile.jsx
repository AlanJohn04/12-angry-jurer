// import { useEffect, useState } from "react"
// import { getContract } from "../services/contract"

// export default function Profile({ account }) {
//   const [balance, setBalance] = useState("0.00")
//   const [rep, setRep] = useState(0)

//   const loadProfile = async () => {
//     if (!account) return

//     const c = await getContract()
//     const bal = await c.balanceOf(account)
//     const r = await c.reputation(account)

//     setBalance((Number(bal) / 1e18).toFixed(2))
//     setRep(Number(r))
//   }

//   useEffect(() => {
//     loadProfile()
//   }, [account])

//   return (
//     <div>
//       <h2>Profile</h2>
      

//       <p><b>Address:</b> {account}</p>
//       <p><b>FAIR Balance:</b> {balance}</p>
//       <p><b>Reputation:</b> {rep}</p>

//       <p>
//         <b>Status:</b>{" "}
//         {rep >= 20 ? "🧑‍⚖️ Juror" : "👀 Audience"}
//       </p>
//       <div style={{ width: "300px", background: "#333" }}>
//   <div
//     style={{
//       width: `${Math.min((rep / 20) * 100, 100)}%`,
//       background: "#4caf50",
//       height: "10px",
//     }}
//   />
// </div>
// <p>{rep}/20 to become Juror</p>

//     </div>
//   )
// }












"use client"

import { useEffect, useState } from "react"
import { getContract } from "../services/contract"

const styles = `
  @keyframes pulseGlow {
    0%, 100% { text-shadow: 0 0 10px rgba(0, 217, 255, 0.5); }
    50% { text-shadow: 0 0 20px rgba(0, 217, 255, 0.8); }
  }
  
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes shimmer {
    0% { background-position: -1000px 0; }
    100% { background-position: 1000px 0; }
  }
  
  @keyframes progressFill {
    from { width: 0%; }
    to { width: var(--progress); }
  }
  
  .profile-container {
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
    border: 2px solid #00d9ff;
    border-radius: 16px;
    padding: 32px;
    margin: 20px;
    animation: slideIn 0.6s ease-out;
    box-shadow: 0 0 30px rgba(0, 217, 255, 0.3),
                inset 0 0 30px rgba(0, 217, 255, 0.1);
  }
  
  .profile-title {
    color: #00d9ff;
    font-size: 28px;
    font-weight: bold;
    margin-bottom: 20px;
    animation: pulseGlow 2s ease-in-out infinite;
    text-transform: uppercase;
    letter-spacing: 2px;
  }
  
  .profile-stat {
    background: rgba(0, 217, 255, 0.05);
    border-left: 4px solid #39ff14;
    padding: 16px;
    margin: 12px 0;
    border-radius: 8px;
    animation: slideIn 0.6s ease-out backwards;
    transition: all 0.3s ease;
  }
  
  .profile-stat:nth-child(2) { animation-delay: 0.1s; }
  .profile-stat:nth-child(3) { animation-delay: 0.2s; }
  .profile-stat:nth-child(4) { animation-delay: 0.3s; }
  .profile-stat:nth-child(5) { animation-delay: 0.4s; }
  
  .profile-stat:hover {
    background: rgba(0, 217, 255, 0.15);
    transform: translateX(10px);
    box-shadow: 0 0 20px rgba(57, 255, 20, 0.4);
  }
  
  .stat-label {
    color: #94a3b8;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 6px;
  }
  
  .stat-value {
    color: #00ffff;
    font-size: 24px;
    font-weight: bold;
  }
  
  .reputation-section {
    background: rgba(57, 255, 20, 0.05);
    border: 2px solid #39ff14;
    border-radius: 12px;
    padding: 20px;
    margin-top: 20px;
    animation: slideIn 0.6s ease-out 0.5s backwards;
  }
  
  .progress-bar-container {
    width: 100%;
    height: 8px;
    background: rgba(15, 23, 42, 0.8);
    border-radius: 4px;
    overflow: hidden;
    margin: 12px 0;
    box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.5);
  }
  
  .progress-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, #39ff14, #00d9ff, #ffd700);
    border-radius: 4px;
    animation: progressFill 1.2s ease-out;
    box-shadow: 0 0 10px rgba(57, 255, 20, 0.6);
  }
  
  .status-badge {
    display: inline-block;
    background: linear-gradient(135deg, #ffd700, #ff9500);
    color: #0f172a;
    padding: 8px 16px;
    border-radius: 20px;
    font-weight: bold;
    font-size: 14px;
    margin-top: 12px;
    animation: slideIn 0.6s ease-out 0.6s backwards;
    box-shadow: 0 0 15px rgba(255, 215, 0, 0.4);
  }
  
  .status-badge.juror {
    background: linear-gradient(135deg, #00d9ff, #39ff14);
    color: #0f172a;
  }
`

export default function Profile({ account }) {
  const [balance, setBalance] = useState("0.00")
  const [rep, setRep] = useState(0)

  const loadProfile = async () => {
    if (!account) return

    const c = await getContract()
    const bal = await c.balanceOf(account)
    const r = await c.reputation(account)

    setBalance((Number(bal) / 1e18).toFixed(2))
    setRep(Number(r))
  }

  useEffect(() => {
    loadProfile()
  }, [account])

  const progressPercent = Math.min((rep / 20) * 100, 100)

  return (
    <>
      <style>{styles}</style>
      <div className="profile-container">
        <h2 className="profile-title">Juror Profile</h2>

        <div className="profile-stat">
          <div className="stat-label">Wallet Address</div>
          <div className="stat-value" style={{ fontSize: 14 }}>
            {account?.slice(0, 10)}...{account?.slice(-8)}
          </div>
        </div>

        <div className="profile-stat">
          <div className="stat-label">FAIR Balance</div>
          <div className="stat-value">{balance} FAIR</div>
        </div>

        <div className="profile-stat">
          <div className="stat-label">Reputation Score</div>
          <div className="stat-value">{rep}</div>
        </div>

        <div className="reputation-section">
          <div className="stat-label">Juror Progression</div>
          <div className="progress-bar-container">
            <div
              className="progress-bar-fill"
              style={{ "--progress": `${progressPercent}%`, width: `${progressPercent}%` }}
            />
          </div>
          <div style={{ color: "#00d9ff", fontSize: 14, fontWeight: "bold" }}>{rep}/20 to become Juror</div>
        </div>

        <div className={`status-badge ${rep >= 20 ? "juror" : ""}`}>
          {rep >= 20 ? "⚖️ JUROR UNLOCKED" : "👁️ AUDIENCE MODE"}
        </div>
      </div>
    </>
  )
}
