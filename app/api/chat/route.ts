import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { NextResponse } from 'next/server';
import { HTMLElement, parse } from 'node-html-parser';
import { NodeHtmlMarkdown } from 'node-html-markdown';
import { ChatCompletionMessageParam } from 'openai/resources/index.mjs';
 
// Optional, but recommended: run on the edge runtime.
// See https://vercel.com/docs/concepts/functions/edge-functions
export const runtime = 'edge';
 
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const nhm = new NodeHtmlMarkdown();
 
export async function POST(req: Request) {
  // Extract the `messages` from the body of the request
  const { url } = await req.json();

  const html = await fetch(url).then((res) => res.text());

  const root = parse(html);

  const issueCommentsContainer = root.querySelector('.js-discussion');
  //TODO: handle reactions
  //TODO: handle large discussions (AI)

  const discussionComments = issueCommentsContainer?.querySelectorAll('.js-comment');
  const comments = discussionComments?.map((comment) => {
    const author = comment.querySelector('.author');
    const body = comment.querySelector('.comment-body');
    const authorText = author?.innerHTML || '';
    const text = nhm.translate(body?.innerHTML || '');
    return `${authorText}: ${text}`;
  });

  const SYS_MSG = `
  The following is GitHub Issue discussion between an original author (1st message) and community members.
  The original author is the one who created the issue and posted the first comment.
  The community members (including author) are those who posted comments afterwards.

  ---

  For this discussion, give the following:

  - [[author: author name]]
  - [[summary: Short summary of the issue]]
  - [[sentiment: The overall sentiment of the discussion]]
  - [[mvp: most valuable person in the discussion]]
  - [[solution: The solution to the issue based on the discussion. Give as much information as possible. (if any)]]
  - [[solution code: The code to the solution (if any)]]]

  ---

  End your response with [[end]]
  `

  const messages: ChatCompletionMessageParam[] = [
    {
      role: 'system',
      content: SYS_MSG,
    },
    {
      role: 'user',
      content: comments?.join('\n') || '',
    }
  ]
 
  // Request the OpenAI API for the response based on the prompt
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: messages,
  });

  const responseText = response.choices[0].message.content as string;
  const author = responseText.match(/\[\[author: (.*)\]\]/)?.[1];
  const summary = responseText.match(/\[\[summary: (.*)\]\]/)?.[1];
  const sentiment = responseText.match(/\[\[sentiment: (.*)\]\]/)?.[1];
  const mvp = responseText.match(/\[\[mvp: (.*)\]\]/)?.[1];
  const solution = responseText.match(/\[\[solution: (.*)\]\]/)?.[1];
  const solutionCode = responseText.match(/\[\[solution code: (.*)\]\]/)?.[1];

  const data = {
    author,
    summary,
    sentiment,
    mvp,
    solution,
    solutionCode,
  }

  return NextResponse.json({ data });
}