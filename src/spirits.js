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
		this.x = workspace.w/2*workspace.unit;
		this.y = (workspace.h-1)/2*workspace.unit;
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
		//test tail
		/*for(var i = 1;i<=4;i++){
			this.tails.push(Object.construct(Tail,workspace,this.x+30*i,this.y));
		}*/
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

		var obj = Object.construct(Tail,this.workspace,prex,prey);
		if(dirt === "LEFT"){
			obj.x = prex + this.workspace.unit;
		}
		else if(dirt === "RIGHT"){
			obj.x = prex - this.workspace.unit;
		}
		else if(dirt === "UP"){
			obj.y = prey + this.workspace.unit;
		}
		else{
			obj.y = prey - this.workspace.unit;
		}

		this.tails.push(obj);

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

	},

	draw: function(ctx){
		if(this.isVisiable)
			ctx.drawImage(this.image[this.imageInd],this.x,this.y);
	},

	reset:function(){
		this.imageInd = Game.randomInt(0,this.image.length);
		this.x = Game.randomInt(0,this.workspace.w)*this.workspace.unit;
		this.y = Game.randomInt(0,this.workspace.h)*this.workspace.unit;
	}
};