const lines = [
  "Hello, I'm Alex!",
  "Welcome to my sanctuary", 
  "",
];

let lineIndex = 0;
let charIndex = 0;
const speed = 180; // typing speed in ms
const typedElement = document.getElementById("typed-text");

function typeWriter() {
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
