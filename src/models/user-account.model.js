const mongoose = require('mongoose');

const user_account_schema = mongoose.Schema(
    {
        account_name:{
            type:String,
        }
    },
    {
        collection:"useraccount"
    }
)

const Useraccount = mongoose.model('useraccount', user_account_schema);

module.exports = Useraccount;