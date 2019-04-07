// Javascript File for Memory Card Game, modified by Mabeth Borres WDI March 2019

// GLOBAL Variables

//initial score values
var score = 0;
var wrongMoves = 0;

var maxLevel = 10; //5 default

var playLevel = 1;

var cardsrow = 8;

var showAlerts = false; //default

var cards = []; //holds the cards selected randomly

var cardsInPlay = []; //copy of the cards currently being played

var cardIds = []; //store ids for comparison purposes

var matched = true; //check if matched cards
var cardId = 0; //current card id to be compared


// FUNCTIONS

var checkForMatch = function(){
	var cid = cardsInPlay.length - 1;
	if( cardsInPlay[cid]===cardsInPlay[cid-1]  ) {
			score++; //increase score
			if (showAlerts) alert("You found a match!");

		} else {
			wrongMoves++; //unmatched turn
			if (showAlerts) alert("Sorry, TRY Again. TIP: Remember the cards' position.");
			return false;
		}

	return true;
};

var levelUp = function(){
	var level = playLevel;
	var msg = "Congratulations!!! You've just unlocked Level [" + level + "].";
		
	//console.log("level [" + level + "], maxLevel [" + maxLevel + "]");
	/*if (level <= maxLevel) {
		var newBackgroundImage = "url('images/level" + level + ".png')";
		//console.log("newBackgroundImage=" + newBackgroundImage); //debug
		document.body.style.backgroundImage = newBackgroundImage;
	}*/
		
	var audio = new Audio("img/applause.mp3");
		
	if (playLevel === maxLevel) {
		msg = msg.concat("\nWhat a feat! You are the Winner!")
			
		// end game sound 
		audio = new Audio("img/homerun.mp3"); //done with level20
	}
		
	audio.play(); //applause
	if (showAlerts) alert(msg);

	playLevel++;

	if (playLevel<=maxLevel) {
		resetBoard();
		createBoard();
	}
	
};

var flipCard = function(){ 

	cardId = this.getAttribute('data-id');

	var repeat = false;

	//check if this is a repeat card or card that's already opened
	if (cardIds.length>0) {
		var cid = this.getAttribute('data-id');

		for (var dd = 0; dd < cardIds.length; dd++) {
			if ( cid===cardIds[dd] ) {
				repeat = true;
				break;
			}
		}
	}

	if (!repeat) { //does not allow to click same, like an already opened card
		repeat = false; 

		this.setAttribute('src', cards[cardId]); 
		var cardFlipped = cards[cardId];

		cardsInPlay.push(cards[cardId]); //store card object
		cardIds.push(this.getAttribute('data-id')); //store card ids to check no-repeats

		if ( cardsInPlay.length%2===0 ) { //allow cards IN PAIRS

			matched = checkForMatch();
			if (!matched) {
				//allow to replace 2nd card 
				cardsInPlay.pop();
				cardIds.pop();
				
			} else {
				//MATCHED

				if (cardsInPlay.length === (playLevel*cardsrow) ) {
					levelUp();
				}
				
				if (playLevel > maxLevel) { // END GAME
				    processEndGame();
				}
			}
		
		}
	}
};

function processEndGame() {
	resetBoard();
	
	var divCards = document.getElementById('game-board');

	var divrow = document.createElement('div');
	divrow.setAttribute('id', "cardsrow");
	divrow.setAttribute('class', "gameboard");

	var cardElement = document.createElement('img');
	cardElement.setAttribute('src', "img/winner.png");
	cardElement.setAttribute('class', "imgCongrats");
	//cardElement.setAttribute('height', "500");
	//cardElement.setAttribute('width', "900");
	
	divrow.appendChild(cardElement);

	divCards.appendChild(divrow);
	
	//add shuffle
	
	const $playAgain = $('<img>');
    $playAgain.attr('src', "img/playagain.gif");
	$playAgain.attr('class', "imgbutton");
	$playAgain.attr('height', "65");
	$playAgain.attr('width', "200");
    $playAgain.on('click', playAgain );

	const $resetstats = $('<img>');
	$resetstats.attr('src', "img/resetstats.jpg");
	$resetstats.attr('class', "imgbutton");
	$resetstats.attr('height', "60");
	$resetstats.attr('width', "140");
    $resetstats.on('click', restartGame );
	
	$('#playagain').append($playAgain);
	$('#playagain').append($resetstats);
	
	$('#playagain').attr('visibility', "visible");
}

function sleep( millisecondsToWait ) //allow to delay flipping card to back face
{
	var now = new Date().getTime();
	while ( new Date().getTime() < now + millisecondsToWait )
	{
		/* do nothing; this will exit once it reaches the time limit */
	}
}

var backCard = function(){
	
	if (!matched) { //if cards don't match
		sleep(800); //delay
		this.setAttribute('src', "img/shopkins.jpeg"); //latest card
		matched = true; //reset

		//flip remaining card to back face
		//get all images in the document
		var images = document.body.getElementsByClassName("boardimgs");

		var cid = cardsInPlay.length - 1;

		for ( var m = 0; m < images.length; m++ ) {
			var did = images[m].getAttribute("data-id");

			if (did === cardIds[cid]) { //compare to remaining card
				images[m].setAttribute('src', "img/shopkins.jpeg"); 
				cardsInPlay.pop(); //allow reset
				cardIds.pop(); //allow reset
				break;
			}
		}
	}
};

function getCustom(){
	var x = window.location.href;

  	if (x.includes("index.html?")) {
  		var customvals = x.split("?")[1];

  		if (customvals.includes("=")) {
  			var gameLevel = parseInt(customvals.split("=")[1]);

			if ( gameLevel>=1 && gameLevel<=5 ) {
				// accepted
				maxLevel = gameLevel;
			} 
		}
  	}
}

var createBoard = function(){

	//setup if custom was called
	getCustom();
	
	let idb = 0;
	let level = 1; //5 at 120
	let imgsrow = 8;

	if (playLevel>1) {
	  level = playLevel;
	}
  
	////
	cards = []; //start empty
	const randIndexArray = [];

	//PART 1 - setup random indexes
	const totalPlaces = level * imgsrow;
	for (let y=0; y<totalPlaces; y++ ) {
		let tempInd = 0;
		do {
			tempInd = Math.floor(Math.random() * totalPlaces);
		} while(randIndexArray.includes(tempInd)===true);
		randIndexArray[y] = tempInd;
	}

	//PART 2 - setup cards array
	for (let y=0; y<totalPlaces; y++ ) {
		const indexRandom = randIndexArray[y];
		const imNum = Math.floor(y/2);
		const imgLoc = "img/a" + imNum + ".jpeg";
		cards[indexRandom] = imgLoc;
	}

	//render board

	idb = 0;
	////initial render empty board
	for (let i = 0; i < level; i++) { //LEVEL
		const $divRow = $('<div>');
		$divRow.attr('class', "imgrow");

		for (let j = 0; j < imgsrow; j++) { //ROW
			//setup game gameboard
			const $cardElement = $('<img>');
			if (level>5) {
				$cardElement.attr('class', "imglevel6up");
			}
			let imgCardId = "imgCardId" + idb ;
			$cardElement.attr('id', imgCardId);
			$cardElement.attr('name', imgCardId);
			$cardElement.attr('class', "boardimgs");
			$cardElement.attr('data-id', idb);
			$cardElement.attr('src', "img/shopkins.jpeg");
			$cardElement.on('click', flipCard );
			$cardElement.on('mouseout', backCard );

			$divRow.append($cardElement);

			idb += 1;
		}

		$('#game-board').append($divRow);
	}

};

function playAgain() { //without reloading 
	resetBoard(); //clear board and cards storage
	$('#gameboard').html("");
	$('#playagain').html("");
	$('#playagain').attr('visibility', "hidden");
	createBoard(); //setup board
}

function resetBoard() { //reset board, cards storage


	document.getElementById("game-board").innerHTML = "";

	//reset the cards storage
	var ct = 0;

	var len = cards.length;	
	for (ct = len; ct>=0; ct--) {
		cards.pop();
	}

	len = cardsInPlay.length;	
	for (ct = len; ct>=0; ct--) {
		cardsInPlay.pop();
	}

	len = cardIds.length;	
	for (ct = len; ct>=0; ct--) {
		cardIds.pop();
	}

}

function restartGame() {
	location.reload(); //restart game, everything
}

function updateAlerts() {
	//showAlerts true default
	if (document.getElementById("alertYes").checked === true) {
  		showAlerts = true;
	}
	if (document.getElementById("alertNo").checked === true) {
		showAlerts = false;
  }
}


$(document).ready( createBoard );
