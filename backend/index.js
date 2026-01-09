import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import fs from "fs"
import axios from "axios"
import fetch from "node-fetch"

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

/* ======================================================
   SIMPLE FILE DB
====================================================== */

const DB_FILE = "./db.json"

function initDB() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(
      DB_FILE,
      JSON.stringify(
        {
          chats: [],
          reactions: [],
          jurorScores: {},
        },
        null,
        2
      )
    )
  }
}

function readDB() {
  return JSON.parse(fs.readFileSync(DB_FILE))
}

function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2))
}

initDB()

/* ======================================================
   PINATA HELPER
====================================================== */

async function pinToIPFS(json) {
  if (!process.env.PINATA_JWT) {
    throw new Error("PINATA_JWT missing")
  }

  const res = await axios.post(
    "https://api.pinata.cloud/pinning/pinJSONToIPFS",
    json,
    {
      headers: {
        Authorization: `Bearer ${process.env.PINATA_JWT}`,
        "Content-Type": "application/json",
      },
    }
  )

  return res.data.IpfsHash
}

/* ======================================================
   AI ANALYSIS (GROQ)
====================================================== */

app.post("/analyze", async (req, res) => {
  const { accuser, accused } = req.body

  if (!accuser || !accused) {
    return res.status(400).json({ error: "Missing input" })
  }

  try {
    const prompt = `
Return ONLY valid JSON.

{
  "A": "Neutral restatement of Person A",
  "B": "Neutral restatement of Person B",
  "summary": "One-sentence neutral summary"
}

Person A says:
${accuser}

Person B says:
${accused}
`

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          temperature: 0.2,
          messages: [{ role: "user", content: prompt }],
        }),
      }
    )

    const data = await response.json()
    const parsed = JSON.parse(data.choices[0].message.content.trim())

    const cid = await pinToIPFS({
      ...parsed,
      createdAt: Date.now(),
    })

    res.json({
      summary: parsed.summary,
      cid: `ipfs://${cid}`,
    })
  } catch (err) {
    console.error("❌ AI ERROR:", err)
    res.status(500).json({ error: "AI failed" })
  }
})

/* ======================================================
   GENERIC PIN ROUTE
====================================================== */

app.post("/pin", async (req, res) => {
  try {
    const cid = await pinToIPFS(req.body)
    res.json({ cid: `ipfs://${cid}` })
  } catch (e) {
    console.error("❌ Pin failed:", e)
    res.status(500).json({ error: "Pin failed" })
  }
})

/* ======================================================
   CHAT (PER CONFLICT)
====================================================== */

app.post("/chat", (req, res) => {
  const db = readDB()

  const message = {
    ...req.body,
    time: Date.now(),
  }

  db.chats.push(message)
  writeDB(db)

  res.json({ ok: true })
})

app.get("/chat/:conflictId", (req, res) => {
  const db = readDB()
  const msgs = db.chats.filter(
    (c) => String(c.conflictId) === String(req.params.conflictId)
  )
  res.json(msgs)
})

/* ======================================================
   REACTIONS (AUDIENCE)
====================================================== */

app.post("/react", (req, res) => {
  const db = readDB()

  db.reactions.push({
    ...req.body,
    time: Date.now(),
  })

  writeDB(db)
  res.json({ ok: true })
})

/* ======================================================
   LEADERBOARD (JUROR REPUTATION CACHE)
====================================================== */

app.post("/leaderboard/update", (req, res) => {
  const { address, delta } = req.body
  const db = readDB()

  if (!db.jurorScores[address]) {
    db.jurorScores[address] = 0
  }

  db.jurorScores[address] += delta
  writeDB(db)

  res.json({ ok: true })
})

app.get("/leaderboard", (req, res) => {
  const db = readDB()
  res.json(db.jurorScores)
})

/* ======================================================
   START
====================================================== */

const PORT = 8000
app.listen(PORT, () =>
  console.log(`🚀 Backend running on http://localhost:${PORT}`)
)


















// const express = require("express")
// const cors = require("cors")
// const dotenv = require("dotenv")
// const bodyParser = require("body-parser")
// const axios = require("axios")
// const fetch = (...args) =>
//   import("node-fetch").then(({ default: fetch }) => fetch(...args))

// dotenv.config()

// const app = express()
// app.use(cors())
// app.use(bodyParser.json())

// /* ---------------- PINATA HELPER ---------------- */

// async function pinToIPFS(json) {
//   if (!process.env.PINATA_JWT) {
//     throw new Error("PINATA_JWT missing in .env")
//   }

//   const res = await axios.post(
//     "https://api.pinata.cloud/pinning/pinJSONToIPFS",
//     json,
//     {
//       headers: {
//         Authorization: `Bearer ${process.env.PINATA_JWT}`,
//         "Content-Type": "application/json",
//       },
//     }
//   )

//   return res.data.IpfsHash
// }

// /* ---------------- AI ANALYZE ---------------- */

// app.post("/analyze", async (req, res) => {
//   console.log("🔥 /analyze called")
//   console.log("BODY:", req.body)

//   const { accuser, accused } = req.body
//   if (!accuser || !accused)
//     return res.status(400).json({ error: "Missing input" })

//   try {
//    const prompt = `
// You are an impartial judge.

// STRICT RULES:
// - Output ONLY valid JSON
// - No markdown, no commentary
// - Do NOT merge statements
// - Do NOT add conclusions
// - Do NOT accuse or defend anyone
// - Use neutral third-person language

// Rewrite each statement independently and neutrally.

// Return EXACT JSON:

// {
//   "A": "Neutral restatement of Person A's claim",
//   "B": "Neutral restatement of Person B's claim",
//   "summary": "One-sentence neutral overview of the disagreement"
// }

// Person A says:
// ${accuser}

// Person B says:
// ${accused}
// `


//     const response = await fetch(
//       "https://api.groq.com/openai/v1/chat/completions",
//       {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           model: "llama-3.1-8b-instant",
//           temperature: 0.2,
//           messages: [{ role: "user", content: prompt }],
//         }),
//       }
//     )

//     const data = await response.json()
//     const text = data.choices[0].message.content.trim()

//     const parsed = JSON.parse(text)
//     console.log("✅ AI JSON:", parsed)

//     const cid = await pinToIPFS({
//       ...parsed,
//       createdAt: Date.now(),
//     })

//     res.json({
//       summary: parsed.summary,
//       cid: `ipfs://${cid}`,
//     })
//   } catch (err) {
//     console.error("❌ AI ERROR:", err)
//     res.status(500).json({ error: "AI failed" })
//   }
// })

// /* ---------------- PIN ROUTE ---------------- */

// app.post("/pin", async (req, res) => {
//   try {
//     const cid = await pinToIPFS(req.body)
//     res.json({ cid: `ipfs://${cid}` })
//   } catch (e) {
//     res.status(500).json({ error: "Pin failed" })
//   }
// })

// /* ---------------- START ---------------- */

// app.listen(8000, () =>
//   console.log("🚀 Backend running on http://localhost:8000")
// )
