
//reset the position of the platforms
function resetPlatforms(){
    //platforms.callAll('revive');
    for(var i = 0; i < platforms.children.length; i++)
    {
        //platforms.children[i].x=i*32;
        //platforms.children[i].y=game.height-32;
        newPlatform(i * 32);
    }
};

function newPlatform(posX){
    var platform = platforms.getFirstDead();
    if(platform) {
        platform.reset(posX, game.height - 16);
        platform.body.velocity.x = -gameSpeed;
        platform.body.immovable = true;
    }
};
//****************************//
//Functions for the collisions//
//****************************//

function bulletHitWall(bullet,platform){
    bullet.kill();
};

function enemyHitsPlayer(plyer,enemy){
    enemy.kill();
    player.hitByEnemy(enemy);
}

function bulletHitEnemy(enemy,bullet){
    //
    //console.log(enemy.health + ", " + player.damage);
    enemy.health -= player.damage;
    bullet.kill();
    //
    if(enemy.health <= 0) {
        currScore += 100;   // We will later apply a score attribute of the enemy
        enemy.kill();
    }
}

//
function checkStuffToAppear(){
    var rand = game.rnd.between(0,6);
    if(rand == 1){
        if(enemyPull.length > 0){
            var enemy = enemyPull.getFirstDead();
            if(enemy != null) {
                var heightToAppear = game.rnd.between(0, game.height - 150);
                enemy.reset(game.width, heightToAppear);
                //console.log(enemy.x + ", " + enemy.y);
                enemy.health = 3 /*enemy.maxHealth*/;
                enemy.body.velocity.x = -gameSpeed;
                //enemy.rotation = this.game.physics.arcade.moveToObject(enemy, player.obj, 250) + 180;

            }
        }
    }
    else if(rand == 2){
        var obstacle = obstacles.getFirstDead();
        if(obstacle) {
            obstacle.reset(game.width, game.height - 48);
            obstacle.body.velocity.x = -gameSpeed;
            obstacle.body.immovable = true;

            obstacle = obstacles.getFirstDead();
            obstacle.reset(game.width, game.height - 80);
            obstacle.body.velocity.x = -gameSpeed;
            obstacle.body.immovable = true;
        }
    }
};
//*****************************//
//--Functions for the buttons--//
//*****************************//

//add text to a button
function addTextToButton(text,button){
    button.addChild(text)
    text.centerX += button.width/2;
    text.centerY += button.height/2;
}

//function for button1(Resume the game)
function actionStartGame() {
    player.obj.exists = true;
    player.obj.x = 32;
    player.obj.y = game.world.height - 150;
    player.resetLife();
    console.log(player.obj.y);
    reset();
}
//action for button2(life upgrade)
function actionUpgradeHealth(){
    if(lifeUpCost<totalScore) {
        player.addTank();
        totalScore-=lifeUpCost;
        lifeUpCost *= nextUpgrade;
        textButton2.setText("Increase life\ncost: "+lifeUpCost);
    }
}
//action for button3(jump upgrade)
function actionUpgradeJump(){
    if(jumpUpCost<totalScore) {
        player.jumpHeight += 50;
        totalScore -= jumpUpCost;
        jumpUpCost *= nextUpgrade;
        textButton3.setText("Higher jump\ncost: "+jumpUpCost);
    }
}

//action for button3(jump upgrade)
function actionUpgradeManeuverability(){
    if(jumpUpCost<totalScore) {
        player.maneuverSpeed += 50;
        totalScore -= maneuverabilityCost;
        maneuverabilityCost *= nextUpgrade;
        textButton3.setText("Higher jump\ncost: "+maneuverabilityCost);
    }
}