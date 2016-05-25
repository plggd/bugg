
// chores

function log(message, value) {
    console.log(message, value);
}

// helpers

function isExists(value) {
    return (value != null);
}

function getDomain(url){
    var domain=url.split("//")[1];
    return domain.split("/")[0];
}

// core

var sessionHistory = {};

var getPageData = function(tab) {
    return {
        url: tab.url,
        domain: getDomain(tab.url),
        title: tab.title,
        openedInBackground: !tab.active,
        favIconUrl: tab.favIconUrl,
        height: tab.height,
        width: tab.width,
        audible: tab.audible
    };
}

var onPageLoad = function(tabId, changeInfo, tab) {
    if (isExists(changeInfo["status"]) && changeInfo["status"] == "complete") {

        var pageData = getPageData(tab);
        if (isExists(tab.openerTabId)) { // open in a new tab
            pageData["referrer"] = { "url" : sessionHistory[tab.openerTabId] };
        }
        else if (isExists(sessionHistory[tabId])) {  // opened in the same tab
            pageData["referrer"] = { "url" : sessionHistory[tabId] };
        }

        if (isExists(pageData["referrer"])) {
            pageData.referrer["domain"] = getDomain(pageData["referrer"].url);
        }
        // save current url to sessionHistory to get referrerUrl in the future
        sessionHistory[tabId] = tab.url;

        log("pagedata", pageData);
    }
}

var onPageClosed = function (tabId) {
    delete sessionHistory[tabId];
}

var onStateChanged = function (newState) {
    log("activity", newState);
}

// events

// tabs

chrome.tabs.onRemoved.addListener(onPageClosed);
chrome.tabs.onUpdated.addListener(onPageLoad);

// state
chrome.idle.onStateChanged.addListener(onStateChanged);

