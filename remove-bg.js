const Jimp = require('jimp');

Jimp.read('C:\\Users\\Micro\\.gemini\\antigravity\\brain\\04776a04-81b6-461f-8ade-ab8acf25342c\\media__1779387050189.png')
  .then(image => {
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
      var red = this.bitmap.data[idx + 0];
      var green = this.bitmap.data[idx + 1];
      var blue = this.bitmap.data[idx + 2];
      
      // Se for quase branco, torna transparente
      if (red > 230 && green > 230 && blue > 230) {
        this.bitmap.data[idx + 3] = 0; // Canal Alpha
      }
    });
    image.write('assets/images/logo.png');
    console.log('Fundo removido com sucesso!');
  })
  .catch(err => {
    console.error(err);
  });
