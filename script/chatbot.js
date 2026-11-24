
const chatbotHTML = `
<div id="aura-chatbot">

    <button id="chatbot-toggle" aria-label="Open AURA Assistant">
        <span>✦</span>
    </button>

    <div id="chatbot-window" class="chatbot-hidden">

        <div class="chatbot-header">
            <div>
                <h3>AURA Assistant</h3>
                <p>Here to help you shine ✨</p>
            </div>
            <button id="chatbot-close">×</button>
        </div>

        <div id="chatbot-messages">
            <div class="bot-message">
                Hello! Welcome to AURA. ✨
                <br>
                How can I help you find your perfect jewellery today?
            </div>
        </div>

        <div class="chatbot-input-area">
            <input
                type="text"
                id="chatbot-input"
                placeholder="Ask me anything..."
                autocomplete="off"
            >
            <button id="chatbot-send">➤</button>
        </div>

    </div>
</div>
`;

document.addEventListener("DOMContentLoaded", () => {

    document.body.insertAdjacentHTML("beforeend", chatbotHTML);

    const toggle = document.getElementById("chatbot-toggle");
    const close = document.getElementById("chatbot-close");
    const chatWindow = document.getElementById("chatbot-window");
    const input = document.getElementById("chatbot-input");
    const send = document.getElementById("chatbot-send");
    const messages = document.getElementById("chatbot-messages");
    // Store conversation history
let conversationHistory = []; 
    toggle.addEventListener("click", () => {
        chatWindow.classList.toggle("chatbot-hidden");
    });

    close.addEventListener("click", () => {
        chatWindow.classList.add("chatbot-hidden");
    });

    function addMessage(message, sender) {
        const messageDiv = document.createElement("div");
        messageDiv.className = sender === "user"
            ? "user-message"
            : "bot-message";

        messageDiv.textContent = message;
        messages.appendChild(messageDiv);
        messages.scrollTop = messages.scrollHeight;

        return messageDiv;
    }

    async function sendMessage() {

        const question = input.value.trim();

        if (!question) return;

        addMessage(question, "user");
        input.value = "";
        send.disabled = true;

        const loadingMessage = addMessage("AURA is thinking...", "bot");

        try {

            const response = await fetch("https://aura-backend-txgz.onrender.com/api/ai/chat", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
    question,
    history: conversationHistory
})
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Something went wrong.");
            }

            const answer =
                data.reply ||
                data.response ||
                data.answer ||
                data.message;

            if (!answer || typeof answer !== "string") {
                throw new Error("Unexpected response from AI API.");
            }

            loadingMessage.textContent = answer;
// Save conversation for the next question
conversationHistory.push(
    { role: "user", content: question },
    { role: "assistant", content: answer }
);

// Keep only the latest 10 messages
conversationHistory = conversationHistory.slice(-10);
        } catch (error) {

            console.error("AURA Chatbot Error:", error);

            loadingMessage.textContent =
                "Sorry! I couldn't connect right now. Please try again.";

        } finally {
            send.disabled = false;
            input.focus();
            messages.scrollTop = messages.scrollHeight;
        }
    }

    send.addEventListener("click", sendMessage);

    input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            sendMessage();
        }
    });

});
