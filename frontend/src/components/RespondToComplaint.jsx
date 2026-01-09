// import { useState } from "react"
// import { getContract } from "../services/contract"
// import { analyzeAndHash } from "../services/aiService"

// export default function RespondToComplaint({ conflict, reload }) {
//   const [statement, setStatement] = useState("")
//   const [stake, setStake] = useState("")

//   const respond = async () => {
//     const contract = await getContract()

//     await contract.respondToComplaint(
//       conflict.id,
//       statement,
//       BigInt(stake) * 10n ** 18n
//     )

//     const hash = await analyzeAndHash(
//       conflict.accuserStatement,
//       statement
//     )

//     await contract.finalizeConflict(conflict.id, hash)
//     reload()
//   }

//   return (
//     <div>
//       <textarea placeholder="Your response" onChange={e => setStatement(e.target.value)} />
//       <input placeholder="Stake FAIR" onChange={e => setStake(e.target.value)} />
//       <button onClick={respond}>Respond</button>
//     </div>
//   )
// }










"use client"

import { useState } from "react"
import { getContract } from "../services/contract"
import { analyzeAndHash } from "../services/aiService"

const styles = `
  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  @keyframes glowPulse {
    0%, 100% { 
      box-shadow: 0 0 15px rgba(255, 107, 107, 0.4),
                  inset 0 0 15px rgba(255, 107, 107, 0.1);
    }
    50% { 
      box-shadow: 0 0 30px rgba(255, 107, 107, 0.6),
                  inset 0 0 20px rgba(255, 107, 107, 0.2);
    }
  }
  
  .complaint-container {
    background: linear-gradient(135deg, #1a0f2e 0%, #2d1b3d 100%);
    border: 2px solid #ff6b6b;
    border-radius: 16px;
    padding: 28px;
    margin: 20px;
    animation: scaleIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  
  .complaint-title {
    color: #ff6b6b;
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
    text-transform: uppercase;
    letter-spacing: 2px;
  }
  
  .input-field {
    width: 100%;
    background: rgba(255, 107, 107, 0.05);
    border: 2px solid rgba(255, 107, 107, 0.3);
    color: #ff6b6b;
    padding: 12px 16px;
    border-radius: 10px;
    margin-bottom: 14px;
    font-family: inherit;
    font-size: 14px;
    transition: all 0.3s ease;
    animation: scaleIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) backwards;
  }
  
  .input-field:nth-of-type(1) { animation-delay: 0.1s; }
  .input-field:nth-of-type(2) { animation-delay: 0.2s; }
  
  .input-field:focus {
    outline: none;
    border-color: #ff6b6b;
    box-shadow: 0 0 20px rgba(255, 107, 107, 0.4);
    transform: translateY(-2px);
  }
  
  .input-field::placeholder {
    color: rgba(255, 107, 107, 0.4);
  }
  
  .submit-btn {
    width: 100%;
    background: linear-gradient(135deg, #ff6b6b, #ff8787);
    color: white;
    border: none;
    padding: 14px 28px;
    border-radius: 10px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    text-transform: uppercase;
    letter-spacing: 1px;
    transition: all 0.3s ease;
    animation: glowPulse 2s ease-in-out infinite;
  }
  
  .submit-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 25px rgba(255, 107, 107, 0.5);
  }
`

export default function RespondToComplaint({ conflict, reload }) {
  const [statement, setStatement] = useState("")
  const [stake, setStake] = useState("")

  const respond = async () => {
    const contract = await getContract()

    await contract.respondToComplaint(conflict.id, statement, BigInt(stake) * 10n ** 18n)

    const hash = await analyzeAndHash(conflict.accuserStatement, statement)

    await contract.finalizeConflict(conflict.id, hash)
    reload()
  }

  return (
    <>
      <style>{styles}</style>
      <div className="complaint-container">
        <h3 className="complaint-title">Respond to Complaint</h3>
        <textarea
          className="input-field"
          placeholder="Your response"
          onChange={(e) => setStatement(e.target.value)}
          style={{ minHeight: 100, resize: "vertical" }}
        />
        <input
          className="input-field"
          type="number"
          placeholder="Stake FAIR"
          onChange={(e) => setStake(e.target.value)}
        />
        <button className="submit-btn" onClick={respond}>
          Respond Now
        </button>
      </div>
    </>
  )
}
