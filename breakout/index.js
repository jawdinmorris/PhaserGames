playerScore = 0;
ballVelocity = 112;
playerVelocity = 112;

lives = 3;

gameOver = false;

var config = {
    type: Phaser.AUTO,
    width: 512,
    height: 512,
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

function hitPaddle() {
    console.log("Ping");
}

function hitBrick(ball, brick) {
    console.log("Break");
    brick.disableBody(true, true);
    playerScore += 10;
    playerScoreText.setText("score: " + playerScore);
    if (bricks.countActive() == 0) {
        isGameOver();
    }
}

function isGameOver() {
    if (gameOver == false) {
        gameOver = true;
        ballVelocity = 0;
        ball.setVelocityY(ballVelocity);
        ball.setVelocityX(ballVelocity);
        if (bricks.countActive() == 0) {
            playerScoreText.setText(playerScoreText.text + " You Win!");
        } else {
            playerScoreText.setText(playerScoreText.text + " Game Over");
        }
    }
}

function create() {
    //player setup
    this.add.image(0, 0, 'background').setOrigin(0, 0);
    player = this.physics.add.sprite(256, 492, 'paddle').setScale(2);
    player.setOrigin(0.5, 0);
    player.body.immovable = true;
    player.setCollideWorldBounds(true);

    //score
    playerScoreText = this.add.text(32, 16, 'score: 0', { fontSize: '16px', fill: '#FFF' });

    //player movement
    cursors = this.input.keyboard.createCursorKeys();

    //ball
    ball = this.physics.add.sprite(256, 487, 'ball').setOrigin(0, 3).setScale(2);
    ball.setCollideWorldBounds(true);
    ball.enableBody = true;
    this.physics.add.collider(ball, player, hitPaddle, null, this);
    ball.setBounce(1);
    ball.body.maxVelocity.x = 500;
    ball.body.maxVelocity.y = 500;


    //Ball movement
    ball.x = 256;
    ball.y = 487;
    ball.body.velocity.x = 0;
    ball.body.velocity.y = 0;

    if (ball.body.velocity.x == 0 && ball.body.velocity.y == 0) {
        ball.setVelocityY(ballVelocity);
        ball.setVelocityX(ballVelocity);
    }

    //Platforms (Level 1)
    bricks = this.physics.add.group();
    bricks.createMultiple({ key: 'brick', repeat: 6, setXY: { x: 45, y: 50, stepX: 70 }, setScale: { x: 2, y: 2, stepX: 0, stepY: 0 } });
    bricks.createMultiple({ key: 'brick', repeat: 6, setXY: { x: 45, y: 50 + 28, stepX: 70 }, setScale: { x: 2, y: 2, stepX: 0, stepY: 0 } });
    bricks.createMultiple({ key: 'brick', repeat: 6, setXY: { x: 45, y: 50 + 56, stepX: 70 }, setScale: { x: 2, y: 2, stepX: 0, stepY: 0 } });
    console.log(bricks.countActive());
    bricks.children.iterate(function (child) {
        child.enableBody = true;
        child.body.immovable = true;
    });

    this.physics.add.collider(ball, bricks, hitBrick, null, this);
}
function update() {
    //Player movement
    if (gameOver == false) {
        if (cursors.right.isDown) {
            player.body.setVelocityX(playerVelocity);
        } else if (cursors.left.isDown) {
            player.body.setVelocityX(-playerVelocity);
        } else {
            player.body.setVelocityX(0);
        }
    }
    //Death detect
    if (ball.y > 512) {
        isGameOver();
    }

}


