var core_vm=require('./vm.0webcore.js');
var _reqlib=require('./vm.requirelib.js');
var _requirecache=require('./vm.requirecache.js');
var _req_caltext=require('./vm.requirecaltext.js');
var _libcal={};
module.exports=_libcal;
_libcal.evalResponse_genmod=function(spec,cb,meta,template,style_str,extend_from){
	if(spec.type=='vm' && extend_from){
		var mod_me=_requirecache(spec.app,spec.id,'',spec.type,'genmod_1',spec.urlid);
		if(mod_me && !mod_me.__has_extend_ed){
			mod_me.__has_extend_ed=1;
			mod_me.__extend_from=extend_from;
			var mod_from=_requirecache(spec.app,extend_from,'','vm','genmod_2',spec.urlid);
			if(mod_from){
				core_vm.gcache.add_vmlib_ref(extend_from,spec.urlid,'vmextend');
				mod_from=core_vm.tool.objClone(mod_from);
				core_vm.tool.deepmerge_notreplace(mod_me,mod_from);
				var newbody,oldbody=core_vm.gcache.get_body_extend(extend_from);
				if(core_vm.isfn(mod_me.extendTemplate)){
					try{
						newbody=mod_me.extendTemplate(oldbody,template);
					}catch(e){
						core_vm.devalert('extendTemplate',e)
					}
				}else{
					newbody=template||oldbody;
				}
				var newstyle='',oldstyle=core_vm.gcache.get_vmstyle_extend(extend_from);
				if(core_vm.isfn(mod_me.extendStyle)){
					try{
						newstyle=mod_me.extendStyle(oldstyle,style_str);
					}catch(e){
						core_vm.devalert('extendStyle',e)
					}
				}else{
					newstyle=style_str||oldstyle;
				}
				core_vm.gcache.newvmbody(spec.id,newbody);
				core_vm.gcache.add_vmstyle_inline(spec.id,newstyle);
			}
		}
		cb(null,mod_me);
	}else{
		var mod = _requirecache(spec.app,spec.id,'',spec.type,'genmod_3',spec.urlid);
		if (spec.type=='vm'){
			core_vm.gcache.newvmbody(spec.id,template);
			if(style_str){
				core_vm.gcache.add_vmstyle_inline(spec.id,style_str);
			}
		}
		cb(null,mod);
	}
}
_libcal.evalResponse=function(spec,responseText,cb,loads) {
	if (!spec.url || !spec.id){
		cb({type:'para',error:'!spec.url'},null);
		return;
	}
		if(spec.loadfilefresh){
			_requirecache.loadfilefresh_clear(spec.id);
		}
	if(spec.type=='css'||spec.type=='block'||spec.type=='text'){
		cb(null,responseText);
		return;
	}
	if(spec.type=='json'){
		var obj={};
		try{
			obj=JSON.parse(responseText)
		}catch(e){
			core_vm.devalert('json error')
		}
		_requirecache.define(spec.id,obj,spec.type,spec.refid);
		cb(null,core_vm.tool.objClone(obj));
		return;
	}
	var array = _req_caltext(responseText, spec.id,spec.type,spec);
	var funcpara="require,module,exports,";
	funcpara+='app';
	var func_str=array[0];
	try{
		var newfn=new Function(funcpara,(core_vm.wap.config.isdev==true?"//# sourceURL="+spec.url+"\n":'')+array[0]);
	}catch(err){
		core_vm.devalert('js_SyntaxError:'+spec.url,err);
		cb(new Error('js_SyntaxError'),null);
		return;
	}
	_requirecache.define(spec.id,newfn,spec.type,spec.refid);
	if (array[4] || array[5].length>0){
		var extend_from=array[4] ;
		var deps=array[5];
		var needs=[];
		for(var k in deps){
			var src=deps[k].src;
			var type=deps[k].type;
			if(type=='css'){
				needs.push({url:src,	type:'css'});
			}else if(type=='vm'){
				needs.push({url:src,	type:'vm'});
			}else if(type=='block'){
				if(deps[k].src){
					var depobj={url:deps[k].src,type:'block'}
					if(deps[k].importname){
						depobj.importname=deps[k].importname;
					}else if(deps[k].blockpathname){
						depobj.blockpathname=deps[k].blockpathname;
					}
					needs.push(depobj);
				}
			}else if(type=='lib'||type=='json'){
				needs.push({id:src,url:src,type:type,importname:deps[k].importname});
			}
		}
		if(extend_from ){
			needs.push({url:extend_from,	type:'vm',ifextend:1});
		}
		for(var i=needs.length-1;i>-1;i--){
			needs[i].fresh=spec.fresh;
			needs[i].pvmpath=spec.id;
			needs[i].loadvm=spec.loadvm;
			if(needs[i].type=='vm' && core_vm.wap.config.path.vm[needs[i].url]){
				needs[i].url=core_vm.wap.config.path.vm[needs[i].url];
				needs[i].knowpath=true;
			}else	if((needs[i].type=='lib'||needs[i].type=='json') && core_vm.wap.config.path.lib[needs[i].url]){
				needs[i].url=core_vm.wap.config.path.lib[needs[i].url];
				needs[i].knowpath=true;
			}
		}
		for(var k in needs){
			_reqlib.cal_spec_path(needs[k],spec.url);
			if(needs[k].ifextend)extend_from=needs[k].id;
		}
		for(var i=needs.length-1;i>-1;i--){
			needs[i].from='deps';
			needs[i].refid=core_vm.gcache.geturlsid(spec.id);
			if(!spec.fresh && core_vm.gcache.check(needs[i].type,needs[i].id,needs[i].refid)){
				needs.splice(i,1);
			}
		}
		if(needs.length==0){
			_libcal.evalResponse_genmod(spec,cb,array[1],array[2],array[3],extend_from);
		}else{
			loads(needs,function(errcount, errs, mods){
				if(!errcount){
					_libcal.evalResponse_genmod(spec,cb,array[1],array[2],array[3],extend_from);
				}else{
					core_vm.devalert("needs error",spec.id,spec.url,errs);
					for(var k in errs){
						if(errs[k]){
							core_vm.onerror(errs[k].type,needs[k].id,errs[k].error);
						}
					}
					_libcal.evalResponse_genmod(spec,cb,array[1],array[2],array[3],extend_from);
				}
			})
		};
	}else{
		_libcal.evalResponse_genmod(spec,cb,array[1],array[2],array[3],array[4]);
	}
}
