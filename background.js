chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (tab.url && changeInfo.status === 'complete' && tab.url.startsWith("http://scmdb.mascorp.com/py/scmbuild/")) {
        chrome.action.enable(tabId);
        chrome.action.setPopup({tabId: tabId, popup: 'popup.html'});
    } else {
        chrome.action.disable(tabId);
    }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "openNewTab") {
        chrome.tabs.create({ url: request.url });
    }
});