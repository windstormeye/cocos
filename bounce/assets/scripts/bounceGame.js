cc.Class({
    extends: cc.Component,

    properties: {
        // 所有boll是否均落下
        bollDown: false,
        // 是否开始游戏
        isBegin: false,
        // 是否在游戏中
        isActivity: false,
        // 第一个boll是否触底
        isFirstBoll: false,
        // 第一个触底的boll X坐标
        firstBollPositionX: 0,
        // 所有小球计数
        allBolls: 0,
        // 所有触底小球计数
        tampBolls: 0,
        addBolls: 0,
        level: 0,

        // 标记第一个触底boll的boll
        indexBoll: {
            default: null,
            type: cc.Sprite,
        },

        boxPrefab: {
            default: null,
            type: cc.Prefab,
        },

        bollPrefab: {
            default: null,
            type: cc.Prefab,
        },

        lifePrefab: {
            default: null,
            type: cc.Prefab,
        },

        // 地面
        ground: {
            default: null,
            type: cc.Node
        },

        // 轨迹条
        ballLink: {
            default: null,
            type: cc.Sprite,
        },

        levelLabel: {
            default: null,
            type: cc.Label,
        },

        allBollsLabel: {
            default: null,
            type: cc.Label,
        },
    },

    onLoad () {
        // 开启物理
        cc.director.getPhysicsManager().enabled = true;
        // 开启碰撞
        cc.director.getCollisionManager().enabled = true;
    
        for (var i = 0; i < 6; i++) {
            let isBox = Math.ceil(Math.random() * 10) % 2;
            if (isBox == 1) {
                var newBox = cc.instantiate(this.boxPrefab);
                this.node.addChild(newBox);
                newBox.setPosition(-263 + i * (95 + 10), 450);
            }
        }

        this.indexBoll.node.setPosition(cc.v2(this.firstBollPositionX, -350));
        this.ballLink.node.setPosition(cc.v2(this.firstBollPositionX, -350));   
        this.ballLink.enabled = false;
        this.ground.getComponent('groundSprite').game = this;
        this.initBox();
        this.allBolls = 1;

        this.node.on(cc.Node.EventType.TOUCH_START, function(event){
            this.touchStart(event);
        }.bind(this), this);

        this.node.on(cc.Node.EventType.TOUCH_MOVE, function(event){
            this.touchMove(event);            
        }.bind(this), this);

        this.node.on(cc.Node.EventType.TOUCH_END, function(event){
            this.touchEnd(event);
        }.bind(this), this);

    },

    initBox: function () {   
        this.allBollsLabel.node.setPosition(cc.v2(this.firstBollPositionX - 30, -315));
        this.level ++;
        this.levelLabel.getComponent(cc.Label).string = "分数：" + this.level;
        // 下移box
        if (this.isBegin == true) {
            var childrenNode = this.node.children;
            for (var i = 0; i < childrenNode.length; i++) {
                var node = childrenNode[i];
                if (node.name == "boxSprite" || node.name == "lifeBox") {
                    if (node.position.y <= 450) {
                        node.y -= 100;
                        if (node.y == -350) {
                            this.gameOver();
                        }
                    }
                }
            }
            // createBox
            var isShowLifeBox = false;
            for (var i = 0; i < 6; i++) {
                let isBox = Math.ceil(Math.random() * 10) % 2;
                if (isBox == 1) {
                    let isLife = Math.ceil(Math.random() * 10) % 2;
                    if (isLife == true && isShowLifeBox == false) {
                        isShowLifeBox = true;
                        var lifeBox = cc.instantiate(this.lifePrefab);
                        lifeBox.setPosition(-263 + i * (95 + 10), 450);
                        this.node.addChild(lifeBox);
                    } else {
                        var newBox = cc.instantiate(this.boxPrefab);
                        var scoreLabel = newBox.children[0];
                        let isDouble = Math.ceil(Math.random() * 10) % 2;
                        if (isDouble == 1) {
                            scoreLabel.getComponent(cc.Label).string = 2 * this.level;
                        } else {
                            scoreLabel.getComponent(cc.Label).string = this.level;
                        }
                        this.node.addChild(newBox);
                        newBox.setPosition(-263 + i * (95 + 10), 450);
                    }
                }
            }

            this.bollDown = false;
        }
    },

    touchStart: function (event) {
        this.ballLink.node.setPosition(cc.v2(this.firstBollPositionX, -350));
    },

    touchMove: function(event) {
        if (this.isActivity == false) {
            this.ballLink.enabled = true;
            this.allBollsLabel.enabled = true;

            var touchX = event.touch._point.x;
            this.ballLink.node.setRotation(touchX);
            if (this.ballLink.node.rotation < 280) {
                this.ballLink.node.setRotation(280);
            }
            if (this.ballLink.node.rotation > 440) {
                this.ballLink.node.setRotation(440);
            }
        }
        
    },

    touchEnd: function (event) {
        if (this.isActivity == false) {
            this.ballLink.enabled = false;
            this.allBollsLabel.enabled = false;
            if (this.isBegin == false) {
                this.isBegin = true;
            }
            this.schedule(function(){
                var boll = cc.instantiate(this.bollPrefab);
                this.node.addChild(boll);
                boll.game = this;
                boll.setPosition(cc.v2(this.firstBollPositionX, -350));
                var boxRigidBody = boll.getComponent(cc.RigidBody);
                var angle = -this.ballLink.node.rotation - 270;
                var toX = Math.cos(angle * 0.017453293) * 100;
                var toY = Math.sin(angle * 0.017453293) * 100;
                boxRigidBody.linearVelocity = cc.v2(toX * 10, toY * 10);
            }.bind(this), 0.08, this.allBolls - 1)
            
            this.schedule(function(){
                this.indexBoll.enabled = false;
                this.isFirstBoll = false;
            }.bind(this), 0.08 * (this.allBolls - 1), 1);

            this.isActivity = true;
        }
    },

    gameOver: function () {

    },

    update (dt) {
        if (this.bollDown == true) {
            this.initBox();
        }
        
        if(this.isFirstBoll == true) {
            this.indexBoll.enabled = true;
            this.indexBoll.node.setPosition(cc.v2(this.firstBollPositionX, -350));
        }
    },
});
