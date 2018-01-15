var core_vm=require('./vm.0webcore.js');
var hook=function(name,vm,el,when,node,libid){
	var fn=core_vm.gcache.use.elhook[name] || (core_vm.gcache.jslib[libid]?core_vm.gcache.jslib[libid].exports:null);
	if(core_vm.isfn(fn)){
		try{
			fn.call({},vm,el,when,node);
		}catch(e){
			core_vm.devalert('el-hook.'+name+':'+when,e)
		}
	}
}
module.exports=function(vm,el,src,when,node){
	var name=src;
	if(name.indexOf('this.')==0){
		var fn=core_vm.tool.objGetDeep(vm,name.substr(5));
		if(core_vm.isfn(fn)){
			try{
				fn.call({},vm,el,when,node);
			}catch(e){
				core_vm.devalert('el-hook.'+name+':'+when,e)
			}
		}
		if(when=='childrenCreated'){
			vm.__addto_onshow(function(){
				fn.call({},vm,el,'attached',node);
			})
		}
		return;
	}
	if(core_vm.gcache.use.elhook[name]){
		hook(name,vm,el,when,node);
		if(when=='childrenCreated'){
			vm.__addto_onshow(function(){
				hook(name,vm,el,'attached',node);
			})
		}
		return;
	}
	var opt={
		loadvm:vm,pvmpath:vm.absrc,
		url:core_vm.wap.config.path.elhook[name]||name,
		type:'lib',
		fresh:false,
		from:'loadelhook',elhook_second_times:(when=='childrenCreated'?true:false),
		refid:vm[core_vm.aprand].absrcid
	};
	var fresh=vm._is_fresh_ing ;
	opt.fresh=fresh;
	core_vm.require.load(opt,function(err,mod,spec){
		if(err){
			core_vm.onerror('load_elhook_fail',spec.id,vm.absrc,err);
			return;
		}else if(core_vm.isfn(mod)){
			if(core_vm.wap.config.path.elhook[name]){
				core_vm.gcache.use.elhook[name]=mod;
				delete core_vm.gcache.jslib[spec.id];
				hook(name,vm,el,when,node);
			}else{
				hook(name,vm,el,when,node,spec.id);
			}
			if(when=='childrenCreated'){
				vm.__addto_onshow(function(){
					hook(name,vm,el,'attached',node,spec.id);
				})
			}
		}
	});
}