var Sib = require('sib-api-v3-sdk');
var defaultClient = Sib.ApiClient.instance;
var apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.SENDI_BLUE_API_KEY;



module.exports = {
    sendEmail: async (receiverEmail, emailBody, subject) => {
        try {
            const tranEmailApi = new Sib.TransactionalEmailsApi();
            const sender = { email: process.env.SENDI_BLUE_SENDER_EMAIL_ADDRESS };
            const receivers = [{ email: receiverEmail }];


            let email = await tranEmailApi.sendTransacEmail({ sender, to: receivers, subject: subject, htmlContent: emailBody });
        
        } catch (error) {

            console.log(error);
        }
        return true;
    }
}
