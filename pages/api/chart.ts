// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Log } from '../../utils/log';
import { servertapRequest } from '../../utils/ServertapRequest'

export type ChartData = {
    tps: number,
    onlinePlayers: number,
    usedMemory: number,
    createdAt: Date,
}[]

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ChartData>
) {
    const latestLogs = await Log.find({
        createdAt: {
            $gt: new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 7)
        }
    }).sort({ createdAt: -1 });

    res.status(200).json(latestLogs.reverse())
}
