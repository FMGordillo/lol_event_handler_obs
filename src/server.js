import Pug from 'pug';
import Fastify from 'fastify';
import FastifyView from '@fastify/view';
// import FastifyStatic from '@fastify/static';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);

const server = Fastify({
  logger: true,
});

server.register(FastifyView, {
  root: path.join(__filename, '..', '..', 'client'),
  engine: {
    pug: Pug,
  },
});


// Here comes the good part
async function gameEventHandler(req, res, next) {
  res.headers = {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache',
  };

  // Generate data
  // TODO: Generate here

  // res.on('close', () => {
  //   console.log('Connection closed');
  // });
}

// setInterval(() => {
  // GET lol data
  // IF changes
  // THEN emit event (aka /lol_events)
  // ELSE do nothing
// }, 1000);

server.get('/', async (_req, res) => {
  return res.view('/index.pug');
});

server.get('/lol_events', async (_req, res) => {
  try {
   const summonerNameRaw = await fetch('https://127.0.0.1:2999/liveclientdata/activeplayername');

    console.log({ summonerNameRaw });

   // const playerStoreRaw = await fetch(`https://127.0.0.1:2999/liveclientdata/playerscores?summonerName=${summonerName}`);
  } catch (error) {
    console.log(error);
  }
  return res.send('holi');
});

const start = async () => {
  try {
    server.listen({
      host: '0.0.0.0',
      port: 42069,
    })
  } catch (error) {
    console.log('Se rompio algo');
  }
};


start();
