// NOTE: tabGroups permission is not yet implemented in stable, so can't collapse them by default
chrome.commands.onCommand.addListener(command => {
    if (command === "ungroup-tabs") {
        chrome.tabs.query({
            currentWindow: true
        }, tabs => {
            const tabIds = tabs.map(tab => tab.id);
            chrome.tabs.ungroup(tabIds);
        });
    } else if (command === "group-tabs") {
        chrome.tabs.query({
            currentWindow: true,
            groupId: -1 //chrome.tabGroups.TAB_GROUP_ID_NONE
        }, tabs => {
            let domainTabDict = {};
            
            tabs.forEach(tab => {
                if (tab.groupId !== -1) {
                    return;
                }

                const domain = new URL(tab.url).hostname;

                if (!domainTabDict[domain]) {
                    domainTabDict[domain] = [];
                }

                domainTabDict[domain].push(tab.id);
            });

            const domains = Object.keys(domainTabDict);

            if (domains && domains.length) {
                domains.forEach(domain => {
                    const tabIds = domainTabDict[domain];

                    if (tabIds.length > 1) {
                        chrome.tabs.group({
                            tabIds: tabIds
                        }, groupId => {
                            //chrome.tabGroups.get(groupId).collapsed = true;
                        });
                    }
                });
            }
        });
    }
});