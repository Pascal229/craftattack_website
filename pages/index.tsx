import { useState, useEffect, useRef } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import Skeleton from 'react-loading-skeleton'
import { ServerData } from './api/data'
import dynamic from 'next/dynamic'
import { ChartData } from './api/chart'
import { BetterDate } from '../utils/betterdate'
import Image from 'next/image'

const ReactApexChart = dynamic(
  () => import('react-apexcharts'),
  { ssr: false }
)

const Home: NextPage = () => {
  const [serverData, setServerData] = useState<null | ServerData>(null)
  const [chartData, setChartData] = useState<null | ChartData>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const mouseDiv = useRef<HTMLDivElement>(null)

  const fetchServerData = async () => {
    const timeout = setTimeout(() => {
      setServerData({ healthy: null, maxPlayers: null, onlinePlayers: null, tps: null, player: null } as any)
      return false
    }, 1000)
    const response = await fetch('/api/data')
    if (!response.status.toString().startsWith('2')) {
      setServerData({ healthy: null, maxPlayers: null, onlinePlayers: null, tps: null, player: null } as any)
      return false
    }

    clearTimeout(timeout)
    const data: ServerData = await response.json()

    if ((data as any)?.offline === true) {
      setServerData({ healthy: null, maxPlayers: null, onlinePlayers: null, tps: null, player: null } as any)
      return
    }

    setServerData(data)
  }

  const fetchChartData = async () => {
    const response = await fetch('/api/chart')
    const data: ChartData = await response.json()

    if ((data as any)?.offline === true) {
      setServerData({ healthy: null, maxPlayers: null, onlinePlayers: null, tps: null, player9: null } as any)
      return
    }

    setChartData(data)
  }

  useEffect(() => {
    fetchServerData()
    fetchChartData()

    window.onpointermove = (e) => {
      if (mouseDiv.current) {
        mouseDiv.current.style.left = e.clientX + 'px'
        mouseDiv.current.style.top = e.clientY + 'px'
      }
    }
  }, [])

  return (
    <div className="h-screen overflow-y-auto bg-black text-white flex justify-center -z-20">
      <div ref={mouseDiv} className='dot'></div>
      <Head>
        <title>Status - Craftattack</title>
        <meta name="description" content="Craftattack Website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className='max-w-6xl w-full h-full'>
        <header className='p-2 z-20'>
          <h1 className='flex justify-center'>
            <div className='z-20 border-2 border-white w-full flex justify-center rounded-2xl text-white text-2xl md:text-6xl p-3'>
              Craftattack Status
            </div>
          </h1>
        </header>
        <main className='mt-5'>
          <section className='flex justify-center items-center gap-2'>
            {
              serverData === null ? (
                <Skeleton width={'100%'} />
              ) : (serverData?.tps ? (
                <div className='flex flex-col gap-3 z-20'>
                  <div className='flex gap-2 justify-center items-center mb-5'>
                    <span className='md:w-20 md:h-20 w-8 h-8 bg-green-500 rounded-full'></span>
                    <span className='text-4xl md:text-7xl pb-2'>ONLINE</span>
                  </div>
                  <div className='w-fit rounded-md p-2 border-2 border-white border-solid z-20'>
                    <div className='text-2xl md:text-4xl flex gap-1'><div className='md:min-w-[18rem]'>TPS:</div> <strong>{serverData.tps}</strong></div>
                    <div className='text-2xl md:text-4xl flex gap-1'><div className='md:min-w-[18rem]'>Spieler online:</div> <strong>{serverData.onlinePlayers}</strong></div>
                    <div className='text-2xl md:text-4xl flex gap-1'><div className='md:min-w-[18rem]'>RAM Auslastung:</div> <strong>{Math.round(100 - 100 / serverData.health.maxMemory * serverData.health.freeMemory) + '%'}</strong></div>
                  </div>
                </div>
              ) : (
                <>
                  <span className='w-16 h-16 bg-red-500 rounded-full'></span>
                  <span className='text-6xl pb-2'>OFFLINE</span>
                </>
              ))


            }
          </section>
          <div className='flex justify-center mt-5'>
            <button className='cursor-pointer mx-5 mb-5 p-2 z-20 hover:bg-white hover:text-black transition-colors border-white border-2 h rounded-md min-w-[8rem]' onClick={() => {
              if (isRefreshing) return
              setIsRefreshing(true)
              fetchServerData()
              fetchChartData()
              setTimeout(() => {
                setIsRefreshing(false)
              }, 100)
            }}>{isRefreshing ? 'Refreshing...' : 'Refresh'}</button>
          </div>
          {
            serverData?.player && (
              <section className='px-5'>
                <h2 className='text-center text-4xl mb-5'>Spieler</h2>
                <div className='flex flex-col gap-3'>
                  {
                    serverData?.player.map(p => {
                      if (serverData?.onlinePlayer.find(op => op.uuid === p.uuid))
                        return { ...p, online: true }
                      return { ...p, online: false }
                    }).sort((a, b) => a.online === true && b.online === false ? -1 : 0).map((player, i) => (
                      <PlayerItem key={i} player={player} />
                    ))
                  }
                </div>
              </section>
            )}
          <section className='mt-10'>
            <h2 className='text-center text-4xl'>Statistik</h2>
            <div className='z-20'>
              {
                <ReactApexChart
                  options={{
                    theme: {
                      mode: 'dark',
                    },
                    tooltip: {},
                    chart: {
                      background: 'transparent',
                      id: "basic-bar",
                      toolbar: {
                        tools: {
                          selection: false,
                          pan: false,
                          download: false,
                        }
                      }
                    },

                    xaxis: {
                      categories: chartData?.map((data) => new BetterDate(data.createdAt).format('dd.MM.yyyy HH:mm:ss')) ?? []
                    },
                    yaxis: [
                      {
                        seriesName: 'TPS',
                      },
                      {
                        seriesName: 'RAM (GB)',
                        opposite: true,
                        max: 10,
                      },
                      {
                        seriesName: 'Spieler',
                        max: 10,
                      },
                    ],
                    stroke: {
                      curve: 'smooth'
                    },
                  }}
                  series={[
                    {
                      type: 'line',
                      name: "TPS",
                      data: chartData?.map((data) => data.tps) ?? []
                    },
                    {
                      type: 'line',
                      name: "Spieler",
                      data: chartData?.map((data) => data.onlinePlayers) ?? []
                    },
                    {
                      type: 'line',
                      name: "RAM (GB)",
                      data: chartData?.map((data) => (data.usedMemory / 1000 / 1000 / 1000).toFixed(2) as any) ?? [],
                    },
                  ]}
                  width="100%"
                // height="100%"
                />
              }
            </div>
          </section>
        </main>

      </div>
    </div >
  )
}

const PlayerItem = (props: { player: ServerData['player'][number] & { online: boolean } }) => {
  return (
    <div className='flex justify-center items-center gap-2'>
      <div className='flex gap-2 items-center border-2 border-white rounded-md p-3 max-w-sm w-full'>
        <Image src={`https://crafatar.com/avatars/${props.player.uuid}?size=32&overlay`} alt={props.player.name} width={20} height={20} className='w-8 h-8 rounded-md' />
        <span className='text-2xl w-40 overflow-hidden text-ellipsis'>{props.player.name}</span>
        {
          props.player.online ?
            <span className='text-green-500 flex-1 text-right'>Online</span>
            :
            <span className='flex-1 text-right'>{new BetterDate((props.player as any).lastPlayed).format('HH:mm:ss dd.MM.yyyy')}</span>
        }
      </div>
    </div>
  )
}

export default Home


