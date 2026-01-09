
// import { useEffect, useState } from "react";
// import axios from "axios";

// export default function JuryLeaderboard(){
//   const [data,setData]=useState({});

//   useEffect(()=>{
//     axios.get("http://localhost:8000/leaderboard")
//       .then(r=>setData(r.data));
//   },[]);

//   return (
//     <div>
//       <h2>Juror Leaderboard</h2>
//       {Object.entries(data).map(([addr,rep])=>(
//         <div key={addr}>
//           {addr.slice(0,6)}… — {rep}
//           <progress value={rep} max="100" />
//         </div>
//       ))}
//     </div>
//   );
// }












"use client"

import { useEffect, useState } from "react"
import axios from "axios"

const styles = `
  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes countUp {
    from {
      transform: translateY(10px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  
  @keyframes goldGlow {
    0%, 100% { 
      box-shadow: 0 0 15px rgba(255, 215, 0, 0.4),
                  inset 0 0 15px rgba(255, 215, 0, 0.1);
    }
    50% { 
      box-shadow: 0 0 30px rgba(255, 215, 0, 0.6),
                  inset 0 0 20px rgba(255, 215, 0, 0.2);
    }
  }
  
  .leaderboard-container {
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
    padding: 32px;
    min-height: 100vh;
  }
  
  .leaderboard-header {
    color: #ffd700;
    font-size: 32px;
    font-weight: bold;
    margin-bottom: 32px;
    text-transform: uppercase;
    letter-spacing: 2px;
    animation: slideInUp 0.7s ease-out;
    text-shadow: 0 0 20px rgba(255, 215, 0, 0.4);
  }
  
  .rank-table {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  
  .rank-card {
    background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
    border: 2px solid #94a3b8;
    border-radius: 12px;
    padding: 20px;
    display: flex;
    align-items: center;
    gap: 20px;
    animation: slideInUp 0.7s ease-out backwards;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }
  
  .rank-card:nth-child(1) { 
    animation-delay: 0s;
    border-color: #ffd700;
    background: linear-gradient(135deg, #3a3a1a 0%, #4a4a2a 100%);
  }
  
  .rank-card:nth-child(2) { 
    animation-delay: 0.1s;
    border-color: #c0c0c0;
  }
  
  .rank-card:nth-child(3) { 
    animation-delay: 0.2s;
    border-color: #cd7f32;
  }
  
  .rank-card:nth-child(n+4) { 
    animation-delay: calc(0.3s + (var(--card-index, 0) * 0.1s));
  }
  
  .rank-card:nth-child(1):hover {
    animation: goldGlow 1s ease-in-out infinite;
    transform: translateY(-5px) scale(1.02);
  }
  
  .rank-card:nth-child(2):hover,
  .rank-card:nth-child(3):hover {
    transform: translateY(-5px);
    box-shadow: 0 0 25px rgba(200, 200, 200, 0.2);
  }
  
  .rank-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 0 20px rgba(148, 163, 184, 0.3);
  }
  
  .rank-number {
    font-size: 28px;
    font-weight: bold;
    min-width: 50px;
    text-align: center;
    animation: countUp 0.6s ease-out backwards;
  }
  
  .rank-card:nth-child(1) .rank-number { 
    color: #ffd700;
    text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
  }
  
  .rank-card:nth-child(2) .rank-number { 
    color: #c0c0c0;
  }
  
  .rank-card:nth-child(3) .rank-number { 
    color: #cd7f32;
  }
  
  .rank-info {
    flex: 1;
  }
  
  .rank-address {
    color: #00d9ff;
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 8px;
    font-family: monospace;
  }
  
  .progress-bar-container {
    width: 100%;
    height: 12px;
    background: rgba(15, 23, 42, 0.8);
    border-radius: 6px;
    overflow: hidden;
    box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.5);
  }
  
  .progress-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, #00d9ff, #39ff14);
    border-radius: 6px;
    animation: slideInUp 0.8s ease-out backwards;
    box-shadow: 0 0 10px rgba(0, 217, 255, 0.6);
  }
  
  .rank-card:nth-child(1) .progress-bar-fill {
    background: linear-gradient(90deg, #ffd700, #ff9500);
  }
  
  .rank-score {
    color: #39ff14;
    font-size: 20px;
    font-weight: bold;
    min-width: 80px;
    text-align: right;
    animation: countUp 0.6s ease-out backwards;
  }
  
  .rank-card:nth-child(1) .rank-score {
    color: #ffd700;
  }
  
  .empty-state {
    text-align: center;
    color: #94a3b8;
    padding: 80px 20px;
    font-size: 18px;
  }
`

export default function JuryLeaderboard() {
  const [data, setData] = useState({})

  useEffect(() => {
    axios
      .get("http://localhost:8000/leaderboard")
      .then((r) => setData(r.data))
      .catch((err) => console.log("Leaderboard loading..."))
  }, [])

  const sortedEntries = Object.entries(data).sort((a, b) => b[1] - a[1])

  return (
    <>
      <style>{styles}</style>
      <div className="leaderboard-container">
        <h2 className="leaderboard-header">🏆 Jury Leaderboard</h2>

        {sortedEntries.length === 0 ? (
          <div className="empty-state">Loading leaderboard...</div>
        ) : (
          <div className="rank-table">
            {sortedEntries.map(([addr, rep], idx) => {
              const progressPercent = Math.min((rep / 100) * 100, 100)
              return (
                <div key={addr} className="rank-card">
                  <div className="rank-number">
                    {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `#${idx + 1}`}
                  </div>

                  <div className="rank-info">
                    <div className="rank-address">
                      {addr.slice(0, 10)}...{addr.slice(-8)}
                    </div>
                    <div className="progress-bar-container">
                      <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }} />
                    </div>
                  </div>

                  <div className="rank-score">{rep}</div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}
