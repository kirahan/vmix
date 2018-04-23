var core_vm=require('./vm.0webcore.js');
module.exports.watch=function(wopt,path,oldv,newv){
	if(typeof (wopt)!=='object'){
		return;
	}
	var vm=wopt.vm;
	var el;
	if(wopt.el){
		el=wopt.el;
	}else{
			el=document.getElementById(wopt.elid);
			if(!el && vm.getapp().config.strategy.not_document_getelbyid && wopt.elid.indexOf('_elid_')==-1){
				el=vm.getel("#"+wopt.elid);
			}
	}
	if(!el){
		core_vm.devalert(vm,'no el',wopt.elid,path);
		vm.__delel_watchcb_notfind(wopt.elid);
		return;
	}else{
		var result=newv,bindtype=wopt.toelattr;
		if(!wopt.watchfunc){
			wopt.vm.__reset_list_index(wopt);
			if(wopt.node.tag=='_exptext_' || wopt.node.utag=='_exptext_'){
				result=core_vm.calexp.exp(wopt.vm,wopt.node.exp_text,wopt.scope,'_exptext_');
			}else if(wopt.node.attrexp && wopt.node.attrexp[bindtype]){
				result=core_vm.calexp.exp(wopt.vm,wopt.node.attrexp[bindtype],wopt.scope,'_exptext_2');
			}else{
				result=newv;
			}
		}else{
			var event;
			event={el:el,path:path,oldv:oldv,newv:newv};
			var result;
			var funcname=wopt.watchfunc;
			var fn=core_vm.getprefn(vm,'dataevent',funcname);
			if(core_vm.isfn(fn)){
				try{
					if(funcname.indexOf('inlinejs_watch__')==0)result=fn.call(vm,event,wopt.watchpara,vm.getapp());
					else result=fn.call(vm,event,wopt.watchpara);
				}catch(e){
					core_vm.devalert(vm,'dataevent error',e)
				}
			}else if(funcname.indexOf('inlinejs_watch__')==0){
				var jsid=parseInt(funcname.replace('inlinejs_watch__',''));
				if(jsid>0){
					var str=vm[core_vm.aprand].inline_watchjs[jsid];
					try{
						var fn=new Function("e,para,app",str);
						result=fn.call(vm,event,wopt.watchpara,vm.getapp());
						vm[funcname]=fn;
					}catch(error){
						vm[funcname]=function(){};
						core_vm.devalert(vm,'dataevent error',e)
					}
					vm[core_vm.aprand].inline_watchjs[jsid]='';
				}
			}
		}
		if(bindtype && result!==undefined){
			vm.batchdom(function(){
				core_vm.watchcb.setweb(el,bindtype,result,wopt,path);
			});
		}
	}
}
module.exports.setweb=function(el,bindtype,newv,wopt,path){
	if(bindtype=='html')bindtype='innerHTML';
	else if(bindtype=='class')bindtype='className';
	if(core_vm.isfn(core_vm.wap.__cache.use.dataevent[bindtype])){
		core_vm.wap.__cache.use.dataevent[bindtype](el,newv,wopt,path);
	}else	if(bindtype=='innerHTML' || bindtype=='html'){
		el.innerHTML=newv;
	}else if(bindtype=='text'){
		if(el.textContent !=undefined)el.textContent=newv;
		else if(el.text !=undefined)el.text=newv;
		else if(el.innerText !=undefined)el.innerText=newv;
	}else if(bindtype=='value' || bindtype=='className'){
		el[bindtype]=newv;
	}else if( bindtype=='checked' || bindtype=='disabled'  ){
		el[bindtype]= (newv+''==='true') ? true :false;
	}else{
		var array=bindtype.split('-');
		if(array.length==1)array=bindtype.split('.');
		if(array.length==1){
			el[array[0]]=newv;
		}else if(array.length==2 ){
			if(array[0]=='attr')el.setAttribute(array[1],newv);
			else if(array[0]=='data')el.dataset[array[1]]=newv;
			else if(array[0]=='style')el.style[array[1]]=newv;
			else core_vm.tool.objSetDeep(el,array.join('.'),newv,false);
		}
	}
}
