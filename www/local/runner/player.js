function createPlayer(){
    var player={
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
            this.obj.animations.add('right', [126,127,128, 129, 130, 131, 132, 133, 134], 10, true);
            this.obj.animations.add('jumping', [217, 218, 219, 220, 221, 222, 223, 224], 20, true);
            //Camera anchor
            this.obj.anchor.setTo(0.5, 0.5);

        },
        update: function(cursors){
             //  Set the players velocity (movement)
            if(this.obj.body.touching.down) {
                this.obj.animations.play('right');
            }
            else{
                this.obj.animations.play('jumping');
            }
            //if you are in the ground
            if(this.obj.body.touching.down) {
                //if you press space(fire)
                if (cursors.space.isDown) {

                }
                //if you press up(jump)
                else if (cursors.up.isDown) {
                    this.obj.body.velocity.y = -300;
                }
                else {
                    this.obj.body.velocity.x = 150;
                }
            }
            else {
                this.obj.body.velocity.x = 0;
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