/*

Magescape - 7DRL contribution, 2016

Copyright (c) 2016, Chris V - chris@tinkerer.xyz
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

me.Tileset = function (filename) {
  var img = new Image()
  ;

  /////////////////////////////////////////////////////////////////////////////

  //Blit a tile
  function blit(canvas, index, x, y, tileSize, width, height) {
    var ctx = canvas.getContext('2d'),
        tileSizeX = tileSize || 32,
        tileSizeY = tileSize || 32,
        tw,
        sy,
        sx
    ;

    if (img instanceof Image) {
      tw = Math.floor(img.width / tileSizeX);
      sy = Math.floor(index / tw);
      sx = index - (sy * tw);  

      sx = sx * tileSizeX;
      sy = sy * tileSizeY;   
      
      if (sy < img.height && sx < img.width && sx >= 0 && sy >= 0) {
        ctx.drawImage(  
          img, 
          sx, sy, tileSizeX, tileSizeY, 
          x, y, 
          width || tileSizeX, 
          height || tileSizeY
        );
      }
    }
  }

  //Load tileset
  function load(filename) {
    img.src = filename;
  }

  /////////////////////////////////////////////////////////////////////////////

  if (typeof filename !== 'undefined') {
    load(filename);
  }

  return {
    blit: blit,
    load: load
  }
};