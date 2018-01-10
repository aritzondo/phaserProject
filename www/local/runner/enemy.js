function CreateEnemy(){
    var enemy={
        index:0,
        obj:0,
        init:function(){
            this.obj=game.add.sprite(game.width - 32, game.height - 150,'metroid');
            this.obj.alive=false;
            game.physics.enable(this.obj, Phaser.Physics.ARCADE);
        },
        update:function(){
            game.physics.arcade.collide(this.obj, platforms);
            game.physics.arcade.overlap(this.obj,bullets,this.hit,null,this);
            game.physics.arcade.overlap(this.obj,player.obj,this.hitPlayer,null,this)
            if(this.obj.x<-32){
                this.kill();
            }
        },
        hit:function(enemy,bullet){
            bullet.kill();
            this.kill();
        },
        hitPlayer:function(enemy,plyer){
            this.kill();
            player.hitByEnemy(this);
        },
        kill:function(){
            console.log("dead");
            this.obj.kill();
            enemy=enemies.splice(this.index,1)
            enemyPull.push(enemies.pop());
        },
        reset:function(newIndex){
            this.obj.x=game.width - 32;
            this.obj.y=game.height - 150;
            this.obj.alive=true;
            this.index=newIndex;
        }
    }
    enemy.init();
    return enemy;
}