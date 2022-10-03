
import mongoose from "mongoose";
import { servertapRequest } from "./ServertapRequest";
mongoose.connect(process.env.MONGO_URL || '');

const logSchema = new mongoose.Schema({
    online: {
        type: Boolean,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
    },
    tps: {
        type: Number,
        required: true,
    },
    onlinePlayers: {
        type: Number,
        required: true,
    },
    usedMemory: {
        type: Number,
        required: true,
    },
})

export const Log = mongoose.models['Log'] ?? mongoose.model("Log", logSchema);

let lastLog: Date = new Date();
setInterval(async () => {
    // I don't trust the next.js runs the Interval every 5 seconds
    if (!(new Date().getTime() - lastLog.getTime() > 1000 * 60 * 4)) return;

    const response = await servertapRequest('server')

    const log = new Log({
        online: response !== false,
        createdAt: new Date(),
        tps: response?.tps ?? 0,
        onlinePlayers: response?.onlinePlayers ?? 0,
        usedMemory: (response?.health?.totalMemory ?? 0) - (response?.health?.freeMemory ?? 0),
    });
    await log.save();

    const oldLogs = Log.find({
        createdAt: {
            $lt: new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 7)
        }
    })
    await oldLogs.deleteMany();

    lastLog = new Date();
}, 1000 * 60 * 30);