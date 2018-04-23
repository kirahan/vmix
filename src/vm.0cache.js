var core_vm=require('./vm.0webcore.js');
var cacheclass=function(appid){
	this.appid=appid;
	this.urlsid_seed=10;
	this.urlsid={};
	this.vmsbysid={};
	this.vmparent={};
	this.import_src_vm={};
	this.import_src_block={};
	this.import_src_lib={};
	this.importblock={};
	this.importstyle={};
	this.vmbody={};
	this.vmstyle={};
	this.vmlib={};
	this.jslib={};
	this.use={
		filter:{},method:{},operator:{},
		domevent:{},dataevent:{},
		block:{},
		elhook:{},
	};
}
var proto=cacheclass.prototype;
proto.destroy=function(){
	for(var k in this)this[k]=null;
}
require("./vm.0cache.jslib.js").setproto(proto);
require("./vm.0cache.vm.js").setproto(proto);
require("./vm.0cache.import.js").setproto(proto);
require("./vm.0cache.clean.js").setproto(proto);
require("./vm.0cache.blockstyle.js").setproto(proto);
proto.getapp=function(){
	return core_vm.wap;
}
proto.geturlsid=function(url){
	if(!this.urlsid[url])this.urlsid[url]=this.urlsid_seed++;
	return this.urlsid[url];
}
proto.add_ref=function(type,url,refsid,where){
	var mod;
	if(type=='lib'||type=='json')mod=this.jslib;
	if(type=='vm')	mod=this.vmlib;
	if(type=='style')mod=this.importstyle;
	if(type=='block')mod=this.importblock;
	if(!mod){
		return false;
	}
	mod=mod[url];
	if(!mod)return false;
	if(!mod.refsids)mod.refsids=[];
	if(mod.refsids.indexOf(refsid)===-1){
		mod.refsids.push(refsid);
	}
	return true;
}
proto.check_ifhas=function(type,id,refsid){
  return this.add_ref(type,id,refsid,'check');
}
module.exports=cacheclass;