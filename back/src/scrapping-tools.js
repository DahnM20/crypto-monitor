const puppeteer = require('puppeteer');
const log = require('loglevel');
const Ido = require('./models/ido')
const Article = require('./models/article')

const pageUrl = 'https://cryptoast.fr/';

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
    log.info('START - Scrapping cryptoast');
    log.debug('System : ' + process.env.MACHINE_SYSTEM);
    const browserOption = (process.env.MACHINE_SYSTEM == 'PI' ? {executablePath: '/usr/bin/chromium-browser', args: ['--no-sandbox', '--disable-setuid-sandbox'], headless:true}
							      : {headless : false});

    const browser = await puppeteer.launch(browserOption);
    try {
        const page = await browser.newPage();
    
        await page.goto(pageUrl, {
        "waitUntil" : "networkidle0" //Wait for all non-lazy images to load
        });

        await page.waitForSelector('body > div:nth-child(6) > div > div > div > div:nth-child(2) > div.col-sm-3.my-3')

        await page.setViewport({
            width: 1200,
            height: 800
        });

        await autoScroll(page);

        saveArticle(await page.evaluate(processCryptoastPage));

    } catch(e){
        log.error(`Erreur lors du scrapping Cryptoast ` + e )
    } finally {
        await browser.close();
        log.info('END - Scrapping cryptoast');
    }

}

/**
 * Save all new articles in database
 * @param {string[]} articles : The article list we want to save
 */
 const saveArticle = async (articles) => {

    articles.forEach( async (article) => {
         const title = article.title

         try{
            const articleFound = await Article.findOne({ title })

            if(!articleFound){
                const newArticle = new Article(article)
                await newArticle.save()
            } 
        } catch(e) {
            log.error(`Erreur lors de la sauvegarde de l'article ${article} ` + e)
        }
    })
}

const processCryptoastPage = () => {
        //Process data
        let articles = [];
        let elements = document.querySelectorAll('body > div:nth-child(6) > div > div > div > div:nth-child(2) > div.col-sm-3.my-3');

        for (element of elements) {
            articles.push({
                title: element.querySelector('div.card div.card-body a h4.card-title').textContent,
                img: element.querySelector('div.card a img.card-img-top').src,
                link: element.querySelector('div.card a').href,
                kind: 'news'
            });
        }

        return articles;
}


const pagesIDO = ['https://polkastarter.com/projects','https://www.solanium.io/project','https://raydium.io/acceleRaytor/']

const idoWaiters = ['#app-content > div > div:nth-child(1) > div > div.ps--card-grid > .ps--project-card__blur', 
                    '.invest-card',
                    '#__layout > section > main > div > div:nth-child(3) > div.ant-table-wrapper > div > div > div > div > div > table > tbody > tr']

const idoImageSelectors = ['div.ps--project-card__header > div.ps--project-card__logo > img',
'a > article > div.media-left > div','td:nth-child(1) > span > img']

const idoNameSelectors = ['div.ps--project-card.ps--hover > a > div.ps--project-card__wrapper > div.ps--project-card__info > div.ps--project-card__info__project > h3'
,'a > article > div.media-content > div > div.is-flex.is-justify-content-space-between > h5','td:nth-child(1) > span > span']

const idoStatusSelectors = ['div.ps--project-card.ps--hover > a > div.ps--project-card__status > div',
'a > article > div.media-content > div > div:nth-child(3) > div > div > div > div.is-label','td:nth-child(7) > span > span']

const idoLinkSelectors = ['div.ps--project-card.ps--hover > a','a','td:nth-child(7) > span > span']

const idoBlockChainSelectors = ['div.ps--project-card.ps--hover > a > div.ps--project-card__wrapper > div.ps--project-card__info > div.ps--project-card__info__networks > svg:nth-child(1)','','']

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

    log.debug('Projets récupérés : ' + JSON.stringify(idoProjects))

    idoProjects = idoProjects.filter(project => !statusFilters.includes(project.status?.toLowerCase()))
    idoProjects.forEach(project => project.name = project.name.replaceAll(' ', '').replaceAll('\n', '').replaceAll('$',''));
    idoProjects.forEach(project => project.status = project.status?.replaceAll('ends in:', '-end-soon')?.replaceAll('starts in:', '-soon')?.replaceAll(' ', ''));
    idoProjects.forEach(project => project.img = project.img.replaceAll("url(\"","").replaceAll("\")",""));

    log.debug('Projets filtrés : ' + JSON.stringify(idoProjects))
    await browser.close();

    saveProjects(idoProjects)
    log.info('END - Scrapping IDO');

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
            projects.push({
                name: element.querySelector(await getIdoNameSelector()).textContent,
                img: await getIdoIndex() != 1 ? element.querySelector(await getImageSelector()).src : element.querySelector(await getImageSelector()).style.backgroundImage,
                link: element.querySelector(await getLinkSelector())?.href,
                status: element.querySelector(await getStatusSelector())?.textContent,
                //blockchain : getIdoIndex() > 1 ? 'solana' : element?.querySelector(await getBlockchainSelector())?.dataset?.projectPartialTarget
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
// log.setLevel(process.env.LOG_LEVEL)
// scrapIDO();


module.exports = { scrapCryptoast, scrapIDO }
