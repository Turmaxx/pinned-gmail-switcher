let previousTab = null;

browser.tabs.onRemoved.addListener((tabId) => {
  if (tabId === previousTab) {
    previousTab = null;
  }
});

function createPinnedTab() {
  return browser.tabs.create({
    url: "https://mail.google.com/",
    pinned: true,
    active: true
  });
}

async function handleClick(tab) {
  const currentTabId = tab.id;

  const gmailTabs = await browser.tabs.query({
    url: "https://mail.google.com/*"
  });

  if (gmailTabs.length === 0) {
    previousTab = currentTabId;
    await createPinnedTab();
    return;
  }

  const gmailTabId = gmailTabs[0].id;

  if (gmailTabId === currentTabId) {
    if (previousTab !== null) {
      try {
        await browser.tabs.update(previousTab, { active: true });
      } catch {
        previousTab = null;
      }
    }
  } else {
    previousTab = currentTabId;
    await browser.tabs.update(gmailTabId, { active: true });
  }
}

browser.browserAction.onClicked.addListener(handleClick);
