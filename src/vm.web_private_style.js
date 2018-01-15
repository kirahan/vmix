var core_vm=require('./vm.0webcore.js');
var g_classid=1;
module.exports.add=function(vm,text){
	var id=vm.sid;
	var css=vm[core_vm.aprand].private_style;
	text=text.replace(/\.\s{0,}([-\w]+){/g,function(a,b,c){
		css[b]=css[b]||'priv_'+(g_classid++);
		return '.'+css[b]+'{';
	});
	text=text.replace(/\.\s{0,}([-\w]+)\s{1,}/g,function(a,b,c){
		css[b]=css[b]||'priv_'+(g_classid++);
		return '.'+css[b]+' ';
	});
	var curStyle=document.getElementById("_privatestyle_"+id);
	if(!curStyle){
		var curStyle = document.createElement('style');
		curStyle.type = 'text/css';
		curStyle.id="_privatestyle_"+id;
		curStyle.appendChild(document.createTextNode(text));
		document.getElementsByTagName("head")[0].appendChild(curStyle);
	}else{
		curStyle.textContent+='\n'+text;
	}
}
module.exports.get=function(vm,name){
	var css=vm[core_vm.aprand].private_style;
	if(!css)return '';
	return css[name] || '';
}
module.exports.check=function(vm,node){
	var css=vm[core_vm.aprand].private_style;
	if(!css)return;
	node.classList.forEach(function(name,i){
		if(css[name]){
			node.classList[i]=css[name];
		}
	})
}