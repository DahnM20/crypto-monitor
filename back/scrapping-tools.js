const puppeteer = require('puppeteer');

const pageUrl = 'https://cryptoast.fr/';
let news = [];
 

function getNews(){
    return news;
}

async function autoScroll(page){
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 100;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if(totalHeight >= scrollHeight){
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}

async function scrapCryptoast() {
    console.log('START - Scrapping cryptoast');

    console.log(process.env.MACHINE_SYSTEM);
    const browserOption = (process.env.MACHINE_SYSTEM == 'PI' ? {executablePath: '/usr/bin/chromium-browser', args: ['--no-sandbox', '--disable-setuid-sandbox'], headless:true}
							      : {headless : true});

    const browser = await puppeteer.launch(browserOption);
    const page = await browser.newPage();
    await page.goto(pageUrl, {
	"waitUntil" : "networkidle0" //Wait for all non-lazy images to load
    });

    await page.waitForSelector('body > div:nth-child(4) > div > div > div > div:nth-child(2) > div.col-sm-3.my-3')

    await page.setViewport({
        width: 1200,
        height: 800
    });

    await autoScroll(page);


    news = await page.evaluate(async () => {
	
	//Process data
        let articles = [];
        let elements = document.querySelectorAll('body > div:nth-child(4) > div > div > div > div:nth-child(2) > div.col-sm-3.my-3');
        
        for(element of elements) {
            articles.push({
                title: element.querySelector('div.card div.card-body a h4.card-title').textContent,
                img: element.querySelector('div.card a img.card-img-top').src,
                link: element.querySelector('div.card a').href,
                kind : 'news'
            })
        }
	console.log('Articles');
        return articles;
    });

    await browser.close();
    console.log(news[0]);
    console.log('END - Scrapping cryptoast');

}

scrapCryptoast();

exports.getNews = getNews;
exports.scrapCryptoast = scrapCryptoast;