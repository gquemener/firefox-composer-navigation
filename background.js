browser.webNavigation.onHistoryStateUpdated.addListener(function(details) {
    browser.tabs.executeScript(null, { file: 'content_script.js' });
});
