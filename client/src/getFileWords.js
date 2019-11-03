const tempWordBank =  require('./tempWordBank');
const lines = tempWordBank.split("\n");

const getFileWords = () => {
  let randomized = lines.sort(() => 0.5 - Math.random()).slice(0,25);
  let player1Count = 9;
  let player2Count = 8;
  let bombCount = 1;
  let tiles = [];

  while (randomized.length > 0) {
    let i = Math.floor(Math.random()*randomized.length);
    let word = randomized.pop()

    if (player1Count > 0) {
     player1Count-= 1;
     tiles.push({title: "p1", tileHeader: word, clicked: false});
    } else if (player2Count > 0) {
      player2Count-= 1;
     tiles.push({title: "p2", tileHeader: word, clicked: false});
    } else if (bombCount > 0) {
     bombCount-= 1;
     tiles.push({title: "bomb", tileHeader: word, clicked: false});
    } else {
     tiles.push({title: "blank", tileHeader: word, clicked: false});
    }
  }

  return tiles.sort(() => 0.5 - Math.random());
}

module.exports = getFileWords;
