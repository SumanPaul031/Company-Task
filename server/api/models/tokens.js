const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tokensSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    refreshToken: { type: Array }
});

module.exports = mongoose.model('Tokens', tokensSchema);