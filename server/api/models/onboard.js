const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const onboardSchema = new Schema({
    serviceProvider: { type: String, required: true, default: 'Perilwise Insurtech Pvt Ltd', immutable: true },
    venderConstitution: { type: String, required: true, default: 'Insurtech provider', immutable: true },
    Indian_Foreign: { type: String, required: true, default: 'Indian Entity', immutable: true },
    Nature_scope: { type: String, required: true, default: 'Managed IT services', immutable: true },
    services_licensing: { type: String, required: true, default: 'Fully managed service provided by vendor for Abhivridhi', immutable: true},
    source_BAGIC: { type: String, required: true, default: 'No.  Source code will not be with BAGIC', immutable: true},
    on_offsite: { type: String, required: true, default: 'off site', immutable: true},
    confidential_info: { type: String, immutable: true },
    NDA: { type: String, immutable: true },
    servers: { type: String, required: true, default: 'Servers are in India', immutable: true },
    approved: { type: String, required: true, default: 'Approved', immutable: true },
    SOW: { type: String, immutable: true },
    agreement_period: { type: String, required: true, default: '2 years', immutable: true },
    terminate: { type: String, immutable: true },
    auto_renewal: { type: String, required: true, default: 'Yes', immutable: true },
    other_conditions: { type: String, required: true, default: 'No', immutable: true },
    MOU_valid: { type: Date, immutable: true },
    MOU_period: { type: String, immutable: true },
    signing_authority: { type: String, required: true, default: 'Avinash Ramachandran', immutable: true },
    BAGIC_signing_authority: { type: String, immutable: true },
    existing_agreement: { type: String, immutable: true },
    other_aspects: { type: String, immutable: true },
    partner: {
        company_name_address: { type: String, immutable: true },
        spocName_mobile_email: { type: String, immutable: true },
        itVenderNameAddress: { type: String, required: true, default: 'Perilwise Insurtech Pvt Ltd', immutable: true },
        itSpocMobileEmail: { type: String, required: true, default: 'Sunil Gopikrishna (sunil@perilwise.tech/9884475674)', immutable: true },
        itPlatform: { type: String, required: true, default: 'Angular/Python', immutable: true },
        start_date: { type: Date, immutable: true },
        end_date: { type: Date, immutable: true },
        publicIP: { type: String, immutable: true }
    },
    company: { type: Schema.Types.ObjectId, ref: 'Company' }
}, {strict: false});

onboardSchema.pre('update', function(next) {
    if(this.isModified('SOW')){
        next(new Error('Trying to modify restricted data'));
    } else{
        next();
    }
});

module.exports = mongoose.model('Onboard', onboardSchema);