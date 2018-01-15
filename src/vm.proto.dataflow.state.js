var core_vm=require('./vm.0webcore.js');
module.exports.setproto=function(proto){
var __real_setState=function(vm,p,v,oldv){
	core_vm.tool.objSetDeep(vm.state,p,v);
	var s=vm[core_vm.aprand].watching_state[p];
	if(Array.isArray(s)){
		var len=s.length;
		s.forEach(function(opt,i){
			core_vm.watchcb.watch(opt,p,oldv,v);
		})
	}
}
proto.setState=function(p,v,cb){
	var vm=this;
	var oldv=core_vm.tool.objGetDeep(this.state,p);
	if(p===undefined)return;
	if(oldv===v)return ;
	__real_setState(this,p,v,oldv);
	if(!core_vm.isfn(cb))cb=this.__blankfn;
	this.pubup('state',{path:p,newv:v,oldv:oldv,},cb);
}
proto.__autobind_setstate=function(p,v,oldv){
	this.setState(p,v);
}
}