export async function analyzeConflict(accuser, accused) {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
  const res = await fetch(`${apiUrl}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ accuser, accused }),
  })

  if (!res.ok) throw new Error("AI failed")
  return res.json()
}
