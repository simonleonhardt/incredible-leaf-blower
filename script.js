let canvas = document.querySelector("canvas");
let c = canvas.getContext("2d");

let resizeCanvas = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

let gameRunning = false;
let deathMenu = false;
let mouseX;
let mouseY;
let score = 0;
let coins = 0;
let leafArr = [];
let enemyArr = [];
let leafSpawnTimer = 0;
let enemySpawnTimer = 0;
let shopOpen = false;
let purchases = {
  blowRadius: 150,
  blowRadiusLevel: 1,
  blowPowerDivider: 5,
  blowPowerDividerLevel: 1,
  spawnTime: 200,
  spawnTimeLevel: 1,
  spawnAmount: 20,
  spawnAmountLevel: 1,
  maxLeaves: 200,
  maxLeavesLevel: 1,
  leafSellPrice: 1,
  leafSellPriceLevel: 1,
};
const fps = 120;
const fontRatio = 20 / 1000;

const shopImage = new Image();
shopImage.src = "images/shopIcon.png";

const backgroundImage = new Image();
backgroundImage.src = "images/background.png";

const playerImage = new Image();
playerImage.src = "images/player.png";

const leafImage1 = new Image();
leafImage1.src = "images/leaf1.png";

const leafImage2 = new Image();
leafImage2.src = "images/leaf2.png";

const leafImage3 = new Image();
leafImage3.src = "images/leaf3.png";

const leafImage4 = new Image();
leafImage4.src = "images/leaf4.png";

const leafImage5 = new Image();
leafImage5.src = "images/leaf5.png";

const leafImage6 = new Image();
leafImage6.src = "images/leaf6.png";

const treeAttackingRightImage = new Image();
treeAttackingRightImage.src = "images/treeAttackingRight.png";

const treeAttackingLeftImage = new Image();
treeAttackingLeftImage.src = "images/treeAttackingLeft.png";

const treeDeadImage = new Image();
treeDeadImage.src = "images/treeDead.png";

document.addEventListener("mousemove", (event) => {
  mouseX = event.clientX;
  mouseY = event.clientY;
  player.x = mouseX;
  player.y = mouseY;
});

document.addEventListener("click", () => {
  if (
    mouseX >= canvas.width / 3.333 &&
    mouseX <= canvas.width / 3.333 + canvas.width / 2.5 &&
    mouseY >= 300 &&
    mouseY <= 500
  ) {
    gameRunning = true;
    score = 0;
  }
  if (
    mouseX >= 20 &&
    mouseX <= 95 &&
    mouseY >= canvas.height - 95 &&
    mouseY <= canvas.height - 20
  ) {
    shopOpen = true;
  }
  if (shopOpen) {
    if (
      mouseX >= canvas.width / 8 + canvas.width * (3 / 4) - 70 &&
      mouseX <= canvas.width / 8 + canvas.width * (3 / 4) - 70 + 50 &&
      mouseY >= canvas.height / 8 + 20 &&
      mouseY <= canvas.height / 8 + 20 + 50
    ) {
      shopOpen = false;
    }

    for (i = 0; i < 7; i++) {
      if (
        mouseX >= canvas.width / 8 + 15 + canvas.width * (3 / 4) - 400 &&
        mouseX <= canvas.width / 8 + 15 + canvas.width * (3 / 4) - 100 &&
        mouseY >= canvas.height / 8 + ((canvas.height * (3 / 4) + 30)/6) * i + (canvas.height * (3 / 4) + 30)/26 + 15 &&
        mouseY <= (canvas.height / 8 + ((canvas.height * (3 / 4) + 30)/6) * i + (canvas.height * (3 / 4) + 30)/26 + 15) + (((canvas.height * (3 / 4) + 30)/6 - (canvas.height * (3 / 4) + 30)/26) - 30) &&
        shopOpen
      ) {
        if(i == 0 && coins >= purchases.blowRadiusLevel * 10) {
          coins -= purchases.blowRadiusLevel * 10;
          purchases.blowRadiusLevel++;
          purchases.blowRadius += 15;
        } else if(i == 1 && purchases.blowPowerDivider > 1 && coins >= purchases.blowPowerDividerLevel * 40) {
          coins -= purchases.blowPowerDividerLevel * 40;
          purchases.blowPowerDividerLevel++;
          purchases.blowPowerDivider--;
        } else if(i == 2 && purchases.spawnTime > 50 && coins >= purchases.spawnTimeLevel * 30) {
          coins -= purchases.spawnTimeLevel * 30;
          purchases.spawnTimeLevel++;
          purchases.spawnTime -= 10;
        } else if(i == 3 && coins >= purchases.spawnAmountLevel * 10) {
          coins -= purchases.spawnAmountLevel * 10;
          purchases.spawnAmountLevel++;
          purchases.spawnAmount += 2;
        } else if(i == 4 && coins >= purchases.maxLeavesLevel * 10) {
          coins -= purchases.maxLeavesLevel * 10;
          purchases.maxLeavesLevel++;
          purchases.maxLeaves += 5;
        } else if(i == 5 && coins >= purchases.leafSellPriceLevel * 50) {
          coins -= purchases.leafSellPriceLevel * 50;
          purchases.leafSellPriceLevel++;
          purchases.leafSellPrice += 1;
        }
      }
    }
  }
});

canvas.addEventListener("mousemove", () => {
  if (
    mouseX > 20 &&
    mouseX < 95 &&
    mouseY > canvas.height - 95 &&
    mouseY < canvas.height - 20 &&
    gameRunning &&
    !shopOpen
  ) {
    document.querySelector("*").style.cursor = "pointer";
  } else if (
    mouseX > canvas.width / 3.333 &&
    mouseX < canvas.width / 3.333 + canvas.width / 2.5 &&
    mouseY > 300 &&
    mouseY < 500 &&
    !gameRunning
  ) {
    document.querySelector("*").style.cursor = "pointer";
  } else if (
    mouseX > canvas.width / 8 + canvas.width * (3 / 4) - 70 &&
    mouseX < (canvas.width / 8 + canvas.width * (3 / 4) - 70) + 50 &&
    mouseY > canvas.height / 8 + 20 &&
    mouseY < (canvas.height / 8 + 20) + 50 &&
    shopOpen
  ) {
    document.querySelector("*").style.cursor = "pointer";
  } else if (shopOpen) {
    document.querySelector("*").style.cursor = "default";
  } else if (gameRunning) {
    document.querySelector("*").style.cursor = "none";
  }else {
    document.querySelector("*").style.cursor = "default";
  }

  for (i = 0; i < 7; i++) {
    if (
      mouseX >= canvas.width / 8 + 15 + canvas.width * (3 / 4) - 400 &&
      mouseX <= canvas.width / 8 + 15 + canvas.width * (3 / 4) - 100 &&
      mouseY >= canvas.height / 8 + ((canvas.height * (3 / 4) + 30)/6) * i + (canvas.height * (3 / 4) + 30)/26 + 15 &&
      mouseY <= (canvas.height / 8 + ((canvas.height * (3 / 4) + 30)/6) * i + (canvas.height * (3 / 4) + 30)/26 + 15) + (((canvas.height * (3 / 4) + 30)/6 - (canvas.height * (3 / 4) + 30)/26) - 30) &&
      shopOpen
    ) {
      document.querySelector("*").style.cursor = "pointer";
    }
  }

});

let player = {
  x: 0,
  y: 0,
  radius: 64,
  hp: 100,
  regen: 5,
  regenCooldown: 500,
  draw: () => {
    c.drawImage(
      playerImage,
      player.x - player.radius,
      player.y - player.radius,
      player.radius * 2,
      player.radius * 2
    );
  },
  heal: () => {
    player.regenCooldown--;
    if(player.regenCooldown <= 0) {
      if(player.hp + player.regen <= 100) {
        player.hp += player.regen;
      }
      player.regenCooldown = 500;
    }
  }
};

class Leaf {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 40;
    this.height = 40;
    this.spriteDice = Math.random();
    this.sprite =
      this.spriteDice <= 0.17
        ? leafImage1
        : this.spriteDice > 0.17 && this.spriteDice <= 0.33
        ? leafImage2
        : this.spriteDice > 0.33 && this.spriteDice <= 0.5
        ? leafImage3
        : this.spriteDice > 0.5 && this.spriteDice <= 0.67
        ? leafImage4
        : this.spriteDice > 0.67 && this.spriteDice <= 0.83
        ? leafImage5
        : leafImage6;
    this.distanceFromPlayer = Math.sqrt(
      Math.abs((x - player.x) * (x - player.x)) +
        Math.abs((y - player.y) * (y - player.y))
    );
  }
  draw = () => {
    c.drawImage(this.sprite, this.x, this.y, this.width, this.height);
  };
  blow = () => {
    this.distanceFromPlayer = Math.sqrt(
      Math.abs(
        (this.x + this.width / 2 - player.x) *
          (this.x + this.width / 2 - player.x)
      ) +
        Math.abs(
          (this.y + this.height / 2 - player.y) *
            (this.y + this.height / 2 - player.y)
        )
    );
    if (this.distanceFromPlayer <= purchases.blowRadius) {
      this.x += (this.x - player.x) / purchases.blowPowerDivider;
      this.y += (this.y - player.y) / purchases.blowPowerDivider;
    }
  };
  update = () => {
    if (
      this.x + this.width <= 0 ||
      this.y + this.height <= 0 ||
      this.x >= canvas.width ||
      this.y >= canvas.height
    ) {
      leafArr.splice(leafArr.indexOf(this), 1);
      coins += purchases.leafSellPrice;
      score += purchases.leafSellPrice;
    }
  };
}

class Enemy {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 90;
    this.height = 90;
    this.hp = 100;
    this.dead = false;
  }
  draw = () => {
    c.drawImage(
      this.dead
        ? treeDeadImage
        : this.x > player.x
        ? treeAttackingLeftImage
        : treeAttackingRightImage,
      this.x,
      this.y,
      this.width,
      this.height
    );
  };
  move = () => {
    if (!this.dead) {
      if (this.x > player.x) {
        this.x -= 2;
      }
      if (this.x < player.x) {
        this.x += 2;
      }
      if (this.y > player.y) {
        this.y -= 2;
      }
      if (this.y < player.y) {
        this.y += 2;
      }
    }
  };
  collision = () => {
    if (!this.dead) {
      leafArr.forEach((leaf) => {
        if (
          leaf.x + leaf.width > this.x &&
          leaf.x < this.x + this.width &&
          leaf.y + leaf.height > this.y &&
          leaf.y < this.y + this.height
        ) {
          leafArr.splice(leafArr.indexOf(leaf), 1);
          this.hp -= 10;
          if (this.hp <= 0) {
            this.dead = true;
            coins += 10;
            score += 10;
            setTimeout(() => {enemyArr.splice(enemyArr.indexOf(this), 1)}, 3000);
          }
        }
      });
      if (
        player.x + player.radius > this.x &&
        player.x - player.radius < this.x + this.width &&
        player.y + player.radius > this.y &&
        player.y - player.radius < this.y + this.height
      ) {
        player.hp -= 10;
        enemyArr.splice(enemyArr.indexOf(this), 1);
      }
    }
  };
}

let spawn = (numOfLeaves, numOfEnemies) => {
  leafSpawnTimer++;
  enemySpawnTimer++;
  if (
    leafSpawnTimer >= purchases.spawnTime &&
    leafArr.length < purchases.maxLeaves
  ) {
    for (i = 0; i < numOfLeaves; i++) {
      leafArr.push(
        new Leaf(
          Math.random() * (canvas.width - 20),
          Math.random() * (canvas.height - 20)
        )
      );
    }
    leafSpawnTimer = 0;
  }
  if (enemySpawnTimer >= 300) {
    for (i = 0; i < numOfEnemies; i++) {
      let enemyX = Math.random() * (canvas.width - 20);
      let enemyY = Math.random() * (canvas.height - 20);
      let distX = Math.abs(player.x - enemyX);
      let distY = Math.abs(player.y - enemyY);
      let dist = Math.sqrt(distX * distX + distY * distY);
      while(dist < 250) {
        enemyX = Math.random() * (canvas.width - 20);
        enemyY = Math.random() * (canvas.height - 20);
        distX = Math.abs(player.x - enemyX);
        distY = Math.abs(player.y - enemyY);
        dist = Math.sqrt(distX * distX + distY * distY);
      }
      enemyArr.push(
        new Enemy(
          enemyX,
          enemyY
        )
      );
    }
    enemySpawnTimer = 0;
  }
};

let drawScore = () => {
  c.font = "30px Arial";
  c.fillStyle = "white";
  c.textAlign = "left";
  c.fillText("Health: " + player.hp, 10, 30);
  c.fillText("Coins: " + coins, 10, 60);
};

let drawBackground = () => {
  for (i = 0; i < 3000; i += 600) {
    c.drawImage(backgroundImage, i, 0);
    c.drawImage(backgroundImage, i, 600);
    c.drawImage(backgroundImage, i, 1800);
    c.drawImage(backgroundImage, i, 2400);
  }
};

let drawMenu = () => {
  c.fillStyle = "#3a5a40";
  c.fillRect(0, 0, canvas.width, canvas.height);
  c.font = "40px Arial";
  c.fillStyle = "#dad7cd";
  c.textAlign = "center";
  c.fillText("The Incredible Leaf Blower", canvas.width/2, 180);
  c.fillStyle = "#dad7cd";
  c.fillRect(canvas.width / 3.333, 300, canvas.width / 2.5, 200);
  c.font = "30px Arial";
  c.fillStyle = "rgb(43, 40, 38)";
  c.fillText("PLAY", canvas.width / 2, 400);
  c.font = "25px Arial";
  c.fillStyle = "#dad7cd";
  c.textAlign = "center";
  c.fillText("Use the mouse to control your character, blow leaves off of the screen for points, and stay away from the trees.", canvas.width/2, 600);
  c.fillText("Being hit by a tree will make you lose health, but if you blow enough leaves into the trees they will die.", canvas.width/2, 630);
  c.fillText("The coins you earn from blowing leaves can be spent in the shop for upgrades.", canvas.width/2, 660);
  if (deathMenu) {
    c.font = "30px Arial";
    c.fillStyle = "#f5cac3";
    c.fillText(
      "You died! Your final score was: " + score,
      canvas.width / 2,
      230
    );
  }
};

let playerDeath = () => {
  if (player.hp <= 0) {
    player.hp = 100;
    leafArr = [];
    enemyArr = [];
    leafSpawnTimer = 0;
    enemySpawnTimer = 0;
    coins = 0;
    player.hp = 100;
    purchases = {
      blowRadius: 150,
      blowRadiusLevel: 1,
      blowPowerDivider: 5,
      blowPowerDividerLevel: 1,
      spawnTime: 200,
      spawnTimeLevel: 1,
      spawnAmount: 20,
      spawnAmountLevel: 1,
      maxLeaves: 200,
      maxLeavesLevel: 1,
      leafSellPrice: 1,
      leafSellPriceLevel: 1,
    };
    shopOpen = false;
    gameRunning = false;
    deathMenu = true;
  }
};

let drawShop = () => {
  if (!shopOpen) {
    c.drawImage(shopImage, 20, canvas.height - 95, 75, 75);
  } else {
    c.fillStyle = "#e8e8e4";
    c.fillRect(
      canvas.width / 8,
      canvas.height / 8,
      canvas.width * (3 / 4),
      canvas.height * (3 / 4) + (canvas.height * (3 / 4) + 30)/13
    );
    c.fillStyle = "#d8e2dc";
    for (i = 0; i < 6; i++) {
      c.fillRect(
        canvas.width / 8 + 15,
        canvas.height / 8 + ((canvas.height * (3 / 4) + 30)/6) * i + (canvas.height * (3 / 4) + 30)/26,
        canvas.width * (3 / 4) - 30,
        (canvas.height * (3 / 4) + 30)/6 - (canvas.height * (3 / 4) + 30)/26
      );
    }
    c.fillStyle = "#e9c46a";
    for (i = 0; i < 6; i++) {
      c.fillRect(
        canvas.width / 8 + 15 + canvas.width * (3 / 4) - 400,
        canvas.height / 8 + ((canvas.height * (3 / 4) + 30)/6) * i + (canvas.height * (3 / 4) + 30)/26 + 15,
        300,
        ((canvas.height * (3 / 4) + 30)/6 - (canvas.height * (3 / 4) + 30)/26) - 30
      );
    }
    c.fillStyle = "black";
    c.font = ((canvas.width * fontRatio)|0) + "px Arial";
    c.fillText(
      "Farther Reach       Blow Radius: " + purchases.blowRadius,
      canvas.width / 8 + 30,
      canvas.height / 8 + (canvas.height * (3 / 4) + 30)/26 + 60
    );
    c.fillText(
      "Blowing Fuel         Blow Power: " + (10 - purchases.blowPowerDivider),
      canvas.width / 8 + 30,
      canvas.height / 8 + ((canvas.height * (3 / 4) + 30)/6) + (canvas.height * (3 / 4) + 30)/26 + 60
    );
    c.fillText(
      "Fertilizer                 Leaf Spawn Time: " + purchases.spawnTime,
      canvas.width / 8 + 30,
      canvas.height / 8 + ((canvas.height * (3 / 4) + 30)/6) * 2 + (canvas.height * (3 / 4) + 30)/26 + 60
    );
    c.fillText(
      "Trees                      Leaf Spawn Amount: " + purchases.spawnAmount,
      canvas.width / 8 + 30,
      canvas.height / 8 + ((canvas.height * (3 / 4) + 30)/6) * 3 + (canvas.height * (3 / 4) + 30)/26 + 60
    );
    c.fillText(
      "Bigger Field           Maximum Leaves: " + purchases.maxLeaves,
      canvas.width / 8 + 30,
      canvas.height / 8 + ((canvas.height * (3 / 4) + 30)/6) * 4 + (canvas.height * (3 / 4) + 30)/26 + 60
    );
    c.fillText(
      "Leaf Economy        Leaf Sell Price: " + purchases.leafSellPrice,
      canvas.width / 8 + 30,
      canvas.height / 8 + ((canvas.height * (3 / 4) + 30)/6) * 5 + (canvas.height * (3 / 4) + 30)/26 + 60
    );

    c.fillText(
      "Buy: " + purchases.blowRadiusLevel * 10,
      canvas.width / 8 + 30 + canvas.width * (3 / 4) - 400,
      canvas.height / 8 + (canvas.height * (3 / 4) + 30)/26 + 60
    );
    c.fillText(
      purchases.blowPowerDivider == 1
        ? "Upgraded to Max"
        : "Buy: " + purchases.blowPowerDividerLevel * 40,
        canvas.width / 8 + 30 + canvas.width * (3 / 4) - 400,
        canvas.height / 8 + ((canvas.height * (3 / 4) + 30)/6) + (canvas.height * (3 / 4) + 30)/26 + 60
    );
    c.fillText(
      purchases.spawnTime == 50
        ? "Upgraded to Max"
        : "Buy: " + purchases.spawnTimeLevel * 30,
        canvas.width / 8 + 30 + canvas.width * (3 / 4) - 400,
        canvas.height / 8 + ((canvas.height * (3 / 4) + 30)/6) * 2 + (canvas.height * (3 / 4) + 30)/26 + 60
    );
    c.fillText(
      "Buy: " + purchases.spawnAmountLevel * 10,
      canvas.width / 8 + 30 + canvas.width * (3 / 4) - 400,
      canvas.height / 8 + ((canvas.height * (3 / 4) + 30)/6) * 3 + (canvas.height * (3 / 4) + 30)/26 + 60
    );
    c.fillText(
      "Buy: " + purchases.maxLeavesLevel * 10,
      canvas.width / 8 + 30 + canvas.width * (3 / 4) - 400,
      canvas.height / 8 + ((canvas.height * (3 / 4) + 30)/6) * 4 + (canvas.height * (3 / 4) + 30)/26 + 60
    );
    c.fillText(
      "Buy: " + purchases.leafSellPriceLevel * 50,
      canvas.width / 8 + 30 + canvas.width * (3 / 4) - 400,
      canvas.height / 8 + ((canvas.height * (3 / 4) + 30)/6) * 5 + (canvas.height * (3 / 4) + 30)/26 + 60
    );
    c.fillStyle = "salmon";
    c.fillRect(
      canvas.width / 8 + canvas.width * (3 / 4) - 70,
      canvas.height / 8 + 20,
      50,
      50
    );
    c.fillStyle = "black";
    c.font = "50px Arial";
    c.fillText(
      "X",
      canvas.width / 8 + canvas.width * (3 / 4) - 62,
      canvas.height / 8 + 64
    );
  }
};

let heartbeat = () => {
  if (gameRunning) {
    drawBackground();
    leafArr.forEach((leaf) => {
      if(!shopOpen) {
        leaf.update();
        leaf.blow();
      }
      leaf.draw();
    });
    enemyArr.forEach((enemy) => {
      if(!shopOpen) {
        enemy.collision();
        enemy.move();
      }
      enemy.draw();
    });
    if(!shopOpen) {
      player.draw();
      player.heal();
      spawn(purchases.spawnAmount, coins < 100 ? 2 : coins < 300 ? 3 : coins < 800 ? 4 : coins < 3000 ? 5 : 7)
    }
    drawScore();
    playerDeath();
    drawShop();
  } else {
    drawMenu();
  }
  setTimeout(() => {
    requestAnimationFrame(heartbeat);
  }, 1000 / fps);
  
};
heartbeat();
