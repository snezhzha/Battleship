var view = {
	displayMessage: function(msg) {
		var messageArea = document.getElementById("messageArea");
		messageArea.innerHTML = msg;
		
	},
	displayHit: function(location) {
		var cell = document.getElementById(location);
		cell.setAttribute("class","hit");
	},
	displayMiss: function(location) {
		var cell = document.getElementById(location);
		cell.setAttribute("class","miss");
	}
};

var model = {
	boardSize: 7,
	numShips: 3,
	shipLength: 3,
	shipsSunk: 0,
	
	ships: [ {locations: [0, 0, 0], hits: ["", "", ""]},
			 {locations: [0, 0, 0], hits: ["", "", ""]},
			 {locations: [0, 0, 0], hits: ["", "", ""]} ],

	fire: function(guess) {
		
		for(var i = 0; i < this.numShips; i++) {
			var ship = this.ships[i];
			//locations = ship.locations;
			//var index = locations.indexOf(guess); // returns -1 when can't find the matches
			var index = ship.locations.indexOf(guess); // chaining
			if (index >= 0) {
				if (document.getElementById(guess).getAttribute("class")) {
					view.displayMessage("Hey, why are you shooting the same place?");
					return false;
				} else {
					ship.hits[index] = "hit";
					view.displayHit(guess);
					view.displayMessage("HIT!");
					if (this.isSunk(ship)) {
						view.displayMessage("You sank my battleship!");
						this.shipsSunk++;
					}
					return true;
				}
			}
		}

		view.displayMiss(guess);
		view.displayMessage("You missed.");
		return false;
	},
	
	isSunk: function(ship) {
		for (var i = 0; i < this.shipLength; i++) {
			if (ship.hits[i] !== "hit") {
				return false;
			}
		}
		return true;
	},

	generateShipLocations: function() {
		var locations;
		for (var i = 0; i < this.numShips; i++) {
			do {
				locations = this.generateShip();
			} while (this.collision(locations));
			this.ships[i].locations = locations;
			console.log(model.ships[i].locations);
		}
	},

	generateShip: function() {
		var direction = Math.floor(Math.random() * 2);
		var row, col;

		if (direction === 1) {
			row = Math.floor(Math.random() * this.boardSize);
			col = Math.floor(Math.random() * (this.boardSize - this.shipLength));

		} else {
			row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
			col = Math.floor(Math.random() * this.boardSize);

		}

		var newShipLocations = [];
		for (var i = 0; i < this.shipLength; i++) {
			if(direction === 1) {
				newShipLocations.push(row + "" + (col + i));
			} else {
				newShipLocations.push((row + i) + "" + col);
			}
		}
		return newShipLocations;
	},

	collision: function(locations1) {
		for (var i = 0; i < this.numShips; i++) {
			var ship = model.ships[i];
			for (var j = 0; j < locations1.length; j++) {
				if(ship.locations.indexOf(locations1[j]) >= 0) {
					return true;
				}
			}
		}
		return false;
	}
};

var controller = {
	guesses: 0,
	
	processGuess: function (guess) {
		var location = parseGuess(guess);
		if (location) {
			this.guesses++;
			var hit = model.fire(location);
			if (hit && model.shipsSunk === model.numShips) {
				view.displayMessage("You sank all my battleships, in " + this.guesses + " guesses.");
			}
		}
	}
};

function parseGuess (guess) {
	var alphabet = ["A", "B", "C", "D", "E", "F", "G"];
	if (guess === null || guess.length !== 2) {
		alert("Oops, please enter a letter and a number on the board.");
	} else {
		firstChar = guess.charAt(0);
		var row = alphabet.indexOf(firstChar);
		var column = guess.charAt(1);

		if (isNaN(row) || isNaN(column)) {
			alert("Oops, that's not on the board.");
		} else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize) {
			alert("Oops, that's off the board.");
		} else {
			return row + column;
		}
	}
	return null;
}

function init() {
	var fireButton = document.getElementById("fireButton");
	fireButton.onclick = handleFireButton;
	var guessInput = document.getElementById("guessInput");
	guessInput.onkeypress = handleKeyPress;

	model.generateShipLocations();
}

function handleFireButton() {
	var guessInput = document.getElementById("guessInput");
	var guess = guessInput.value;
	controller.processGuess(guess);
	guessInput.value = ""; //reset of the input, making it clear
}

function handleKeyPress(e) {
	var fireButton = document.getElementById("fireButton");
	//alert(e.keyCode);
	if (e.keyCode === 13) {
		fireButton.click();
		return false;
	}
}

window.onload = init;



/* view.displayHit("00");
view.displayHit("34");
view.displayMiss("55");
view.displayHit("12");
view.displayMiss("25");
view.displayHit("26");

model.fire("53");
model.fire("06");
model.fire("16");
model.fire("26");
model.fire("34");
model.fire("24");
model.fire("44");
model.fire("12");
model.fire("11");
model.fire("10");

console.log(parseGuess("A0"));
console.log(parseGuess("B6"));
console.log(parseGuess("G3"));
console.log(parseGuess("H0"));
console.log(parseGuess("A7"));
 
controller.processGuess("A0");
controller.processGuess("A6");
controller.processGuess("B6");
controller.processGuess("C6");
controller.processGuess("C4");
controller.processGuess("D4");
controller.processGuess("E4");
controller.processGuess("B0");
controller.processGuess("B1");
controller.processGuess("B2");
*/

















/* var randomLoc = Math.floor(Math.random()*5); 
// Math.random() returns numbers between 0 and 1(0.128, 0.830 etc.) but not including 1 (max value 0.999...)
// We're multiplying random number by 5 to obtain a number between 1 and 5, but not including 5
// Math.floor() round down the value to it's nearest integer value(0.123 = 0; 2.34 = 2; 4.9999 = 4)

var location1 = randomLoc;
var location2 = location1 + 1;
var location3 = location2 + 1;

var guess;
var hits = 0;
var guesses = 0;
var isSunk = false;

while(isSunk == false){
	guess = prompt("Ready, aim, fire! (enter a number 0-6): ");
	if (guess !== null && guess !== ""){
		if (guess < 0 || guess > 6) {
			alert("Please enter a valid cell number!");
		}
		else {
			guesses++;
			if(guess == location1 || guess == location2 || guess == location3){
				alert("HIT");
				hits++;
				if(hits == 3){
					isSunk = true;
					alert("Hey! You sunk my battleship!");
				}
			} else {
				alert("MISS");
			}
		}
	} else { 
		isSunk = true;
	}
}

if (guess !== "" &&  guess !== null){
	var status = "You took " + guesses + " guesses to sunk my battleship, " + "which means your shooting accuracy was " + (3/guesses);
	alert(status);
} */