var core_vm=require('./vm.0webcore.js');
module.exports.setproto=function(proto){
proto.loadok_block=function(spec,text){
	if(spec.utag){
		this.importblock[spec.id]={text:text||''};
		this.add_ref('block',spec.id,spec.refsid,'loadok_block');
	}else if(spec.pathtag){
		if(!this.use.block[spec.pathtag])this.use.block[spec.pathtag]=text;
	}
}
proto.get_block_text=function(vm,utag){
	if(this.use.block[utag])return this.use.block[utag];
	var src=this.check_if_import('block',vm[core_vm.aprand].absrcid,utag);
	if(!src)return '';
	var mod=this.importblock[src];
	if(!mod)return '';
	if(mod.refsids.indexOf(vm[core_vm.aprand].absrcid)===-1)mod.refsids.push(vm[core_vm.aprand].absrcid);
	return mod.text ||'';
}
proto.loadok_style=function(spec,text){
	this.importstyle[spec.id]={text:text||''};
	this.add_ref('style',spec.id,spec.refsid,'loadok_style');
}
proto.__get_importstyle=function(vm){
	var text='';
	for(var k in this.importstyle){
		if(this.importstyle[k].refsids.indexOf(vm[core_vm.aprand].absrcid)>-1)
			text+=this.importstyle[k].text;
	}
	return text;
}
}