function generateLine(x, y, width, height, className = "basicline") {
  const fret = document.createElementNS("http://www.w3.org/2000/svg", "line");
  fret.setAttributeNS(null, "x1", x);
  fret.setAttributeNS(null, "x2", x + width);
  fret.setAttributeNS(null, "y1", y);
  fret.setAttributeNS(null, "y2", y + height);
  fret.setAttributeNS(null, "class", className);
  //fret.style = "stroke: rgb(0, 0, 0); stroke-width: 2";
  return fret;
}

function generateCircle(x, y, radius, filled, className = "") {
  const finger = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  finger.setAttributeNS(null, "cx", x);
  finger.setAttributeNS(null, "cy", y);
  finger.setAttributeNS(null, "r", radius);
  finger.setAttributeNS(null, "stroke", "black");
  finger.setAttributeNS(null, "stroke-width", "2");

  finger.setAttributeNS(null, "class", className);
  if (filled) {
    finger.setAttributeNS(null, "fill", "black");
  } else {
    finger.setAttributeNS(null, "fill", "white");
  }
  return finger;
}

function makeBlock() {
  var padding = 50;
  var topPadding = 100;
  var frets = Number(document.getElementById("frets").value);
  var strings = 6;
  var boardWidth = 150;
  var fretHeight = 50;
  var stringWidth = boardWidth / (strings - 1);
  var fingeringRadius = 10;
  var dotRadius = 6;

  var svgcanvas = document.getElementById("canvas");
  svgcanvas.innerHTML = "";

  svgcanvas.setAttributeNS("http://www.w3.org/2000/svg", "width", boardWidth + padding * 2);
  svgcanvas.setAttributeNS("http://www.w3.org/2000/svg", "height", topPadding + frets * fretHeight + padding);
  svgcanvas.setAttribute("width", boardWidth + padding * 2);
  svgcanvas.setAttribute("height", topPadding + frets * fretHeight + padding);

  // Title
  var txt = document.createElementNS("http://www.w3.org/2000/svg", "text");
  var titlePad = Number(document.getElementById("titlePad").value);
  txt.setAttributeNS(null, "x", (boardWidth + padding * 2) / 2);
  txt.setAttributeNS(null, "y", topPadding / 2 + titlePad);
  txt.setAttributeNS(null, "text-anchor", "middle");
  txt.setAttributeNS(null, "fill", "black");
  txt.setAttributeNS(null, "class", "title");
  txt.innerHTML = document.getElementById("title").value;
  svgcanvas.appendChild(txt);

  // Note
  var note = document.createElementNS("http://www.w3.org/2000/svg", "text");
  note.setAttributeNS(null, "x", (boardWidth + padding * 2) / 2);
  note.setAttributeNS(null, "y", topPadding + frets * fretHeight + 20);
  note.setAttributeNS(null, "text-anchor", "middle");
  note.setAttributeNS(null, "fill", "black");
  note.setAttributeNS(null, "class", "subnote");
  note.innerHTML = document.getElementById("note").value;
  svgcanvas.appendChild(note);

  // Fret Marker
  var txt = document.createElementNS("http://www.w3.org/2000/svg", "text");
  txt.setAttributeNS(null, "x", padding - 20);
  txt.setAttributeNS(null, "y", topPadding + fretHeight / 2);
  txt.setAttributeNS(null, "text-anchor", "middle");
  txt.setAttributeNS(null, "fill", "black");
  txt.setAttributeNS(null, "class", "basefret");
  txt.setAttributeNS(null, "alignment-baseline", "central");
  txt.innerHTML = document.getElementById("fret").value;
  svgcanvas.appendChild(txt);

  // Frets
  for (var i = 0; i <= frets; i++) {
    var fret = generateLine(padding, topPadding + i * fretHeight, boardWidth, 0);
    svgcanvas.appendChild(fret);
  }

  // Strings
  for (var i = 0; i < strings; i++) {
    var string = generateLine(padding + i * stringWidth, topPadding, 0, frets * fretHeight);
    svgcanvas.appendChild(string);
  }

  // Dots

  var singleDots = [3, 5, 7, 9, 15, 17, 19, 21];
  var doubleDots = [12, 24];

  if (document.getElementById("showDots").checked) {
    var dotFret = Number(document.getElementById("fret").value);
    if (dotFret == "") {
      dotFret = 1;
    }
    var dotFrets = Number(document.getElementById("frets").value);

    singleDots.forEach((place) => {
      if (dotFret <= place && dotFret + dotFrets > place) {
        var pos = topPadding + (place - dotFret + 1) * fretHeight - fretHeight / 2;
        var circle3 = generateCircle(padding + (strings * stringWidth) / 2.0 - stringWidth / 2, pos, dotRadius, true, "dot");
        svgcanvas.appendChild(circle3);
      }
    });

    doubleDots.forEach((place) => {
      if (dotFret <= place && dotFrets + dotFret > place) {
        var pos = topPadding + (place - dotFret + 1) * fretHeight - fretHeight / 2;
        var circle3 = generateCircle(padding + (strings * stringWidth) / 2.0 - stringWidth / 2 - stringWidth, pos, dotRadius, true, "dot");
        svgcanvas.appendChild(circle3);
        var circle3 = generateCircle(padding + (strings * stringWidth) / 2.0 - stringWidth / 2 + stringWidth, pos, dotRadius, true, "dot");
        svgcanvas.appendChild(circle3);
      }
    });
  }
  // Barre
  var barreFret = document.getElementById("barreFret").value;
  var barreStart = document.getElementById("barreStart").value;
  var barreEnd = document.getElementById("barreEnd").value;

  if (barreFret != "") {
    var barre = generateLine(
      padding + barreStart * stringWidth,
      topPadding + barreFret * fretHeight + fretHeight / 2,
      stringWidth * (barreEnd - barreStart),
      0,
      "barreline"
    );
    svgcanvas.appendChild(barre);
  }

  // Fingerings

  strings = data.value.split("\n");
  var str = 0;
  strings.forEach((string) => {
    datum = string.split(" ");
    datum.forEach((element) => {
      var options = element.split("|");
      var f = options[0];
      if (f == "") {
        return;
      }
      if (f == "x" || f == "X") {
        var txt = document.createElementNS("http://www.w3.org/2000/svg", "text");
        txt.setAttributeNS(null, "x", padding + str * stringWidth);
        txt.setAttributeNS(null, "y", topPadding - 12);
        txt.setAttributeNS(null, "text-anchor", "middle");
        txt.setAttributeNS(null, "fill", "black");
        txt.setAttributeNS(null, "class", "mute");
        txt.setAttributeNS(null, "alignment-baseline", "central");
        txt.innerHTML = "X";
        svgcanvas.appendChild(txt);
      } else if (f <= frets) {
        var filled = options[2] === "U" ? false : true;
        var letter = options[1];

        if (f == 0) {
          var circle = generateCircle(padding + str * stringWidth, topPadding - fingeringRadius - 3, fingeringRadius - 2, filled);
        } else {
          var circle = generateCircle(padding + str * stringWidth, topPadding + fretHeight / 2 + (f - 1) * fretHeight, fingeringRadius, filled);
        }
        svgcanvas.appendChild(circle);
        if (letter !== "" && letter != undefined) {
          var txt = document.createElementNS("http://www.w3.org/2000/svg", "text");
          txt.setAttributeNS(null, "x", padding + str * stringWidth);

          if (f != 0) {
            txt.setAttributeNS(null, "y", topPadding + fretHeight / 2 + (f - 1) * fretHeight);
          } else {
            txt.setAttributeNS(null, "y", topPadding - fingeringRadius - 4);
          }
          txt.setAttributeNS(null, "text-anchor", "middle");
          if (filled) {
            txt.setAttributeNS(null, "fill", "white");
          } else {
            txt.setAttributeNS(null, "fill", "black");
          }

          txt.setAttributeNS(null, "class", "fingering");
          txt.setAttributeNS(null, "alignment-baseline", "central");
          txt.innerHTML = letter;
          canvas.appendChild(txt);
        }
      }
    });
    str++;
  });
}
