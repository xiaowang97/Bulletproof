/**
 * Created by MIC on 2015/12/29.
 */

"use strict";

/**
 * @type {Engine}
 */
var bp = null;

(function () {

    /**
     * @type {number}
     * @private
     */
    var $timerHandle = 0;
    var $selectedValidVideo = false;

    var videoSelector = document.getElementById("video-selector");
    var testCaseSelector = document.getElementById("test-case-selector");

    window.onload = function () {
        initEnv();
        initVideoElements();
        initList();
        console.log("Bulletproof initialization completed.");
    };

    window.addEventListener("beforeunload", function (ev) {
        if (!bp) {
            return;
        }
        uninitFps();
        bp.dispose();
        bp = null;
    });

    /**
     * @param element {HTMLElement}
     */
    function hide(element) {
        element.style.display = "none";
    }

    /**
     * @param element {HTMLElement}
     */
    function showInline(element) {
        element.style.display = "inline";
    }

    /**
     * @param element {HTMLElement}
     */
    function showBlock(element) {
        element.style.display = "block";
    }

    function initEnv() {
        if (Bulletproof.isSupported()) {
            bp = new Bulletproof.Engine();
            bp.initialize(682, 438, document.getElementById("glantern-container"));
        }
    }

    function initList() {
        var testCases = {
            "Blank": "",
            "3D ball": "3d-ball.as",
            "Green Dam Musume": "kanpai-green-dam.as",
            "Madoka and her happy <del>tree</del> friends": "kanpai-madoka.as"
        };

        var caseListElem = document.getElementById("test-case-list");
        if (Bulletproof.isSupported() && bp) {
            initListNormal();
        } else {
            initListOnFailure();
        }

        function testCaseListItemOnClick(ev) {
            /**
             * @type {HTMLAnchorElement}
             */
            var aElem = this;
            var e;
            e = document.querySelector("#test-case-selector");
            hide(e);
            e = document.querySelector("#test-case-desc");
            e.textContent = aElem.name || "(blank)";
            e = document.querySelector("#playground");
            showBlock(e);
            executeCodeDanmakuContent(aElem.name, function () {
                initFps();
                bp.options.videoPlayerEnabled = $selectedValidVideo;
                bp.startAnimation();
            });
        }

        /**
         * Execute a single script by injecting the script into the window.
         * @param fileName {String} Full JavaScript file name.
         * @param callback {function():void} Async callback.
         */
        function executeCodeDanmakuContent(fileName, callback) {
            if (fileName) {
                var exec = function (err, data) {
                    if (err) {
                        console.error(err, data);
                    } else {
                        callback();
                        var codeProvider = bp.danmakuController.getProvider(Bulletproof.danmaku.DanmakuKind.Scripted);
                        codeProvider.addDanmaku(data);
                    }
                };
                if (typeof global !== typeof undefined) {
                    // In Node.js environments
                    var fs = require("fs");
                    fs.readFile(fileName, "utf-8", exec);
                } else {
                    // In common browsers
                    // Note: Please view on a server. Local file access is forbidden due to safety restrictions.
                    loadFileAsync(fileName, exec);
                }
            } else {
                callback();
            }
        }

        /**
         * Load a text file content from specified path.
         * @param path {String} The file path.
         * @param callback {function(*,String):void} Async callback.
         */
        function loadFileAsync(path, callback) {
            /**
             * @type {XMLHttpRequest}
             */
            var xhr = new XMLHttpRequest();
            xhr.open("GET", path);
            xhr.onreadystatechange = function (ev) {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    var err = null;
                    if (xhr.status !== 0 && (xhr.status < 200 || xhr.status >= 400)) {
                        err = xhr.status.toString() + ": " + xhr.statusText;
                    }
                    callback(err, xhr.responseText);
                }
            };
            xhr.send();
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
                    aElem.addEventListener("click", testCaseListItemOnClick.bind(aElem));
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
            liElem.textContent = "Oops, it seems that Bulletproof is not supported by your browser. Reasons:";
            caseListElem.appendChild(liElem);
            var supportStatus = Bulletproof.checkSupportStatus();
            if (!supportStatus.ok) {
                for (var i = 0; i < supportStatus.reasons.length; ++i) {
                    liElem = document.createElement("li");
                    liElem.textContent = supportStatus.reasons[i];
                    caseListElem.appendChild(liElem);
                }
            }
            hide(videoSelector);
            showBlock(testCaseSelector);
        }
    }

    function initFps() {
        if (!bp) {
            return;
        }
        $timerHandle = setInterval(function () {
            document.getElementById("fps-indicator").textContent = (Math.round(bp.fps * 100) / 100).toString();
        }, 1000);
    }

    function uninitFps() {
        if (!bp) {
            return;
        }
        if ($timerHandle !== 0) {
            clearInterval($timerHandle);
        }
    }

    function initVideoElements() {

        decideLocalVideoSelectorVisibility();
        registerVideoElemEvents();

        function decideLocalVideoSelectorVisibility() {
            var invisible = (typeof window.global === "undefined");
            var container = document.getElementById("local-video-selector-container");
            if (invisible) {
                hide(container);
            }
        }

        function registerVideoElemEvents() {
            var selLocalVideoBtn = document.getElementById("select-local-video-btn");
            /**
             * @type {HTMLInputElement}
             */
            var selLocalVideoElem = document.getElementById("select-local-video");
            selLocalVideoBtn.addEventListener("click", function (ev) {
                selLocalVideoElem.click();
            });
            selLocalVideoElem.addEventListener("change", function (ev) {
                if (selLocalVideoElem.value && bp) {
                    var player = bp.videoPlayer;
                    var val = selLocalVideoElem.value;
                    val = "file:///" + encodeURI(val.split("\\").join("/"));
                    player.load(val);
                    player.loop = true;
                    player.play();
                    $selectedValidVideo = true;
                    showBlock(testCaseSelector);
                    hide(videoSelector);
                }
            });
            var enterVideoUrlBtn = document.getElementById("enter-video-url-btn");
            enterVideoUrlBtn.addEventListener("click", function (ev) {
                /**
                 * @type {String}
                 */
                var url = prompt("Enter online video URL:");
                if (url !== null && url.length > 0 && bp) {
                    var player = bp.videoPlayer;
                    try {
                        player.load(url);
                        player.loop = true;
                        player.play();
                        $selectedValidVideo = true;
                        showBlock(testCaseSelector);
                        hide(videoSelector);
                    } catch (ex) {
                        console.warn(ex);
                    }
                }
            });
            var selectNoVideoBtn = document.getElementById("select-no-video-btn");
            selectNoVideoBtn.addEventListener("click", function (ev) {
                showBlock(testCaseSelector);
                hide(videoSelector);
            });
        }
    }
})();