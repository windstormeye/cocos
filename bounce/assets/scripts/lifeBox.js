
cc.Class({
    extends: cc.Component,

    properties: {
       
    },

    onBeginContact: function (contact, selfCollider, otherCollider) {
        if (otherCollider.node.name == "bollSprite") {
            selfCollider.node.destroy();
        }
    }

});
