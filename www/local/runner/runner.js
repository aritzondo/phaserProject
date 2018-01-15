var game = new Phaser.Game(1200, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update, render:render });

function preload(){
    // Caramos imagenes
    game.load.spritesheet('sky', '../images/background2.png',248,108);
    game.load.spritesheet('ground', '../images/metroid_tiles.png',32,32);
    game.load.spritesheet('samus', '../images/Samus_sprites.png',42,40);
    game.load.image('bullet', '../images/Space%20Lemon.png');
    game.load.image('metroid','../images/Metroid_basic.png')
    game.load.spritesheet('button', '../images/button.png', 330, 130);
};
// Objects
var sky;
var player;
var platforms;
var obstacles;
var bullets;
var enemyPull;
var enemies;
// Score
var currScore = 0;
var totalScore = 0;
//keys
var cursors,space;
var inMenu = false;
//buttons
var buttons = [];
//text for button
var textButton1,textButton2,textButton3;
//functions for buttons
var functionButtons = [];
//style for buttons
var resumeStyle = { font: "36px Arial", align: "center"};
var upgradeStyle = { font: "24px Arial", align: "center"};
//variables for the upgrades
var lifeUpCost = 100;
var jumpUpCost = 50;
var nextUpgrade = 3;

//game speed
var gameSpeed = 300;
var bgSpeed = 0.5;

// Timer/s
var testTimer;
var counter;

function create() {
    //Estalecer cosas iniciales

    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  A simple background for our game
    sky = game.add.tileSprite(0, 0,1200,600,'sky');
    sky.scale.setTo(5,5);

    // Put the platforms
    platforms = game.add.group();
    platforms.enableBody = true;
    platforms.createMultiple((game.width/32)+1, 'ground', 0, false);
    platforms.setAll('anchor.x', 0.5);
    platforms.setAll('anchor.y', 0.5);
    platforms.setAll('outOfBoundsKill', true);
    platforms.setAll('body.inmovable', true);
    //platforms.setAll('body.velocity.x', -gameSpeed);
    platforms.setAll('checkWorldBounds', true);

    /*for(var i = 0; i < (game.width/32)+1; i++)
    {
        var newPlatform = platforms.create(i*32, game.height-32, 'ground');
        newPlatform.body.immovable=true;
        newPlatform.body.velocity.x=-gameSpeed;
        newPlatform.frame=4;
    }*/

    //The obstacles
    obstacles = game.add.group();
    obstacles.enableBody = true;
    obstacles.createMultiple(10,'ground',0,false);
    obstacles.setAll('anchor.x', 0.5);
    obstacles.setAll('anchor.y', 0.5);
    obstacles.setAll('outOfBoundsKill', true);
    obstacles.setAll('body.inmovable', true);
    obstacles.setAll('checkWorldBounds', true);


    //  Our controls.
    cursors = game.input.keyboard.createCursorKeys();
    space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    // Player
    player = createPlayer();

    //  Our bullet group
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.createMultiple(30, 'bullet', 0, false);
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 0.5);
    bullets.setAll('outOfBoundsKill', true);
    bullets.setAll('checkWorldBounds', true);

    //create one enemy
    enemies = [];
    enemyPull = game.add.group();
    enemyPull.enableBody = true;
    enemyPull.physicsBodyType = Phaser.Physics.ARCADE;
    enemyPull.createMultiple(10, 'metroid');
    enemyPull.setAll('anchor.x', 0.5);
    enemyPull.setAll('anchor.y', 0.5);
    enemyPull.setAll('outOfBoundsKill', true);
    enemyPull.setAll('checkWorldBounds', true);
    currScore=0;

    // put the functions on the array for the buttons
    functionButtons[0] = actionOnClick1;
    functionButtons[1] = actionOnClick2;
    functionButtons[2] = actionOnClick3;

    //
    //testTimer = new Timer(game);
    counter = 0;
    reset();
};

function update() {
    if(!inMenu) {
        // Flujo del jueo
        //  Collide the player and the stars with the platforms
        currScore++;
        game.physics.arcade.collide(player.obj, platforms);
        game.physics.arcade.collide(player.obj, obstacles);

        player.update(cursors);

        //Check overlaps between enemies, player and bullets
        game.physics.arcade.overlap(enemyPull, player.obj, enemyHitsPlayer, null, this);
        game.physics.arcade.overlap(enemyPull, bullets, bulletHitEnemy, null, this);

        // Move the platforms with the camera
        /*if (platforms.children[0].x < -32) {
            platforms.children.shift();
        }*/
        if(counter % 6 == 0){
            var rand = game.rnd.between(0,20);
            if(rand > 1) {
                newPlatform(game.width);
            }
            checkStuffToAppear();
        }
        game.physics.arcade.overlap(bullets, platforms, bulletHitWall, null, this);
        game.physics.arcade.overlap(bullets, obstacles, bulletHitWall, null, this);

        //move the sky
        sky.tilePosition.x-=bgSpeed;

        //
        counter ++;
    }
    else{
        //stuff to do on the menu
    }
};

function render () {

    //game.debug.text('Active Bullets: ' + bullets.countLiving() + ' / ' + bullets.length, 32, 32);
    game.debug.text(player.life , 32, 32);
    game.debug.text(counter , 32, 64);
    game.debug.text('Total Score: '+ totalScore,game.width-200,32);
    game.debug.text('Score: '+ currScore,game.width-200,64);
    for(var i=0;i<player.lifeTanksLeft;i++){
        game.debug.geom(player.tanks[i],'#00ff00');
    }
    for(var i=player.lifeTanksLeft;i<player.tanks.length;i++){
        game.debug.geom(player.tanks[i],'#333333');
    }

}

// Put all the stuff in their place
function reset(){
    if(inMenu) {//if you were in the menu
        for(var i = 0;i < buttons.length; i++) {
            buttons[i].pendingDestroy = true;
        }

        //
        counter = 0;

        //
        resetPlatforms();
    }
    else{
        //clean screen
        obstacles.callAll('kill');
        enemyPull.callAll('kill');
        platforms.callAll('kill');
        bullets.callAll('kill');
        player.resetLife();
        player.obj.exists=false;
        //update score
        totalScore += currScore;
        currScore = 0;
        //button1
        button1 = game.add.button(game.world.centerX - 95, game.world.centerY+50, 'button', actionOnClick1, this, 2, 1, 0);
        buttons.push(button1)
        button1.scale.setTo(0.5,0.5)
        textButton1 = game.add.text(0, 0, "Resume", resumeStyle);
        addTextToButton(textButton1,button1);
        //button2
        button2 = game.add.button(game.world.centerX - 195, game.world.centerY-50, 'button', actionOnClick2, this, 2, 1, 0);
        buttons.push(button2)
        button2.scale.setTo(0.5,0.5)
        textButton2 = game.add.text(0, 0, "Increase life\ncost: " + lifeUpCost, upgradeStyle);
        addTextToButton(textButton2,button2);
        //button3
        button3 = game.add.button(game.world.centerX +5, game.world.centerY-50, 'button', actionOnClick3, this, 2, 1, 0);
        buttons.push(button3)
        button3.scale.setTo(0.5,0.5)
        textButton3 = game.add.text(0, 0, "Higher jump\ncost: " + jumpUpCost, upgradeStyle);
        addTextToButton(textButton3,button3);
    }
    inMenu = !inMenu;
};
