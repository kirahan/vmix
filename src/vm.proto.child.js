var core_vm=require('./vm.0webcore.js');
module.exports.setproto=function(proto){
proto.hasChild=function(id){
	if(this[core_vm.aprand].vmchildren[id+''])return true;
	else return false;
}
proto.getChild=function(id){
	if(this[core_vm.aprand].vmchildren[id]){
		return this[core_vm.aprand].vmchildren[id];
	}else if(id.indexOf('.')>-1){
		var tvm=this;
		var parts = ~id.indexOf('.') ? id.split('.') : [id];
		for (var i = 0; i < parts.length; i++){
			tvm = tvm[core_vm.aprand].vmchildren[parts[i]]
			if(tvm===undefined)break;
		}
		return tvm;
	}
}
proto.getParent=function(){
	return this.pvm;
}
proto.removeChild=function(id){
	var cvm;
	if(id instanceof core_vm.define.vmclass && this.sid===id.pvm.sid){
		if (this[core_vm.aprand].vmchildren[id.id] && this[core_vm.aprand].vmchildren[id.id].sid==id.sid)cvm=id;
	}
	else if(core_vm.isstr(id))cvm=this.getChild(id);
	if(cvm){
		cvm.__vmclose();
		core_vm.gcache.removesid(cvm.sid);
		delete this[core_vm.aprand].vmchildren[id];
	}
}
proto.appendChild=function(opt,pnode,ifpnode){
	if(!opt.id || this.hasChild(opt.id)){
		core_vm.devalert('loadsub 缺少id或者重复',opt.id)
		return;
	}
	if(!opt.el)return;
	if(!core_vm.isfn(opt.el.appendChild))return;
	if(!opt.src ){
		if(opt.path)opt.src=core_vm.wap.config.path.vm[opt.path];
		else if(opt.tagname)opt.src=opt.tagname;
	}
	if(!opt.src){
	}
	var cvm=core_vm.define.define({pvm:this,el:opt.el,id:opt.id,src:opt.src});
	if(ifpnode==1){
		if(pnode && pnode.tag){
			core_vm.inject.cal_inject_node(cvm,pnode);
			cvm[core_vm.aprand].pvmevent=pnode.vmevent||{};
			cvm[core_vm.aprand].pvmelevent=pnode.event||{};
			cvm[core_vm.aprand].pvmnode=pnode;
			if(pnode.attr.autostart!=false){
				cvm._is_fresh_ing=this._is_fresh_ing;
				core_vm.loadsubvm.load(cvm);
			}
		}
	}else if(opt){
		var children=(cvm[core_vm.aprand].pvmnode)?cvm[core_vm.aprand].pvmnode.childNodes:[];
		if(core_vm.isobj(opt.event)){
			cvm[core_vm.aprand].pvmevent=opt.event
		}
		if(core_vm.isobj(opt.data)){
			core_vm.tool.deepmerge(cvm[core_vm.aprand].append_data,opt.data);
			for(var k in opt.data){
				if(cvm[core_vm.aprand].datafrom_parent.indexOf(k)===-1){
					cvm[core_vm.aprand].datafrom_parent.push(k);
				}
			}
			for(var i=children.length-1;i>-1;i--){
				if(children[i].tag=='data')children.splice(i,1)
			}
		}
		if(core_vm.isobj(opt.option)){
			core_vm.tool.deepmerge(cvm[core_vm.aprand].append_option,opt.option);
			for(var i =children.length-1;i>-1;i--){
				if(children[i].tag=='option')children.splice(i,1)
			}
		}
		return cvm;
	}
}
}