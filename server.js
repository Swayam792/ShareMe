import express from "express";
import path from "path";
import { fileURLToPath } from 'url';

import connectDB from "./config/db.js";
import filesRouter from "./routes/files.js";
import showRouter from "./routes/show.js";
import downloadRouter from "./routes/download.js";
import mainRouter from "./routes/main.js";
import deleteFilesInFolder from "./config/deletefile.js";

const app = express();

const PORT = process.env.PORT || 8000;

connectDB();

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

app.use(express.static('public'));
app.use(express.json());

// Template engine
app.set('views', path.join(__dirname, '/views'));
app.set("view-engine", "ejs");
 
// Routes
app.use("/", mainRouter)
app.use("/api/files", filesRouter);
app.use("/files", showRouter);
app.use("/files/download", downloadRouter)

app.listen(PORT, () => {
    console.log(`Server running at ${PORT}`)
})