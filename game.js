var Game = {
  display: null,
  x: 1,
  y: 1,
  mapArray: {},
  init: function() {
    var map = new ROT.Map.Arena(60, 20);
    this.display = new ROT.Display({
      width: 60,
      height: 20,
      fg: "black",
      bg: "white",
      fontSize: 10,
      spacing: 1.1
    });

    map.create(function(x, y, wall) {
      this.mapArray[x + "," + y] = wall ? "#" : ".";
      this.display.draw(x, y, wall ? "#" : ".");
    }.bind(this));
    this.display.drawText(this.x, this.y, "@");
    document.body.appendChild(this.display.getContainer());
    document.body.addEventListener("keypress", this.onKeyPress.bind(this));
  },
  onKeyPress: function (e) {
    var key = String.fromCharCode(e.charCode);
    var x = this.x, y = this.y;
    var mapArray = this.mapArray;
    if (key == "h" && mapArray[(x - 1) + "," + y] == ".") {
      this.display.drawText(x, y, ".");
      this.x--;
      this.display.drawText(this.x, this.y, "@");
    } else if (key == "j" && mapArray[x + "," + (y + 1)] == ".") {
      this.display.drawText(x, y, ".");
      this.y++;
      this.display.drawText(this.x, this.y, "@");
    } else if (key == "k" && mapArray[x + "," + (y - 1)] == ".") {
      this.display.drawText(x, y, ".");
      this.y--;
      this.display.drawText(this.x, this.y, "@");
    } else if (key == "l" && mapArray[(x + 1) + "," + y] == ".") {
      this.display.drawText(x, y, ".");
      this.x++;
      this.display.drawText(this.x, this.y, "@");
    } else if (key == "y" && mapArray[(x - 1) + "," + (y - 1)] == ".") {
      this.display.drawText(x, y, ".");
      this.x--; this.y--;
      this.display.drawText(this.x, this.y, "@");
    } else if (key == "u" && mapArray[(x + 1) + "," + (y - 1)] == ".") {
      this.display.drawText(x, y, ".");
      this.x++; this.y--;
      this.display.drawText(this.x, this.y, "@");
    } else if (key == "b" && mapArray[(x - 1) + "," + (y + 1)] == ".") {
      this.display.drawText(x, y, ".");
      this.x--; this.y++;
      this.display.drawText(this.x, this.y, "@");
    } else if (key == "n" && mapArray[(x + 1) + "," + (y + 1)] == ".") {
      this.display.drawText(x, y, ".");
      this.x++; this.y++;
      this.display.drawText(this.x, this.y, "@");
    }
  }
};
