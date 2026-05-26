# CV Connoisseur

**AI-powered resume reviewer** — get instant, structured feedback on your resume in seconds.

🔗 **[Try it live → cvconnoisseur.netlify.app](https://cvconnoisseur.netlify.app/)**

---

## How to Use

1. Visit [cvconnoisseur.netlify.app](https://cvconnoisseur.netlify.app/)
2. Paste your resume content into the input area
3. Click **Submit** for review
4. Read your AI-generated feedback:
   - **Signature Strengths** — what your resume does well
   - **Ingredients to Improve** — targeted suggestions to strengthen it

No sign-up or setup required.

---

## Future Improvements

- Upload and parse PDF resumes
- Role-specific feedback modes (SWE, Data, Product, etc.)
- Scoring rubric with category breakdown
- Download feedback as PDF/Markdown
- Add test coverage for function responses

---

## Contributing / Local Development

Want to run this locally or contribute? Follow the steps below.

### 1) Clone the repository

```bash
git clone https://github.com/g-a-j-a-n-a-n/CV-Connoisseur.git
cd CV-Connoisseur
```

### 2) Install Netlify CLI (if not installed)

```bash
npm install -g netlify-cli
```

### 3) Add environment variable

Create a `.env` file in the project root:

```env
API_KEY=your_groq_api_key_here
```

> Keep your API key private. Never expose it in frontend code.

### 4) Run locally

```bash
netlify dev
```

Netlify Dev will serve the frontend and serverless function together at `localhost:8888`.

---

## Deployment Notes

This app is deployed on Netlify.

- **Publish directory:** `public`
- **Functions directory:** configured in `netlify.toml`
- **Required env variable in Netlify site settings:** `API_KEY` = your Groq API key

---

## Troubleshooting

### AI is not responding
- Ensure `API_KEY` is set correctly in Netlify or your local `.env`
- Check function logs in the Netlify dashboard
- Verify the frontend calls `/.netlify/functions/review`

### Function returns 500
- Inspect Netlify function logs for a stack trace
- Confirm the request body contains the expected resume text
- Verify your Groq model name and API endpoint are valid

### CORS or network errors
- Confirm requests go to the same Netlify origin in production
- Avoid exposing API calls directly from the browser to the AI provider

---

## License

This project is for educational/personal portfolio use.  
