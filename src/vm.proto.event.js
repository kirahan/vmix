var core_vm=require('./vm.0webcore.js');
module.exports.setproto=function(proto){
proto.pubapp=function(name,data,cb){
	core_vm.wap.pub(name,data,this,cb)
}
proto.pubup=function(name,data,cb){
	if(!this.pvm){
		return;
	}
	var fn=this[core_vm.aprand].pvmevent[name];
	if(!fn)fn=this.pvm.event[this.id+'.'+name];
	if(!fn)return;
	if(!core_vm.isfn(fn))fn=core_vm.tool.objGetDeep(this.pvm,fn);
	if(!core_vm.isfn(fn))return;
	var vm=this;
	var pvm=this.pvm;
	fn.call(this.pvm,data,this,function(data){
		if(core_vm.isfn(cb))cb.call(vm,data,pvm);
	})
}
proto.pubdown=function(cvmid,name,data,cb){
	var vm=this;
	if(typeof (cvmid)=='object')cvmid=cvmid.id;
	if(!cvmid)return false;
	var s=[]
	if(cvmid=='*'){
		s=Object.keys(this[core_vm.aprand].vmchildren)
	}else{
		s=[cvmid];
	}
	s.forEach(function(cvmid){
		var cvm=vm.getChild(cvmid);
		if(!cvm){
			if(core_vm.isfn(cb))cb({error:'no.such.'+cvmid});
			return;
		}
		var fn=cvm.event['pvm.'+name];
		if(!core_vm.isfn(fn))return;
		fn.call(cvm,data,vm,function(data){
			if(core_vm.isfn(cb))cb.call(vm,data,cvm);
		})
	})
}
}