let lines = [];
let lineIndex = 0;
let charIndex = 0;
let speed = 180; // typing speed in ms
let typedElement = document.getElementById("typed-text");

let inv_money = document.getElementById("money");
let inv_item = document.getElementById("inv_items");
let inv_weap = document.getElementById("inv_weapons");

let money = 100;
let items = [];
let weapons = [];


let visit_cnt = {
  "forest_path" : 0
};


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

  localStorage.setItem("money", JSON.stringify(money));
  localStorage.setItem("items", JSON.stringify(items));
}




let surprise_items = [
  "Bag with gold coins",
  "Suspicous bag",
  "Old dagger",
  "Dirty cloth",
  "Cool stick"
]

function surprise (location, onComplete) {
  if (visit_cnt[location] <= 0) {
    // don't "generate" surprises when entered the first time
    if (onComplete) onComplete();
    return;
  }

  let val = Math.floor(Math.random() * 20) + 1;

  if (val < surprise_items.length) {
    type([
        "You notice something on the ground.",
        "Will you pick it up?",
        ""
      ], "text", () => {
        document.getElementById("s1").style.display = "block";
        document.getElementById("s2").style.display = "block";

        document.getElementById("s1").addEventListener("click", () => {
          document.getElementById("s1").style.display = "none";
          document.getElementById("s2").style.display = "none";
          
          type([
            "You pick it up.",
            "You find a",
            "",
            surprise_items[val],
            "",
            "You put it in your bag.",
            ""
          ], "text", () => {

                  if (val == 0) {
                    money += Math.floor(Math.random() * 100) + 1;
                  }
                  else {
                    items.push(surprise_items[val]);
                  }

                  update_inv();

                  if (onComplete) onComplete();
            });

        });

        document.getElementById("s2").addEventListener("click", () => {
          document.getElementById("s1").style.display = "none";
          document.getElementById("s2").style.display = "none";

          type([
            "You ignore it,",
            "and keep walking.",
            ""
          ], "text", () => {
            if (onComplete) onComplete();
          });
        });

     });
  }

  else if (onComplete) onComplete();
}


function restart () {
  localStorage.setItem("location", "welcome");
  money = 100;
  items = [];
  update_inv();

  location.reload();
}

function clear () {
  document.getElementById("start_btn").style.display = "none";

  document.getElementById("c1").style.display = "none";
  document.getElementById("c2").style.display = "none";
  document.getElementById("c3").style.display = "none";
  document.getElementById("c4").style.display = "none";
  document.getElementById("c5").style.display = "none";
  document.getElementById("c6").style.display = "none";
  document.getElementById("c7").style.display = "none";
  
}

function save () {
  update_inv();

  localStorage.setItem("visited", JSON.stringify(visit_cnt));
}



// ENTERING //

function enter () {
  type(["Welcome, traveler", ""], "welcome", () => {
    document.getElementById("start_btn").style.display = "block";
  });
}

const saved_money = localStorage.getItem("money");
const saved_items = localStorage.getItem("items");

if (saved_money) {
  // saved progress -> replace with existing values
  money = JSON.parse(saved_money);
  items = JSON.parse(saved_items);
}
update_inv();


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
  document.getElementById("welcome").style.display = "none";
  clear();

  document.getElementById("inv").style.display = "block";
  document.getElementById("reset_btn").style.display = "block"; 
  

  const saved = localStorage.getItem("location");
  speed = 100;
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




function forest_path () {
  clear();

  surprise("forest_path", () => {
    let l = [
        "You're in a forest.", 
        "A soft wind comes by,", "the leaves rustling.", 
        "The sun is shining,", "the birds chittering happily.", 
        "There is a path in front of you.", 
        "Will you follow it?",
        ""
      ]
    
    // skip first line if you've already been in the forest
    if (visit_cnt["forest_path"] > 0) l = l.slice(1);

    type(l, "text", () => {
        document.getElementById("c1").style.display = "block";
        document.getElementById("c2").style.display = "block";

        visit_cnt["forest_path"] += 1;
        save();
      });

  });

}



/* enter_village */
function enter_village () {
  clear();

  function go () {
    speed = 100;
    type([
      "You follow the path.",
      "Soon, you see a village.",
      "You can hear the bustling of people.",
      "It seems like a nice place.",
      ""
    ], "text", () => {
      document.getElementById("c3").style.display = "block";
      document.getElementById("c4").style.display = "block";
    });
  }

  go();
}

function village () {
  clear();

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