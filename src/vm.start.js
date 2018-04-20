
var core_vm=require('./vm.0webcore.js');
module.exports.web=function(vm){
	if(!vm.pel.style.display && vm.config.pelDisplayType)vm.pel.style.display=vm.config.pelDisplayType;
	var fragment = document.createDocumentFragment();
	fragment.id=vm.id+'__tmp'
	vm.__top_fragment=fragment;
	core_vm.create.nodes(vm,vm[core_vm.aprand].nodejson[0],vm[core_vm.aprand].rootscope,fragment);
}
module.exports.mob=function(vm){
	vm.pel.bubbleParent=false;
	var now_orient=core.mod.device.getOrient();
	var topview_style={
		layout:vm.pel.layout,
		width:vm.pel.width,
		height:vm.pel.height,
	}
	vm.now_orient=now_orient;
	core.style.api.cal_all_node(vm,now_orient,topview_style,vm[core_vm.aprand].nodejson[0].childNodes);
	var fragment =  Ti.UI.createView({layout:'vertical'});
	vm.__top_fragment=fragment;
	core_vm.create.nodes(vm,vm[core_vm.aprand].nodejson[0],vm[core_vm.aprand].rootscope,fragment);
	var now_orient=core.vmmob.orient.orient_where(vm);
	vm[core_vm.aprand].orient_last=now_orient;
}
