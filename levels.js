var red     = Projectile.colors.red;
var aqua    = Projectile.colors.aqua;
var green   = Projectile.colors.green;
var blue    = Projectile.colors.blue;
var purple  = Projectile.colors.purple;
var orange  = Projectile.colors.orange;

var levels = [
  { board: [
      {loc: [0, 0],  color: red},
      {loc: [0, 2],  color: red},
      {loc: [0, 4],  color: blue},
      {loc: [0, 6],  color: blue},
      {loc: [0, 8],  color: green},
      {loc: [0, 10], color: green},
      {loc: [0, 12], color: aqua},
      {loc: [0, 14], color: aqua},
      {loc: [0, 16], color: purple},
      {loc: [0, 18], color: purple},
      {loc: [0, 20], color: orange},

      {loc: [1, 1], color: green},
      {loc: [1, 3], color: green},
      {loc: [1, 5], color: orange},
      {loc: [1, 7], color: orange},
      {loc: [1, 9], color: red},
      {loc: [1, 11], color: red},
      {loc: [1, 13], color: aqua},
      {loc: [1, 15], color: aqua},
      {loc: [1, 17], color: blue},
      {loc: [1, 19], color: blue},
      {loc: [1, 21], color: orange},

      {loc: [2, 0], color: aqua},
      {loc: [2, 2], color: aqua},
      {loc: [2, 4], color: blue},
      {loc: [2, 6], color: blue},
      {loc: [2, 8], color: green},
      {loc: [2, 10], color: green},
      {loc: [2, 12], color: orange},
      {loc: [2, 14], color: orange},
      {loc: [2, 16], color: red},
      {loc: [2, 18], color: red},
      {loc: [2, 20], color: purple},

      {loc: [3, 1], color: green},
      {loc: [3, 3], color: green},
      {loc: [3, 5], color: orange},
      {loc: [3, 7], color: orange},
      {loc: [3, 9], color: red},
      {loc: [3, 11], color: red},
      {loc: [3, 13], color: blue},
      {loc: [3, 15], color: blue},
      {loc: [3, 17], color: aqua},
      {loc: [3, 19], color: aqua},
      {loc: [3, 21], color: purple},

    ],
    meterOptions: {
      turnMax: 2,
      snoodsForInc: 3,
      meterInc: 20
    }
  },

  { board: [
      {loc: [0, 0], color: blue},
      {loc: [0, 2], color: green},
      {loc: [0, 4], color: purple},
      {loc: [0, 6], color: blue},
      {loc: [0, 8], color: green},
      {loc: [0, 10], color: purple},
      {loc: [0, 12], color: blue},
      {loc: [0, 14], color: green},
      {loc: [0, 16], color: purple},
      {loc: [0, 18], color: blue},
      {loc: [0, 20], color: green},

      {loc: [1, 1], color: aqua},
      {loc: [1, 3], color: red},
      {loc: [1, 5], color: orange},
      {loc: [1, 7], color: aqua},
      {loc: [1, 9], color: red},
      {loc: [1, 11], color: orange},
      {loc: [1, 13], color: aqua},
      {loc: [1, 15], color: red},
      {loc: [1, 17], color: orange},
      {loc: [1, 19], color: aqua},
      {loc: [1, 21], color: red},

      {loc: [2, 0], color: blue},
      {loc: [2, 2], color: green},
      {loc: [2, 4], color: purple},
      {loc: [2, 6], color: blue},
      {loc: [2, 8], color: green},
      {loc: [2, 10], color: purple},
      {loc: [2, 12], color: blue},
      {loc: [2, 14], color: green},
      {loc: [2, 16], color: purple},
      {loc: [2, 18], color: blue},
      {loc: [2, 20], color: green},

      {loc: [3, 1], color: aqua},
      {loc: [3, 3], color: red},
      {loc: [3, 5], color: orange},
      {loc: [3, 7], color: aqua},
      {loc: [3, 9], color: red},
      {loc: [3, 11], color: orange},
      {loc: [3, 13], color: aqua},
      {loc: [3, 15], color: red},
      {loc: [3, 17], color: orange},
      {loc: [3, 19], color: aqua},
      {loc: [3, 21], color: red},

    ],
    meterOptions: {
      turnMax: 2,
      snoodsForInc: 3,
      meterInc: 20
    }
  },

  { board: [
      {loc: [0, 0], color: orange},
      {loc: [0, 2], color: purple},
      {loc: [0, 4], color: green},
      {loc: [0, 6], color: aqua},
      {loc: [0, 8], color: blue},
      {loc: [0, 10], color: orange},
      {loc: [0, 12], color: blue},
      {loc: [0, 14], color: aqua},
      {loc: [0, 16], color: green},
      {loc: [0, 18], color: purple},
      {loc: [0, 20], color: orange},

      {loc: [1, 1], color: purple},
      {loc: [1, 3], color: green},
      {loc: [1, 5], color: aqua},
      {loc: [1, 7], color: blue},
      {loc: [1, 9], color: orange},
      {loc: [1, 11], color: orange},
      {loc: [1, 13], color: blue},
      {loc: [1, 15], color: aqua},
      {loc: [1, 17], color: green},
      {loc: [1, 19], color: purple},

      {loc: [2, 0], color: purple},
      {loc: [2, 2], color: green},
      {loc: [2, 4], color: aqua},
      {loc: [2, 6], color: blue},
      {loc: [2, 8], color: orange},
      {loc: [2, 10], color: orange},
      {loc: [2, 12], color: orange},
      {loc: [2, 14], color: blue},
      {loc: [2, 16], color: aqua},
      {loc: [2, 18], color: green},
      {loc: [2, 20], color: purple},

      {loc: [3, 1], color: blue},
      {loc: [3, 3], color: orange},
      {loc: [3, 5], color: purple},
      {loc: [3, 7], color: aqua},
      {loc: [3, 9], color: blue},
      {loc: [3, 11], color: blue},

      {loc: [3, 13], color: aqua},
      {loc: [3, 15], color: purple},
      {loc: [3, 17], color: orange},
      {loc: [3, 19], color: blue},

    ],
    meterOptions: {
      turnMax: 2,
      snoodsForInc: 3,
      meterInc: 20
    }
  },

  { board: [
      {loc: [0, 0], color: purple},
      {loc: [0, 2], color: purple},
      {loc: [0, 4], color: purple},
      {loc: [0, 6], color: purple},
      {loc: [0, 8], color: purple},
      {loc: [0, 10], color: blue},
      {loc: [0, 12], color: orange},
      {loc: [0, 14], color: purple},
      {loc: [0, 16], color: orange},
      {loc: [0, 18], color: purple},
      {loc: [0, 20], color: purple},
      {loc: [1, 1], color: purple},
      {loc: [1, 3], color: blue},
      {loc: [1, 5], color: purple},
      {loc: [1, 7], color: aqua},
      {loc: [1, 9], color: green},
      {loc: [1, 11], color: orange},
      {loc: [1, 13], color: aqua},
      {loc: [1, 15], color: purple},
      {loc: [1, 19], color: green},
      {loc: [1, 21], color: aqua},
      {loc: [1, 17], color: purple},
      {loc: [2, 0],  color: purple},
      {loc: [2, 2],  color: green},
      {loc: [2, 4],  color: green},
      {loc: [2, 6],  color: green},
      {loc: [2, 8],  color: aqua},
      {loc: [2, 10], color: blue},
      {loc: [2, 12], color: orange},
      {loc: [2, 14], color: green},
      {loc: [2, 16], color: purple},
      {loc: [2, 18], color: orange},
      {loc: [2, 20], color: green},
      {loc: [3, 1], color: blue},
      {loc: [3, 3], color: green},
      {loc: [3, 5], color: aqua},
      {loc: [4, 0], color: orange},
      {loc: [4, 2], color: purple},
      {loc: [4, 4], color: red},
    ],

    meterOptions: {
      turnMax: 2,
      snoodsForInc: 3,
      meterInc: 20
    }
  }
];

window.levels = levels;
