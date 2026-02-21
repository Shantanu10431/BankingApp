const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ reply: 'Message is required' });
        }

        // Security filter
        const restrictedKeywords = [
            "balance",
            "account number",
            "transaction",
            "password",
            "otp",
            "card number"
        ];

        if (restrictedKeywords.some(word => message.toLowerCase().includes(word))) {
            return res.json({
                reply: "For security reasons, I cannot access or provide personal account information."
            });
        }

        const systemPrompt = `You are an AI assistant for XYZ Bank website.

Rules:
1. Only answer based on XYZ Bank website information.
2. If asked personal account details, refuse politely.
3. Guide users for complaints when needed.
`;

        // Try to fetch from HF with dynamic import to support node-fetch if needed (Node 18+ has native fetch)
        const response = await fetch(
            "https://api-inference.huggingface.co/models/microsoft/Phi-3-mini-4k-instruct",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${process.env.HF_TOKEN}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    inputs: systemPrompt + "\nUser: " + message
                })
            }
        );

        const data = await response.json();

        // The API might return an array of objects or an error object
        if (response.ok && Array.isArray(data) && data.length > 0) {
            // The model often includes the prompt in generated_text. 
            // Phi-3 might return generated_text: "system prompt\nUser: message\nAssistant: response"
            // Let's grab the raw text and do basic cleaning if it just replays the prompt
            let replyText = data[0].generated_text;

            // Basic extraction if the model repeats the prompt
            const splitToken = "User: " + message;
            if (replyText.includes(splitToken)) {
                const parts = replyText.split(splitToken);
                if (parts.length > 1) {
                    replyText = parts[1].replace(/^\n(Bot|Assistant):\s*/i, '').trim();
                }
            }

            return res.json({ reply: replyText || "Sorry, I couldn't process that." });
        } else {
            console.error("HF API Error:", data);
            // Handle case where model is loading
            if (data.error && data.error.includes("loading")) {
                return res.json({ reply: "The AI model is currently warming up. Please try again in 30 seconds." });
            }
            return res.json({ reply: "Sorry, I am having trouble connecting to my brain right now." });
        }

    } catch (error) {
        console.error('Chat API Error:', error);
        res.status(500).json({ reply: "An internal error occurred." });
    }
});

module.exports = router;
