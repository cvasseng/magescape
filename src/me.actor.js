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
      alive = true,
      events = me.Events(),
      exports = {},
      skills = {},
      frozenTurns = 0
  ;

  /////////////////////////////////////////////////////////////////////////////

  //Move to the left
  function moveLeft() {
    var a = map.actors.collision(pos.x - 1, pos.y);

    if (a) {
      events.emit('Bump', exports);
      return;
    }


    if (!map.data.collision(pos.x - 1, pos.y)) { 
      pos.x -= 1;
      events.emit('Move', exports);
      opos.y = pos.y;
      opos.x = pos.x;
    }
  }

  //Move to the right
  function moveRight() {
    var a = map.actors.collision(pos.x + 1, pos.y);

    if (a) {
      events.emit('Bump', exports);
      return;
    }

    if (!map.data.collision(pos.x + 1, pos.y)) {
      pos.x += 1;
      events.emit('Move', exports);
      opos.y = pos.y;
      opos.x = pos.x;
    }
  }

  //Move up
  function moveUp() {
    var a = map.actors.collision(pos.x, pos.y - 1);

    if (a) {
      events.emit('Bump', exports);
      return;
    }

    if (!map.data.collision(pos.x, pos.y - 1)) {
      pos.y -= 1;
      events.emit('Move', exports);
      opos.y = pos.y;
      opos.x = pos.x;
    }
  }

  //Move down
  function moveDown() {
    var a = map.actors.collision(pos.x, pos.y + 1);

    if (a) {
      events.emit('Bump', exports);
      return;
    }

    if (!map.data.collision(pos.x, pos.y + 1)) {
      pos.y += 1;
      events.emit('Move', exports);
      opos.y = pos.y;
      opos.x = pos.x;
    }
  }

  //Set position
  function setPos(x, y) {
    if (!y && x && x.y && x.x) {
      y = x.y;
      x = x.x;
    }    

    pos.x = x;
    pos.y = y;

    events.emit('Move', exports);
    
    opos.x = pos.x;
    opos.y = pos.y;
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
    freeze: freeze
  };

  return exports;
};