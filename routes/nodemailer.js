const nodemailer=require( 'nodemailer');
require('dotenv').config();

const transport=nodemailer.createTransport({
	service: 'Gmail',
	auth:{
		user: "webthuvien123",
		pass: "CTT534-LTUDWNC.?"
	},
	tls:{
		rejectUnauthorized:false
	}
});

module.exports={
	sendMail(from,to,subject,html){
		return new Promise((resolve,reject)=>{
			transport.sendMail({from,subject,to,html},(err,info)=>{
				if(err) reject(err);
				resolve(info);
			});
		});
	}
} 