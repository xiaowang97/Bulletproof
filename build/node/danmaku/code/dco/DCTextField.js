/**
 * Created by MIC on 2015/12/29.
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DCOHelper_1 = require("./DCOHelper");
var TextField_1 = require("../../../../lib/glantern/src/flash/text/TextField");
var DCTextField = (function (_super) {
    __extends(DCTextField, _super);
    function DCTextField(root, parent, createParams, extraCreateParams) {
        _super.call(this, root, parent);
        this._extraCreateParams = null;
        this._createParams = null;
        this._createParams = DCOHelper_1.DCOHelper.fillInCreateParams(extraCreateParams.bulletproof, this, createParams);
        this._extraCreateParams = extraCreateParams;
        DCOHelper_1.DCOHelper.applyGeneralCreateParams(this, this._createParams);
    }
    Object.defineProperty(DCTextField.prototype, "createParams", {
        get: function () {
            return this._createParams;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DCTextField.prototype, "extraCreateParams", {
        get: function () {
            return this._extraCreateParams;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DCTextField.prototype, "isCreatedByDanmaku", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    return DCTextField;
})(TextField_1.TextField);
exports.DCTextField = DCTextField;

//# sourceMappingURL=DCTextField.js.map