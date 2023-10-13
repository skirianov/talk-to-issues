Welcome to `talk-to-issues`project. This is an Open Source Project.

**Feel free to contribute**

## Getting Started

1. Install all the necessary dependencies:

```bash
npm i
```

2. Create OpenAI account and get OpenAI API
- [OpenAI API](https://platform.openai.com/)

This application is running on `gpt-3.5-turbo` and it's pretty cheap to run it yourself

3. Create `.env.local` file in the root of project and paste OpenAI API key inside

```bash
/* .env.local */

OPENAI_API_KEY=<YOUR_OPENAI_API_KEY>
```

4. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
