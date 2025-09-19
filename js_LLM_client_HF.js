const fetch = require('node-fetch');
const readline = require('readline');

// Replace with your actual Hugging Face API token
const HUGGING_FACE_TOKEN = "hf_your_token_here"; 
const MODEL_ID = "meta-llama/Meta-Llama-3-8B-Instruct";

const API_URL = `https://api-inference.huggingface.co/models/${MODEL_ID}`;

async function chatWithLLM(userInput) {
    try {
        const response = await fetch(
            API_URL,
            {
                headers: { 
                    "Authorization": `Bearer ${HUGGING_FACE_TOKEN}`,
                    "Content-Type": "application/json"
                },
                method: "POST",
                body: JSON.stringify({
                    "inputs": userInput,
                    "parameters": {
                        "return_full_text": false,
                        "max_new_tokens": 256
                    }
                }),
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        
        // Assuming the model returns a simple text output
        return data[0].generated_text.trim();
        
    } catch (error) {
        console.error("An error occurred:", error);
        return "Sorry, I couldn't get a response from the model.";
    }
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log("Welcome to the LLM Chat! Type 'quit' or 'exit' to end the conversation.");

function startChat() {
    rl.question("You: ", async (userInput) => {
        if (userInput.toLowerCase() === 'quit' || userInput.toLowerCase() === 'exit') {
            console.log("Goodbye!");
            rl.close();
            return;
        }

        const llmResponse = await chatWithLLM(userInput);
        console.log(`Assistant: ${llmResponse}`);
        startChat();
    });
}

startChat();