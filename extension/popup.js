const masterToggle = document.getElementById('floatingToggle');
const pageToggles = {
  chzzkMain: document.getElementById('chzzkMainToggle'),
  chzzkLive: document.getElementById('chzzkLiveToggle'),
  naverGame: document.getElementById('naverGameToggle'),
};
const pageRows = {
  chzzkMain: document.getElementById('rowChzzkMain'),
  chzzkLive: document.getElementById('rowChzzkLive'),
  naverGame: document.getElementById('rowNaverGame'),
};

const defaultPageSettings = { chzzkMain: true, chzzkLive: true, naverGame: true };

function setPageTogglesDisabled(disabled) {
  for (const key of Object.keys(pageToggles)) {
    pageToggles[key].disabled = disabled;
    pageRows[key].classList.toggle('disabled', disabled);
  }
}

// 초기 로드
chrome.storage.local.get(['floatingButton', 'pageSettings'], (result) => {
  const masterEnabled = result.floatingButton !== false;
  const ps = Object.assign({}, defaultPageSettings, result.pageSettings);

  masterToggle.checked = masterEnabled;
  for (const key of Object.keys(pageToggles)) {
    pageToggles[key].checked = ps[key] !== false;
  }
  setPageTogglesDisabled(!masterEnabled);
});

function sendMessageToActiveTab(msg) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]?.id) {
      chrome.tabs.sendMessage(tabs[0].id, msg);
    }
  });
}

// 마스터 토글
masterToggle.addEventListener('change', () => {
  const enabled = masterToggle.checked;
  chrome.storage.local.set({ floatingButton: enabled });
  setPageTogglesDisabled(!enabled);
  sendMessageToActiveTab({ type: 'CCH_FLOATING_TOGGLE', enabled });
});

// 페이지별 토글
for (const key of Object.keys(pageToggles)) {
  pageToggles[key].addEventListener('change', () => {
    chrome.storage.local.get('pageSettings', (result) => {
      const ps = Object.assign({}, defaultPageSettings, result.pageSettings);
      ps[key] = pageToggles[key].checked;
      chrome.storage.local.set({ pageSettings: ps });
      sendMessageToActiveTab({ type: 'CCH_PAGE_SETTING_CHANGED', pageSettings: ps });
    });
  });
}
