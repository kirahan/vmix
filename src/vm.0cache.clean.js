
var core_vm=require('./vm.0webcore.js');
module.exports.setproto=function(proto){
proto.loadfilefresh_clear=function(id){
	if(this.vmlib[id]){
		delete this.vmlib[id];
		delete this.vmbody[id];
		delete this.vmstyle[id];
	}
	if(this.jslib[id]){
		delete this.jslib[id];
	}
}
proto.removesid=function(sid){
	delete this.vmsbysid[sid];
	delete this.vmparent[sid];
	for(var csid in this.vmparent){
		if(this.vmparent[csid]==sid){
			delete this.vmparent[csid];
			this.removesid(csid);
		}
	}
}
proto.keep=function(type,id){
	if(type=='vm' && this.vmlib[id])this.vmlib[id].inpath=1;
	if(type=='lib' && this.jslib[id])this.jslib[id].inpath=1;
}
proto.delete=function(mod,id){
	if(mod && mod[id] &&mod[id].refsids.length==0 &&!mod[id].inpath)delete mod[id];
}
proto.clean_when_vm_clean=function(vm){
	this.removesid(vm.sid);
	var absrc=vm.absrc;
	var absrcid=vm[core_vm.aprand].absrcid;
	if(!this.vmlib[absrc]||this.vmlib[absrc].inpath==1){
		return;
	}
	var sameurl=0;
	for(var i in this.vmsbysid){
		if(this.vmsbysid[i][core_vm.aprand].has_started==0)continue;
		if(this.vmsbysid[i][core_vm.aprand].absrcid===vm[core_vm.aprand].absrcid)sameurl++;
	}
	if(sameurl>0){
		return;
	}
	delete this.vmbody[absrc];
	delete this.vmstyle[absrc];
	delete this.vmlib[absrc];
	this.clean_import(absrcid);
	for(var k in this.vmlib){
		var mod=this.vmlib[k];
		if(mod && Array.isArray(mod.refsids)){
			var index=mod.refsids.indexOf(absrcid);
			if(index>-1){
				mod.refsids.splice(index,1);
				this.delete(this.vmlib,k);
			}
		}
	}
	for(var k in this.jslib){
		var mod=this.jslib[k];
		if(mod && Array.isArray(mod.refsids)){
			var index=mod.refsids.indexOf(absrcid);
			if(index>-1){
				mod.refsids.splice(index,1);
				this.delete(this.jslib,k);
			}
		}
	}
}
}