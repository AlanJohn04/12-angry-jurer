// import express from "express";
// import { analyzeText } from "../gemini.js";
// import { uploadToPinata } from "../pinata.js";

// const router = express.Router();

// router.post("/", async (req, res) => {
//   const { accuserText, accusedText } = req.body;

//   const analysis = await analyzeText(accuserText, accusedText);
//   const cid = await uploadToPinata(analysis);

//   res.json({
//     cid,
//     analysis
//   });
// });

// export default router;



const express = require("express");
const { analyzeText } = require("../gemini");
const { uploadToPinata } = require("../pinata");
const axios = require("axios");
const router = express.Router();



router.post("/", async (req, res) => {
  try {
    const { accuserText, accusedText } = req.body

    const aiResult = await analyzeText(accuserText, accusedText)

    const pinataRes = await axios.post(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      aiResult,
      {
        headers: {
          pinata_api_key: process.env.PINATA_API_KEY,
          pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY,
        },
      }
    )

    res.json({
      cid: `ipfs://${pinataRes.data.IpfsHash}`,
    })
  } catch (err) {
    console.error("AI ERROR:", err.message)
    res.status(500).json({ error: "AI failed" })
  }
})


module.exports = router;