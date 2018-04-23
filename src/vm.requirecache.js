var core_vm=require('./vm.0webcore.js');
var _reqlib=require('./vm.requirelib.js');
var sub_inrequires={};
var ensurce_sub_inrequire=function(app){
		if(!sub_inrequires[app.id]){
			sub_inrequires[app.id]=function (_subid) {
				if(app.__cache.get_jslib(_subid)){
				}else if(app.config.path.lib[_subid]) {
					_subid=app.config.path.lib[_subid];
				}
				return inrequire(app,null,_subid, '','lib','inreq');
			};
			Object.defineProperty(sub_inrequires,app.id,{configurable: false,enumerable:false,writable:false});
		}
}
var inrequire=function(app,vm,id,parentId,type,where,urlsid) {
	var mod;
	if(type=='lib'||type=='json')mod = app.__cache.get_jslib(id);
	else						 mod = app.__cache.vmlib[id];
	if(!mod){
		return null;
	}else if(type=='vm' && mod.__extend_from && where=='check'){
		return core_vm.extend.inmem(app,vm,id,mod.__extend_from);
	}
	if(mod.mode!=='lib' && typeof (mod.block)=='function') {
		mod.exports = {};
		ensurce_sub_inrequire(app);
		try{
			var sub_inrequire = sub_inrequires[app.id];
			mod.block.call(vm||{},sub_inrequire, mod, mod.exports,app);
		}catch(e){
			console.error("inrequire_execute_error",id,e,'parentId='+parentId,'app.id='+app.id);
			core_vm.onerror(app,"inrequire_execute_error",id,e);
			mod.exports = {};
		}
		if(type=='lib'){
			mod.mode='lib';		delete mod.block;
		}else if(mod.mode!==undefined){
		}else{
			if(Object.keys(mod.exports).length==0){
				mod.mode='vmfn';
			}else{
				if(mod.exports[core_vm.aprand]){
					mod.exports={};
				}
				mod.mode='lib';
				delete mod.block;
			}
		}
	}
	if(mod.mode=='vmfn')return {};
	if(!mod.exports)return null;
	if(where=='inreq')return core_vm.tool.objClone(mod.exports);
	else return mod.exports;
}
var extendvm=function(app,id,extend_from){
	var mod = app.__cache.vmlib[id];
	if(mod){
		mod.__extend_from=extend_from;
	}
}
var define =function(spec,id, block,type,refsid) {
	var mod = {};
	if(core_vm.isfn(block)){
		mod.block=block;
	}else{
		mod.exports=block;
		mod.mode='lib';
	}
	if(type=='vm'){
		spec.app.__cache.add_vmlib(id,mod,refsid);
	}else{
		spec.app.__cache.add_jslib(id,mod,refsid);
	}
	return mod;
}
var loadfilefresh_clear = function(spec,id){
	spec.app.__cache.loadfilefresh_clear(id);
}
module.exports={
	define:define,
	get:inrequire,
	extendvm:extendvm,
	loadfilefresh_clear:loadfilefresh_clear
};
