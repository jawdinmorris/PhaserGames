playerScore = 0;
ballVelocity = 200;
playerVelocity = 600;
scoreMultiplier = 1;
lives = 3;
gameOver = false;


scaleRatio = window.devicePixelRatio / 3;

var config = {
    type: Phaser.AUTO,
    width: window.innerWidth * window.devicePixelRatio,
    height: window.innerHeight * window.devicePixelRatio,
    physics: {
        default: 'arcade',
        arcade: {
            // gravity: { y: 300 },
            checkCollision: {
                up: true,
                down: false,
                left: true,
                right: true
            },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};
var game = new Phaser.Game(config);

function preload() {
    this.load.image('background', 'assets/background.png');
    this.load.image('paddle', 'assets/paddle.png');
    this.load.image('ball', 'assets/ball.png');
    this.load.image('brick', 'assets/paddle.png')

}
function roundStart() {
    ball.x = game.config.width/2;
    ball.y = game.config.height*.6;
    ballVelocity = 256
    ball.setVelocityY(-ballVelocity);
    ballVelocity = Phaser.Math.Between(-256, 256);
    ball.setVelocityX(ballVelocity);
}
function hitPaddle() {
    scoreMultiplier = 1;
    playerScoreText.setText("score: " + playerScore + "   x" + scoreMultiplier);
    console.log("Ping");
}

function hitBrick(ball, brick) {
    //DELETE BRICKS
    brick.disableBody(true, true);
    //SCORE
    playerScore += (10 * scoreMultiplier);
    console.log(10 * scoreMultiplier);
    scoreMultiplier += 1;
    playerScoreText.setText("score: " + playerScore + "   x" + scoreMultiplier);
    //CHECK FOR WIN
    if (bricks.countActive() == 0) {
        isGameOver();
    }
}

function isGameOver() {
    if (gameOver == false) {
        //UPDATE LOST LIFE AND RESET MULTIPLIER
        lives -= 1;
        scoreMultiplier = 1;
        ballVelocity = 0;
        ball.setVelocityY(ballVelocity);
        ball.setVelocityX(ballVelocity);
        playerLifeText.setText("lives: " + lives);
        playerScoreText.setText("score: " + playerScore + "   x" + scoreMultiplier);
        //SEE IF WON OR LOST
        if (bricks.countActive() == 0) {
            playerScoreText.setText(playerScoreText.text + " You Win!");
        } else if (lives == 0) {
            playerScoreText.setText(playerScoreText.text + " Game Over");
            gameOver = true;
        } else {
            roundStart();
        }
    }
}

function create() {
    //PLAYER SETUP
    this.add.image(0, 0, 'background').setOrigin(0, 0);
    player = this.physics.add.sprite(game.config.width/2, game.config.height*.85, 'paddle').setScale(scaleRatio, scaleRatio);
    player.setInteractive();
    player.setOrigin(0.5, 0);
    player.body.immovable = true;
    player.setCollideWorldBounds(true);

    //TEXT
    playerScoreText = this.add.text(game.config.width*.1, 16, 'score: 0   x1', { fontSize: '16px', fill: '#FFF' });
    playerLifeText = this.add.text(game.config.width*.6, 16, 'lives: 3', { fontSize: '16px', fill: '#FFF' });

    //BALL SETUP
    ball = this.physics.add.sprite(game.config.width/2, game.config.height*.6, 'ball').setOrigin(0, 3).setScale(scaleRatio, scaleRatio).setCircle(3);
    ball.setCollideWorldBounds(true);
    ball.enableBody = true;
    this.physics.add.collider(ball, player, hitPaddle, null, this);
    ball.setBounce(1);
    ball.body.maxVelocity.x = 300;
    ball.body.maxVelocity.y = 300;
    ball.setAcceleration(20, 20);

    //Platforms (Level 1) - SEPERATE THIS??
    bricks = this.physics.add.group();
    bricks.createMultiple({ key: 'brick', repeat: 6, setXY: { x: 45, y: 50, stepX: 70 }, setScale: { x: scaleRatio, y: scaleRatio, stepX: 0, stepY: 0 } });
    bricks.createMultiple({ key: 'brick', repeat: 6, setXY: { x: 45, y: 50 + 28, stepX: 70 }, setScale: { x: scaleRatio, y: scaleRatio, stepX: 0, stepY: 0 } });
    bricks.createMultiple({ key: 'brick', repeat: 6, setXY: { x: 45, y: 50 + 56, stepX: 70 }, setScale: { x: scaleRatio, y: scaleRatio, stepX: 0, stepY: 0 } });
    console.log(bricks.countActive());
    bricks.children.iterate(function (child) {
        child.enableBody = true;
        child.body.immovable = true;
    });
    this.physics.add.collider(ball, bricks, hitBrick, null, this);
    
    //START GAME
    roundStart();
}

function update() {
    //PLAYER MOVEMENT
    if (gameOver == false) {
        if ((this.input.mousePointer.x > player.x - 7) && (this.input.mousePointer.x < player.x + 7)) {
            player.setVelocityX(0);
            player.setVelocityY(0);
        } else {
            this.physics.moveTo(player, this.input.mousePointer.x, game.config.height*.85, 512, null)
        }
        //DEATH DETECT
        if (ball.y > game.config.height *1.1) {
            isGameOver();
        }
    }
}
