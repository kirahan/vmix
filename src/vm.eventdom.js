var core_vm=require('./vm.0webcore.js');
var check_event_type=function(vm,e){
	if(!vm || !vm[core_vm.aprand].domeventnames[e.type]){
		return true;
	}
}
module.exports.get_owner=function(e){
	
	var el=e.target,owner;
	while(1){
		if(el.hasAttribute('owner')){owner=el.getAttribute('owner');break;}
		if(el.hasAttribute('bindsidofvm')){break;}
		el=el.parentNode;
		if(!el ||!el.hasAttribute)break;
	}
	return owner;
}
module.exports.stopEvent=function(e){
	
	e.stopPropagation();
}
module.exports.get_funcname=function(e,vm){
	var funcname='',str='on-'+e.type;
	
	var el=e.target;
	if(el.attributes[str+'-self'])			funcname=el.attributes[str+'-self'].value;
	else if(el.attributes[str])				funcname=el.attributes[str].value;
	else{
		while(1){
			if(el.attributes['isvmpel']){
				break;
			}else if(el.attributes[str]){
				funcname=el.attributes[str].value;
				break;
			}else if(el.attributes['href']){
				funcname='href:'+el.attributes['href'].value;
				break;
			}else if(el.hasAttribute('bindsidofvm')){
				break;
			}else{
				el=el.parentNode;
				if(!el || el==document || el==document.body)break;
			}
		}
	}
	return funcname+'';
}
var goto_pelevent=function(e,vm){
	var funcname,pel=vm.pel,pvm=vm.pvm;
	funcname=core_vm.elget(pel,'on-'+e.type);
	module.exports.stopEvent(e);
	if((!funcname ||funcname=='parent') && vm[core_vm.aprand].pvmelevent[e.type])funcname=vm[core_vm.aprand].pvmelevent[e.type];
	if(!funcname){
		 return;
	}
	var fn=core_vm.getprefn(pvm,'domevent',funcname);
	if(!fn){
		return;
	}
	core_vm.tryfn(pvm,fn,[e],'vm.domevent');
}
module.exports.all=function(e,thisvm){
	var funcname=core_vm.eventdom.get_funcname(e,thisvm);
	if(Array.isArray(funcname)){
		var jsel=funcname[1];
		funcname=funcname[0];
	}
	if(funcname=='auto'){
		var elid=thisvm[core_vm.aprand].newid_2_oldid[e.target.id]||e.target.id;
		funcname=elid+'.'+e.type;
	}
	if(!funcname||funcname=='parent'){
		module.exports.stopEvent(e);
		goto_pelevent(e,thisvm);
		return ;
	}
	
	if(funcname.indexOf('href:')===0){
		module.exports.stopEvent(e);return;
	}
	var tvm=thisvm;
	var funcpara;
	if(funcname.substr(0,3)!='js:' && funcname.substr(0,3)!='to:' ){
		var tmp=core_vm.tool.parse_func_para(funcname);
		funcname=tmp[0];
		funcpara=tmp[1];
	}
	var owner=module.exports.get_owner(e);
	if(owner && owner!='self'){
		if(owner=='parent'){
			tvm=thisvm.pvm;
		}else{
			tvm=core_vm.gcache.vmsbysid[owner];
		}
	}
	if(!tvm){
		module.exports.stopEvent(e);return;
	}
	var result;
	funcpara=funcpara||'';
	var fn;
	var fn=core_vm.getprefn(tvm,'domevent',funcname);
	if(!core_vm.isfn(fn))fn=core_vm.gcache.use.domevent[funcname];
	if( core_vm.isfn(fn)){
		var array=[e].concat(funcpara.split(','));
		if(funcname.indexOf('inlinejs_on__')==0)array=[e,core_vm.wap];
		result=core_vm.tryfn(tvm,fn,array,'vm.domevent');
	}else if(funcname.indexOf('inlinejs_on__')==0){
		var jsid=parseInt(funcname.replace('inlinejs_on__',''));
		if(jsid>0){
			var str=thisvm[core_vm.aprand].inline_onjs[jsid];
			var fn;
			try{
				fn=new Function("e,app",str);
				result=fn.call(tvm,e,core_vm.wap);
			}catch(error){
				error.funcname=str;
				core_vm.onerror('inlinejs_fn_error',tvm.absrc,error);
				result=false;
			}
			if(core_vm.isfn(fn))tvm[funcname]=fn;
			else		tvm[funcname]=function(){};
			thisvm[core_vm.aprand].inline_onjs[jsid]='';
		}
	}else if(funcname.substr(0,7)=='todata-' ||funcname.substr(0,8)=='tostate-'){
		var el=e.target;
		var newvalue= e.type=='check'?el.checked:(e.type=='change'&&el.value!='on'?el.value:(el.checked!=undefined?el.checked:el.value));
		if(funcname.substr(0,7)=='todata-'){
			funcname=funcname.substr(7).replace('this.data.','');
			var oldv=core_vm.tool.objGetDeep(tvm.data,funcname);
			if(oldv!==newvalue)tvm.__autobind_setData(funcname,newvalue,oldv);
		}else if(funcname.substr(0,8)=='tostate-'){
			funcname=funcname.substr(8).replace('this.state.','');
			var oldv=core_vm.tool.objGetDeep(tvm.state,funcname);
			if(oldv!==newvalue)tvm.__autobind_setstate(funcname,newvalue,oldv);
		}
		result=false;
	}else{
		core_vm.tryfn(tvm,tvm.onerror,[e,'domevent'],'onerror');
		core_vm.devalert("no function,tvm.id=",tvm.id,'funcname='+funcname );
	}
		module.exports.stopEvent(e);
}
