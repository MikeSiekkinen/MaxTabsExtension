chrome.tabs.onCreated.addListener((tab) => {
  handleNewTab(tab);
});

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync' && changes.maxUnpinnedTabs) {
    enforceMaxUnpinnedTabs(changes.maxUnpinnedTabs.newValue);
  }
});

function handleNewTab(tab) {
  console.log('New tab created:', tab);

  chrome.storage.sync.get('maxUnpinnedTabs', (data) => {
    const maxUnpinnedTabs = data.maxUnpinnedTabs || 10;
    enforceMaxUnpinnedTabs(maxUnpinnedTabs);
  });
}

function enforceMaxUnpinnedTabs(maxUnpinnedTabs) {
  chrome.tabs.query({ pinned: false, currentWindow: true }, (tabs) => {
    if (tabs.length > maxUnpinnedTabs) {
      const oldestUnpinnedTab = tabs.reduce((oldest, current) => {
        return current.id < oldest.id ? current : oldest;
      });

      chrome.tabs.remove(oldestUnpinnedTab.id, () => {
        showTabClosedNotification(oldestUnpinnedTab);
      });
    }
  });
}


function showTabClosedNotification(tab) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    // Check if the tab is complete before sending the message
    if (activeTab.status === 'complete') {
      sendMessageToTab(activeTab.id, tab);
    } else {
      // If the tab is still loading, wait for it to complete
      chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
        if (tabId === activeTab.id && changeInfo.status === 'complete') {
          sendMessageToTab(activeTab.id, tab);
          // Remove the listener after sending the message
          chrome.tabs.onUpdated.removeListener(listener);
        }
      });
    }
  });
}

function sendMessageToTab(tabId, closedTab) {
  chrome.tabs.sendMessage(tabId, {
    action: 'showNotification',
    title: closedTab.title,
    url: closedTab.url
  });
}
