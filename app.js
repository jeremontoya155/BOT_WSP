const { createBot, createProvider, createFlow, addKeyword, EVENTS } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')
const path=require("path")
const { readFile } = require('fs')
const fs=require("fs")


const menuPath=path.join(__dirname,"mensajes","menu.txt")
const menu= fs.readFileSync(menuPath,"utf8")
const flowSecundario = addKeyword(['2', 'siguiente']).addAnswer(['📄 Aquí tenemos el flujo secundario'])

const flowDocs = addKeyword(['doc', 'documentacion', 'documentación']).addAnswer(
    [
        '📄 Aquí encontras las documentación recuerda que puedes mejorarla',
        'https://bot-whatsapp.netlify.app/',
        '\n*2* Para siguiente paso.',
    ],
    null,
    null,
    [flowSecundario]
)

const flowTuto = addKeyword(['tutorial', 'tuto']).addAnswer(
    [
        '🙌 Aquí encontras un ejemplo rapido',
        'https://bot-whatsapp.netlify.app/docs/example/',
        '\n*2* Para siguiente paso.',
    ],
    null,
    null,
    [flowSecundario]
)

const flowGracias = addKeyword(['gracias', 'grac']).addAnswer(
    [
        '🚀 Puedes aportar tu granito de arena a este proyecto',
        '[*opencollective*] https://opencollective.com/bot-whatsapp',
        '[*buymeacoffee*] https://www.buymeacoffee.com/leifermendez',
        '[*patreon*] https://www.patreon.com/leifermendez',
        '\n*2* Para siguiente paso.',
    ],
    null,
    null,
    [flowSecundario]
)

const flowDiscord = addKeyword(['discord']).addAnswer(
    ['🤪 Únete al discord', 'https://link.codigoencasa.com/DISCORD', '\n*2* Para siguiente paso.'],
    null,
    null,
    [flowSecundario]
)

const flowPrincipal = addKeyword(['hola', 'ole', 'alo'])
    .addAnswer('🙌 Hola bienvenido a este *Chatbot*')
    .addAnswer(
        [
            'te comparto los siguientes links de interes sobre el proyecto',
            '👉 *doc* para ver la documentación',
            '👉 *gracias*  para ver la lista de videos',
            '👉 *discord* unirte al discord',
        ],
        null,
        null,
        [flowDocs, flowGracias, flowTuto, flowDiscord]
    )


const flowWelcome=addKeyword(EVENTS.WELCOME)
    .addAnswer("Flujo Welcome",{
        delay:1000
    },
    async(ctx,ctxFn)=>{

        if(ctx.body.includes("perro")){
            
        await ctxFn.flowDynamic("Este es el flow dinamico pero escribieron una palabra clave")}
        else{
            console.log(ctx.body)
            await ctxFn.flowDynamic("Este es el flow dinamico")}
        }
            
    
    )


    // const menu = "Este es el menu de opciones, elegi opciones 1,2,3,4,5 o 0"
    const menuFlow = addKeyword('Menu').addAnswer(
    menu,
    { capture: true },
    async (ctx, { gotoFlow, fallBack, flowDynamic }) => {
    if (!["1", "2", "3", "4", "5", "0"].includes(ctx.body)) {
    return fallBack(
    "Respuesta no válida, por favor selecciona una de las opciones."
    );
    }
    switch (ctx.body) {
    case "1":
    return await flowDynamic("menu1");
    case "2":
    return await flowDynamic("menu2");
    case "3":
    return await flowDynamic("menu3");
    case "4":
    return await flowDynamic("menu4");
    case "5":
    return await flowDynamic("menu5");
    case "0":
    return await flowDynamic(
    "Saliendo... Puedes volver a acceder a este menú escribiendo '*Menu"
    );
    
    }
    }
    );




const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flowPrincipal,flowWelcome,menuFlow])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()
