const puppeteer = require('puppeteer');

const pageUrl = 'https://cryptoast.fr/';
let news = [];
let idoProjects = []
 

function getNews(){
    return news;
}

function getIdo(){
    return idoProjects;
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
        let elements = document.querySelectorAll('body > div:nth-child(5) > div > div > div > div:nth-child(2) > div.col-sm-3.my-3');
        
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

const pagesIDO = ['https://polkastarter.com/projects','https://www.solanium.io/pools','https://raydium.io/acceleRaytor/']

const idoWaiters = ['#app-content > div > div:nth-child(1) > div > div.ps--card-grid > .ps--project-card__blur', 
                    '#__layout > div > section > div > div:nth-child(1) > div',
                    '#__layout > section > main > div > div:nth-child(3) > div.ant-table-wrapper > div > div > div > div > div > table > tbody > tr']

const idoImageSelectors = ['div.ps--project-card__header > div.ps--project-card__logo > img',
'a > article > div.media-left > div','td:nth-child(1) > span > img']

const idoNameSelectors = ['div.ps--project-card.ps--hover > a > div.ps--project-card__wrapper > div.ps--project-card__info > div.ps--project-card__info__project > h3'
,'a > article > div.media-content > div > div.is-flex.is-justify-content-space-between > h5','td:nth-child(1) > span > span']

const idoStatusSelectors = ['div.ps--project-card.ps--hover > a > div.ps--project-card__status > div',
'a > article > div.media-content > div > div:nth-child(3) > div > div > div > div.is-label','td:nth-child(7) > span > span']

const idoLinkSelectors = ['div.ps--project-card.ps--hover > a','a','td:nth-child(7) > span > span']

const idoBlockChainSelectors = ['div.ps--project-card.ps--hover > a > div.ps--project-card__wrapper > div.ps--project-card__info > div.ps--project-card__info__networks > svg:nth-child(1)','','']

const statusFilters = ['ended', 'distribution', 'whitelist closed', 'closed']

async function scrapIDO() {
    console.log('START - Scrapping IDO');
    idoProjects = [];

    console.log(process.env.MACHINE_SYSTEM);
    const browserOption = (process.env.MACHINE_SYSTEM == 'PI' ? {executablePath: '/usr/bin/chromium-browser', args: ['--no-sandbox', '--disable-setuid-sandbox'], headless:true}
							      : {headless : false});

    const browser = await puppeteer.launch(browserOption);

    for(let i = 0; i < pagesIDO.length ; ++i){
        idoUrl = pagesIDO[i];
        const page = await browser.newPage();

        await page.goto(idoUrl);
    
        await page.waitForSelector(idoWaiters[i])
    
        await page.setViewport({
            width: 1200,
            height: 800
        });
    
        await autoScroll(page);
        await exposeAllIdoMethods(page, i);


        currentProjects = await page.evaluate(async () => {
        
            //Process data
            let projects = [];
            let elements = document.querySelectorAll(await getIdoWaiter());
            
            for(element of elements) {
                projects.push({
                    name: element.querySelector(await getIdoNameSelector()).textContent,
                    img:  await getIdoIndex() != 1 ? element.querySelector(await getImageSelector()).src : element.querySelector(await getImageSelector()).style.backgroundImage,
                    link: element.querySelector(await getLinkSelector())?.href,
                    status: element.querySelector(await getStatusSelector())?.textContent,
                    //blockchain : getIdoIndex() > 1 ? 'solana' : element?.querySelector(await getBlockchainSelector())?.dataset?.projectPartialTarget
                })
            }

            return projects;

        });

        idoProjects = idoProjects.concat(currentProjects);

    }


    idoProjects = idoProjects.filter(project => !statusFilters.includes(project.status?.toLowerCase()))
    idoProjects.forEach(project => project.name = project.name.replaceAll(' ', '').replaceAll('\n', '').replaceAll('$',''));
    idoProjects.forEach(project => project.status = project.status?.replaceAll('ends in:', '-end-soon')?.replaceAll('starts in:', '-soon')?.replaceAll(' ', ''));
    idoProjects.forEach(project => project.img = project.img.replaceAll("url(\"","").replaceAll("\")",""));

    await browser.close();
    console.log('END - Scrapping IDO');

}


async function exposeAllIdoMethods(page, i) {
    await page.exposeFunction("getIdoNameSelector", function () {
        return idoNameSelectors[i];
    });

    await page.exposeFunction("getIdoWaiter", function () {
        return idoWaiters[i];
    });

    await page.exposeFunction("getImageSelector", function () {
        return idoImageSelectors[i];
    });


    await page.exposeFunction("getBlockchainSelector", function () {
        return idoBlockChainSelectors[i];
    });


    await page.exposeFunction("getStatusSelector", function () {
        return idoStatusSelectors[i];
    });


    await page.exposeFunction("getLinkSelector", function () {
        return idoLinkSelectors[i];
    });

    await page.exposeFunction("getIdoIndex", function() {
        return i;
    })
}


//scrapCryptoast();

scrapIDO();

exports.getNews = getNews;
exports.getIdo = getIdo;
exports.scrapCryptoast = scrapCryptoast;
exports.scrapIDO = scrapIDO;
