const adminDomain = 'secrets-wp.tcsgroup.io';
const prodDomain = 'secrets.tinkoff.ru';
const previewDomain = 'https://secrets.tinkoff.ru/preview/';

const editButton = document.querySelector('#button-edit');
const previewButton = document.querySelector('#button-preview');

const openUrl = () => {
  chrome.tabs.query({active: true, currentWindow: true}, tabs => {
    const currentUrl = tabs[0].url;
    if (currentUrl.includes(prodDomain)) {
      const adminUrl = currentUrl.replace(prodDomain, adminDomain);
      window.open(adminUrl, '_blank');
   } else if (currentUrl.includes(adminDomain)) {
      const startIndex = currentUrl.indexOf('=') + 1;
      const endIndex = currentUrl.indexOf('&');
      const id = currentUrl.slice(startIndex, endIndex);
      window.open(`${previewDomain}${id}`, '_blank')
   } else {
      alert('Расширение работает только на сайте БС');
   }
});
}

editButton.addEventListener('click', openUrl);
previewButton.addEventListener('click', openUrl);