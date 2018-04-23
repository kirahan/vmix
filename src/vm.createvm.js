var core_vm=require('./vm.0webcore.js');
module.exports=function(vm,node,scope){
	var config=vm.getapp().config;
	if(config.precode.indexOf(node.utag)>-1){
		return;
	}
	var newvm;
	core_vm.calexp.nodeattrexp(vm,node,scope);
	if(node.id && node.id[0]=='{')node.id=core_vm.calexp.exp(vm,node.id,scope);
	if(node.classList && node.classList.length>0 ){
		node.classList.forEach(function(str,i){
			if(node.classList[i][0]=='{')node.classList[i]=core_vm.calexp.exp(vm,str,scope);
		})
		node.classList=node.classList.join(' ').replace(/  /g,' ').split(' ');
	}
	if(node.tag=='_exptext_'){
		node.text=core_vm.calexp.exp(vm,node.exp_text,scope,'_exptext_');
	}
	if(node.watchs){
		if(node.id){
			node.id=core_vm.calexp.exp(vm,node.id,scope);
		}else {
			node.id=core_vm.cal.forece_calnodeid(vm,node,scope,'watch');
		}
		core_vm.watchcal.cal(vm,node,scope,'common');
	}
	var utag=node.utag;
	if(utag===config.vmtag || node.attr[config.vmtag+'-src'] || vm.getcache().vmlib[utag]||
		config.path.vm[utag] || 	vm.getcache().check_if_import('vm',vm[core_vm.aprand].absrcid,utag)){
		if(node.id=='parent'||node.id=='child')node.id='';
		if(!node.id)node.id=core_vm.define.newvmid();
		node.childNodes=node.childNodes||[];
		node.attr=node.attr||{};
		if(node.childNodes.length>0)core_vm.inject.biaojiinject_in_calcommon(vm,scope,node.childNodes);
		newvm={
			src:vm.getcache().check_if_import('vm',vm[core_vm.aprand].absrcid,utag)||config.path.vm[utag]
				||node.attr[config.vmtag+'-src']||node.attr.src||utag,
			id:node.attr.id||node.id||core_vm.define.newvmid(),
		};
		if(vm.getcache().vmlib[utag]){
			newvm.src=utag;
			newvm.absrc=utag;
		}
		node.childskip_inject=1;
	}
	return newvm;
}
