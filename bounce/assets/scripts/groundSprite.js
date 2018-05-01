cc.Class({
    extends: cc.Component,

    properties: {
        isTouchBoll: false,

        game: {
            default: null,
            serializable: false
        },
    },

    onLoad () {

    },

    onBeginContact: function (contact, selfCollider, otherCollider) {
        if (otherCollider.node.name == "bollSprite") {
            otherCollider.node.destroy();
            if (this.isTouchBoll == false) {
                this.game.firstBollPositionX = otherCollider.node.x;
                this.isTouchBoll = true;
                this.game.isFirstBoll = true;
            }
            this.game.tampBolls ++;
            if (this.game.tampBolls == this.game.allBolls) {    
                this.game.allBolls += this.game.addBolls;
                this.game.addBolls = 0;
                this.game.bollDown = true;
                this.game.tampBolls = 0;
                this.isTouchBoll = false;
                this.game.isActivity = false;
                this.game.allBollsLabel.enabled = true;
                this.game.allBollsLabel.getComponent(cc.Label).string = "x " + this.game.allBolls;
                this.game.allBollsLabel.node.setPosition(cc.v2(this.game.firstBollPositionX - 30, -315));
            }
        }
    },

    start () {

    },

});
