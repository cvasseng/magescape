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

me.Map = function (attributes, tileset) {
  var properties = me.merge({
        tileSize: 16,
        width: 100,
        height: 100
      }, attributes),
      events = me.Events(),
      data = [],
      tileset = false
  ;

  /////////////////////////////////////////////////////////////////////////////

  //Convert x,y to x + y * width
  function convert(x, y, fn) {
    if (x >= 0 && x < properties.width && y > 0 && y < properties.height) {
      return fn(x + y * properties.width); 
    }
    return false;
  }

  //Get the tile index at a given coordinate
  function getTile(x, y) {
    return convert(x, y, function (index) {
      return data[index];
    });
  }

  //Set the tile index at a given coordinate
  function setTile(x, y, value) {
    convert(x, y, function (index) {
      data[index] = value;
      redraw(x, y);
    });
  }

  //Load tilset 
  function loadTileset(ts) {

  }

  //Redraw a single tile
  function redraw(x, y) {

  }

  //Draw whole map
  function drawMap() {

  }

  /////////////////////////////////////////////////////////////////////////////

  return {
    on: events.on,
    properties: properties,
    data; {
      get: getTile,
      set: setTile
    }
  }
};