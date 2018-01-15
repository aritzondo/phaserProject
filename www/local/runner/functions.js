
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
    currScore += 100;   // We will later apply a score attribute of the enemy
    enemy.kill();
    bullet.kill();
}

//
function checkStuffToAppear(){
    var rand = game.rnd.between(0,6);
    if(rand == 1){
        if(enemyPull.length > 0){
            var enemy = enemyPull.getFirstDead();
            if(enemy != null) {
                enemy.reset(game.width, game.height - 150);
                enemy.rotation = this.game.physics.arcade.moveToObject(enemy, player.obj, 250) + 180;
            }
        }
    }
    else if(rand == 2){
        var obstacle = obstacles.getFirstDead();
        if(obstacle) {
            obstacle.reset(game.width + 14, game.height - 48);
            obstacle.body.velocity.x = -gameSpeed;
            obstacle.body.immovable = true;

            obstacle = obstacles.getFirstDead();
            obstacle.reset(game.width + 14, game.height - 80);
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
function actionOnClick1() {
    player.obj.exists = true;
    player.obj.x = 32;
    player.obj.y = game.world.height - 150;
    player.resetLife();
    console.log(player.obj.y);
    reset();
}
//action for button2(life upgrade)
function actionOnClick2(){
    if(lifeUpCost<totalScore) {
        player.addTank();
        totalScore-=lifeUpCost;
        lifeUpCost *= nextUpgrade;
        textButton2.setText("Increase life\ncost: "+lifeUpCost);
    }
}
//action for button3(jump upgrade)
function actionOnClick3(){
    if(jumpUpCost<totalScore) {
        player.jumpHeight += 50;
        totalScore -= jumpUpCost;
        jumpUpCost *= nextUpgrade;
        textButton3.setText("Higher jump\ncost: "+jumpUpCost);
    }
}