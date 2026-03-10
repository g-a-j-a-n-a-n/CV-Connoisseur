// review.mjs
export const handler = async (event, context) => {
    // Only allow POST requests
    if (event.httpMethod !== "POST") {
        return {statusCode: 405, body: "Method Not Allowed"};
    }

    try {
        //Receive the resume text from the frontend
        const requestBody = JSON.parse(event.body);
        const userResumeText = requestBody.resume;

        // 3. Send the AI's review back to the frontend
        // Replace 'YOUR_AI_VARIABLE' with variable that holds the AI's text message
        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({reply: YOUR_AI_VARIABLE})
        };

    } catch (error) {
        console.error("Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({error: "Failed to generate review"})
        };
    }
};
