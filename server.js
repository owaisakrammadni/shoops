const PORT = process.env.PORT || 5000;

var express = require("express");
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var cors = require('cors');
var morgan = require('morgan');
var jwt = require('jsonwebtoken');
var path = require('path');
var http = require('http');

var { SERVER_SECRET } = require("./core/app");
var { userModel, productModel, checkoutFormModel } = require("./dbrepo/models");
var authRoutes = require("./routes/auth");

//==========================================================================================
const multer = require("multer");
const storage = multer.diskStorage({ // https://www.npmjs.com/package/multer#diskstorage
    destination: './uploads/',
    filename: function (req, file, cb) {
        cb(null, `${new Date().getTime()}-${file.filename}.${file.mimetype.split("/")[1]}`)
    }
});
var upload = multer({ storage: storage });

//==========================================================================================

const admin = require("firebase-admin");
// https://firebase.google.com/docs/storage/admin/start
var serviceAccount = {
    "type": "service_account",
    "project_id": "sweet-shop-dd7e1",
    "private_key_id": "0660e22efbd718eb071ae1b936fa2a0f84904eff",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCWSYdYGyJPJIib\nV+yAPTt63e2aqEIqDyv42NFZz910HpgGQDEPDetz2TQS5Uzkc98+DFoeRnKtb9Fl\nKMRDmDAA7ayv8T6EW3EvCLe0/iqZcoo4GnWc9F9+vqLCwnBSTClfIeqjD5FMuwpZ\nm+HhXFv6v2D1nnNjzPPcdbXf1D2ZF41UyEvrlg4BJe8OXdeUzLHtrtGrKO8NpYUF\nnAkv6cfoMn9eSlZMUlkkWHiWBIAiSqt8HZN4rLkGIBjLp8OQIw4sSmt2i4I4u8mV\nZL3NhulGK2uCbEwn7A09xjFBBVSQrufYQg2lEhMyaU0RNigLR/EpFHxFgM+usU+t\ntVbGLvYPAgMBAAECggEANjZ1/UFkgfoi0S7JYIU2JJ9T69tQas2oRg8ojeZe81lp\n669SQyT5T4QFtd9DepGV8VMRWyR8j7XrajtneR64Ck2yYpF6xNIbpSTW6BJbmZjo\n5U4eKS06GYV5PxpW3EkfD3MzqfieqHg8RpDlzZ68i1poBpJO+6xeN6O6pPBx+/wm\neWGS6seMshTQccvoSPQyJcpR9JFemauTG8u+7xAGb93oTb8J6BV3d5yJdj6B1zc2\nFvkFyIo1PpzsKtv5fvAcaLW4U48XJW5JAOC6B0sAQp0X6g3SqmyevxcPNnqst/eF\n3krm1Hp9PGccbQlhY1IllHO0IraIjqRMaipP1TfZ2QKBgQDGDbiDhsqqD4kV1hb5\n/mRRG21jlR/CI7GcqUkSzka0ku+9CI91mXFutk/Emb43CLfkWv5C3aOrAQzRLQyd\nAZZFicOq0+LOw/xUIT46RCjaHqysH1kW/q0ZrJttGkKnWfqPj8I+i/S29E3pZ9WH\n+ZPflrMxHucfL275rnlzpnH4OwKBgQDCQhc9kRFZYQivb7Gq6TWMJZk+BNjmRzfO\nP68S5THVwHBg2/KE4Z8uDcn40I9FCsqsCLwo279YtPlY+CsR/oL1WSkxTe5gLZlZ\nHQatuYsypNf7EqoTTBmn3fzRJploENsR419+toQz+52Hof6ROe/VP/BB/v4k08zH\nkBSyx3dwPQKBgQC6EwgJIqnkDwaHqoYZyEVt4mvqxJ964dgsTOwnq//IBckR/Cn0\nnf5xuv3Ew4Fv6VQESu1Z2yy7LBhjqoSQOn55xM4+ACa2hnHahQUW7xTGoU0vxaAJ\nN6tgVMgOQD7hRmtfV/xykUGQZoWQxgpbX0PsLIUcoGEa7pDAKolW+8lWIwKBgAVC\n4vxA5JZmIWUXAlndrRyZnBfo67L49NL6OJSrbnkamDCXZG8i6TvHFdROWcMF8s1M\nA0ScBwexBxvYxNnc6dEZVBtIwA8MzR1zws2Lu/BoNI1RSRfytLMuOP21LOx7oGNQ\npDJ7YQNDalXVFl76kbtV2vz+mgWHUwGIrnbVHjAFAoGBAIt6cjor4Djsy9w3gUSS\nt9u+jKO8ktaTOCTVllGRAbLiECNnqGVYN7uAnSlbokXMJcAAX5Yn271UVQXIzlLd\n0g+XdyyD8gQAJ4HLoQRiFbZLp85rzpT6KgFYqOMyIIUjueaqXfJ5GrMDTOqW/auy\n1AzFzUMBWwaZuNIKiKQEhlv0\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-pvhka@sweet-shop-dd7e1.iam.gserviceaccount.com",
    "client_id": "117282532967588195048",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-pvhka%40sweet-shop-dd7e1.iam.gserviceaccount.com"
};

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://sweet-shop-dd7e1-default-rtdb.firebaseio.com",
});
const bucket = admin.storage().bucket("gs://sweet-shop-dd7e1.appspot.com"); // Firebase bucket Link
//==========================================================================================

var app = express();
var server = http.createServer(app);

app.use(bodyParser.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use("/", express.static(path.resolve(path.join(__dirname, "frontend/build"))));
app.use("/auth", authRoutes);

app.use(function (req, res, next) {
    console.log("req.cookies: ", req.cookies);
    if (!req.cookies.jToken) {
        res.status(401).send("include http-only credentials with every request")
        return;
    }
    jwt.verify(req.cookies.jToken, SERVER_SECRET, function (err, decodeData) {
        if (!err) {

            const issueDate = decodeData.iat * 1000;
            const nowDate = new Date().getTime();
            const diff = nowDate - issueDate; //86400,000

            if (diff > 300000) {//// expire after 5 min (in milis)
                res.send({
                    message: "Token Expired",
                    status: 401
                })
            }
            else { //issue new token
                var token = jwt.sign({
                    id: decodeData.id,
                    name: decodeData.name,
                    email: decodeData.email,
                    phone: decodeData.phone,
                    role: decodeData.role
                }, SERVER_SECRET)

                res.cookie('jToken', token, {
                    maxAge: 86_400_000,
                    httpOnly: true
                });

                req.body.jToken = decodeData
                next();
            }
        }
        else {
            res.send({
                message: "Invalid token",
                status: 401
            })
        }
    });
});

app.get("/profile", (req, res, next) => {
    console.log(req.body);

    userModel.findById(req.body.jToken.id, 'name email phone createdOn role', function (err, doc) {
        if (!err) {
            res.send({
                profile: doc,
                status: 200
            })

        } else {
            res.send({
                message: "Server Error",
                status: 500
            });
        }
    });
});

app.post("/updateproducts", (req, res, next) => {
    if (!req.body.productName || !req.body.productPrice || !req.body.productImage || !req.body.productDescription || !req.body.productQuantity || !req.body.activeStatus) {
        res.status(403).send(`
            please send name, email, passwod and phone in json body.
            e.g:
            {
                "productName": "ABC",
                "productPrice": "100@gmail.com",
                "productImage": "Image URL",
                "productDescription": "This is amaizing",
                "productQuantity": "100",
                "activeStatus": "true or false",
            }`);
        return;
    }
    userModel.findById(req.body.jToken.id, 'email role', function (err, user) {
        if (!err) {
            if (user.role === "admin") {
                var newProduct = new productModel({
                    "productName": req.body.productName,
                    "productPrice": req.body.productPrice,
                    "productImage": req.body.productImage,
                    "productDescription": req.body.productDescription,
                    "productQuantity": req.body.productQuantity,
                    "activeStatus": req.body.activeStatus,
                });
                newProduct.save((err, data) => {
                    // console.log(data);
                    if (!err) {
                        res.send({
                            message: "Product Added",
                            status: 200,
                            data: data
                        });
                    }
                    else {
                        console.log(err);
                        res.send({
                            message: "Product creation error, " + err,
                            status: 500
                        });
                    }
                });
            }
            else {
                res.send({
                    message: "Only Admin Add Products",
                    status: 409
                });
            }
        }
        else {
            res.send({
                message: "Product already exist!",
                status: 409
            });
        }
    })
});

app.post("/upload", upload.any(), (req, res, next) => {  // never use upload.single. see https://github.com/expressjs/multer/issues/799#issuecomment-586526877

    console.log("req.body: ", req.body);
    console.log("req.body: ", JSON.parse(req.body.myDetails));
    console.log("req.files: ", req.files);

    console.log("uploaded file name: ", req.files[0].originalname);
    console.log("file type: ", req.files[0].mimetype);
    console.log("file name in server folders: ", req.files[0].filename);
    console.log("file path in server folders: ", req.files[0].path);

    bucket.upload(
        req.files[0].path,
        function (err, file, apiResponse) {
            if (!err) {
                file.getSignedUrl({
                    action: 'read',
                    expires: '03-09-2491'
                }).then((urlData, err) => {
                    if (!err) {
                        console.log("public downloadable url: ", urlData[0]) // this is public downloadable url 
                        // res.send(urlData[0]);
                        res.send({
                            message: "Upload Successfully",
                            status: 200,
                            url: urlData[0]
                        });

                        //------------------------------------
                        // userModel.findOne({ email: req.body.email }, (err, user) => {
                        //     if (!err) {
                        //             res.send({
                        //                 message: "Upload Successfully",
                        //                 status: 200,
                        //                 url: user.profilePic
                        //             });
                        //     }
                        //     else {
                        //         res.send({
                        //             message: "Uploading Error"
                        //         });
                        //     }
                        // })
                        //------------------------------------

                        try {
                            fs.unlinkSync(req.files[0].path)
                            //file removed
                            return;
                        } catch (err) {
                            console.error(err)
                        }
                    }
                })
            } else {
                console.log("err: ", err)
                res.status(500).send();
            }
        });
});

app.get('/getProducts', (req, res, next) => {
    productModel.find({}, (err, data) => {
        if (!err) {
            res.send({
                data: data
            })
        }
        else {
            res.send(err)
        }
    })
})

app.post("/checkout", (req, res, next) => {
    if (!req.body.name || !req.body.address || !req.body.phoneNumber) {
        res.status(403).send(`
            please send name, adress and phone in json body.
            e.g:
            {
                "name": "ABC",
                "address": "House# xx, Stree# xx, <Location> Near <Area>",
                "phoneNumber": "03xxxxxxxxx",
            }`);
        return;
    }
    userModel.findOne({ email: req.body.jToken.email }, (err, user) => {
        console.log("Checkout Email Get ===> : ", req.body.jToken.email);
        if (!err) {
            checkoutFormModel.create({
                "name": req.body.name,
                "email": user.email,
                "phoneNumber": req.body.phoneNumber,
                "address": req.body.address,
                "status": "Is Review",
                "orders": req.body.orders,
                "totalPrice": req.body.totalPrice
            }).then((data) => {
                res.send({
                    status: 200,
                    message: "Order Done",
                    data: data
                })
            }).catch((err) => {
                res.send({
                    status: 500,
                    message: "Order Err" + err
                })
            })
        }
    })
});

app.get('/myOrder', (req, res, next) => {
    checkoutFormModel.find({ email: req.body.jToken.email }, (err, data) => {
        if (!err) {
            res.send({
                status: 200,
                data: data
            })
        }
        else {
            res.send(err)
        }
    })
});

app.get('/getOrders', (req, res, next) => {
    checkoutFormModel.find({}, (err, data) => {
        if (!err) {
            res.send({
                data: data
            })
        }
        else {
            res.send(err)
        }
    })
});

app.post('/updateStatus', (req, res, next) => {
    checkoutFormModel.findById({ _id: req.body.id }, (err, data) => {
        if (data) {
            data.updateOne({ status: req.body.status }, (err, update) => {
                if (update) {
                    res.send("Order Confirmed")
                }
                else {
                    res.send(err)
                }
            })
        }
        else {
            res.send(err)
        }
    })
})

app.post('/deleteStatus', (req, res, next) => {
    checkoutFormModel.findById({ _id: req.body.id }, (err, data) => {
        if (data) {
            data.updateOne({ status: req.body.status }, (err, update) => {
                if (update) {
                    res.send("Order Cancelled")
                }
                else {
                    res.send(err)
                }
            })
        }
        else {
            res.send(err)
        }
    })
});

app.get('/orderHistory', (req, res, next) => {
    checkoutFormModel.find({ status: {$in: ["Order Cancelled", "Order Confirmed"]} }, (err, data) => {
        if (data) {
            res.send({
                data: data
            })
        }
        else {
            res.send({
                message: "Error : ", err
            })
        }
    })
});

server.listen(PORT, () => {
    console.log("server is running on: ", PORT);
});