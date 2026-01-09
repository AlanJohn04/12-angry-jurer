// import axios from "axios";
// const axios = require("axios");
// export async function uploadToPinata(data) {
//   const res = await axios.post(
//     "https://api.pinata.cloud/pinning/pinJSONToIPFS",
//     data,
//     {
//       headers: {
//         pinata_api_key: process.env.PINATA_API_KEY,
//         pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY
//       }
//     }
//   );

//   return res.data.IpfsHash;
// }



const axios = require("axios");

async function uploadToPinata(data) {
  const res = await axios.post(
    "https://api.pinata.cloud/pinning/pinJSONToIPFS",
    data,
    {
      headers: {
        pinata_api_key: process.env.PINATA_API_KEY,
        pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY
      }
    }
  );

  return res.data.IpfsHash;
}

module.exports = {
  uploadToPinata
};
