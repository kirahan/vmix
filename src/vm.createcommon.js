var core_vm=require('./vm.0webcore.js');
module.exports.idclass=function(vm,node,scope){
	if(node.id){
		if(node.id.indexOf('{')>-1)node.id=core_vm.calexp.exp(vm,node.id,scope);
		if(vm.getapp().config.strategy.not_document_getelbyid && node.id.indexOf('_elid_'+vm.sid)==-1){
			var newid=core_vm.cal.forece_calnodeid(vm,node,scope,'doc');
			node.oriid=node.id;
			if(node.id)vm[core_vm.aprand].newid_2_oldid[newid]=node.id
			node.id=newid;
		}
		vm.__regel('id',	 node.oriid||node.id,	  node.id);
	}
	if(node.attr.role){
		node.id=node.id||core_vm.cal.forece_calnodeid(vm,node,scope,'role');
		vm.__regel('role',node.attr.role,node.id,scope.$index);
	}
	node.classList=node.classList||[];
	var str=node.classList.join(' ').replace(/  /g,' ').replace(/^\s*|\s*$/g, '');
	if(str)node.classList=str.split(' ');
	else node.classList=[];
	if(node.classList.length>0 ){
		for(var i=node.classList.length-1;i>-1;i--){if(node.classList[i]==='')node.classList.splice(i,1)}
	}
	if(node.classList.length>0){
		node.id=node.id||core_vm.cal.forece_calnodeid(vm,node,scope,'class');
		vm.__regel('classList',node.classList,node.id,scope.$index);
	}
	if(node.listid){
		node.id=node.id||core_vm.cal.forece_calnodeid(vm,node,scope,'list');
		vm.__regel('listel',node.listid,node.id,scope.$index);
	}
}
function decapitalize(str) {
  str = ""+str;
  return str.charAt(0).toLowerCase() + str.slice(1);
};
module.exports.event=function(vm,node,scope,thisel){
	if(!node.event)return;
	core_vm.tool.each(node.event,function(funcname,event){
		var event_name=decapitalize(event);
		vm[core_vm.aprand].domeventnames[event_name]=1;
		if(funcname.indexOf('js:')==0){
			vm[core_vm.aprand].inline_onjs.push(funcname.substr(3));
			funcname='inlinejs_on__'+(vm[core_vm.aprand].inline_onjs.length-1);
		}else{
			funcname=core_vm.calexp.exp(vm,funcname,scope)
		}
		core_vm.elset(thisel,'on-'+event_name,funcname,scope);
	})
}