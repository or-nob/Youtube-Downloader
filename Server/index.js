const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');
const { json } = require('express');
const app = express();

app.use(cors());

app.listen(4000, () => {
    console.log('Server Works !!! At port 4000');
});

async function getTitle(id){
    try{
        const info = await ytdl.getInfo(id);
        const details = JSON.stringify(
                [
                    {'title': info.videoDetails.title},
                    {'rating': info.player_response.videoDetails.averageRating},
                    {'uploaded by': info.videoDetails.author.name}
                ]
            );
        return details;
    }catch(err){
        throw err;
    }
}

app.get('/download', async(req,res) => {
        try{
            var URL = req.query.URL;
            var index = URL.toString().indexOf("v=");
            index+=2;
            var id = URL.slice(index,URL.toString().length);

            var details = await getTitle(id);
            var JsonDetails = JSON.parse(details);

            res.header('Content-Disposition', 'attachment; filename="'+JsonDetails[0].title+'.mp4"');
            ytdl(URL, {
                format: 'mp4'
                }).pipe(res);
        }catch(err){

        }
    }
);
    