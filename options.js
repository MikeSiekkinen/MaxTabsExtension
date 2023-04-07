document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('#save').addEventListener('click', saveOptions);
  loadOptions();
});

function saveOptions() {
  let maxUnpinnedTabs = document.querySelector('#maxUnpinnedTabs').value;

  // Validate the maxUnpinnedTabs value
  if (maxUnpinnedTabs < 1) {
    maxUnpinnedTabs = 1;
    document.querySelector('#maxUnpinnedTabs').value = maxUnpinnedTabs;
  }

  chrome.storage.sync.set({ maxUnpinnedTabs }, () => {
    console.log('Options saved:', { maxUnpinnedTabs });
  });
}

function loadOptions() {
  chrome.storage.sync.get('maxUnpinnedTabs', (data) => {
    if (data.maxUnpinnedTabs) {
      document.querySelector('#maxUnpinnedTabs').value = data.maxUnpinnedTabs;
    } else {
      document.querySelector('#maxUnpinnedTabs').value = 10;
    }
  });
}
