const path = require('path');
const ejs = require('ejs');
const emailService = require("./utils/sendEmail");
console.log("Child Created", process.pid);
process.on('message', async(msg)=>{
  try{
    const data = msg;
    console.log("In child: ", data);

        console.log("HostData in child: ", data.hostData);
        console.log("ParticipantData in child: ", data.participantsData);
        console.log("Slug in child: ", data.slug);
        

for(i=0;i<data.hostData.length;i++){  
 // connecting ejs file
 const emailBodyPath = path.join(__dirname, './views/joinmeeting.ejs');
 console.log("email path in loop in child:", emailBodyPath);
 const email = data.hostData[i].uemail;
//  console.log(email);
 const name = data.hostData[i].ufname;
 const slug= data.slug;
 const urlPath = process.env.LOCAL_HOST_URL
 console.log(email, name, slug, urlPath);
 const emailBody =  await ejs.renderFile(emailBodyPath, {slug, name,urlPath});
//  console.log(emailBody);
 // sending email
  await emailService.sendEmail(email, emailBody, "Join Link")
}


for(i=0;i<data.participantsData.length;i++){
  // connecting ejs file
  const emailBodyPath = path.join(__dirname, './views/joinmeeting.ejs');
  // console.log("Email Body Path: ", emailBodyPath);
  const email = data.participantsData[i].uemail;
  console.log("Email: ", email);
  const name = data.participantsData[i].ufname;
  const urlPath = process.env.LOCAL_HOST_URL
  const slug = data.slug;
  const emailBody =  await ejs.renderFile(emailBodyPath, {slug,name,urlPath});
  // console.log("Email Body: ", emailBody);
  // sending email
  await emailService.sendEmail(email, emailBody, "Join Link")
  console.log("mail sent");
 }

  }catch(e){
console.log(e);
  }

process.exit(0);

})