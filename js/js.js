// [ROW][COLUMN][tileROW][tileCOLUMN]

var inkedGrid = [];
var activePiece = "";
var round = 0;
var specialPlayedThisRound = false;
var specialsPlayedThisGame = 0;
var specialIsActive = false;
var tilesPlayedThisRound = 0;
var placeX = 0;
var placeY = 0;
var gameStarted = false;
var networks = [];

var tile1 = "";
var tile2 = "";
var tile3 = "";
var tile4 = "";
var tile5 = "";

var tileName1 = "";
var tileName2 = "";
var tileName3 = "";
var tileName4 = "";
var tileName5 = "";

var specialsPlayed = [];
var diceResults = [];
var originalDiceResults = [];

var roadI = [];
var railI = [];
var roadL = [];
var railL = [];
var roadT = [];
var railT = [];
var stationI = [];
var stationL = [];
var overpass = [];
var specialA = [];
var specialB = [];
var specialC = [];
var specialD = [];
var specialE = [];
var specialF = [];
var blank = [];

function startGame() {
	if (!gameStarted) {
		round = 1;
		initTiles();
		initGrid();
		drawGrid(inkedGrid);
		networks.length = 0;

		document.getElementsByClassName("start")[0].classList.toggle("hidden");
		document.getElementsByClassName("container")[0].classList.toggle("hidden");
		document.getElementById("roundCount").innerHTML = "<h1>Round 1 of 7</h1>";
		gameStarted = true;
	}
}

function placePiece(x, y) {
	for (var i = 0; i < 3; i++) {
		inkedGrid[x][y][i][0] = window[activePiece][i][0];
		inkedGrid[x][y][i][1] = window[activePiece][i][1];
		inkedGrid[x][y][i][2] = window[activePiece][i][2];
		inkedGrid[x][y][i][0].inked = "pending";
		inkedGrid[x][y][i][1].inked = "pending";
		inkedGrid[x][y][i][2].inked = "pending";
	}
	initTiles();
	activePiece = ""; document.getElementById("namedPiece").innerHTML = "";
	document.getElementById("reversePiece").innerHTML = '';
}

function erasePiece(x, y) {
	for (var i = 0; i < 3; i++) {
		inkedGrid[x][y][i][0] = blank[i][0];
		inkedGrid[x][y][i][1] = blank[i][1];
		inkedGrid[x][y][i][2] = blank[i][2];
	}
	initTiles();
}

function rotateActivePiece(x, y) {
	var rotatingPiece = [];
	rotatingPiece[0] = new Array ("", "", "");
	rotatingPiece[1] = new Array ("", "", "");
	rotatingPiece[2] = new Array ("", "", "");

	for (var i = 0; i < 3; i++) {
		for (var k = 0; k < 3; k++) {
			rotatingPiece[i][k] = inkedGrid[x][y][i][k];
		}
	}

	inkedGrid[x][y][1][2] = rotatingPiece[0][1]; changeOrientation(inkedGrid[x][y][1][2]);
	inkedGrid[x][y][0][1] = rotatingPiece[1][0]; changeOrientation(inkedGrid[x][y][0][1]);
	inkedGrid[x][y][1][0] = rotatingPiece[2][1]; changeOrientation(inkedGrid[x][y][1][0]);
	inkedGrid[x][y][2][1] = rotatingPiece[1][2]; changeOrientation(inkedGrid[x][y][2][1]);
	changeOrientation(inkedGrid[x][y][1][1]);

	drawGrid(inkedGrid);
}

function changeOrientation(piece) {
	if (piece.orientation != "int") {
		if (piece.orientation === "ns") { piece.orientation = "ew"; }
		else { piece.orientation = "ns"; }
	}
}

function reverseActivePiece() {
	var flipPiece = [];
	flipPiece[0] = new Array ("", "", "");
	flipPiece[1] = new Array ("", "", "");
	flipPiece[2] = new Array ("", "", "");

	for (var i = 0; i < 3; i ++) {
		flipPiece[i][2] = window[activePiece][i][0];
		flipPiece[i][0] = window[activePiece][i][2];

		window[activePiece][i][2] = flipPiece[i][2];
		window[activePiece][i][0] = flipPiece[i][0];
	}

	document.getElementById("namedPiece").innerHTML = (drawPiece(window[activePiece]));
}

function validatePlacement(x, y) {
	var isValid = true;
	var connections = 0;
	var tileUp = inkedGrid[x-1][y][2][1];
	var tileDown = inkedGrid[x+1][y][0][1];
	var tileLeft = inkedGrid[x][y-1][1][2];
	var tileRight = inkedGrid[x][y+1][1][0];

	var top = inkedGrid[x][y][0][1];
	var bottom = inkedGrid[x][y][2][1];
	var left = inkedGrid[x][y][1][0];
	var right = inkedGrid[x][y][1][2];

	//check top, bottom, right, left for whether they match up with a correct tile type & orientation
	if ((top.type === "road" || top.type === "rail") && tileUp.type === top.type) { connections++; }
	if ((bottom.type === "road" || bottom.type === "rail") && tileDown.type === bottom.type) { connections++; }
	if ((left.type === "road" || left.type === "rail") && tileLeft.type === left.type) { connections++; }
	if ((right.type === "road" || right.type === "rail") && tileRight.type === right.type) { connections++; }

	if (connections === 0) { isValid = false; }

	//check top, bottom, right, left for whether they misalign with a different tile type
	if ((top.type === "road" || top.type === "rail") && (tileUp.type === "road" || tileUp.type === "rail") && (tileUp.type !== top.type)) { isValid = false; }
	if ((bottom.type === "road" || bottom.type === "rail") && (tileDown.type === "road" || tileDown.type === "rail") && (tileDown.type !== bottom.type)) { isValid = false; }
	if ((left.type === "road" || left.type === "rail") && (tileLeft.type === "road" || tileLeft.type === "rail") && (tileLeft.type !== left.type)) { isValid = false; }
	if ((right.type === "road" || right.type === "rail") && (tileRight.type === "road" || tileRight.type === "rail") && (tileRight.type !== right.type)) { isValid = false; }

	for (var i = 0; i < 3; i++) {
		for (var k = 0; k < 3; k ++) {
			if (isValid === false) { inkedGrid[x][y][i][k].inked = "pending invalid"; }
			else  { inkedGrid[x][y][i][k].inked = "pending valid"; }
		}
	}

	return isValid;
}

function resetRound() {
	if (tilesPlayedThisRound > 0) {
		document.getElementById("messages").innerHTML = "";
		for (var i = 0; i < tilesPlayedThisRound; i++) {
			if (window["tile" + (i + 1)] !== "") {
				erasePiece(window["tile" + (i + 1)][0], window["tile" + (i + 1)][1]);
			}
		}

		for (var i = 0; i < 9; i++) {
			for (var k = 0; k < 9; k++) {
				for (var j = 0; j < 3; j++) {
					for (var l = 0; l < 3; l++) {
						inkedGrid[i][k][j][l].inked = " ";
					}
				}
			}
		}

		tilesPlayedThisRound = 0;
		if (specialPlayedThisRound) { specialsPlayed.pop(); specialPlayedThisRound = false; }
		tile1 = "";
		tile2 = "";
		tile3 = "";
		tile4 = "";
		tile5 = "";

		if ( originalDiceResults.length > 0 ) { 
			diceResults.length = 0;
			for (var i = 0; i < originalDiceResults.length; i ++ ) {
				diceResults.push(originalDiceResults[i]);
			}
		}

		drawFromArray(originalDiceResults);
		inkGrid();
		drawGrid(inkedGrid);
	} else {document.getElementById("messages").innerHTML = '<span>You have not placed any tiles this round.</span>'; }
}

function endRound() {
	if ((tilesPlayedThisRound < 4) || (specialPlayedThisRound && tilesPlayedThisRound < 5)) {
		document.getElementById("messages").innerHTML = '<span>You must place all your tiles for this round.</span>';
	} else {
		for (var i = 0; i < tilesPlayedThisRound; i++) {
			if(document.getElementById(window["tile" + (i + 1)] + "00").classList.contains("invalid")) {
				document.getElementById("messages").innerHTML = '<span>Invalid tile placement.</span>';
				return;
			}
		}

		if (!document.getElementById("resetManual").classList.contains("hidden")) {
			document.getElementById("resetManual").classList.add("hidden");
		}

		if (round < 7) {
			resetTurn();
			round++;
		}
		else if (round === 7) {	inkGrid(); drawGrid(inkedGrid); endGame(); }
	}
}

function resetTurn() {
		document.getElementById("messages").innerHTML = "";
		tilesPlayedThisRound = 0;
		if (specialPlayedThisRound) { specialsPlayedThisGame++; specialPlayedThisRound = false; }
		activePiece = "";
		tile1 = "";
		tile2 = "";
		tile3 = "";
		tile4 = "";
		tile5 = "";

		diceResults.length = 0;
		originalDiceResults.length = 0;

		inkGrid();
		document.getElementById("pickYourPieces").classList.toggle("hidden");
		document.getElementById("specials").innerHTML = "";
		document.getElementById("pieceSelector").innerHTML = "";
		document.getElementById("manualSelectList").innerHTML = "";
		document.getElementById("roundCount").innerHTML = "<h1>Round " + (round + 1) + " of 7</h1>";
}

function endGame() {
	var finalScore = countExits() + countLongest("rail") + countLongest("road") + countCenter(inkedGrid) - countErrors(inkedGrid);

	document.getElementById("header").classList.add("hidden");
	document.getElementById("bottom").classList.add("hidden");
	document.getElementById("pieceDisplay").classList.add("hidden");
	document.getElementById("results").classList.remove("hidden");

	document.getElementById("finalScore").innerHTML = finalScore;
	document.getElementById("errors").innerHTML = countErrors(inkedGrid);
	document.getElementById("centerTiles").innerHTML = countCenter(inkedGrid);
	document.getElementById("longestRail").innerHTML = countLongest("rail");
	document.getElementById("longestRoad").innerHTML = countLongest("road");
	document.getElementById("exitsScore").innerHTML = countExits();

}

function inkGrid() {
	for (var i = 0; i < 9; i++) {
		for (var k = 0; k < 9; k++) {
			for (var j = 0; j < 3; j++) {
				for (var l = 0; l < 3; l++) {
					if ( inkedGrid[i][k][j][l].inked === "pending valid" ) {
						addToNetwork(i, k, j, l);
						inkedGrid[i][k][j][l].inked = "placed";
						inkedGrid[i][k][j][l].round = round;
					}
				}
			}
		}
	}
}

function addToNetwork (i, k, j, l) {
	var newCoord = arrToGridID(i, k, j, l);

	// checks for invalid tiles, first tile, or existing tile
	if ( inkedGrid[i][k][j][l].type === "blank" || inkedGrid[i][k][j][l].type === "boundary" ) { return; }
	if (networks.length === 0) { networks.push( [newCoord] ); return; }
	// else { for (var i = 0; i < networks.length; i++) { if (networks[i].includes(newCoord)) { return; } } }

	// check neighbors; if connected, find out what network it's in and add that to the array
	var allNeighbors = [
		myNeighbor(newCoord, "north"),
		myNeighbor(newCoord, "south"),
		myNeighbor(newCoord, "west"),
		myNeighbor(newCoord, "east")
	];

	if (isOverpass(newCoord)) {
		networks.push([myNeighbor(newCoord, "west"), newCoord, myNeighbor(newCoord, "east")]);
		networks.push([myNeighbor(newCoord, "north"), newCoord, myNeighbor(newCoord, "south")]);

	}

	else {
		var pushedToNeighbors = 0;
		allNeighbors.forEach(n => {
			for (var i = 0; i < networks.length; i++) {
				if (networks[i].includes(n) && !isOverpass(n)) {
					networks[i].push(newCoord);
					pushedToNeighbors++;
				}
			}
		});

		if (pushedToNeighbors === 0) { networks.push( [newCoord] ); }
	}

	networks = consolidateNetworks(networks);
}

function consolidateNetworks(networkArr) {
	var results = [];
	var uniqueResults = [];
	var concat = false;

	networkArr.forEach(network => {
		if (!results.length) { results.push(network); }
		else {
			concat = false;
			network.forEach(node => {
				for (var i = 0; i < results.length; i++) {
					if (results[i].includes(node) && !concat) {
						if (isOverpass(node)) {
							if (( results[i].includes(myNeighbor(node), "north") || results[i].includes(myNeighbor(node), "south") )
								&& (  network.includes(myNeighbor(node), "north") || network.includes(myNeighbor(node), "south") ) ) {
									concat = true;
									results[i].push(...network);
							}

							if (( results[i].includes(myNeighbor(node), "east") || results[i].includes(myNeighbor(node), "west") )
								&& (  network.includes(myNeighbor(node), "east") || network.includes(myNeighbor(node), "west") ) ) {
									concat = true;
									results[i].push(...network);
							}
						}
						else {
							concat = true;
							results[i].push(...network);
						}
					}
				}

			});

			if (!concat) { results.push(network); }
		}
	});

	results.forEach(result => {
		uniqueResults.push([...new Set(result)]);
	});

	return uniqueResults;
}

function removeSubsets (arr) {
	var output = [];
	for (var k = 0; k < arr.length; k++) {
		var test = false;
		for (var i = 0; i < arr.length; i++) {
			if (k !== i && arr[k].every(j => arr[i].includes(j))) {
				test = true;
			}
		}
		if (!test) { output.push(arr[k]); }
	}

	return output;
}

function arrToGridID (i, k, j, l) { return i.toString() + k.toString() + j.toString() + l.toString(); }
function idToGridTile (id) { return inkedGrid[id[0]][id[1]][id[2]][id[3]]; }

function isOverpass(coord) {
	if (coord[2] == 1 && coord[3] == 1) {
		if (idToGridTile(coord).type === "road") {
			if (inkedGrid[coord[0]][coord[1]][0][1].type === "rail") { return true; }
			if (inkedGrid[coord[0]][coord[1]][1][0].type === "rail") { return true; }
		}
	}
	return false;
}

function myNeighbor(id, direction) {
	switch (direction) {
		case "north":
			if (id[2] == 0) { return (parseInt(id[0]) - 1).toString() + id[1] + "2" + id[3]; }
			else { return id[0] + id[1] + (parseInt(id[2]) - 1).toString() + id[3]; }
		break;

		case "south":
			if (id[2] == 2) { return (parseInt(id[0]) + 1).toString() + id[1] + "0" + id[3]; }
			else { return id[0] + id[1] + (parseInt(id[2]) + 1).toString() + id[3]; }
		break;

		case "west":
			if (id[3] == 0) { return id[0] + (parseInt(id[1]) - 1).toString() + id[2] + "2"; }
			else { return id[0] + id[1] + id[2] + (parseInt(id[3]) - 1).toString(); }
		break;

		case "east":
			if (id[3] == 2) { return id[0] + (parseInt(id[1]) + 1).toString() + id[2] + "0"; }
			else { return id[0] + id[1] + id[2] + (parseInt(id[3]) + 1).toString(); }
		break;
		default: return false;
	}
}

// INITIALIZE PRESET TILES

function initTiles() {
	roadI = [
		[{type: "blank"}, {type: "road", orientation: "ns"}, {type: "blank"}],
		[{type: "blank"}, {type: "road", orientation: "ns"}, {type: "blank"}],
		[{type: "blank"}, {type: "road", orientation: "ns"}, {type: "blank"}]
	];

	railI = [
		[{type: "blank"}, {type: "rail", orientation: "ns"}, {type: "blank"}],
		[{type: "blank"}, {type: "rail", orientation: "ns"}, {type: "blank"}],
		[{type: "blank"}, {type: "rail", orientation: "ns"}, {type: "blank"}]
	];

	roadL = [
		[{type: "blank"}, {type: "road", orientation: "ns"}, {type: "blank"},],
		[{type: "road", orientation: "ew"}, {type: "road", orientation: "int"}, {type: "blank"},],
		[{type: "blank"}, {type: "blank"}, {type: "blank"},]
	];

	railL = [
		[{type: "blank"}, {type: "rail", orientation: "ns"}, {type: "blank"},],
		[{type: "rail", orientation: "ew"}, {type: "rail", orientation: "int"}, {type: "blank"},],
		[{type: "blank"}, {type: "blank"}, {type: "blank"},]
	];

	roadT = [
		[{type: "blank"}, {type: "road", orientation: "ns"}, {type: "blank"},],
		[{type: "road", orientation: "ew"}, {type: "road", orientation: "int"}, {type: "road", orientation: "ew"},],
		[{type: "blank"}, {type: "blank"}, {type: "blank"},]
	];

	railT = [
		[{type: "blank"}, {type: "rail", orientation: "ns"}, {type: "blank"},],
		[{type: "rail", orientation: "ew"}, {type: "rail", orientation: "int"}, {type: "rail", orientation: "ew"},],
		[{type: "blank"}, {type: "blank"}, {type: "blank"},]
	];

	stationI = [
		[{type: "blank"}, {type: "rail", orientation: "ns"}, {type: "blank"}],
		[{type: "blank"}, {type: "station"}, {type: "blank"}],
		[{type: "blank"}, {type: "road", orientation: "ns"}, {type: "blank"}]
	];

	stationL = [
		[{type: "blank"}, {type: "rail", orientation: "ns"}, {type: "blank"},],
		[{type: "road", orientation: "ew"}, {type: "station"}, {type: "blank"},],
		[{type: "blank"}, {type: "blank"}, {type: "blank"},]
	];

	overpass = [
		[{type: "blank"}, {type: "road", orientation: "ns"}, {type: "blank"}],
		[{type: "rail", orientation: "ew"}, {type: "road", orientation: "ns"}, {type: "rail", orientation: "ew"}],
		[{type: "blank"}, {type: "road", orientation: "ns"}, {type: "blank"}]
	];

	blank = [
		[{type: "blank", inked: " "}, {type: "blank", inked: " "}, {type: "blank", inked: " "}],
		[{type: "blank", inked: " "}, {type: "blank", inked: " "}, {type: "blank", inked: " "}],
		[{type: "blank", inked: " "}, {type: "blank", inked: " "}, {type: "blank", inked: " "}]
	];

	specialA = [
		[{type: "blank"}, {type: "road", orientation: "ns"}, {type: "blank"}],
		[{type: "road", orientation: "ew"}, {type: "station"}, {type: "road", orientation: "ew"}],
		[{type: "blank"}, {type: "rail", orientation: "ns"}, {type: "blank"}]
	];

	specialB = [
		[{type: "blank"}, {type: "road", orientation: "ns"}, {type: "blank"}],
		[{type: "rail", orientation: "ew"}, {type: "station"}, {type: "rail", orientation: "ew"}],
		[{type: "blank"}, {type: "rail", orientation: "ns"}, {type: "blank"}]
	];

	specialC = [
		[{type: "blank"}, {type: "road", orientation: "ns"}, {type: "blank"}],
		[{type: "road", orientation: "ew"}, {type: "road", orientation: "int"}, {type: "road", orientation: "ew"}],
		[{type: "blank"}, {type: "road", orientation: "ns"}, {type: "blank"}]
	];

	specialD = [
		[{type: "blank"}, {type: "rail", orientation: "ns"}, {type: "blank"}],
		[{type: "rail", orientation: "ew"}, {type: "rail", orientation: "int"}, {type: "rail", orientation: "ew"}],
		[{type: "blank"}, {type: "rail", orientation: "ns"}, {type: "blank"}]
	];

	specialE = [
		[{type: "blank"}, {type: "road", orientation: "ns"}, {type: "blank"}],
		[{type: "road", orientation: "ew"}, {type: "station"}, {type: "rail", orientation: "ew"}],
		[{type: "blank"}, {type: "rail", orientation: "ns"}, {type: "blank"}]
	];

	specialF = [
		[{type: "blank"}, {type: "road", orientation: "ns"}, {type: "blank"}],
		[{type: "rail", orientation: "ew"}, {type: "station"}, {type: "rail", orientation: "ew"}],
		[{type: "blank"}, {type: "road", orientation: "ns"}, {type: "blank"}]
	];
}

// CLICK EVENTS
document.addEventListener('click', function(e) {

	if (e.target.parentNode.parentNode && e.target.parentNode.parentNode.className == "selectPiece") {
		if (tilesPlayedThisRound < 4 || (specialPlayedThisRound && tilesPlayedThisRound < 5)) {
			specialIsActive = false;
			document.getElementById("messages").innerHTML = "";
			document.getElementById("namedPiece").innerHTML = (drawPiece(window[e.target.parentNode.parentNode.id]));
			activePiece = e.target.parentNode.parentNode.id;
			if ( originalDiceResults.length > 0) {
				if (!diceResults.includes(activePiece)) {
					document.getElementById("messages").innerHTML = '<span>You already placed this piece.</span>';
					activePiece = "";
					document.getElementById("namedPiece").innerHTML = "";
				}
			}
			if (activePiece === "stationL") { document.getElementById("reversePiece").innerHTML = '<button class="ink" id="reverseBtn"></button>'; }
			else { document.getElementById("reversePiece").innerHTML = ''; }
		} else {
			document.getElementById("messages").innerHTML = '<span>You have placed all your tiles for this round.</span>';
		}
	}

	if (e.target.parentNode.parentNode && e.target.parentNode.parentNode.className == "manualSelect") {
		if (diceResults.length < 4) {
			diceResults.push(e.target.parentNode.parentNode.id); originalDiceResults.push(e.target.parentNode.parentNode.id);
			drawFromArray(originalDiceResults);
		}
		if (diceResults.length) {
			if (document.getElementById("resetManual").classList.contains("hidden")) {
				document.getElementById("resetManual").classList.remove("hidden");
			}
		}
	}

	if (e.target.parentNode.parentNode && e.target.parentNode.parentNode.className == "selectSpecial") {
		activePiece = e.target.parentNode.parentNode.id;
		if (specialPlayedThisRound) { 
			document.getElementById("messages").innerHTML = '<span>You have already placed a special this round.</span>';
			document.getElementById("namedPiece").innerHTML = '';
			activePiece = "";
		} else if (specialsPlayedThisGame === 3) {
			document.getElementById("messages").innerHTML = '<span>You have played all your specials for the game.</span>';
			activePiece = "";
		} else if (specialsPlayed.includes(activePiece)) {
			document.getElementById("messages").innerHTML = '<span>You have already used this special.</span>';
			activePiece = "";
		} else {
			specialIsActive = true;
			document.getElementById("messages").innerHTML = "";
			document.getElementById("reversePiece").innerHTML = '';
			document.getElementById("namedPiece").innerHTML = (drawPiece(window[e.target.parentNode.parentNode.id]));
		}
	}

	if (e.target.parentNode.parentNode && e.target.parentNode.parentNode.className == "undoPlace") {
		var cleanBoard = e.target.parentNode.parentNode.id;
		diceResults.push(cleanBoard);

		for (var i = 0; i < 5; i++) {
			if (window["tileName" + (i + 1)] === cleanBoard) {
				placeX = window["tile" + (i + 1)][0];
				placeY = window["tile" + (i + 1)][1];
				erasePiece(parseInt(placeX), parseInt(placeY));

				window["tile" + (i + 1)] = "";
				window["tileName" + (i + 1)] = "";

				cleanUpTiles();
				tilesPlayedThisRound--;
				break;
			}
		}

		for (i = 0; i < 5; i++) {
			if (window["tile" + (i + 1)] !== "") {
				var validateX = parseInt(window["tile" + (i + 1)][0]);
				var validateY = parseInt(window["tile" + (i + 1)][1]);
				validatePlacement(validateX, validateY);
			}
		}

		drawFromArray(originalDiceResults);
		drawGrid(inkedGrid);
	}

	if (e.target.parentNode.parentNode && e.target.parentNode.parentNode.className == "usedSpecial") {
		var specialClicked = e.target.parentNode.parentNode.id;
		var thisTurnSpecial = "";

		for (i = 0; i < 5; i++) {
			if (window["tileName" + (i + 1)].includes("special")) {
				thisTurnSpecial = window["tileName" + (i + 1)];

				if (thisTurnSpecial === specialClicked) { 
					specialPlayedThisRound = false;
					specialIsActive = false;
					activePiece = "";
					document.getElementById("namedPiece").innerHTML = ("");
					var whereIsThisSpecial = specialsPlayed.indexOf(specialClicked);

					placeX = window["tile" + (i + 1)][0];
					placeY = window["tile" + (i + 1)][1];
					erasePiece(parseInt(placeX), parseInt(placeY));

					window["tile" + (i + 1)] = "";
					window["tileName" + (i + 1)] = "";

					cleanUpTiles();
					specialsPlayed.splice(whereIsThisSpecial, 1);
					tilesPlayedThisRound--;
					drawGrid(inkedGrid);
					drawSpecials();
				} else {
					document.getElementById("messages").innerHTML = '<span>You used this special in a previous round.</span>';
				}

				break;
			}
		}
		for (i = 0; i < 5; i++) {
			if (window["tile" + (i + 1)] !== "") {
				var validateX = parseInt(window["tile" + (i + 1)][0]);
				var validateY = parseInt(window["tile" + (i + 1)][1]);
				validatePlacement(validateX, validateY);
			}
		}
	}

	if (e.target.parentNode.parentNode
		&& e.target.parentNode.parentNode.parentNode && e.target.parentNode.parentNode.parentNode.id === "grid") {
		if (activePiece != ""
				&& e.target.classList.contains("blank")
				&& !e.target.classList.contains("boundary")
				&& !e.target.classList.contains("placed")
				&& ((tilesPlayedThisRound < 4)
					|| (specialPlayedThisRound && tilesPlayedThisRound < 5)
					|| (tilesPlayedThisRound === 4 && !specialPlayedThisRound))
			){
			if (specialIsActive) {
				specialsPlayed.push(activePiece);
				specialPlayedThisRound = true;
				specialIsActive = false;
			}

			var validRound = true;

			for (i = 0; i < 5; i++) {
				if (window["tile" + (i + 1)] !== "") {
					var validateX = parseInt(window["tile" + (i + 1)][0]);
					var validateY = parseInt(window["tile" + (i + 1)][1]);
					if(!validatePlacement(validateX, validateY)) { validRound = false; }
				}
			}

			if (!validRound) { document.getElementById("messages").innerHTML = '<span>Correct invalid placement first.</span>'; }
			else {
				placeX = e.target.id[0];
				placeY = e.target.id[1];
				window["tileName" + parseInt(tilesPlayedThisRound + 1)] = activePiece;
				window["tile" + parseInt(tilesPlayedThisRound + 1)] = placeX + placeY;

				if( originalDiceResults.length > 0 ) {
					for (var i = 0; i < diceResults.length; i++) {
						if (diceResults[i] === activePiece) {
							diceResults.splice(i, 1);
							break;
						}
					}
				}

				drawFromArray(originalDiceResults);
				placePiece(parseInt(placeX), parseInt(placeY));
				for (i = 0; i < 5; i++) {
					if (window["tile" + (i + 1)] !== "") {
						var validateX = parseInt(window["tile" + (i + 1)][0]);
						var validateY = parseInt(window["tile" + (i + 1)][1]);
						validatePlacement(validateX, validateY);
					}
				}
				drawGrid(inkedGrid);
				drawSpecials();
				placeX = 0; placeY = 0;
				tilesPlayedThisRound++;	
			}
		}
		if (e.target.classList.contains("pending")) {
			placeX = e.target.id[0];
			placeY = e.target.id[1];
			rotateActivePiece(parseInt(placeX), parseInt(placeY));
			for (i = 0; i < 5; i++) {
				if (window["tile" + (i + 1)] !== "") {
					var validateX = parseInt(window["tile" + (i + 1)][0]);
					var validateY = parseInt(window["tile" + (i + 1)][1]);
					validatePlacement(validateX, validateY);
				}
			}
			drawGrid(inkedGrid);
			placeX = 0; placeY = 0;
		}

	}

	if (e.target.id === "resetManual") {
		diceResults.length = 0;
		originalDiceResults.length = 0;
		resetRound(); drawGrid(inkedGrid); drawFromArray(originalDiceResults);
		document.getElementById("resetManual").classList.add("hidden");
		document.getElementById("messages").innerHTML = '';
	}

	if (e.target.id === "startBtn") { startGame(); drawGrid(inkedGrid); }
	if (e.target.id === "endRoundBtn") { endRound(); drawGrid(inkedGrid); }
	if (e.target.id === "reverseBtn") { reverseActivePiece(); }
	if (e.target.id === "manualSelection") { drawAllPieces(); drawSpecials(); }
	if (e.target.id === "randomRoll") { rollDice(); drawSpecials(); }

	if (e.target.id === "highlightLongestRoad") { highlightLongest("road"); }
	if (e.target.id === "highlightLongestRail") { highlightLongest("rail"); }
	if (e.target.id === "highlightErrors") { highlightErrors(inkedGrid); }
});

function cleanUpTiles() {
	var cleanTiles = [];
	var cleanTileNames = [];

	for (var i = 1; i < 6; i++) {
		if (window["tile" + i] !== "") {
			cleanTiles.push(window["tile" + i]);
			cleanTileNames.push(window["tileName" + i]);

			window["tile" + i] = "";
			window["tileName" + i] = "";
		}
	}

	for (var i = 0; i < cleanTiles.length; i++) {
		window["tile" + (i + 1)] = cleanTiles[i];
		window["tileName" + (i + 1)] = cleanTileNames[i];
	}
}

// INITIALIZE BLANK GRID

function initGrid () {
	for (var i = 0; i < 9; i++) {
		inkedGrid[i] = [];
		for (var k = 0; k < 9; k++) {
			inkedGrid[i][k] = [];
			for (var j = 0; j < 3; j++) {
				inkedGrid[i][k][j] = [];
				for (var l = 0; l < 3; l++) {
					inkedGrid[i][k][j][l] = {
						type: "blank",
						orientation: " ",
						border: " ",
						inked: " ",
						round: 0,
					};
				}
			}
		}
	}

	// define boundaries
	for (var i = 0; i < 3; i++) {
		for (var j = 0; j < 3; j++) {
			for (var k = 0; k < 9; k++) {
				inkedGrid[k][0][i][j].type = "boundary";
				inkedGrid[k][8][i][j].type = "boundary";
				inkedGrid[0][k][i][j].type = "boundary";
				inkedGrid[8][k][i][j].type = "boundary";
			}
		}
	}

	// define center
	for (var i = 0; i < 3; i++) {
		for (var j = 0; j < 3; j++) {
			for (var k = 3; k < 6; k++) {
				inkedGrid[k][3][i][j].background = "center";
				inkedGrid[k][4][i][j].background = "center";
				inkedGrid[k][5][i][j].background = "center";
				inkedGrid[3][k][i][j].background = "center";
				inkedGrid[4][k][i][j].background = "center";
				inkedGrid[5][k][i][j].background = "center";
			}
		}
	}

	// define starting exits
	inkedGrid[0][2][2][1] = { type: "road", orientation: "ns"};
	inkedGrid[0][4][2][1] = { type: "rail", orientation: "ns"};
	inkedGrid[0][6][2][1] = { type: "road", orientation: "ns"};
	inkedGrid[8][2][0][1] = { type: "road", orientation: "ns"};
	inkedGrid[8][4][0][1] = { type: "rail", orientation: "ns"};
	inkedGrid[8][6][0][1] = { type: "road", orientation: "ns"};
	inkedGrid[2][0][1][2] = { type: "rail", orientation: "ew"};
	inkedGrid[4][0][1][2] = { type: "road", orientation: "ew"};
	inkedGrid[6][0][1][2] = { type: "rail", orientation: "ew"};
	inkedGrid[2][8][1][0] = { type: "rail", orientation: "ew"};
	inkedGrid[4][8][1][0] = { type: "road", orientation: "ew"};
	inkedGrid[6][8][1][0] = { type: "rail", orientation: "ew"};

}

// DRAW FUNCTIONS

function drawGrid (gridArray) {
	var output = "";
	for (var k = 0; k < 9; k++) {
		for (var j = 0; j < 3; j++) {
			output += '<div class ="row"> ';
			for (var i = 0; i < 9; i ++) {
				if (j === 0) { output += '<span class="bigSquareTop">'; }
				if (j === 1) { output += '<span class="bigSquareMid">'; }
				if (j === 2) { output += '<span class="bigSquareBot">'; }
				output += drawTile(gridArray[k][i][j][0], String(k) + String(i) + String(j) + "0");
				output += drawTile(gridArray[k][i][j][1], String(k) + String(i) + String(j) + "1");
				output += drawTile(gridArray[k][i][j][2], String(k) + String(i) + String(j) + "2");	
				output += '</span>';
			}
			output += "</div>";
		}
	}

	// redefine center
	for (var i = 0; i < 3; i++) {
		for (var j = 0; j < 3; j++) {
			for (var k = 3; k < 6; k++) {
				inkedGrid[k][3][i][j].background = "center";
				inkedGrid[k][4][i][j].background = "center";
				inkedGrid[k][5][i][j].background = "center";
				inkedGrid[3][k][i][j].background = "center";
				inkedGrid[4][k][i][j].background = "center";
				inkedGrid[5][k][i][j].background = "center";
			}
		}
	}
	document.getElementById("grid").innerHTML = output;
}

function rollDice() {
	var output = '<div class="row"> '; 
	var dice = 0;
	for (var i = 0; i < 3; i++) {
		dice = 1 + Math.floor(Math.random()*6);
		if (dice === 1) { diceResults.push("roadL"); originalDiceResults.push("roadL"); }
		if (dice === 2) { diceResults.push("railL"); originalDiceResults.push("railL"); }
		if (dice === 3) { diceResults.push("roadI"); originalDiceResults.push("roadI"); }
		if (dice === 4) { diceResults.push("railI"); originalDiceResults.push("railI"); }
		if (dice === 5) { diceResults.push("roadT"); originalDiceResults.push("roadT"); }
		if (dice === 6) { diceResults.push("railT"); originalDiceResults.push("railT"); }
	}
	dice = 1 + Math.floor(Math.random()*3);
		if (dice === 1) { diceResults.push("overpass"); originalDiceResults.push("overpass"); }
		if (dice === 2) { diceResults.push("stationL"); originalDiceResults.push("stationL"); }
		if (dice === 3) { diceResults.push("stationI"); originalDiceResults.push("stationI"); }

	drawFromArray(originalDiceResults);
	document.getElementById("pickYourPieces").classList.toggle("hidden");
}

function drawAllPieces() {
	var output = '<div class="row"> ';
	output += '<div id="roadL" class="manualSelect">' + drawPiece(roadL) + '</div>';
	output += '<div id="roadT" class="manualSelect">' + drawPiece(roadT) + '</div>';
	output += '<div id="roadI" class="manualSelect">' + drawPiece(roadI) + '</div>';
	output += '<div id="railL" class="manualSelect">' + drawPiece(railL) + '</div>';
	output += '<div id="railT" class="manualSelect">' + drawPiece(railT) + '</div>';
	output += '<div id="railI" class="manualSelect">' + drawPiece(railI) + '</div>';
	output += '<div id="overpass" class="manualSelect">' + drawPiece(overpass) + '</div>';
	output += '<div id="stationI" class="manualSelect">' + drawPiece(stationI) + '</div>';
	output += '<div id="stationL" class="manualSelect">' + drawPiece(stationL) + '</div>';	
	output += "</div>";
	document.getElementById("pickYourPieces").classList.toggle("hidden");
	document.getElementById("manualSelectList").innerHTML = output;
}

function drawFromArray(arr) {
	var output = '<div class="row"> ';
	var masterArr = [];

	diceResults.forEach(orig => {
		masterArr.push(orig);
	});

	arr.forEach(item => {
		if (masterArr.includes(item)) { 
			output += '<div id="' + item + '" class="selectPiece">' + drawPiece(window[item]) + '</div>';
			var remove = masterArr.indexOf(item);
			masterArr.splice(remove, 1);
		}
		else { output += '<div id="' + item + '" class="undoPlace">' + drawPiece(window[item]) + '</div>'; }
		
	});
	output += "</div>";
	document.getElementById("pieceSelector").innerHTML = output;
}

function drawSpecials() {
	var output = '<div class="row"> ';

	if (specialsPlayed.includes("specialA")) { output += '<div id="specialA" class="usedSpecial">' + drawPiece(specialA) + '</div>'; }
	else { output += '<div id="specialA" class="selectSpecial">' + drawPiece(specialA) + '</div>'; }

	if (specialsPlayed.includes("specialB")) { output += '<div id="specialB" class="usedSpecial">' + drawPiece(specialB) + '</div>'; }
	else { output += '<div id="specialB" class="selectSpecial">' + drawPiece(specialB) + '</div>'; }

	if (specialsPlayed.includes("specialC")) { output += '<div id="specialC" class="usedSpecial">' + drawPiece(specialC) + '</div>'; }
	else { output += '<div id="specialC" class="selectSpecial">' + drawPiece(specialC) + '</div>'; }

	if (specialsPlayed.includes("specialD")) { output += '<div id="specialD" class="usedSpecial">' + drawPiece(specialD) + '</div>'; }
	else { output += '<div id="specialD" class="selectSpecial">' + drawPiece(specialD) + '</div>'; }

	if (specialsPlayed.includes("specialE")) { output += '<div id="specialE" class="usedSpecial">' + drawPiece(specialE) + '</div>'; }
	else { output += '<div id="specialE" class="selectSpecial">' + drawPiece(specialE) + '</div>'; }

	if (specialsPlayed.includes("specialF")) { output += '<div id="specialF" class="usedSpecial">' + drawPiece(specialF) + '</div>'; }
	else { output += '<div id="specialF" class="selectSpecial">' + drawPiece(specialF) + '</div>'; }

	output += "</div>";
	document.getElementById("specials").innerHTML = output;
}

function drawPiece (pieceArray) {
	var output = "";
	for (var i = 0; i < 3; i++) {
		if (i === 0) { output += '<div class="row bigSquareTop">'; }
		if (i === 1) { output += '<div class="row bigSquareMid">'; }
		if (i === 2) { output += '<div class="row bigSquareBot">'; }
		output += drawTile(pieceArray[i][0]);
		output += drawTile(pieceArray[i][1]);
		output += drawTile(pieceArray[i][2]);
		output += "</div>";
	}

	return output;
}

function drawTile (tile, id) {
	var output = '<span ';
	if (id) { output += 'id="' + id + '" '; }
	output += 'class= "tile ' + tile.type;
	if (tile.border) { output += " " + tile.border; }
	if (tile.orientation) { output += " " + tile.orientation; }
	if (tile.inked) { output += " " + tile.inked; }
	if (tile.background) { output += " " + tile.background; }
	if (tile.highlight) { output += " " + tile.highlight; }
	if (tile.round > 0 && id.includes("02")) { output += ' rdTxt">' + tile.round + '</span>'; }
	else { output += '"></span>'; }
	
	return output;
}

// END DRAW FUNCTIONS

// SCORE FUNCTIONS
function countErrors(grid) {
	var e = 0;
	var errorList = [];

	for (var i = 1; i < 8; i++) {
		for (var j = 1; j < 8; j++) {
			if (grid[i][j][0][1].type !== "blank") {
				if (grid[i-1][j][2][1].type !== grid[i][j][0][1].type && grid[i-1][j][2][1].type !== "boundary") { e++; }
			}
			if (grid[i][j][2][1].type !== "blank") {
				if (grid[i+1][j][0][1].type !== grid[i][j][2][1].type && grid[i+1][j][0][1].type !== "boundary") { e++; }
			}
			if (grid[i][j][1][0].type !== "blank") {
				if (grid[i][j-1][1][2].type !== grid[i][j][1][0].type && grid[i][j-1][1][2].type !== "boundary") { e++; }
			}
			if (grid[i][j][1][2].type !== "blank") {
				if (grid[i][j+1][1][0].type !== grid[i][j][1][2].type && grid[i][j+1][1][0].type !== "boundary") { e++; }
			}	
		}
	}
	return e;
}

function highlightErrors(grid) {
	var errorList = [];

	for (var i = 1; i < 8; i++) {
		for (var j = 1; j < 8; j++) {
			if (grid[i][j][0][1].type !== "blank") {
				if (grid[i-1][j][2][1].type !== grid[i][j][0][1].type && grid[i-1][j][2][1].type !== "boundary") { errorList.push(arrToGridID(i, j, 0, 1)); }
			}
			if (grid[i][j][2][1].type !== "blank") {
				if (grid[i+1][j][0][1].type !== grid[i][j][2][1].type && grid[i+1][j][0][1].type !== "boundary") { errorList.push(arrToGridID(i, j, 2, 1)); }
			}
			if (grid[i][j][1][0].type !== "blank") {
				if (grid[i][j-1][1][2].type !== grid[i][j][1][0].type && grid[i][j-1][1][2].type !== "boundary") { errorList.push(arrToGridID(i, j, 1, 0)); }
			}
			if (grid[i][j][1][2].type !== "blank") {
				if (grid[i][j+1][1][0].type !== grid[i][j][1][2].type && grid[i][j+1][1][0].type !== "boundary") { errorList.push(arrToGridID(i, j, 1, 2)); }
			}	
		}
	}

	errorList.forEach(err => {
		var n1 = err.toString()[0];
		var n2 = err.toString()[1];
		var n3 = err.toString()[2];
		var n4 = err.toString()[3];
		if (inkedGrid[n1][n2][n3][n4].highlight === "highlightError") { inkedGrid[n1][n2][n3][n4].highlight = ""; }
		else { inkedGrid[n1][n2][n3][n4].highlight = "highlightError"; }
	})

	drawGrid(inkedGrid);

}

function countCenter(grid) {
	var c = 0;
	for (var i = 3; i < 6; i++) {
		for (var j = 3; j < 6; j++) {
			if (grid[i][j][1][1].type !== "blank") { c++; }
		}
	}
	return c;
}

function countExits() {
	var s = 0;
	var output = "Exits Per Network";
	var outputArr = [];

	var exits = [ "1201", "1401", "1601",
				  "2110", "4110", "6110",
				  "2712", "4712", "6712",
				  "7221", "7421", "7621" ];

	networks.forEach(network => {
		var exitsInThisNetwork = 0;
		exits.forEach(exit => {
			if ( network.includes(exit) ) {
				exitsInThisNetwork++;
			}
		});

		if (exitsInThisNetwork > 1) {
			outputArr.push(exitsInThisNetwork);
			if (exitsInThisNetwork === 2) { s += 4; }
			else if (exitsInThisNetwork < 12 ) { s += (4 * (exitsInThisNetwork - 1)); }
			else if (exitsInThisNetwork === 12) { s = 45; }
		}
	});

	outputArr.sort().reverse();

	outputArr.forEach(x => {
		if (output === "Exits Per Network") { output += ": " + x; }
		else { output += ", " + x; }
	});

	if (output === "Exits Per Network") { output = ""; }

	document.getElementById("exitsDescription").innerHTML = output;

	return s;
}

function highlightLongest(t) {
	var result = [];
	networks.forEach(network => {
		if (longestPathInNetwork(network, t).length > result.length) {
			result = longestPathInNetwork(network, t);
		}
	});

	result.forEach(node => {
		var n1 = node.toString()[0];
		var n2 = node.toString()[1];
		var n3 = node.toString()[2];
		var n4 = node.toString()[3];

		if (inkedGrid[n1][n2][n3][n4].highlight === "highlightTile") { inkedGrid[n1][n2][n3][n4].highlight = ""; }
		else { inkedGrid[n1][n2][n3][n4].highlight = "highlightTile"; }
	});

	drawGrid(inkedGrid);
}

function countLongest(t) {
	var result = [];
	networks.forEach(network => {
		if (longestPathInNetwork(network, t).length > result.length) {
			result = longestPathInNetwork(network, t);
		}
	});

	return longestScore(result);
}

function longestPathInNetwork(network, t) {
	var result = [];
	network.forEach(node => {
		if (idToGridTile(node).type === t || idToGridTile(node).type === "station") {
			var newPath = walkAllPaths(node, network, t);
			if (newPath.length > result.length) {
				result = walkAllPaths(node, network, t);
			}
		}
	});

	return result;
}

function walkAllPaths(node, network, t) {
    var stack = [ node ];
    var path = [];
    var visited = [];
    var longPath = [];

    while (stack.length) {
   		var curr = stack.pop();

        visited.push(curr);
        if (curr !== path[path.length - 1]) { path.push(curr); }

        var moveNorth = myNeighbor(curr, "north");
        var moveSouth = myNeighbor(curr, "south");
        var moveWest = myNeighbor(curr, "west");
        var moveEast = myNeighbor(curr, "east");

        if (isValidMove(network, visited, t, moveNorth)) { stack.push(moveNorth); }
        else if (isValidMove(network, visited, t, moveWest)) { stack.push(moveWest); }
        else if (isValidMove(network, visited, t, moveSouth)) { stack.push(moveSouth); }
        else if (isValidMove(network, visited, t, moveEast)) { stack.push(moveEast); }
        else {
        	if (path.length > longPath.length) {
        		longPath.length = 0;
        		for (var i = 0; i < path.length; i++) {
        			longPath.push(path[i]);
        		}
        	}
        	path.pop();
        	if (path.length) { stack.push(path[path.length - 1]); }
        }
    }

    return longPath;
}

function isValidMove (network, visited, t, x) {
	if (network.includes(x)) {
		if ( idToGridTile(x).type === t || idToGridTile(x).type === "station" || isOverpass(x) ) {
			if (!visited.includes(x)) {	return true; } 
		}
	}
	return false;
}

function longestScore(path) {
	if (path.length) {
		var squares = [];
		path.forEach(node => {
			squares.push(node[0] + node[1]);
		});
		var uniqueTiles = [...new Set(squares)];
		return uniqueTiles.length;
	} else { return 0; }
}