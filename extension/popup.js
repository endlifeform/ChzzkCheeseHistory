const toggle = document.getElementById('floatingToggle');

chrome.storage.local.get('floatingButton', (result) => {
  toggle.checked = result.floatingButton !== false;
});

toggle.addEventListener('change', () => {
  const enabled = toggle.checked;
  chrome.storage.local.set({ floatingButton: enabled });
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]?.id) {
      chrome.tabs.sendMessage(tabs[0].id, { type: 'CCH_FLOATING_TOGGLE', enabled });
    }
  });
});
