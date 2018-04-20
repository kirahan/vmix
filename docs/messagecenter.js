module.exports={
	"allowall":true,
	"modal":{	
	},
	//'vm1_vm2':'yes1',
	/*'vm2_vm1':{
		sender:['messagesample.vm2'],
		receiver:'*',
		center:function(event,system_cb){	
			console.log("结果到中心来了 1",event.sender,event.message,event.receiver,event.result);
			//event.sendercallback(event.receiver,'我修改的结果');
			system_cb();
		},	
	},*/
	"qqq":{},
	"sss":{
		sender:['modtest2'],
		receiver:'*',
		center:function(event,system_cb){
			console.log("结果到中心来了 2");
			cb(res)
		},
	}
}

