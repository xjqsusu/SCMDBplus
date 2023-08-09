chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (tab.url && changeInfo.status === 'complete' && tab.url.startsWith("http://scmdb.mascorp.com/py/scmbuild/")) {
        chrome.action.enable(tabId);
        chrome.action.setPopup({tabId: tabId, popup: 'popup.html'});
    } else {
        chrome.action.disable(tabId);
    }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "requestNewPN") {
        chrome.tabs.create({ url: 'https://jira.panasonic.aero/' }, function(tab) {
            // Wait for the new tab to report that it has completed loading
            const listener = (newTabId, changeInfo) => {
                if (newTabId === tab.id && changeInfo.status === 'complete') {
                    chrome.scripting.executeScript({
                        target: {tabId: newTabId},
                        files: ['jiraAutoClick.js']
                    });
                    chrome.tabs.onUpdated.removeListener(listener);
                }
            };
            chrome.tabs.onUpdated.addListener(listener);
        });
    }
});
