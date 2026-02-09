let lines = [];

let lineIndex = 0;
let charIndex = 0;
let speed = 180; // typing speed in ms
let typedElement = document.getElementById("typed-text");

function typeWriter (onComplete) {
  if (charIndex < lines[lineIndex].length) {
    typedElement.innerHTML += lines[lineIndex].charAt(charIndex);
    
    charIndex++;
    setTimeout(() => typeWriter(onComplete), speed);

    
  } else {
    // finished one line → move to next
    lineIndex++;
    if (lineIndex < lines.length) {
      setTimeout(() => {
        typedElement.innerHTML += "<br>"; // line break
        charIndex = 0;
        typeWriter(onComplete);
      }, speed * 10); // small pause before next line
    } else if (onComplete) {
      // all lines finished - call callback
      onComplete();
    }
  }
}

// typewriter function that takes the text and element id as parameters
function type (lines2, elementId, onComplete) {
  lineIndex = 0;
  charIndex = 0;
  lines = lines2;
  typedElement = document.getElementById(elementId);
  typedElement.innerHTML = ""; // clear previous text
  typeWriter(onComplete);
}

function restart () {
  localStorage.setItem("progress", "welcome");
  location.reload();
}




// ENTERING //

function enter () {
  type(["Welcome, traveler", ""], "welcome", () => {
    document.getElementById("start_btn").style.visibility = "visible";
  });
}

const saved = localStorage.getItem("progress");
if (saved == "welcome" || !saved) {
  // First time or still on welcome screen
  if (!saved) localStorage.setItem("progress", "welcome");
  enter();
} else {
  gameStart();
}

// GAME START //

function gameStart () {
  document.getElementById("welcome").remove();
  document.getElementById("start_btn").remove();

  const saved = localStorage.getItem("progress");
  if (saved == "welcome") {
    localStorage.setItem("progress", "start");
  }

  forest_path();
}

function forest_path () {
  speed = 100;
  type(["You're in a forest.", 
    "A soft wind comes by,", "the leaves rustling.", 
    "The sun is shining,", "the birds chittering happily.", 
    "There is a path in front of you.", 
    "Will you follow it?"], "text", () => {
    document.getElementById("c1").style.visibility = "Visible";
    documetn.getElementById("c2").style.visibility = "Visible";
  });
}