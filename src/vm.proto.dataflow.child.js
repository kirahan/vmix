var core_vm=require('./vm.0webcore.js');
module.exports.setproto=function(proto){
proto.setChildData=function(cvmid,p,v,cb){
	var vm=this;
	if(!core_vm.isfn(cb))cb=this.__blankfn;
	if(typeof (cvmid)=='object')cvmid=cvmid.id;
	var cvm=this.getChild(cvmid);
	if(!cvm){
		cb(false);
		return;
	}
	if(!cvm[core_vm.aprand].has_started){
		core_vm.tool.objSetDeep(cvm[core_vm.aprand].append_data,p,v,true);
		var path=p.split('.')[0];
		if(cvm[core_vm.aprand].datafrom_parent.indexOf(path)===-1){
			cvm[core_vm.aprand].datafrom_parent.push(path);
		}
		return;
	}
	var oldv=cvm.__getData(p);
	if(oldv===v){
		cb(false);
		return;
	}
	var fp=p.split('.')[0];
	if(cvm[core_vm.aprand].datafrom_parent.indexOf(fp)==-1){
		cb(false,'datasource not match');
		return;
	}
	cvm.__confirm_set_data_to_el(cvm,p,v,oldv);
	cb(true,null);
	var fn=cvm.event['pvm.setdata'];
	if(core_vm.isfn(fn))fn.call(cvm,{path:p,oldv:oldv,newv:v})
}
proto.addChildData=function(cvmid,p,index,v,cb){
	var vm=this;
	if(!core_vm.isfn(cb))cb=this.__blankfn;
	if(typeof (cvmid)=='object')cvmid=cvmid.id;
	var cvm=this.getChild(cvmid);
	if(!cvm){
		cb(false);
		return;
	}
	var fp=p.split('.')[0];
	if(cvm[core_vm.aprand].datafrom_parent.indexOf(fp)==-1){
		cb(false,'datasource not match');
		return;
	}
	cvm.__confirm_add_data_to_el(cvm,p,index,v,function(res){
		cb(res);
	});
	var fn=cvm.event['pvm.adddata'];
	if(core_vm.isfn(fn))fn.call(cvm,{path:p,index:index,value:v});
}
proto.delChildData=function(cvmid,p,index,count,cb){
	var vm=this;
	if(!core_vm.isfn(cb))cb=this.__blankfn;
	if(typeof (cvmid)=='object')cvmid=cvmid.id;
	var cvm=this.getChild(cvmid);
	if(!cvm){
		cb(false);
		return;
	}
	var fp=p.split('.')[0];
	if(cvm[core_vm.aprand].datafrom_parent.indexOf(fp)==-1){
		cb(false,'datasource not match');
		return;
	}
	cvm.__confirm_del_data_to_el(cvm,p,index,count,function(res){
		cb(res);
	});
	var fn=cvm.event['pvm.deldata'];
	if(core_vm.isfn(fn))fn.call(cvm,{path:p,index:index,count:count});
}
}