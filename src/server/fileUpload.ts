var multer = require("multer");
const { exec } = require("child_process");
const execSync = require('child_process').execSync;


const uploadFolder = "./uploads";



var storage = multer.diskStorage({

    destination: function (req, file, callback) {
        console.log("destination");
        callback(null, uploadFolder);
    },

    filename: function (req, file, callback) {
        console.log(file);
        //console.log("filename", file.fieldname)
        console.log("filename", file.originalname);

        callback(null, file.originalname);
    },

});





var upload = multer({
    storage: storage,

    onError: function (error, next) {
        console.log("------------ error");
        console.log(error)
    }
}).any();


module.exports = (app) => {

    app.post("/imageUpload", function (req, res, next) {
        console.log("/imageUpload");
        upload(req, res, async function (err) {
            res.setHeader('Content-Type', 'text/plain');
            res.setHeader('Transfer-Encoding', 'chunked');
            if (err) {
                console.log("error", err);
                return res.end("error uploading file");
            }



            res.end();


        });
    });

}