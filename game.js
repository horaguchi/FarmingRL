var Game = {
  display: null,
  x: -1,
  y: -1,
  mapData: {},
  monsters: [],
  init: function () {
    var width = 60, height = 40;
    //ROT.RNG.setSeed(1234);

    this.display = new ROT.Display({
      width: width,
      height: height,
      fg: "black",
      bg: "white",
      fontSize: 8,
      spacing: 1.1
    });

    var map = new ROT.Map.Rogue(width, height);
    var mapData = this.mapData;
    map.create(function (x, y, wall) {
      mapData[x + "," + y] = wall ? "#" : ".";
    });

    // initial player position
    do {
      this.x = parseInt(ROT.RNG.getUniform() * width);
      this.y = parseInt(ROT.RNG.getUniform() * height);
    } while (this.mapData[this.x + "," + this.y] != ".");

    // initial test monster
    for (var i = 0; i < 9; ++i) {
      var tmpX, tmpY;
      do {
        tmpX = parseInt(ROT.RNG.getUniform() * width);
        tmpY = parseInt(ROT.RNG.getUniform() * height);
      } while (this.mapData[tmpX + "," + tmpY] != ".");
      this.addMonster({
        symbol: String(i),
        x: tmpX,
        y: tmpY
      });
    }
    this.draw();
    document.body.appendChild(this.display.getContainer());
    document.body.addEventListener("keypress", this.onKeyPress.bind(this));
    window.setInterval(this.monsterAction.bind(this), 500);
  },
  addMonster: function (obj) {
    this.monsters.push(obj);
    this.mapData[obj.x + "," + obj.y] = obj.symbol;
  },
  monsterAction: function () {
    var display = this.display;
    var mapData = this.mapData;
    var passableCallback = function (x, y) {
      return (mapData[x + "," + y] == ".");
    };
    var playerX = this.x, playerY = this.y;
    var moved = false;
    this.monsters.forEach(function (obj) {
      mapData[obj.x + "," + obj.y] = ".";
      var i = 0;
      var dijkstra = new ROT.Path.Dijkstra(playerX, playerY, passableCallback);
      dijkstra.compute(obj.x, obj.y, function (x, y) {
        if (i++ == 1 && !(x == playerX && y == playerY) ) {
          obj.x = x;
          obj.y = y;
          moved = true;
        }
      });
      mapData[obj.x + "," + obj.y] = obj.symbol;
    });

    // redraw if moved
    if (moved) {
      this.draw();
    }
  },
  onKeyPress: function (e) {
    var key = String.fromCharCode(e.charCode);
    var x = this.x, y = this.y;
    var mapData = this.mapData;
    if (key == "h" && mapData[(x - 1) + "," + y] == ".") {
      this.x--;
      this.draw();
    } else if (key == "j" && mapData[x + "," + (y + 1)] == ".") {
      this.y++;
      this.draw();
    } else if (key == "k" && mapData[x + "," + (y - 1)] == ".") {
      this.y--;
      this.draw();
    } else if (key == "l" && mapData[(x + 1) + "," + y] == ".") {
      this.x++;
      this.draw();
    } else if (key == "y" && mapData[(x - 1) + "," + (y - 1)] == ".") {
      this.x--; this.y--;
      this.draw();
    } else if (key == "u" && mapData[(x + 1) + "," + (y - 1)] == ".") {
      this.x++; this.y--;
      this.draw();
    } else if (key == "b" && mapData[(x - 1) + "," + (y + 1)] == ".") {
      this.x--; this.y++;
      this.draw();
    } else if (key == "n" && mapData[(x + 1) + "," + (y + 1)] == ".") {
      this.x++; this.y++;
      this.draw();
    }
  },
  draw: function () {
    var fov = new ROT.FOV.PreciseShadowcasting(this.getLightPasses(this.mapData));
    var display = this.display;
    var mapData = this.mapData;
    fov.compute(this.x, this.y, 20, function (x, y, r, visibility) {
      var ch = (r ? mapData[x + "," + y] : "@");
      display.draw(x, y, ch);
    });
  },
  getLightPasses: function (mapData) {
    return function (x, y) {
      var key = x+","+y;
      if (key in mapData) { return (mapData[key] != "#"); }
      return false;
    };
  }
};
