import { isMainThread, parentPort, workerData } from 'worker_threads';
import { TeslaSyncService }                     from './TeslaSyncService';



if(isMainThread) {
  console.log('main thread');
} else {
  console.log('worker thread');

  parentPort.postMessage('message');

  parentPort.once('message', (message) => {
    parentPort.postMessage(message);
  });


  async function start() {
    if(!workerData) {
      process.exit(1);
    }
    const { username, id_s } = workerData;

    const tss = new TeslaSyncService(id_s, username);
    tss.start();
    parentPort.postMessage(`### started sync service for ${vehicle.display_name}`);
  }


  start();

}


