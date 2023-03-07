import fs from "fs";
import path from "path";
import fileModel from "../models/files.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const folderPath = `${__dirname}/../uploads`;

const deleteFilesInFolder = () => {
    return new Promise((resolve, reject) => {

        fs.readdir(folderPath, (err, files) => {
            if (err) throw err;

            files.forEach(file => {
                const filePath = path.join(folderPath, file);
                fs.stat(filePath, (err, stats) => {
                    if (err) throw err;

                    const creationTime = stats.ctime.getTime();
                    const currentTime = new Date().getTime();
                    const timeDiff = currentTime - creationTime;

                    if (timeDiff > 1 * 60 * 60 * 1000) {
                        fs.unlink(filePath, async (err) => {
                            if (err) throw err;
                            fileModel.deleteOne({ filename: file }, (err) => {
                                if (err) throw err;
                                console.log(`Deleted ${file} from database`);
                            });
                        });
                    }
                });
            });
        });
        resolve();
    });
}

export default deleteFilesInFolder;
