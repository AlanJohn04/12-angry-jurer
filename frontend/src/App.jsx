
import { useEffect, useState } from "react"
import Header from "./components/Header"
import CreateConflict from "./pages/CreateConflict"
import JuryArena from "./pages/JuryArena"
import Resolved from "./pages/Resolved"
import Profile from "./pages/Profile"
import ConnectWallet from "./components/ConnectWallet"


// export default function App() {
//   const [account, setAccount] = useState(null)
//   const [tab, setTab] = useState("create")

//   const connect = async () => {
//     const accs = await window.ethereum.request({
//       method: "eth_requestAccounts",
//     })
//     setAccount(accs[0])
//   }

//   useEffect(() => {
//     if (window.ethereum) {
//       window.ethereum.on("accountsChanged", (accs) => {
//         setAccount(accs[0] || null)
//       })
//     }
//   }, [])

//   return (
//     <div style={{ padding: 20 }}>
//       {!account ? (
//         <button onClick={connect}>Connect Wallet</button>
//       ) : (
//         <>
//           <Header account={account} />

//           <div style={{ marginBottom: 20 }}>
//             <button onClick={() => setTab("create")}>Create</button>
//             <button onClick={() => setTab("jury")}>Jury</button>
//             <button onClick={() => setTab("resolved")}>Resolved</button>
//             <button onClick={() => setTab("profile")}>Profile</button>
//           </div>

//           {tab === "create" && <CreateConflict account={account} />}
//           {tab === "jury" && <JuryArena account={account} />}
//           {tab === "resolved" && <Resolved />}
//           {tab === "profile" && <Profile account={account} />}
//         </>
//       )}
//     </div>
//   )
// }







export default function App() {
  const [account, setAccount] = useState(null)
  const [tab, setTab] = useState("arena")

  const connect = async () => {
    const accs = await window.ethereum.request({
      method: "eth_requestAccounts",
    })
    setAccount(accs[0])
  }

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accs) => {
        setAccount(accs[0] || null)
      })
    }
  }, [])

  if (!account) {
    return <ConnectWallet account={account} setAccount={setAccount} />
  }

  return (
    <div
      style={{
        background: "#0f172a",
        minHeight: "100vh",
        color: "#e2e8f0",
      }}
    >
      <Header account={account} />

      <div
        style={{
          padding: "20px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {/* Navigation Tabs */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            marginBottom: "32px",
            borderBottom: "2px solid rgba(0, 217, 255, 0.2)",
            paddingBottom: "16px",
          }}
        >
          {["arena", "create"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                background: tab === t ? "linear-gradient(135deg, #00d9ff 0%, #39ff14 100%)" : "transparent",
                color: tab === t ? "#0f172a" : "#94a3b8",
                border: tab === t ? "none" : "1px solid rgba(148, 163, 184, 0.3)",
                padding: "10px 20px",
                borderRadius: "8px",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "all 0.3s ease",
                textTransform: "uppercase",
                fontSize: "12px",
                letterSpacing: "1px",
                boxShadow: tab === t ? "0 0 15px rgba(0, 217, 255, 0.3)" : "none",
              }}
            >
              {t === "arena" ? "⚖ Jury Arena" : "⚔ Create Conflict"}
            </button>
          ))}
        </div>

        {tab === "arena" && <JuryArena account={account} />}
        {tab === "create" && <CreateConflict account={account} />}
      </div>
    </div>
  )
}
