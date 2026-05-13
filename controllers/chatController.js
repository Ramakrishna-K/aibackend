import axios from "axios";

export const chatWithAI = async (req, res) => {

  try {

    const { message } = req.body;

    // Send to Python AI Agent
    const response = await axios.post(
      "http://127.0.0.1:8000/chat",
      {
        message: message
      }
    );

    // Return AI reply
    res.json({
      reply: response.data.reply
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "AI Error"
    });
  }
};