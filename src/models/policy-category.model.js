const mongoose = require('mongoose');

const policy_category_schema = mongoose.Schema(
    {
        category_name:{
            type:String,
        }
    },
    {
        collection: 'policycategory'
    }
)

const Policycategory = mongoose.model('policycategory', policy_category_schema);

module.exports = Policycategory;