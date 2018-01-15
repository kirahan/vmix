var core_vm=require('./vm.0webcore.js');
var cal_els_filter=function(vm,str,scope){
	scope=scope||{};
	var calstr=str;
	var mustv;
	var array,res,method;
	if(str.indexOf('>=')>-1){	array=str.split('>=');method='>=';}
	else if(str.indexOf('<=')>-1){	array=str.split('<=');method='<=';}
	else if(str.indexOf('!==')>-1){	array=str.split('!==');method='!==';}
	else if(str.indexOf('===')>-1){	array=str.split('===');method='==';}
	else if(str.indexOf('==')>-1){	array=str.split('==');method='==';}
	else if(str.indexOf('>')>-1){	array=str.split('>');method='>';}
	else if(str.indexOf('<')>-1){	array=str.split('<');method='<';}
	if(array && method){
		calstr=core_vm.tool.trim(array[0]);
		mustv=core_vm.calexp.exp(vm,core_vm.tool.trimquota(core_vm.tool.trim(array[1])),scope,'cal_els_filter');
		res=core_vm.calexp.exp(vm,calstr,scope,'cal_els_filter');
		var result=false;
		if(method=='>='){if(1+Number(res)>=1+Number(mustv))result=true;}
		else if(method=='>'){if(1+Number(res)>1+Number(mustv))result=true;}
		else if(method=='<='){if(1+Number(res)<=1+Number(mustv))result=true;}
		else if(method=='<'){if(1+Number(res)<1+Number(mustv))result=true;}
		else if(method=='=='){if(res+''==mustv+'')result=true;}
		else if(method=='!=='){if(res+''!==mustv+'')result=true;}
		return result;
	}else{
		res=core_vm.calexp.exp(vm,str,scope,'cal_els_filter');
		if(res && res!=='null' && res!=='false'&& res!=='undefined')return true;
		else return false;
	}
}
var parse_if=function(name,vm,scope){
	return cal_els_filter(vm,name,scope);
}
var if_multi=function(vm,html){
	return html.replace(/{%[ ]{0,}if([\s\S]*?){%[ ]{0,}endif[ ]{0,}%}/g, function (item, qparam,param) {
			var ifs=[];
			var strs=[];
			var starts=[];
			var lens=[];
			var result=[];
			item.replace(/{%([\s\S]*?)%}([\s\S]*?)/gm,function(a,b,c,d){
				ifs.push(b);
				starts.push(d);
				lens.push(a.length);
			});
			for(var k=0,len=starts.length-1;k<len;k++){
				strs.push(item.substr(starts[k]+lens[k],starts[k+1]-starts[k]-lens[k]))
			}
			var return_sn=-1;
			for(var i=0,len=ifs.length;i<len;i++){
				ifs[i]=core_vm.tool.trim(ifs[i]);
				var this_result=false;
				if(ifs[i].indexOf('elseif ')==0 || ifs[i].indexOf('else if ')==0){
					this_result=cal_els_filter(vm,core_vm.tool.trim(ifs[i].substr(7)));
				}else if(ifs[i].indexOf('if ')==0){
					this_result=cal_els_filter(vm,core_vm.tool.trim(ifs[i].substr(3)));
				}else if(ifs[i]=='else'){
					this_result=true;
				}
				if(this_result==true){
					return_sn=i;
					break;
				}
			}
			if(return_sn>-1)return strs[return_sn];
			else return '';
	});
}
var single=function(vm,if_result,filter,sn,scope,start_index){
	if(filter){
		if(filter=='else'){
			var find_true=0;
			for(var j=sn-1;j>start_index;j--){
				if(if_result[j]==true){
					find_true=1;
					break;
				}
			}
			if(find_true==0){
				if_result[sn]=true;
			}else{
				if_result[sn]=false;
			}
		}else if(filter.substr(0,7) =='elseif:'){
			var find_true=0;
			for(var j=sn-1;j>start_index;j--){
				if(if_result[j]==true){
					find_true=1;
					break;
				}
			}
			if(find_true==1){
				if_result[sn]=false;
			}else if(if_result[sn-1]===false){
				if_result[sn]=parse_if(filter.substr(7),vm,scope);
			}
		}else if(filter.substr(0,3) =='if:'){
			if_result[sn]=parse_if(filter.substr(3),vm,scope);
		}else{
			if_result[sn]=parse_if(filter,vm,scope);
		}
	}else{
		if_result[sn]=true;
	}
}
module.exports={
	single:single,
	multi:if_multi
}