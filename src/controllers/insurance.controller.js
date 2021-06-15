const uploadWorker = require('../upload.worker');

// testWorkerThread("hello").then(reply => {
//     console.log("hello", reply);
// }).catch(err => {
//     console.log(err);
// })

const fs = require("fs");
const csv = require("fast-csv");

const { Agent, User, Useraccount, Policycarrier, Policycategory, Policyinfo } = require('../models')

const insuranseService = require('../services/inventory.service');

exports.getPolicyInfo = async (req, res) => {
    console.log(req.params.user_name);
    try {
        return res.status(200).send(req.params.user_name);
    } catch (err) {
        return res.status(200).send(err);
    }
}

exports.policyInfo = async (req, res) => {
    try {
        let result = await insuranseService.policyinfo();
        return res.status(200).send({});
    } catch (err) {
        console.log(err);
        return err;
    }
}

exports.importData = async (req, res) => {
    try {
        // console.log("req.file.filename", req.file.filename)
        if (!req.file.filename) {
            return res.status(400).send("Please upload a CSV file!");
        }

        let insurance = [];
        let path = __basedir + '/uploads/' + req.file.filename;

        fs.createReadStream(path)
            .pipe(csv.parse({ headers: true }))
            .on("error", (error) => {
                throw error.message;
            })
            .on("data", async (row) => {
                insurance.push(row)
            })
            .on("end", async () => {

                try {
                    // createInsurance(insurance).then(res => {
                    //     res.json({ "Test": "Test" });
                    // }).catch((err) => {
                    //     console.log(err)
                    // })

                    insurance.map((insure) => {
                        bulkImport(insure).then(res => {
                            console.log("res", res);
                        }).catch((err) => {
                            console.log(err);
                        })
                    })
                    // let agentTable = insurance.map(o => ({ agent: o.agent }));
                    // await Agent.insertMany(agentTable, { ordered: false });

                    // let userTable = insurance.map(o => (
                    //     {
                    //         firstname: o.firstname,
                    //         dob: o.dob,
                    //         phonenumber: o.dob,
                    //         address: o.address,
                    //         state: o.state,
                    //         zip_code: o.zip,
                    //         email: o.email,
                    //         gender: o.gender,
                    //         userType: o.userType
                    //     }));
                    // await User.insertMany(userTable, { ordered: false });

                    // let userAccountTable = insurance.map(o => {
                    //     return {
                    //         account_name: o.account_name
                    //     }
                    // })
                    // await Useraccount.insertMany(userAccountTable, { ordered: false });

                    // let policyCarrierTable = insurance.map(o => {
                    //     return {
                    //         company_name: o.company_name
                    //     }
                    // })
                    // await Policycarrier.insertMany(policyCarrierTable, { ordered: false });

                    // let policyCategoryTable = insurance.map(o => {
                    //     return {
                    //         category_name: o.category_name
                    //     }
                    // })
                    // await Policycategory.insertMany(policyCategoryTable, { ordered: false });

                    // let policyInfoTable = insurance.map(o => {
                    //     return {
                    //         policy_number: o.policy_number,
                    //         policy_start_date:o.policy_start_date,
                    //         policy_end_date:o.policy_end_date,
                    //         policy_category:
                    //         collection_id:
                    //         company_collection_id:
                    //         user_id:
                    //     }
                    // })
                    // let policyInfoTableRes = policyInfoTable.filter((v, i, a) => a.findIndex(t => (t.account_name === v.account_name)) === i)
                    // await Policyinfo.insertMany(policyInfoTableRes, { ordered: false });

                    res.status(200).send({
                        message: "Uploaded the file successfully: " + req.file.originalname,
                    });

                } catch (err) {
                    console.log(err);
                }
            });
    } catch (err) {
        console.log(err)
        res.status(500).send({
            message: "Could not upload the file: " + req.file.originalname,
        });
    }
}

exports.fileupload = async (req, res) => {
    try {
        if (!req.file.filename) {
            return res.status(400).send("Please upload a CSV file!");
        }

        let path = __basedir + '/uploads/' + req.file.filename;

        // Worker thread
        uploadWorker(path).then(reply => {
            // console.log("hello", JSON.stringify(reply, null, ' '));

            bulkInsert(reply).then(status => {
                res.status(200).send({
                    message: "Uploaded the file successfully: " + req.file.originalname,
                });
            })
        }).catch(err => {
            console.log(err);
        })
    } catch (err) {
        console.log(err)
        res.status(500).send({
            message: "Could not upload the file: " + req.file.originalname,
        });
    }
}


function bulkImport(insure) {
    console.log(insure)
    // try {

    return new Promise((resolve, reject) => {
        let agent = new Agent({ agent: insure.agent })
        let useraccount = new Useraccount({
            account_name: insure.account_name
        });

        let user = {
            firstname: insure.firstname,
            dob: insure.dob,
            phonenumber: insure.dob,
            address: insure.address,
            state: insure.state,
            zip_code: insure.zip,
            email: insure.email,
            gender: insure.gender,
            userType: insure.userType
        }
        let newuser = new User(user)

        let carrier = new Policycarrier({ company_name: insure.company_name });
        let category = new Policycategory({ category_name: insure.category_name });

        console.log(agent, useraccount, newuser, carrier, category);
        let result = Promise.all([agent.save(), useraccount.save(), newuser.save(), carrier.save(), category.save()]);

        result.then((data) => {
            console.log("Promise.all",data);
            resolve(data);
        }).catch(err => {
            console.log("Promise.all.err",err);

            process.exit(1);
            reject(err);
        })

    })

    // } catch (err) {
    //     console.log(err);
    //     return err;
    // }
}

function createInsurance(insurance) {

    let promiseArr = [];

    return new Promise((resolve, reject) => {
        insurance.map((insure) => {
            const agent = new Agent({ agent: insure.agent })
            agent.save();

            const user_account = {
                account_name: insure.account_name
            }
            const newUserAccount = new Useraccount(user_account);
            newUserAccount.save();

            const user = {
                firstname: insure.firstname,
                dob: insure.dob,
                phonenumber: insure.dob,
                address: insure.address,
                state: insure.state,
                zip_code: insure.zip,
                email: insure.email,
                gender: insure.gender,
                userType: insure.userType
            }
            const newUser = new User(user)
            let uResult = newUser.save();


            const policy_carrier = {
                company_name: insure.company_name
            }
            const carrier = new Policycarrier(policy_carrier);
            let CResult = carrier.save();

            const policy_category = {
                account_name: insure.account_name
            }
            const category = new Policycategory(policy_category);
            let PCResult = category.save();

            const policy_info = {
                policy_number: insure.policy_number,
                policy_start_date: insure.policy_start_date,
                policy_end_date: insure.policy_end_date,
                policy_category: PCResult._id,
                company_collection_id: CResult._id,
                user_id: uResult._id
            }

            const policy = new Policyinfo(policy_info);
            policy.save();

            resolve();
        })
    })
}

async function bulkInsert(fileData) {
    try {
        let agentTable = fileData.map(o => ({ agent: o.agent }));
        let agentTableRes = agentTable.filter((v, i, a) => a.findIndex(t => (t.agent === v.agent)) === i)
        await Agent.insertMany(agentTableRes, { ordered: false });

        let userTable = fileData.map(o => (
            {
                firstname: o.firstname,
                dob: o.dob,
                phonenumber: o.dob,
                address: o.address,
                state: o.state,
                zip_code: o.zip,
                email: o.email,
                gender: o.gender,
                userType: o.userType
            }));
        let userTableRes = userTable.filter((v, i, a) => a.findIndex(t => (t.firstname === v.firstname && t.phone === v.phone)) === i)
        await User.insertMany(userTableRes, { ordered: false });

        let userAccountTable = fileData.map(o => {
            return {
                account_name: o.account_name
            }
        })
        let userAccountTableRes = userAccountTable.filter((v, i, a) => a.findIndex(t => (t.account_name === v.account_name)) === i)
        await Useraccount.insertMany(userAccountTableRes, { ordered: false });

        let policyCarrierTable = fileData.map(o => {
            return {
                company_name: o.company_name
            }
        })
        let policyCarrierTableRes = policyCarrierTable.filter((v, i, a) => a.findIndex(t => (t.company_name === v.company_name)) === i)
        await Policycarrier.insertMany(policyCarrierTableRes, { ordered: false });

        let policyCategoryTable = fileData.map(o => {
            return {
                category_name: o.category_name
            }
        })
        let policyCategoryTableRes = policyCategoryTable.filter((v, i, a) => a.findIndex(t => (t.category_name === v.category_name)) === i)
        await Policycategory.insertMany(policyCategoryTableRes, { ordered: false });

        let policyInfoTable = fileData.map(o => {
            return {
                account_name: o.account_name
            }
        })
        let policyInfoTableRes = policyInfoTable.filter((v, i, a) => a.findIndex(t => (t.account_name === v.account_name)) === i)
        await Policyinfo.insertMany(policyInfoTableRes, { ordered: false });

    } catch (err) {
        return new Promise.reject(err);
    }
}