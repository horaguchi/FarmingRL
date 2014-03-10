var Game = {
  display: null,
 
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
      this.display.draw(x, y, wall ? "#" : ".");
    }.bind(this));
    document.body.appendChild(this.display.getContainer());
    var x = 5, y = 5;
    document.body.addEventListener("keypress", function (e) {
      var key = String.fromCharCode(e.charCode);
      this.display.drawText(x, y, ".");
      if (key == "h") {
        x--;
      } else if (key == "j") {
        y++;
      } else if (key == "k") {
        y--;
      } else if (key == "l") {
        x++;
      } else if (key == "y") {
        x--; y--;
      } else if (key == "u") {
        x++; y--;
      } else if (key == "b") {
        x--; y++;
      } else if (key == "n") {
        x++; y++;
      }
      this.display.drawText(x, y, "@");
    }.bind(this));
  }
};
