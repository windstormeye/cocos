cc.Class({
    extends: cc.Component,

    properties: {
       
    },

    onBeginContact: function (contact, selfCollider, otherCollider) {
        if (otherCollider.node.name == "boxSprite") {
            // 拿到label
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
    },

    onLoad () {
        
    },

    start () {

    },

    // update (dt) {},
});
