export async function analyzeConflict(accuser, accused) {
  const res = await fetch("http://localhost:8000/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ accuser, accused }),
  })

  if (!res.ok) throw new Error("AI failed")
  return res.json()
}
