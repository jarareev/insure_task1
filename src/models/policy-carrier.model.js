const mongoose = require('mongoose');

const policy_carrier_schema = mongoose.Schema(
    {
        company_name: {
            type: String,
        }
    },
    {
        collection: 'policycarrier'
    }
)

const Policycarrier = mongoose.model('policycarrier', policy_carrier_schema);

module.exports = Policycarrier;