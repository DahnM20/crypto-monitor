const puppeteer = require('puppeteer');

const pageUrl = 'https://cryptoast.fr/';
let news = [];
 

function getNews(){
    return news;
}

async function scrapCryptoast() {
    console.log('START - Scrapping cryptoast');

    const browser = await puppeteer.launch({headless:true});
    const page = await browser.newPage();

    await page.goto(pageUrl);

    await page.waitForSelector('body > div:nth-child(5) > div > div > div > div:nth-child(2) > div.col-sm-3')

    news = await page.evaluate(() => {
        let articles = [];
        let elements = document.querySelectorAll('body > div:nth-child(5) > div > div > div > div:nth-child(2) > div.col-sm-3');
        
        for(element of elements) {
            articles.push({
                title: element.querySelector('div.card div.card-body a h4.card-title').textContent,
                img: element.querySelector('div.card a img.card-img-top').src,
                link: element.querySelector('div.card a').href,
                kind : 'news'
            })
        }

        return articles;
    });

    await browser.close();

    console.log('END - Scrapping cryptoast');

}



exports.getNews = getNews;
exports.scrapCryptoast = scrapCryptoast;