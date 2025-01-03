const { HfInference } = require("@huggingface/inference");
require("dotenv").config(); // Carga del archivo .env

// Verifica que la API Key se haya cargado correctamente
console.log("Hugging Face API Key:", process.env.HUGGINGFACE_API_KEY);

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

(async () => {
    try {
        const model = "gpt2"; // Modelo gratuito
        const inputs = "Hola, ¿cómo estás?";

        const response = await hf.textGeneration({
            model,
            inputs,
            parameters: {
                max_new_tokens: 50,
                temperature: 0.7,
            },
        });

        console.log("Respuesta generada:", response.generated_text);
    } catch (err) {
        console.error("Error al conectar con Hugging Face:", err.message);
    }
})();
