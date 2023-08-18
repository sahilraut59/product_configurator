import express from "express";
import * as dotenv from "dotenv";
import { Leap } from "@leap-ai/sdk";
import axios from "axios";

dotenv.config();
const router = express.Router();


const leap = new Leap("c6e51b54-babc-4ad2-afbf-83e01da1ec5f");

router.route("/").post(async (req, res) => {
  try {
    // leap.usePublicModel("sd-1.5");
    const { prompt } = req.body;
    const response = await leap.generate.generateImage({
      prompt: prompt,
      modelId: "1e7737d7-545e-469f-857f-e4b46eaa151d	",
      width: 512,
      height: 512,
      numberOfImages: 1,
    });

    // const image = response.data.data[0].b64_json;
    const imageURL = response.data.images[0].uri;
    // Fetch the image content from the generated URL
    const imageResponse = await axios.get(imageURL, {
      responseType: "arraybuffer",
    });

    // Convert the image content to base64
    const base64Image = Buffer.from(imageResponse.data, "binary").toString(
      "base64"
    );
    // Send the base64-encoded image in the response
    res.status(200).json({ photo: base64Image });

    // res.status(200).json({ photo: image });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

export default router;
