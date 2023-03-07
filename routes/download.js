import express from "express";
import fileModel from "../models/files.js";
import path from "path";
import { fileURLToPath } from 'url'; 
import deleteFilesInFolder from "../config/deletefile.js";

const router = express.Router();
 
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

router.get("/:uuid", async (req, res) => {    
    const file = await fileModel.findOne({uuid: req.params.uuid});
    if(!file){
        return res.render("download.ejs", {error: "Link has been expired"});
    }

    const filePath = `${__dirname}/../${file.path}`;
    res.download(filePath);
})

export default router;