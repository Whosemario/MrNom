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
             "assets/stain3.png"],

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
    this.gameover    = false;

    // mat infos
    this.mat = new Array(this.w);
    for(var i =0;i<this.w;++i){
      this.mat[i] = new Array(this.h);
      for(var j =0;j<this.h;j++)
        this.mat[i][j] = false;
    }

    //background image infos
    this.bdImageSrc  = "assets/background.png";
    this.bdimage     = this.images[this.bdImageSrc];

    // snake
    this.snake = Object.construct(Snake,this);

    // food
    this.food = Object.construct(Food,this);

    // game start
    this.runner.start();

    }.bind(this));
  },

  update: function(dt) {

    if(this.gameover == false){
        this.snake.update(dt);
        this.food.update(dt);

        //Collision Check

        if(this.snake.checkCollision())
          this.gameover = true;

        if(this.food.isVisiable &&
          Game.Collision.rectOverlap(this.snake,this.food)){
          this.food.reset();
          this.snake.addTail();
        }
    }
  },

  draw: function(ctx) {
      //background
      ctx.drawImage(this.bdimage,0,0);

      if(this.gameover === false){
          //snake 
          this.snake.draw(ctx);

          //food
          this.food.draw(ctx);
      }
  },

  onkeydown : function(keyCode){
      switch(keyCode){
        case Game.KEY.LEFT  : this.snake.changeDirection("LEFT");break;
        case Game.KEY.RIGHT : this.snake.changeDirection("RIGHT");break;
        case Game.KEY.UP    : this.snake.changeDirection("UP");break;
        case Game.KEY.DOWN  : this.snake.changeDirection("DOWN");break;
      }
  },

}; // Workspace.
