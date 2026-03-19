import { util } from '@aws-appsync/utils';

export function request(ctx) {
  const { ingredients = [] } = ctx.args;

  const prompt = `Suggest a recipe idea using these ingredients: ${ingredients.join(", ")}.`;

  return {
    resourcePath: `/model/amazon.nova-lite-v1:0/invoke`,
    method: "POST",
    params: {
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        inputText: prompt,          // 🔥 tärkein muutos
        textGenerationConfig: {
          maxTokenCount: 1000,
          temperature: 0.7,
        },
      },
    },
  };
}

export function response(ctx) {
console.log("RAW RESPONSE:", ctx.result.body);
  if (ctx.error) {
    return {
      body: "",
      error: ctx.error.message,
    };
  }

  const res = JSON.parse(ctx.result.body); // 🔥 fix

  const text =
    res?.results?.[0]?.outputText ||
    res?.outputText ||
    "";

  return {
    body: text,
  };
}
// export function request(ctx) {
//   const { ingredients = [] } = ctx.args;

//   const prompt = `Suggest a recipe idea using these ingredients: ${ingredients.join(", ")}.`;

//   return {
//     resourcePath: `/model/amazon.titan-nova-lite-instruct:001/invoke`,
//     method: "POST",
//     params: {
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         inputText: prompt,      // Titan / Nova Lite käyttää tätä
//         maxTokens: 1000,        // sama kuin Claude max_tokens
//         temperature: 0.7,       // valinnainen: säätää satunnaisuutta
//       }),
//     },
//   };
// }

// export function response(ctx) {
//   const parsedBody = JSON.parse(ctx.result.body);

//   // Titan / Nova Lite palauttaa usein tämän muotoisesti
//   const res = {
//     body: parsedBody.outputText || "", // outputText sisältää mallin vastauksen
//   };

//   return res;
// }






// export function request(ctx) {
//     const { ingredients = [] } = ctx.args;

//     // Construct the prompt with the provided ingredients
//     const prompt = `Suggest a recipe idea using these ingredients:
//  ${ingredients.join(", ")}.`;

//     // Return the request configuration
//     return {
//         resourcePath: `/model/anthropic.claude-3-sonnet-20240229-v1:0/invoke`,
//         method: "POST",
//         params: {
//             headers: {
//             "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//                 anthropic_version: "bedrock-2023-05-31", 
//                 max_tokens: 1000,
//                 messages: [
//                     {
//                         role: "user",
//                         content: [
//                             {
//                                 type: "text",
//                                 text: `\n\nHuman: ${prompt}\n\nAssistant:`,
//                             },
//                         ],
//                     },
//                 ],
//             }),
//         },
//     };
//  }

//  export function response(ctx) {
//     // Parse the response body
//     const parsedBody = JSON.parse(ctx.result.body);
//     // Extract the text content from the response
//     const res = {
//         body: parsedBody.content[0].text,
//     };
//     // Return the response
//     return res;
//  }
