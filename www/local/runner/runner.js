var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload(){
    // Caramos imagenes
    game.load.spritesheet('dude', '../MartinTesting/assets/dude.png', 32, 48);
    game.load.spritesheet('sky', '../images/metroid_sky.png',248,108);
    game.load.spritesheet('ground', '../images/metroid_tiles.png',32,32);
    game.load.spritesheet('samus', '../images/metroid_samus.png',42,49);
};

var sky;
var player;
var platforms;
var platformData = [
    [0, 568], [300, 468], [600, 368],
];

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


    // Player
    player=createPlayer();
    //  Our controls.
    cursors = game.input.keyboard.createCursorKeys();
    //space = game.input.keyboard.addKey(space);
};

function update() {
    // Flujo del jueo
    //  Collide the player and the stars with the platforms
    game.physics.arcade.collide(player.obj, platforms);

    player.update(cursors);

    // Move the platforms with the camera
    if(platforms.children[0].x<-32){
        platform=platforms.children.shift();
        platform.x=game.width;
        platforms.addChildAt(platform,platforms.length);
    }

};