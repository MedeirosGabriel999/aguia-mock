const Jimp = require('jimp');

Jimp.read('C:\\Users\\Micro\\.gemini\\antigravity\\brain\\04776a04-81b6-461f-8ade-ab8acf25342c\\media__1779387050189.png')
  .then(image => {
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
      var r = this.bitmap.data[idx + 0];
      var g = this.bitmap.data[idx + 1];
      var b = this.bitmap.data[idx + 2];
      
      // Calculate how close it is to white
      var brightness = (r + g + b) / 3;
      if (brightness > 200) {
         // Map 200-255 to alpha 255-0
         var alpha = 255 - ((brightness - 200) * (255 / 55));
         if (alpha < 0) alpha = 0;
         this.bitmap.data[idx + 3] = alpha; // Set alpha channel
      }
      // Se a cor for quase totalmente branca, zera o alfa de vez
      if (r > 240 && g > 240 && b > 240) {
        this.bitmap.data[idx + 3] = 0;
      }
    });
    
    // Salva a logo com o fundo transparente refinado
    image.write('assets/images/logo.png');
    
    // Gera um favicon menor e quadrado
    image.clone().resize(64, Jimp.AUTO).write('assets/images/favicon.png');
    
    console.log('Fundo refinado e favicon gerado com sucesso!');
  })
  .catch(err => {
    console.error(err);
  });
