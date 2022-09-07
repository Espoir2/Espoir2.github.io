/* Variables Générales du code*/ 
var canvas;
var canvasWidth = 1000;
var canvasHeight = 500;
var blockSize = 30;
var ctx;
var delay = 200;
var snakee;
var widthInBlocks = canvasWidth/blockSize;
var heightInBlocks = canvasHeight/blockSize;
var score;
var timeout;
var vpause = false;


window.onload = function(){
    /* Variables Générales du code*/ 
    /*var canvas;
    var canvasWidth = 1000;
    var canvasHeight = 500;
    var blockSize = 30;
    var ctx;
    var delay = 200;
    var snakee;*/
	
    init();

    /* ////////////////////////////////////////FONCTION POUR INITIALISER LE CANVAS  ////////////////////////////////////////*/
    function init(){
        canvas = document.createElement('canvas');
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvas.style.border = " 30px solid grey" ;
        canvas.style.margin = "50px auto";
        canvas.style.display ="block";
        canvas.style.backgroundColor = "#F0D7A7";
        document.body.appendChild(canvas);
        ctx = canvas.getContext("2d");
        snakee = new snake([[6,4] , [5,4], [4,4], [3,4], [2,4], [1,5], [2,6]], "right");
        applee = new apple([10, 10]);
        score = 0;
        refreshcanvas();
    } 




    /*//////////////////////////////////////// FONCTION POUR ACTUALISER LE CANVAS ////////////////////////////////////////*/
    function refreshcanvas(){
        if(vpause){
            pause();
    }
    else{
        snakee.advance();
    }
        
        if(snakee.checkCollision()){  // EN CAS DE COLLISION
        
             gameOver();
        }

        else {
            if (snakee.is_eating_apple(applee)){
                                                     // AU CAS OU LE SERPENT  MANGE LA POMME
              snakee.ateApple = true;
              score ++;
              do {
                  applee.setNewPosition();}  
              while (applee.is_on_snake(snakee));
              
            }
        
        ctx.clearRect(0, 0, canvasWidth, canvasHeight); 
        drawScore();
        snakee.draw();
        applee.draw();
        timeout = setTimeout(refreshcanvas, delay);
        }
        
        
    };
    
    /* //////////////////////////////////////// GAME OVER  ////////////////////////////////////////*/

    function gameOver(){
        ctx.save();
        ctx.font = "bold 50px sans-serif";
        ctx.fillStyle ="#b64c45";
        ctx.textAlign = "center";
        ctx.strokeStyle = "#b64c45";
        ctx.lineWidth = 5;
        var centreX = canvasWidth/2;
        var centreY = canvasHeight/2;
        ctx.textBaseline = "middle";
        ctx.fillText("GAME OVER", centreX, centreY - 180);
        ctx.strokeText("GAME OVER", centreX, centreY - 180);
        ctx.font = "bold 30px sans-serif";
        ctx.strokeText("APPUYEZ SUR LA TOUCHE ESPACE POUR REJOUER", centreX, centreY - 120);
        ctx.fillText("APPUYEZ SUR LA TOUCHE ESPACE POUR REJOUER", centreX, centreY - 120);
        ctx.restore();  
    };


    /* //////////////////////////////////////// RESTART  ////////////////////////////////////////*/

    function restart(){
        //init();
        score = 0;
        snakee = new snake([[6,4] , [5,4], [4,4], [3,4], [2,4]], "right");
        applee = new apple([10, 10]);
        clearTimeout(timeout);
        refreshcanvas();
    }; 

/* //////////////////////////////////////// SCORE  ////////////////////////////////////////*/
 function drawScore(){
    ctx.save();
    ctx.font = "bold 200px sans-serif";
    ctx.fillStyle ="grey";
    ctx.textAlign = "center";
    var centreX = canvasWidth/2;
    var centreY = canvasHeight/2;
    ctx.textBaseline = "middle";
    //var score_str = score.toString;
    ctx.fillText(score, centreX, centreY);
    ctx.restore();
 }


 /* //////////////////////////////////////// PAUSE  ////////////////////////////////////////*/
 
 /*if(vpause){
        pause();
}
else{
   clearTimeout(timeout);
   refreshcanvas();
}*/
 function pause(){
    ctx.save();
    ctx.font = "bold 20px sans-serif";
    ctx.fillStyle ="grey";
    ctx.textAlign = "center";
    var centreX = canvasWidth/2;
    var centreY = canvasHeight/2;
    ctx.textBaseline = "middle";
    //var score_str = score.toString;
    ctx.fillText("Appuyer sur ENTRER POUR continuer", centreX, centreY);
    ctx.restore();
     
 };



    

    

/* //////////////////////////////////////// FONCTION POUR DESSINER CHAQUE BLOC COMPOSANT LE SERPENT  ////////////////////////////////////////*/
       


    function drawBlock(ctx, position){ // Paramètres de la fonction: ctx --> (pour le context avec lequel on veut déssiner)
                                      //                            position --> (pour l'index du bloc qu'on veut déssiner)
    
        var x2 = position[0] * blockSize; // Absisce du bloc
        var y2 = position[1] * blockSize; // Ordonée du bloc
        ctx.fillRect(x2, y2, blockSize, blockSize); // Déssin du bloc proprement dit
    };
    

       
 /*  ////////////////////////////////////////FONCTION POUR CREER LE SERPENT EN ENTIER ET LUI DONNER SES FONCTIONNALITES ////////////////////////////////////////*/
    function snake(body, direction){
        this.body = body;
        this.direction = direction;
        this.ateApple  = false;
        
        
        /*---------------------------------------- CREATION DU SERPENT----------------------------------------*/
        
        
        this.draw = function() {                 // ici on veut déssiner les différents blocs qui constituent le serpent 
            ctx.save();
            ctx.fillStyle = "blue";
            for(var i = 0; i < this.body.length; i++){
                drawBlock(ctx, this.body[i]);
                
            }
            ctx.restore();
        };


    /*---------------------------------------- AVANCEMENT DU SERPENT----------------------------------------*/
                                     


        this.advance = function()  { // La technique pour faire avancer le serpent est de créer un nouveau bloc
                                  // pour la tête et de supprimer le bloc de la queue
       
            var nextPosition = this.body[0].slice(); // Là on copie l'array du bloc de la tête
            switch(this.direction){
                case "left":
                    nextPosition[0] -= 1;
                    break;
                case "up":
                    nextPosition[1] -= 1;
                    break;                  /* Positionnement du nouveau bloc en fonction de la direction du serpent */
                case "right":
                    nextPosition[0] += 1;
                    break;
                case "down":
                    nextPosition[1] += 1;
                    break;
                default:
                    throw("invalid direction");
            };
            this.body.unshift(nextPosition);
            if(! this.ateApple ) { 
                this.body.pop(); 
            } else {
                this.ateApple = false; }

            
        };
    
        /*---------------------------------------- DIRECTION DU SERPENT----------------------------------------*/
                            

        this.setDirection = function(newDirection){ // Ici on veut donner au serpent sa nouvelle direction en fonction
                                                    // de la touche appuyer par l'utilisateur
        
            var allowedDirections;
            switch(this.direction){
                case "left":
                case "right":
                    allowedDirections = ["up", "down"];
                    break;                  /*Définition des directions permise  en fonction de la direction du serpent */
                case "up":
                case "down":
                    allowedDirections = ["left", "right"];
                    break;
                default:
                    throw("invalid direction");
            };
            if (allowedDirections.indexOf(newDirection) > -1){
                this.direction = newDirection;
            };
            
        };






/* ----------------------------------------GESTION DES COLLISIONS ----------------------------------------*/
                        

        this.checkCollision = function() {
            var wallCollision = false;
            var snakeCollision = false;
            var head = this.body[0];
            var rest = this.body.slice(1);
            var snakeX = head[0];
            var snakeY = head[1];
            var minX = 0;
            var minY = 0;
            var maxX = widthInBlocks - 1;
            var maxY = heightInBlocks - 1;
            var is_not_between_vertical_walls = snakeX < minX || snakeX > maxX;
            var is_not_between_horizontal_walls = snakeY < minY || snakeY > maxY;
            if (is_not_between_horizontal_walls || is_not_between_vertical_walls){
                wallCollision = true;
            }

            for(var i = 0; i < rest.length; i++){
                if(snakeX == rest[i][0] && snakeY == rest[i][1]){
                    snakeCollision = true;
                }
            }
            //console.log('is_not_between_vertical_walls' + ' : ' + is_not_between_vertical_walls );
            //console.log('is_not_between_horizontal_walls' + ' : ' + is_not_between_horizontal_walls );
            //console.log('wallCollision' + ' : ' + wallCollision);
            //console.log('snakeCollision' + ' : ' + snakeCollision);
            
            return wallCollision || snakeCollision ;
            //console.log('checkCollision' + ' : ' + this.checkCollision());


        }


    /*----------------------------------------GESTION DELA CONSOMMATION DE POMMES ----------------------------------------*/
                            
        this.is_eating_apple = function(appleToEat){
            var head = this.body[0];
            if (head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1] )
             return true;
            else
             return false;
        }
    
    } ;






/* ////////////////////////////////////////FONCTION POUR CREER LA POMME ET LUI DONNER SES FONCTIONALITES //////////////////////////////////////// */
                        
    function apple(position){
        this.position = position;
        
        
        /*---------------------------------------- CREATION DE LA POMME ----------------------------------------*/
        this.draw = function() {
            ctx.save();
            ctx.fillStyle = "#33cc33";
            ctx.beginPath();
            var raduis = blockSize/2;
            var x = this.position[0] * blockSize + raduis;
            var y = this.position[1] * blockSize + raduis;
            ctx.arc(x, y, raduis, 0, Math.PI*2, true);
            ctx.fill();
            ctx.restore();

        };

        /*---------------------------------------- CHANGEMENT DE POSITION DE LA POMME----------------------------------------*/

        this.setNewPosition = function() {
            var newX = Math.round(Math.random() * (widthInBlocks - 1));
            var newY = Math.round(Math.random() * (heightInBlocks - 1));
            this.position = [newX, newY];
        };




        /*---------------------------------------- ASSURANCE POMME HORS DU SERPENT----------------------------------------*/

        this.is_on_snake = function(snakeToCheck){
                var is_on_snake = false;
                for(var i = 0; i < snakeToCheck; i++){
                    if(this.position[0] === snakeToCheck.body[i][0] && this.position[0] === snakeToCheck.body[i][1]){
                        is_on_snake = true;
                    }
                }
                return is_on_snake;
            }
    

            
    



/* //////////////////////////////////////// ETABLISSEMENT DU LIEN AVEC LE CLAVIER  //////////////////////////////////////// */

/*document.onkeydown = function handleKeyDown(e)*/ // Evènement permettant d'avoir des information dur la touche 
                                                // appuyer par l'utilisateur
document.addEventListener('keydown', function(e) { 
    var key = e.keyCode; // Variable stockant le code de la touche appuyée
    var newDirection;
    switch(key){
        case 37: 
            newDirection = "left";
            break;
        case 38: 
            newDirection = "up";     /*Définition de la nouvelle diretion en fonction de la touche appuyée*/
            break;
        case 39:
            newDirection = "right";
            break;
        case 40: 
            newDirection = "down";
            break;
        case 32: 
            restart();
            return;
        case 16: 
            vpause = true;
            
            return;
        case 13: 
            vpause = false;
            
            return;
        default:
            return;
    };
    snakee.setDirection(newDirection);
});
    }
}
