const qrcode = require('qrcode-terminal');
const fs = require('fs');
const imgToPDF = require('image-to-pdf');
const pdf2base64 = require('pdf-to-base64');
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const path = require("path");

const database = require('../pdf-whatsapp-fast/database/db');
const MediaDB = require('../pdf-whatsapp-fast/model/media');

const directory = "../pdf-whatsapp-fast/users";

fs.readdir(directory, (err, files) => {
  if (err) throw err;

  for (const file of files) {
    fs.unlink(path.join(directory, file), (err) => {
      if (err) throw err;
    });
  }
});


(async () => {
    await MediaDB.sync({ force: true });
    console.log("The table for the Media model was just (re)created!");
})();



const client = new Client({
    authStrategy: new LocalAuth()
});




client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', message => {
    console.log(message.body);
});



client.on('message', async message => {
    if (message.body === '!imgtopdf') {
        const contact = await message.getContact()
        
        const medias = await MediaDB.findAll({
            where: {
                phone_number: contact.number,
            }
        });

        medias.map(function(iten) {
            console.log(iten.media.dataValues.media_path)
        });

        console.log(medias.dataValues);

        var pages = [];
        /*
        fs.readdir(`${folderName}/img`, function (err, files) {
            //handling error

            if (err) {
                message.reply('Sem imagens para converter');
            }
            //listing all files using forEach
            (element => console.log(element));
            files.forEach(element =>
                pages.push(`${folderName}/img/${element}`)
            );
            console.log(pages)
            imgToPDF(pages, imgToPDF.sizes.A4).pipe(fs.createWriteStream(`${folderName}/imgtopdf.pdf`));

            //const contents = fs.readFileSync(`${folderName}/imgtopdf.pdf`, {encoding: 'base64'});
            //console.log(contents);
        });
        */
        message.reply('ready');
    }
});

client.on('message', async msg => {
    if (msg.hasMedia) {
        const media = await msg.downloadMedia();
        const contact = await msg.getContact()
        const folderName = `/workspace/pdf-whatsapp-fast/users`;
        // Converte o arquivo base 64 em uma string binária
        function base64ToBinary(base64) {
            return Buffer.from(base64, 'base64').toString('binary');
        }
        function binaryToBuffer(binary) {
            return Buffer.from(binary, 'binary');
        }
        const base64 = media.data;

        const buffer = binaryToBuffer(base64ToBinary(base64));
        fs.writeFile(`${folderName}/${msg.id.id.substring(0, 7)}.jpg`, buffer, (error) => {
            if (error) {
                console.error(error);
            } 
        });

        (async () => {

            try {
                const resultadoCreate = await MediaDB.create({
                    type_media: 1,
                    phone_number: contact.number,
                    media_path: `${folderName}/${msg.id.id.substring(0, 7)}.jpg`,
                })
            } catch (error) {
                console.log(error);
            }
        })();
    }

});



client.initialize();
