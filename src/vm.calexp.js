var core_vm=require('./vm.0webcore.js');
var pscope_attr=function(scope,str){
	var res;
	var tmps=str.split('.');
	var t_scope=scope;
	for(var i=0,len=tmps.length;i<len;i++){
		if(tmps[i]=='pscope'){t_scope=t_scope.pscope; if(!t_scope)break;}
		else if(tmps[i]=='$index' && i==len-1){res=t_scope.$index;break;}
		else if(tmps[i]=='$value'){res=t_scope.listdata[t_scope.$index];}
	}
	return res;
}
var trimquota=function(str){
	return str.replace(/^\s*|\s*$/g, '').replace(/^[\'\"]*|[\'\"]*$/g, '');
}
var trim=function(str){
	return str.replace(/^\s*|\s*$/g, '');
}
var method=function(funcname,para,vm,scope){
	para=para||'';
	if(funcname[0]=='!')funcname=funcname.substr(1);
	var func=core_vm.getprefn(vm,'method',funcname);
	var paras=para.split(',');
	if(!core_vm.isfn(func))func=vm.getcache().use.method[funcname];
	if(core_vm.isfn(func )){
		if(scope.$index!=undefined ){
			for(var i=0,len=paras.length;i<len;i++){
				paras[i]=core_vm.tool.trim(paras[i]);
				if(paras[i]=='$index')paras[i]=scope.$index;
				else if(paras[i]=='$value')paras[i]=scope.listdata[scope.$index];
				else if(paras[i].indexOf('pscope.')>-1)paras[i]=pscope_attr(scope,paras[i]);
			}
		}
		var res;
		try{
			res=func.apply(vm,paras);
		}catch(e){
			core_vm.devalert(vm,'method.'+funcname,e)
		}
		return res===undefined?'':res;
	}else if(funcname.indexOf('.')>-1){
		var str=funcname.substr(0,funcname.lastIndexOf('.'));
		var funcname2=funcname.substr(funcname.lastIndexOf('.')+1);
		var v=val(str,vm,scope);
		if(v!==undefined && core_vm.isfn(v[funcname2])){
			return v[funcname2].apply(vm,paras)+'';
		}else {
			core_vm.onerror(vm.getapp(),"no_method_when_cal",vm.absrc,{funcname:funcname,para:para});
			return '';
		}
	}else{
		return ''
	}
}
var val=function(str,vm,scope,where){
	if(str===undefined || str==='')return str;
	var res='';
	str=core_vm.tool.trim(str);
	var quotastr=str.replace(/^[\'\"]*|[\'\"]*$/g, '');
	if(quotastr.length+2 ==str.length){
		return quotastr;
	}
	if(str[0]=='!')str=str.substr(1);
	var tmp=core_vm.tool.parse_func_para(str);
	if(tmp[1]==undefined){
		if(str.substr(0,5)=='this.'){
			res=core_vm.tool.objGetDeep(vm,str.substr(5));
			if(res==undefined){
				core_vm.onerror(vm.getapp(),"data_path_error1",vm.absrc,{path:str});
				res='';
			}
		}else{
			if(str=='$index')res=scope.$index;
			else if(str=='$value')res=scope.listdata[scope.$index];
			else if(str.indexOf('pscope.')>-1){
				res=pscope_attr(scope,str);
			}else{
				var abpath=core_vm.cal.now_path(scope,str,vm,'calval');
				if(abpath.indexOf('this.')===0)res=core_vm.tool.objGetDeep(vm,abpath.substr(5));
				else res=core_vm.tool.objGetDeep(vm.data,abpath);
				if(res===undefined){
					if(str[str.length-1]=='!'){
						return val(str.substr(0,str.length-1),vm,scope,where)
					}else{
						core_vm.onerror(vm.getapp(),"data_path_error2",vm.absrc,{path:str});
						res='';
					}
				}
			}
		}
	}else{
		res=core_vm.calexp.method(tmp[0],tmp[1],vm,scope);
	}
	return res;
}
var gen_filter=function(exp,vm,scope){
	var array=exp.split('|');
	var res=array[0];
	if(array.length>1 && res){
		for(var i=1;i<array.length;i++){
			array[i]=core_vm.tool.trim(array[i]);
			var func=core_vm.getprefn(vm,'filter',array[i]);
			if(!core_vm.isfn(func))func=vm.getcache().use.filter[array[i]]||core_vm.getprefn(vm,'method',array[i]);
			if(core_vm.isfn(func )){
				try{
					res=func.call(vm,res);
				}catch(e){
					res='';
					core_vm.devalert(vm,'filter :'+array[i],e);
				}
			}
		}
	}
	return res;
}
var exp_one=function(vm,attrexp,scope,k){
	var ops=vm.getcache().use.operator;
	return (attrexp.replace(/{(.*?)}/g,function(item, str){
		var result='';
		if(k=='_exptext_' ){
			if(str[0]=='!')str=str.substr(1);
			if(str[str.length-1]=='!')str=str.substr(0,str.length-1);
		}
		var find=0;
		for(var k in ops){
			if(str.indexOf(k)>-1){
				result=ops[k](str);
				find=1;
				break;
			}
		}
		if(find==1 && result!==undefined && result!==''){
			return result;
		}else{
			if(str.indexOf(' | ')>-1){
				result= gen_filter(str,vm,scope);
			}else{
				str=trim(str);
				result= core_vm.calexp.val(str,vm,scope,'exp6')+'';
			}
			return result+'';
		}
	}));
}
var exp=function(vm,str,scope,k){
	if(str.indexOf('{')===-1)return str;
	if(typeof(str)!=='string')return '';
	str=trim(str);
	str=str.replace('{%','{').replace('%}','}');
	if(str.split('{').length !==str.split('}').length){
		return str;
	}else if(str.indexOf('{')==str.lastIndexOf('{') && str.indexOf('}')==str.lastIndexOf('}') ){
		return exp_one(vm,str,scope,k);
	}else{
		while(str.indexOf('{')>-1 ){
			var pos=str.lastIndexOf('{');
			var pos2=str.indexOf('}',pos);
			if(pos2==-1)break;
			var nstr=str.substring(pos,pos2+1);
			str=str.substr(0,pos)+exp_one(vm,nstr,scope,k)+str.substr(pos2+1);
		}
		if(str.indexOf('{')>-1){
			while(str.indexOf('{')>-1 && str.indexOf('}')){
				var pos=str.indexOf('{');
				var pos2=str.indexOf('}',pos);
				if(pos2==-1)break;
				var nstr=str.substring(pos,pos2+1);
				str=str.substr(0,pos)+exp_one(vm,nstr,scope,k)+str.substr(pos2+1);
			}
		}
		return str
	}
}
var nodeattrexp=function(vm,node,scope){
	if(node.attrexp){
		for(var k in node.attrexp){
			var res=core_vm.calexp.exp(vm,node.attrexp[k],scope);
			node.attr[k]=res;
		}
	}
}
module.exports={
	nodeattrexp:nodeattrexp,
	val:val,
	exp:exp,
	method:method,
}
