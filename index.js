const adminDomain = 'secrets-wp.tcsgroup.io';
const prodDomain = 'secrets.tinkoff.ru';
const previewDomain = 'https://secrets.tinkoff.ru/preview/';

const editButton = document.querySelector('#button-edit');
const previewButton = document.querySelector('#button-preview');
const betaButton = document.querySelector('#button-hot-keys');

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
betaButton.addEventListener('click', () => {
  betaButton.classList.add('button_enabled');
  addHotkeys();
} )

async function addHotkeys() {

  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      async function getSelectionText(param) {
        let text = "";
        if (window.getSelection) {
          if (param === 'H' || param === 'Р') {
            text = `<a href="">${window.getSelection().toString()}</a>`;
          } else if (param === 'S' || param === 'Ы') {
            text = `<strong>${window.getSelection().toString()}</strong>`;
          } else if (param === 'X' || param === 'Ч') {
            text = '&nbsp;';
          }        
        } 
        console.log(text);
        await navigator.clipboard.writeText(text);
      }

      document.addEventListener('keydown', (e) => {
        const keys = ['H', 'S', 'X', 'Р', 'Ы', 'Ч'];
        if (e.ctrlKey && keys.includes(e.key)) {
          e.preventDefault();
          getSelectionText(e.key);
        }
      })
    },
  })
}