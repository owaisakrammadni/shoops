var express = require("express");
var bcrypt = require('bcrypt-inzi');
var jwt = require('jsonwebtoken');
var { userModel, productModel, checkoutFormModel } = require("../dbrepo/models");
var { SERVER_SECRET } = require("../core/app");
var api = express.Router();

api.post("/signup", (req, res, next) => {
    if (!req.body.name || !req.body.email || !req.body.password || !req.body.phone) {
        res.status(403).send(`
            please send name, email, passwod and phone in json body.
            e.g:
            {
                "name": "abdul",
                "email": "abdul@gmail.com",
                "password": "abc",
                "phone": "03001234567",
            }`);
        return;
    }
    userModel.findOne({ email: req.body.email }, function (err, doc) {
        if (!err && !doc) {
            bcrypt.stringToHash(req.body.password).then(function (hash) {
                var newUser = new userModel({
                    "name": req.body.name,
                    "email": req.body.email,
                    "password": hash,
                    "phone": req.body.phone,
                });
                newUser.save((err, data) => {
                    // console.log(data);
                    if (!err) {
                        res.send({
                            message: "Signup Successfuly",
                            status: 200,
                            data: data
                        });
                    }
                    else {
                        console.log(err);
                        res.send({
                            message: "User create error, " + err,
                            status: 500
                        });
                    }
                });
            });
        }
        else if (err) {
            res.send({
                message: "DB Error" + err,
                status: 500
            });
        }
        else {
            res.send({
                message: "User already exist!",
                status: 409
            });
        }
    })
});

api.post("/validemail", (req, res, next) => {
    if (!req.body.email) {
        res.status(403).send(`
            please send name, email, passwod and phone in json body.
            e.g:
            {
                "name": "abdul",
                "email": "abdul@gmail.com",
                "password": "abc",
                "phone": "03001234567",
            }`);
        return;
    }
    userModel.findOne({ email: req.body.email }, function (err, doc) {
        if (!err) {
            if (doc) {
                res.send({
                    status: 200,
                    isFound: true
                })
            }
            else {
                res.send({
                    status: 200,
                    isFound: false
                })
            }
        }
        else {
            res.send({
                status: 500
            })
        }
    });
});

api.post("/login", (req, res, next) => {

    if (!req.body.email || !req.body.password) {
        res.send({
            message: `please send email and passwod in json body.
            e.g:
            {
                "email": "kb337137@gmail.com",
                "password": "abc",
            }`,
            status: 403
        });
        return
    }
    userModel.findOne({ email: req.body.email }, function (err, user) {
        if (err) {
            res.send({
                message: "An Error Occure :" + JSON.stringify(err),
                status: 500
            });
        }
        else if (user) {
            bcrypt.varifyHash(req.body.password, user.password).then(isMatched => {
                if (isMatched) {
                    console.log("Matched");

                    var token = jwt.sign({
                        id: user._id,
                        name: user.name,
                        email: user.email,
                        phone: user.phone,
                        role: user.role
                    }, SERVER_SECRET);

                    res.cookie('jToken', token, {
                        maxAge: 86_400_000,
                        httpOnly: true
                    });

                    // when making request from frontend:
                    // var xhr = new XMLHttpRequest();
                    // xhr.open('GET', 'http://example.com/', true);
                    // xhr.withCredentials = true;
                    // xhr.send(null);


                    res.send({
                        status: 200,
                        token: token,
                        message: "Login Success",
                        user: {
                            name: user.name,
                            email: user.email,
                            phone: user.phone,
                            role: user.role
                        }
                    });

                } else {
                    console.log("not matched");
                    res.send({
                        message: "inncorrect Password",
                        status: 401
                    })
                }
            }).catch(e => {
                console.log("error: ", e)
            });
        } else {
            res.send({
                message: "User NOT Found",
                status: 403
            });
        }
    });
});

api.post("/logout", (req, res, next) => {
    res.cookie('jTocken', "", {
        maxAge: 86_400_000,
        httpOnly: true
    });
    res.send({
        message: "Logout Success",
        status: 200
    });
});

api.post("/forgot-password", (req, res, next) => {
    if (!req.body.email) {
        res.send({
            message: "Please send email in JSON body",
            status: 403
        });
        return;
    }
    userModel.findOne({ email: req.body.email }, function (err, user) {
        if (err) {
            res.send({
                message: "An error occured : " + JSON.stringify(err)
            });
        }
        else if (user) {
            console.log(user);
            const otp = Math.floor(getRandomArbitrary(11111, 99999));

            otpModel.create({
                email: req.body.email,
                otpCode: otp
            }).then((doc) => {
                // console.log("every request chanking this otp ", otp)
                client.sendEmail({
                    "From": "abdullah_student@sysborg.com",
                    "To": req.body.email,
                    "Subject": "Reset your password",
                    "TextBody": `Here is your pasword reset code: ${otp}`
                }).then((status) => {
                    console.log("Status :", status);
                    console.log("mera opt ", otp);
                    res.send({
                        message: "Email Send  With Otp",
                        status: 200
                    });
                }).catch((err) => {
                    console.log("error in creating otp: ", err);
                    res.send({
                        message: "Unexpected Error",
                        status: 500
                    });
                });
            }).catch((err) => {
                console.log("error in creating otp: ", err);
                res.send({
                    message: "Unexpected Error",
                    status: 500
                });
            });
        }
        else {
            res.send({
                message: "User Not Found",
                status: 403
            });
        }
    });
});

api.post("/forgot-password-step2", (req, res, next) => {
    if (!req.body.email || !req.body.otp || !req.body.newPassword) {
        res.send({
            message: "Please required Email, Otp & New Password",
            status: 403
        });
        return;
    }
    userModel.findOne({ email: req.body.email }, function (err, user) {
        if (err) {
            res.send({
                message: "An Error Occure " + JSON.stringify(err),
                status: 500
            });
        }
        else if (user) {
            console.log("Check user : ", user);
            otpModel.find({ email: req.body.email }, function (err, otpData) {
                if (err) {
                    res.send({
                        message: "An Error Occure " + JSON.stringify(err),
                        status: 500
                    });
                }
                else if (otpData) {
                    otpData = otpData[otpData.length - 1]

                    console.log("otpData: ", otpData);

                    const now = new Date().getTime();
                    const otpIat = new Date(otpData.createdOn).getTime(); // 2021-01-06T13:08:33.657+0000
                    const diff = now - otpIat; // 300000 5 minute

                    console.log("diff: ", diff);

                    if (otpData.otpCode === req.body.otp && diff < 30000000) { // correct otp code
                        otpData.remove();

                        bcrypt.stringToHash(req.body.newPassword).then(function (hash) {
                            user.update({ password: hash }, {}, function (err, data) {
                                res.send({
                                    message: "Password Updated",
                                    status: 200
                                });
                            });
                        });
                    }
                    else {
                        res.send({
                            message: "Incorrect OTP",
                            status: 401
                        });
                    }
                }
                else {
                    res.send({
                        message: "Incorrect OTP",
                        status: 401
                    });
                }
            });
        }
        else {
            res.send({
                message: "User Not Found",
                status: 409
            });
        }
    });
});




module.exports = api;