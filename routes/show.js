import express from "express";
import fileModel from "../models/files.js";
import deleteFilesInFolder from "../config/deletefile.js";

const router = express.Router();

router.get("/:uuid", async (req, res) => {
    try{   
        await deleteFilesInFolder();
        const file = await fileModel.findOne({uuid: req.params.uuid}); 
        if(!file){
            return res.render("download.ejs", {error: 'Link has been expired.'});
        }
        return res.render("download.ejs", {
            uuid: file.uuid,
            fileName: file.filename,
            fileSize: file.size,
            downloadLink: `${process.env.APP_BASE_URL}/files/download/${file.uuid}`
        })
    }catch(err){
       return res.render("download", {error : "Something went wrong."});
    }
})


export default router;