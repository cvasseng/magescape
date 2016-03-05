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
        tileSize: 8,
        drawSize: 64,
        width: 100,
        height: 100
      }, attributes),
      events = me.Events(),
      data = [],      
      canvas = document.createElement('canvas'),

      backgroundLayer = document.createElement('canvas'),
      spriteLayer = document.createElement('canvas'),
      projectileLayer = document.createElement('canvas'),
      indicatorLayer = document.createElement('canvas'),

      enableIndicators = false,

      ctx = canvas.getContext('2d'),
      sctx = spriteLayer.getContext('2d'),
      pctx = projectileLayer.getContext('2d'),
      actors = [],
      projectiles = [],
      exports = {}
  ;

  /////////////////////////////////////////////////////////////////////////////

  //Start drawing functions

  function clear(pos, target) {
    var c = (target || canvas).getContext('2d');
    c.clearRect(
      pos.x * properties.drawSize,
      pos.y * properties.drawSize,
      properties.drawSize,
      properties.drawSize
    );
  }

  function indicatorsEnable(flag) {
    if (enableIndicators && flag === false) {
      indicatorLayer.getContext('2d').clearRect(0, 0, indicatorLayer.width, indicatorLayer.height);
      assemble();
    } 
    enableIndicators = flag;
  }

  function drawDirectionLine(from, to) {
    var c = indicatorLayer.getContext('2d');
    c.clearRect(0, 0, indicatorLayer.width, indicatorLayer.height);
    c.strokeStyle = '#AA3333';
    c.beginPath();
    c.moveTo(from.x * properties.drawSize, from.y  * properties.drawSize);
    c.lineTo(to.x  * properties.drawSize, to.y  * properties.drawSize);
    c.closePath();
    c.stroke();
    assemble();
  }

  function blitThing(thing, target) {
    if (tileset) {
      tileset.blit(
        target || canvas, 
        thing.properties.tileIndex, 
        thing.pos().x * properties.drawSize, 
        thing.pos().y * properties.drawSize, 
        properties.tileSize, 
        properties.drawSize, 
        properties.drawSize
      );
    }
  }

  function redrawActors() {
    sctx.clearRect(0, 0, spriteLayer.width, spriteLayer.height);
    actors.forEach(function (actor) {
      blitThing(actor, spriteLayer);
    });
  }

   //Copy tile from one layer to the main layer
  function cpyTile(x, y, source) {
    ctx.drawImage(
      source,

      x * properties.drawSize,
      y * properties.drawSize,
      properties.drawSize,
      properties.drawSize,

      x * properties.drawSize,
      y * properties.drawSize,
      properties.drawSize,
      properties.drawSize
    );
  }

  //Copy current cullbox 
  function cpyBox(source) {
    ctx.drawImage(
      source,

      0,
      0,
      canvas.width,
      canvas.height,

      0,
      0,
      canvas.width,
      canvas.height
    );
  }

  //Assemble the layers
  function assemble() {
    ctx.clearRect(0, 0, indicatorLayer.width, indicatorLayer.height);
    cpyBox(backgroundLayer);
    if (enableIndicators) {
      cpyBox(indicatorLayer);      
    }
    cpyBox(spriteLayer);
    cpyBox(projectileLayer);
  }

  //End drawing functions

  /////////////////////////////////////////////////////////////////////////////

  //Convert x,y to x + y * width
  function convert(x, y, fn) {
    if (x >= 0 && x < properties.width && y >= 0 && y < properties.height) {
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

  //Redraw a single tile
  function redraw(x, y) {
    if (!y && x && x.x && x.y) {
      y = x.y;
      x = x.x;
    }

    //Blit to the background layer
    convert(x, y, function (index) {
      if (tileset) {
        tileset.blit(
          backgroundLayer, 
          data[index], 
          x * properties.drawSize, 
          y * properties.drawSize, 
          properties.tileSize, 
          properties.drawSize, 
          properties.drawSize
        );
      }
    });

    //Blit background to the main layer
    cpyTile(x, y, backgroundLayer);

    if (enableIndicators) {
      //Blit the indicator layer
      cpyTile(x, y, indicatorLayer);      
    }

    //Blit the sprite layer
    cpyTile(x, y, spriteLayer);

    //Blit the projectile layer
    cpyTile(x, y, projectileLayer);

  }

  //Check for collision
  function collision(x, y) {
    return !convert(x, y, function (index) {
      return data[index] === 0;
    });
  }

  //Check for actor collision
  function actorCollision(x, y) {
    var res = false;
    actors.some(function (actor) {
      if (actor.pos().x === x && actor.pos().y === y) {
        res = actor;
        return true;
      }
    });

    return res;
  }

  //Add actor
  function addActor(actor) {
    function redrawActor() {
      var ft = actor.frozen();

      redrawActors();
      
      if (ft > 0) {        
        sctx.fillStyle = '#FFF';
        sctx.strokeStyle = '#FFF';
        sctx.font = "14px 'Patrick Hand', serif";

        sctx.fillText (
          'Frozen ' + ft, 
          (actor.pos().x * properties.drawSize) + (properties.drawSize - (properties.drawSize / 2)), 
          (actor.pos().y * properties.drawSize) - 12
        );
      }

      //Draw the actor
      //clear(actor.opos(), spriteLayer);
      // blitThing(actor, spriteLayer);

      //redraw(actor.opos());
      //redraw(actor.pos());
    
      assemble();
    }

    actor.on('Move', redrawActor);
    actor.on('Frozen', redrawActor);
    
    actor.on('Kill', function () {
      clear(actor.pos(), spriteLayer);
      redraw(actor.pos());
    });

    actors.push(actor);
    redrawActor();
  }

  function fireProjectile(attr, originator) {
    var p = me.Projectile(attr, exports, originator);
    
    p.on('Step', function () {
      //Blit it
      clear(p.opos(), projectileLayer);
      clear(p.pos(), projectileLayer);
      
      blitThing(p, projectileLayer);
      
      redraw(p.opos().x, p.opos().y);
      redraw(p.pos().x, p.pos().y);
    });

    p.on('Kill', function () {
      clear(p.pos(), projectileLayer);
      clear(p.opos(), projectileLayer);
      redraw(p.pos().x, p.pos().y);
      redraw(p.opos().x, p.opos().y);
    });

    blitThing(p, projectileLayer);
    redraw(p.pos().x, p.pos().y);
    
    projectiles.push(p);
    return p;
  }

  function processTurn() {
    //Update projectiles
    projectiles = projectiles.filter(function (p) {
      //redraw(p.opos());
      if (p.processTurn()) {
        return true;        
      }
      return false;
    });

    actors.forEach(function (actor) {
      actor.processTurn();
    });
  }

  

  /////////////////////////////////////////////////////////////////////////////

  //Init everything
  projectileLayer.width = backgroundLayer.width = indicatorLayer.width = spriteLayer.width = canvas.width = properties.width * properties.drawSize;
  projectileLayer.height = backgroundLayer.height = indicatorLayer.height = spriteLayer.height = canvas.height = properties.height * properties.drawSize;

  backgroundLayer.getContext('2d').imageSmoothingEnabled = false;
  projectileLayer.getContext('2d').imageSmoothingEnabled = false;
  spriteLayer.getContext('2d').imageSmoothingEnabled = false;
  ctx.imageSmoothingEnabled = false;

  for (var i = 0; i < properties.width * properties.height; i++) {
    data.push(0);
  }

  exports = {
    canvas: canvas,
    on: events.on,
    properties: properties,
    clear: clear,
    processTurn: processTurn,
    indicators: {
      draw: drawDirectionLine,
      enable: indicatorsEnable
    },
    actors: {
      add: addActor,
      collision: actorCollision
    },
    data: {
      dirty: redraw,
      get: getTile,
      set: setTile,
      collision: collision
    },
    projectiles: {
      fire: fireProjectile
    },
    tileset: function () { return tileset; }
  };

  return exports;
};
