// import { useEffect, useState } from "react"
// import { uploadJSONToPinata } from "../services/pinata"

// export default function ChatBox({ conflictId }) {
//   const [msg, setMsg] = useState("")
//   const [messages, setMessages] = useState([])
// useEffect(() => {
//   const handler = (e) => {
//     setMessages((prev) => {
//       const filtered = prev.filter(
//         (m) =>
//           !(
//             m.type === "JURY_EXPLANATION" &&
//             m.voter === e.detail.voter
//           )
//       )
//       return [...filtered, e.detail]
//     })
//   }

//   window.addEventListener("juryExplanation", handler)
//   return () =>
//     window.removeEventListener("juryExplanation", handler)
// }, [])

//   const send = async () => {
//     const data = {
//       conflictId,
//       message: msg,
//       time: Date.now()
//     }
//     const res = await uploadJSONToPinata(data)
//     setMessages([...messages, data])
//     setMsg("")
//   }

//   return (
//     <div style={{ borderTop: "1px solid gray", marginTop: 10 }}>
//       <h4>Deliberation Chat</h4>

//       {messages.map((m, i) => (
//   <div key={i} style={{ marginBottom: 8 }}>
//     {m.type === "JURY_EXPLANATION" ? (
//       <div style={{ color: "#ffd700" }}>
//         🧑‍⚖️ Juror ({m.voter.slice(0, 6)}…)
//         <br />
//         Voted: {m.side}
//         <br />
//         Reason: {m.reason}
//       </div>
//     ) : (
//       <div>{m.message}</div>
//     )}
//   </div>
// ))}


//       <textarea
//         value={msg}
//         onChange={e => setMsg(e.target.value)}
//         placeholder="Discuss your reasoning..."
//       />
//       <button onClick={send}>Send</button>
//     </div>
//   )
// }









"use client"

import { useEffect, useState } from "react"
import { uploadJSONToPinata } from "../services/pinata"

export default function ChatBox({ conflictId }) {
  const [msg, setMsg] = useState("")
  const [messages, setMessages] = useState([])

  useEffect(() => {
    const handler = (e) => {
      setMessages((prev) => {
        const filtered = prev.filter((m) => !(m.type === "JURY_EXPLANATION" && m.voter === e.detail.voter))
        return [...filtered, e.detail]
      })
    }

    window.addEventListener("juryExplanation", handler)
    return () => window.removeEventListener("juryExplanation", handler)
  }, [])

  const send = async () => {
    if (!msg.trim()) return
    const data = {
      conflictId,
      message: msg,
      time: Date.now(),
    }
    const res = await uploadJSONToPinata(data)
    setMessages([...messages, data])
    setMsg("")
  }

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
        border: "2px solid #39ff14",
        borderRadius: "16px",
        padding: "24px",
        boxShadow: "0 0 30px rgba(57, 255, 20, 0.15), inset 0 0 20px rgba(57, 255, 20, 0.08)",
      }}
    >
      <h4
        style={{
          color: "#39ff14",
          fontSize: "18px",
          fontWeight: "bold",
          margin: "0 0 20px 0",
          textShadow: "0 0 10px rgba(57, 255, 20, 0.4)",
        }}
      >
        💬 Deliberation Chat
      </h4>

      <div
        style={{
          background: "rgba(15, 23, 42, 0.4)",
          border: "1px solid rgba(57, 255, 20, 0.2)",
          borderRadius: "8px",
          padding: "16px",
          minHeight: "200px",
          maxHeight: "400px",
          overflowY: "auto",
          marginBottom: "16px",
        }}
      >
        {messages.length === 0 ? (
          <p
            style={{
              color: "#64748b",
              textAlign: "center",
              margin: 0,
              fontSize: "13px",
            }}
          >
            No messages yet. Start the discussion...
          </p>
        ) : (
          messages.map((m, i) => (
            <div
              key={i}
              style={{
                marginBottom: "12px",
                paddingBottom: "12px",
                borderBottom: i < messages.length - 1 ? "1px solid rgba(255, 255, 255, 0.1)" : "none",
              }}
            >
              {m.type === "JURY_EXPLANATION" ? (
                <div
                  style={{
                    background: "rgba(255, 215, 0, 0.1)",
                    border: "1px solid #ffd700",
                    padding: "12px",
                    borderRadius: "6px",
                  }}
                >
                  <p
                    style={{
                      color: "#ffd700",
                      fontSize: "12px",
                      fontWeight: "bold",
                      margin: "0 0 6px 0",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    ⚖️ Juror ({m.voter.slice(0, 6)}…)
                  </p>
                  <p
                    style={{
                      color: "#39ff14",
                      fontSize: "12px",
                      margin: "4px 0",
                      fontWeight: "bold",
                    }}
                  >
                    Verdict: {m.side}
                  </p>
                  <p
                    style={{
                      color: "#94a3b8",
                      fontSize: "12px",
                      margin: "6px 0 0 0",
                      fontStyle: "italic",
                      lineHeight: "1.4",
                    }}
                  >
                    {m.reason}
                  </p>
                </div>
              ) : (
                <p
                  style={{
                    color: "#94a3b8",
                    fontSize: "13px",
                    margin: 0,
                    lineHeight: "1.5",
                  }}
                >
                  {m.message}
                </p>
              )}
            </div>
          ))
        )}
      </div>

      <div
        style={{
          display: "flex",
          gap: "8px",
        }}
      >
        <textarea
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder="Share your thoughts..."
          style={{
            flex: 1,
            padding: "12px",
            background: "rgba(15, 23, 42, 0.6)",
            border: "1px solid #39ff14",
            borderRadius: "8px",
            color: "#39ff14",
            fontSize: "13px",
            minHeight: "60px",
            fontFamily: "inherit",
            boxSizing: "border-box",
          }}
        />
        <button
          onClick={send}
          style={{
            background: "linear-gradient(135deg, #39ff14 0%, #00d9ff 100%)",
            border: "none",
            color: "#0f172a",
            padding: "12px 20px",
            borderRadius: "8px",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "all 0.3s ease",
            boxShadow: "0 0 15px rgba(57, 255, 20, 0.3)",
            textTransform: "uppercase",
            fontSize: "11px",
            letterSpacing: "1px",
          }}
          onMouseEnter={(e) => (e.target.style.boxShadow = "0 0 25px rgba(57, 255, 20, 0.5)")}
          onMouseLeave={(e) => (e.target.style.boxShadow = "0 0 15px rgba(57, 255, 20, 0.3)")}
        >
          Send
        </button>
      </div>
    </div>
  )
}
