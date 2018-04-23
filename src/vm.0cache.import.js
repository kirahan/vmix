var core_vm=require('./vm.0webcore.js');
module.exports.setproto=function(proto){
proto.add_import_src_when_cal=function(type,urlsid,name,src){
	var a=urlsid+':'+name;
	if(type=='vm')	this.import_src_vm[a]=src;
	if(type=='block')this.import_src_block[a]=src;
	if(type=='lib'||type=='json')	this.import_src_lib[a]=src;
}
proto.check_if_import=function(type,urlsid,name){
	var a=urlsid+':'+name;
	if(type=='vm')	return this.import_src_vm[a]||'';
	if(type=='block')return this.import_src_block[a]||'';
	if(type=='lib'||type=='json')	return this.import_src_lib[a]||'';
}
proto.clean_import=function(absrcid){
	for(var k in this.import_src_block){
		if(k.indexOf(absrcid+':')==0){
			var b_absrc=this.import_src_block[k];
			var styleobj=this.importblock[b_absrc];
			if(styleobj && styleobj.refsids){
				var index=styleobj.refsids.indexOf(absrcid);
				if(index>-1)styleobj.refsids.splice(index,1);
				this.delete(this.importblock,b_absrc);
			}
			delete this.import_src_block[k];
		}
	}
	for(var k in this.import_src_lib){
		if(k.indexOf(absrcid+':')==0){
			var b_absrc=this.import_src_lib[k];
			var styleobj=this.jslib[b_absrc];
			if(styleobj && styleobj.refsids){
				var index=styleobj.refsids.indexOf(absrcid);
				if(index>-1)styleobj.refsids.splice(index,1);
				this.delete(this.jslib,b_absrc);
			}
			delete this.import_src_lib[k];
		}
	}
	for(var k in this.import_src_vm)   {
		if(k.indexOf(absrcid+':')==0){
			for(var i in this.vmsbysid){
				if(this.vmsbysid[i].absrc===this.import_src_vm[k]){
					var vmod=this.vmlib[this.import_src_vm[k]];
					if(vmod && vmod.refsids){
						var index=vmod.refsids.indexOf(absrcid);
						if(index>-1){
							vmod.refsids.splice(index,1);
							this.clean_when_vm_clean(this.vmsbysid[i]);
						}
					}
					break;
				}
			}
			this.delete(this.import_src_vm,k);
		}
	}
	for(var k in this.importstyle){
		if(this.importstyle[k].refsids){
			var index=this.importstyle[k].refsids.indexOf(absrcid);
			if(index>-1)this.importstyle[k].refsids.splice(index,1);
			this.delete(this.importstyle,k);
		}
	}
}
}