import express from "express";
import multer from "multer";
import path from "path";
import File from "../models/files.js";
import { v4 as uuidv4 } from 'uuid'; 
import sendMail from "../services/emailService.js";
import emailTemplate from "../services/emailTemplate.js";

const router = express.Router();

let storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

let upload = multer({
    storage: storage,
    limit: {fileSize: 100000000}
}).single('myfile');

router.post("/", (req, res) => {
    // Store file 
    upload(req, res, async (err) => {
        console.log(req.file);
        // Validate request
        if(!req.file){
            return res.json({error: 'All Fields are required'});
        }
      
        if(err){
            return res.status(500).send({error: err.message})
        }
        // Store into Database
        const file = new File({
            filename: req.file.filename,
            uuid: uuidv4(),
            path: req.file.path,
            size: req.file.size
        }); 
        // Response -> Link 
        const response = await file.save(); 
        console.log(response)
        return res.json({file : `${process.env.APP_BASE_URL}/files/${response.uuid}`});
        // http://localhost:5000/files/2usug32-3ihdig3jb
    }); 
});

router.post("/send", async (req, res) => {
     const {uuid, emailTo, emailFrom} = req.body;

     if(!uuid || !emailTo || !emailFrom){
        return res.status(422).send({error: "All Fields are required."});
     }

     // Get data from database
     const file = await File.findOne({uuid : uuid});

     if(file.sender){
        return res.status(422).send({error: "Email already sent."});
     }

     file.sender = emailFrom;
     file.receiver = emailTo;
     const response = await file.save();

     // Send Email
     sendMail({
        from: emailFrom,
        to: emailTo,
        subject: "ShareMe file sharing",
        text: `${emailFrom} shared file with you.`,
        html: emailTemplate({
            emailFrom: emailFrom,
            downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}`,
            size: parseInt(file.size/1000) + 'KB',
            expires: "24 hours"
        })
     });
     
     return res.send({success: true});
})

export default router;