//chrome.webNavigation.onHistoryStateUpdated.addListener(function(details) {
//    chrome.tabs.executeScript(null, { file: 'content_script.js' });
//});

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if ('queryPackage' !== request.contentScriptQuery) {
            return;
        }

        fetch(new Request(`https://packagist.org/search.json?q=${encodeURIComponent(request.name)}`, {
            method: 'GET'
        }))
            .then(response => response.json())
            .then(json => sendResponse(json.results))
            .catch(console.log)
        ;

        return true;
    }
);
