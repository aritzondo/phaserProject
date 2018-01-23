//Function to create the player
function createPlayer(){
    var player = {
        life: 99,
        lifeTanksLeft: 1,
        fireRate: 100,
        damage: 1,
        nextFire: game.time.now,
        isShooting: false,
        jumpHeight: 600,
        maneuverSpeed: 150,     //The speed at you manouver on the screen
        obj:0,
        tanks:[new Phaser.Rectangle(64,16,24,24)],
        shootSound: undefined,
        init: function(){
            // Player
            this.obj = game.add.sprite(32, game.world.height - 150, 'samus');
            game.physics.arcade.enable(this.obj);
            //Physics
            this.obj.body.bounce.y = 0;
            this.obj.body.gravity.y = 1200;
            //Animations
            this.obj.animations.add('right', [0,1,2,3,4,5,6,7,8,9], 20, true);
            this.obj.animations.add('jumping', [10,11,12,13,14,15,16,17], 20, true);
            this.obj.animations.add('shooting', [20,21,22,23,24,25,26,27,28,29], 20, true);
            //Camera anchor
            this.obj.anchor.setTo(0.5, 0.5);
            this.obj.scale.set(2,2);
            //
            this.shootSound = game.add.audio('blaster');
        },
        //update during game
        update: function(cursors){
            //check border
            if(this.obj.y > game.height || this.obj.x < -32 || this.obj.x > game.width){
                reset();
            }
            // Life check
            if(this.life<=0){
                this.lifeTanksLeft--;
                if(this.lifeTanksLeft > 0){
                    this.life = 99;
                }
            }

            if(this.lifeTanksLeft <= 0){
                //resetear el juego
                reset();
            }

            // Jump
            if(game.input.activePointer.isDown && this.obj.body.touching.down){
                this.isShooting = true;
            }
            else{
                this.isShooting = false;
            }

            // Set speed related to arrows
            var arrowSpeed = 0;
            if(cursors.left.isDown) arrowSpeed -= this.maneuverSpeed;
            if(cursors.right.isDown) arrowSpeed += this.maneuverSpeed;

             //  Set the animations
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
                //if you press the mouse(fire)
                if (game.input.activePointer.isDown) {
                    this.fire();
                }
                //if you press up(jump)
                else if (cursors.up.isDown) {
                    this.obj.body.velocity.y = -this.jumpHeight;
                    this.isShooting = false;
                }
                //else {
                    this.obj.body.velocity.x = gameSpeed + arrowSpeed;
                //}
            }
            else {  // Not in the ground
                if(!cursors.up.isDown && this.obj.body.velocity.y<0){
                    this.obj.body.velocity.y = 0;
                }
                this.obj.body.velocity.x = 0 + arrowSpeed;
            }
        },
        fire:function(){
            this.isShooting=true;
            if (game.time.now > this.nextFire&& bullets.countDead() > 0)
            {
                this.nextFire = game.time.now + this.fireRate;

                var bullet = bullets.getFirstExists(false);
                bullet.frame = this.damage-1;

                bullet.reset(this.obj.x, this.obj.y);
                bullet.rotation = game.physics.arcade.moveToPointer(bullet, 1000, game.input.activePointer);
                this.shootSound.play();
            }
        },
        hitByEnemy:function(enemy){
            console.log("hit " + enemy.damage);
            this.life -= enemy.damage;
        },
        resetLife:function(){
            this.life=100;
            this.lifeTanksLeft=this.tanks.length;
        },
        addTank:function(){
            this.tanks.push(new Phaser.Rectangle((this.tanks.length+2)*32,16,24,24));
            this.lifeTanksLeft++;
        }
    }
    player.init();
    return player;
}
