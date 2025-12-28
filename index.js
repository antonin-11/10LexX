require("dotenv").config();
const fs = require("fs");
const { app, globalShortcut, clipboard } = require("electron");
const OpenAI = require("openai");
const model = "gpt-4.1-mini";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const prompt = fs.readFileSync("prompt.txt", "utf8");

async function correctText(text) {
    try {
        const completion = await openai.chat.completions.create({
            model: model,
            messages: [
                {
                    role: "system",
                    content: prompt,
                },
                {
                    role: "user",
                    content: text,
                },
            ],
        });

        console.log("Response recieved");

        return completion.choices[0].message.content;
    } catch (error) {
        console.error("Erreur lors de la correction:", error);
        throw error;
    }
}

// Create background application
app.whenReady().then(() => {
    // Hide app from dock on macOS
    if (process.platform === "darwin") {
        app.dock.hide();
    }

    // Register global shortcut
    const shortcut = process.platform === "darwin" ? "Command+O" : "Control+O";

    const ret = globalShortcut.register(shortcut, async () => {
        console.log("Raccourci détecté !");
        const clipboardText = clipboard.readText();
        const correctedText = await correctText(clipboardText);
        clipboard.writeText(correctedText);
    });

    if (!ret) {
        console.log("Échec de l'enregistrement du raccourci global");
    }

    console.log(`Application démarrée - raccourci ${shortcut} enregistré`);
});

// Gérer la fermeture propre de l'application
app.on("will-quit", () => {
    globalShortcut.unregisterAll();
});

// Empêcher l'application de se fermer quand toutes les fenêtres sont fermées
app.on("window-all-closed", (e) => {
    e.preventDefault();
});
