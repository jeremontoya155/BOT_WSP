const { createBot, createProvider, createFlow, addKeyword, EVENTS } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')
const path=require("path")
const { readFile } = require('fs')
const fs=require("fs")
// const chat=requiere("./chat")
require("dotenv")
const {handlerAI}=require("./whisper")


const menuPath=path.join(__dirname,"mensajes","menu.txt")
const menu= fs.readFileSync(menuPath,"utf8")
const flowSecundario = addKeyword(['2', 'siguiente']).addAnswer(['📄 Aquí tenemos el flujo secundario'])



const flowVoice=addKeyword(EVENTS.VOICE_NOTE).addAnswer("Esto es una nota de voz",null,async(ctx,ctxFn)=>{
    const text=await handlerAI(ctx)
    console.log(text)

    

})


const flowMenu=addKeyword(EVENTS.ACTION)
    .addAnswer("Gracias por elegirnos para cualquier informacion sobre nosotros le pedimos que revise nuestra red https://dlr.com.ar/empresa/")


const flowRespuesta=addKeyword(EVENTS.ACTION)
    .addAnswer("Este es el flow de respuestas")
    .addAnswer("Hace tu consulta",{capture:true},async(ctx,ctxFn)=>{
        const prompt="Responde Hola"
        const consulta=ctx.Body
       
        console.log(consulta)   
    })


const flowAudio=addKeyword(EVENTS.ACTION)
    .addAnswer("Este es el flow del Audios")

const flowWelcome=addKeyword(EVENTS.WELCOME)
    .addAnswer("Bienvenido",{
        delay:1000
    },
    async(ctx,ctxFn)=>{
        
        if(ctx.body.includes("?","¿")){
            
        await ctxFn.flowDynamic("Notamos que hizo una pregunta quiere escribir menu asi ingresa en la guia general?")}
        else{
            console.log(ctx.body)
            await ctxFn.flowDynamic("Le informamos que para continuar debe ingresar la plabara 'Menu'")}
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
    return gotoFlow(flowMenu);
    case "2":
    return gotoFlow(flowRespuesta);
    case "3":
    return gotoFlow(flowAudio);
    case "0":
    return await flowDynamic(
    "Saliendo... Puedes volver a acceder a este menú escribiendo '*Menu"
    );
    
    }
    }
    );




const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flowWelcome,menuFlow,flowMenu,flowRespuesta,flowAudio,flowVoice])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()
