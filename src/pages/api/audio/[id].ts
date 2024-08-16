import { NextApiRequest, NextApiResponse } from "next";
import connect from "@/backend/connect";
import QueryHistory from "@/models/QueryHistory";
import User from "@/models/User";
import { getSession } from "next-auth/react";
import { getDownloadUrl } from "@vercel/blob";
import axios from "axios";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connect();

  const { id } = req.query;
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const queryHistory = await QueryHistory.findById(id);

    if (!queryHistory) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    if (queryHistory.user_id.toString() !== user._id.toString()) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const audioUrl = queryHistory.blob ? queryHistory.blob.url : null;

    if (!audioUrl) {
      return res
        .status(404)
        .json({ success: false, message: "Audio not found" });
    }

    const response = await axios.get(audioUrl, { responseType: "arraybuffer" });

    res.setHeader("Content-Type", "audio/m4a");
    res.send(response.data);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
}

export default handler;
