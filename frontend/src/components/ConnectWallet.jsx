// export default function ConnectWallet({ account, setAccount }) {
//   const connect = async () => {
//     const [acc] = await window.ethereum.request({
//       method: "eth_requestAccounts"
//     })
//     setAccount(acc)
//   }

//   return (
//     <div style={{ marginBottom: 10 }}>
//       <button onClick={connect}>
//         {account ? "Connected" : "Connect Wallet"}
//       </button>

//       {account && (
//         <p style={{ fontSize: 12, opacity: 0.7 }}>
//           {account}
//         </p>
//       )}
//     </div>
//   )
// }









"use client"

export default function ConnectWallet({ account, setAccount }) {
  const connect = async () => {
    const [acc] = await window.ethereum.request({
      method: "eth_requestAccounts",
    })
    setAccount(acc)
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f172a 0%, #1a0f2e 50%, #0f172a 100%)",
        padding: "20px",
      }}
    >
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        .pulse-text {
          animation: pulse 2s ease-in-out infinite;
        }
      `}</style>

      <div
        style={{
          textAlign: "center",
          marginBottom: "40px",
        }}
      >
        <h1
          style={{
            fontSize: "48px",
            color: "#00d9ff",
            textShadow: "0 0 20px rgba(0, 217, 255, 0.8), 0 0 40px rgba(0, 217, 255, 0.4)",
            margin: "0 0 16px 0",
            letterSpacing: "3px",
          }}
        >
          ⚔ CONFLICTNET ⚔
        </h1>
        <p
          style={{
            color: "#39ff14",
            fontSize: "18px",
            textShadow: "0 0 10px rgba(57, 255, 20, 0.5)",
            margin: 0,
          }}
        >
          Decentralized Conflict Resolution
        </p>
      </div>

      <div
        style={{
          background: "rgba(30, 41, 59, 0.6)",
          border: "2px solid #00d9ff",
          borderRadius: "16px",
          padding: "40px",
          textAlign: "center",
          boxShadow: "0 0 40px rgba(0, 217, 255, 0.3), inset 0 0 30px rgba(0, 217, 255, 0.1)",
          backdropFilter: "blur(10px)",
          maxWidth: "400px",
        }}
      >
        <p
          style={{
            color: "#94a3b8",
            marginBottom: "32px",
            fontSize: "14px",
            lineHeight: "1.6",
          }}
        >
          Connect your wallet to access the arena and begin your journey
        </p>

        <button
          onClick={connect}
          style={{
            background: "linear-gradient(135deg, #00d9ff 0%, #39ff14 100%)",
            border: "none",
            color: "#0f172a",
            padding: "16px 40px",
            fontSize: "16px",
            fontWeight: "bold",
            borderRadius: "12px",
            cursor: "pointer",
            transition: "all 0.3s ease",
            boxShadow: "0 0 20px rgba(0, 217, 255, 0.5), 0 0 10px rgba(57, 255, 20, 0.3)",
            textTransform: "uppercase",
            letterSpacing: "2px",
            width: "100%",
          }}
          onMouseEnter={(e) =>
            (e.target.style.boxShadow = "0 0 30px rgba(0, 217, 255, 0.7), 0 0 15px rgba(57, 255, 20, 0.5)")
          }
          onMouseLeave={(e) =>
            (e.target.style.boxShadow = "0 0 20px rgba(0, 217, 255, 0.5), 0 0 10px rgba(57, 255, 20, 0.3)")
          }
        >
          {account ? "Connected ✓" : "Connect Wallet"}
        </button>

        {account && (
          <p
            style={{
              fontSize: "11px",
              opacity: 0.6,
              color: "#94a3b8",
              marginTop: "16px",
              wordBreak: "break-all",
              fontFamily: "monospace",
            }}
          >
            {account}
          </p>
        )}
      </div>
    </div>
  )
}
