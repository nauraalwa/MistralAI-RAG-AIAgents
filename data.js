import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import * as fs from "fs";
import { Mistral } from "@mistralai/mistralai";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const mistralClient = new Mistral(process.env.MISTRAL_API_KEY);
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_API_KEY);

async function splitDocument(path) {
    const text = fs.readFileSync(path, "utf-8")
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 250,
        chunkOverlap: 40
    });
    const output = await splitter.createDocuments([text]);
    const textArr = output.map(chunk => chunk.pageContent);
    return textArr;
}

const handbookChunks = await splitDocument("handbook.txt");

async function createEmbeddings(chunks) {
    const embeddings = await mistralClient.embeddings.create({
        model: "mistral-embed",
        inputs: chunks
    });
    const data = chunks.map((chunk, i) => {
        return {
            content: chunk,
            embedding: embeddings.data[i].embedding
        }
    });
    return data;
}

const data = await createEmbeddings(handbookChunks);

await supabase.from("handbook_docs").insert(data);

console.log("upload completed.");