// import { useState } from "react"
// import { getContract } from "../services/contract"
// import { analyzeConflict } from "../services/backend"

// export default function RespondConflict({ conflictId }) {
//   const [statement, setStatement] = useState("")
//   const [stake, setStake] = useState("")
//   const [loading, setLoading] = useState(false)

//   const respond = async () => {
//     setLoading(true)

//     // 1. Call AI backend
//     const ai = await analyzeConflict("placeholder A", statement)

//     // 2. Respond on-chain
//     const c = await getContract()
//     await c.respondConflict(
//       conflictId,
//       ai.cid,
//       BigInt(stake) * 10n ** 18n,
//       ai.cid
//     )

//     alert("Response submitted. Jury is now open.")
//     setLoading(false)
//   }

//   return (
//     <div>
//       <textarea
//         placeholder="Your response statement"
//         onChange={e => setStatement(e.target.value)}
//       />
//       <input
//         placeholder="Stake FAIR"
//         onChange={e => setStake(e.target.value)}
//       />
//       <button onClick={respond} disabled={loading}>
//         {loading ? "Submitting..." : "Respond"}
//       </button>
//     </div>
//   )
// }












"use client"

import { useState } from "react"
import { getContract } from "../services/contract"
import { analyzeConflict } from "../services/backend"

const styles = `
  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes buttonPulse {
    0%, 100% { box-shadow: 0 0 10px rgba(57, 255, 20, 0.5); }
    50% { box-shadow: 0 0 25px rgba(57, 255, 20, 0.8); }
  }
  
  .respond-container {
    background: linear-gradient(135deg, #0f172a 0%, #1a0f3a 100%);
    border: 2px solid #39ff14;
    border-radius: 16px;
    padding: 28px;
    margin: 20px;
    animation: slideInLeft 0.7s ease-out;
    box-shadow: 0 0 40px rgba(57, 255, 20, 0.2);
  }
  
  .respond-header {
    color: #39ff14;
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
    text-transform: uppercase;
    letter-spacing: 2px;
  }
  
  .form-group {
    margin-bottom: 16px;
    animation: fadeIn 0.6s ease-out backwards;
  }
  
  .form-group:nth-child(2) { animation-delay: 0.1s; }
  .form-group:nth-child(3) { animation-delay: 0.2s; }
  .form-group:nth-child(4) { animation-delay: 0.3s; }
  
  .form-input, .form-textarea {
    width: 100%;
    background: rgba(15, 23, 42, 0.7);
    border: 2px solid rgba(0, 217, 255, 0.3);
    border-radius: 10px;
    padding: 12px 16px;
    color: #00d9ff;
    font-family: inherit;
    font-size: 14px;
    transition: all 0.3s ease;
  }
  
  .form-textarea {
    min-height: 120px;
    resize: vertical;
  }
  
  .form-input:focus, .form-textarea:focus {
    outline: none;
    border-color: #00d9ff;
    box-shadow: 0 0 20px rgba(0, 217, 255, 0.4),
                inset 0 0 10px rgba(0, 217, 255, 0.1);
    transform: translateY(-2px);
  }
  
  .form-input::placeholder, .form-textarea::placeholder {
    color: rgba(0, 217, 255, 0.4);
  }
  
  .submit-button {
    width: 100%;
    background: linear-gradient(135deg, #39ff14, #00d9ff);
    color: #0f172a;
    border: none;
    padding: 14px 28px;
    border-radius: 10px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    text-transform: uppercase;
    letter-spacing: 1px;
    transition: all 0.3s ease;
    animation: buttonPulse 2s ease-in-out infinite;
  }
  
  .submit-button:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(57, 255, 20, 0.5);
  }
  
  .submit-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: linear-gradient(135deg, #6b7280, #4b5563);
  }
  
  .loading-text {
    color: #ffd700;
    font-weight: bold;
  }
`

export default function RespondConflict({ conflictId }) {
  const [statement, setStatement] = useState("")
  const [stake, setStake] = useState("")
  const [loading, setLoading] = useState(false)

  const respond = async () => {
    setLoading(true)

    const ai = await analyzeConflict("placeholder A", statement)

    const c = await getContract()
    await c.respondConflict(conflictId, ai.cid, BigInt(stake) * 10n ** 18n, ai.cid)

    alert("Response submitted. Jury is now open.")
    setLoading(false)
  }

  return (
    <>
      <style>{styles}</style>
      <div className="respond-container">
        <h3 className="respond-header">Counter-Strike Response</h3>

        <div className="form-group">
          <textarea
            className="form-textarea"
            placeholder="Your defense statement (make it compelling!)"
            value={statement}
            onChange={(e) => setStatement(e.target.value)}
          />
        </div>

        <div className="form-group">
          <input
            className="form-input"
            type="number"
            placeholder="Stake FAIR (higher stake = stronger claim)"
            value={stake}
            onChange={(e) => setStake(e.target.value)}
          />
        </div>

        <button className="submit-button" onClick={respond} disabled={loading}>
          {loading ? <span className="loading-text">⚔️ Submitting Response...</span> : "SUBMIT RESPONSE"}
        </button>
      </div>
    </>
  )
}
