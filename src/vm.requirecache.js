var core_vm=require('./vm.0webcore.js');
var _reqlib=require('./vm.requirelib.js');
var sub_inrequire = function (_subid) {
	if(core_vm.gcache.get_jslib(_subid)){
	}else if(core_vm.wap.config.path.lib[_subid]) {
		_subid=core_vm.wap.config.path.lib[_subid];
	}
	return inrequire(_subid, '','lib','inreq');
};
var inrequire=function(id, parentId,type,where,urlid) {
	var mod;
	if(type=='lib'||type=='json')	mod = core_vm.gcache.get_jslib(id);
	else		    mod = core_vm.gcache.vmlib[id];
	if(!mod){
		return null;
	}
	if(mod && mod.exports === undefined) {
		var block = mod.block;	delete mod.block;
		mod.exports = {};
		try{
			block.call(null,sub_inrequire, mod, mod.exports,core_vm.wap);
		}catch(e){
			core_vm.onerror("inrequire_execute_error",id,e);
			mod.exports = {};
		}
	}
	if(!mod.exports)return null;
	if(where=='inreq')return core_vm.tool.objClone(mod.exports);
	else
		return mod.exports;
}
function define(id, block,type,refid) {
	var mod = {};
	if(core_vm.isfn(block))mod.block=block;
	else mod.exports=block;
	if(type=='vm'){
		core_vm.gcache.newvmlib(id,mod,refid);
	}else{
		core_vm.gcache.newjslib(id,mod,refid);
	}
	return mod;
}
inrequire.define = define;
inrequire.loadfilefresh_clear = function(id){
		core_vm.gcache.loadfilefresh_clear(id);
}
module.exports=inrequire;
