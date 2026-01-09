



// import { useEffect, useState } from "react"
// import { getContract } from "../services/contract"
// import { fetchFromIPFS } from "../services/ipfs"

// export default function Resolved() {
//   const [cases, setCases] = useState([])
//   const [details, setDetails] = useState({})

//   const load = async () => {
//     const c = await getContract()
//     const count = Number(await c.conflictCount())
//     const arr = []

//     for (let i = 1; i <= count; i++) {
//       const raw = await c.conflicts(i)
//       if (Number(raw.status) === 2) {
//         arr.push({ id: i, ...raw })
//       }
//     }

//     setCases(arr)

//     const d = {}
//     for (const c of arr) {
//       d[c.id] = {
//         a: await fetchFromIPFS(c.accuserCID),
//         b: await fetchFromIPFS(c.accusedCID),
//         ai: await fetchFromIPFS(c.aiCID),
//       }
//     }
//     setDetails(d)
//   }

//   useEffect(() => {
//     load()
//   }, [])

//   return (
//     <div>
//       <h2>Resolved Conflicts</h2>

//       {cases.map((c) => (
//         <div key={c.id} style={{ border: "1px solid #444", padding: 15 }}>
//           <h3>Conflict #{c.id}</h3>

//           <p>
//             <b>Verdict:</b>{" "}
//             {c.verdict ? "Accuser Wins" : "Accused Wins"}
//           </p>

//           <p><b>Jury Yes:</b> {Number(c.juryYes)}</p>
//           <p><b>Jury No:</b> {Number(c.juryNo)}</p>

//           <h4>AI Summary</h4>
//           <p>{details[c.id]?.ai?.summary || "—"}</p>
//         </div>
//       ))}
//     </div>
//   )
// }











"use client"

import { useEffect, useState } from "react"
import { getContract } from "../services/contract"
import { fetchFromIPFS } from "../services/ipfs"

const styles = `
  @keyframes fadeInScale {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  @keyframes victoryPulse {
    0%, 100% { 
      box-shadow: 0 0 20px rgba(57, 255, 20, 0.4);
      transform: scale(1);
    }
    50% { 
      box-shadow: 0 0 40px rgba(57, 255, 20, 0.6);
      transform: scale(1.02);
    }
  }
  
  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  .resolved-container {
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
    padding: 32px;
    min-height: 100vh;
  }
  
  .resolved-header {
    color: #39ff14;
    font-size: 32px;
    font-weight: bold;
    margin-bottom: 32px;
    text-transform: uppercase;
    letter-spacing: 2px;
    text-shadow: 0 0 20px rgba(57, 255, 20, 0.4);
    animation: slideInRight 0.7s ease-out;
  }
  
  .case-card {
    background: linear-gradient(135deg, #1a3a2a 0%, #0f2e1f 100%);
    border: 2px solid #39ff14;
    border-radius: 16px;
    padding: 28px;
    margin-bottom: 24px;
    animation: fadeInScale 0.6s ease-out backwards;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }
  
  .case-card:nth-child(2) { animation-delay: 0.1s; }
  .case-card:nth-child(3) { animation-delay: 0.2s; }
  .case-card:nth-child(4) { animation-delay: 0.3s; }
  .case-card:nth-child(5) { animation-delay: 0.4s; }
  
  .case-card:hover {
    transform: translateY(-8px);
    animation: victoryPulse 1s ease-in-out infinite;
  }
  
  .case-title {
    color: #00d9ff;
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 16px;
    text-transform: uppercase;
  }
  
  .verdict-badge {
    display: inline-block;
    padding: 10px 20px;
    border-radius: 25px;
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 16px;
    text-transform: uppercase;
    letter-spacing: 1px;
    animation: fadeInScale 0.6s ease-out 0.2s backwards;
  }
  
  .verdict-accuser {
    background: linear-gradient(135deg, #ffd700, #ff9500);
    color: #0f172a;
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.4);
  }
  
  .verdict-accused {
    background: linear-gradient(135deg, #00d9ff, #39ff14);
    color: #0f172a;
    box-shadow: 0 0 20px rgba(0, 217, 255, 0.4);
  }
  
  .vote-result {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin: 20px 0;
    animation: slideInRight 0.6s ease-out 0.3s backwards;
  }
  
  .vote-stat {
    background: rgba(0, 217, 255, 0.1);
    border-left: 4px solid #00d9ff;
    padding: 16px;
    border-radius: 8px;
  }
  
  .vote-stat.yes {
    border-left-color: #39ff14;
    background: rgba(57, 255, 20, 0.1);
  }
  
  .vote-label {
    color: #94a3b8;
    font-size: 12px;
    text-transform: uppercase;
    margin-bottom: 6px;
  }
  
  .vote-number {
    color: #39ff14;
    font-size: 28px;
    font-weight: bold;
  }
  
  .vote-stat.no .vote-number {
    color: #ff6b6b;
  }
  
  .ai-summary {
    background: rgba(0, 217, 255, 0.05);
    border: 2px solid rgba(0, 217, 255, 0.3);
    padding: 16px;
    border-radius: 12px;
    margin-top: 20px;
    color: #00d9ff;
    line-height: 1.6;
    animation: slideInRight 0.6s ease-out 0.4s backwards;
  }
  
  .ai-label {
    color: #94a3b8;
    font-size: 12px;
    text-transform: uppercase;
    margin-bottom: 8px;
    letter-spacing: 1px;
  }
  
  .empty-state {
    text-align: center;
    color: #94a3b8;
    padding: 80px 20px;
    font-size: 18px;
  }
`

export default function Resolved() {
  const [cases, setCases] = useState([])
  const [details, setDetails] = useState({})

  const load = async () => {
    const c = await getContract()
    const count = Number(await c.conflictCount())
    const arr = []

    for (let i = 1; i <= count; i++) {
      const raw = await c.conflicts(i)
      if (Number(raw.status) === 2) {
        arr.push({ id: i, ...raw })
      }
    }

    setCases(arr)

    const d = {}
    for (const c of arr) {
      d[c.id] = {
        a: await fetchFromIPFS(c.accuserCID),
        b: await fetchFromIPFS(c.accusedCID),
        ai: await fetchFromIPFS(c.aiCID),
      }
    }
    setDetails(d)
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <>
      <style>{styles}</style>
      <div className="resolved-container">
        <h2 className="resolved-header">🏆 Resolved Cases</h2>

        {cases.length === 0 ? (
          <div className="empty-state">No resolved cases yet. Awaiting verdicts...</div>
        ) : (
          cases.map((c) => (
            <div key={c.id} className="case-card">
              <h3 className="case-title">Case #{c.id}</h3>

              <div className={`verdict-badge ${c.verdict ? "verdict-accuser" : "verdict-accused"}`}>
                {c.verdict ? "⚔️ Accuser Wins" : "🛡️ Accused Wins"}
              </div>

              <div className="vote-result">
                <div className="vote-stat yes">
                  <div className="vote-label">Jury Yes</div>
                  <div className="vote-number">{Number(c.juryYes)}</div>
                </div>
                <div className="vote-stat no">
                  <div className="vote-label">Jury No</div>
                  <div className="vote-number">{Number(c.juryNo)}</div>
                </div>
              </div>

              <div className="ai-summary">
                <div className="ai-label">AI Neutral Summary</div>
                <p>{details[c.id]?.ai?.summary || "Loading summary..."}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  )
}
