/**
 * Created by MIC on 2015/12/29.
 */

import {BiliBiliDamakuApiObject} from "./BiliBiliDamakuApiObject";
import {BiliBiliDanmakuApiContainer} from "../BiliBiliDanmakuApiContainer";
import {_util} from "../../../lib/glantern/src/_util/_util";
import {FiniteTimer} from "../../danmaku/code/dco/FiniteTimer";

export class Utils extends BiliBiliDamakuApiObject {

    constructor(apiContainer:BiliBiliDanmakuApiContainer) {
        super(apiContainer);
        this._date = new Date();
    }

    hue(v:number):number {
        v = v % 360;
        // http://blog.sina.com.cn/s/blog_5de73d0b0101baxq.html
        var lambda = v / 60 * 255;
        var r = _util.limitInto(510 - lambda, 0, 255);
        var g = _util.limitInto(v < 180 ? lambda : lambda - 510, 0, 255);
        var b = _util.limitInto(v < 180 ? lambda - 510 : lambda, 0, 255);
        return (0xff << 24) | (r << 16) | (g << 8) | b;
    }

    rgb(r:number, g:number, b:number):number {
        r = _util.limitInto(r, 0, 255);
        g = _util.limitInto(g, 0, 255);
        b = _util.limitInto(b, 0, 255);
        return (0xff << 24) | (r << 16) | (g << 8) | b;
    }

    formatTimes(time:number):string {
        this._date.setTime(time * 1000);
        return this._date.toLocaleString();
    }

    delay(source:string, delay:number):number;
    delay(closure:Function, delay:number):number;

    delay(obj:any, delay:number):number {
        return window.setTimeout(obj, delay);
    }

    interval(source:string, delay:number, times:number):FiniteTimer;
    interval(closure:Function, delay:number, times:number):FiniteTimer;

    interval(obj:any, delay:number, times:number):FiniteTimer {
        return new FiniteTimer(obj, delay, times);
    }

    distance(x1:number, y1:number, x2:number, y2:number):number {
        return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
    }

    rand(min:number, max:number):number {
        console.assert(min < max, "'max' must be bigger than 'min'.");
        return Math.random() * (max - min) + min;
    }

    private _date:Date = null;

}