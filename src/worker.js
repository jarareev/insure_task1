const {
    Worker, isMainThread, parentPort, workerData, threadId
} = require('worker_threads');


console.log(Worker);
if (isMainThread) {
    module.exports = (msg) => {
        return new Promise((resolve, reject) => {
            const worker = new Worker(__filename, {
                workerData: msg
            });
            // Listen for messages from the worker and print them.
            worker.on('message', resolve);

            worker.on('error', reject);

            worker.on('exit', (code) => {
                code !== 0 && console.log(`Exit with code${code}`);
            });
        })
    }
} else {
    console.log("child", threadId)
    console.log("child", workerData)

    // console.log(threadId)
    // (() => {
    const greet = "welcome";
    parentPort.postMessage(greet);
    // })();

}