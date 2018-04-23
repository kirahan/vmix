var core_vm=require('./vm.0webcore.js');
var _requirecache=require('./vm.requirecache.js');
module.exports.onload=function(spec,cb,meta,template,style_str,extend_from,when){
	var mod_from=_requirecache.get(spec.app,spec.vm,extend_from,'','vm','genmod_2',spec.urlsid)||{};
	var mod_me=  _requirecache.get(spec.app,spec.vm,spec.id,    '','vm','genmod_1',spec.urlsid)||{};
	_requirecache.extendvm(spec.app,spec.id,extend_from);
	spec.app.__cache.add_ref('vm',extend_from,spec.urlsid,'vmextend');
	if(mod_from){
		mod_from=core_vm.tool.objClone(mod_from);
		for(var k in spec.vm){
			delete mod_from[k];
		}
		core_vm.tool.deepmerge_notreplace(mod_me,mod_from);
	}
	var newbody,oldbody=spec.app.__cache.get_body_extend(extend_from);
	var fn=mod_me.extendTemplate || spec.vm.extendTemplate
	if(core_vm.isfn(fn)){
		try{
			newbody=fn.call(spec.vm,oldbody,template);
		}catch(e){
			core_vm.devalert(spec.app,'extendTemplate',e)
		}
	}else{
		newbody=template||oldbody;
	}
	var newstyle='',oldstyle=spec.app.__cache.get_vmstyle_extend(extend_from);
	var fn=mod_me.extendStyle || spec.vm.extendStyle;
	if(core_vm.isfn(fn)){
		try{
			newstyle=fn.call(spec.vm,oldstyle,style_str);
		}catch(e){
			core_vm.devalert(spec.app,'extendStyle',e)
		}
	}else{
		newstyle=style_str||oldstyle;
	}
	spec.app.__cache.add_vmbody(spec.id,newbody,1);
	spec.app.__cache.add_vmstyle_inline(spec.id,newstyle);
	cb(null,mod_me);
};
module.exports.inmem=function(app,vm,id,extend_from){
	var mod_from=_requirecache.get(app,vm,extend_from,'','vm','extendinmem')||{};
	var mod_me=  _requirecache.get(app,vm,id,    '','vm','extendinmem')||{};
	mod_from=core_vm.tool.objClone(mod_from);
	for(var k in vm)delete mod_from[k];
	core_vm.tool.deepmerge_notreplace(mod_me,mod_from);
	return mod_me;
}
