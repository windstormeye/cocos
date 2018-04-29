// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {

        bollDown: false,

        bollSprite: {
            default: null,
            type: cc.Node
        },

        boxPrefab: {
            default: null,
            type: cc.Prefab,
        },

        ground: {
            default: null,
            type: cc.Node
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.director.getPhysicsManager().enabled = true;
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        manager.enabledDebugDraw = true;
        
        this.ground.getComponent('groundSprite').game = this;
        this.initBox();
    },

    initBox: function () {
        for (var i = 0; i < 6; i++) {
            let isBox = Math.ceil(Math.random() * 10) % 2;
            if (isBox == 1) {
                var newBox = cc.instantiate(this.boxPrefab);
                this.node.addChild(newBox);
                newBox.setPosition(-263 + i * (95 + 10), 450);
            }
        }
    },

    bollDownGround: function () {
        this.initBox();
        this.bollDown = true;
    },

    onCollisionEnter: function (other, self) {
        console.log('2333');
    },

    onCollisionExit: function (other, self) {
        console.log('4666');
    },

    start () {
        
    },

    update (dt) {
        if (this.bollDown == true) {
            var childrenNode = this.node.children;
            for (var i = 0; i < childrenNode.length; i++) {
                var node = childrenNode[i];
                var box = node.getComponent(cc.Sprite);
                console.log(node.name);
                if (node.name == "boxSprite" && box.tag == 0) {
                    node.y -= 100;
                    box.tag = 1;
                    // node.runAction(moveTo(node.x, node.y - 100));
                }
            }
            this.bollDown == false;
        }
    },

    // 只在两个碰撞体开始接触时被调用一次
    onBeginContact: function (contact, selfCollider, otherCollider) {
        console.log("aha?");
    },

    // 只在两个碰撞体结束接触时被调用一次
    onEndContact: function (contact, selfCollider, otherCollider) {
        console.log("2333?");
    },

    // 每次将要处理碰撞体接触逻辑时被调用
    onPreSolve: function (contact, selfCollider, otherCollider) {
    },

    // 每次处理完碰撞体接触逻辑时被调用
    onPostSolve: function (contact, selfCollider, otherCollider) {
    },
});
