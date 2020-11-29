'use strict';

(function () {
  const PLAYERS = window.data.players;
  const TABLE_CARDS = [];

  const START_RATE = 5;

  let rate = 5;
  let steck = START_RATE;
  let indexDiller = 0;
  let indexOfFirstPlayer = 1;

  const testButton = document.querySelector('button[name=test]');
  const callButton = document.querySelector('button[name=call]');
  const raiseButton = document.querySelector('button[name=raise]');
  const foldButton = document.querySelector('button[name=fold]');

  const playersList = document.querySelectorAll('.player');
  const tableField = document.querySelector('.table__field');
  const tableInput = document.querySelector('input[name=table-rate]');
  const playerControll = document.querySelector('.room__player-controll');
  const tableCards = document.querySelectorAll('.deck__card');

  const DECK = window.dataCards.deck;
  let newDeck = [];

  const shaffleDeck = function () {
    newDeck.splice(0, newDeck.length);
    for (let i = 0; i < DECK.length; i++) {
      while (newDeck.length < DECK.length) {
        const newCard = DECK[window.utils.random(0, DECK.length)];
        if (!newDeck.includes(newCard)) {
          newDeck.push(newCard);
        }
      }
    } return newDeck;
  }

  const isBot = function (player) {
    if (player.isBot) {
      // console.log('bot');
      // setTimeout(checkStepStatus, 200);
      // setTimeout(setRate, 250);
      // setTimeout(changePlayer, 500);
      // playerControll.classList.add('visually-hidden');
    } else if (player.isActive) {
      // playerControll.classList.remove('visually-hidden');
    }
  };

  const clearClasses = function (playersList) {
    playersList.forEach(element => {
      element.querySelector('.player__container').classList.remove('player__container--active')
    });
  };

  const setActiveClass = function (index) {
    clearClasses(playersList)
    playersList[index].querySelector('.player__container').classList.add('player__container--active');
  }

  const clearActiveStatus = function () {
    for (let i = 0; i < PLAYERS.length; i++) {
      PLAYERS[i].isActive = false;
    }
    clearClasses(playersList);
  }

  const changeIndex = function (index = 0) {

    let player = PLAYERS[index];
    player.isActive = true;
    setActiveClass(index);

    return function (newIndex = index) {
      index = newIndex;
      player.isActive = false;

      if (index < PLAYERS.length - 1) {
        index++;
      } else {
        index = 0;
      }
      clearActiveStatus();
      player = PLAYERS[index];
      player.isActive = true;
      setActiveClass(index);
      isBot(player);
    }
  }

  const changePlayer = changeIndex();

  const clearDillers = function () {
    for (let i = 0; i < PLAYERS.length; i++) {
      PLAYERS[i].isDiller = false;
    }
    playersList.forEach(element => {
      element.querySelector('.player__diller').classList.add('visually-hidden');
    });
  };

  const clearPlayers = function () {
    for (let i = 0; i < PLAYERS.length; i++) {
      PLAYERS[i].isActive = false;
    };
    clearClasses(playersList);
  };

  const setDiller = function () {

    return function (index = indexDiller) {
      clearDillers();
      clearPlayers();
      let player = PLAYERS[index];
      player.isDiller = true
      player.isActive = true;
      setActiveClass(index);
      playersList[index].querySelector('.player__diller').classList.remove('visually-hidden');
      player.rate = START_RATE;
      player.cash -= START_RATE;

      window.render.renderPlayers(PLAYERS);
    }
  };

  const changeDiller = setDiller();

  const setRate = function () {
    for (let i = 0; i < PLAYERS.length; i++) {
      let diff = rate - PLAYERS[i].rate;
      if (PLAYERS[i].isActive && PLAYERS[i].rate < rate) {
        PLAYERS[i].cash -= diff;
        PLAYERS[i].rate = diff;
        playersList[i].querySelector('.player__cash').value = PLAYERS[i].cash;
        playersList[i].querySelector('.player__rate').value = PLAYERS[i].rate;
        steck = Number(steck) + Number(PLAYERS[i].rate);
        PLAYERS[i].rate = rate;
      }
      else if (PLAYERS[i].isActive && PLAYERS[i].rate === rate) {
        steck = Number(steck);
      }
    }

    window.render.renderTable(rate, steck);
    window.render.renderPlayers(PLAYERS);
  }

  const checkStepStatus = function () {
    let callArray = []
    for (let i = 0; i < PLAYERS.length; i++) {

      if (PLAYERS[i].rate === rate) {
        callArray.push(PLAYERS[i]);
      } else if (PLAYERS[i].rate < rate) {
        callArray.splice(0, callArray.length);
      }

      if (callArray.length === PLAYERS.length && tableField.textContent === 'preflop') {
        callArray.splice(0, callArray.length);
        console.log('floop!');
        for (let i = 0; i < PLAYERS.length; i++) {
          PLAYERS[i].rate = 0;
        }
        rate = START_RATE * 2;
        flop();
      }

      if (callArray.length == PLAYERS.length && tableField.textContent == 'flop') {
        callArray.splice(0, callArray.length);
        console.log('tern!');
        for (let i = 0; i < PLAYERS.length; i++) {
          PLAYERS[i].rate = 0;
        }
        rate = START_RATE * 2;
        tern();
      }

      if (callArray.length == PLAYERS.length && tableField.textContent == 'tern') {
        callArray.splice(0, callArray.length);
        console.log('river!');
        for (let i = 0; i < PLAYERS.length; i++) {
          PLAYERS[i].rate = 0;
        }
        rate = START_RATE * 2;
        river();
      }

      if (callArray.length == PLAYERS.length && tableField.textContent == 'river') {
        callArray.splice(0, callArray.length);
        console.log('restart!');
        for (let i = 0; i < PLAYERS.length; i++) {
          PLAYERS[i].rate = 0;

          const playerHand = playersList[i].querySelectorAll('.card');
          playerHand[0].classList.remove('card--close');
          playerHand[1].classList.remove('card--close');
        }

        setTimeout(restart, 3000);

      }
    }
  }

  const preFlop = function (index = indexDiller) {

    shaffleDeck();
    window.render.renderCards(newDeck, TABLE_CARDS);


    rate = START_RATE;
    changeDiller(indexDiller);
    setRate();

    rate = rate * 2;
    changePlayer(index);
    setRate();
    console.log(PLAYERS[0].combination);
    window.render.renderTable(rate, steck);
    window.render.renderPlayers(PLAYERS);
  }

  const flop = function () {

    tableCards[0].style = 'display: flex';
    tableCards[1].style = 'display: flex';
    tableCards[2].style = 'display: flex';

    for (let i = 0; i < PLAYERS.length; i++) {
      PLAYERS[i].combination.push(TABLE_CARDS[0]);
      PLAYERS[i].combination.push(TABLE_CARDS[1]);
      PLAYERS[i].combination.push(TABLE_CARDS[2]);
    }

    console.log(PLAYERS[0].combination);
    changePlayer(indexDiller);
    tableField.textContent = 'flop';
    window.render.renderTable(rate, steck);
    window.render.renderPlayers(PLAYERS);
  }

  const tern = function () {

    tableCards[3].style = 'display: flex';

    for (let i = 0; i < PLAYERS.length; i++) {
      PLAYERS[i].combination.push(TABLE_CARDS[3]);
    };

    console.log(PLAYERS[0].combination);
    changePlayer(indexDiller);
    tableField.textContent = 'tern';
    window.render.renderPlayers(PLAYERS);
    window.render.renderTable(rate, steck);
  }

  const river = function () {

    tableCards[4].style = 'display: flex';

    for (let i = 0; i < PLAYERS.length; i++) {
      PLAYERS[i].combination.push(TABLE_CARDS[4]);
    };

    console.log(PLAYERS[0].combination);
    changePlayer(indexDiller);
    tableField.textContent = 'river';
    window.render.renderPlayers(PLAYERS);
    window.render.renderTable(rate, steck);
  };

  const restart = function () {

    for (let i = 0; i < PLAYERS.length; i++) {
      PLAYERS[i].cash = 5000;
      PLAYERS[i].rate = 0;
      PLAYERS[i].isActive = false;
      PLAYERS[i].isDiller = false;
      PLAYERS[i].combination = [];
    }

    steck = START_RATE;
    tableField.textContent = 'preflop';

    if (indexDiller < PLAYERS.length - 1) {
      indexDiller++;
    } else {
      indexDiller = 0;
    }

    preFlop(indexDiller);
    window.render.renderPlayers(PLAYERS);
    window.render.renderTable(rate, steck);
  };

  //==========

  testButton.addEventListener('click', function () {
    changePlayer();
  });

  callButton.addEventListener('click', function () {
    setRate();
    changePlayer();
    checkStepStatus();
  });

  raiseButton.addEventListener('click', function () {
    rate = rate + (rate * 2);
    setRate();
    changePlayer();
    checkStepStatus();
  })

  window.steps = {
    rate: rate,
    steck: steck,
    preFlop: preFlop,
    newDeck: newDeck,
  }

})();




