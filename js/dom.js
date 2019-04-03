/// Game Page

//const playLevel = 1; //default

const flipCard = function () {
  const name = this.getAttribute('name');//this.attr('name');
  const idx = name.split('_')[1];

  const gameover = gamePlay(parseInt(idx));
  
  if (gameover===true) {
	  addShuffle();
	  removeHandler();
  }

};

const showBoard = function(index) {
  const idBox = "idBox_" + index;
  const jId = "#" + idBox;
  const elemOld = document.getElementById(idBox);
  const pNode = elemOld.parentNode;

  const boxElement = document.createElement('img');
  boxElement.setAttribute('class', "answeredword");
  boxElement.setAttribute('id', idBox);
  boxElement.setAttribute('name', idBox);

  boxElement.setAttribute('src', gameImagesArray[index] ) ;

  pNode.replaceChild(boxElement, elemOld);

  //$(jId).off('click', flipCard);
};

const playAgain = function () {
	$('#gameboard').html("");
	$('#playagain').html("");
	setupBoard();
};

const addShuffle = function() {
	  const $playAgain = $('<img>');
    $playAgain.attr('src', "img/playagain.gif");
	  $playAgain.attr('class', "imgbutton");
    $playAgain.on('click', playAgain );

	  $('#playagain').append($playAgain);
};

const removeHandler = function () {
	for (let i = 0; i < 9; i++) {
      const idBox = "#idBox_" + i;
      $(idBox).off('click', clickBox );
    }
};

const setupBoard = function() {
  let idb = 0;
  let level = 1; //5 at 120
  let imgsrow = 8;

  if (playLevel>1) {
	  level = playLevel;
  }
  
  ////
  imagesArray = []; //start empty
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

  //PART 2 - setup imagesArray
  for (let y=0; y<totalPlaces; y++ ) {
    const indexRandom = randIndexArray[y];
    const imNum = Math.floor(y/2);
    const imgLoc = "img/a" + imNum + ".jpeg";
    gameImagesArray[indexRandom] = imgLoc;
  }


  ////initial render empty board
  for (let i = 0; i < level; i++) { //LEVEL
    const $divRow = $('<div>');
	  $divRow.attr('class', "imgrow");

    for (let j = 0; j < imgsrow; j++) { //ROW
    //setup game gameboard
	    const $boxElement = $('<img>');
		if (level>5) {
			$boxElement.attr('class', "imglevel6up");
		}
		const idBox = "idBox_" + idb;
		$boxElement.attr('id', idBox);
	    $boxElement.attr('name', idBox);
	    $boxElement.attr('src', "img/shopkins.jpeg");
		$boxElement.on('click', flipCard );

		$divRow.append($boxElement);

		idb += 1;
    }

    $('#gameboard').append($divRow);
  }
};

const getCustom = function(){
	const x = window.location.href;
  //index.html?player=icHuman&alert=on&playFirstAI=true
  if (x.includes("index.html?")) {
  		const customvals = x.split("?")[1]; //holder of values

      let player = "";
  		if (customvals.includes("player")) {
  			player = customvals.split("=")[1];
        player = player.substring(0, player.indexOf('&'));

        if (player==="icHuman") { //default
          humanPlayer = "X";
          aiPlayer = "O";
        } else {
          humanPlayer = "O";
          aiPlayer = "X";

          playerHumanObj.player = "O";
          playerAIObj.player = "X";

          const tempImg = playerHumanObj.img; //hold
          playerHumanObj.img = playerAIObj.img;
          playerAIObj.img = tempImg;
        }

      }

      let pFirstAI = "";
      if (customvals.includes("playFirstAI")) {
  			pFirstAI = customvals.split("playFirstAI=")[1];

        if (pFirstAI==="false") {
            playFirstAI = false;
        } else {
            playFirstAI = true;
        }
      }
    }
};

const startGame = function() {
  getCustom(); //in case there are custom settings

  // initial display of the game
  setupBoard();

};

$(document).ready( startGame );
