var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload(){
    // Caramos imagenes
    game.load.spritesheet('dude', '../MartinTesting/assets/dude.png', 32, 48);
    game.load.spritesheet('sky', '../images/metroid_sky.png',248,108);
    game.load.spritesheet('ground', '../images/metroid_tiles.png',32,32);
    game.load.spritesheet('samus', '../images/Samus_sprites.png',42,40);
    game.load.image('bullet', '../images/Space%20Lemon.png');
    game.load.image('metroid','../images/Metroid_basic.png')
};

var sky;
var player;
var platforms;
var bullets;
var enemyPull;
var enemies;
//keys
var cursors,space;

function create() {
    //Estalecer cosas iniciales

    //  Resize our game world to be a 2000 x 2000 square
    //game.world.setBounds(0, 0, 800, 600);

    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  A simple background for our game
    sky = game.add.sprite(0, 0,'sky');
    sky.scale.setTo(3,3);
    sky.fixedToCamera = true;

    // Put the platforms
    platforms = game.add.group();
    platforms.enableBody = true;

    for(var i = 0; i < (game.width/32)+1; i++)
    {
        var newPlatform = platforms.create(i*32, game.height-32, 'ground');
        newPlatform.body.immovable=true;
        newPlatform.body.velocity.x=-150;
        newPlatform.frame=4;
    }
    //  Our controls.
    cursors = game.input.keyboard.createCursorKeys();
    space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    // Player
    player=createPlayer();

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
    enemyPull=[];
    //enemies.enableBody=true;
    //enemies.physicsBodyType=Phaser.Physics.ARCADE;
    for(var i=0;i<10;i++) {
        enemyPull.push(CreateEnemy());
    }
};

function update() {
    // Flujo del jueo
    //  Collide the player and the stars with the platforms
    game.physics.arcade.collide(player.obj, platforms);

    player.update(cursors);
    updateEnemies();

    // Move the platforms with the camera
    if(platforms.children[0].x<-32){
        platform=platforms.children.shift();
        platform.x=game.width;
        platforms.addChildAt(platform,platforms.length);
        checkStuffToAppear();
    }
    game.physics.arcade.overlap(bullets,platforms,bulletHitWall,null,this);
};

function bulletHitWall(bullet,platform){
    bullet.kill();
};

function checkStuffToAppear(){
    var rand=game.rnd.between(0,4);
    if(rand==1){
        if(enemyPull.length>0){
            enemies.push(enemyPull.pop());
            enemies[0].reset();
        }
    }
};

function updateEnemies(){
    for(var i=0;i<enemies.length;i++){
        enemies[i].update();
    }
};

function resetGame(){
    bullets.setAll('exists',false);
}