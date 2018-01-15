var core_vm=require('./vm.0webcore.js');
module.exports.setproto=function(proto){
proto.cleanList=function(p){
	if(Array.isArray(this[core_vm.aprand].watching_list[p])){
		var listdata=this.__getData(p);
		this[core_vm.aprand].watching_list[p].forEach(function(l_opt){
			core_vm.list.$clean.call(listdata,l_opt);
		});
	}
}
proto.rebuildList=function(p){
	if(Array.isArray(this[core_vm.aprand].watching_list[p])){
		var listdata=this.__getData(p);
		this[core_vm.aprand].watching_list[p].forEach(function(l_opt){
			core_vm.list.$rebuild.call(listdata,l_opt);
		});
	}
}
proto.__blankfn=function(){}
proto.__getrandobj=function(){return this[core_vm.aprand]}
proto.__reset_list_index=function(wopt){
	if(wopt.$index!==undefined && wopt.scope && wopt.scope.$index!==undefined) wopt.scope.$index= wopt.$index;
}
proto.getClassName=function(name){
	return	core_vm.web_private_style.get(this,name);
}
proto.hasSlot=function(name){
	return this[core_vm.aprand].pvmslot[name]?true:false;
}
proto.__ensure_fn=function(){
}
}