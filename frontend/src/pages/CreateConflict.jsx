// import { useEffect, useState } from "react"
// import { getContract } from "../services/contract"
// import { pinJSON } from "../services/pinata"
// import { analyzeConflict } from "../services/backend"

// export default function CreateConflict({ account }) {
//   const [conflicts, setConflicts] = useState([])
//   const [accused, setAccused] = useState("")
//   const [statement, setStatement] = useState("")
//   const [stake, setStake] = useState("")

//   const load = async () => {
//     const c = await getContract()
//     const count = Number(await c.conflictCount())
//     const arr = []

//     for (let i = 1; i <= count; i++) {
//       const raw = await c.conflicts(i)
//       arr.push({
//         id: i,
//         accuser: raw[0],
//         accused: raw[1],
//         accuserCID: raw[4],
//         accusedCID: raw[5],
//         aiCID: raw[6],
//         status: Number(raw[10]),
//       })
//     }
//     setConflicts(arr)
//   }

//   useEffect(() => {
//     load()
//   }, [])

//   /* ---------------- CREATE ---------------- */

//   const create = async () => {
//     const pinned = await pinJSON({
//       text: statement,
//       role: "accuser",
//       time: Date.now(),
//     })

//     const c = await getContract()
//     await c.createConflict(
//       accused,
//       pinned.cid,
//       BigInt(stake) * 10n ** 18n
//     )

//     setStatement("")
//     setStake("")
//     load()
//   }

//   /* ---------------- RESPOND ---------------- */

//   const respond = async (id, accuserText) => {
//     const accusedPin = await pinJSON({
//       text: statement,
//       role: "accused",
//       time: Date.now(),
//     })

//     const ai = await analyzeConflict(accuserText, statement)

//     const c = await getContract()
//     await c.respondConflict(
//       id,
//       accusedPin.cid,
//       BigInt(stake) * 10n ** 18n,
//       ai.cid
//     )

//     setStatement("")
//     setStake("")
//     load()
//   }

//   return (
//     <div>
//       <h2>Create Conflict</h2>

//       <input
//         placeholder="Accused address"
//         value={accused}
//         onChange={(e) => setAccused(e.target.value)}
//       />
//       <textarea
//         placeholder="Your statement"
//         value={statement}
//         onChange={(e) => setStatement(e.target.value)}
//       />
//       <input
//         placeholder="Stake FAIR"
//         value={stake}
//         onChange={(e) => setStake(e.target.value)}
//       />
//       <button onClick={create}>Create</button>

//       <hr />

//       <h3>Awaiting Response</h3>

//       {conflicts.map(
//         (c) =>
//           c.status === 0 &&
//           c.accused.toLowerCase() === account?.toLowerCase() && (
//             <div key={c.id}>
//               <p>Conflict #{c.id}</p>
//               <textarea
//                 placeholder="Your response"
//                 onChange={(e) => setStatement(e.target.value)}
//               />
//               <input
//                 placeholder="Stake FAIR"
//                 onChange={(e) => setStake(e.target.value)}
//               />
//               <button onClick={() => respond(c.id, accused.text)}>
//                 Respond
//               </button>
//             </div>
//           )
//       )}
//     </div>
//   )
// }











"use client"

import { useEffect, useState } from "react"
import { getContract } from "../services/contract"
import { pinJSON } from "../services/pinata"
import { analyzeConflict } from "../services/backend"

const styles = `
  @keyframes popIn {
    from {
      opacity: 0;
      transform: scale(0.8) rotateY(10deg);
    }
    to {
      opacity: 1;
      transform: scale(1) rotateY(0);
    }
  }
  
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
  }
  
  .create-container {
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
    padding: 32px;
    min-height: 100vh;
  }
  
  .create-header {
    color: #ff6b6b;
    font-size: 32px;
    font-weight: bold;
    margin-bottom: 32px;
    text-transform: uppercase;
    letter-spacing: 2px;
    animation: popIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
    text-shadow: 0 0 20px rgba(255, 107, 107, 0.3);
  }
  
  .form-section {
    background: linear-gradient(135deg, #1a0f2e 0%, #2d1b3d 100%);
    border: 2px solid #ff6b6b;
    border-radius: 16px;
    padding: 28px;
    margin-bottom: 32px;
    animation: popIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  
  .form-section-title {
    color: #ff6b6b;
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 16px;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  
  .form-field {
    margin-bottom: 16px;
    animation: popIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) backwards;
  }
  
  .form-field:nth-child(1) { animation-delay: 0.1s; }
  .form-field:nth-child(2) { animation-delay: 0.2s; }
  .form-field:nth-child(3) { animation-delay: 0.3s; }
  .form-field:nth-child(4) { animation-delay: 0.4s; }
  
  .form-input, .form-textarea {
    width: 100%;
    background: rgba(15, 23, 42, 0.7);
    border: 2px solid rgba(255, 107, 107, 0.3);
    color: #ff6b6b;
    padding: 12px 16px;
    border-radius: 10px;
    font-family: inherit;
    font-size: 14px;
    transition: all 0.3s ease;
  }
  
  .form-textarea {
    min-height: 100px;
    resize: vertical;
  }
  
  .form-input:focus, .form-textarea:focus {
    outline: none;
    border-color: #ff6b6b;
    box-shadow: 0 0 20px rgba(255, 107, 107, 0.4);
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
    animation: popIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.4s backwards;
  }
  
  .submit-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 25px rgba(255, 107, 107, 0.5);
  }
  
  .divider {
    border: none;
    border-top: 2px solid rgba(255, 107, 107, 0.2);
    margin: 32px 0;
  }
  
  .awaiting-section {
    margin-top: 32px;
  }
  
  .awaiting-header {
    color: #ffc107;
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
    text-transform: uppercase;
    animation: popIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.5s backwards;
  }
  
  .awaiting-card {
    background: linear-gradient(135deg, #2d2415 0%, #3d3220 100%);
    border: 2px solid #ffc107;
    border-radius: 16px;
    padding: 20px;
    margin-bottom: 16px;
    animation: popIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) backwards;
  }
  
  .awaiting-card:nth-child(2) { animation-delay: 0.6s; }
  .awaiting-card:nth-child(3) { animation-delay: 0.7s; }
  .awaiting-card:nth-child(4) { animation-delay: 0.8s; }
  
  .awaiting-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 0 25px rgba(255, 193, 7, 0.3);
  }
  
  .conflict-id-badge {
    color: #ffc107;
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 10px;
  }
  
  .empty-state {
    text-align: center;
    color: #94a3b8;
    padding: 60px 20px;
    font-size: 18px;
  }
`

export default function CreateConflict({ account }) {
  const [conflicts, setConflicts] = useState([])
  const [accused, setAccused] = useState("")
  const [statement, setStatement] = useState("")
  const [stake, setStake] = useState("")

  const load = async () => {
    const c = await getContract()
    const count = Number(await c.conflictCount())
    const arr = []

    for (let i = 1; i <= count; i++) {
      const raw = await c.conflicts(i)
      arr.push({
        id: i,
        accuser: raw[0],
        accused: raw[1],
        accuserCID: raw[4],
        accusedCID: raw[5],
        aiCID: raw[6],
        status: Number(raw[10]),
      })
    }
    setConflicts(arr)
  }

  useEffect(() => {
    load()
  }, [])

  const create = async () => {
    const pinned = await pinJSON({
      text: statement,
      role: "accuser",
      time: Date.now(),
    })

    const c = await getContract()
    await c.createConflict(accused, pinned.cid, BigInt(stake) * 10n ** 18n)

    setStatement("")
    setStake("")
    load()
  }

  const respond = async (id, accuserText) => {
    const accusedPin = await pinJSON({
      text: statement,
      role: "accused",
      time: Date.now(),
    })

    const ai = await analyzeConflict(accuserText, statement)

    const c = await getContract()
    await c.respondConflict(id, accusedPin.cid, BigInt(stake) * 10n ** 18n, ai.cid)

    setStatement("")
    setStake("")
    load()
  }

  const awaitingConflicts = conflicts.filter(
    (c) => c.status === 0 && c.accused.toLowerCase() === account?.toLowerCase(),
  )

  return (
    <>
      <style>{styles}</style>
      <div className="create-container">
        <h2 className="create-header">⚔️ Battle Arena - Create Conflict</h2>

        <div className="form-section">
          <h3 className="form-section-title">File Your Complaint</h3>

          <div className="form-field">
            <input
              className="form-input"
              placeholder="Accused Wallet Address"
              value={accused}
              onChange={(e) => setAccused(e.target.value)}
            />
          </div>

          <div className="form-field">
            <textarea
              className="form-textarea"
              placeholder="State your claim (be clear and concise)"
              value={statement}
              onChange={(e) => setStatement(e.target.value)}
            />
          </div>

          <div className="form-field">
            <input
              className="form-input"
              type="number"
              placeholder="Stake FAIR (amount you're willing to risk)"
              value={stake}
              onChange={(e) => setStake(e.target.value)}
            />
          </div>

          <button className="submit-btn" onClick={create}>
            ⚔️ Create Conflict
          </button>
        </div>

        {awaitingConflicts.length > 0 && (
          <div className="awaiting-section">
            <h3 className="awaiting-header">⏳ Awaiting Your Response</h3>

            {awaitingConflicts.length === 0 ? (
              <div className="empty-state">No conflicts awaiting your response</div>
            ) : (
              awaitingConflicts.map((c) => (
                <div key={c.id} className="awaiting-card">
                  <div className="conflict-id-badge">Conflict #{c.id}</div>

                  <div className="form-field">
                    <textarea
                      className="form-textarea"
                      placeholder="Your defense statement"
                      onChange={(e) => setStatement(e.target.value)}
                    />
                  </div>

                  <div className="form-field">
                    <input
                      className="form-input"
                      type="number"
                      placeholder="Stake FAIR"
                      onChange={(e) => setStake(e.target.value)}
                    />
                  </div>

                  <button
                    className="submit-btn"
                    onClick={() => respond(c.id, c.accuserCID)}
                    style={{ background: "linear-gradient(135deg, #ffc107, #ff9500)", marginTop: 10 }}
                  >
                    🛡️ Submit Response
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </>
  )
}
