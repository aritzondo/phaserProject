
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
    createExplosion(bullet.x, bullet.y);
    bullet.kill();
};

function enemyHitsPlayer(plyer,enemy){
    enemy.kill();
    createExplosion(enemy.x, enemy.y);
    player.hitByEnemy(enemy);
}

function bulletHitEnemy(enemy,bullet){
    //
    //console.log(enemy.health + ", " + player.damage);
    enemy.health -= player.damage;
    bullet.kill();
    createExplosion(bullet.x + 10, bullet.y);
    //
    if(enemy.health <= 0) {
        currScore += enemy.score;   // We will later apply a score attribute of the enemy
        enemy.kill();
        //createExplosion(enemy.x, enemy.y);
    }
    var explosionSound = game.add.audio('explosion');
    explosionSound.play();
}

function bulletHitBoss(bossObj, bullet){
    // First check that is in screen
    if(bossObj.x < boss.safePosition) {
        //
        boss.applyDamage(player.damage);
        //
        createExplosion(bullet.x + 50, bullet.y);
        bullet.kill();
        //
        var explosionSound = game.add.audio('explosion');
        explosionSound.play();
    }
}

function createExplosion(x, y){
    var newExplosion = explosions.getFirstDead();
    //console.log(newExplosion);
    if(newExplosion) {
        newExplosion.reset(x, y);
        newExplosion.animations.add('explode');
        newExplosion.play('explode', 10, false, true);
        newExplosion.enableBody = true;
        newExplosion.body.velocity.x = -gameSpeed;
    }
}

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
    if(lifeUpCost <= totalScore) {
        player.addTank();
        totalScore-=lifeUpCost;
        lifeUpCost *= nextUpgrade;
        textButton2.setText("Increase life\ncost: "+lifeUpCost);
    }
}
//action for button3(jump upgrade)
function actionUpgradeJump(){
    if(jumpUpCost <= totalScore) {
        player.jumpHeight += 50;
        totalScore -= jumpUpCost;
        jumpUpCost *= nextUpgrade;
        textButton3.setText("Higher jump\ncost: "+jumpUpCost);
    }
}

//action for button4(maneuverability upgrade)
function actionUpgradeManeuverability(){
    if(maneuverabilityCost <= totalScore) {
        player.maneuverSpeed += 50;
        totalScore -= maneuverabilityCost;
        maneuverabilityCost *= nextUpgrade;
        textButton4.setText("Better maneuverability \ncost: "+maneuverabilityCost);
    }
}

//action for button5 (damage upgrade)
function actionUpgradeDamage(){
    if(damageCost <= totalScore && player.damage < 3){
        player.damage += 1;
        totalScore -= damageCost;
        if(player.damage==3){
            textButton5.setText("Damage maxed");
        }
        else{
            damageCost *=2*nextUpgrade;
            textButton5.setText("Increase damage \ncost: "+damageCost);
        }
    }
}

//*****************************//
//--Functions to spawn things--//
//*****************************//

//create holes and spawn enemies and obstacles
function checkStuffToAppear()
{
    // Floor and platforms
    if(counter % 6 == 0){
        holeLength--;
        if(holeLength < 0){
            var rand = game.rnd.between(0,50);
            if(rand > 0) {
                newPlatform(game.width);
                if(rand<5){
                    checkObstaclesToAppear();
                }
            }
            else{
                holeLength = game.rnd.between(4,5);
            }
        }
    }
    // Enemies
    var rand = game.rnd.between(0,3);
    if(rand == 0){
        checkEnemiesToAppear();
    }
}

//create random enemies
function checkEnemiesToAppear(){
    var rand = game.rnd.between(0,6);
    if(rand == 1){
        if(enemyPull.length > 0){
            var enemy = enemyPull.getFirstDead();
            if(enemy != null) {
                spawnEnemy(enemy);
            }
        }
    }
}

//create obstacles
function checkObstaclesToAppear(){
    var rand = game.rnd.between(0,5);
    switch (rand){
        case 0: case 1: case 2: case 3:
            createObstacles(2);
            break;
        case 4: case 5:
            createObstacles(3);
            break;
    }
};

//create x number of obstacles
function createObstacles(number){
    for(var i=0; i<number; i++){
        var obstacle = obstacles.getFirstDead();
        if(obstacle) {
            obstacle.reset(game.width, game.height - 48 -i*32);
            obstacle.body.velocity.x = -gameSpeed;
            obstacle.body.immovable = true;
        }
    }
}

//
function spawnEnemy(enemyToSpawn){
    //
    var enemyType = game.rnd.between(0,14);
    //
    var heightToAppear = game.rnd.between(0, game.height - 150);
    enemyToSpawn.reset(game.width, heightToAppear);
    //
    switch (enemyType)
    {
        case 0: case 1: case 2: case 3: case 4:

            //console.log(enemy.x + ", " + enemy.y);
            enemyToSpawn.health = 3 /*enemy.maxHealth*/;
            enemyToSpawn.body.velocity.x = -enemySpeed;
            enemyToSpawn.scale.setTo(1, 1);
            enemyToSpawn.frame = 0;
            enemyToSpawn.damage = 10;
            enemyToSpawn.score = 10;
            break;
        case 5: case 6: case 7: case 8:
            enemyToSpawn.health = 5;
            enemyToSpawn.body.velocity.x = -enemySpeed + 20;
            enemyToSpawn.scale.setTo(1.2, 1.2);
            enemyToSpawn.frame = 1;
            enemyToSpawn.damage = 20;
            enemyToSpawn.score = 20;
            break;
        case 9: case 10: case 11:
            enemyToSpawn.health = 10;
            enemyToSpawn.body.velocity.x = -enemySpeed + 40;
            enemyToSpawn.scale.setTo(1.5, 1.5);
            enemyToSpawn.frame = 2;
            enemyToSpawn.damage = 30;
            enemyToSpawn.score = 30;
            break;
        case 12: case 13:
            enemyToSpawn.health = 15;
            enemyToSpawn.body.velocity.x = -enemySpeed + 80;
            enemyToSpawn.scale.setTo(2.0, 2.0);
            enemyToSpawn.frame = 3;
            enemyToSpawn.damage = 40;
            enemyToSpawn.score = 40;
            break;
        case 14:
            enemyToSpawn.health = 20;
            enemyToSpawn.body.velocity.x = -enemySpeed + 120;
            enemyToSpawn.scale.setTo(2.5, 2.5);
            enemyToSpawn.frame = 4;
            enemyToSpawn.damage = 50;
            enemyToSpawn.score = 50;
            break;
        default:
            //Shit
            break;
    }
}

//*****************************//
//--Functions for --//
//*****************************//

// To the pool
function sendToPool(object){
    object.kill();
}