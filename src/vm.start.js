
var core_vm=require('./vm.0webcore.js');
module.exports.web=function(vm){
	if(!vm.pel.style.display && vm.config.pelDisplayType)vm.pel.style.display=vm.config.pelDisplayType;
	var fragment = document.createDocumentFragment();
	fragment.id=vm.id+'__tmp'
	vm.__top_fragment=fragment;
	core_vm.create.nodes(vm,vm[core_vm.aprand].nodejson[0],vm[core_vm.aprand].rootscope,fragment);
}
