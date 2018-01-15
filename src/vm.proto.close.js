var core_vm=require('./vm.0webcore.js');
module.exports.setproto=function(proto){
proto.__addto_onclose=function(cb){
	this[core_vm.aprand].cbs_onclose.push(cb);
}
proto.__vmclose=function(){
	if(!this[core_vm.aprand].has_started){
		return;
	}
	var vm=this;
	this[core_vm.aprand].has_started=0;
	for(var k in this[core_vm.aprand].cbs_onclose){
		this[core_vm.aprand].cbs_onclose[k].call(this);
	}
	var vmpel=vm.pel;vmpel.setAttribute('bindsidofvm',0);vmpel.setAttribute('isvmpel',false);
	var mypvm=this.pvm;
	if(mypvm)core_vm.tryvmfn(mypvm,this,'beforechildclose');
	core_vm.tryvmfn(vm,null,'beforeclose');
	if(vm[core_vm.aprand].vmchildren)	for(var k in vm[core_vm.aprand].vmchildren)	vm[core_vm.aprand].vmchildren[k].__vmclose();
	this.__unbindall();
	if('ppel'!==vm.config.appendto){
		
			var els=vm[core_vm.aprand].els;
			for(var i=els.length-1;i>-1;i--){
				if(els[i].parentNode===vm.pel){
					vm.pel.removeChild(els[i]);
				}else {
					if(els[i].replaced_pel && els[i].replaced_pel.parentNode){
						els[i].replaced_pel.parentNode.removeChild(els[i].replaced_pel)
					}
					if(els[i].parentNode){
						els[i].parentNode.removeChild(els[i]);
					}
				}
			}
	}else{
		var ppel=vm.ppel;
		var pel=vm.pel;
		if(ppel && pel){
			ppel.replaceChild(pel,vm[core_vm.aprand].els[0]);
		}
	}
	core_vm.tryvmfn(vm,null,'onclose');
	if(mypvm)core_vm.tryvmfn(mypvm,this,'onchildclose');
	
	var curStyle=document.getElementById("_privatestyle_"+vm.sid);
	if(curStyle)document.getElementsByTagName("head")[0].removeChild(curStyle);
	vm.__init(true);
	this[core_vm.aprand].has_started=0;
	this[core_vm.aprand].has_defined=0;
}
proto.clean=function(type){
	if(this[core_vm.aprand].has_started!==1)core_vm.gcache.clean_when_vm_close(this);
}
proto.close=proto.__vmclose;
}