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

me.Actor = function (map, attributes) {
  var properties = me.merge({
        tileIndex: 90,
        pos: {x: 0, y: 0}
      }, attributes),
      pos = properties.pos,
      opos = {x: 0, y: 0},
      dir = {x: 0, y: 0},
      alive = true,
      events = me.Events(),
      exports = {},
      skills = {},
      frozenTurns = 0
  ;

  /////////////////////////////////////////////////////////////////////////////

  function move(nx, ny) {
    var a = map.actors.collision(Math.floor(nx), Math.floor(ny));

    if (a) {
      events.emit('Bump', exports);
      return;
    }


    if (!map.data.collision(Math.floor(nx), Math.floor(ny))) {             
      setPos(nx, ny);
    }
  }

  //Move to the left
  function moveLeft() {    
    move(pos.x - 1, pos.y);
  }

  //Move to the right
  function moveRight() {
    move(pos.x + 1, pos.y);
  }

  //Move up
  function moveUp() {
    move(pos.x, pos.y - 1);
  }

  //Move down
  function moveDown() {
    move(pos.x, pos.y + 1);
  }

  //Set position
  function setPos(nx, ny) {
    var int = 0,
        t = (new Date()).getTime(),
        d = 500,
        ox = pos.x,
        oy = pos.y
    ;

    function step(x, y) {
      if (!y && x && x.y && x.x) {
        y = x.y;
        x = x.x;
      }    

      console.log('step', x, y);

      pos.x = x;
      pos.y = y;

      events.emit('Move', exports);
      
      opos.x = pos.x;
      opos.y = pos.y;
    }

    step(nx, ny); 
    // int = setInterval(function () {
    //   var t0 = (new Date()).getTime() - t,
    //       t1 = t0 / d
    //   ;
      

    //   console.log(t0, t1);

    //   step(
    //     me.lerp(ox, nx, t1),
    //     me.lerp(oy, ny, t1)
    //   );
      
    //   if (t0 > d) {
    //     clearInterval(int);
    //   }
    // }, 10);

  }

  //Use a skill
  function useSkill(name) {
    if (typeof skills[name] !== 'undefined') {

      events.emit('UseSkill', exports, skills[name]);
    }
  }

  //Give a skill
  function giveSkill() {

  }

  //Kill
  function kill() {
    alive = false;
    events.emit('Kill', exports);
  }

  //Get the position
  function getPos() {
    return pos;
  }

  //Get the old position
  function getOPos() {
    return opos;
  }

  //Freeze the actor
  function freeze() {
    frozenTurns = 6;
    events.emit('Frozen', exports, frozenTurns);
  }

  function processTurn() {
    if (frozenTurns > 0) {
      frozenTurns--;
      events.emit('Frozen', exports, frozenTurns);
    }
    events.emit('Turn', exports);
  }

  /////////////////////////////////////////////////////////////////////////////

  //Public interface
  exports = {
    properties: properties,
    on: events.on,
    useSkill: useSkill,
    giveSkill: giveSkill,
    setPos: setPos,
    moveLeft: moveLeft,
    moveRight: moveRight,
    moveUp: moveUp,
    moveDown: moveDown,
    processTurn: processTurn,
    isAlive: function () { return alive; },
    frozen: function () { return frozenTurns; },
    pos: getPos,
    opos: getOPos,
    kill: kill,
    freeze: freeze,
    dir: dir
  };

  return exports;
};