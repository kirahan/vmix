
var core_vm=require('./vm.0webcore.js');
module.exports.setproto=function(proto){
proto.geturlsid=function(url){
	if(!this.urlid[url])this.urlid[url]=this.urlsid++;
	this.idtourl[this.urlid[url]]=url
	return this.urlid[url];
}
proto.newvmlib=function(id,mod,refid){
	mod.refids=[refid];
	this.vmlib[id] = mod;
	this.check_if_vm_inpath(id);
}
proto.get_vmlib=function(id){
	return this.vmlib[id];
}
proto.add_vmlib_ref=function(libid,refid,where){
	var mod=  this.vmlib[libid];
	if(!mod || !Array.isArray(mod.refids)){
		return;
	}
	if(mod.refids.indexOf(refid)===-1){
		mod.refids.push(refid);
	}else{
	}
}
proto.newvmbody=function(absrc,body){
	this.vmbody[absrc]=body||'';
}
proto.get_body_extend=function(absrc){
	return this.vmbody[absrc]||'';
}
proto.get_body=function(vm){
	return this.vmbody[vm.absrc] ||'';
}
proto.add_vmstyle_inline=function(id,style_str){
	this.vmstyle[id]=core_vm.tool.trim(style_str);
}
proto.get_vmstyle_extend=function(absrc){
	return this.vmstyle[absrc]||'';
}
proto.get_vmstyle=function(vm){
	var text=this.vmstyle[vm.absrc]||'';
	for(var k in this.importstyle){
		if(this.importstyle[k].refids.indexOf(vm[core_vm.aprand].absrcid)>-1)
			text+=this.importstyle[k].text;
	}
	return text;
}
proto.add_importstyle_when_loadcb=function(spec,text){
	this.importstyle[spec.id]={text:text||''};
	this.importstyle[spec.id].refids=[spec.refid];
}
proto.add_vm_src_import=function(urlid,name,src){
	this.importvmsrc[urlid+':'+name]=src;
}
proto.add_block_src_import=function(urlid,name,src){
	this.importblock_src[urlid+':'+name]=src;
}
proto.set_block_text_import=function(absrc,urlid,name,text,refid){
	this.importblock_src[refid+':'+name]=absrc;
	this.importblock_txt[absrc]={text:text||''};
	var mod=this.importblock_txt[absrc];
	mod.refids=mod.refids||[];
	if(mod.refids.indexOf(refid)===-1)mod.refids.push(refid);
}
proto.add_block_inpath=function(blockpathname,text){
	this.use.block[blockpathname]=text;
}
proto.get_importblock=function(vm,utag){
	var src=core_vm.gcache.importblock_src[vm[core_vm.aprand].absrcid+':'+utag];
	if(!src)return '';
	var mod=core_vm.gcache.importblock_txt[src];
	if(!mod)return '';
	if(mod.refids.indexOf(vm[core_vm.aprand].absrcid)===-1)mod.refids.push(vm[core_vm.aprand].absrcid);
	return mod.text ||'';
}
}