chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'showNotification') {
    showNotification(request.title, request.url);
  }
});

function showNotification(title, url) {
  const notificationDiv = document.createElement('div');
  notificationDiv.className = 'chrome-extension-notification';

  const titleElement = document.createElement('div');
  titleElement.className = 'chrome-extension-notification-title';
  titleElement.textContent = `Tab closed: ${title}`;

  const urlElement = document.createElement('div');
  urlElement.className = 'chrome-extension-notification-url';
  urlElement.textContent = url;

  notificationDiv.appendChild(titleElement);
  notificationDiv.appendChild(urlElement);
  document.body.appendChild(notificationDiv);

  setTimeout(() => {
    document.body.removeChild(notificationDiv);
  }, 5000);
}
