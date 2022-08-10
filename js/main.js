import __ from './multilingalization.js';

function urlShorten() {
    const inputUrl = document.getElementById('input-url').value;
    const fields = inputUrl.split('/');
    let shortUrl = '';
console.log(fields);
    if (inputUrl.includes('r.html?')) {
        // for gift voucher url
        shortUrl = decodeURIComponent(inputUrl).split('&').filter(field => field.match(/U=/) !== null)[0];
        shortUrl = shortUrl.slice('U='.length, shortUrl.indexOf('?'));
    } else {
        // Delete query parameters
        fields.push(fields.slice(-1).pop().replace(/\?.+/, ''));

        shortUrl = fields.filter(field => field.match(/[%=]/) === null).join('/');

        // for product url
        shortUrl = shortUrl.replace(/gp\/product/, 'dp');

        // for wishlist url
        shortUrl = shortUrl.replace(/(hz|ls)\//g, '');
    }

    console.log(shortUrl);
    shortUrl = shortUrl.replace(/^https:\/\/(www\.)?/, 'https://');
    console.log(shortUrl);

    // show short url message
    const msgSuccess = document.getElementById('shortener-success');
    const msgAlert = document.getElementById('shortener-danger');
    msgSuccess.classList.add('visually-hidden');
    msgAlert.classList.add('visually-hidden');

    if (shortUrl) {
        copyToClipboard(shortUrl)
            .then(result => msgSuccess.innerHTML = result);
        msgSuccess.classList.remove('visually-hidden');
    } else {
        msgAlert.classList.remove('visually-hidden');
    }
}

async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text)
        return __.translate('Copied the URL to the clipboard; ') + '<strong>' + text + '</strong>';
    } catch (error) {
        return __.translate('Could not copy the URL; ') + '<strong>' + text + '</strong>';
    }
}

window.onload = e => {
    __.translateAll();

    document.getElementById('shortener-btn').addEventListener('click', urlShorten);
    document.getElementById('input-url').addEventListener('keydown', e => {
        if (e.key === 'Enter') {
            urlShorten();
        }
        return false;
    });
}
