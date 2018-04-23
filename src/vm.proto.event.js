var core_vm=require('./vm.0webcore.js');
module.exports.setproto=function(proto){
proto.__auto_sub_app=function(){
	for(var k in this.event){
		if(k.substr(0,4)=='app.' && typeof (this.event[k]=='function'))this.getapp().sub(k.substr(4),this,this.event[k])
	}
}
proto.__auto_unsub_app=function(){
	for(var k in this.event){
		if(k.substr(0,4)=='app.' && typeof (this.event[k]=='function'))this.getapp().unsub(k.substr(4),this,this.event[k])
	}
}
proto.pubapp=function(name,data,cb){
	this.getapp().pub(name,data,this,cb)
}
proto.pubup=function(name,data,cb){
	if(!this.pvm){
		return;
	}
	var fn=this[core_vm.aprand].pvmevent[name];
	if(!fn)fn=this.pvm.event[this.id+'.'+name];
	if(!fn)fn=this.pvm.event['child'+'.'+name];
	if(!fn)return;
	if(!core_vm.isfn(fn))fn=core_vm.tool.objGetDeep(this.pvm,fn);
	if(!core_vm.isfn(fn))fn=core_vm.tool.objGetDeep(this.pvm.event,fn);
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