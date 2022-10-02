// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { servertapRequest } from '../../utils/ServertapRequest'

export type Data = {
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
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data | { offline: true }>
) {
    const response = await servertapRequest('server')

    if (response === false)
        return res.status(200).json({ offline: true });

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
        }
    }

    res.status(200).json(data)
}
