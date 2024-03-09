const express = require('express')
const ytdl = require('ytdl-core')
const fs = require('fs')
const bodyParser = require('body-parser')


const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
    res.render('index.ejs', {message: ""})
});

app.post("/download", async (req, res) => {
    const { vidURL } = req.body;
    try {
        ytdl.getInfo(vidURL).then((info) => {
            // Select the video format and quality
            const format = ytdl.chooseFormat(info.formats, { quality: "248" });
            // Set appropriate headers for the response
            res.setHeader('Content-Disposition', `attachment; filename="video.${format.container}"`);
            res.setHeader('Content-Type', 'video/mp4');
            // Download the video file and stream it directly to the response
            ytdl.downloadFromInfo(info, { format: format }).pipe(res);
        }).catch((err) => {
            console.error(err);
            res.status(500).send('An error occurred');
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
})

app.listen(3000, console.log("app listerening on port 3000"))