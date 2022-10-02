import { useState, useEffect } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { Data } from './api/data'

const Home: NextPage = () => {
  const [isOnline, setIsOnline] = useState<null | boolean>(null)

  const fetchDate = async () => {
    const response = await fetch('/api/data')
    const data: Data = await response.json()

    if ((data as any)?.offline === true) {
      setIsOnline(false)
      return
    }

    setIsOnline(true)
  }

  useEffect(() => {
    fetchDate()
  })

  return (
    <div className="h-screen overflow-y-auto bg-green-200 flex justify-center">
      <Head>
        <title>Status - Craftattack</title>
        <meta name="description" content="Craftattack Website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className='max-w-6xl w-full h-full'>
        <header className='p-2'>
          <h1 className='flex justify-center'>
            <div className='bg-black w-full flex justify-center rounded-2xl text-white text-6xl p-3'>
              Craftattack Status
            </div>
          </h1>
        </header>
        <main className='mt-5'>
          <div className='flex justify-center items-center gap-2'>
            {
              isOnline === null ? (
                <div></div>
              ) : (isOnline ? (
                <>
                  <span className='w-16 h-16 bg-green-500 rounded-full'></span>
                  <span className='text-6xl pb-2'>Online</span>
                </>
              ) : (
                <>
                  <span className='w-16 h-16 bg-red-500 rounded-full'></span>
                  <span className='text-6xl pb-2'>Offline</span>
                </>
              ))


            }
          </div>
        </main>

      </div>
    </div>
  )
}

export default Home


