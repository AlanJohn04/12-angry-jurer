const express = require("express")
const axios = require("axios")
const router = express.Router()

router.post("/", async (req, res) => {
  try {
    const data = req.body

    if (!data || Object.keys(data).length === 0) {
      return res.status(400).json({ error: "Empty body" })
    }

    const response = await axios.post(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      data,
      {
        headers: {
          "Content-Type": "application/json",
          pinata_api_key: process.env.PINATA_API_KEY,
          pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY,
        },
      }
    )

    res.json({ cid: response.data.IpfsHash })
  } catch (err) {
    console.error("PINATA ERROR:", err.response?.data || err.message)
    res.status(500).json({
      error: "Pinata upload failed",
      details: err.response?.data,
    })
  }
})
module.exports = router