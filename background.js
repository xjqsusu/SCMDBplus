chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (tab.url && changeInfo.status === 'complete' && tab.url.startsWith("http://scmdb.mascorp.com/py/scmbuild/")) {
        chrome.action.enable(tabId);
        chrome.action.setPopup({tabId: tabId, popup: 'popup.html'});
    } else {
        chrome.action.disable(tabId);
    }
});

// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//     if (request.action === "requestNewPN") {
//         chrome.tabs.create({ url: 'https://jira.panasonic.aero/secure/RapidBoard.jspa?rapidView=643' }, function(tab) {
//             // Wait for the new tab to report that it has completed loading
//             const listener = (newTabId, changeInfo) => {
//                 if (newTabId === tab.id && changeInfo.status === 'complete') {
//                     chrome.scripting.executeScript({
//                         target: {tabId: newTabId},
//                         files: ['jiraAutoClick.js']
//                     });
//                     chrome.tabs.onUpdated.removeListener(listener);
//                 }
//             };
//             chrome.tabs.onUpdated.addListener(listener);
//         });
//     }
// });
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "requestNewPN") {
        chrome.tabs.create({ url: 'https://jira.panasonic.aero/secure/RapidBoard.jspa?rapidView=643' }, function(tab) {
            const targetURL = "https://jira.panasonic.aero/secure/RapidBoard.jspa?rapidView=643";

            // Create a listener function specifically for this tab
            function tabUpdateListener(tabId, changeInfo, updatedTab) {
                if (tabId === tab.id && changeInfo.status === 'complete' && updatedTab.url === targetURL) {
                    chrome.scripting.executeScript({
                        target: {tabId: tabId},
                        files: ['jiraAutoClick.js']
                    });
                    
                    // Once the script is injected, remove this listener
                    chrome.tabs.onUpdated.removeListener(tabUpdateListener);
                }
            }
            
            // Attach the listener
            chrome.tabs.onUpdated.addListener(tabUpdateListener);
        });
    }
    // ... your other code ...
    if (request.action === "requestManifest") {
        chrome.tabs.create({ url: 'https://jira.panasonic.aero/secure/RapidBoard.jspa?rapidView=643' }, function(tab) {
            const targetURL = "https://jira.panasonic.aero/secure/RapidBoard.jspa?rapidView=643";

            // Create a listener function specifically for this tab
            function tabUpdateListener(tabId, changeInfo, updatedTab) {
                if (tabId === tab.id && changeInfo.status === 'complete' && updatedTab.url === targetURL) {
                    chrome.scripting.executeScript({
                        target: {tabId: tabId},
                        files: ['jiraManifest.js']
                    });
                    
                    // Once the script is injected, remove this listener
                    chrome.tabs.onUpdated.removeListener(tabUpdateListener);
                }
            }
            
            // Attach the listener
            chrome.tabs.onUpdated.addListener(tabUpdateListener);
        });
    }

    if (request.action === "requestNewKit") {
        chrome.tabs.create({ url: 'https://jira.panasonic.aero/secure/RapidBoard.jspa?rapidView=643' }, function(tab) {
            const targetURL = "https://jira.panasonic.aero/secure/RapidBoard.jspa?rapidView=643";

            // Create a listener function specifically for this tab
            function tabUpdateListener(tabId, changeInfo, updatedTab) {
                if (tabId === tab.id && changeInfo.status === 'complete' && updatedTab.url === targetURL) {
                    chrome.scripting.executeScript({
                        target: {tabId: tabId},
                        files: ['jiraKit.js']
                    });
                    
                    // Once the script is injected, remove this listener
                    chrome.tabs.onUpdated.removeListener(tabUpdateListener);
                }
            }
            
            // Attach the listener
            chrome.tabs.onUpdated.addListener(tabUpdateListener);
        });
    }
});
