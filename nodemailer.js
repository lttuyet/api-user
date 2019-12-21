const nodemailer=require( 'nodemailer');
require('dotenv').config();

const transport=nodemailer.createTransport({
	service: 'Gmail',
	auth:{
		user: process.env.EMAIL,
		pass: process.env.PASS_EMAIL
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