playerOneScore = 0;
playerTwoScore = 0;
var cheering;
var paddleHit;

var config = {
    type: Phaser.AUTO,
    width: 512,
    height: 256,
    physics: {
        default: 'arcade',
        arcade: {
            // gravity: { y: 300 },
            checkCollision: {
                up: true,
                down: true,
                left: false,
                right: false
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
    this.load.image('paddle', 'assets/paddle.png');
    this.load.image('ball', 'assets/ball.png');
    this.load.image('background', 'assets/background.png');
    this.load.audio('paddleHit', 'assets/paddleHit.mp3');
    this.load.audio('cheering', 'assets/cheering.mp3');
}

function create() {
    //background
    this.add.image(0, 0, 'background').setOrigin(0, 0);

    //player creation
    playerOne = this.physics.add.sprite(20, 123, 'paddle').setScale(2);
    playerOne.setCollideWorldBounds(true);
    playerOne.enableBody = true;
    playerOne.body.immovable = true;
    playerOneScoreText = this.add.text(32, 16, 'score: 0', { fontSize: '32px', fill: '#FFF' });

    playerTwo = this.physics.add.sprite(492, 123, 'paddle').setScale(2);
    playerTwo.setCollideWorldBounds(true);
    playerTwo.enableBody = true;
    playerTwo.body.immovable = true;
    playerTwoScoreText = this.add.text(326, 16, 'score: 0', { fontSize: '32px', fill: '#FFF' });

    //ball creation
    ball = this.physics.add.sprite(256, 123, 'ball').setOrigin(0, 3);
    ball.setCollideWorldBounds(true);
    ball.enableBody = true;
    this.physics.add.collider(ball, playerOne, hitPaddle, null, this);
    this.physics.add.collider(ball, playerTwo, hitPaddle, null, this);
    ball.setBounce(1);
    ball.body.maxVelocity.x = 500;
    ball.body.maxVelocity.y = 500;

    //controls setup
    cursors = this.input.keyboard.createCursorKeys();
    wKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    sKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);

    //Audio setup
    cheering = this.sound.add('cheering');
    paddleHit = this.sound.add('paddleHit');
    //Start the round
    gameOverText = this.add.text(256, 132, '', { fontSize: '32px', fill: '#FFF' }).setOrigin(0.5, 0.5);

    startRound();
}

function hitPaddle() {
    console.log('ping');
    paddleHit.play();
}
function startRound() {
    //Ball movement
    ball.x = 256;
    ball.y = 123;
    ball.body.velocity.x = 0;
    ball.body.velocity.y = 0;
    if (playerOneScore == 10 || playerTwoScore == 10) {
        gameOverText.setText("Game Over");
        cheering.play();

    }
    else if (ball.body.velocity.x == 0 && ball.body.velocity.y == 0) {
        ball.setVelocityY(56);
        ball.setVelocityX(56);
    }
}

function update() {
    //Left Player
    if (wKey.isDown) {
        playerOne.setVelocityY(-28);
    }
    else if (sKey.isDown) {
        playerOne.setVelocityY(28);
    } else {
        playerOne.setVelocityY(0);
    }

    //Right Player
    if (cursors.up.isDown) {
        playerTwo.setVelocityY(-28);
    }
    else if (cursors.down.isDown) {
        playerTwo.setVelocityY(28);
    } else {
        playerTwo.setVelocityY(0);
    }

    // Point Scoring
    if (ball.x > playerTwo.x + 5) {
        console.log("Ball off right hand side of screen");
        playerOneScore += 1;
        playerOneScoreText.setText('score: ' + playerOneScore);
        startRound();
    }
    if (ball.x < playerOne.x - 5) {
        console.log("Ball off left hand side of screen");
        playerTwoScore += 1;
        playerTwoScoreText.setText('score: ' + playerTwoScore);
        startRound();
    }

}