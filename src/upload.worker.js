const {
    Worker, isMainThread, parentPort, workerData, threadId
} = require('worker_threads');

const fs = require("fs");
const csv = require("fast-csv");


const { Agent, User, Useraccount, Policycarrier, Policycategory, Policyinfo } = require('./models')

let insurance = [];

if (isMainThread) {
    module.exports = (path) => {
        console.log(`${threadId} ---${path}`)

        return new Promise((resolve, reject) => {
            const worker = new Worker(__filename, {
                workerData: path
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
    // async () => {
    console.log(`${threadId} ---${workerData}`)
    fs.createReadStream(workerData)
        .pipe(csv.parse({ headers: true }))
        .on("error", (error) => {
            throw error.message;
        })
        .on("data", async (row) => {
            // console.log(row)

            // const newAgent=new Agent({
            //     "agent":row.agent
            // })

            // await newAgent.save();
            insurance.push(row);
        })
        .on("end", () => {
            const success = "success";
            parentPort.postMessage(insurance);
        });
    // }
}