/**
 * Created by MIC on 2016/7/15.
 */

import ErrorBase from "../../../../lib/glantern/src/gl/mic/ErrorBase";

export default class OutOfRangeError extends ErrorBase {

    get name(): string {
        return "OutOfRangeError";
    }

}
