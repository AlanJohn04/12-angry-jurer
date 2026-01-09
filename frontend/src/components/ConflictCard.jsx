



// export default function ConflictCard({ conflict }) {
//   return (
//     <div style={{ border: "1px solid gray", margin: 10, padding: 10 }}>
//       <p>ID: {conflict.id}</p>
//       <p>Status: {["Awaiting Response", "Jury Open", "Resolved"][conflict.status]}</p>
//       <p>Accuser: {conflict.accuser}</p>
//       <p>Accused: {conflict.accused}</p>
//     </div>
//   )
// }















"use client"

export default function ConflictCard({ conflict }) {
  const statusLabels = ["Awaiting Response", "Jury Open", "Resolved"]
  const statusColors = {
    0: "#ffd700",
    1: "#00d9ff",
    2: "#39ff14",
  }

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
        border: `2px solid ${statusColors[conflict.status]}`,
        borderRadius: "12px",
        padding: "20px",
        marginBottom: "16px",
        boxShadow: `0 0 20px ${statusColors[conflict.status]}40, inset 0 0 15px rgba(${conflict.status === 0 ? "255, 215, 0" : conflict.status === 1 ? "0, 217, 255" : "57, 255, 20"}, 0.1)`,
        transition: "all 0.3s ease",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)"
        e.currentTarget.style.boxShadow = `0 0 30px ${statusColors[conflict.status]}60, inset 0 0 15px rgba(${conflict.status === 0 ? "255, 215, 0" : conflict.status === 1 ? "0, 217, 255" : "57, 255, 20"}, 0.2)`
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)"
        e.currentTarget.style.boxShadow = `0 0 20px ${statusColors[conflict.status]}40, inset 0 0 15px rgba(${conflict.status === 0 ? "255, 215, 0" : conflict.status === 1 ? "0, 217, 255" : "57, 255, 20"}, 0.1)`
      }}
    >
      {/* Status Badge */}
      <div
        style={{
          position: "absolute",
          top: "12px",
          right: "12px",
          background: statusColors[conflict.status],
          color: "#0f172a",
          padding: "6px 12px",
          borderRadius: "20px",
          fontSize: "11px",
          fontWeight: "bold",
          textTransform: "uppercase",
          letterSpacing: "1px",
        }}
      >
        {statusLabels[conflict.status]}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginTop: "8px" }}>
        {/* Accuser */}
        <div>
          <p
            style={{
              color: "#64748b",
              fontSize: "11px",
              textTransform: "uppercase",
              letterSpacing: "1px",
              margin: "0 0 6px 0",
            }}
          >
            Accuser
          </p>
          <p
            style={{
              color: "#00d9ff",
              fontSize: "13px",
              fontFamily: "monospace",
              margin: 0,
              wordBreak: "break-all",
              background: "rgba(0, 217, 255, 0.1)",
              padding: "8px",
              borderRadius: "6px",
            }}
          >
            {conflict.accuser}
          </p>
        </div>

        {/* Accused */}
        <div>
          <p
            style={{
              color: "#64748b",
              fontSize: "11px",
              textTransform: "uppercase",
              letterSpacing: "1px",
              margin: "0 0 6px 0",
            }}
          >
            Accused
          </p>
          <p
            style={{
              color: "#ff6b6b",
              fontSize: "13px",
              fontFamily: "monospace",
              margin: 0,
              wordBreak: "break-all",
              background: "rgba(255, 107, 107, 0.1)",
              padding: "8px",
              borderRadius: "6px",
            }}
          >
            {conflict.accused}
          </p>
        </div>
      </div>

      <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid rgba(255, 255, 255, 0.1)" }}>
        <p style={{ color: "#94a3b8", fontSize: "12px", margin: 0 }}>Conflict #{conflict.id}</p>
      </div>
    </div>
  )
}
