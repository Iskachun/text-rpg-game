let lines = [];
let lineIndex = 0;
let charIndex = 0;
let speed = 180; // typing speed in ms
let typedElement = document.getElementById("typed-text");

let inv_money = document.getElementById("money");
let inv_item = document.getElementById("inv_items");
let inv_weap = document.getElementById("inv_weapons");

let money = 0;
let items = [];
let weapons = [];

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
  localStorage.setItem("location", "welcome");
  location.reload();
}


money = 10;
items = ["Old sword", "Torn cloak"];
weapons = ["Rusty dagger"];

function update_inv () {
  inv_money.innerHTML = JSON.stringify(money);
  inv_item.innerHTML = "";
  inv_weap.innerHTML = "";

  for (let item of items) {
    inv_item.innerHTML += item + "<br>";
  }
  for (let weap of weapons) {
    inv_weap.innerHTML += weap + "<br>";
  }

  
  
}

update_inv();



// ENTERING //

function enter () {
  type(["Welcome, traveler", ""], "welcome", () => {
    document.getElementById("start_btn").style.visibility = "visible";
  });
}

const saved = localStorage.getItem("location");
if (saved == "welcome" || !saved) {
  // First time or still on welcome screen
  if (!saved) localStorage.setItem("location", "welcome");
  enter();
} else {
  gameStart();
}

// GAME START //

function gameStart () {
  document.getElementById("welcome").remove();
  document.getElementById("start_btn").remove();

  const saved = localStorage.getItem("location");
  if (saved == "welcome" ||  saved == "start") {
    localStorage.setItem("location", "start");
    forest_path();
  }
  else if (saved == "village") {
    village();
  } 
  else if (saved == "cont_forest") {
    cont_forest();
  }
}



let surprise_items = [
  "Bag with gold coins",
  "Suspicous bag",
  "Old dagger",
  "Dirty cloth",
  "Cool stick"
]

function surprise () {
  let val = Math.floor(Math.random() * 1000) + 1;

  if (val <= surprise_items.length) {
    type([
      "You see something out of the corner of your eye.",
      "Will you pick it up?"
    ], "text", () => {
      document.getElementById("s1").style.visibility = "Visible";
      document.getElementById("s2").style.visibility = "Visible";

      document.getElementById("s1").addEventListener("click", () => {
        
        type([
          "You pick it up.",
          "You find a ...",
          surprise_items[val]
        ], "text", () => {

                if (val == 0) {
                  money += Math.floor(Math.random() * 100) + 1;
                }
                else {
                  items.push(surprise_items[val]);
                }
          });

      });

      document.getElementById("s1").remove();
      document.getElementById("s2").remove();

    })
  }
}




function forest_path () {
  surprise();

  speed = 100;
  type([
    "You're in a forest.", 
    "A soft wind comes by,", "the leaves rustling.", 
    "The sun is shining,", "the birds chittering happily.", 
    "There is a path in front of you.", 
    "Will you follow it?"
  ], "text", () => {
    document.getElementById("c1").style.visibility = "Visible";
    document.getElementById("c2").style.visibility = "Visible";
  });
}


/* enter_village */
function enter_village () {
  document.getElementById("c1").remove();
  document.getElementById("c2").remove();

  function go () {
    speed = 100;
    type([
      "You follow the path.",
      "Soon, you see a village.",
      "You can hear the bustling of people.",
      "It seems like a nice place."
    ], "text", () => {
      document.getElementById("c3").style.visibility = "Visible";
      document.getElementById("c4").style.visibility = "Visible";
    });
  }

  go();
}

function village () {
  document.getElementById("c3").remove();
  document.getElementById("c4").remove();

  localStorage.setItem("location", "village");

  function go () {
    speed = 100;
    type([
      "You enter the village.",
      "It's a nice, cozy place.", 
      "The houses are small and comfortable.",
      "People walk by, smiling to you.",
      "Where will you go?"
    ], "text", () => {
      
    });
  }

  go();
}



/* cont_forest */