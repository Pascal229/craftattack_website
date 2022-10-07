// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { servertapRequest } from '../../utils/ServertapRequest'

type Player = {
    uuid: string
}

export type ServerData = {
    tps: number,
    onlinePlayers: number,
    maxPlayers: number,
    health: {
        cpus: number,
        uptime: number,
        totalMemory: number,
        freeMemory: number,
        maxMemory: number,
    },
    player: (Player & { lastPlayed: number, name: string })[]
    onlinePlayer: Player[]
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ServerData | { offline: true }>
) {
    const responsePromise = servertapRequest('server')
    const playerPromise = servertapRequest('players/all')
    const onlinePlayerPromise = servertapRequest('players')
    const [response, player, onlinePlayer] = await Promise.all([responsePromise, playerPromise, onlinePlayerPromise])

    if (response === false)
        return res.status(200).json({ offline: true });

    // console.log(response)

    const data = {
        tps: response.tps,
        onlinePlayers: response.onlinePlayers,
        maxPlayers: response.maxPlayers,
        health: {
            cpus: response.health.cpus,
            uptime: response.health.uptime,
            totalMemory: response.health.totalMemory,
            freeMemory: response.health.freeMemory,
            maxMemory: response.health.maxMemory,
        },
        player: player.map((p: any) => {
            return {
                uuid: p.uuid,
                name: p.name,
                lastPlayed: p.lastPlayed,
            }
        }).sort((a: any, b: any) => b.lastPlayed < a.lastPlayed ? 1 : -1),
        onlinePlayer: onlinePlayer.map((p: any) => {
            return {
                uuid: p.uuid,
                name: p.name,
            }
        })
    }

    res.status(200).json(data)
}
