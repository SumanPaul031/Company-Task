const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const companySchema = new Schema({
    companyName: { type: String, required: true, unique: true },
    contactPerson: { type: String, required: true },
    contactEmail: { type: String, required: true },
    address: { type: String, required: true },
    products: [{ 
        type: String, enum: ['Car', 'Bike', 'PA', 'Travel', 'Health'] 
    }],
    onboarded: { type: Boolean, default: false }
});

module.exports = mongoose.model('Company', companySchema);