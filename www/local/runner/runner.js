var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update, render:render });

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
var obstacles;
var bullets;
var enemyPull;
var enemies;
var score;
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

    //The obstacles
    obstacles=game.add.group();
    obstacles.enableBody=true;
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
    //enemies.enableBody=true;
    //enemies.physicsBodyType=Phaser.Physics.ARCADE;
    enemyPull=game.add.group();
    enemyPull.enableBody=true;
    enemyPull.physicsBodyType = Phaser.Physics.ARCADE;
    enemyPull.createMultiple(10, 'metroid');
    enemyPull.setAll('anchor.x', 0.5);
    enemyPull.setAll('anchor.y', 0.5);
    enemyPull.setAll('outOfBoundsKill', true);
    enemyPull.setAll('checkWorldBounds', true);
    score=0;
};

function update() {
    // Flujo del jueo
    //  Collide the player and the stars with the platforms
    score++;
    game.physics.arcade.collide(player.obj, platforms);
    game.physics.arcade.collide(player.obj,obstacles);

    player.update(cursors);
    //updateEnemies();
    game.physics.arcade.overlap(enemyPull,player.obj,enemyHitsPlayer,null,this);
    game.physics.arcade.overlap(enemyPull,bullets,bulletHitEnemy,null,this);
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

function enemyHitsPlayer(plyer,enemy){
    enemy.kill();
    player.hitByEnemy(enemy);
}

function bulletHitEnemy(enemy,bullet){
    enemy.kill();
    bullet.kill();
}

function checkStuffToAppear(){
    var rand=game.rnd.between(0,6);
    if(rand==1){
        if(enemyPull.length>0){
            var enemy = enemyPull.getFirstDead();

            enemy.reset(game.width - 32, game.height - 150);

            enemy.rotation = this.game.physics.arcade.moveToObject(enemy, player.obj, 250)+180;
        }
    }
    else if(rand==2){
        var obstacle=obstacles.getFirstDead();
        obstacle.reset(game.width-32,game.height-64);
        obstacle.body.velocity.x=-150;
        obstacle.body.immovable=true;
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

function render () {

    //game.debug.text('Active Bullets: ' + bullets.countLiving() + ' / ' + bullets.length, 32, 32);
    game.debug.text('Life: ' + player.life , 32, 32);
    game.debug.text('Score: '+score,game.width-150,32);

}