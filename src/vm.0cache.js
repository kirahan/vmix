var core_vm=require('./vm.0webcore.js');
var seed_of_cachesid=0;
var cacheclass=function(){
	this.urlsid=10;
	this.sid=++seed_of_cachesid;
	this.vmsbysid={};
	this.vmparent={};
	this.importvmsrc={};
	this.importblock_src={};
	this.importblock_txt={};
	this.importstyle={};
	this.vmbody={};
	this.vmstyle={};
	this.vmlib={};
	this.jslib={};
	this.urlid={};
	this.idtourl={};
	this.use={
		filter:{},method:{},operator:{},
		domevent:{},dataevent:{},
		block:{},
		elhook:{},
	};
}
var proto=cacheclass.prototype;
require("./vm.0cachebase.js").setproto(proto);
require("./vm.0cachebase2.js").setproto(proto);
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
proto.clean_when_vm_close=function(vm){
	var absrc=vm.absrc;
	var absrcid=vm[core_vm.aprand].absrcid;
	if(!this.vmlib[absrc]||!this.vmlib[absrc].refids){
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
	for(var k in this.importblock_src){
		if(k.indexOf(absrcid+':')==0){
			var b_absrc=this.importblock_src[k];
			var styleobj=this.importblock_txt[b_absrc];
			if(styleobj && styleobj.refids){
				var index=styleobj.refids.indexOf(absrcid);
				if(index>-1)styleobj.refids.splice(index,1);
				if(styleobj.refids.length==0)delete this.importblock_txt[b_absrc];
			}
			delete this.importblock_src[k];
		}
	}
	for(var k in this.importstyle){
		if(this.importstyle[k].refids){
			var index=this.importstyle[k].refids.indexOf(absrcid);
			if(index>-1)this.importstyle[k].refids.splice(index,1);
			if(this.importstyle[k].refids.length==0)delete this.importstyle[k];
		}
	}
	for(var k in this.importvmsrc)   {
		if(k.indexOf(absrcid+':')==0){
			for(var i in this.vmsbysid){
				if(this.vmsbysid[i].absrc===this.importvmsrc[k]){
					var vmod=this.vmlib[this.importvmsrc[k]];
					if(vmod && vmod.refids){
						var index=vmod.refids.indexOf(absrcid);
						if(index>-1){
							vmod.refids.splice(index,1);
							this.clean_when_vm_close(this.vmsbysid[i]);
						}
					}
					break;
				}
			}
			delete this.importvmsrc[k];
		}
	}
	for(var k in this.vmlib){
		var mod=this.vmlib[k];
		if(mod && Array.isArray(mod.refids)){
			var index=mod.refids.indexOf(absrcid);
			if(index>-1){
				mod.refids.splice(index,1);
				if(mod.refids.length==0)delete this.vmlib[k];
			}
		}
	}
	for(var k in this.jslib){
		var mod=this.jslib[k];
		if(mod && Array.isArray(mod.refids)){
			var index=mod.refids.indexOf(absrcid);
			if(index>-1){
				mod.refids.splice(index,1);
				if(mod.refids.length==0)delete this.jslib[k];
			}
		}
	}
}
proto.check_if_vm_inpath=function(id){
	for(var k in core_vm.wap.config.path.vm){
		if(core_vm.wap.config.path.vm[k]===id)core_vm.gcache.vmlib[id].refids=undefined;
	}
}
proto.check_if_lib_inpath=function(id){
	for(var k in core_vm.wap.config.path.lib){
		if(core_vm.wap.config.path.lib[k]===id)core_vm.gcache.jslib[id].refids=undefined;
	}
}
proto.removesid=function(sid){
	delete this.vmsbysid[sid];
	for(var i in this.vmparent){
		if(this.vmparent[i]==sid)this.removesid(i);
	}
}
module.exports=cacheclass;