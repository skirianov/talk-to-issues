'use client'

import { createGitHubProfileURL } from '@/utils';
import { useChat } from 'ai/react';
import { FormEventHandler, useState } from 'react';
import { Interface } from 'readline';

interface AiData {
  author: string,
  summary: string,
  sentiment: string,
  mvp: string,
  solution: string,
  solutionCode: string,
}

export default function Home() {
  const { input, handleInputChange } = useChat();
  const [isLoading, setIsLoading] = useState(false);
  const [aiData, setAiData] = useState<AiData | null>(null);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e: any) => {
    e.preventDefault();

    if (!input) return;

    //TODO: Add URL validation

    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url: input })
      }).then(res => res.json());

      setAiData(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center gap-6 p-24">
      <h1>Enter GitHub Issue URL</h1>

      <form onSubmit={handleSubmit} className='flex gap-4 items-center'>
        <input
          className="w-96 border border-gray-300 rounded shadow-xl p-2 dark:text-black"
          value={input}
          placeholder="GitHub Issue URL"
          onChange={handleInputChange}
        />

        <button
          disabled={!input}
          type="submit"
          className='bg-black text-white rounded shadow-lg px-6 py-2 font-sans hover:shadow-xl hover:bg-slate-800 disabled:bg-slate-500 disabled:cursor-not-allowed'
        >
          Send
        </button>
      </form>

      {isLoading && <p>AI is working hard...</p>}

      {!isLoading && aiData && (
        <div className='flex flex-col gap-4 mt-12'>
          <h2 className='text-xl font-bold'>Issue Summary</h2>

          <div className=''>
            <div className='flex flex-col gap-4'>
              <div className='flex gap-4'>
                <div className='w-48 h-12 justify-center items-center bg-slate-50 p-6 rounded-md flex gap-2 border border-slate-700'>
                  <p className='font-semibold'>Author: </p>
                  <a className="text-blue-400" href={createGitHubProfileURL(aiData.author)}>{aiData.author}</a>
                </div>

                <div className='w-48 h-12 justify-center items-center bg-slate-50 p-6 rounded-md flex gap-2 border border-slate-700'>
                  <p className='font-semibold'>MVP: </p>
                  <a className="text-blue-400" href={createGitHubProfileURL(aiData.mvp)}>{aiData.mvp}</a>
                </div>
              </div>

              <div className='w-2/4 bg-slate-50 p-6 rounded-md flex flex-col gap-4 border border-slate-700'>
                <h4 className='text-lg font-semibold'>Issue Summary</h4>

                <p>{aiData.summary}</p>
              </div>

              <div className='w-2/4 bg-slate-50 p-6 rounded-md flex flex-col gap-4 border border-slate-700'>
                <h4 className='text-lg font-semibold'>Solution</h4>

                <p>{aiData.solution}</p>
              </div>

              <div className='w-2/4 bg-slate-50 p-6 rounded-md flex flex-col gap-4 border border-slate-700'>
                <h4 className='text-lg font-semibold'>Solution Code</h4>

                <p>{aiData.solutionCode}</p>
              </div>
            </div>
            {/* <div> */}

            {/* <a href={createGitHubProfileURL(aiData.mvp)} target='_blank' rel='noreferrer'>
                <img src={`https://github-readme-stats.vercel.app/api?username=${aiData.mvp}&show_icons=true&theme=dark`} alt='GitHub Stats' />
              </a> */}
            {/* </div> */}

          </div>
        </div>
      )}
    </main>
  )
}
