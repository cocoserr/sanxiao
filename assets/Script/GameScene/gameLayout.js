cc.Class({
    extends: cc.Component,

    properties: {
  
        Col:0,
        Row:0,
        Padding:0,
        SpacingX:0,
        SpacingY:0,
        star:{
            default:null,
            type:cc.Prefab
        },
        Score:{
            default:null,
            type:cc.Node
        },
        canvas:cc.Node
    },
    reward:0,
    pSet:null,//坐标矩阵集合
    stars:null,
    mask:null,
    onLoad: function () {
        this.beginX = 0;
        this.beginY = 0
        this.buildCoordinateSet();//根据配置信息生成每个元素的坐标点集合
        this.init();
         //this.check();
         this.touch()
        
        
    },
     start:function(){
       this.check();  
     },
    init:function(){//初始化函数，生成star节点，添加监听事件
        var node=this.node;
        this.mask=[];
        this.stars=[];
        var pSet=this.pSet;
        for(var i=0;i<this.Row;i++){
            var arr1=[];
            var marr=[];
            for(var j=0;j<this.Col;j++){
                var ele=cc.instantiate(this.star);
                ele.setPosition(pSet[i][j].x,pSet[i][j].y);
                node.addChild(ele,0,"ele");
                // pSet[i][j] =ele
                //this.addTouchEvents(ele);
                var com=ele.getComponent('Star');
                com.pos=cc.v2(i,j);
                arr1.push(ele);
                marr.push(0);
            }
            this.mask.push(marr);
            this.stars.push(arr1);
        }
    },
    check:function(){
        if(this.checkConnected()){
            this.delAndDrop();
        }
    },

    buildCoordinateSet:function(){//根据配置信息生成每个元素的坐标点对象
        var ele=cc.instantiate(this.star);
        var eleSize=ele.getContentSize();
        this.eleSize =eleSize
        this.beginX=(this.node.width-(this.Row-1)*(this.SpacingX+eleSize.width))/2;
        this.beginY=this.Padding+eleSize.height/2;
        this.pSet=[];        
        for(var i=0;i<this.Row;i++){
            var arr=[];
            for(var j=0;j<this.Col+1;j++){
                 var position=cc.v2( this.beginX+i*(eleSize.width+this.SpacingX),this.beginY+j*(eleSize.height+this.SpacingY));
                // window.console.log(position.toString());
                arr.push(position);
            }
            this.pSet.push(arr);
        }
        
    },
    PositionToPos:function(x,y){//屏幕坐标转矩阵坐标
      
        var pos=cc.v2(Math.floor((x - this.beginX)/(this.eleSize.width+this.SpacingX)+0.5),Math.floor((y-this.beginY)/(this.eleSize.height+this.SpacingY)+0.5));
        return pos;
    },
    // addTouchEvents:function(node){//添加触摸监听事件
    //     this.p1=null;
    //     var p2=null;
    //   // window.console.log("m"+this);
    //   var cur=null
    //     node.on('touchstart',function(event){//传回节点位置
    //         node.select=true;
    //         node.zIndex = 1
    //          cur=node.position
    //         this.p1=node.getComponent('Star').pos;
    //          window.console.log('p1',this.p1);
    //     },this);
    //     node.on('touchmove',function(event){
    //         if(node.select){
    //             var x=event.getLocationX();
    //             var y=event.getLocationY();
    //             if(x>=(cur.x - this.eleSize.width-this.SpacingX)&&x<=(cur.x + this.eleSize.width+this.SpacingX )&&
    //             y<=(cur.y + this.eleSize.height+this.SpacingY)&&y>=(cur.y - this.eleSize.height-this.SpacingY))
    //             {
    //             node.setPosition(x,y);
    //              //window.console.log('x,y',x+" "+y);
    //             }
    //             // else{
    //             //      node.setPosition(cur);
    //             // }
    //         }
    //     },this);
    //     this.canvas.on('touchend',function(event){
         
    //         node.select=false;
    //         node.zIndex = 0
    //         var x=event.getLocationX();
    //         var y=event.getLocationY();
    //         var p=this.canvas.convertToNodeSpace(event.getLocation());
    //         // cc.log('p',p)
    //         p2=this.PositionToPos(p.x,p.y);
    //          window.console.log('p2',p2);
    //          //cc.log('p2',p2.x)
    //             var cell = this.stars[p2.x][p2.y]
    //             cc.log(cell)
    //         if(this.isAround(this.p1,p2)&&typeof(this.stars[p2.x][p2.y])!='undefined'){
    //             //window.console.log('isAround');
    //             this.changeTwoPos(this.p1,p2);
                   
    //         if(this.checkConnected()){
    //             this.delAndDrop();
    //         }else{
    //           this.changeTwoPos(p2,this.p1);
    //         }
    //         }else{
    //           // node.setPosition(this.pSet[this.p1.x][this.p1.y]);
    //         }
            
    //     },this);

        
        
    // },
        touch:function(){
         this.node.on('touchstart',function(event){//传回节点位置
            cc.log('touchstart')
             var p=this.node.convertToNodeSpace(event.getLocation());
             this.p1=this.PositionToPos(p.x,p.y);
             if(this.p1.x <0||this.p1.x >this.Row -1||this.p1.y<0||this.p1.y>this.Col-1){
                 return
             }
             cc.log('p1',this.p1)
             this.cell1 = this.stars[this.p1.x][this.p1.y]
             this.cur =this.pSet[this.p1.x][this.p1.y]
             this.cell1.select =true
             this.cell1.zIndex = 1
        },this);
        this.node.on('touchmove',function(event){
            cc.log('touchmove')
            if(this.cell1.select){
                var x=event.getLocationX();
                var y=event.getLocationY();
                 if(x>=(this.cur.x - this.eleSize.width-this.SpacingX)&&x<=(this.cur.x + this.eleSize.width+this.SpacingX )&&
                y<=(this.cur.y + this.eleSize.height+this.SpacingY)&&y>=(this.cur.y - this.eleSize.height-this.SpacingY))
                {
                this.cell1.setPosition(x,y);
                 }
            }
                
        },this);
        this.node.on('touchend',function(event){
            cc.log('touchend')
           
             var p=this.node.convertToNodeSpace(event.getLocation());
             this.p2=this.PositionToPos(p.x,p.y);
             if(this.p2.x <0||this.p2.x >this.Row -1||this.p2.y<0||this.p2.y>this.Col-1){
                 this.cell1.setPosition(this.cur);
                 return
             }
            cc.log('p2',this.p2)
            this.cell1.select =false
            this.cell1.zIndex = 0
             this.cell2 = this.stars[this.p2.x][this.p2.y]
             if(this.isAround(this.p1,this.p2)&&typeof(this.stars[this.p2.x][this.p2.y]) !='undefined'){
                 this.changeTwoPos(this.p1,this.p2);
                  if(this.checkConnected()){
                this.delAndDrop();
            }else{
              this.changeTwoPos(this.p2,this.p1);
            }
             }else{
              this.cell1.setPosition(this.cur);
             }
        },this);
    },
 
    isAround:function(p1,p2){//判断矩阵坐标p2是否与p1相邻
        var dis=Math.abs((p2.x-p1.x)+(p2.y-p1.y));
        // window.console.log(dis);
        if(dis==1){
            return true;
        }
        return false;
    },
    changeTwoPos:function(p1,p2){//交换两个star的位置 包括自身存储的位置信息与stars数组内的实例交换
        this.stars[p1.x][p1.y].getComponent('Star').pos=p2;
        this.stars[p1.x][p1.y].setPosition(this.pSet[p2.x][p2.y]);
        this.stars[p2.x][p2.y].getComponent('Star').pos=p1;
        this.stars[p2.x][p2.y].setPosition(this.pSet[p1.x][p1.y]);
        var t=this.stars[p1.x][p1.y];
        this.stars[p1.x][p1.y]=this.stars[p2.x][p2.y];
        this.stars[p2.x][p2.y]=t;
    },
    delAndDrop:function(){
        
        this.deleteConnected();
        this.dropAndUpdata();

    },
    checkConnected:function(){
        var count1=this.verticalCheckConnected();
        var count2=this.horizontalCheckConnected();

        this.reward=this.calScore(count1+count2);//奖励分数
        // window.console.log(this.reward +"rew");

        return ((count1+count2)>0)?true:false;
    },
    calScore:function(num){//计算分数
        return num*10;

    },
    verticalCheckConnected:function(){//纵向检查star的相连形况
        var index1,index2;
        var start,end;
        var count=0;//记录需要删除的star数
        for(var i=0;i<this.stars.length;i++){
            if(typeof(this.stars[i][0])=='undefined'){
                continue;
            }
            index1=this.stars[i][0].getComponent('Star').sfIndex;
            start=0;
            for(var j=1;j<=this.stars[i].length;j++){
                if(j==this.stars[i].length){//当到达边界值时
                    index2=-1;
                }else{
                    index2=this.stars[i][j].getComponent('Star').sfIndex;
                }
                
                if(index1!=index2){
                    end=j;
                    if(end-start>=3){
                        while(start!=end){
                            this.mask[i][start]=1;
                            start++;
                            count++;
                        }
                    }
                    start=end;
                    if(start!=this.stars[i].length){
                        index1=this.stars[i][start].getComponent('Star').sfIndex;
                    }
                    
                }
            }
        }
        return count;
    },
    horizontalCheckConnected:function(){//横向检查star的相连情况
        var index1,index2;
        var start,end;
        var count=0;//记录需删除的star数
        for(var j=0;j<this.Col;j++){
            for(var i=0;i<this.Row;){
                if(typeof(this.stars[i][j])=='undefined'){
                    i++;
                    continue;
                }
                index1=this.stars[i][j].getComponent('Star').sfIndex;
                var begin=i;
                end=begin;
                while(end<this.Row){
                    if(typeof(this.stars[end][j])=='undefined'){
                        if(end-begin>=3){
                            while(begin!=end){ 
                                if(this.mask[begin][j]!=1){
                                    this.mask[begin][j]=1;
                                    count++;
                                }
                                begin++;
                            }
                        }
                        break;
                    }
                    index2=this.stars[end][j].getComponent('Star').sfIndex;
                    if(index1!=index2){
                        if(end-begin>=3){
                            while(begin!=end){ 
                                if(this.mask[begin][j]!=1){
                                    this.mask[begin][j]=1;
                                    count++;
                                }
                                begin++;
                            }
                        }
                        break;
                    }
                    end++;
                }
                if(end==this.Row&&end-begin>=3){
                    while(begin!=end){ 
                        if(this.mask[begin][j]!=1){
                            this.mask[begin][j]=1;
                            count++;
                        }
                        begin++;
                    }
                }
                i=end;
                
            }
        }
        return count;
    },

    deleteConnected:function(){//根据mask的状态信息删除相连的star
          var pSet=this.pSet;
        for(var i=0;i<this.Row;i++){
            var count=0;
            var start=0,end;
            var onoff=true;
            for(var j=this.Col-1;j>=0;j--){
                if(this.mask[i][j]==1){
                    if(onoff){
                        start=j;
                        onoff=false;
                    }
                    var ele=cc.instantiate(this.star);
                    ele.setPosition(pSet[i][this.Col].x,pSet[i][this.Col].y);
                    this.node.addChild(ele,0,"ele");
                    //this.addTouchEvents(ele);
                    this.stars[i].push(ele)
                    var act=cc.sequence(cc.blink(0.2,1),cc.scaleBy(0.5,0,0));//消失动画
                    this.stars[i][j].runAction(act);
                }
                if((this.mask[i][j-1]!=1||j-1<0)&&onoff==false){
                    end=j;
                    this.stars[i].splice(end,start-end+1);//删除star实例
                    onoff=true;
                }
                this.mask[i][j]=0;
            }
        }
        this.updateScore();//删除相连的stars后更新分数显示
    },

    dropAndUpdata:function(){//下落动画以及更新位置信息
        var finished=cc.callFunc(function(target){
            this.check();
            
        },this);

        for(var i=0;i<this.stars.length;i++){
            for(var j=0;j<this.stars[i].length;j++){
                if(i==this.stars.length-1&&j==this.stars[i].length-1){
                    var act=cc.sequence(cc.moveTo(1,this.pSet[i][j]),finished);
                }else{
                    var act=cc.moveTo(1,this.pSet[i][j]);
                }
                this.stars[i][j].runAction(act);
                var com=this.stars[i][j].getComponent('Star');
                com.pos=cc.v2(i,j);

            }
        }
        
    },
    updateScore:function(){
        var score=this.Score.getComponent('Score');//更新分数显示
        score.setReward(this.reward);
        score.updateScore();
    }

    

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
