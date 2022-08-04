import express from "express";

const router = express();

router.get("/", (req, res) => {
    return res.render("index.ejs");
})

export default router;