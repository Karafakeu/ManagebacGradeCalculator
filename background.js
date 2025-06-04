chrome.webNavigation.onHistoryStateUpdated.addListener(details => {
    tabId = details.tabId;
    currentUrl = details.url;
    chrome.webRequest.onCompleted.addListener(function() {
        console.log(tabId, currentUrl)
        if (currentUrl && tabId){
            setTimeout(() => {
                chrome.tabs.sendMessage(tabId, { type: 'page-rendered'});
            }, 200);
        }
    }, { urls: ['*://*.managebac.com/student/classes/*/core_tasks'] });
});