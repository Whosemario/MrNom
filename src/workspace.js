Workspace = {

  Defaults: {
    width:  320,   // logical canvas width (browser will scale to physical canvas size - which is controlled by @media css queries)
    height: 480,   // logical canvas height (ditto)
    stats: true,   // tell Game.Runner to show stats
  },

  Images : ["assets/background.png",
            "assets/headleft.png",
             "assets/headdown.png",
             "assets/headright.png",
             "assets/headup.png",
             "assets/tail.png"],

  //-----------------------------------------------------------------------------

  initialize: function(runner, cfg) {
    Game.loadImages(this.Images, function(images) {
    //basic infos
    this.cfg         = cfg;
    this.runner      = runner;
    this.width       = runner.width;
    this.height      = runner.height;
    this.images      = images;

    //background image infos
    this.bdImageSrc  = "assets/background.png";
    this.bdimage     = this.images[this.bdImageSrc];

    // snake
    this.snake = Object.construct(Snake,this);

    // game start
    this.runner.start();

    }.bind(this));
  },

  update: function(dt) {
    this.snake.update(dt);
  },

  draw: function(ctx) {
      //background
      ctx.drawImage(this.bdimage,0,0);

      //snake 
      this.snake.draw(ctx);
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
