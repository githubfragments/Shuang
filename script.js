'use strict';

const MODES = {
    "SVJI": 0,
    "UPXU": 1
};
var actionFlag = true;
var nowSchemeId = 0;
var nowMode = MODES.SVJI;
var nowUgmu = 'sh';
var nowYpmu = 'uang';
var nowPair = [nowUgmu, nowYpmu];
var nowSchemeUgmu = 'U';
var nowSchemeYpmu = 'd';
var nowScheme = [nowSchemeUgmu, nowSchemeYpmu];
var nowUgmuId = -1;
var nowYpmuId = 0;
var nowExample = '双';
window.onload = function () {
    var schemeSelect = document.getElementById('schemeSelect');
    for (var schemeId in schemesList) {
        var schemeOption = document.createElement('option');
        schemeOption.innerHTML = schemesList[schemeId];
        schemeSelect.appendChild(schemeOption);
    }
    document.getElementById('a1').focus();
};

document.onkeydown = function (event) {
    switch (event.keyCode) {
        case 37:
            document.getElementById('a1').focus();
            break;
        case 39:
            document.getElementById('a2').focus();
            break;
        case 8:
            if (document.getElementById('a2').value === '') {
                redo();
            }
            break;
        case 13:
        case 32:
            if (check()) {
                next();
            } else {
                redo();
            }
            break;
    }
};

window.onresize = function () {
    document.body.style.height = window.innerHeight + 'px';
};

function doAction(x) {
    x.value = x.value.replace(/[^a-zA-Z;]/g, '');
    if (x.value.length === 1) {
        if (x.id === 'a1') {
            x.value = x.value.toUpperCase();
            if (actionFlag) {
                document.getElementById('a2').focus();
                actionFlag = false;
            }
        } else if (x.id === 'a2') {
            x.value = x.value.toLowerCase();
        }
    }
    check();
}

function check() {
    if (isRight(document.getElementById('a1').value, nowSchemeUgmu) && isRight(document.getElementById('a2').value, nowSchemeYpmu)) {
        document.getElementById('btn_next').style.display = 'block';
        document.getElementById('btn_redo').style.display = 'none';
        return true;
    }
    document.getElementById('btn_next').style.display = 'none';
    document.getElementById('btn_redo').style.display = 'block';
    if (document.getElementById('a1').value.length === 0) {
        actionFlag = true;
    }
    return false;
}

function isRight(x, xScheme) {
    if (x.length === 1) {
        if (Array.isArray(xScheme)) {
            for (var i in xScheme) {
                if (x === xScheme[i]) {
                    return true;
                }
            }
        } else {
            return x === xScheme;
        }
    }
    return false;
}

function next() {
    redo();
    switch (nowMode) {
        case(MODES.SVJI):
            nowPair = getRandomPair();
            nowScheme = getSchemeByPair(nowSchemeId, nowPair);
            nowUgmu = getCapitalUpperCase(nowPair[0]);
            nowYpmu = nowPair[1];
            nowSchemeUgmu = getCapitalUpperCase(nowScheme[0]);
            nowSchemeYpmu = nowScheme[1];
            nowExample = getExampleByPair(nowPair);
            document.getElementById('q1').innerHTML = nowUgmu;
            document.getElementById('q2').innerHTML = nowYpmu;
            document.getElementById('example').innerHTML = nowExample;
            break;
        case (MODES.UPXU):
            nowPair = getPairByIds(nowUgmuId, nowYpmuId);
            if (nowPair === '') {
                if (nowYpmuId === 0) {
                    nowUgmuId = 0;
                    nowYpmuId = 0;
                } else {
                    nowUgmuId++;
                    nowYpmuId = 0;
                }
                next();
                return;
            } else {
                nowYpmuId++;
            }
            nowScheme = getSchemeByPair(nowSchemeId, nowPair);
            nowUgmu = getCapitalUpperCase(nowPair[0]);
            nowYpmu = nowPair[1];
            nowSchemeUgmu = getCapitalUpperCase(nowScheme[0]);
            nowSchemeYpmu = nowScheme[1];
            nowExample = getExampleByPair(nowPair);
            document.getElementById('q1').innerHTML = nowUgmu;
            document.getElementById('q2').innerHTML = nowYpmu;
            document.getElementById('example').innerHTML = nowExample;
            break;
    }
}

function redo() {
    actionFlag = true;
    document.getElementById('a1').value = '';
    document.getElementById('a2').value = '';
    document.getElementById('a1').focus();
    document.getElementById('btn_next').style.display = 'none';
    document.getElementById('btn_redo').style.display = 'block';
}

function changeScheme(x) {
    var id = schemesList.indexOf(x);
    if (id === -1) {
        alert('参数错误');
        document.getElementById('scheme').value = schemesList[0];
    } else {
        nowSchemeId = id;
    }
    next();
}

function changeMode(x) {
    if (x === '随机') {
        nowMode = MODES.SVJI;
    } else if (x === '顺序') {
        nowMode = MODES.UPXU;
    }
    next();
}

function getCapitalUpperCase(x) {
    if (Array.isArray(x)) {
        var result = [];
        for (var i in x) {
            result.push(x[i].substr(0, 1).toUpperCase().concat(x[i].substr(1, x[i].length).toLowerCase()));
        }
        return result;
    } else {
        return x.substr(0, 1).toUpperCase().concat(x.substr(1, x.length).toLowerCase());
    }
}