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
        level: 1,

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

        rockAudio: {
            default: null,
            url: cc.AudioClip,
        },

        circleAudio: {
            default: null,
            url: cc.AudioClip,
        },
    },

    onLoad () {
        // 开启物理
        cc.director.getPhysicsManager().enabled = true;
        // 开启碰撞
        cc.director.getCollisionManager().enabled = true;

        this.indexBoll.node.setPosition(cc.v2(this.firstBollPositionX, -350));
        this.ballLink.node.setPosition(cc.v2(this.firstBollPositionX, -350));   
        this.ballLink.enabled = false;
        this.ground.getComponent('groundSprite').game = this;
        this.initBox();
        this.allBolls = 1;
        this.level = 1;

        this.node.on(cc.Node.EventType.TOUCH_START, function(event){
            this.touchStart(event);
        }.bind(this), this);

        this.node.on(cc.Node.EventType.TOUCH_MOVE, function(event){
            this.touchMove(event);            
        }.bind(this), this);

        this.node.on(cc.Node.EventType.TOUCH_END, function(event){
            this.touchEnd(event);
        }.bind(this), this);

        // 生成第一层小球
        for (var i = 0; i < 6; i++) {
            let isBox = Math.ceil(Math.random() * 10) % 2;
            if (isBox == 1) {
                var newBox = cc.instantiate(this.boxPrefab);
                this.node.addChild(newBox);
                newBox.setPosition(-263 + i * (95 + 10), 450);
                var colorArr = this.hslToRgb(this.level * 0.025, 0.5, 0.5);
                newBox.setColor(cc.color(colorArr[0], colorArr[1], colorArr[2]));
            }
        }

    },

    initBox: function () {   
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
                            this.showGameOver();
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
                        var colorArr = this.hslToRgb(this.level * 0.025, 0.5, 0.5);
                        newBox.setColor(cc.color(colorArr[0], colorArr[1], colorArr[2]));
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

    showGameOver: function () {
        cc.director.loadScene('bounceGame');
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

    hslToRgb: function (h, s, l) {
        var r, g, b;
    
        if(s == 0) {
            r = g = b = l; // achromatic
        } else {
            var hue2rgb = function hue2rgb(p, q, t) {
                if(t < 0) t += 1;
                if(t > 1) t -= 1;
                if(t < 1/6) return p + (q - p) * 6 * t;
                if(t < 1/2) return q;
                if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            }
    
            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }
    
        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }

});
