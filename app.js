import dotenv from 'dotenv';
import { Client, GatewayIntentBits, Partials  } from 'discord.js';
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
        GatewayIntentBits.DirectMessages,
	],
    partials: [Partials.Channel]
});
import { sendMail } from './mailer.js';
import { test_insert, checkCode } from './queree.js';

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

const PREFIX = 'fos';

client.on('messageCreate', (message) => {
    if (message.author.bot) return;
    if (message.channel.type === 0) {
        if (message.content.startsWith(PREFIX)) {
            const args = message.content.slice(PREFIX.length).trim().split(/ +/);
            const command = args.shift().toLowerCase();
    
            if (command === 'hello') {
                message.channel.send('Hello there!');
            }
            if (command === 'ping') {
                const latency = Date.now() - message.createdTimestamp;
                message.channel.send(`Pong! Latency is ${latency}ms.`);
            }
            if (command === 'verify') {
                const email = args[0];
                if (!email) return message.channel.send('Mohon inputkan email, contoh `fosverify jon.doe@mail.com`');
                const code = Math.floor(Math.random() * 1000000);
                message.channel.send(`Sending verification code to ||${email}||...`);
                // build the json data
                const jsonData = {
                    user_id: message.author.id,
                    email: email,
                    code: code,
                };
                test_insert(jsonData);
                client.users.fetch(message.author.id).then((user) => {
                    user.send("Masukkan kode dari email anda dengan command `foskode <kode>`");
                });
                sendMail(email, code);
                message.delete();
            }
        }
    }
    else if (message.channel.type === 1) {
        const args = message.content.slice(PREFIX.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();
        if (command === 'kode') {
            const code = args[0];
            if (!code) return message.channel.send('Mohon inputkan kode, contoh `foskode 123456`');
            message.channel.send('Verifying...');
            checkCode(message.author.id, (err, data) => {
                if (err) {
                  console.error('Error retrieving data:', err);
                  return;
                }
                console.log(data);
                if (data) {
                    console.log(data[0].code);
                    console.log(code);
                    if (data[0].code == code) {
                        message.channel.send('Verifikasi berhasil!');
                    } else {
                        message.channel.send('Kode tidak valid!');
                    }
                }
            });
        }
        if(command === 'help'){
            message.channel.send('hehehe ini help mank');
        }
    }
});



client.login(dotenv.config().parsed.DISCORD_TOKEN);