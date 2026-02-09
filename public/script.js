let lines = [];

let lineIndex = 0;
let charIndex = 0;
let speed = 180; // typing speed in ms
let typedElement = document.getElementById("typed-text");

function typeWriter () {
  if (charIndex < lines[lineIndex].length) {
    typedElement.innerHTML += lines[lineIndex].charAt(charIndex);
    
    charIndex++;
    setTimeout(typeWriter, speed);

    
  } else {
    // finished one line → move to next
    lineIndex++;
    if (lineIndex < lines.length) {
      setTimeout(() => {
        typedElement.innerHTML += "<br>"; // line break
        charIndex = 0;
        typeWriter();
      }, 700); // small pause before next line
    }
  }
}

window.onload = typeWriter;


function type (lines2, elementId, speed2 = 180) {
  lineIndex = 0;
  charIndex = 0;
  lines = lines2;
  typedElement = document.getElementById(elementId);
  speed = speed2;
  typedElement.innerHTML = ""; // clear previous text
  typeWriter();
}

type(["Welcome, traveler"], "welcome");