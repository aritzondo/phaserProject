function createPlayer(){
    var player={
        obj:0,
        init: function(){
            // Player
            this.obj = game.add.sprite(32, game.world.height - 150, 'dude');
            game.physics.arcade.enable(this.obj);
            //Physics
            this.obj.body.bounce.y = 0;
            this.obj.body.gravity.y = 300;
            this.obj.body.collideWorldBounds = true;
            //Animations
            this.obj.animations.add('right', [5, 6, 7, 8], 10, true);
            //Camera anchor
            this.obj.anchor.setTo(0.5, 0.5);

        },
        update: function(cursors){
             //  Set the players velocity (movement)
             this.obj.animations.play('right');

            //  Allow the player to jump if they are touching the ground
            if (cursors.up.isDown && this.obj.body.touching.down)
            {
                this.obj.body.velocity.y = -300;
            }
            if(this.obj.body.touching.down){
                this.obj.body.velocity.x=150;
            }
            else{
                this.obj.body.velocity.x=0;
            }
        }
    }
    player.init();
    return player;
}