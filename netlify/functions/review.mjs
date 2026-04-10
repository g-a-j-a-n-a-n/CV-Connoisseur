export default async function review(req) {
    console.log("Review function running");
    try {
        const reqData = await req.json();
        console.log(reqData.resume);

        const endpointURl = "https://api.groq.com/openai/v1/chat/completions";
        const options = {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${Netlify.env.get("API_KEY")}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                // Using Meta's free open-source Llama 3 model
                model: "llama-3.1-8b-instant",
                messages: [
                    {
                        role: "system",
                        content: "You are the Head Chef of Resumes. Your job is to 'taste' and 'season' any provided resume, regardless of the job role or profession." +
                            " Give 2 'Signature Strengths' and 2 'Ingredients to Improve'. Use cooking metaphors throughout (e.g., 'well-marinated experience', 'overcooked bullet points', 'add a dash of keywords')." +
                            " Present your response in a digestible manner using Markdown formatting. Use headings, bold text, and bullet points to make it easy to read. Keep the tone professional, authoritative yet culinary."
                    },
                    {
                        role: "user",
                        content: reqData.resume
                    }
                ]
            })
        }
        const response = await fetch(endpointURl, options);
        const data = await response.json();

        return new Response(
            JSON.stringify(data),
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                },
            })

    } catch (error) {
        console.error("Error connecting to the API:", error);
        return new Response(
            JSON.stringify({
                error: "Could not complete fetch request",
            }),
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json'
                },
            },
            );
    }
}