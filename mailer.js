import dotenv from "dotenv";
import { SMTPClient } from "emailjs";

const client = new SMTPClient({
  user: "encrypt0r.x86@gmail.com",
  password: dotenv.config().parsed.APP_PASSWORD,
  host: "smtp.gmail.com",
  ssl: true,
});

function sendMail(addr, code) {
  client.send(
    {
      text: "Verification Code is: " + code,
      from: "encrypt0r <encrypt0r.x86@gmail.com>",
      to: `kamuu <${addr}>`,
      subject: "fosrivicat0r",
    },
    (err) => {
      console.log(err);
    }
  );
}

export { sendMail };
