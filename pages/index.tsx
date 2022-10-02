import { useState, useEffect } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import Skeleton from 'react-loading-skeleton'
import { Data } from './api/data'

const Home: NextPage = () => {
  const [isOnline, setIsOnline] = useState<null | boolean>(null)

  const fetchDate = async () => {
    const timeout = setTimeout(() => {
      setIsOnline(false)
      return false
    }, 1000)
    const response = await fetch('/api/data')
    if (!response.status.toString().startsWith('2')) {
      setIsOnline(false)
      return false
    }

    clearTimeout(timeout)
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
                <Skeleton width={'100%'} />
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


