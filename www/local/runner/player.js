function createPlayer(){
    var player={
        fireRate:100,
        nextFire:game.time.now,
        isShooting:false,
        obj:0,
        init: function(){
            // Player
            this.obj = game.add.sprite(32, game.world.height - 150, 'samus');
            game.physics.arcade.enable(this.obj);
            //Physics
            this.obj.body.bounce.y = 0;
            this.obj.body.gravity.y = 300;
            this.obj.body.collideWorldBounds = true;
            //Animations
            //this.obj.animations.add('right', [5, 6, 7, 8], 10, true);
                //That one 'works' with 41, 50
            //this.obj.animations.add('right', [140, 141, 142, 143, 144, 145, 146, 147, 148, 149], 20, true);
                //That one 'works' with 42, 49
            this.obj.animations.add('right', [0,1,2,3,4,5,6,7,8,9], 20, true);
            this.obj.animations.add('jumping', [10,11,12,13,14,15,16,17], 20, true);
            this.obj.animations.add('shooting', [20,21,22,23,24,25,26,27,28,29], 20, true);
            //Camera anchor
            this.obj.anchor.setTo(0.5, 0.5);
            this.obj.scale.set(2,2);

        },
        update: function(cursors){
            if(space.isDown&&this.obj.body.touching.down){
                this.isShooting=true;
            }
            else{
                this.isShooting=false;
            }
             //  Set the players velocity (movement)
            if(!this.isShooting){
                if(this.obj.body.touching.down) {
                    this.obj.animations.play('right');
                }
                else{
                    this.obj.animations.play('jumping');
                }
            }
            else{
                this.obj.animations.play('shooting');
            }
            //if you are in the ground
            if(this.obj.body.touching.down) {
                //if you press space(fire)
                if (space.isDown) {
                    this.fire();
                }
                //if you press up(jump)
                else if (cursors.up.isDown) {
                    this.obj.body.velocity.y = -300;
                    this.isShooting=false;
                }
                else {
                    this.obj.body.velocity.x = 150;
                }
            }
            else {
                this.obj.body.velocity.x = 0;
            }
        },
        fire:function(){
            this.isShooting=true;
            if (game.time.now > this.nextFire&& bullets.countDead() > 0)
            {
                this.nextFire = game.time.now + this.fireRate;

                var bullet = bullets.getFirstExists(false);

                bullet.reset(this.obj.x, this.obj.y);
                bullet.rotation = game.physics.arcade.moveToPointer(bullet, 1000, game.input.activePointer, 500);
            }
        }
    }
    player.init();
    return player;
}

/*

Player = function (game){
    var x;
    var y;
    this.game=game;
    this.alive=true;
    game.add.sprite(32, game.world.height - 150, 'samus');
    game.physics.arcade.enable(this);
    //Physics
    this.body.bounce.y = 0;
    this.body.gravity.y = 300;
    this.body.collideWorldBounds = true;
    //Animations
    //this.obj.animations.add('right', [5, 6, 7, 8], 10, true);
    //That one 'works' with 41, 50
    //this.obj.animations.add('right', [140, 141, 142, 143, 144, 145, 146, 147, 148, 149], 20, true);
    //That one 'works' with 42, 49
    this.animations.add('right', [126,127,128, 129, 130, 131, 132, 133, 134], 10, true);
    this.animations.add('jumping', [217, 218, 219, 220, 221, 222, 223, 224], 20, true);
    //Camera anchor
    this.anchor.setTo(0.5, 0.5);


}
Player.prototype.update=function(){
    //  Set the players velocity (movement)
    if(this.body.touching.down) {
        this.animations.play('right');
    }
    else{
        this.animations.play('jumping');
    }

    //  Allow the player to jump if they are touching the ground
    if (cursors.up.isDown && this.obj.body.touching.down)
    {
        this.body.velocity.y = -300;
    }
    if(this.body.touching.down){
        this.body.velocity.x=150;
    }
    else{
        this.body.velocity.x=0;
    }
}
 */