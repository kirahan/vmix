var data={
	version:'root.1',
	name:'liyong1',
	obj:{version:111,name:'root_liyong',age:123},

}

var vms={};
var datacenter={};
datacenter.get=function(vm,path,value,cb){
	console.log("datacenter.get",'vmid='+vm.id,'path='+path);
	return {vmid:vm.id,path:path}
};
datacenter.delete=function(vm,path,value,cb){
	console.log("datacenter.delete",'vmid='+vm.id,path);		
	cb('datacenter.delete.ok')
};
datacenter.put=function(vm,path,value,cb){
	console.log("datacenter.put",'vmid='+vm.id,path,value);
	if(path=='name'){
		console.log("修改.name",path,value,'原来='+data.name);
		data.name=value;
		if(vms['datarelevant'])vms['datarelevant'].ondatachange.call(vms['datarelevant'],path,value)
		if(vms['datarel2'])vms['datarel2'].ondatachange.call(vms['datarel2'],path,value)
	}else{
		vm.objSetDeep(vm.data,path,value);	
	}
	if(cb)cb('datacenter.put.ok')
};
datacenter.post=function(vm,path,value,cb){
	console.log("datacenter.post",'vmid='+vm.id,path,value);
	cb('datacenter.post.ok')
};
datacenter.start=function(vm,path,value,cb){
	var obj={
		version:data.version,
		name:data.name,
		obj:data.obj,
		books:[{name:1},{name:2},{name:3}]
	};	
	if(vm.id=='datarelevant'){
		vms['datarelevant']=vm;
		return obj; 
	}else if(vm.id=='datarel2'){		
		vms['datarel2']=vm;
		return obj; 
	}if(vm.id=='hassub'){
		return obj; 
	}else if(vm.id=='datacenter3'){//sample return bubble
		return obj
	}else if(vm.id=='datacenter'){
		setTimeout(function(){
			cb(obj); 
		},100);
		return 'wait';
	}
}

module.exports=function(type,vm,path,value,cb){
	if (!datacenter[type])return null;
	//console.log("datacenter,type="+type,'vm.id='+vm.id,path);
	return datacenter[type](vm,path,value,cb)
}