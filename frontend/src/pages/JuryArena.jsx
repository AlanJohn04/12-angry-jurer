

// import { useEffect, useState } from "react"
// import { getContract } from "../services/contract"
// import { fetchFromIPFS } from "../services/ipfs"

// export default function JuryArena() {
//   const [cases, setCases] = useState([])
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     load()
//   }, [])

//   async function load() {
//     const c = await getContract()
//     const count = Number(await c.conflictCount())
//     const arr = []

//     for (let i = 1; i <= count; i++) {
//       const raw = await c.conflicts(i)
//       const status = Number(raw[11]) // Status enum index

//       if (status !== 1) continue // JuryOpen

//       const accuserData = await fetchFromIPFS(raw[4])
//       const accusedData = await fetchFromIPFS(raw[5])
//       const aiData = await fetchFromIPFS(raw[6])

//       arr.push({
//         id: i,
//         accuser: accuserData?.text ?? "Unavailable",
//         accused: accusedData?.text ?? "Unavailable",
//         summary: aiData?.summary ?? "AI analysis unavailable",
//       })
//     }

//     setCases(arr)
//     setLoading(false)
//   }

//   if (loading) return <p>Loading jury cases…</p>

//   return (
//     <div>
//       <h2>Jury Arena</h2>

//       {cases.map((c) => (
//         <div key={c.id} className="case">
//           <h3>Conflict #{c.id}</h3>

//           <h4>Accuser</h4>
//           <p>{c.accuser}</p>

//           <h4>Accused</h4>
//           <p>{c.accused}</p>

//           <h4>AI Neutral Summary</h4>
//           <p>{c.summary}</p>

//           <p style={{ opacity: 0.6 }}>
//             👀 Audience can observe · 🧑‍⚖️ Eligible jurors can vote
//           </p>
//         </div>
//       ))}
//     </div>
//   )
// }









"use client"

import { useEffect, useState } from "react"
import { getContract } from "../services/contract"
import { fetchFromIPFS } from "../services/ipfs"

export default function JuryArena() {
  const [cases, setCases] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    load()
  }, [])

  async function load() {
    const c = await getContract()
    const count = Number(await c.conflictCount())
    const arr = []

    for (let i = 1; i <= count; i++) {
      const raw = await c.conflicts(i)
      const status = Number(raw[11])
      if (status !== 1) continue

      const accuserData = await fetchFromIPFS(raw[4])
      const accusedData = await fetchFromIPFS(raw[5])
      const aiData = await fetchFromIPFS(raw[6])

      arr.push({
        id: i,
        accuser: accuserData?.text ?? "Unavailable",
        accused: accusedData?.text ?? "Unavailable",
        summary: aiData?.summary ?? "AI analysis unavailable",
      })
    }

    setCases(arr)
    setLoading(false)
  }

  if (loading)
    return (
      <div
        style={{
          color: "#00d9ff",
          textAlign: "center",
          padding: "40px",
          fontSize: "18px",
          textShadow: "0 0 10px rgba(0, 217, 255, 0.5)",
        }}
      >
        ⏳ Loading arena cases...
      </div>
    )

  return (
    <div>
      <h2
        style={{
          color: "#00d9ff",
          fontSize: "28px",
          fontWeight: "bold",
          marginBottom: "24px",
          textShadow: "0 0 15px rgba(0, 217, 255, 0.4)",
        }}
      >
        ⚖ JURY ARENA
      </h2>

      <div
        style={{
          display: "grid",
          gap: "20px",
        }}
      >
        {cases.map((c) => (
          <div
            key={c.id}
            style={{
              background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
              border: "2px solid #00d9ff",
              borderRadius: "14px",
              padding: "24px",
              boxShadow: "0 0 25px rgba(0, 217, 255, 0.25), inset 0 0 15px rgba(0, 217, 255, 0.08)",
              transition: "all 0.3s ease",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-6px)"
              e.currentTarget.style.boxShadow =
                "0 0 35px rgba(0, 217, 255, 0.4), inset 0 0 15px rgba(0, 217, 255, 0.15)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)"
              e.currentTarget.style.boxShadow =
                "0 0 25px rgba(0, 217, 255, 0.25), inset 0 0 15px rgba(0, 217, 255, 0.08)"
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <h3
                style={{
                  color: "#39ff14",
                  fontSize: "18px",
                  fontWeight: "bold",
                  margin: 0,
                  textShadow: "0 0 10px rgba(57, 255, 20, 0.4)",
                }}
              >
                Conflict #{c.id}
              </h3>
              <span
                style={{
                  background: "#00d9ff",
                  color: "#0f172a",
                  padding: "6px 12px",
                  borderRadius: "20px",
                  fontSize: "11px",
                  fontWeight: "bold",
                }}
              >
                JURY OPEN
              </span>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
                marginBottom: "16px",
              }}
            >
              <div>
                <p
                  style={{
                    color: "#64748b",
                    fontSize: "11px",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    margin: "0 0 8px 0",
                  }}
                >
                  Accuser Claim
                </p>
                <p
                  style={{
                    color: "#00d9ff",
                    fontSize: "13px",
                    background: "rgba(0, 217, 255, 0.1)",
                    padding: "12px",
                    borderRadius: "8px",
                    margin: 0,
                    lineHeight: "1.5",
                  }}
                >
                  {c.accuser}
                </p>
              </div>

              <div>
                <p
                  style={{
                    color: "#64748b",
                    fontSize: "11px",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    margin: "0 0 8px 0",
                  }}
                >
                  Accused Defense
                </p>
                <p
                  style={{
                    color: "#ff6b6b",
                    fontSize: "13px",
                    background: "rgba(255, 107, 107, 0.1)",
                    padding: "12px",
                    borderRadius: "8px",
                    margin: 0,
                    lineHeight: "1.5",
                  }}
                >
                  {c.accused}
                </p>
              </div>
            </div>

            <div
              style={{
                background: "rgba(57, 255, 20, 0.05)",
                border: "1px solid rgba(57, 255, 20, 0.3)",
                borderRadius: "8px",
                padding: "12px",
                marginBottom: "16px",
              }}
            >
              <p
                style={{
                  color: "#64748b",
                  fontSize: "11px",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  margin: "0 0 8px 0",
                }}
              >
                AI Neutral Analysis
              </p>
              <p
                style={{
                  color: "#39ff14",
                  fontSize: "13px",
                  margin: 0,
                  lineHeight: "1.5",
                }}
              >
                {c.summary}
              </p>
            </div>

            <p
              style={{
                color: "#64748b",
                fontSize: "12px",
                margin: 0,
              }}
            >
              👁 Audience observing · ⚖ Eligible jurors voting
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
