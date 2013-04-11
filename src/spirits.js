// Sake tail
Tail = {

	initialize: function(workspace,x,y){
		// image infos
		this.imageSrc = "assets/tail.png";
		this.image    = workspace.images[this.imageSrc];

		//properties
		this.x = x;
		this.y = y;
		this.w = 32;
		this.h = 32;

		//move
		this.direction = "LEFT";

		//fill mat
		workspace.mat[this.x/this.w][this.y/this.h] |= 4;

	},

	update: function(dx){

	},

	draw: function(ctx){
		ctx.drawImage(this.image,this.x,this.y);
	},
};

// Snake Head
Snake = {

	initialize: function(workspace) {

		this.workspace = workspace;

		// image infos
		this.imageSrc = ["assets/headleft.png",
						 "assets/headdown.png",
						 "assets/headright.png",
						 "assets/headup.png"];
		this.image    = new Array(this.imageSrc.length);
		for(var i=0;i<this.imageSrc.length;i++)
			this.image[i] = (workspace.images[this.imageSrc[i]]);
		this.imageInd = 0;

		//properties
		this.ux = workspace.w/2;
		this.uy = (workspace.h-1)/2;
		this.x = this.ux*workspace.unit;
		this.y = this.uy*workspace.unit;
		this.w = 32;
		this.h = 32;
		this.times = 0;

		//move
		this.direction = "LEFT";
		this.step = {
			"LEFT" : [-32,0,0],
			"DOWN" : [0,32,1],
			"RIGHT": [32,0,2],
			"UP"   : [0,-32,3]
		};

		this.bgWidth = workspace.width;
		this.bgHeight = workspace.height;

		// tails
		this.tails = new Array();
		
		// fill mat
		workspace.mat[this.ux][this.uy] = true;
	},

	draw: function(ctx){
		ctx.drawImage(this.image[this.imageInd],this.x,this.y)
		for(var i = 0;i<this.tails.length;i++)
			this.tails[i].draw(ctx);
	},

	update: function(dt){
		this.times++;
		if(this.times == 30) this.times = 0;
		if(this.times==0){
			var prex = this.x;
			var prey = this.y;
			var dirt = this.direction;
			this.x += this.step[this.direction][0];
			this.y += this.step[this.direction][1];
			
			//fill mat
			this.workspace.mat[prex/this.w][prey/this.h] &= ~(2);
			if(this.tails.length > 0){
				this.workspace.mat[prex/this.w][prey/this.h] |= 4;
				this.workspace.mat[this.tails[this.tails.length-1].x/this.w][this.tails[this.tails.length-1].y/this.h] &= ~(4);
			}

			//tails
			for(var i =0;i<this.tails.length;++i){
				var tmpx = this.tails[i].x;
				var tmpy = this.tails[i].y;
				var tmpd = this.tails[i].direction;
				this.tails[i].x=prex;
				this.tails[i].y=prey;
				this.tails[i].direction = dirt;
				prex = tmpx;
				prey = tmpy;
				dirt = tmpd;
			}

			//Fix
			if(this.x<0) this.x = this.bgWidth-this.w;
			else if(this.x > this.bgWidth) this.x = 0;

			if(this.y<0) this.y = this.bgHeight-this.h;
			else if(this.y > this.bgHeight) this.y = 0;

			//fill mat
			this.workspace.mat[this.x/this.w][this.y/this.h] |= 2;
		}
	},

	changeDirection: function(dirt){
		if(this.step[dirt][0]+this.step[this.direction][0] != 0){
			this.direction = dirt;
			this.imageInd  = this.step[dirt][2];
		}
	},

	addTail: function(){
		var dirt = this.direction;
		var prex = this.x;
		var prey = this.y;
		if(this.tails.length > 0){
			dirt = this.tails[this.tails.length-1].direction;
			prex = this.tails[this.tails.length-1].x;
			prey = this.tails[this.tails.length-1].y;
		}

		if(dirt === "LEFT"){
			prex = prex + this.workspace.unit;
		}
		else if(dirt === "RIGHT"){
			prex = prex - this.workspace.unit;
		}
		else if(dirt === "UP"){
			prey = prey + this.workspace.unit;
		}
		else{
			prey = prey - this.workspace.unit;
		}

		this.tails.push(Object.construct(Tail,this.workspace,prex,prey));

	},

	checkCollision: function(){
/*		var tmpx = this.x + this.step[this.direction][0];
		var tmpy = this.y + this.step[this.direction][1];

		if(tmpx<0) tmpx = this.bgWidth-this.w;
		else if(tmpx > this.bgWidth) tmpx = 0;

		if(tmpy<0) tmpy = this.bgHeight-this.h;
		else if(tmpy > this.bgHeight) tmpy = 0;*/

		if((this.workspace.mat[this.x/this.w][this.y/this.h]&4)) return true;

		return false;
	},
};

//Food
Food = {
	initialize: function(workspace){

		this.workspace = workspace;

		// image infos
		this.imageSrc =["assets/stain1.png",
             			"assets/stain2.png",
             			"assets/stain3.png"];
        this.image    = new Array(this.imageSrc.length);
		for(var i=0;i<this.imageSrc.length;i++)
			this.image[i] = (workspace.images[this.imageSrc[i]]);
		this.imageInd = Game.randomInt(0,this.image.length);

		//properties
		this.x = Game.randomInt(0,workspace.w)*workspace.unit;
		this.y = Game.randomInt(0,workspace.h)*workspace.unit;
		this.w = 32;
		this.h = 32;

		//status
		this.isVisiable = true;
	},

	update: function(dt){
		if(this.isVisiable === false)
			this.reset();
	},

	draw: function(ctx){
		if(this.isVisiable)
			ctx.drawImage(this.image[this.imageInd],this.x,this.y);
	},

	reset:function(){
		this.isVisiable = false;
		this.imageInd = Game.randomInt(0,this.image.length);
		var ux = Game.randomInt(0,this.workspace.w);
		var uy = Game.randomInt(0,this.workspace.h);
		if(this.workspace.mat[ux][uy] == 0){
			this.x = ux*this.workspace.unit;
			this.y = uy*this.workspace.unit;
			this.isVisiable = true;
		}
	}
};

// StartPage
StartPage = {
	initialize: function(workspace){
		this.imageSrc = "assets/logo.png";
		this.image    = workspace.images[this.imageSrc];

		//properties
		this.w = 256;
		this.h = 160;
		this.x = workspace.width/2-this.w/2;
		this.y = workspace.height/2-this.h/2;
	},

	draw:function(ctx){
		ctx.drawImage(this.image,this.x,this.y);
	},
};

// Game Over
Gameover = {
	initialize: function(workspace){
		this.imageSrc = "assets/gameover.png";
		this.image    = workspace.images[this.imageSrc];

		//properties
		this.w = 196;
		this.h = 50;
		this.x = workspace.width/2-this.w/2;
		this.y = workspace.height/2-this.h/2;
	},

	draw:function(ctx){
		ctx.drawImage(this.image,this.x,this.y);
	},
};

