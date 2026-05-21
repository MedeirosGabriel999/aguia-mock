const Jimp = require('jimp');

Jimp.read('C:\\Users\\Micro\\.gemini\\antigravity\\brain\\04776a04-81b6-461f-8ade-ab8acf25342c\\media__1779387050189.png')
  .then(image => {
    // Recorta a imagem para remover os números na parte inferior e a linha na direita/base
    // Largura original: 524, Altura original: 364
    // Cortando 15px da direita e 70px da base
    image.crop(0, 0, 509, 294);
    
    // Processa a transparência
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
      var r = this.bitmap.data[idx + 0];
      var g = this.bitmap.data[idx + 1];
      var b = this.bitmap.data[idx + 2];
      
      var brightness = (r + g + b) / 3;
      if (brightness > 200) {
         var alpha = 255 - ((brightness - 200) * (255 / 55));
         if (alpha < 0) alpha = 0;
         this.bitmap.data[idx + 3] = alpha; 
      }
      if (r > 240 && g > 240 && b > 240) {
        this.bitmap.data[idx + 3] = 0;
      }
    });
    
    // Autocrop para remover qualquer espaço transparente extra em volta da águia
    image.autocrop();

    // Salva a nova logo
    image.write('assets/images/logo.png');
    
    // Atualiza o favicon
    image.clone().resize(64, Jimp.AUTO).write('assets/images/favicon.png');
    
    console.log('Imagem cortada e fundo refinado com sucesso!');
  })
  .catch(err => {
    console.error(err);
  });
