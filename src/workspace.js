Workspace = {

  Defaults: {
    width:  320,   // logical canvas width (browser will scale to physical canvas size - which is controlled by @media css queries)
    height: 480,   // logical canvas height (ditto)
    stats: false,   // tell Game.Runner to show stats
  },

  Images : ["assets/background.png",
            "assets/headleft.png",
             "assets/headdown.png",
             "assets/headright.png",
             "assets/headup.png",
             "assets/tail.png",
             "assets/stain1.png",
             "assets/stain2.png",
             "assets/stain3.png",
             "assets/logo.png",
             "assets/gameover.png"],

  //-----------------------------------------------------------------------------

  initialize: function(runner, cfg) {
    Game.loadImages(this.Images, function(images) {
    //basic infos
    this.cfg         = cfg;
    this.runner      = runner;
    this.width       = runner.width;
    this.height      = runner.height;
    this.images      = images;
    this.unit        = 32;
    this.w           = 10;
    this.h           = 15;
    this.scene       = 1;  // 1: start page , 2: play , 3, gameover

    // mat infos
    this.mat = new Array(this.w);
    for(var i =0;i<this.w;++i){
      this.mat[i] = new Array(this.h);
      for(var j =0;j<this.h;j++)
        this.mat[i][j] = 0;
    }

    //background image infos
    this.bdImageSrc  = "assets/background.png";
    this.bdimage     = this.images[this.bdImageSrc];

    // snake
    this.snake = Object.construct(Snake,this);

    // food
    this.food = Object.construct(Food,this);

    // start page
    this.startPage = Object.construct(StartPage,this);

    // game over
    this.gameover = Object.construct(Gameover,this);

    // game start
    this.runner.start();

    }.bind(this));
  },

  update: function(dt) {

    switch(this.scene){
        case 1 :
          break;
        case 2 :
          this.snake.update(dt);
          this.food.update(dt);

          //Collision Check

          if(this.snake.checkCollision())
            this.scene = 3;

          if(this.food.isVisiable &&
            Game.Collision.rectOverlap(this.snake,this.food)){
            this.food.reset();
            this.snake.addTail();
          }
          break;
        case 3:
          break;
      }
  },

  draw: function(ctx) {
      //background
      ctx.drawImage(this.bdimage,0,0);

      switch(this.scene){
        case 1 :
          // start page
          this.startPage.draw(ctx);
          break;
        case 2 :
          //snake 
          this.snake.draw(ctx);

          //food
          this.food.draw(ctx);

          break;
        case 3:
          //snake 
          this.snake.draw(ctx);
          //game over
          this.gameover.draw(ctx);
          break;
      }
  },

  onkeydown : function(keyCode){
      switch(keyCode){
        case Game.KEY.LEFT  : this.snake.changeDirection("LEFT");break;
        case Game.KEY.RIGHT : this.snake.changeDirection("RIGHT");break;
        case Game.KEY.UP    : this.snake.changeDirection("UP");break;
        case Game.KEY.DOWN  : this.snake.changeDirection("DOWN");break;
        case Game.KEY.SPACE : this.scene = 2;break;
      }
  },

}; // Workspace.
