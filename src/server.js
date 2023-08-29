import process from "node:process";
import Fastify from "fastify";
import FastifyStatic from "@fastify/static";
import FastifyView from "@fastify/view";
import Pug from "pug";
import https from "https";
import path from "path";
import { FastifySSEPlugin } from "fastify-sse-v2";
import { fileURLToPath } from "url";

let data = {};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const agent = new https.Agent({
  rejectUnauthorized: false,
});

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const __filename = fileURLToPath(import.meta.url);

console.log("haber", path.join(__filename, "..", "..", "certs", "key.pem"));

const server = Fastify({
  logger: true,
});

server.register(FastifyStatic, {
  root: path.join(__filename, "..", "..", "public"),
  prefix: "/public/",
});
server.register(FastifyView, {
  root: path.join(__filename, "..", "..", "client"),
  engine: {
    pug: Pug,
  },
});
server.register(FastifySSEPlugin);

async function* getLolData() {
  while (true) {
    try {
      // const summonerNameRaw = await fetch('https://127.0.0.1:2999/liveclientdata/activeplayername', { agent });
      //  const summonerNameText = await summonerNameRaw.text()
      //  const summonerName = summonerNameText.replace("\"", "");
      const playerStoreRaw = await fetch(
        "https://127.0.0.1:2999/liveclientdata/allgamedata",

        { agent }
      );
      const playerStore = await playerStoreRaw.json();
      // FIXME: Add dynamic value here
      const myScore = (playerStore.allPlayers || []).find(
        (player) => player.summonerName === "PishilaFuriosa"
      ).scores;

      for (const [key, value] of Object.entries(myScore)) {
        if (value > data[key]) {
          yield {
            id: new Date().toISOString(),
            // TODO: No estoy seguro
            event: "video",
            data: `<video id="video_raw" class="transition-all" oncanplay="showVideo()" onended="removeVideo()" autoplay><source src="/public/videos/${key}.mp4" type="video/mp4"></video>`,
          };
        }
      }

      data = myScore;
    } catch (error) {
      console.log({ error });
    } finally {
      await sleep(500);
    }
  }
}

server.get("/", async (_req, res) => {
  return res.view("/index.pug");
});

server.get("/lol_events", function (_req, res) {
  res.sse(getLolData());
});

const start = async () => {
  try {
    server.listen({
      host: "0.0.0.0",
      port: 42069,
    });
  } catch (error) {
    console.log("Se rompio algo");
  }
};

start();
