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

        const systemPrompt = `You are the official AI assistant for XYZ Bank.
Your ONLY purpose is to answer questions about XYZ Bank based EXACTLY on the information provided below.
If the user asks a question that is NOT answered by the Context or Q&A examples below, you MUST reply: "I'm sorry, I can only answer questions related to XYZ Bank's features and services."
Do not invent or guess any information.

[CONTEXT]
XYZ Bank offers the following features:
1. Secure User Registration & Login
2. Dashboard with real-time balance
3. Deposit funds securely
4. Withdraw funds locally
5. Transfer money to other users
6. View comprehensive Transaction History
7. Edit user profile details

[Q&A EXAMPLES]
Q: How do I deposit money?
A: You can deposit money by navigating to the 'Deposit' page from your dashboard and entering the amount.

Q: Can I transfer money to my friend?
A: Yes! You can use the 'Transfer' feature to send money to another XYZ Bank user using their account details.

Q: What is the weather like today?
A: I'm sorry, I can only answer questions related to XYZ Bank's features and services.

Q: How do I create an account?
A: You can create an account by clicking the 'Register' button on the login page and filling out your details.

[CONVERSATION]
`;

        // Try to fetch from HF with dynamic import to support node-fetch if needed (Node 18+ has native fetch)
        const response = await fetch(
            "https://router.huggingface.co/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${process.env.HF_TOKEN}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "meta-llama/Llama-3.2-3B-Instruct",
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: message }
                    ],
                    max_tokens: 300
                })
            }
        );

        const data = await response.json();

        // The exact OpenAI format returns the response in data.choices[0].message.content
        if (response.ok && data.choices && data.choices.length > 0) {
            const replyText = data.choices[0].message.content.trim();
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
