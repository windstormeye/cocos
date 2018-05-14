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
            var colorArr = this.hslToRgb(labelValue * 0.025, 0.5, 0.5);
            box.node.setColor(cc.color(colorArr[0], colorArr[1], colorArr[2]));
        }
        if (otherCollider.node.name == "lifeBox") {
            cc.audioEngine.playEffect(selfCollider.node.game.circleAudio, false);
            otherCollider.node.destroy();
            selfCollider.node.game.addBolls ++;
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
