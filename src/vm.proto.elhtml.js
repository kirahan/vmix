var core_vm=require('./vm.0webcore.js');
module.exports.setproto=function(proto){
proto.sethtml=function(el,html){
	if(typeof (el)=='string')el=this.getel(el);
	if(!el)return;
	var els=el.childNodes;for(var i=els.length-1;i>-1;i--)el.removeChild(els[i]);
	this.addhtml(el,html);
}
proto.addhtml=function(el,html){
	if(typeof (el)=='string')el=this.getel(el);
	if(!el)return;
	var vm=this;
	var json=core_vm.calhtmltojson(html,vm[core_vm.aprand].node_max_sn+1,0);
	vm[core_vm.aprand].nodejson.push(json[0]);
	core_vm.create.nodes(vm,json[0],vm[core_vm.aprand].rootscope,el);
	this.__bind_as_top_view(json[0],el);
}
}