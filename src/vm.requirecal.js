var core_vm=require('./vm.0webcore.js');
var _reqlib=require('./vm.requirelib.js');
var _requirecache=require('./vm.requirecache.js');
var _req_caltext=require('./vm.requirecaltext.js');
var _libcal={};
module.exports=_libcal;
_libcal.evalResponse_genmod=function(spec,cb,meta,template,style_str,extend_from,when){
	if(spec.type=='vm' && extend_from){
		core_vm.extend.onload(spec,cb,meta,template,style_str,extend_from,when);
	}else{
		var mod = _requirecache.get(spec.app,spec.vm,spec.id,'',spec.type,'genmod_3',spec.urlsid);
		if (spec.type=='vm'){
			spec.app.__cache.add_vmbody(spec.id,template,2);
			if(style_str){
				spec.app.__cache.add_vmstyle_inline(spec.id,style_str);
			}
		}
		cb(null,mod);
	}
}
_libcal.evalResponse=function(when,spec,responseText,cb,loads) {
	if (!spec.url || !spec.id){
		cb({type:'para',error:'!spec.url'},null);
		return;
	}
	if(spec.loadfilefresh){
		_requirecache.loadfilefresh_clear(spec,spec.id);
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
			core_vm.devalert(spec.app,'json error')
		}
		_requirecache.define(spec,spec.id,obj,spec.type,spec.refsid);
		cb(null,core_vm.tool.objClone(obj));
		return;
	}
	var array = _req_caltext(responseText, spec.id,spec.type,spec);
	var funcpara="require,module,exports,";
	funcpara+='app';
	var func_str=array[0];
	try{
		var newfn=new Function(funcpara,(spec.app.config.isdev==true?"//# sourceURL="+spec.url+"\n":'')+array[0]);
	}catch(err){
		core_vm.devalert(spec.app,'js_SyntaxError:',spec.url+"\n"+err.toString());
		cb(new Error('js_SyntaxError'),null);
		return;
	}
	_requirecache.define(spec,spec.id,newfn,spec.type,spec.refsid);
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
					}else if(deps[k].pathtag){
						depobj.pathtag=deps[k].pathtag;
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
			needs[i].app=spec.app;
			if(needs[i].type=='vm' && spec.app.config.path.vm[needs[i].url]){
				needs[i].url=spec.app.config.path.vm[needs[i].url];
				needs[i].knowpath=true;
			}else	if((needs[i].type=='lib'||needs[i].type=='json') && spec.app.config.path.lib[needs[i].url]){
				needs[i].url=spec.app.config.path.lib[needs[i].url];
				needs[i].knowpath=true;
			}
			if(needs[i].type=='vm'){
			}
		}
		for(var k in needs){
			_reqlib.cal_spec_path(needs[k],spec.url);
			if(needs[k].ifextend)extend_from=needs[k].id;
		}
		for(var i=needs.length-1;i>-1;i--){
			needs[i].from='deps';
			needs[i].refsid=spec.app.__cache.geturlsid(spec.id);
			if(!needs[i].refsid){
				console.error('找不到refsid',needs[i].url)
			}
			if(!spec.fresh && spec.app.__cache.check_ifhas(needs[i].type,needs[i].id,needs[i].refsid)){
				needs.splice(i,1);
			}
		}
		if(needs.length==0){
			_libcal.evalResponse_genmod(spec,cb,array[1],array[2],array[3],extend_from,0);
		}else{
			loads(needs,function(errcount, errs, mods){
				if(!errcount){
					_libcal.evalResponse_genmod(spec,cb,array[1],array[2],array[3],extend_from,1);
				}else{
					core_vm.devalert(spec.app,"needs error",spec.id,spec.url,errs);
					for(var k in errs){
						if(errs[k]){
							core_vm.onerror(spec.app,errs[k].type,needs[k].id,errs[k].error);
						}
					}
					_libcal.evalResponse_genmod(spec,cb,array[1],array[2],array[3],extend_from,2);
				}
			})
		};
	}else{
		_libcal.evalResponse_genmod(spec,cb,array[1],array[2],array[3],array[4],3);
	}
}
