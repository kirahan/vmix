
var core_vm=require('./vm.0webcore.js');
core_vm.onerror=function(type,where,error){
	var cb=core_vm.wap.onerror;
	if(core_vm.isfn(cb)){
		cb.apply(core_vm.wap,arguments);
	}
}
core_vm.onload=function(url,xhr,opt){
	var cb=core_vm.wap.onload;
	if(core_vm.isfn(cb)){
		var res;
		try{
			res=cb.apply(core_vm.wap,arguments);
		}catch(e){
		}
		return res;
	}
}

core_vm.elget=function(el,n){return el?el.getAttribute(n):''}
core_vm.elset=function(el,n,v){return el?el.setAttribute(n,v):false;}
core_vm.getprefn=function(vm,type,name){
	var fn;
	if(vm[type] && typeof vm[type]==='object')fn=vm[type][name];
	if(!core_vm.isfn(fn))fn=vm[name];
	if(!core_vm.isfn(fn))fn=vm[type+'_js_'+name];
	if(!core_vm.isfn(fn))return null;
	else return fn;
}
core_vm.devalert=function(msg,e){
	
	console.error({
		title:'dev alert:'+msg.toString(),
		message:e?e.toString():'',
	})
}
core_vm.tryvmfn=function(vm,cvm,when){
	if(!vm)return;
	if(core_vm.isfn(vm[when])){
		try{
			vm[when].call(vm,cvm);
		}catch(e){
			core_vm.devalert('vm.'+when+':'+vm.id,e)
		}
	}else	if(core_vm.isfn(vm.hook)){
		try{
			vm.hook.call(vm,when,cvm);
		}catch(e){
			core_vm.devalert('vm.hook.'+when+':'+vm.id,e)
		}
	}
}
core_vm.tryfn=function(_this,fn,args,message){
	if(!core_vm.isfn(fn))return;
	if(!Array.isArray(args))args=[args];
	var res;
	
	res=fn.apply(_this,args);
	return res;
}
  const multilineComment = /^[\t\s]*\/\*\*?[^!][\s\S]*?\*\/[\r\n]/gm
  const specialComments = /^[\t\s]*\/\*!\*?[^!][\s\S]*?\*\/[\r\n]/gm
  const singleLineComment = /^[\t\s]*(\/\/)[^\n\r]*[\n\r]/gm
core_vm.delrem=function(str){
	str=str+'';
	return str
	.replace(multilineComment, '')
	.replace(specialComments, '')
	.replace(/\/\*([\S\s]*?)\*\//g, '')
	.replace(/\<\!\-\-[\s\S]*?\-\-\>/g, '')
	.replace(/\s*[\n\r]/g, '\n')
	.replace(singleLineComment, '\n')
	.replace(/\;\s*\/\/.*(?:\r|\n|$)/g, ';\n')
	.replace(/\,\s*\/\/.*(?:\r|\n|$)/g, ',\n')
	.replace(/\{\s*\/\/.*(?:\r|\n|$)/g, '{\n')
	.replace(/\)\s*\/\/.*(?:\r|\n|$)/g, ')\n')
	.replace(/([\n\r]\s*[\n\r]){1,}/g,"\n")
}
core_vm.isfn=function(cb){	return typeof(cb)==='function'}
core_vm.isobj=function(obj){return typeof (obj)==='object'}
core_vm.isstr=function(obj){return typeof (obj)==='string'}
