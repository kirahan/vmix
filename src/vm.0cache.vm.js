
var core_vm=require('./vm.0webcore.js');
module.exports.setproto=function(proto){
proto.add_vmlib=function(id,mod,refsid){
	mod.refsids=[refsid];
	this.vmlib[id] = mod;
	var path=this.getapp().config.path;
	for(var k in path.vm){
		if(path.vm[k]===id){
			this.keep('vm',id);
		}
	}
}
proto.add_vmbody=function(id,body,when){
	this.vmbody[id]=body+'';
}
proto.add_vmstyle_inline=function(id,style_str){
	this.vmstyle[id]=core_vm.tool.trim(style_str);
}
proto.get_vmlib=function(id){
	return this.vmlib[id];
}
proto.get_body_extend=function(absrc){
	return this.vmbody[absrc]||'';
}
proto.get_body=function(vm){
	return this.vmbody[vm.absrc]+'';
}
proto.get_vmstyle_extend=function(absrc){
	return this.vmstyle[absrc]||'';
}
proto.get_vmstyle=function(vm){
	var text=this.vmstyle[vm.absrc]||'';
	text+=this.__get_importstyle(vm);
	return text;
}
}