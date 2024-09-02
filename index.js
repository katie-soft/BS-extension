const adminDomain = 'secrets-wp.tcsgroup.io';
const prodDomain = 'secrets.tinkoff.ru';
const previewDomain = 'https://secrets.tinkoff.ru/preview/';

const editButton = document.querySelector('#button-edit');
const previewButton = document.querySelector('#button-preview');
const copyButton = document.querySelector('#button-copy');

const openUrl = () => {
  chrome.tabs.query({active: true, currentWindow: true}, tabs => {
    const currentUrl = tabs[0].url;
    if (currentUrl.includes(prodDomain)) {
      const adminUrl = currentUrl.replace(prodDomain, adminDomain);
      window.open(adminUrl, '_blank');
   } else if (currentUrl.includes(adminDomain)) {
      const params = new URLSearchParams(currentUrl.split('?')[1]);
      const id = params.get('post');
      window.open(`${previewDomain}${id}`, '_blank');
   } else {
      alert('Расширение работает только на сайте БС');
   }
});
}

editButton.addEventListener('click', openUrl);
previewButton.addEventListener('click', openUrl);

async function addHotkeys() {

  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      async function getSelectionText(param) {
        let text = "";
        if (window.getSelection) {
          if (param === 'h') {
            text = `<a href="">${window.getSelection().toString()}</a>`;
          } else if (param === 's') {
            text = `<strong>${window.getSelection().toString()}</strong>`;
          } else if (param === 'x') {
            text = '&nbsp;';
          }        
        } 
        await navigator.clipboard.writeText(text);
      }

      document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && checkPressedKeys(e.key)) {
          e.preventDefault();
          getSelectionText(e.key)
        }
      })
    },
  })
}

function checkPressedKeys(event) {
  const keys = ['h', 's', 'x', 'р', 'ы', 'ч'];
  return keys.includes(event.key);
}

addHotkeys();