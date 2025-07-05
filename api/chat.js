import { Configuration, OpenAIApi } from "openai";
import dotenv from "dotenv";

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Tumia POST tu" });
  }

  const { message, history } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Tuma message" });
  }

  try {
    // Optional: we pass conversation history for context (array of {role, content})
    const chatHistory = history || [];

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo", // au "gpt-4" kama una access
      messages: [
        ...chatHistory,
        { role: "user", content: message }
      ],
    });

    const botReply = completion.data.choices[0].message.content;

    res.status(200).json({ reply: botReply });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Tatizo la ndani la server" });
  }
}
