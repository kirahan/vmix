var core_vm=require('./vm.0webcore.js');
var vm_tool={}
vm_tool.objGetDeep=function(obj,name){
	if(obj==undefined)return obj;
	if(!(typeof obj =='object') || !(typeof name =='string') ){
		return undefined;
	}
	name=name.replace(/^\s*|\s*$/g, '').replace(/\[([\s\S]*?)\]/g,function(a,b){
		return "."+b+".";
	}).replace(/^\.*|\.*$/g, '').replace(/\'|\"/g, '');
	var r_obj=obj;
	var parts = ~name.indexOf('.') ? name.split('.') : [name];
	for (var i = 0; i < parts.length; i++){
		r_obj = r_obj[parts[i]]
		if(r_obj===undefined){
			break;
		}
	}
	return r_obj;
};
vm_tool.objSetDeep=function(obj,name,value,ifnew){
	if(!obj || !(typeof obj =='object') || !(typeof name =='string') )return false;
	if(name.indexOf('.')==-1){
		if(ifnew || obj[name]!=undefined)obj[name]=  value;
	}else{
		var p =  name.split('.')  ;
		var len=p.length;
		var err=0;
		var n=[];
		n[0]=obj;
		for(var i=1;i<len;i++){
			if(Array.isArray(n[i-1])  ){
				p[i-1]=parseInt(p[i-1]);
			}
			if(ifnew && n[i-1][p[i-1]]==undefined){
				n[i-1][p[i-1]]={}
			}
			n[i]=n[i-1][p[i-1]];
			if(typeof n[i]!='object' || n[i]===null){
				err=1;
				break;
			}
		}
		if(!err){
			n[len-1][p[len-1]]=value;
		}
	}
}
vm_tool.deepmerge=function(target, src) {
	if(typeof target!=='object' ||typeof src!=='object' )return;
	if(!Array.isArray(src) && Array.isArray(target))return;
	if(Array.isArray(src) && !Array.isArray(target))return;
	for(var k in src){
		if(target[k]===undefined){
			if(!core_vm.isobj(src[k])){
				target[k]=src[k];
			}else{
				target[k]=vm_tool.objClone(src[k]);
			}
		}else if(!core_vm.isobj(src[k])){
			target[k]=src[k];
		}else if(Array.isArray(src[k])){
			target[k]=[];
			src[k].forEach(function(e, i) {
				if(typeof e === 'object'){
					target[k][i]={};
					vm_tool.deepmerge(target[k][i], e);
				}else{
					target[k][i]=e;
				}
			});
		}else{
			vm_tool.deepmerge(target[k], src[k]);
		}
	}
}
vm_tool.deepmerge_notreplace=function(target, src) {
	if(typeof target!=='object' ||typeof src!=='object' )return;
	for(var k in src){
		if(target[k]==undefined){
			if(!core_vm.isobj(src[k])){
				target[k]=src[k];
			}else{
				target[k]=vm_tool.objClone(src[k]);
			}
		}else if(core_vm.isobj(target[k]) && core_vm.isobj(src[k])){
			vm_tool.deepmerge_notreplace(target[k], src[k]);
		}
	}
}
vm_tool.trim=function(str){
	return str.replace(/^\s*|\s*$/g, '');
}
vm_tool.trimquota=function(str){
	return str.replace(/^[\'\"]*|[\'\"]*$/g, '');
}
vm_tool.parse_func_para=function(str){
	var res=[str,undefined];
	str.replace(/(.*?)\((.*?)\)(.*?)/g, function (all,a, b){
		 res[0]=vm_tool.trim(a);
		 res[1]=vm_tool.trim(b);
	});
	return res;
}
vm_tool.parse_kv_para=function(str){
	var parames = {};
	var array=str.split(";");
	if(array.length==1)array=str.split(",")
	for(var i=0,len=array.length;i<len;i++){
		array[i].replace( /(.+)=(.+)/g, function(a, b, c){
			parames[b] = c;
		});
	}
	return parames;
}
vm_tool.objClone=function (obj,ifproto){
	if(!obj)return obj;
	if(obj instanceof core_vm.define.vmclass)return obj;
	if(typeof (obj)!=='object'){
		var a=obj;
		return a;
	}
	if(obj.nodeType!==undefined ||obj.nodeName!==undefined )return obj;
	var newobj;
	if(Array.isArray(obj)){
		newobj=new Array(obj.length);
		for(var i=0,len=obj.length;i<len;i++){
			if(typeof obj[i]=='object')newobj[i]=vm_tool.objClone(obj[i],ifproto);
			else newobj[i]=obj[i];
		}
	}else{
		if (obj.constructor == Object){
			newobj = new obj.constructor();
		}else{
			newobj = new obj.constructor(obj.valueOf());
		}
		for(var k in obj){
			if(!obj.hasOwnProperty(k) ||newobj[k] === obj[k] )continue;
			if(!obj[k]){
				newobj[k] = obj[k];
			}else	if(k=='parentNode' &&  obj[k].tag ){
				newobj[k] = obj[k];
			}else	if (typeof(obj[k]) === 'object' ){
				if(obj[k].nodeType!==undefined ||obj[k].nodeName!==undefined )newobj[k]=obj[k];
				else{
					newobj[k] = vm_tool.objClone(obj[k]);
				}
			}else{
				newobj[k] = obj[k];
			}
		}
	}
	if(ifproto){
		newobj.toString = obj.toString;
		newobj.valueOf = obj.valueOf;
	}
	return newobj;
};
vm_tool.multiline =  function (fn){
	if (typeof fn !== 'function'){
		throw new TypeError('Expected a function.');
	}
	var match = /\/\*!?(?:\@preserve)?[ \t]*(?:\r\n|\n)([\s\S]*?)(?:\r\n|\n)\s*\*\//.exec(fn.toString());
	if (!match){
		throw new TypeError('Multiline comment missing.');
		return '';
	}
	match[1]=match[1].replace(/\/\/.*?[\r\n]/g,'');
	return match[1].replace(/\/\/.*?[\r\n]/g,'').replace(/\/\/.*?$/g,'');
};
vm_tool.each = function (obj, fn, context) {
  if (obj != null && obj.length === +obj.length) {
    for (var i = 0; i < obj.length; i++) {
      fn.call(context, obj[i], i, obj);
    }
  } else {
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(context, obj[key], key, obj);
      }
    }
  }
};
var _htmlescapehash= {
	'<': '&lt;',
	'>': '&gt;',
	'&': '&amp;',
	'"': '&quot;',
	"'": '&#x27;',
	'/': '&#x2f;'
};
var _htmlunescapehash= {
	'&lt;':'<',
	'&gt;':'>',
	'&amp;':'&',
	'&quot;':'"',
	'&#x27;':"'",
	'&#x2f;':'/'
};
var _htmlescapereplace= function(k){
	return  _htmlescapehash[k];
};
var _htmlunescapereplace= function(k){
	return  _htmlunescapehash[k];
};
vm_tool.htmlescape=function(str){
	return typeof(str) !== 'string' ? str : str.replace(/[&<>"]/igm,  _htmlescapereplace);
}
vm_tool.htmlunescape=function(str){
	return typeof(str) !== 'string' ? str : str.replace(/(&lt;|&gt;|&amp;|&quot;|&#x27;|&#x2f;)/igm,  _htmlunescapereplace);
}
module.exports=vm_tool;
