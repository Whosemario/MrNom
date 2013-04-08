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

	},

	draw: function(ctx){
		ctx.drawImage(this.image,this.x,this.y);
	},
};

// Snake Head
Snake = {

	initialize: function(workspace) {
		// image infos
		this.imageSrc = ["assets/headleft.png",
						 "assets/headdown.png",
						 "assets/headright.png",
						 "assets/headup.png"];
		this.image    = new Array();
		for(var i=0;i<this.imageSrc.length;i++)
			this.image.push(workspace.images[this.imageSrc[i]]);
		this.imageInd = 0;

		//properties
		this.x = 5;
		this.y = 5;
		this.w = 42;
		this.h = 42;
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
		for(var i = 0;i<=3;i++){
			this.tails.push(Object.construct(Tail,workspace,this.x+42+30*i,this.y));
		}
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
			this.x += this.step[this.direction][0];
			this.y += this.step[this.direction][1];
			
			//tails
			for(var i =0;i<this.tails.length;++i){
				var tmpx = this.tails[i].x;
				var tmpy = this.tails[i].y;
				this.tails[i].x=prex;
				this.tails[i].y=prey;
				prex = tmpx;
				prey = tmpy;
			}

			//Fix
			if(this.x<-this.w) this.x = this.bgWidth;
			else if(this.x > this.bgWidth) this.x = -this.w;

			if(this.y<-this.h) this.y = this.bgHeight;
			else if(this.y > this.bgHeight) this.y = -this.h;
		}
	},

	changeDirection: function(dirt){
		if(this.step[dirt][0]+this.step[this.direction][0] != 0){
			this.direction = dirt;
			this.imageInd  = this.step[dirt][2];
		}
	},
};