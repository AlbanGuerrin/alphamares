const fs = require('fs');
const path = require('path')
const formidable = require('formidable');
const { uploadErrors } = require('../utils/errors.utils');

module.exports.uploadCGU = (req, res) => {
    let fileName;
    const form = new formidable.IncomingForm();

    if (req.file !== null) {
        form.parse(req, function (err, fields, files) {
            try {
                if (
                    files.file.mimetype != "application/pdf"
                )
                    throw Error("invalid file");
    
                if (files.file.size > 5000000) throw Error("max size");
            } catch (err) {
                const errors = uploadErrors(err);
                return res.status(201).json({ errors });
            }
            var oldPath = files.file.filepath;
            const fileName = 'CGU.pdf';
            var newPath = path.join(__dirname, '/../uploads/legals/')
                + fileName
            var rawData = fs.readFileSync(oldPath)
            if (err) console.log(err)

            fs.writeFile(newPath, rawData, function (err) {
                if (err) console.log(err)
                return res.send("Successfully uploaded")
            })
        })
    }
}

module.exports.uploadPolitiqueConf = (req, res) => {
    let fileName;
    const form = new formidable.IncomingForm();

    if (req.file !== null) {
        form.parse(req, function (err, fields, files) {
            try {
                if (
                    files.file.mimetype != "application/pdf"
                )
                    throw Error("invalid file");
    
                if (files.file.size > 5000000) throw Error("max size");
            } catch (err) {
                const errors = uploadErrors(err);
                return res.status(201).json({ errors });
            }
            var oldPath = files.file.filepath;
            const fileName = 'Politique_de_Confidentialité.pdf';
            var newPath = path.join(__dirname, '/../uploads/legals/')
                + fileName
            var rawData = fs.readFileSync(oldPath)
            if (err) console.log(err)

            fs.writeFile(newPath, rawData, function (err) {
                if (err) console.log(err)
                return res.send("Successfully uploaded")
            })
        })
    }
}

module.exports.uploadCopyright = (req, res) => {
    let fileName;
    const form = new formidable.IncomingForm();

    if (req.file !== null) {
        form.parse(req, function (err, fields, files) {
            try {
                if (
                    files.file.mimetype != "application/pdf"
                )
                    throw Error("invalid file");
    
                if (files.file.size > 5000000) throw Error("max size");
            } catch (err) {
                const errors = uploadErrors(err);
                return res.status(201).json({ errors });
            }
            var oldPath = files.file.filepath;
            const fileName = 'Copyright.pdf';
            var newPath = path.join(__dirname, '/../uploads/legals/')
                + fileName
            var rawData = fs.readFileSync(oldPath)
            if (err) console.log(err)

            fs.writeFile(newPath, rawData, function (err) {
                if (err) console.log(err)
                return res.send("Successfully uploaded")
            })
        })
    }
}