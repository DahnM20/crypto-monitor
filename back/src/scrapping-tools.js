const puppeteer = require('puppeteer');
const log = require('loglevel');
const Ido = require('./models/ido')
const Article = require('./models/article')
const url = require('url');


const cryptoastURL = 'https://cryptoast.fr/actu/';
const jdcURL = 'https://journalducoin.com/actualites/';

const browserOptions = {
    PI: {executablePath: '/usr/bin/chromium-browser', args: ['--no-sandbox', '--disable-setuid-sandbox'], headless: true},
    OTHER: {headless : false}
};

const getBrowserOption = () => process.env.MACHINE_SYSTEM == 'PI' ? browserOptions.PI : browserOptions.OTHER;

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

async function scrapeData(url, pageSelector, processPageFunc) {
    log.info(`START - Scrapping ${url}`);
    log.debug('System : ' + process.env.MACHINE_SYSTEM);

    const browserOption = getBrowserOption();
    const browser = await puppeteer.launch(browserOption);

    try {
        const page = await browser.newPage();
        await page.goto(url, { "waitUntil" : "networkidle0" });

        await page.waitForSelector(pageSelector);

        await page.setViewport({
            width: 1200,
            height: 800
        });

        await autoScroll(page);
        saveArticle(await page.evaluate(processPageFunc));
    } catch(e){
        log.error(`Erreur lors du scrapping ${url}` + e );
    } finally {
        await browser.close();
        log.info(`END - Scrapping ${url}`);
    }
}

async function scrapCryptoast() {
    await scrapeData(cryptoastURL, '.last-news-card', processCryptoastPage);
}

async function scrapJDC() {
    await scrapeData(jdcURL, 'a.column', processJDCPage);
}

function isValidImageUrl(imageUrl) {
    if(!imageUrl) return false;

    if (imageUrl.startsWith('data:image')) {
        return false;
    }
    const parsedUrl = url.parse(imageUrl);
    if (!parsedUrl.protocol || !parsedUrl.host) {
        return false;
    }

    return true;
}

/**
 * Save all new articles in database
 * @param {string[]} articles : The article list we want to save
 */
 const saveArticle = async (articles) => {

    articles = articles.reverse() //Save from the last to the newest article
    articles.forEach( async (article) => {
         const link = article.link

         try{
            const articleFound = await Article.findOne({ link })

            if(!articleFound){
                const newArticle = new Article(article)
                await newArticle.save()
            } else {
                articleFound.img = isValidImageUrl(article.img) ? article.img : articleFound.img
                articleFound.name = article.name ?? articleFound.name
                await articleFound.save()
            }
        } catch(e) {
            log.error(`Erreur lors de la sauvegarde de l'article ${article} ` + e)
        }
    })
}

const processJDCPage = () => {
    //Process data
    let articles = [];
    let elements = document.querySelectorAll('a.column');

    for (element of elements) {
        articles.push({
            title: element.querySelector('.title').textContent,
            img: element.querySelector('img').src,
            link: element.href,
            kind: 'news',
            source: 'jdc'
        });
    }

    return articles;
}


const processCryptoastPage = () => {
        //Process data
        let articles = [];
        let elements = document.querySelectorAll('.last-news-card');

        for (element of elements) {
            articles.push({
                title: element.querySelector('.last-news-card-title > span').textContent,
                img: element.querySelector('.last-news-card-img').src,
                link: element.href,
                kind: 'news',
                source: 'cryptoast'
            });
        }

        return articles;
}


const pagesIDO = ['https://raydium.io/acceleraytor/list/','https://maiar.exchange/metabonding']

const idoWaiters = ['.items-stretch','.card-bg-light']

const idoImageSelectors = ['img','.icon > img']

const idoNameSelectors = ['.text-base','.name']

const idoStatusSelectors = ['.Progress-label','.status']

const idoLinkSelectors = ['','.link']

const idoBlockChainSelectors = ['','']

const statusFilters = ['ended', 'distribution', 'whitelist closed', 'closed', 'Inconnu']


async function scrapIDO() {
    log.info('START - Scrapping IDO');
    let idoProjects = [];

    log.debug('System : ' + process.env.MACHINE_SYSTEM);
    const browserOption = (process.env.MACHINE_SYSTEM == 'PI' ? {executablePath: '/usr/bin/chromium-browser', args: ['--no-sandbox', '--disable-setuid-sandbox'], headless:true}
							      : {headless : false});

    const browser = await puppeteer.launch(browserOption);

    for(let i = 0; i < pagesIDO.length ; ++i){
        log.info(`Scrapping ${pagesIDO[i]} en cours`)

        idoUrl = pagesIDO[i];
        
        try{
            const page = await browser.newPage();

            await page.goto(idoUrl);
    
        
            await page.waitForSelector(idoWaiters[i])
        
            await page.setViewport({
                width: 1200,
                height: 800
            });
        
            await autoScroll(page);
            await exposeAllIdoMethods(page, i);

            currentProjects = await page.evaluate(processIdoPage);
            
            currentProjects.forEach(project => project.origin = pagesIDO[i])
            idoProjects = idoProjects.concat(currentProjects);
        } catch(e) {
            log.error(`Erreur lors du scrapping ${pagesIDO[i]} ` + e )
            continue;
        }
    }

    //log.debug('Projets récupérés : ' + JSON.stringify(idoProjects))

    idoProjects = filterProjects(idoProjects);

    await browser.close();

    saveProjects(idoProjects)
    log.info('END - Scrapping IDO');

}


function filterProjects(idoProjects) {

    idoProjects = idoProjects.filter(project => !statusFilters.includes(project.status?.toLowerCase()));
    idoProjects.forEach(project => project.name = project.name.replaceAll(' ', '').replaceAll('\n', '').replaceAll('$', ''));
    idoProjects.forEach(project => {
         project.status = project.status?.replaceAll('ends in:', 'end soon')?.replaceAll('starts in:', 'soon')
         project.status?.toLowerCase().includes('prepar') ? project.status = 'Upcoming' : project.status //do nothing
        });
    idoProjects.forEach(project => project.img = project.img.replaceAll("url(\"", "").replaceAll("\")", ""));

    log.debug('Projets filtrés : \n')
    idoProjects.forEach( (p) => log.debug(p.name + ' ' + p?.status) )
    return idoProjects;
}

/**
 * Save all new ido projects in database and update existing ones. 
 * @param {string[]} idoProjects : The project list we want to save
 */
const saveProjects = async (idoProjects) => {

    const allowedUpdates = ['status','img']

    idoProjects.forEach( async (project) => {
         const name = project.name

         try{
            const ido = await Ido.findOne({ name })

            if(!ido){
                const newIdo = new Ido(project)
                await newIdo.save()
            } else {
                allowedUpdates.forEach((update) => {
                    if(project[update]){
                        ido[update] = project[update]
                    }
                })
                await ido.save()
            }
        } catch(e) {
            log.error(`Erreur lors de la sauvegarde du projet ${project} ` + e)
        }
    })
}

const processIdoPage = async () => {

        //Process data
        let projects = [];

        let elements = document.querySelectorAll(await getIdoWaiter());

        for (element of elements) {
            if(!element) {
                continue;
            }

            projects.push({
                name: element.querySelector(await getIdoNameSelector()).textContent,
                img: element.querySelector(await getImageSelector()).src,
                link: document.URL,
                status: element.querySelector(await getStatusSelector())?.textContent,
            });
        }

        return projects;

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
//scrapJDC();
// log.setLevel(process.env.LOG_LEVEL)
//scrapIDO();


module.exports = { scrapCryptoast, scrapIDO }
