const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const policy_info_schema = mongoose.Schema(
    {
        policy_number: {
            type: String,
        },
        policy_start_date:{
            type: Date,
        },
        policy_end_date:{
            type: Date,
        },
        policy_category:{
            type: Schema.Types.ObjectId, ref: 'policycategory'
        },
        collection_id:{
            type: String,
        },
        company_collection_id:{
            type: Schema.Types.ObjectId, ref: 'policycarrier'
        },
        user_id:{
            type: Schema.Types.ObjectId, ref: 'user'
        }
    },
    { collection: "policyinfo" }
)

const Policyinfo = mongoose.model('policyinfo', policy_info_schema);

module.exports = Policyinfo;