
//一些基本功能的定义
//--------------

if (!Function.prototype.bind) {
  Function.prototype.bind = function(obj) {
    var slice = [].slice,
        args  = slice.call(arguments, 1),
        self  = this,
        nop   = function () {},
        bound = function () {
          return self.apply(this instanceof nop ? this : (obj || {}), args.concat(slice.call(arguments)));
        };
    nop.prototype   = self.prototype;
    bound.prototype = new nop();
    return bound;
  };
}

//创建一个类
if (!Object.create) {
  Object.create = function(base) {
    function F() {};
    F.prototype = base;
    return new F();
  }
}

//Object的构造函数
if (!Object.construct) {
  Object.construct = function(base) {
    var instance = Object.create(base);
    if (instance.initialize)
      instance.initialize.apply(instance, [].slice.call(arguments, 1));
    return instance;
  }
}

//相当于属性赋值source=>destination
if (!Object.extend) {
  Object.extend = function(destination, source) {
    for (var property in source) {
      if (source.hasOwnProperty(property))
        destination[property] = source[property];
    }
    return destination;
  };
}

/*
** 场景 Scene
** Game中保存一个场景Array，用户通过下标进行场景标识
** Scene中两个function参数，一个用于update，一个用于draw
** 这两个函数是用户定义的
*/
Scene = {

  initialize: function(updateCallback,drawCallback){
    this.update = updateCallback;
    this.draw = drawCallback;
  },

};

//主类
Game = {

    // 检查兼容性
    compatible : function() {

        return Object.create &&
            Object.extend &&
            Function.bind &&
            document.addEventListener// && // HTML5 standard, all modern browsers that support canvas should also support add/removeEventListener
            //Game.ua.hasCanvas
    },


  start: function(id, game, cfg) {
    if (Game.compatible())
      return Object.construct(Game.Runner, id, game, cfg).game; // return the game instance, not the runner (caller can always get at the runner via game.runner)
  },

  addEvent:    function(obj, type, fn) { obj.addEventListener(type, fn, false);    },
  removeEvent: function(obj, type, fn) { obj.removeEventListener(type, fn, false); },

  ready: function(fn) {
    if (Game.compatible())
      Game.addEvent(document, 'DOMContentLoaded', fn);
  },

  createCanvas: function() {
    return document.createElement('canvas');
  },

  random: function(min, max) {
    return (min + (Math.random() * (max - min)));
  },

  randomInt: function(min,max) {
    return Math.floor(min+(Math.random()*(max-min)));
  },

  timestamp: function() {
    return new Date().getTime();
  },

  loadImages: function(sources, callback) { /* load multiple images and callback when ALL have finished loading */
    var images = {};
    var count = sources ? sources.length : 0;
    if (count == 0) {
      callback(images);
    }
    else {
      for(var n = 0 ; n < sources.length ; n++) {
        var source = sources[n];
        var image = document.createElement('img');
        images[source] = image;
        Game.addEvent(image, 'load', function() { if (--count == 0) callback(images); });
        image.src = source;
      }
    }
  },

  KEY: {
    BACKSPACE: 8,
    TAB:       9,
    RETURN:   13,
    ESC:      27,
    SPACE:    32,
    LEFT:     37,
    UP:       38,
    RIGHT:    39,
    DOWN:     40,
    DELETE:   46,
    HOME:     36,
    END:      35,
    PAGEUP:   33,
    PAGEDOWN: 34,
    INSERT:   45,
    ZERO:     48,
    ONE:      49,
    TWO:      50,
    A:        65,
    L:        76,
    P:        80,
    Q:        81,
    TILDA:    192
  },

  // Scene Container
  SceneList : new Array(),

  addScene: function(updateCallback,drawCallback){
    
  },

  Runner: {

    initialize: function(id, game, cfg) {
      this.cfg          = Object.extend(game.Defaults || {}, cfg || {}); // use game defaults (if any) and extend with custom cfg (if any)
      this.fps          = this.cfg.fps || 60;
      this.interval     = 1000.0 / this.fps;
      this.canvas       = document.getElementById(id);
      this.width        = this.cfg.width  || this.canvas.offsetWidth;
      this.height       = this.cfg.height || this.canvas.offsetHeight;
      this.front        = this.canvas;
      this.front.width  = this.width;
      this.front.height = this.height;
      this.back         = Game.createCanvas();
      this.back.width   = this.width;
      this.back.height  = this.height;
      this.front2d      = this.front.getContext('2d');
      this.back2d       = this.back.getContext('2d');
      this.addEvents();
//      this.resetStats();

      this.game = Object.construct(game, this, this.cfg); // finally construct the game object itself
    },

    // start函数是在Workspace里面启动的
    start: function() { // game instance should call runner.start() when its finished initializing and is ready to start the game loop
      this.lastFrame = Game.timestamp();
      this.timer     = setInterval(this.loop.bind(this), this.interval);
    },

    stop: function() {
      clearInterval(this.timer);
    },

    loop: function() {
      var start  = Game.timestamp(); this.update((start - this.lastFrame)/1000.0); // send dt as seconds
      var middle = Game.timestamp(); this.draw();
      var end    = Game.timestamp();
      //this.updateStats(middle - start, end - middle);
      this.lastFrame = start;
    },

    update: function(dt) {
      this.game.update(dt);
    },

    draw: function() {
      this.back2d.clearRect(0, 0, this.width, this.height);
      this.game.draw(this.back2d);
  //    this.drawStats(this.back2d);
      this.front2d.clearRect(0, 0, this.width, this.height);
      this.front2d.drawImage(this.back, 0, 0);
    },

    drawStats: function(ctx) {
//      if (this.cfg.stats) {
        ctx.fillStyle = 'white';
        ctx.font = '9pt sans-serif';
        ctx.fillText("fps: "    + this.fps,           this.width - 100, this.height - 60);
//      }
    },

    addEvents: function() {
      Game.addEvent(document, 'keydown', this.onkeydown.bind(this));
      Game.addEvent(document, 'keyup',   this.onkeyup.bind(this));
    },

    onkeydown: function(ev) { if (this.game.onkeydown) this.game.onkeydown(ev.keyCode); },
    onkeyup:   function(ev) { if (this.game.onkeyup)   this.game.onkeyup(ev.keyCode);   },
  },// Game.Runner end

  //碰撞检测的一些函数
  Collision : {

    /*
       检测两个矩形是否相交
       true:相交
       false:不相交
    */
    rectIntersection: function(rect1,rect2){
      if(rect1.x+rect1.w < rect2.x) return false;
        if(rect1.x > rect2.x + rect2.w) return false;
        if(rect1.y > rect2.y + rect2.h) return false;
        if(rect1.y + rect1.h < rect2.y) return false;
          return true;
    },

    /*检测两个矩形是否重叠*/
    rectOverlap: function(rect1, rect2){
      return rect1.x===rect2.x && rect1.y===rect2.y;
    },
  }, // Game.Collision end

}; // Game end
