cc.Class({
    extends: cc.Component,

    properties: {

        game: {
            default: null,
            serializable: false
        },
    },

    onLoad () {

    },

    onBeginContact: function (contact, selfCollider, otherCollider) {
        // console.log(selfCollider, otherCollider);
        if (otherCollider.node.name == "bollSprite") {
            this.game.bollDownGround();
            this.game.bollDown = true;
        }
    },

    start () {

    },

    // update (dt) {},
});
