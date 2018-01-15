var core_vm=require('./vm.0webcore.js');
module.exports.setproto=function(proto){
proto.setChildOption=function(cvmid,p,v,cb){
	var vm=this;
	if(!core_vm.isfn(cb))cb=this.__blankfn;
	var cvm=this.getChild(cvmid);
	if(!cvm)return cb(false);
	if(!cvm[core_vm.aprand].has_started){
		core_vm.tool.objSetDeep(cvm[core_vm.aprand].append_option,p,v,true);
		return;
	}
	var oldv=core_vm.tool.objGetDeep(cvm.option,p);
	if(oldv===v)return cb(false);
	var obj=cvm[core_vm.aprand].watching_option[p];
	if(Array.isArray(obj)){
		obj.forEach(function(opt){
			core_vm.tool.objSetDeep(cvm.option,p,v);
			core_vm.watchcb.watch(opt,p,oldv,v)
		})
		var fn=cvm.event['pvm.setoption'];
		if(core_vm.isfn(fn))fn.call(cvm,{path:p,newv:v,oldv:oldv});
	}else{
		cb(false);
	}
}
}