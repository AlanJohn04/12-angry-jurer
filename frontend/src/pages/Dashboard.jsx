


// import { useEffect, useState } from "react"
// import { getContract } from "../services/contract"
// import RespondConflict from "./RespondConflict"

// export default function Dashboard({ account }) {
//   const [conflicts, setConflicts] = useState([])

//   useEffect(() => {
//     load()
//   }, [])

//   const load = async () => {
//     const c = await getContract()
//     const count = await c.conflictCount()
//     const arr = []

//     for (let i = 1; i <= count; i++) {
//       const cf = await c.conflicts(i)
//       arr.push({ ...cf, id: i })
//     }

//     setConflicts(arr)
//   }

//   return (
//     <div>
//       <h3>Active Conflicts</h3>

//       {conflicts.map(c => (
//         <div key={c.id} style={{ border: "1px solid gray", padding: 10 }}>
//           <p>ID: {c.id}</p>
//           <p>Status: {["Awaiting Response", "Jury Open", "Resolved"][c.status]}</p>

//           {/* ONLY accused can respond */}
//           {c.status === 0 && c.accused === account && (
//             <RespondConflict conflictId={c.id} />
//           )}
//         </div>
//       ))}
//     </div>
//   )
// }













"use client"

import { useEffect, useState } from "react"
import { getContract } from "../services/contract"
import RespondConflict from "./RespondConflict"

const styles = `
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes cardHover {
    0% { transform: translateY(0) rotateX(0); }
    100% { transform: translateY(-5px) rotateX(5deg); }
  }
  
  .dashboard-container {
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
    padding: 32px;
    min-height: 100vh;
  }
  
  .dashboard-header {
    color: #00d9ff;
    font-size: 32px;
    font-weight: bold;
    margin-bottom: 32px;
    text-transform: uppercase;
    letter-spacing: 2px;
    animation: slideDown 0.6s ease-out;
    text-shadow: 0 0 20px rgba(0, 217, 255, 0.3);
  }
  
  .conflicts-grid {
    display: grid;
    gap: 20px;
  }
  
  .conflict-card {
    background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
    border: 2px solid #00d9ff;
    border-radius: 16px;
    padding: 24px;
    animation: slideDown 0.6s ease-out backwards;
    transition: all 0.3s ease;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  
  .conflict-card:nth-child(1) { animation-delay: 0.1s; }
  .conflict-card:nth-child(2) { animation-delay: 0.2s; }
  .conflict-card:nth-child(3) { animation-delay: 0.3s; }
  .conflict-card:nth-child(4) { animation-delay: 0.4s; }
  .conflict-card:nth-child(5) { animation-delay: 0.5s; }
  
  .conflict-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 0 40px rgba(0, 217, 255, 0.4);
    border-color: #39ff14;
  }
  
  .conflict-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(57, 255, 20, 0.2), transparent);
    animation: shimmer 2s infinite;
  }
  
  @keyframes shimmer {
    0% { left: -100%; }
    100% { left: 100%; }
  }
  
  .conflict-id {
    color: #ffd700;
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 8px;
  }
  
  .conflict-status {
    display: inline-block;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: bold;
    text-transform: uppercase;
    margin-bottom: 16px;
    animation: slideDown 0.6s ease-out 0.2s backwards;
  }
  
  .status-awaiting {
    background: rgba(255, 193, 7, 0.2);
    border: 1px solid #ffc107;
    color: #ffc107;
  }
  
  .status-jury {
    background: rgba(0, 217, 255, 0.2);
    border: 1px solid #00d9ff;
    color: #00d9ff;
  }
  
  .status-resolved {
    background: rgba(57, 255, 20, 0.2);
    border: 1px solid #39ff14;
    color: #39ff14;
  }
  
  .conflict-info {
    color: #94a3b8;
    font-size: 14px;
    margin-bottom: 16px;
    animation: slideDown 0.6s ease-out 0.3s backwards;
  }
  
  .respond-wrapper {
    animation: slideDown 0.6s ease-out 0.4s backwards;
  }
  
  .empty-state {
    text-align: center;
    color: #94a3b8;
    padding: 60px 20px;
    font-size: 18px;
  }
`

export default function Dashboard({ account }) {
  const [conflicts, setConflicts] = useState([])

  useEffect(() => {
    load()
  }, [])

  const load = async () => {
    const c = await getContract()
    const count = await c.conflictCount()
    const arr = []

    for (let i = 1; i <= count; i++) {
      const cf = await c.conflicts(i)
      arr.push({ ...cf, id: i })
    }

    setConflicts(arr)
  }

  const statusMap = ["Awaiting Response", "Jury Open", "Resolved"]
  const statusClassMap = ["status-awaiting", "status-jury", "status-resolved"]

  return (
    <>
      <style>{styles}</style>
      <div className="dashboard-container">
        <h2 className="dashboard-header">⚔️ Active Conflicts</h2>

        {conflicts.length === 0 ? (
          <div className="empty-state">No active conflicts. The battlefield is calm...</div>
        ) : (
          <div className="conflicts-grid">
            {conflicts.map((c, idx) => (
              <div key={c.id} className="conflict-card">
                <div className="conflict-id">Conflict #{c.id}</div>
                <div className={`conflict-status ${statusClassMap[c.status]}`}>{statusMap[c.status]}</div>

                <div className="conflict-info">
                  <p>Accuser: {c.accuser?.slice(0, 10)}...</p>
                  <p>Accused: {c.accused?.slice(0, 10)}...</p>
                </div>

                {c.status === 0 && c.accused === account && (
                  <div className="respond-wrapper">
                    <RespondConflict conflictId={c.id} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
