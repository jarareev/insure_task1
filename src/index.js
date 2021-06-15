const app = require('./app');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

global.__basedir = __dirname;


dotenv.config();
console.log(__basedir,process.env.DB_CLUSTER);

let server;

mongoose.createConnection(process.env.DB_CLUSTER, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(() => {
    console.info('Connected to MongoDB');
    return;
}).catch((error) => {
    console.log(error);
});

server = app.listen(5000 || process.env.PORT, () => {
    console.info(`Listening to port ${process.env.PORT}`);
});
