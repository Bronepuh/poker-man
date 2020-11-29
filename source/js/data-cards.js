'use strict';

(function () {
  const DECK = [
    //diamonds
    {
      suit: 'diamonds',
      rank: 2,
      name: 'deuce',
      className: 'd2',
    },

    {
      suit: 'diamonds',
      rank: 3,
      name: 'three',
      className: 'd3',
    },

    {
      suit: 'diamonds',
      rank: 4,
      name: 'four',
      className: 'd4',
    },

    {
      suit: 'diamonds',
      rank: 5,
      name: 'five',
      className: 'd5',
    },

    {
      suit: 'diamonds',
      rank: 6,
      name: 'six',
      className: 'd6',
    },

    {
      suit: 'diamonds',
      rank: 7,
      name: 'seven',
      className: 'd7',
    },

    {
      suit: 'diamonds',
      rank: 8,
      name: 'eight',
      className: 'd8',
    },

    {
      suit: 'diamonds',
      rank: 9,
      name: 'nine',
      className: 'd9',
    },

    {
      suit: 'diamonds',
      rank: 10,
      name: 'ten',
      className: 'd10',
    },

    {
      suit: 'diamonds',
      rank: 11,
      name: 'jack',
      className: 'dj',
    },

    {
      suit: 'diamonds',
      rank: 12,
      name: 'deuce',
      className: 'dq',
    },

    {
      suit: 'diamonds',
      rank: 13,
      name: 'deuce',
      className: 'dk',
    },

    {
      suit: 'diamonds',
      rank: 14,
      name: 'ace',
      className: 'da',
    },

    //clubs
    {
      suit: 'clubs',
      rank: 2,
      name: 'deuce',
      className: 'c2',
    },

    {
      suit: 'clubs',
      rank: 3,
      name: 'three',
      className: 'c3',
    },

    {
      suit: 'clubs',
      rank: 4,
      name: 'four',
      className: 'c4',
    },

    {
      suit: 'clubs',
      rank: 5,
      name: 'five',
      className: 'c5',
    },

    {
      suit: 'clubs',
      rank: 6,
      name: 'six',
      className: 'c6',
    },

    {
      suit: 'clubs',
      rank: 7,
      name: 'seven',
      className: 'c7',
    },

    {
      suit: 'clubs',
      rank: 8,
      name: 'eight',
      className: 'c8',
    },

    {
      suit: 'clubs',
      rank: 9,
      name: 'nine',
      className: 'c9',
    },

    {
      suit: 'clubs',
      rank: 10,
      name: 'ten',
      className: 'c10',
    },

    {
      suit: 'clubs',
      rank: 11,
      name: 'jack',
      className: 'cj',
    },

    {
      suit: 'clubs',
      rank: 12,
      name: 'deuce',
      className: 'cq',
    },

    {
      suit: 'clubs',
      rank: 13,
      name: 'deuce',
      className: 'ck',
    },

    {
      suit: 'clubs',
      rank: 14,
      name: 'ace',
      className: 'ca',
    },

    //hearts
    {
      suit: 'hearts',
      rank: 2,
      name: 'deuce',
      className: 'h2',
    },

    {
      suit: 'hearts',
      rank: 3,
      name: 'three',
      className: 'h3',
    },

    {
      suit: 'hearts',
      rank: 4,
      name: 'four',
      className: 'h4',
    },

    {
      suit: 'hearts',
      rank: 5,
      name: 'five',
      className: 'h5',
    },

    {
      suit: 'hearts',
      rank: 6,
      name: 'six',
      className: 'h6',
    },

    {
      suit: 'hearts',
      rank: 7,
      name: 'seven',
      className: 'h7',
    },

    {
      suit: 'hearts',
      rank: 8,
      name: 'eight',
      className: 'h8',
    },

    {
      suit: 'hearts',
      rank: 9,
      name: 'nine',
      className: 'h9',
    },

    {
      suit: 'hearts',
      rank: 10,
      name: 'ten',
      className: 'h10',
    },

    {
      suit: 'hearts',
      rank: 11,
      name: 'jack',
      className: 'hj',
    },

    {
      suit: 'hearts',
      rank: 12,
      name: 'deuce',
      className: 'hq',
    },

    {
      suit: 'hearts',
      rank: 13,
      name: 'deuce',
      className: 'hk',
    },

    {
      suit: 'hearts',
      rank: 14,
      name: 'ace',
      className: 'ha',
    },

    //spides
    {
      suit: 'spides',
      rank: 2,
      name: 'deuce',
      className: 's2',
    },

    {
      suit: 'spides',
      rank: 3,
      name: 'three',
      className: 's3',
    },

    {
      suit: 'spides',
      rank: 4,
      name: 'four',
      className: 's4',
    },

    {
      suit: 'spides',
      rank: 5,
      name: 'five',
      className: 's5',
    },

    {
      suit: 'spides',
      rank: 6,
      name: 'six',
      className: 's6',
    },

    {
      suit: 'spides',
      rank: 7,
      name: 'seven',
      className: 's7',
    },

    {
      suit: 'spides',
      rank: 8,
      name: 'eight',
      className: 's8',
    },

    {
      suit: 'spides',
      rank: 9,
      name: 'nine',
      className: 's9',
    },

    {
      suit: 'spides',
      rank: 10,
      name: 'ten',
      className: 's10',
    },

    {
      suit: 'spides',
      rank: 11,
      name: 'jack',
      className: 'sj',
    },

    {
      suit: 'spides',
      rank: 12,
      name: 'deuce',
      className: 'sq',
    },

    {
      suit: 'spides',
      rank: 13,
      name: 'deuce',
      className: 'sk',
    },

    {
      suit: 'spides',
      rank: 14,
      name: 'ace',
      className: 'sa',
    },
  ];

  window.dataCards = {
    deck: DECK,
  }
})();
