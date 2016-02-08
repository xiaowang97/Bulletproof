/**
 * Created by MIC on 2015/12/29.
 */

/**
 * @type {Bulletproof}
 */
var bp = null;
/**
 * @type {number}
 * @private
 */
var __timerHandle = 0;

window.document.body.onload = function () {
    initEnv();
    initList();
};

window.addEventListener("beforeunload", function (ev) {
    if (!bp) {
        return;
    }
    uninitFps();
    bp.dispose();
    bp = null;
});

function initEnv() {
    if (Bulletproof.isSupported()) {
        bp = new Bulletproof.Bulletproof();
        bp.initialize(682, 438);
        (function (selector) {
            var elem = document.querySelector(selector);
            elem.appendChild(bp.videoView);
            bp.videoView.style.position = "absolute";
            bp.videoView.style.zIndex = "1";
            elem.appendChild(bp.view);
            bp.view.style.position = "absolute";
            bp.view.style.zIndex = "9999";
        })("#glantern-container");
    }
}

function initList() {
    var testCases = {
        "Blank": "",
        "3D ball": "3d-ball.js",
        "Green Dam Musume": "kanpai-green-dam.js",
        "Madoka and her happy <del>tree</del> friends": "kanpai-madoka.js"
    };

    var caseListElem = document.querySelector("#test-case-selector");
    if (Bulletproof.isSupported() && bp) {
        initListNormal();
    } else {
        initListOnFailure();
    }

    function onClick(ev) {
        /**
         * @type {HTMLAnchorElement}
         */
        var aElem = this;
        var e;
        e = document.querySelector("#test-case-selector-container");
        e.style.display = "none";
        e = document.querySelector("#test-case-desc");
        e.textContent = aElem.name || "(blank)";
        e = document.querySelector("#playground");
        e.style.display = "block";
        if (aElem.name) {
            executeCodeDanmakuContent(aElem.name);
        }
        initFps();
        bp.startAnimation();
    }

    /**
     * Execute a single script by injecting the script into the window.
     * @param fileName {String} Full JavaScript file name.
     */
    function executeCodeDanmakuContent(fileName) {
        var content;
        if (typeof global !== typeof undefined) {
            // In Node.js environments
            var fs = require("fs");
            content = fs.readFileSync(fileName, "utf-8");
        } else {
            // In common browsers
            // Note: Please view on a server. Local file access is forbidden due to safety restrictions.
            content = loadFileSync(fileName);
        }
        var codeProvider = bp.danmakuCoordinator.getDanmakuProvider(Bulletproof.danmaku.DanmakuKind.Code);
        codeProvider.addDanmaku(content);
    }

    /**
     * Load a text file content from specified path.
     * @param path {String} The file path.
     */
    function loadFileSync(path) {
        /**
         * @type {XMLHttpRequest}
         */
        var xhr = new XMLHttpRequest();
        xhr.open("GET", path, false);
        xhr.send();
        return xhr.responseText;
    }

    function initListNormal() {
        for (var caseName in testCases) {
            if (testCases.hasOwnProperty(caseName)) {
                /**
                 * @type {HTMLLIElement}
                 */
                var liElem = document.createElement("li");
                /**
                 * @type {HTMLAnchorElement}
                 */
                var aElem = document.createElement("a");
                aElem.innerHTML = caseName;
                aElem.href = "javascript:;";
                if (testCases[caseName]) {
                    aElem.name = "test-scripts/" + testCases[caseName];
                }
                aElem.onclick = onClick.bind(aElem);
                liElem.appendChild(aElem);
                caseListElem.appendChild(liElem);

                if (aElem.name) {
                    var blankElem = document.createElement("span");
                    blankElem.textContent = " #";
                    var viewSourceElem = document.createElement("a");
                    viewSourceElem.href = aElem.name;
                    viewSourceElem.textContent = "View source";
                    viewSourceElem.target = "_blank";
                    liElem.appendChild(blankElem);
                    liElem.appendChild(viewSourceElem);
                }
            }
        }
    }

    function initListOnFailure() {
        /**
         * @type {HTMLLIElement}
         */
        var liElem = document.createElement("li");
        liElem.textContent = "Oops, it seems that Bulletproof is not supported by your browser.";
        caseListElem.appendChild(liElem);
    }
}

function initFps() {
    if (!bp) {
        return;
    }
    __timerHandle = setInterval(function () {
        document.getElementById("fps-indicator").textContent = (Math.round(bp.fps * 100) / 100).toString();
    }, 1000);
}

function uninitFps() {
    if (!bp) {
        return;
    }
    if (__timerHandle !== 0) {
        clearInterval(__timerHandle);
    }
}

function addFlyingDanmaku() {
    if (!bp){
        return;
    }
    /**
     * @type {SimpleDanmakuProvider}
     */
    var provider = bp.danmakuCoordinator.getDanmakuProvider(Bulletproof.danmaku.DanmakuKind.Simple);
    /**
     * @type {HTMLInputElement}
     */
    var textBox = document.querySelector("#input-danmaku");
    provider.addDanmaku(textBox.value);
}
