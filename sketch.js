var dog,happydogimg,hungryDog,database,foodS,foodStockRef;
var frameCountNow=0;
var fedTime,lastFed,foodObj,currentTime;
var milk,input,name;
var gameState ="hungry";
var bedroomimg,gardenimg,washroomimg,sleeimg,runimg;
var Feed,addfood;
var  input,button;
function preload()
{
  //load images here
  hungryDog=loadImage("dogImg1.png");
  happydogimg=loadImage("dogImg1.png");
  bedroomimg=loadImage("Bed Room.png");
  gardenimg=loadImage("Garden.png");
  washroomimg=loadImage("Wash Room.png");
  sleeimg=loadImage("Lazy.png");
  runimg=loadImage("running.png");
}

function setup() {
  createCanvas(1200, 500);
  database=firebase.database();
  foodObj=new Food();
  dog=createSprite(width/2+250,height/2,10,10);
  dog.addAnimation("hungry",hungryDog);
  dog.addAnimation("happy",happydogimg);
  dog.addAnimation("sleeping",sleeimg);
  dog.addAnimation("run",runimg);
  dog.scale=0.3;

  getGameState();

 feed=createButton("Feed the Dog");
 feed.position(950,95);
 feed.mousePressed(feedDog)

 addfood=createButton("ADD FOOD");
 addfood.position(1050,95);
 addfood.mousePressed(addFoods);

 input=createInput("Pet Name");
 input.position(950,120);

 button=createButton("Confirm");
 button.position(1020,145);
 button.mousePressed(createName);
  
foodS = database.ref("Food").on("value",readstock);  
  
}


function draw() 
{  
background(46,139,87);
currentTime=hour();
if(currentTime===lastFed+1){
  gameState="playing";
  updateGameState();
  foodObj.garden();
}
else if(currentTime===lastFed+2){
  gameState="sleeping";
  updateGameState();
  foodObj.bedroom();
}
else if(currentTime>lastFed+2&&currentTime<=lastFed+4){
  gameState="sleeping";
  updateGameState();
  foodObj.washroom();
}
else{
  gameState="hungry";
  updateGameState();
  foodObj.display();
}

foodObj.getFoodStock();

getGameState();

fedTime=database.ref("FeedTime");
fedTime.on("value",function(data){
  lastFed=data.val();
})

if(gameState==="hungry"){
  feed.show();
  addfood.show();
  dog.addAnimation("hungry",hungryDog);
}
else{
  feed.hide();
  addfood.hide();
  dog.remove();
}
drawSprites();

fill(255);
textSize(20);
  text("Last Feed: "+lastFed+":00",300,95);

  text("tIME SINCE LAST FED: "+(currentTime-lastFed),300,125);





  
  
  
}

function readstock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS)
  }

  function feedDog(){
    foodObj.deductFood();
    foodObj.updateFoodStock();
    dog.changeAnimation("happy",happydogimg);
    gameState="happy";
    updateGameState();
      }
  
function addFoods(){
foodObj.addfood();
foodObj.updateFoodStock();
  }

  async function hour(){
    var site=await fetch("http://worldtimeapi.org/api/timezone/Asia/Kolkata")
    var siteJson=await site.json();
    var dateTime=siteJson.dateTime;
var hourTime=dateTime.slice(11,13);
return hourTime;
  }
  function createName(){
    input.hide();
    button.hide();

    name=input.value();
    var greeting=createElement("h3");
    greeting.html("Pet's name "+name);
    greeting.position(width/2+850,height/2+200);
  }

  function getGameState(){
    gameStateref=database.ref("gameState");
    gameStateref.on("value",function(data){
      gameState=data.val();
    })
  }
  function updateGameState(){
    database.ref("/").update({
      gameState:gameState
    })
  }
  


