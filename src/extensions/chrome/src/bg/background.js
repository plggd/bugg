// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });


//example of using a message handler from the inject scripts
// chrome.extension.onMessage.addListener(
//   function(request, sender, sendResponse) {
//   	chrome.pageAction.show(sender.tab.id);
//     sendResponse();
//   });

var sessionHistory = {};

var getPageData = function(tab) {
    var pageData = {
        url: tab.url,
        title: tab.title,
        openedInBackground: !tab.active,
        favIconUrl: tab.favIconUrl,
        height: tab.height,
        width: tab.width,
        audible: tab.audible
    }
    return pageData;
}

var onPageLoad = function(tabId, changeInfo, tab) {
    // console.log(tab, changeInfo, tabId);
    if (changeInfo["status"] != null && changeInfo["status"] == "complete") {
        sessionHistory[tabId] = tab.url;
        // console.log(tab);
        var pageData = getPageData(tab);
        if (tab.openerTabId != null) {
            pageData["referrerUrl"] = sessionHistory[tab.openerTabId];
        }
        console.log(pageData);
    }
}

var onPageClosed = function (tabId) {
    delete sessionHistory[tabId];
}

chrome.tabs.onRemoved.addListener(onPageClosed);
chrome.tabs.onUpdated.addListener(onPageLoad);

