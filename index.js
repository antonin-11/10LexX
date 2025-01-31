require("dotenv").config();
const { app, globalShortcut, clipboard } = require("electron");
const OpenAI = require("openai");

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function correctText(text) {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content:
                        "Tu es un correcteur orthographique expert en français. Tu dois corriger les fautes d'orthographe, de grammaire et de ponctuation du texte fourni. Renvoie uniquement le texte corrigé, sans explications.",
                },
                {
                    role: "user",
                    content: text,
                },
            ],
            temperature: 0.2, // Lower value for more consistent results
        });

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

    globalShortcut.register(shortcut, async () => {
        console.log("Raccourci détecté !");
        const clipboardText = clipboard.readText();
        const correctedText = await correctText(clipboardText);
        clipboard.writeText(correctedText);
    });

    console.log(`Application démarrée - raccourci ${shortcut} enregistré`);
});
