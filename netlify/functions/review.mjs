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
                        content: "You are an expert technical recruiter. Review the provided resume text. Give 2 strengths and 2 areas for improvement."
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