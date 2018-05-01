cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    onBeginContact: function (contact, selfCollider, otherCollider) {
        if (otherCollider.node.name == "boxSprite") {
            cc.audioEngine.playEffect(selfCollider.node.game.rockAudio, false);
            var box = otherCollider.getComponent(cc.Sprite);
            var label = box.getComponentInChildren(cc.Label);
            var labelValue =  parseInt(label.string);
            // 判断label数值是否为1
            if (labelValue == 1) {
                box.node.destroy();
            } else {    
                label.string = (--labelValue).toString();
            }
        }
        if (otherCollider.node.name == "lifeBox") {
            cc.audioEngine.playEffect(selfCollider.node.game.circleAudio, false);
            otherCollider.node.destroy();
            selfCollider.node.game.addBolls ++;
        }
    },
});
