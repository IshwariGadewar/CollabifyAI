import { GoogleGenerativeAI } from "@google/generative-ai"; 
import { text } from "express";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY); 
const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    generationConfig: {
        responseMimeType: "application/json",
        temperature:0.4,
    },
    systemInstruction: `You are an expert in MERN and Development. You have an experience of 10 years in the development. You always write code in modular and break the code in the possible way and follow best practices, You use understandable comments in the code, you create files as needed, you write code while maintaining the working of previous code. You always follow the best practices of the development You never miss the edge cases and always write code that is scalable and maintainable, In your code you always handle the errors and exceptions.
    
    Examples: 

    <example>
 
    response: {

    "text": "this is you fileTree structure of the express server",
    "fileTree": {
        "app.js": {
            file: {
                contents: "
                const express = require('express');

                const app = express();


                app.get('/', (req, res) => {
                    res.send('Hello World!');
                });


                app.listen(3000, () => {
                    console.log('Server is running on port 3000');
                })
                "
            
        },
    },

        "package.json": {
            file: {
                contents: "

                {
                    "name": "temp-server",
                    "version": "1.0.0",
                    "main": "index.js",
                    "scripts": {
                        "test": "echo \"Error: no test specified\" && exit 1"
                    },
                    "keywords": [],
                    "author": "",
                    "license": "ISC",
                    "description": "",
                    "dependencies": {
                        "express": "^4.21.2"
                    }
}

                
                "
                
                

            },

        },

    },
    "buildCommand": {
        mainItem: "npm",
            commands: [ "install" ]
    },

    "startCommand": {
        mainItem: "node",
            commands: [ "app.js" ]
    }
}

    user:Create an express application 
   
    </example>


    
       <example>

       user:Hello 
       response:{
       "text":"Hello, How can I help you today?"
       }
       
       </example>
    
        IMPORTANT : don't use file name like routes/index.js
       
       
    `
});


export const generateResult = async (prompt) => {
    try {
        const result = await model.generateContent(prompt);
        let responseText = await result.response.text();

        // Try parsing the JSON response
        let responseData;
        try {
            responseData = JSON.parse(responseText);
        } catch (jsonError) {
            console.error("Error parsing AI response as JSON:", jsonError);
            return "Error parsing AI response";
        }

        // Ensure 'fileTree' exists in the response
        if (responseData.fileTree) {
            Object.keys(responseData.fileTree).forEach((filePath) => {
                // If filePath contains 'routes/index.js' or similar, rename it
                if (filePath.includes("routes/")) {
                    let newPath = filePath.replace("routes/", ""); // Remove "routes/" from filename
                    responseData.fileTree[newPath] = responseData.fileTree[filePath];
                    delete responseData.fileTree[filePath];
                }
            });
        }

        return JSON.stringify(responseData, null, 2); // Return modified JSON as a string
    } catch (error) {
        console.error("Error generating AI response:", error);
        return "Error generating response";
    }
};

