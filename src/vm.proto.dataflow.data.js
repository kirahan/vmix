var core_vm=require('./vm.0webcore.js');
module.exports.setproto=function(proto){
proto.__setData=function(p,v){
	core_vm.tool.objSetDeep(this.data,p,v)
}
proto.__getData=function(p){
	return core_vm.tool.objGetDeep(this.data,p)
}
var blank=function(){}
var check_source=function(vm,p){
	var fp=p.split('.')[0];
	if(vm[core_vm.aprand].datafrom_parent.indexOf(fp)>-1)return 'parent';
	if(vm[core_vm.aprand].datafrom_store.indexOf(fp)>-1)return 'store';
	return 'self';
}
proto.__autobind_setData=function(p,v,oldv){
	this.setData(p,v);
}
proto.getData=function(p,cb){
	if(!p || !core_vm.isfn(cb))return;
	var vm=this;
	var source=check_source(vm,p);
	if(source=='self'){
		cb(null,null,source);
	}else if(source=='store'){
		vm.getapp().store.get.call(vm.getapp(),vm,p,function(data,opt){
			cb(data,opt,source);
		});
	}else if(source=='parent'){
		var pcb=vm.pvm.dataProxy;
		if(pcb)pcb=pcb.get;
		if(core_vm.isfn(pcb)){
			pcb.call(vm.pvm,vm,p,function(data,opt){
				cb(data,opt,source);
			})
		}else{
			cb(null)
		}
	}
}
proto.setData=function(p,v,cb){
	var vm=this;
	if(!core_vm.isfn(cb))cb=vm.__blankfn;
	if(!p||v==undefined)return cb(false);
	var oldv=vm.__getData(p);
	if(oldv===v)return cb(false);
	var source=check_source(vm,p);
	if(source=='self'){
		vm.__confirm_set_data_to_el(vm,p,v,oldv,cb);
		cb(true,null,source);
	}else if(source=='store'){
		vm.getapp().store.set.call(vm.getapp(),vm,p,v,function(res,opt){
			if(res)vm.__confirm_set_data_to_el(vm,p,v,oldv,cb);
			cb(res,opt,source);
		});
	}else if(source=='parent'){
		var pcb=vm.pvm.dataProxy;
		if(pcb)pcb=pcb.set;
		if(core_vm.isfn(pcb)){
			pcb.call(vm.pvm,vm,p,v,function(res,opt){
				if(res)vm.__confirm_set_data_to_el(vm,p,v,oldv,cb);
				cb(res,opt,source);
			})
		}else{
			cb(false,null,source)
		}
	}else{
		cb(false,'datasource not match',source)
	}
}
proto.addData=function(p,index,v,cb){
	var vm=this;
	if(!core_vm.isfn(cb))cb=vm.__blankfn;
	if(!p||v==undefined)return cb(false);
	var source=check_source(vm,p);
	if(source=='self'){
		vm.__confirm_add_data_to_el(vm,p,index,v,cb);
	}else if(source=='store'){
		vm.getapp().store.add.call(vm.getapp(),vm,p,index,v,function(res,opt){
			if(res)vm.__confirm_add_data_to_el(vm,p,index,v,cb);
			else cb(res,opt,source);
		});
	}else if(source=='parent'){
		var pcb=vm.pvm.dataProxy;
		if(pcb)pcb=pcb.add;
		if(core_vm.isfn(pcb)){
			pcb.call(vm.pvm,vm,p,index,v,function(res,opt){
				if(res)vm.__confirm_add_data_to_el(vm,p,index,v,cb);
				else cb(res,opt,source);
			})
		}else{
			cb(false,null,source)
		}
	}else{
		cb(false,'datasource not match',source);
	}
}
proto.delData=function(p,index,count,cb){
	var vm=this;
	if(!core_vm.isfn(cb))cb=vm.__blankfn;
	if(!p)return cb(false);
	if(parseInt(index)!==index)return;
	if(!count)count=1;
	var source=check_source(vm,p);
	if(source=='self'){
		vm.__confirm_del_data_to_el(vm,p,index,count,cb);
	}else if(source=='store'){
		vm.getapp().store.del.call(vm.getapp(),vm,p,index,count,function(res,opt){
			if(res)vm.__confirm_del_data_to_el(vm,p,index,count,cb)
			else cb(res,opt,source);
		});
	}else if(source=='parent'){
		var pcb=vm.pvm.dataProxy;
		if(pcb)pcb=pcb.del;
		if(core_vm.isfn(pcb)){
			pcb.call(vm.pvm,vm,p,index,count,function(res,opt){
				if(res)vm.__confirm_del_data_to_el(vm,p,index,count,cb);
				else cb(res,opt,source);
			})
		}else{
			cb(false,null,source)
		}
	}else{
		cb(false,'datasource not match',source)
	}
}
}