const mongoose = require('mongoose');

const agentSchema = mongoose.Schema(
    {
        agent: {
            type: String,
            required: true
        }
    },
    {
        collection: 'agent'
    }
)

const Agent = mongoose.model('agent', agentSchema,);

module.exports = Agent;