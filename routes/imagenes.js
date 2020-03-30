const express = require('express'),
      path = require('path'),
      fs = require('fs'),
      app = express();




app.get('/:tipo/:img', (req, res) => {

    let tipo = req.params.tipo;
    let img = req.params.img;

    let pathImage =  path.resolve(__dirname, `../upload/${tipo}/${img}`);

    if (fs.existsSync(pathImage)) {
        res.sendFile(pathImage)
    } else {
        let pathNoImage = path.resolve(__dirname, '../assets/no-img.jpg');
        res.sendFile(pathNoImage);
    }

})

module.exports = app;