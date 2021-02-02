const nodemailer = require('nodemailer');
const pug = require('pug');
const juice = require('juice');
const htmlToText = require('html-to-text');
const util = require('util');
const emailConfig = require('../config/email');
const { node } = require('webpack');

let transport = nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    auth: {
        user: emailConfig.user,
        pass: emailConfig.pass
    }
});

// Generar HTML

const generarHTML = (archivo, opciones = {}) => {   // opciones = {} es igual a vacio si no se pasa el parametrp
    // importamos el archivo pug
    const html = pug.renderFile(`${__dirname}/../views/emails/${archivo}.pug`, opciones);
    return juice(html);
};

exports.enviar = async (opciones) =>{
    const html = generarHTML(opciones.archivo, opciones);
    const text = htmlToText.htmlToText( html);
    let opcionesEmail = {
        from: 'Uptask <no-reply@uptask.com>',
        to: opciones.usuario.email,
        subject: opciones.subject,
        text: text,
        html     // html: html se mapea a html s
    };

    // util permite que un promise acepte async
    const enviarEmail = util.promisify(transport.sendMail, transport);
    return enviarEmail.call(transport, opcionesEmail);
    
}


