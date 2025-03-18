import { Mistral } from "@mistralai/mistralai";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const mistralClient = new Mistral(process.env.MISTRAL_API_KEY);
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_API_KEY);

// 1. Getting user's input
const input = "December 25th is a Sunday, do I get any extra time off to account for that?";

// 2. Creating the embedding of the input
const embedding = await createEmbeddings(input);

// 3. Retrieving similar embeddings/ text chunks (aka context (from the dataset))
const context = await retrieveMatches(embedding);

// 4. Combining the input and the context in a prompt
// and using the Mistral AI chat api to generate a response
const response = await generateChatResponse(context, input);

// function to create embeddings
async function createEmbeddings(input) {
    const embeddingResponse = await mistralClient.embeddings.create({
        model: "mistral-embed",
        inputs: [input]
    });
    return embeddingResponse.data[0].embedding;
}

//function to match the input embedding with the text chunk embeddings
async function retrieveMatches(embedding) {
    const { data } = await supabase.rpc('match_handbook_docs', {
        query_embedding: embedding, // Pass the embedding you want to compare
        match_threshold: 0.78, // Choose an appropriate threshold for your data
        match_count: 5, // Choose the number of matches
      });
      return data.map(chunk => chunk.content).join(" "); //join matched data into a string
}

async function generateChatResponse(context, query) {
    const response = await mistralClient.chat.complete({
        model: "mistral-small-latest",
        messages: [{
            role: "user",
            content: `Handbook context: ${context} - Question: ${query}`
        }]
    });
    return response.choices[0].message.content;
}