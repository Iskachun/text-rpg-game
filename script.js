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
function type (lines2, elementId, speed2 = 180, onComplete) {
  lineIndex = 0;
  charIndex = 0;
  lines = lines2;
  typedElement = document.getElementById(elementId);
  speed = speed2;
  typedElement.innerHTML = ""; // clear previous text
  typeWriter(onComplete);
}

let progress = "welcome"; 
localStorage.setItem("progress", progress);


// ENTERING //

function enter () {
  type(["Welcome, traveler", ""], "welcome", 180, () => {
    document.getElementById("start_btn").style.visibility = "visible";
  });
}

const saved = localStorage.getItem("progress");
if (saved == "welcome") enter();
else gameStart();

// GAME START //

function gameStart () {
  document.getElementById("welcome").remove();
  document.getElementById("start_btn").remove();
  progress = "start";

  localStorage.setItem("progress", progress);

}