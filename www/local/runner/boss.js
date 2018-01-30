//
function createBoss(){
    var boss = {
        health: 0,
        maxHealth: 333,
        fireRate: 100,
        fireCoolDown: 0,
        active: false,
        alive: true,
        movementSpeed: 200,     //For going in/out the screen
        damage: 20,
        timeActive: 100,
        currentActiveTime: 0,
        safePosition: 0,
        //mask: undefined,
        init: function(){
            this.obj = game.add.sprite(game.width, game.height/2, 'ridley', 0);
            this.obj.animations.add('ridley');
            this.obj.play('ridley',10,true);
            this.obj.anchor.setTo(0.5, 0.5);
            this.obj.scale.setTo(2, 2);
            game.physics.arcade.enable(this.obj);
            this.safePosition = game.width + (game.width/3);
            this.obj.x = this.safePosition;
            this.obj.z = 100;
        },
        update: function () {
            // Manage active
                // Not advance the counter when it moves
            if(this.obj.body.velocity.x == 0)
                this.currentActiveTime ++;
                // And the check
            if(this.currentActiveTime > this.timeActive){
                this.active = !this.active;
                this.damage += 5;
                this.currentActiveTime = 0;
                this.timeActive += 200;
                this.roar();
            }

            //What to do with active
            if(this.active){
                if(this.obj.x > game.width*3/4){
                    this.obj.body.velocity.x = -this.movementSpeed;
                }
                else{   //Aqui manejamos los disparos
                    this.obj.body.velocity.x = 0;
                    this.fireCoolDown ++;
                    //console.log(this.fireCoolDown);
                    if(this.fireCoolDown >= this.fireRate){
                        var fireBall = fireballs.getFirstExists(false);
                        fireBall.reset(this.obj.x, this.obj.y);
                        fireBall.animations.add('rotate');
                        fireBall.play('rotate', 10, true);
                        fireBall.rotation = game.physics.arcade.moveToObject(fireBall, player.obj, 500);
                        fireBall.damage = this.damage;
                        fireBall.scale.setTo(2, 2);
                        this.fireCoolDown = 0;
                    }
                }
            }
            else{
                if(this.obj.x < this.safePosition){
                    this.obj.body.velocity.x = this.movementSpeed;
                }
                else{
                    this.obj.body.velocity.x = 0;
                }
            }
            this.changeTint();
        },
        resetBoss: function(){
            //console.log('reseting boss');
            this.obj.x = this.safePosition;
            this.obj.body.velocity.x = 0;
            this.active = false;
            this.fireCoolDown = 0;
            this.health = this.maxHealth;
            this.timeActive = 100;
            this.currentActiveTime = 0;
            this.damage = 20;
        },
        kill: function (){
            victory = true;
            this.resetBoss();
            reset();
        },
        roar: function(){
          var roarToUse = game.rnd.between(0, 6);
          var roar;
          switch (roarToUse){
              case 0:
                  roar = game.add.audio('Ridley1');
                  roar.play();
                  break;
              case 1:
                  roar = game.add.audio('Ridley2');
                  roar.play();
                  break;
              case 2:
                  roar = game.add.audio('Ridley3');
                  roar.play();
                  break;
              case 3:
                  roar = game.add.audio('Ridley4');
                  roar.play();
                  break;
              case 4:
                  roar = game.add.audio('Ridley5');
                  roar.play();
                  break;
              case 5:
                  roar = game.add.audio('Ridley6');
                  roar.play();
                  break;
              case 6:
                  roar = game.add.audio('Ridley7');
                  roar.play();
                  break;
          }
        },
        changeTint: function(){
            // Tint to show damage
            var healthProportion = Math.floor(this.health / this.maxHealth * 255);
            var colorValue = Phaser.Color.componentToHex(healthProportion);
            var tintColor = "0x" + "ff" + colorValue + colorValue;
            this.obj.tint = tintColor;
        },
        applyDamage: function(playerDamage){
            boss.health -= playerDamage;
            boss.changeTint();
            if(boss.health > 0)
                boss.changeTint();
            else{
                victory = true;
                this.obj.body.velocity.x = 0;
                reset();          // Usamos cuenta atrás?
            }
        },
    }
    boss.init();
    return boss;
}