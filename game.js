var Game = {
  display: null,
  x: 1,
  y: 17,
  mapData: {},
  init: function() {
    var width = 60, height = 40;
    //ROT.RNG.setSeed(1234);

    var map = new ROT.Map.Rogue(width, height);
    this.display = new ROT.Display({
      width: width,
      height: height,
      fg: "black",
      bg: "white",
      fontSize: 8,
      spacing: 1.1
    });

    var mapData = this.mapData;
    map.create(function(x, y, wall) {
      mapData[x + "," + y] = wall ? "#" : ".";
      //this.display.draw(x, y, wall ? "#" : ".");
    });

    do {
      this.x = parseInt(ROT.RNG.getUniform() * width);
      this.y = parseInt(ROT.RNG.getUniform() * height);
    } while (this.mapData[this.x + "," + this.y] != ".");


    this.draw();
    document.body.appendChild(this.display.getContainer());
    document.body.addEventListener("keypress", this.onKeyPress.bind(this));
  },
  onKeyPress: function (e) {
    var key = String.fromCharCode(e.charCode);
    var x = this.x, y = this.y;
    var mapData = this.mapData;
    if (key == "h" && mapData[(x - 1) + "," + y] == ".") {
      this.display.drawText(x, y, ".");
      this.x--;
      this.draw();
    } else if (key == "j" && mapData[x + "," + (y + 1)] == ".") {
      this.display.drawText(x, y, ".");
      this.y++;
      this.draw();
    } else if (key == "k" && mapData[x + "," + (y - 1)] == ".") {
      this.display.drawText(x, y, ".");
      this.y--;
      this.draw();
    } else if (key == "l" && mapData[(x + 1) + "," + y] == ".") {
      this.display.drawText(x, y, ".");
      this.x++;
      this.draw();
    } else if (key == "y" && mapData[(x - 1) + "," + (y - 1)] == ".") {
      this.display.drawText(x, y, ".");
      this.x--; this.y--;
      this.draw();
    } else if (key == "u" && mapData[(x + 1) + "," + (y - 1)] == ".") {
      this.display.drawText(x, y, ".");
      this.x++; this.y--;
      this.draw();
    } else if (key == "b" && mapData[(x - 1) + "," + (y + 1)] == ".") {
      this.display.drawText(x, y, ".");
      this.x--; this.y++;
      this.draw();
    } else if (key == "n" && mapData[(x + 1) + "," + (y + 1)] == ".") {
      this.display.drawText(x, y, ".");
      this.x++; this.y++;
      this.draw();
    }
  },
  draw: function () {
    var fov = new ROT.FOV.PreciseShadowcasting(this.getLightPasses(this.mapData));
    var display = this.display;
    var mapData = this.mapData;
    fov.compute(this.x, this.y, 20, function(x, y, r, visibility) {
      var ch = (r ? mapData[x + "," + y] : "@");
      display.draw(x, y, ch);
    });
    display.drawText(this.x, this.y, "@");
  },
  getLightPasses: function (mapData) {
    return function (x, y) {
      var key = x+","+y;
      if (key in mapData) { return (mapData[key] == "."); }
      return false;
    };
  }
};
