const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

console.log("Starting WhatsApp Native Client...");

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

let isClientReady = false;

client.on('qr', (qr) => {
    // Generate and scan this code with your phone
    console.log('\n========================================================================');
    console.log('📱 SCAN THIS QR CODE IN YOUR ACTIVE WHATSAPP TO LINK THE SERVER 📱');
    console.log('   (Open WhatsApp -> Linked Devices -> Link a Device)');
    console.log('========================================================================\n');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('✅ WhatsApp Web Client is successfully logged in and ready!');
    isClientReady = true;
});

client.on('auth_failure', (msg) => {
    console.error('❌ WhatsApp Authentication Failed:', msg);
});

client.on('disconnected', (reason) => {
    console.log('❌ WhatsApp was disconnected:', reason);
    isClientReady = false;
});

// Initialize the WhatsApp Web connection immediately
client.initialize();
console.log("WhatsApp module initialized. Waiting for QR code or saved session...");

const sendWhatsAppMessage = async (to, message) => {
    if (!isClientReady) {
        console.log(`[WhatsApp Pending] Your Trackify server has not been linked to a WhatsApp yet.\nPlease look at your Node Server terminal and scan the QR code first!`);
        return;
    }

    try {
        // Strip out all non-numeric characters from the phone number
        let formattedTo = String(to).replace(/\D/g, '');

        // If they enter 10 digits (Standard Indian Phone length), add 91 prefix
        if (formattedTo.length === 10) {
            formattedTo = `91${formattedTo}`;
        }

        // Format for whatsapp-web.js: Requires trailing @c.us for personal accounts
        const contactId = `${formattedTo}@c.us`;

        // Dispatch the message directly through exactly as if the physical phone typed it
        await client.sendMessage(contactId, message);
        console.log(`WhatsApp message sent natively to +${formattedTo}`);
    } catch (error) {
        console.error(`[WhatsApp Native Error] Failed to send message to ${to}:`, error.message);
    }
};

module.exports = { sendWhatsAppMessage };
