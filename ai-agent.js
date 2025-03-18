import { Mistral } from '@mistralai/mistralai';
import { tools, getPaymentStatus, getPaymentDate } from "./tools.js";
import dotenv from "dotenv";

dotenv.config()

const client = new Mistral(process.env.MISTRAL_API_KEY);

const availableFunctions = {
    getPaymentDate,
    getPaymentStatus
}; //enables us to actually call the function 

async function agent(query) {
  const messages = [
    { role: "user", content: query }
  ]; //keep track of the dialog between user and AI assistant

  for (let i = 0; i<5; i++) {
    const response = await client.chat.complete( {
        model: 'mistral-small-latest',
        messages: messages,
        tools: tools,
        toolChoice: 'any'
    });

    messages.push(response.choices[0].message);

    if (response.choices[0].finishReason === "stop") {
        return response.choices[0].message.content;
    } else if (response.choices[0].finishReason === "tool_calls") {
        const functionObject = response.choices[0].message.toolCalls[0].function;
        const functionName = functionObject.name;
        const functionArgs = JSON.parse(functionObject.arguments);
        // console.log(functionName); 
        // console.log(functionArgs); 

        const tool_call = response.choices[0].message.toolCalls[0];

        const functionResponse = await availableFunctions[functionName] (functionArgs);
        messages.push({
            role: "tool",
            name: functionName,
            content: functionResponse,
            tool_call_id: tool_call.id.toString()
        });
    }
  }
}

const response = await agent("When was the transaction T1001 paid?");
console.log(response);
