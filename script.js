
const div1 = document.getElementById("inv");
const div2 = document.getElementById("inv-cont");
div1.addEventListener("mouseover", () => {
  div2.style.display = "block";
  div1.style.color = "#cec1d3";
});

div1.addEventListener("mouseout", () => {
  div2.style.display = "none";
  div1.style.color = "#908894";
});

const div3 = document.getElementById("stats");
const div4 = document.getElementById("stats-cont");
div3.addEventListener("mouseover", () => {
  div4.style.display = "block";
  div3.style.color = "#cec1d3";
});

div3.addEventListener("mouseout", () => {
  div4.style.display = "none";
  div3.style.color = "#908894";
});



let lines = [];
let lineIndex = 0;
let charIndex = 0;
let speed = 180; // typing speed in ms
let typedElement = document.getElementById("typed-text");

let inv_money = document.getElementById("money");
let inv_item = document.getElementById("inv_items");

let stats_health = document.getElementById("health");
let stats_stamina = document.getElementById("stamina");

let money = 100;
let items = [];

let health = 100;
let stamina = 100;


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

  for (let item of items) {
    inv_item.innerHTML += item + "<br>";
  }

  localStorage.setItem("money", JSON.stringify(money));
  localStorage.setItem("items", JSON.stringify(items));
}


function update_stats () {
  stats_health.innerHTML = JSON.stringify(health);
  stats_stamina.innerHTML = JSON.stringify(stamina);

  localStorage.setItem("health", JSON.stringify(health));
  localStorage.setItem("stamina", JSON.stringify(stamina));
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
  localStorage.removeItem("sublocation");
  localStorage.removeItem("subsublocation");
  localStorage.removeItem("function");

  money = 100;
  items = [];

  health = 100;
  stamina = 100;

  visit_cnt = {
    "forest_path" : 0
  };
  save();

  location.reload();
}

function clear () {
  document.getElementById("start_btn").style.display = "none";

  document.getElementById("c1").style.display = "none";
  document.getElementById("c2").style.display = "none";

  document.getElementById("c3").style.display = "none";
  document.getElementById("c4").style.display = "none";

  document.getElementById("c5").style.display = "none";

  document.getElementById("c51").style.display = "none";

  document.getElementById("c52").style.display = "none";
  document.getElementById("c521").style.display = "none";
  document.getElementById("c522").style.display = "none";
  document.getElementById("c523").style.display = "none";
  document.getElementById("c53").style.display = "none";

  document.getElementById("c6").style.display = "none";
  document.getElementById("c7").style.display = "none";
  
}

function display (s) {

  document.getElementById(s).style.display = "block";
}

function save () {
  update_inv();
  update_stats();

  localStorage.setItem("visited", JSON.stringify(visit_cnt));
}

function load () {
  const saved_money = localStorage.getItem("money");
  const saved_items = localStorage.getItem("items");

  if (saved_money) {
    // saved progress -> replace with existing values
    money = JSON.parse(saved_money);
    items = JSON.parse(saved_items);
  }
  update_inv();

  
  const saved_health = localStorage.getItem("health");
  const saved_stamina = localStorage.getItem("stamina");

  if (saved_health) {
    health = JSON.parse(saved_health);
    stamina = JSON.parse(saved_stamina);
  }

  update_stats();


  const saved_visit = localStorage.getItem("visited");

  if (saved_visit) {
    visit_cnt = JSON.parse(saved_visit);
  }

  ////////////////////////////////////////////////////////////

  const saved = localStorage.getItem("location");
  if (saved == "welcome" || !saved) {
    // First time or still on welcome screen
    if (!saved) localStorage.setItem("location", "welcome");
    enter();
  } else {
    gameStart();
  }
}



function move (position) {
  const currentFunc = localStorage.getItem("function");

  // every time the player moves they use one unit of stamina

  if (currentFunc && currentFunc != position) {
    stamina--;  
    update_stats();

    if (!visit_cnt[position]) visit_cnt[position] = 0;

    visit_cnt[position] += 1;
    save();
  }


  localStorage.setItem("function", position);

  if (stamina <= 10) {
    // alert the player that they're running out of stamina
    document.getElementById("stamina-alert").innerHTML = "You have little stamina left!<br>Eat food or rest to get more stamina."
  } 
  else {
    document.getElementById("stamina-alert").innerHTML = "";
  }
}





// LOADING DATA AND STARTING THE GAME //
load();



// ENTERING //

function enter () {
  type(["Welcome, traveler", ""], "welcome", () => {
    document.getElementById("start_btn").style.display = "block";
  });

  money = 100;
  items = [];
  health = 100;
  stamina = 100;
  visit_cnt = {
    "forest_path" : 0
  };
}




// GAME START //

function gameStart () {
  document.getElementById("welcome").style.display = "none";
  clear();

  display("inv");
  display("stats");
  display("reset_btn");
  

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



// PATH IN THE FOREST //
function forest_path () {
  clear();
  move("forest_path");

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
        display("c1");
        display("c2");
      });

  });

}



// ENTERING THE VILLAGE //
function enter_village () {
  clear();
  move("enter_village");

  function go () {
    speed = 100;
    type([
      "You follow the path.",
      "Soon, you see a village.",
      "You can hear the bustling of people.",
      "It seems like a nice place.",
      ""
    ], "text", () => {
      display("c3");
      display("c4");
    });
  }

  go();
}

// INSIDE THE VILLAGE //
function village () {
  clear();

  const subloc = localStorage.getItem("sublocation");

  if (subloc == "square") {square(); return;}
  if (subloc == "market") {market(); return;}
  if (subloc == "inn") {inn(); return;}

  move("village");

  localStorage.setItem("location", "village");

  function go () {
    speed = 100;
    type([
      "You enter the village.",
      "It's a nice, cozy place.", 
      "The houses are small and comfortable.",
      "People walk by, smiling to you.",
      "Where will you go?",
      ""
    ], "text", () => {
      display("c5");
      display("c6");
      display("c7");
    });
  }

  go();
}


// VILLAGE MAIN SQUARE //
function square (index = 0) {
  clear();

  const subsublocation = localStorage.getItem("subsublocation");
  if (subsublocation == "group") {group(); return;}
  if (subsublocation == "bench") {bench(); return;}
  if (subsublocation == "inn") {inn(); return;}

  move("square");

  localStorage.setItem("sublocation", "square");
  function go () {
    l = ["You follow the main road,",
      "and soon enter the town square.",
      "There are people everywhere.",
      "Some are chatting together.",
      "Some sit on the benches and relax.",
      "A bard is singing verses.",
      "What will you do now?",
      ""]
    
    if (index) l = l.slice(index + 1);

    type(l, "text", () => {
      display("c51");
      display("c52");
      display("c53");
      display("c6");
      display("c7");
    });
  }

  go();
}

// APPROACH THE GROUP OF PEOPLE //
function group () {
  clear();
  move("group");
}

// APPROACH THE PERSON ON THE BENCH //
function bench () {
  clear();

  function go () {
    type([
      "You walk over to a bench and sit down.",
      "A young girl with two braids is sitting next to you,",
      "reading a book.",
      "She looks up curiously as you get close.",
      ""
    ], "text", () => {
      display("c521");
      display("c522");
      display("c523");
    });
  }

  go();
}

// TALK TO THE GIRL ON THE BENCH //
function talk_bench () {

}

// REST QUIETLY ON THE BENCH //
function rest_bench () {

}

// LEAVE THE BENCH //
function leave_bench () {
  localStorage.removeItem("subsublocation");
  clear();

  function go () {
    type([
      "You get up from the bench.",
      ""
    ], "text", () => {
      square(2);
    });
  }

  go();
}

// APPROACH THE BARD //
function bard () {

}

// VILLAGE MARKET //
function market () {

}


// VILLAGE INN //
function inn () {

}


// CONTINUE INTO THE FOREST //