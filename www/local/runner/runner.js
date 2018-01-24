var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, '', { preload: preload, create: create, update: update, render:render });

function preload(){
    // Cargamos imagenes
    game.load.spritesheet('sky', '../images/background2.png',256,160);
    game.load.spritesheet('ground', '../images/metroid_tiles.png',32,32);
    game.load.spritesheet('samus', '../images/Samus_sprites.png',42,40);
    game.load.spritesheet('bullet', '../images/metroid_attacks.png',32,8);
    game.load.spritesheet('metroids', '../images/metroid_extended.png', 40, 32);
    game.load.spritesheet('button', '../images/button.png', 330, 130);
    game.load.spritesheet('ridley', '../images/Ridley_sprites.png', 270, 224);
    game.load.spritesheet('fireBall', '../images/metroid_fireball.png', 24, 24);
    game.load.spritesheet('explosion', '../images/metroid_explosion.png', 32, 32);

    // Cargamos audios
        //Musica
    game.load.audio('menu', '../sounds/MenuMusic.mp3');
    game.load.audio('escape', '../sounds/EscapeMusic.mp3');
    game.load.audio('victory', '../sounds/GameMusic.mp3');
        //Ridley
    game.load.audio('Ridley1', '../sounds/RidleyScream(1).mp3');
    game.load.audio('Ridley2', '../sounds/RidleyScream(2).mp3');
    game.load.audio('Ridley3', '../sounds/RidleyScream(3).mp3');
    game.load.audio('Ridley4', '../sounds/RidleyScream(4).mp3');
    game.load.audio('Ridley5', '../sounds/RidleyScream(5).mp3');
    game.load.audio('Ridley6', '../sounds/RidleyScream(6).mp3');
    game.load.audio('Ridley7', '../sounds/RidleyScream(7).mp3');
        //Otros efectos
    game.load.audio('blaster', '../sounds/blaster.mp3');
    game.load.audio('explosion', '../sounds/explosion.mp3');

};
// Objects
var sky;
var player;
var platforms;
var obstacles;
var bullets;
var enemyPull;
//var enemies;
var explosions;
var fireballs;
var boss;

// Score
var currScore = 0;
var totalScore = 10000;     //Revisar

//keys
var cursors,space,wasd;
var inMenu = false;

//buttons
var buttons = [];

//the text of the buttons
var titleText1, titleText2, victoryText1;
var textButton1,textButton2,textButton3,textButton4,textButton5;

//style for buttons
var titleStyle = { font: "72px 'Geostar Fill'", align: "center", fill: "white"};
var resumeStyle = { font: "36px Arial", align: "center"};
var upgradeStyle = { font: "24px Arial", align: "center"};

//variables for the upgrades
var lifeUpCost = 100;
var jumpUpCost = 50;
var maneuverabilityCost = 100;
var damageCost = 100;
var nextUpgrade = 3;

//game speed
var gameSpeed = 300;
var bgSpeed = 0.5;
var enemySpeed = gameSpeed*1.5;
//the size of the next hole
var holeLength=0;

// Timer/s
var testTimer;
var counter;

var music;

var victory = false;

function create() {
    //Estalecer cosas iniciales

    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  A simple background for our game
    sky = game.add.tileSprite(0, 0,1200,600,'sky');
    sky.scale.setTo(4,4);

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

    //The obstacles
    obstacles = game.add.group();
    obstacles.enableBody = true;
    obstacles.createMultiple(20,'ground',0,false);
    obstacles.setAll('anchor.x', 0.5);
    obstacles.setAll('anchor.y', 0.5);
    obstacles.setAll('outOfBoundsKill', true);
    obstacles.setAll('body.inmovable', true);
    obstacles.setAll('checkWorldBounds', true);


    //  Our controls.
    cursors = game.input.keyboard.createCursorKeys();
    space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    wasd = game.input.keyboard.addKeys( { 'up': Phaser.KeyCode.W, 'down': Phaser.KeyCode.S, 'left': Phaser.KeyCode.A, 'right': Phaser.KeyCode.D } );
    // Player
    player = createPlayer();

    //  Our bullet group
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.createMultiple(30, 'bullet', 0, false);
    bullets.setAll('anchor.y', 0.5);
    bullets.setAll('outOfBoundsKill', true);
    bullets.setAll('checkWorldBounds', true);

    //create the enemy pull
    enemyPull = game.add.group();
    enemyPull.enableBody = true;
    enemyPull.physicsBodyType = Phaser.Physics.ARCADE;
    enemyPull.createMultiple(10, 'metroids', 0);
    enemyPull.setAll('anchor.x', 0.5);
    enemyPull.setAll('anchor.y', 0.5);
    enemyPull.setAll('outOfBoundsKill', true);
    enemyPull.setAll('checkWorldBounds', true);
    currScore = 0;

    // Explosions
    explosions = game.add.group();
    explosions.enableBody = true;
    explosions.physicsBodyType = Phaser.Physics.ARCADE;
    explosions.createMultiple(50, 'explosion', 0);
    explosions.setAll('anchor.x', 0.5);
    explosions.setAll('anchor.y', 0.5);


    //Ridley
    boss = createBoss();

    //  Fireballs
    fireballs = game.add.group();
    fireballs.enableBody = true;
    fireballs.physicsBodyType = Phaser.Physics.ARCADE;
    fireballs.createMultiple(30, 'fireBall', 0, false);
    fireballs.setAll('anchor.y', 0.5);
    fireballs.setAll('outOfBoundsKill', true);
    fireballs.setAll('checkWorldBounds', true);
    //fireballs.setAll('scale', true);


    //
    //testTimer = new Timer(game);
    counter = 0;
    reset();
};

function update() {

    //move the sky
    sky.tilePosition.x-=bgSpeed;

    if(!inMenu) {
        // Flujo del jueo
        //  Collide the player and with the platforms
        //currScore++;
        game.physics.arcade.collide(player.obj, platforms);
        game.physics.arcade.collide(player.obj, obstacles);

        player.update(cursors);
        boss.update();

        //Check overlaps between enemies, player and bullets
        game.physics.arcade.overlap(enemyPull, player.obj, enemyHitsPlayer, null, this);
        game.physics.arcade.overlap(enemyPull, bullets, bulletHitEnemy, null, this);
        
        checkStuffToAppear();

        game.physics.arcade.overlap(bullets, platforms, bulletHitWall, null, this);
        game.physics.arcade.overlap(bullets, obstacles, bulletHitWall, null, this);

        // Boss ones
        game.physics.arcade.overlap(boss.obj, bullets, bulletHitBoss, null, this);
        game.physics.arcade.overlap(fireballs, obstacles, bulletHitWall, null, this);
        game.physics.arcade.overlap(fireballs, player.obj, enemyHitsPlayer, null, this);

        //
        var expX = game.rnd.between(0, 100);
        var expY = game.rnd.between(0, game.height - 32);
        createExplosion(expX, expY);

        //
        counter ++;
    }
    else if(victory){
        var expX = game.rnd.between(boss.obj.x - 100, boss.obj.x + 100);
        var expY = game.rnd.between(boss.obj.y - 100, boss.obj.y + 100);
        createExplosion(expX, expY);
    }
};

function render () {

    //game.debug.text('Active Bullets: ' + bullets.countLiving() + ' / ' + bullets.length, 32, 32);
    game.debug.text(player.life , 32, 32);
    game.debug.text(counter , 32, 64);
    game.debug.text('Total Score: '+ totalScore,game.width-200,32);
    game.debug.text('Score: '+ currScore,game.width-200,64);
    for(var i = 0; i < player.lifeTanksLeft; i++){
        game.debug.geom(player.tanks[i],'#00ff00');
    }
    for(var i = player.lifeTanksLeft; i < player.tanks.length;i++){
        game.debug.geom(player.tanks[i],'#333333');
    }

}

// Put all the stuff in their place
function reset(){
    if(victory){
        // Music
        if(music) {
            music.stop();
        }
        music = game.add.audio('victory');
        music.loop=true;
        music.play();

        // Victory text
        titleText1 = game.add.text(game.width/2 - 200, 100, "VICTORY", titleStyle);
    }
    else if(inMenu) {//if you were in the menu

        // Music
        if(music) {
            music.stop();
        }
        music = game.add.audio('escape');
        music.loop=true;
        music.volume = 0.2;
        music.play();

        for(var i = 0;i < buttons.length; i++) {
            buttons[i].pendingDestroy = true;
        }

        //
        counter = 0;

        //
        resetPlatforms();
    }
    else{
        // Music
        if(music) {
            music.stop();
        }
        music = game.add.audio('menu');
        music.loop=true;
        music.play();

        //clean screen
        obstacles.callAll('kill');
        enemyPull.callAll('kill');
        platforms.callAll('kill');
        bullets.callAll('kill');
        fireballs.callAll('kill');
        player.resetLife();
        player.obj.exists = false;
        boss.resetBoss();
        //update score
        totalScore += currScore;
        currScore = 0;

        // Title
        titleText1 = game.add.text(game.width/2 - 200, 100, "HURRY UP", titleStyle);
        titleText2 = game.add.text(game.width/2 - 200, 200, "SAMUS", titleStyle);

        //button1
        button1 = game.add.button(game.world.centerX - 95, game.world.centerY+50, 'button', actionStartGame, this, 2, 1, 0);
        buttons.push(button1)
        button1.scale.setTo(0.5,0.5)
        textButton1 = game.add.text(0, 0, "Resume", resumeStyle);
        addTextToButton(textButton1,button1);

        //button2 (helath)
        button2 = game.add.button(game.world.centerX - 195, game.world.centerY-50, 'button', actionUpgradeHealth, this, 2, 1, 0);
        buttons.push(button2)
        button2.scale.setTo(0.5,0.5)
        textButton2 = game.add.text(0, 0, "Increase life\ncost: " + lifeUpCost, upgradeStyle);
        addTextToButton(textButton2,button2);

        //button3 (jump)
        button3 = game.add.button(game.world.centerX +5, game.world.centerY-50, 'button', actionUpgradeJump, this, 2, 1, 0);
        buttons.push(button3)
        button3.scale.setTo(0.5,0.5)
        textButton3 = game.add.text(0, 0, "Higher jump\ncost: " + jumpUpCost, upgradeStyle);
        addTextToButton(textButton3,button3);

        //button4 (maneuverability)
        button4 = game.add.button(game.world.centerX - 395, game.world.centerY-50, 'button', actionUpgradeManeuverability, this, 2, 1, 0);
        buttons.push(button4)
        button4.scale.setTo(0.5,0.5)
        textButton4 = game.add.text(0, 0, "Better maneuverability\ncost: " + maneuverabilityCost, upgradeStyle);
        addTextToButton(textButton4,button4);

        //button5 (damage)
        button5 = game.add.button(game.world.centerX + 200, game.world.centerY-50, 'button', actionUpgradeDamage, this, 2, 1, 0);
        buttons.push(button5);
        button5.scale.setTo(0.5,0.5);
        if(player.damage==3){
            textButton5 = game.add.text(0, 0, "Damaged maxed", upgradeStyle)
        }
        else{
            textButton5 = game.add.text(0, 0, "Increase damage \ncost: " + damageCost, upgradeStyle);
        }
        addTextToButton(textButton5,button5);
    }
    inMenu = !inMenu;
};
