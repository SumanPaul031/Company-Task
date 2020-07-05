const Company = require('../models/company');
const Onboard = require('../models/onboard');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { google } = require("googleapis");

const OAuth2 = google.auth.OAuth2;
const clientID = "966633278353-k9eq8ah0ehecj8v8d839lh520k50mhiv.apps.googleusercontent.com";
const clientSecret = "7gqpXx3N224kvLezbvUqEnal";
const refreshToken = "1//04kZrbfCHkHIHCgYIARAAGAQSNwF-L9IrO1MnIpmRDVx_FlrKlQ5jtyg7ONHurKJJ8dftNScksXVeEIR62FjF3mfISzJ3Z7p-2l4";

const oauth2Client = new OAuth2(
    clientID,
    clientSecret,
    "https://developers.google.com/oauthplayground"
);

oauth2Client.setCredentials({
    refresh_token: refreshToken
});

exports.getAllCompanies = (req, res, next) => {
    Company.find({}, (err, companies) => {
        if(err){
            return res.status(500).json(err);
        } else{
            let onboardedcompanies = [];
            onboardedcompanies = companies.map(company => {
                if(company.onboarded){
                    return company;
                }
            });
            res.status(200).json(onboardedcompanies)
        }
    });
}

exports.getOneCompany = (req, res, next) => {
    if(!req.params.companyId){
        return res.status(400).json('Please provide Company Id');
    } else{
        Company.findOne({ _id: req.params.companyId }, (err, company) => {
            if(err){
                return res.status(500).json(err);
            } else{
                if(!company){
                    return res.status(404).json({
                        message: 'Company Not Found!'
                    });
                } else{
                    return res.status(200).json(company);
                }
            }
        })
    }
}

exports.createCompany = (req, res, next) => {
    if (!req.body || !req.body.companyName || !req.body.contactPerson || !req.body.contactEmail || !req.body.address || !req.body.products) {
        return res.status(400).send('Please enter all the fields!');
    } else{
        Company.findOne({ companyName: req.body.companyName }, (err, company) => {
            if(err){
                return res.status(500).json(err);
            } else{
                if(company){
                    return res.status(400).json({
                        message: 'Company Name Already Exists!'
                    });
                } else{
                    const newCompany = createCompany(req.body.companyName, req.body.contactPerson, req.body.contactEmail, req.body.address, req.body.products);
                    newCompany.save().then(async result => {
                        const tokens = await oauth2Client.refreshAccessToken();
                        const accessToken = tokens.credentials.access_token;
                        const authData = nodemailer.createTransport({
                            service: "gmail",
                            secure: true,
                            auth: {
                                type: "OAuth2",
                                user: "sumanpaul0209@gmail.com",
                                clientId: clientID,
                                clientSecret: clientSecret,
                                refreshToken: refreshToken,
                                accessToken: accessToken
                            }
                        });
                        var email = {
                            from: 'Company',
                            to: result.contactEmail,
                            subject: 'Company Onboarding link',
                            text: 'Hello '+result.contactPerson+'.\n\nPlease click on the link below to fill the onboarding Form.\n\nhttp://localhost:3000/onboardingform/'+result._id,
                            html: 'Hello <strong>'+result.contactPerson+'</strong>.<br><br>Please click on the link below to fill the onboarding Form.<br><br><a href="http://localhost:3000/onboardingform/'+result._id+'">http://localhost:3000/onboardingform/</a>'
                        };
                        authData.sendMail(email, (err, info) => {
                            if (err) {
                                return res.status(500).json(err);
                            } else {
                                console.log('Email sent: ' + info.response);
                                return res.status(201).json({
                                    message: 'Company created successfully!'
                                });
                            }
                        })
                    }).catch(err => {
                        return res.status(500).json(err);
                    });
                }
            }
        });
    }
}

exports.onboardCompany = (req, res, next) => {
    if(!req.body){
        return res.status(400).json({
            message: 'Please enter all the fields'
        })
    } else{
        Onboard.findOne({ company: req.params.companyId }, (err, onboard) => {
            if(err){
                return res.status(500).json(err);
            } else{
                if(onboard){
                    return res.status(400).json({
                        message: 'Company already onboarded'
                    });
                } else{
                    const onboardCompany = companyOnboard(req.body.confidential_info, req.body.NDA, req.body.SOW, req.body.terminate, req.body.MOU_valid, req.body.MOU_period, req.body.BAGIC_signing_authority, req.body.existing_agreement, req.body.other_aspects, req.body.company_name_address, req.body.spocName_mobile_email, req.body.start_date, req.body.end_date, req.body.publicIP, req.params.companyId);
                    onboardCompany.save().then(result => {
                        var newOnboarded = { 'onboarded': true };
                        Company.findOneAndUpdate({ _id: result.company }, newOnboarded, (err, company) => {
                            if(err){
                                return res.status(500).json(err);
                            } else{
                                if(!company){
                                    return res.status(404).json({
                                        message: 'Incorrect Company ID'
                                    });
                                } else{
                                    return res.status(200).json({
                                        message: 'Company Onboarded'
                                    });
                                }
                            }
                        })
                    }).catch(error => {
                        return res.status(500).json(err);
                    });
                }
            }
        });
    }
}

exports.getOnboardedCompany = (req, res, next) => {
    if(!req.params.companyId){
        return res.status(400).json({
            message: 'Please provide Company Id'
        });
    } else{
        Onboard.findOne({ company: req.params.companyId }, (err, onboard) => {
            if(err){
                return res.status(500).json(err);
            } else{
                if(!onboard){
                    return res.status(404).json({
                        message: 'No Company Found with that Id'
                    });
                } else{
                    return res.status(200).json(onboard);
                }
            }
        });
    }
}

function createCompany(companyName, contactPerson, contactEmail, address, products) {
    return new Company({
        companyName,
        contactPerson,
        contactEmail,
        address,
        products
    });
}

function companyOnboard(confidential_info, NDA, SOW, terminate, MOU_valid, MOU_period, BAGIC_signing_authority, existing_agreement, other_aspects, company_name_address, spocName_mobile_email, start_date, end_date, publicIP, company){
    return new Onboard({
        confidential_info,
        NDA,
        SOW,
        terminate,
        MOU_valid,
        MOU_period,
        BAGIC_signing_authority,
        existing_agreement,
        other_aspects,
        partner: {
            company_name_address,
            spocName_mobile_email,
            start_date,
            end_date,
            publicIP
        },
        company
    })
}