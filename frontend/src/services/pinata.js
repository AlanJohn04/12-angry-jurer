export async function pinJSON(data) {
  const res = await fetch("http://localhost:8000/pin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })

  if (!res.ok) throw new Error("Pin failed")
  return res.json()
}
