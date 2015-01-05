/**
 * Created by dyq on 2014/9/19.
 */
$().ready(function(){
    function Fish(){}
    Fish.prototype = {
        x:0,
        y:0,
        width:0,
        height:0,
        volocityX: 1,/*横向速度*/
        volocityY: 1,/*纵向速度*/
        context: null,
        isMove: true,/*是否在移动*/
        actions:[],
        actionIndex:0,
        src: "./img/bz.png",
        targetPosition: {/*移动的目标位置*/
            x: 0,
            y: 0
        },
        painer: function(){
            this.context.clearRect(0, 0, context.canvas.width, context.canvas.height);
            this.context.drawImage(fishImg, this.actions[(this.actionIndex >= this.actions.length) ? 0 : this.actionIndex++].x,
                this.actions[this.actionIndex >= this.actions.length ? 0 : this.actionIndex++].y, this.width, this.height, this.x, this.y, this.width, this.height);
            requestNextAnimationFrame(this.painer);
        },
        setActions: function(){
            this.actions = [{x:this.width,y:this.height}, {x:this.width*1,y:this.height},{x:this.width*2,y:this.height}, {x:this.width*3,y:this.height}, {x:this.width*4,y:this.height}, {x:this.width*5,y:this.height},
                {x:this.width,y:this.height*1}, {x:this.width*1,y:this.height*1},{x:this.width*2,y:this.height*1}, {x:this.width*3,y:this.height*1}, {x:this.width*4,y:this.height*1}, {x:this.width*5,y:this.height*1},
                {x:this.width,y:this.height*2}, {x:this.width*1,y:this.height*2},{x:this.width*2,y:this.height*2}, {x:this.width*3,y:this.height*2}, {x:this.width*4,y:this.height*2}, {x:this.width*5,y:this.height*2},
                {x:this.width,y:this.height*3}, {x:this.width*1,y:this.height*3},{x:this.width*2,y:this.height*3}, {x:this.width*3,y:this.height*3}, {x:this.width*4,y:this.height*3}, {x:this.width*5,y:this.height*3},
                {x:this.width,y:this.height*4}, {x:this.width*1,y:this.height*4},{x:this.width*2,y:this.height*4}, {x:this.width*3,y:this.height*4}, {x:this.width*4,y:this.height*4}, {x:this.width*5,y:this.height*4}]
            return this;
        },
        setSrc: function(src){
            this.src = src;
            return src;
        },
        setX: function(x){
            this.x = x;
            return this;
        },
        setY: function(y){
            this.y = y;
            return this;
        },
        setContext: function(context){
            this.context = context;
            return this;
        },
        setWidth: function(width){
            this.width = width;
            return this;
        },
        setHeight: function(height){
            this.height = height;
            return this;
        },
        setVolocityX: function(volocityX){
            this.volocityX = volocityX;
            return this;
        },
        setVolocityY: function(volocityY){
            this.volocityY = volocityY;
            return this;
        },
        setTargetPosition: function(target){
            this.targetPosition = target;
            return this;
        }
    };
    var toCanvas = $("#toCanvas"),
        util = $.myUtil,
        canvas = document.getElementById("canvas"),
        context = canvas.getContext("2d"),
        fishImg = new Image();
    fishImg.src = "./img/bz.png";

    toCanvas.click(function(event){
        var targetPosition = util.getPoint(canvas, event),
            fish = new Fish();
        fish.setX(targetPosition.x)
            .setY(targetPosition.y)
            .setWidth(128)
            .setHeight(123)
            .setActions()
            .setContext(context);
        requestNextAnimationFrame(painer);

        function painer(){
            context.clearRect(0, 0, context.canvas.width, context.canvas.height);
            var index = (fish.actionIndex >= fish.actions.length) ? 0 : fish.actionIndex++;
            context.drawImage(fishImg, fish.actions[index].x,
                fish.actions[index].y, fish.width, fish.height, fish.x-fish.width/2, fish.y-fish.height/2, fish.width, fish.height);
            if(index >= fish.actions.length-1){
                context.clearRect(0, 0, context.canvas.width, context.canvas.height);
                fish.actionIndex = 0;
                return;
            };
            requestNextAnimationFrame(painer);
        }
    });
});