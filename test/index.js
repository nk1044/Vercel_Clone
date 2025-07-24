import { Redis } from "ioredis";

const redis = new Redis(`rediss://red-cth8ph9opnds73b0fl00:EvLtEY838xpPxd58GYJLnZhmMLXOGxmY@singapore-redis.render.com:6379/0`);

async function PushInQueue(data) {
    console.log("Pushing data in queue:", data);
    await redis.lpush("user-list", data);
    console.log("Data pushed in queue:", data);
}

PushInQueue(JSON.stringify({
    projectId: "12345",
    gitUrl: "https://github.com/nk1044/TicTacToe",
}));
