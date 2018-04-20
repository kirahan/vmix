(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "./";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 30);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

var obj={};
if(typeof window!='undefined')obj.platform='web';
else obj.platform='mob';
 //core_vm.aprand需要这个文件
module.exports=obj;


/***/ }),
/* 1 */
/***/ (function(module, exports) {

var _reqlib={};
module.exports=_reqlib;
var _htmlescapehash= {
	'<': '&lt;',
	'>': '&gt;',
	'&': '&amp;',
	'"': '&quot;',
	"'": '&#x27;',
	'/': '&#x2f;'
};
var _htmlescapereplace= function(k){
	return  _htmlescapehash[k];
};
_reqlib.htmlescape=function(str){
	return typeof(str) !== 'string' ? str : str.replace(/[&<>"]/igm,  _htmlescapereplace);
}


// normalize an array of path components
function normalizeArray(v, keepBlanks) {
    var L = v.length,
        dst = new Array(L),
        dsti = 0,
        i = 0,
        part, negatives = 0,
        isRelative = (L && v[0] !== '');
    for (; i < L; ++i) {
        part = v[i];
        if (part === '..') {
            if (dsti > 1) {
                --dsti;
            } else if (isRelative) {
                ++negatives;
            } else {
                dst[0] = '';
            }
        } else if (part !== '.' && (dsti === 0 || keepBlanks || part !== '')) {
            dst[dsti++] = part;
        }
    }
    if (negatives) {
        dst[--negatives] = dst[dsti - 1];
        dsti = negatives + 1;
        while (negatives--) {
            dst[negatives] = '..';
        }
    }
    dst.length = dsti;
    return dst;
}
// normalize an id
_reqlib.normalizeId=function(id, parentId) {
    id = id.replace(/\/+$/g, '');
    return normalizeArray((parentId ? parentId + '/../' + id : id).split('/')).join('/');
}
// normalize a url

_reqlib.normalizeUrl=function(url, baseLocation) {
	//console.log('normalizeUrl',url, baseLocation)
    if (!(/^\w+:/).test(url)) {
        
		var u=baseLocation.fullhost;

		//console.error("---normalizeUrl",url, baseLocation.pathname);
		//url从/开头 就从host根部开始 否则从pathname开始
        var path = baseLocation.pathname;
		if(url.charAt(0)!='/' && url.charAt(0)!='.'){
			//不需要url='/'+url;
		}
        if (url.charAt(0) === '/') {
			//不需要if(url.indexOf(baseLocation.dirpath)!==0)url=baseLocation.dirpath+url;
            url = u + normalizeArray(url.split('/')).join('/');
        } else {
            path += ((path.charAt(path.length - 1) === '/') ? '' : '/../') + url;
            url = u + normalizeArray(path.split('/')).join('/');
        }
    }
    return url;
}
_reqlib.calUrl=function(href, pageurl) {
	//console.error('calurl',href,pageurl)
	//listview.event,mob_bind
	var path = pageurl,url=href;
	if (pageurl.charAt(0) !== '/')pageurl="/"+pageurl;
	if (url.charAt(0) === '/') {
		url =  normalizeArray(url.split('/')).join('/');
	} else {
		path += ((path.charAt(path.length - 1) === '/') ? '' : '/../') + url;
		url =  normalizeArray(path.split('/')).join('/');
	}
    return url;
}
_reqlib.gen_path=function(app,url,from_path,needid,where){

	//console.error("gen_path",where,url ,'from_path='+from_path);
	var location=window.location;
	
	//有from_path是loaddeps时	
	if(from_path){
		if(from_path.indexOf(location.fullhost)==0)from_path=from_path.substr(location.fullhost.length);
	}
	from_path=from_path||location.pathname;

	//console.log("cal_spec_path 2",url );
	if(url.indexOf('://')==-1)url=_reqlib.normalizeId(url, url[0]=='.' ? from_path :'');//
	//console.log("cal_spec_path 3",url );
	
	if(url.indexOf('://')==-1)url = _reqlib.normalizeUrl(url, location);
	if(!needid){
		return url;
	}else{		
		url=url.split("//")[1];		
		if(url)url=url.substr(url.indexOf('/'));
		return url;
	}

}
_reqlib.cal_spec_path=function(spec,from_path){
	if(spec.from=='deps')return;
	//spec.id 只对require有用
	if(spec.url.indexOf('://')==-1)spec.url=_reqlib.gen_path(spec.app,spec.url,from_path || spec.pvmpath,false,6)
	
	//console.log("cal_spec_path 4",spec.url,spec.id ,spec.knowpath);
	if(!spec.knowpath || !spec.id ){
		spec.id=spec.url.split("//")[1];		
		//console.log('计算',spec.url,spec.id)
		if(spec.id)spec.id=spec.id.substr(spec.id.indexOf('/'));
	}
	//实际上只需要id load时加上location.origin就可以了 为了少出故障 先这样了
}
// define a constant (read-only) value property
//var defineConstant;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var core_vm=__webpack_require__(0);
var _reqlib=__webpack_require__(1);


// CommonJS compatible module loading.
// (Except from require.paths, it's compliant with spec 1.1.1.)
//https://github.com/rsms/browser-require/blob/master/require.js


var sub_inrequires={};
var ensurce_sub_inrequire=function(app){

		if(!sub_inrequires[app.id]){
			//console.log('没有subrequire',id, parentId)
			sub_inrequires[app.id]=function (_subid) {
				//都是绝对路径console.log('subrequire', _subid)
				if(app.__cache.get_jslib(_subid)){
				}else if(app.config.path.lib[_subid]) {
					_subid=app.config.path.lib[_subid];
				}
				//console.log('内部_inrequire 计算后的id='+_subid, 'parent=');
				return inrequire(app,null,_subid, '','lib','inreq');
			};
			Object.defineProperty(sub_inrequires,app.id,{configurable: false,enumerable:false,writable:false});
		}
}

var inrequire=function(app,vm,id,parentId,type,where,urlsid) {
	//where:check,有了就不下载
	//type:vm,lib,json
	//console.log("inrequire",id,parentId,'where='+where,'type='+type,'urlsid='+urlsid,vm?'vm.id='+vm.id:'');
	var mod;
	if(type=='lib'||type=='json')mod = app.__cache.get_jslib(id);
	else						 mod = app.__cache.vmlib[id];	
	if(!mod){
		//console.error("没有inrequire id="+id,parentId,'type='+type,where);
		return null;
	}else if(type=='vm' && mod.__extend_from && where=='check'){
		return core_vm.extend.inmem(app,vm,id,mod.__extend_from);
	}
	
	if(mod.mode!=='lib' && typeof (mod.block)=='function') {// (type=='vm' ||mod.exports === undefined)
		//console.error("没有 inrequire缓存",id );
		//var block = mod.block;	
		mod.exports = {};
		//js里面 可以 module.exports=xxx;可以exports.aa=xxx;不能exports=xx;因为改写了exports 与mod.exports没有关系了
		ensurce_sub_inrequire(app);
		try{
			var sub_inrequire = sub_inrequires[app.id];
			//console.error('==========require.app',app.id,gcache.sysnapid)
			
			mod.block.call(vm||{},sub_inrequire, mod, mod.exports,app);
			
		}catch(e){
			console.error("inrequire_execute_error",id,e,'parentId='+parentId,'app.id='+app.id);
			core_vm.onerror(app,"inrequire_execute_error",id,e);
			//如果是开发 策略是 回调错误 则回调错误
			mod.exports = {};//不会再次执行 应该让他可以再次执行 也许有些参数改变了 有些依赖改了
		}
		if(type=='lib'){
			mod.mode='lib';		delete mod.block;
		}else if(mod.mode!==undefined){
		}else{
			if(Object.keys(mod.exports).length==0){
				mod.mode='vmfn';//保留block
			}else{		
				if(mod.exports[core_vm.aprand]){
					mod.exports={};//安全措施
				}
				mod.mode='lib';
				delete mod.block;
			}	
		}
	}
	//判断 是不是 string-number-date等基本对象 不是含有parent等的或者有el的对象
	if(mod.mode=='vmfn')return {};
	if(!mod.exports)return null;
	if(where=='inreq')return core_vm.tool.objClone(mod.exports);
	else return mod.exports;
}
var extendvm=function(app,id,extend_from){
	var mod = app.__cache.vmlib[id];	
	if(mod){
		mod.__extend_from=extend_from;
	}
}

var define =function(spec,id, block,type,refsid) {
	//console.error('req.cache.define',type,id)
	var mod = {};
	if(core_vm.isfn(block)){
		mod.block=block;
	}else{
		mod.exports=block;
		mod.mode='lib';//json
	}
	//console.log('define',id,mod)
	if(type=='vm'){
		spec.app.__cache.add_vmlib(id,mod,refsid);
	}else{ //lib|json	
		spec.app.__cache.add_jslib(id,mod,refsid);
	}
	//mod.id=id;
	return mod;
}
var loadfilefresh_clear = function(spec,id){
	spec.app.__cache.loadfilefresh_clear(id);
}

module.exports={
	define:define,
	get:inrequire,
	extendvm:extendvm,
	loadfilefresh_clear:loadfilefresh_clear
};
//直接define 直接run如何

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {


//module.exports=function(core){
var core_vm=__webpack_require__(0);


core_vm.onerror=function(app,type,where,error){
	var cb=app.onerror;
	if(core_vm.isfn(cb)){
		cb.apply(app,arguments);
	}
}
core_vm.onload=function(app,url,xhr,opt){

	var cb=app.onload;
	if(core_vm.isfn(cb)){
		var res;
		try{
			res=cb.apply(app,arguments);
		}catch(e){
			//console.error('onload',e)
		}
		return res;
	}
	//onload 就是app.js定义的 没有更早的了
}




core_vm.elget=function(el,n){return el?el.getAttribute(n):''}
core_vm.elset=function(el,n,v){return el?el.setAttribute(n,v):false;}



core_vm.getprefn=function(vm,type,name){
	var fn;
	//console.log('getprefn',type,name)
	if(name.substr(0,4)=='app.'){
		name=name.substr(4);
		fn=vm.getapp()[name];
	}else{
		if(vm[type] && typeof vm[type]==='object')fn=vm[type][name];
		if(!core_vm.isfn(fn))fn=vm[name];
		if(!core_vm.isfn(fn))fn=vm[type+'_js_'+name];
	}
	return fn;
}
//todo tryfn对web来说要取消 2017-9-17
core_vm.devalert=function(app_vm,title,e,err){
	var msg=e?(e.message ||e.error ||e.toString()):'';
	if(err)msg+="\n"+(err.message ||err.error ||err.toString());
	
	
	console.error({
		title:'dev alert:'+title.toString(),			
		message:msg,
	})
	
}
core_vm.tryvmfn=function(vm,cvm,when){
	if(!vm)return;
	if(core_vm.isfn(vm[when])){
		try{
			vm[when].call(vm,cvm);
		}catch(e){			
			//console.error('tryvmfn.error:',e,e.toString(),e.stack)
			core_vm.devalert(vm,'vm.'+when+':'+vm.id,e)
		}
	}else	if(core_vm.isfn(vm.hook)){	
		try{
			vm.hook.call(vm,when,cvm);
		}catch(e){	
			core_vm.devalert(vm,'vm.hook.'+when+':'+vm.id,e)
		}
	}
}

core_vm.tryfn=function(_this,fn,args,message){
	//app.beforestart,onstart,onclose
	//vm.hookStart,.beforestart(urlhash),onstart,onchildstart,onchildclose,ondata,beforeclose,beforechildclose
	//domevent即使try 如果有未定义对象 也会弹出runtime 
	if(!core_vm.isfn(fn))return;

	if(!Array.isArray(args))args=[args];
	//测试用 
	return fn.apply(_this,args);
	//console.log('=====tryfn',message)
	var res;
	

	
		res=fn.apply(_this,args);
	
	return res;

}

  const multilineComment = /^[\t\s]*\/\*\*?[^!][\s\S]*?\*\/[\r\n]/gm
  const specialComments = /^[\t\s]*\/\*!\*?[^!][\s\S]*?\*\/[\r\n]/gm
  const singleLineComment = /^[\t\s]*(\/\/)[^\n\r]*[\n\r]/gm

core_vm.delrem=function(str){
	//if(!str)return '';
	//console.log(str)
	str=str+'';
	return str
	.replace(multilineComment, '')//去除多行js注释 
	.replace(specialComments, '')//去除多行js注释 
	.replace(/\/\*([\S\s]*?)\*\//g, '')//去除多行js注释 
	.replace(/\<\!\-\-[\s\S]*?\-\-\>/g, '')//删除 <!-- -->
	//.replace(/\s*[\n\r]/g, '\n') //单行空白 影响pre格式的表现
	.replace(singleLineComment, '\n') //单行
	.replace(/\;\s*\/\/.*(?:\r|\n|$)/g, ';\n') //单行 ,结尾的
	.replace(/\,\s*\/\/.*(?:\r|\n|$)/g, ',\n') //单行 ;结尾的
	.replace(/\{\s*\/\/.*(?:\r|\n|$)/g, '{\n') //单行 {结尾的
	.replace(/\)\s*\/\/.*(?:\r|\n|$)/g, ')\n') //单行 )结尾的
	//.replace(/([\n\r]\s*[\n\r]){1,}/g,"\n") //多个换行 之间多个空白 影响pre格式的表现
	//.replace(/(\s){2,}/g," ");
	//取消 //删除连续空白 空行 不能替代为'' 至少一个空格
	//.replace(/([ \t]){2,}/g,' ')
}

core_vm.isfn=function(cb){	return typeof(cb)==='function'}
core_vm.isobj=function(obj){return typeof (obj)==='object'}
core_vm.isstr=function(obj){return typeof (obj)==='string'}
//el-hook=node:qqw 专门处理hook-node


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

var core_vm=__webpack_require__(0);
var seed_of_appsid=0;
var appclass=function(){
	this.sid=++seed_of_appsid;
	this.config={};
	core_vm.rootvmset.checkappconfig(this,0);
	this.hasstart=0;
	
	this.__events={}
	Object.defineProperty(this,'__events',{enumerable:false});

}

var proto=appclass.prototype;



proto.sub=function(name,vm,cb){
	this.__events[name]=this.__events[name]||[];
	this.__events[name].push([vm,cb,0]);
}
proto.subonce=function(name,vm,cb){
	this.__events[name]=this.__events[name]||[];
	this.__events[name].push([vm,cb,1]);
}
proto.unsub=function(name,vm,cb){
	var evs=this.__events[name];
	if(!evs)return ;
	//console.log('app.event.off',name)
	for(var k=evs.length-1;k>-1;k--){
		if(vm==evs[k][0] && cb==evs[k][1]){
			//console.log('找到app.event.off',name,k)
			evs.splice(k,1);
		}
	}
}
proto.pub=function(name,data,vm,cb){
	if(typeof(cb)!=='function')cb=function(){}
	var evs=this.__events[name];
	if(!evs)return cb({error:'no.listener'})
	core_vm.tool.each(evs,function(ev,sid){	if(ev[2]===-1)delete evs[sid];	})	

	core_vm.tool.each(evs,function(ev){	
		ev[1].call(ev[0],data,vm,function(data){
			cb.call(vm,data,ev[0])
		});
		if(ev[2]==1)ev[2]=-1;
	})
	for(var k=evs.length-1;k>-1;k--){
		if(-1==evs[k][2])evs.splice(k,1);
	}
} 

proto.loadfile=function(type,filename,cb){
	var loadobj={url:filename};
	if(type=='vm')loadobj.type='vm';
	else if(type=='text')loadobj.type='text';
	else loadobj.type='lib';
	
	loadobj.urlsid=2;
	loadobj.refsid=2;
	loadobj.app=this;
	core_vm.require.load(loadobj,function(err,module,spec){
		if (core_vm.isfn(cb)) cb(err,module,spec);
	})
}

proto.setData=function(vm,p,v,cb){
	if(!(vm instanceof core_vm.define.vmclass))return;
	if(!core_vm.isfn(cb))cb=this.blankvm.__blankfn;
	if(vm[core_vm.aprand].datafrom_store.indexOf(p.split('.')[0])==-1)return cb(false);
	
	var oldv=vm.__getData(p);
	if(oldv===v){
		cb(false);
		return;
	}
	this.blankvm.__confirm_set_data_to_el(vm,p,v);cb(true);
	var fn=vm.event['app.setdata'];
	if(core_vm.isfn(fn))fn.call(vm,{path:p,oldv:oldv,newv:v})

}
proto.addData=function(vm,p,index,v,cb){
	if(!(vm instanceof core_vm.define.vmclass))return;
	if(!core_vm.isfn(cb))cb=this.blankvm.__blankfn;
	if(vm[core_vm.aprand].datafrom_store.indexOf(p.split('.')[0])==-1)return cb(false);
	this.blankvm.__confirm_add_data_to_el(vm,p,index,v,function(res){
		cb(res);
	});	
	var fn=vm.event['app.adddata'];

	if(core_vm.isfn(fn))fn.call(vm,{path:p,index:index,value:v})
	
}
proto.delData=function(vm,p,index,count,cb){
	if(!(vm instanceof core_vm.define.vmclass))return;
	if(!core_vm.isfn(cb))cb=this.blankvm.__blankfn;
	if(vm[core_vm.aprand].datafrom_store.indexOf(p.split('.')[0])==-1)return cb(false);
	this.blankvm.__confirm_del_data_to_el(vm,p,index,count||1,function(res){
		cb(res);
	});
	var fn=vm.event['app.deldata'];
	if(core_vm.isfn(fn))fn.call(vm,{path:p,index:index,count:count});
}
proto.use=function(where,name,fn){
	if(!core_vm.isstr(where)  )return;
	if(core_vm.isobj(name)){
		for(var k in name)this.use(where,k,name[k]);
		return;
	}
	if( !core_vm.isstr(name) )return;
	if(where=='vm'){
		if(!core_vm.isobj(fn) || (!fn.template&&!fn.body))return;
		this.__cache.vmbody[name]=fn.template||fn.body;
		this.__cache.vmstyle[name]=fn.style||'';
		this.__cache.add_vmlib(name,{exports:fn.lib||{}});
		this.__cache.keep('vm',name);
		return;
	}else	if(where=='lib'){
		this.__cache.add_jslib(name,{exports:fn});
		this.__cache.keep('lib',name);
		return;
	}
	if(where==='block' && !core_vm.isstr(fn))return;
	if(where!=='block' &&  !core_vm.isfn(fn))return;

	if(where=='vmprototype'){
		core_vm.define.extend(name,fn,this);
	}else if(this.__cache.use[where]){
		//console.log('扩展',where,name);
		this.__cache.use[where][name]=fn;	
	}

}


module.exports=appclass;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var core_vm=__webpack_require__(0);

var cacheclass=function(appid){
	this.appid=appid;
	//console.error('cache.appid='+appid)
	this.urlsid_seed=10;//每个urlsid累加
	this.urlsid={};


	this.vmsbysid={};	//sid->
	this.vmparent={};//cvm.sid->pvm.sid 用来清理从root下面的 用处不大

	this.import_src_vm={};//absrcid:+name =>absrc 仅仅用来确定是vm确定相对src
	this.import_src_block={};//absrcid:+name =>absrc
	this.import_src_lib={};//absrcid:+name =>absrc
	this.importblock={};//absrc=>{text,refsids}
	this.importstyle={};//absrc=>{text,refsids}

	this.vmbody={};// absrc->vm.template
	this.vmstyle={};//absrc->vm.style
	this.vmlib={};//require.define 过来
	this.jslib={};//require.define 过来  里面专门建个import

	
	this.use={
		filter:{},method:{},operator:{},
		domevent:{},dataevent:{},
		block:{}, //use 过来,path.block  下载后过来 不在path的到importblock
		elhook:{},//use 过来,path.elhook 下载后过来 不在path的到jslib
	};
	//path的部分 vm->vmlib,lib->jslib,elhook->use.elhook,block->use.block, check_if_lib_inpath确保清理时不会被清理
	//use.vm到vmbody-vmlib-vmstyle 不经过require 没有清理标志urlsid|vmabsrc
	//vm引入的放在import里面
	//全局block,elhook 放到 app.__extendfn 可以用app.use(扩展
	//全局lib,vm       在这里 可以用 app.use
}
//use,path,路径的都到相同的 vmlib,jslib 清理时 判断是不是use或者path

//import的不复用 需要复用的写在app.use 或者 app.path
var proto=cacheclass.prototype;
proto.destroy=function(){
	for(var k in this)this[k]=null;
}
__webpack_require__(33).setproto(proto);
__webpack_require__(34).setproto(proto);
__webpack_require__(32).setproto(proto);
__webpack_require__(31).setproto(proto);
__webpack_require__(55).setproto(proto);


//强制http更新时如何清理cache 分开qingli
//TODO
proto.getapp=function(){
	
	return core_vm.wap; 
}

proto.geturlsid=function(url){
	if(!this.urlsid[url])this.urlsid[url]=this.urlsid_seed++;
	return this.urlsid[url];
}
proto.add_ref=function(type,url,refsid,where){
	//console.log('标记引用',where,type,url,refsid)

	var mod;
	if(type=='lib'||type=='json')mod=this.jslib;
	if(type=='vm')	mod=this.vmlib;
	if(type=='style')mod=this.importstyle;
	if(type=='block')mod=this.importblock;
	if(!mod){
		return false;
	}
	mod=mod[url];
	if(!mod)return false;
	if(!mod.refsids)mod.refsids=[];
	if(mod.refsids.indexOf(refsid)===-1){
		mod.refsids.push(refsid);
		//console.log('lib vmabsrc 加进一个',libid,mod.refsids)
	}
	return true;

}

proto.check_ifhas=function(type,id,refsid){
  return this.add_ref(type,id,refsid,'check');
}





module.exports=cacheclass;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

var core_vm=__webpack_require__(0);



var calnodejson=function(vm,tempalte_html){//		可以提前 但要等data与template
	vm[core_vm.aprand].node_max_sn=1;
	var html=vm.template || tempalte_html||'';
	

	html=core_vm.calif.multi(vm,html);
	//console.log("html",html);

	var tmp=core_vm.calhtmltojson(html,vm[core_vm.aprand].node_max_sn,0,vm.getapp(),3);
	//改成 parentNode 了 vm[core_vm.aprand].parent_of_nodes=tmp[1];//按sn排列的 方便查找parent 用于watch时查找是否parent已经watch某个属性
	vm[core_vm.aprand].nodejson.push(tmp[0])//.childNodes;//_root_的child
	//console.log(vm[core_vm.aprand].nodejson)
}

var forece_calnodeid=function(vm,node,scope,head){
		vm[core_vm.aprand].seed_of_el_aid++; 
		//if(!scope || scope.$index==undefined)
		return head+'_elid_'+vm.sid+'_'+vm[core_vm.aprand].seed_of_el_aid;
}
var calnodeid=function(vm,node,scope){
	if(!node.id){//这里仅仅是list的第一个id vm.pel的根id watch的不在这里
		vm[core_vm.aprand].seed_of_el_aid++; 
		//if(!scope || scope.$index==undefined)
		node['id']='vm_elid_'+vm.sid+'_'+vm[core_vm.aprand].seed_of_el_aid;
		//else node['id']='vmelid_'+vm.sid+'_aid_'+scope.aid+'_sid_'+scope.$index;
	}
	return node.id;
}
var cal_now_path=function(pscope,str,vm,where){
	//list='book in books'
	//inject.use_inject_nodes_when_create cal_now_path(scope,text,vm)
	//当前path 得出 books.0.name.1.xx 0,1等数组index会根据sid计算出来
	var abpath='';
	var t_scope=pscope;

	//console.log("计算路径,str="+str,'pscope.alias='+ (pscope ? pscope.alias :'没有'),where);
	if(str==t_scope.alias){
		//notdeep
		abpath=t_scope.path;
		if(t_scope.listdata!=undefined && t_scope.$index!==undefined){			
			
			abpath+="."+t_scope.$index;
			//console.log('不同吗',t_scope.$index,t_scope.listdata.$sid.indexOf(t_scope.$sid))
		}
	}else {
		while(1){
			if(str.indexOf(t_scope.alias+'.')==0){	
				//console.log("与这个scope 别名相同",t_scope.alias,t_scope.$sid,t_scope.listdata.$sid);
				abpath=t_scope.path;
				if(t_scope.listdata!==undefined && t_scope.$index!==undefined){
					
					abpath+='.'+t_scope.$index;
				}
				abpath+='.'+str.replace(t_scope.alias+'.','');
				//console.log('abpath='+abpath,t_scope.$index,t_scope.listdata.$sid.indexOf(t_scope.$sid))
				break;//找到一个别名相同的就结束了
			}
			t_scope=t_scope.pscope;
			if(t_scope==null)break;
		}
	}

	//console.log("最终路径->",abpath);
	if(!abpath){
		//console.log("没有找到 别名相同的 parent ,pscope.path="+pscope.path);
		abpath=str;
	}
	if(abpath[0]=='.')abpath=abpath.substr(1);	
	//console.log("最终路径",abpath);

	return abpath;
}
var merge_json_str=function(vm,where,str,skipmerge){	
	//就是直接执行
	//<attr>{a:1,b:2}<attr>
	//var obj=eval('   [ '+node.childNodes[0].text+' ] ');
	//console.log('merge_json_str',str)
	var fn=new Function("e",'return   [ '+str+' ] ');
	var obj;
	try{
		obj=fn.call({},null);	
	}catch(e){}

	if(Array.isArray(obj) && obj[0]){
		if(skipmerge)return obj[0];
		else{
			vm[where]=vm[where]||{};
			if(typeof obj[0]=='object')core_vm.tool.deepmerge(vm[where],obj[0]);
			//else vm[where]=obj[0];
		}
	}
}
exports=module.exports={
	nodejson:calnodejson,
	nodeid:calnodeid,
	forece_calnodeid:forece_calnodeid,
	//nodeid_notdeeplist:nodeid_notdeeplist,
	now_path:cal_now_path,
	//path_to_bubian:path_to_bubian,
	merge_json_str:merge_json_str,//计算inject的jsonstring
	
}






/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

var core_vm=__webpack_require__(0);

var pscope_attr=function(scope,str){
	//{pscope.$index}
	//console.log('pscope_attr',scope,str)
	var res;
	var tmps=str.split('.');
	var t_scope=scope;
	for(var i=0,len=tmps.length;i<len;i++){
		if(tmps[i]=='pscope'){t_scope=t_scope.pscope; if(!t_scope)break;}
		else if(tmps[i]=='$index' && i==len-1){res=t_scope.$index;break;}
		//else if(tmps[i]=='$sid' && i==len-1){res=t_scope.$sid;break;}
		
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
	//console.log('计算函数',funcname,para,vm)
	para=para||'';
	//para=trimquota(para);
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
		//console.log('准备计算',funcname)
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
		//console.log('尝试原声函数',v,'funcname2.'+funcname2)
		if(v!==undefined && core_vm.isfn(v[funcname2])){		
			//console.log('尝试',str,v,funcname2,trimquota(para),v[funcname2](para))
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
	//console.log("计算val",str,where);
	
	if(str===undefined || str==='')return str;
	var res='';
	str=core_vm.tool.trim(str);
	var quotastr=str.replace(/^[\'\"]*|[\'\"]*$/g, '');
	//判断是否两端引号
	if(quotastr.length+2 ==str.length){
		return quotastr;
	}
	if(str[0]=='!')str=str.substr(1);
	var tmp=core_vm.tool.parse_func_para(str);
	//console.log("计算是否是函数还是属性",str,tmp);	
	if(tmp[1]==undefined){
		if(str.substr(0,5)=='this.'){
			//console.log('计算this数据',str.substr(5),vm.state)
			res=core_vm.tool.objGetDeep(vm,str.substr(5));
			if(res==undefined){
				core_vm.onerror(vm.getapp(),"data_path_error1",vm.absrc,{path:str});
				res='';//不返回undefined
			}
		}else{
			if(str=='$index')res=scope.$index;
			//else if(str=='$sid')res=scope.$sid;
			else if(str=='$value')res=scope.listdata[scope.$index];
			else if(str.indexOf('pscope.')>-1){	
				res=pscope_attr(scope,str);
			}else{
				//console.log("准备计算路径",str,scope);
				var abpath=core_vm.cal.now_path(scope,str,vm,'calval');
				//多个scope可以直接调用pscope的alias
				
				if(abpath.indexOf('this.')===0)res=core_vm.tool.objGetDeep(vm,abpath.substr(5));
				else res=core_vm.tool.objGetDeep(vm.data,abpath);
				//console.log("val 最终路径",abpath,res);//,vm.data
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
	//console.log('计算val结果',str,res);
	return res;//+'';
}
var gen_filter=function(exp,vm,scope){
	//格式 {obj.name | filter | filter2}
	var array=exp.split('|');
	var res=array[0];
	if(array.length>1 && res){			
		for(var i=1;i<array.length;i++){
			array[i]=core_vm.tool.trim(array[i]);
			//不要带参数了
			//var tmp=core_vm.tool.parse_func_para(array[i]);
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
//运算符扩充 setel-attr 扩充
var exp_one=function(vm,attrexp,scope,k){
	//if(vm.id=='vm_switch')console.log('exp_one 原',attrexp)
	//这里不需要trim
	var ops=vm.getcache().use.operator;
	return (attrexp.replace(/{(.*?)}/g,function(item, str){
		//if(vm.id=='vm_switch')console.error("exp_one 分离 str="+str,str[0],str.length);
		//str 是去除括号的 如果有运算符 str是已经计算过的
		//str=trim(str);
		var result='';
		if(k=='_exptext_' ){//标签间的{} 可能是{!xx}
			if(str[0]=='!')str=str.substr(1);
			if(str[str.length-1]=='!')str=str.substr(0,str.length-1);				
		}
		//还有+-乘除
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

			if(str.indexOf(' | ')>-1){//过滤
				result= gen_filter(str,vm,scope);	
			}else{
				str=trim(str);
				result= core_vm.calexp.val(str,vm,scope,'exp6')+'';
			}
			return result+'';
		}

		
		//console.log(str,"result="+result);
		//return result;
	}));
}

var exp=function(vm,str,scope,k){
	if(str.indexOf('{')===-1)return str;
	//if(vm.id=='vm_switch')
	//console.error("计算exp",str);
	//{}可以嵌套 
	if(typeof(str)!=='string')return '';
	str=trim(str);
	str=str.replace('{%','{').replace('%}','}');

	if(str.split('{').length !==str.split('}').length){
		//{}括号数目不等
		return str;
	}else if(str.indexOf('{')==str.lastIndexOf('{') && str.indexOf('}')==str.lastIndexOf('}') ){
		//console.log('只有一对括号')
		return exp_one(vm,str,scope,k);
	}else{
		while(str.indexOf('{')>-1 ){
			var pos=str.lastIndexOf('{');
			//最后一个
			var pos2=str.indexOf('}',pos);
			if(pos2==-1)break;
			var nstr=str.substring(pos,pos2+1);
			//console.log('找到内部表达式',nstr,exp_one(vm,nstr,scope,k))
			//不能用replace
			str=str.substr(0,pos)+exp_one(vm,nstr,scope,k)+str.substr(pos2+1);
			//先计算内部的括号
		}
		if(str.indexOf('{')>-1){
			//不交错的 从左边的{开始
			while(str.indexOf('{')>-1 && str.indexOf('}')){	
				var pos=str.indexOf('{');
				var pos2=str.indexOf('}',pos);
				if(pos2==-1)break;
				var nstr=str.substring(pos,pos2+1);
				//console.log('剩余内部表达式nstr='+nstr)				
				str=str.substr(0,pos)+exp_one(vm,nstr,scope,k)+str.substr(pos2+1);
			}		
		}
		//console.log('结果str='+str)

		return str
	}

}
var nodeattrexp=function(vm,node,scope){
	//if(vm.id=='vm_switch')console.log('cal_exp',vm.id,node,node.attrexp);
	//如 class='zz {}'
	if(node.attrexp){
		for(var k in node.attrexp){
			//console.log('计算',k)
			//标签内的表达式 ttt="qq {xx}"都放到 exp了
			var res=core_vm.calexp.exp(vm,node.attrexp[k],scope);
			

			node.attr[k]=res;
		}
	}
}

module.exports={
	nodeattrexp:nodeattrexp,//calcommon node的 attrexp
	val:val,//基本函数 都要调用到这里来 一个{}里面的 可能有|过滤 三元 条件
	exp:exp,//watchcb exp_text,attrexp,list数组 a in b b的计算,id计算,on-click=,classList,_exptext_,watch,inject,block
	method:method,
}






/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {


var core_vm=__webpack_require__(0);


var tapp;//在calhtml引入简单替换
var trim=function(str){
	//去除字符串头尾空格与tab
	//return str.replace(/^[\s\t ]+|[\s\t ]+$/g, '');
	return str.replace(/^\s*|\s*$/g, '');//.replace(/[\r\t\n]/g, " ");	
}
var all_isnot_seen=function (str){
	for( var i=0,len=str.length; i<len; i++){
		if(str.charCodeAt(i)>32)	return false;
	}
	return true;//全部是不可见字符就忽略了
}


function issimple(str){
	return (str.indexOf(':')>-1 || str.indexOf('|')>-1 || str.indexOf('?')>-1 || str.indexOf('(')>-1 || str.indexOf(')')>-1)?false:true;
}

function index_of(str,needle){
	//忽略大小写
	var r = str.match(new RegExp(needle, 'i' )); 
	return r==null?-1:r.index; 
}

function stripquote(val) {
	//去掉首尾的括号
	return val.replace(/^['"`]|['"`]$/g, '');
}
// * 匹配前一项0次或多次,等价于{0, }


var reg_close  =/^<\s*\/\s*([\w-_]+)\s*>/;//格式 < /aa-_bb > 单点冒号要吗 2017-10-1 todo 尽量宽松点 删去最后的 \s* 可以让>后面的空白起效
var reg_start=/^<\s*([\w]{1,})\s*/;//格式 < aa.:bb 单点冒号要吗 2017-10-1 todo
var reg_self_close=/^\s*\/\s*>/;	//格式  空白符/>  删去最后的 \s*

function add_watch(node,name,method){
	//firefox object有watch函数	
	//console.log("add_watch",name);
	node.watchs=node.watchs||[]; 
	name=name.split('-watch-');
	for(var i=0,len=name.length;i<len;i++)node.watchs.push([name[i].replace(/\-/g,'.'),method])
}


var DATA=0,OPTIONS=1,STATE=2;
var gsn=0;
var parse=function (xml,html_gsn,psn) {
  xml = trim(xml);  
  xml = xml.replace(/\<\!--[\s\S]*?--\>/g, '');
  xml="<_root_>"+xml+"</_root_>";
  gsn=html_gsn || 0;
  psn=psn||0;
  var nodescache=[];
  return gendoc();

function gendoc() {
	return {
	  //declaration: declaration(),
	  _root_: gentag(null,psn),//nownode
	  nodescache:nodescache,
	}
}


function gentag(parentNode,psn) {
	//console.log('gentag  ', psn);
	//console.log('--tag--');
	var m = nodematch(reg_start,'start');//格式 < aa.:bb  前面可以有空格 ,'start',pnode.tag找出<div 空格 下面attribute
	//console.log(m);
	if (!m){
		//0位是< 肯定是标签不对 也可能是要关闭 遇到了是<>空标签导致下面都进行不了了
		return;//不能 返回 gentag(parentNode);
	}
	var node = {
		sn:gsn++,
		psn: (psn!=undefined?psn:(parentNode ? parentNode.sn:0)),
		id:'',
		tag:m[1],// (parentNode && parentNode.dir['vm'])? m[1] : m[1],//不能小写.toLowerCase() inject的不小写
		utag:m[1].toLowerCase(),
		attr:{},
		dir:{},
		childNodes:[],
		
		parentNode:parentNode,
	};
	nodescache[node.sn]=node;
	parse_attr(node);
	if(node.attr && node.attr.class){
		node.classList=node.attr.class.split(' ');
		delete node.attr.class;
	}else if(node.attrexp && node.attrexp.class){
		node.classList=node.attrexp.class.split(' ');
		delete node.attrexp.class;//已经添加监控了
		//class可能在attrexp是因为需要监控 计算会专门进行
	}else{
		node.classList=[];  
	}
	
	//console.log('属性结束,node.classList=',node.sn,node.classList)
	if (nodematch(reg_self_close,'selfclose')) { 
		return node;
	}
	//nodematch(/\??>\s*/,'next>',node.tag);//找下一个 > 改为下面的
	var index=xml.indexOf('>');
	xml = xml.slice(index+1);

	var nowtagLower=node.tag.toLowerCase();
	if(nowtagLower=='br' || nowtagLower=='hr')return node;
	

	//一定要提前寻找

	child_or_content(node);

	while(!nodematch(reg_close,'close',node.tag,node)){
		//console.log("错误 关闭tag="+node.tag+",xml=",xml.length);
		if(xml)child_or_content(node);
		else break;
	}
	//console.log('准备关闭 2','tag='+node.tag,'xml='+xml)
	//xml=trim(xml);
	return node;
}
function parse_attr(node){
	var find_attr1=0,find_attr2=0;
	while (!(eos() || is('>') || is('?>') || is('/>')  )) {
		//|| is(' >')
		find_attr1=1;
		find_attr2=1;
		var attr = attribute();
		if(attr){
			//console.log('attr 1 ,' , attr );
			if(node.tag=='data'||(node.tag=='option' && node.parentNode.tag!=='select')){//两种 一种是注入一种是select-option
				//inject的不监控
				node.attr[attr.name] = attr.value;				
			}else if(attr.name=='id') {				
				node.id=attr.value;
			}
			

			else if(attr.name=='el-filter'||attr.name=='el-hook'||attr.name=='el-list'){
				node.dir[attr.name.substr(3)]=attr.value;
			}else	if(attr.name.substr(0,6)=='watch-'){
				attr.name=attr.name.substr(6);
				if(attr.name[0]=='[' && attr.name[attr.name.length-1]==']')attr.name=attr.name.substr(1,attr.name.length-2);
				add_watch(node,attr.name,attr.value);
			}else	if(attr.name.substr(0,3)=='on-'){
				node.event=node.event||{};
				node.event[attr.name.substr(3)]=attr.value;
			}else	if(attr.name.substr(0,6)=='event-'){
				//不取消 原因是尽量在html里面定义
				node.vmevent=node.vmevent||{};
				node.vmevent[attr.name.substr(6)]=attr.value;
			}else{
				var tmp = attr.value.match(/{([\S\s]*?)}/);
				if(tmp==null){
					node.attr[attr.name] = attr.value;
					if(attr.value.toLowerCase()==='true')node.attr[attr.name]=true;
					else if(attr.value.toLowerCase()==='false'){
						node.attr[attr.name]=false;
						//console.error('禁用',attr.name)
					}
				}else{
					//console.log('表达式',attr,tmp[0],tmp[1])
					node.attrexp=node.attrexp||{};
					// : 条件不监控 ()函数不监控  | 可以监控 简单属性可以监控 style="width:{aa}"不监控
					//var tmpp=tmp[1].split('|')[0];
					var last_indexOf_kuohao=attr.value.lastIndexOf('{');
					if(last_indexOf_kuohao==0 && tmp.index==0 && tmp[0]==attr.value  && issimple(tmp[1])){
						//console.log('简单属性,没有:|?()',attr.value)
						//简单属性是只有一个{},没有函数(),没有过滤器|,没有三元?:
						var path=trim(tmp[1]);
						var if_data_to_el=0,if_el_to_data=0;
						if(path[0]=='!'){if_data_to_el=1;path=path.substr(1);}
						if(path[path.length-1]=='!'){if_el_to_data=1;path=path.substr(0,path.length-1);}

						var datatype=DATA;
						if(path.indexOf('this.option.')==0){							
							datatype=OPTIONS;
							if_data_to_el=1;
							if_el_to_data=0;
						}else if(path.indexOf('this.state.')==0){
							datatype=STATE;
						}			
						
						node.attrexp[attr.name]="{"+path+"}";

						if(if_data_to_el){
							add_watch(node,path,'toel-'+attr.name);
						}
						if(if_el_to_data){
							//node.tag=='input'//data是inject-data 这里不要监控 在inject里面监控
							//基本操作就是on-change 其他特殊的自己 设置 on-keyup
							//console.log("绑定到 onchange");
							node.event=node.event||{};
							if(datatype==STATE)node.event['change']="tostate-"+path.replace('this.state.','');
							else if(datatype==DATA)node.event['change']="todata-"+path;
						}						
					}else{
						//console.log('复杂监控 需要专门计算',attr.value,node)
						node.attrexp[attr.name]=attr.value;
						add_multi_watch(node,attr.value,'toel-'+attr.name);
					}
					//console.log(tmp,node.watchs);
				}
			}
			
		}else{
			find_attr1=0;
			attr = attribute2();//独立的 类似 checked disabled	  
			//console.log('没有 attr1','attr 2,', attr );
			if(attr){
				//console.error("发现独立属性",attr);
				if(!all_isnot_seen(attr.name)){
					attr.name=attr.name.replace(/\W/g, '');
					if(attr.name){
						node.attr[attr.name]=true;
					}
				}
			}else{
				find_attr2=0;
			}
		}
		if(find_attr1+find_attr2==0){			
			//log('属性结束1',xml)		
			xml = xml.slice(xml.indexOf('>'));
		}
	}
}
function child_or_content(node){
	var child,tcontent;
	var find_child=0,find_content=0;
	while (1) {
		find_child=1;
		find_content=1;
		child = gentag(node);
		if(child){
			node.childNodes.push(child);
		}else{
			find_child=0;
		}
		//console.log("------------check child,node="+node.tag);
		tcontent = parse_content();
		if(tcontent){
			add_content_node(node,tcontent);
		}else{
			find_content=0;
		}
		if(find_child+find_content==0)break;
	}
}
function new_node(type,pnode){
	var node={tag:type,utag:type,
		
		childNodes:[],dir:{},attr:{},psn:pnode.sn,sn:gsn++,parentNode:pnode};//
	nodescache[node.sn]=node;
	pnode.childNodes.push(node);
	return node;
}

function ifhave_operator (str) {
	if(str.indexOf('|')>-1 ||(str.indexOf('?')>-1 && str.indexOf(':')>-1) 
		||(str.indexOf('(')>-1 && str.indexOf(')')>-1) ||str.indexOf('&&')>-1)return true;
}		
function add_multi_watch(node,str,where) {
	//不能有todata 最后一个冒号无效 被删除
	//<btn text="{!x},{!y}" /> 
	//<btn>{!x},{!y}</btn>
	//有 三元操作?: 或者|| && 过滤| 
	if(where!='toel-text' && ifhave_operator(str)){
		return;
	}

	var needwatch=[];
	str.replace(/([\S\s]*?)\{([\S\s]*?)\}/g,function(a,b,c,d,e,f,g){
		c=trim(c);
		if(!c)return;
		if(c.indexOf('this.option.')==0){
			if(c[0]!='!')c='!'+c;//自动监控option
		}
		if(c[c.length-1]=='!')c=c.substr(0,c.length-1);
		if(c[0]==='!' && needwatch.indexOf(c)===-1){
			needwatch.push(c.substr(1));
		}
	});
	//content 只能data-to-el.text
	//console.log('add_multi_watch',needwatch,where,str)
	for(var i=0,len=needwatch.length;i<len;i++){
		add_watch(node,needwatch[i],where);
	}
	//标签之间的 每个watch 成为一个textnode 
	//console.log(str,node.vmwatch)
	//如果有@node 专门分成一个节点
}
function add_content_node(node,tcontent){
	//console.log("增加内容","|"+tcontent+"|");
	if(all_isnot_seen(tcontent))return;
	//tcontent=trim(tcontent); 
	if(tcontent.indexOf('\\u')>-1)tcontent=tcontent.replace(/\\u[a-fA-F0-9]{4}/g,function(a,b,c){return unescape(a.replace(/\\u/,'%u'))});
	if(tcontent.indexOf('\\U')>-1)tcontent=tcontent.replace(/\\U[a-fA-F0-9]{4}/g,function(a,b,c){return unescape(a.replace(/\\U/,'%u'))});
	// \u3000 代表空格 \u20ac 日元
	

	var tag=node.tag.toLowerCase();
	if(tapp.config.precode.indexOf(tag)>-1){
		//tag=='pre' || tag=='code'
		//console.error('发现code',tag)
		node.attr=node.attr||{};
		node.attr.text=core_vm.tool.htmlunescape(tcontent);
		return;
	}
	var tmp = tcontent.match(/{([\S\s]*?)}/g);
	if(tmp==null){//没有表达式
		if(tag=='text'){// || (!isweb && text_biaoqian[node.tag]) 放到生成里去做 2016/11/4
			node.text=tcontent;
		}else{
			var textnode=new_node('_text_',node);
			textnode.text=tcontent;
		}
		return;
	}else{
		//console.log("发现标签间表达式",tcontent);
		
		

		//分成多个节点的问题是移动 mob.button 里面没法容纳多个label

		
			if(ifhave_operator(tcontent)){
				//复杂的有操作符的 直接监控整体
				var textnode=new_node('_exptext_',node);
				textnode.text='';	
				textnode.exp_text=tcontent;
				add_multi_watch(textnode,tcontent,'toel-text');
				return;		
			}
			tcontent.replace(/([\S\s]*?)\{([\S\s]*?)\}/g,function(a,b,c,d,e,f,g){
				//console.log(tag,'匹配','a='+a,'b='+b,'c='+c,'d='+d,'e='+e,'f='+f,'g='+g);
				if(trim(b)){
					var textnode=new_node('_text_',node);//{之前的
					textnode.text=trim(b);					
				}
				c=trim(c);	
				if(c){					
					if(c[c.length-1]=='!')c=c.substr(0,c.length-1);

					var textnode=new_node('_exptext_',node);
					textnode.text='';
					textnode.exp_text='{'+c+'}';					
								
					if(c.indexOf('this.option.')==0){
						if(c[0]!='!')c='!'+c;//自动监控option
					}
					if(c[0]==='!'){
						add_watch(textnode,c.substr(1),'toel-text');					
					}			
				}
			});
			var index=tcontent.lastIndexOf('}');
			if(index!=tcontent.length-2){
				var shengyu=tcontent.substr(index+2);
				if(trim(shengyu)){
					var textnode=new_node('_text_',node);
					textnode.text=trim(shengyu);					
				}
			}
		

	}
}

function parse_content() {
	var m = nodematch(/^([^<]*)/,'content');//到<停止
	return m?m[1]:'';
}
function attribute2(){
//checked 没有等号
	var m = nodematch(/^\s*([_-\w]+)\s*/ ,'attrstate'); //到>或空白停止 checked可以
	if(m) return { name: m[1], value:  (m[1]) }  
}
function attribute() {
	//width=50% 没有引号时出错
	//log('1attribute %j', xml);
	var m = nodematch(/([_-\w]+)\s*=\s*(\`[^`]*\`|"[^"]*"|'[^']*'|[ ]|[^<>\/\s]*)\s*/ ,'attr');
	// .:#@$_- 顺序关键 
	//属性名去掉#@$ 
	//$是数组方法 $state 取消了$
	//属性名允许的 .:-_   
	//冒号:是listview 里面的 pic:image的数据绑定方法 冒号已经取消
	//value是 '"` 三种引号开头到下一个引号,单引号开头到下一个单引号,或者是到一个空格结束,到一个不跨越 <的 /或者>结束
	//aa='ds' || aa="ss" ||aa=sss   
	//name可以用连字符 a.b a:b a_b font-color='ss' 
	// src="http://ww.sss.ss/ss.img" ok
	// src="http:///ww.sss.ss/ss.img" not ok 3/// noooo
	if(m){
		return { name: trim(m[1]), value: trim(stripquote(m[2])) }
	}
}


function nodematch(re,where,tag,node) {
	//start,selfclose,close,content,attr,attrstate
	//console.log("----"+where+",tag="+tag,xml);
	var m = xml.match(re);
	//console.log('match.'+where,m)
	if(where=='attr'  ){
		if(m && ( m['index']>0   && !all_isnot_seen(m['input'].substr(0,m['index'])))){
			//比如 <div sss ddd='sss'> 先查找是=的attr 这时会发现 前面的sss不是全部为不可见字符
			//console.log('滴滴滴滴滴滴',m)
			return;
			//接下去会去找attr2
		}
	}else	if(where=='close'){
		//	console.log("close="+tag,m);
		if(m){
			xml = xml.substr(m.index+m[0].length);
			if(m[1]==tag   || m[1].toLowerCase()==tag.toLowerCase()){				
				return true;
			}else{
				return tapp.config.strategy.force_close_not_match_close_tag?true: false;
			}
		}else{	
			xml = xml.slice(xml.indexOf('>')+1);//删除 </222> 错误的部分 不删除会循环
			return tapp.config.strategy.force_close_error_close_tag?true: false;
		}
	}

	if (!m)return;
	xml = xml.slice(m.index+m[0].length);
	return m;
	//清除开始的空白 不需要了 主要是 attr2 已经可以匹配 xml = xml.replace(/^\s*/g ,'');
	//console.log(where+',m0='+m[0]+',结果xml=    |'+xml.replace(/[\r\n]/g,'')+"\n"); 

	//slice(start,end)和substring(start,end)
	//他们两个的end都是原字符串的索引,意思为截取到end（不包括end）位置的字符
	//二者的区别是:
	//slice中的start如果为负数,会从尾部算起,-1表示倒数第一个,-2表示倒数第2个,此时end必须为负数,并且是大于start的负数,否则返回空字符串
	//slice的end如果为负数,同样从尾部算起,如果其绝对值超过原字符串长度或者为0,返回空字符串
	//substring会取start和end中较小的值为start,二者相等返回空字符串,任何一个参数为负数被替换为0(即该值会成为start参数)
	//substr的end参数表示,要截取的长度,若该参数为负数或0,都将返回空字符串
}


function eos() {//End-of-source
	return 0 == xml.length;
}

function is(prefix) {//prefix
	return 0 == xml.indexOf(prefix);
}


}

function declaration() {
	var m = nodematch(/^<\?xml\s*/,'declaration');
	if (!m) return;

	// tag
	var node = {
	  attr: {}
	};

	// attr
	while (!(eos() || is('?>'))) {
	  var attr = attribute();
	  if (!attr) return node;
	  node.attr[attr.tag] = attr.value;
	}

	nodematch(/\?>\s*/,'declaration 2');

	return node;
}


function removeDOCTYPE(html) {
	return html
  .replace(/<\?xml.*\?>\n/, '')
  .replace(/<!doctype.*\>\n/, '')
  .replace(/<!DOCTYPE.*\>\n/, '');
}
module.exports=function(html,maxsn,psn,app,where){
	//console.log('原始html',html,app.id);
	tapp=app;
	//var pre_regx=new RegExp('<pre([\\s\\S]*?)>([\\s\\S]*?)<\/pre>', 'gi');
	//var code_regx=new RegExp('<code([\\s\\S]*?)>([\\s\\S]*?)<\/code>', 'gi');
	//.replace(pre_regx,function(a,b,c,d){ 	return '<pre'+b+'>'+core_vm.tool.htmlescape(c)+'</pre>'	}) 
	//.replace(code_regx,function(a,b,c,d){ 	return '<code'+b+'>'+core_vm.tool.htmlescape(c)+'</code>'}) 
	//需要requirecal提前做了工作
	html=html
      .replace(/<\?xml.*\?>\n/, '')
      .replace(/<!doctype.*\>\n/, '')
      .replace(/<!DOCTYPE.*\>\n/, '')
	.replace(new RegExp('<script[^]*>[\\s\\S]*?</script>','gi'),'')
	.replace(new RegExp('<style[^]*>[\\s\\S]*?</style>','gi'),'')
	.replace(/\/\s*>/g, "/>") // />	之间的空格	
	.replace(/\/\>/g, " />") // />前面空出来一个空格作为属性结束符号
	.replace(/\<\>/g, "");

	//var start=new Date().getTime();
	var all=parse(html,maxsn,psn,app);
	//console.log("时间",new Date().getTime()-start);
	//__recursion_one_text_child_to_text_attr(xml._root_);//ti自己处理 web不需要
	//console.log(all._root_.childNodes)

	return [all._root_,all.nodescache];//.childNodes;
}



/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

var core_vm=__webpack_require__(0);

var cal_els_filter=function(vm,str,scope){
	//console.log('\n\ncal_els_filter',str);
	scope=scope||{};//提前计算的 scopr是root
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
		mustv=core_vm.calexp.exp(vm,core_vm.tool.trimquota(core_vm.tool.trim(array[1])),scope,'cal_els_filter');//期望值去除括号
		res=core_vm.calexp.exp(vm,calstr,scope,'cal_els_filter');
		var result=false;
		if(method=='>='){if(1+Number(res)>=1+Number(mustv))result=true;}
		else if(method=='>'){if(1+Number(res)>1+Number(mustv))result=true;}
		else if(method=='<='){if(1+Number(res)<=1+Number(mustv))result=true;}
		else if(method=='<'){if(1+Number(res)<1+Number(mustv))result=true;}
		else if(method=='=='){if(res+''==mustv+'')result=true;}
		else if(method=='!=='){if(res+''!==mustv+'')result=true;}
		//console.log("cal_els_filter",'|'+method+'|','计算res=|'+res+'|','must=|'+mustv+'|,',result,typeof res,typeof mustv);
		
		return result;
	}else{				
		res=core_vm.calexp.exp(vm,str,scope,'cal_els_filter');
		//console.log("cal_els_filter 计算",str,res,res?'对':'错',typeof (res));
		if(res && res!=='null' && res!=='false'&& res!=='undefined')return true;
		else return false;
	}
}

var parse_if=function(name,vm,scope){
	//console.log('paser_if',name,cal_els_filter(vm,name,scope))
	return cal_els_filter(vm,name,scope);
}
var if_multi=function(vm,html){
	
	//console.log('if_multi',html)
	return html.replace(/{%[ ]{0,}if([\s\S]*?){%[ ]{0,}endif[ ]{0,}%}/g, function (item, qparam,param) {
			//console.log("if_multi 发现 item="+ item+", qparam="+ qparam +", param="+ param);
			//return qparam ? _eval_tmpl_func(qparam,vm): "";//函数
			//var returnstr='';
			var ifs=[];
			var strs=[];
			var starts=[];
			var lens=[];
			var result=[];

			item.replace(/{%([\s\S]*?)%}([\s\S]*?)/gm,function(a,b,c,d){
				//console.log('剩余', 'a='+a,'b='+b,'c='+c,'d='+d);
				ifs.push(b);
				starts.push(d);
				lens.push(a.length);
			});
			
			for(var k=0,len=starts.length-1;k<len;k++){
				strs.push(item.substr(starts[k]+lens[k],starts[k+1]-starts[k]-lens[k]))
			}	
				
			//console.log(ifs,starts,lens,strs)
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

				//console.log(i,this_result,ifs[i],'return_sn='+return_sn);//,strs[return_sn]
			}
			if(return_sn>-1)return strs[return_sn];
			else return '';
	});
}

var single=function(vm,if_result,filter,sn,scope,start_index){
	//filter=dir.filter
		
	if(filter){			
		if(filter=='else'){
			//console.log('如果',filter,sn,if_result)
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
		}else if(filter.substr(0,7) =='elseif:'){//可以用elseif-:空格等分割 
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
	}else{// if(filter.substr(0,3) =='if:')
		//根本过不来
		if_result[sn]=true;
	}
}

module.exports={
	single:single,
	multi:if_multi
}

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

var core_vm=__webpack_require__(0);

module.exports.create=function(vm,node,scope,pel,insert_pos){
	//var html='';
	//指令顺序: 表达式,bind,watch
	//console.log('creat_web',node.tag,node.utag,node.attr.text);
	if(node.tag=='_root_' ){
		core_vm.create.nodes(vm,node,scope,pel);
		return ;	
	}
	if(!vm){
		core_vm.delalert.error('create miss vm')
		return;
	}
	
	if(node.utag=='slot'){
		node=core_vm.inject.use_inject_nodes_when_create(vm,node,scope)||node;
	}

	var newvmopt=core_vm.createvm(vm,node,scope);

	//这时没有el 应该是内部使用的 
	if(node.dir.hook && node.dir.hook.indexOf('node:')==0){
		core_vm.elhook(vm,null,node.dir.hook.substr(5),'beforeCreated',node);
	}
	

 	
	if(node.tag=='_text_' ||(node.tag=='_exptext_' && !node.watchs)  ){
		//不需要监控 直接写到html里面 需要监控 创建 text标签 mob里面不是这样处理 而是把id赋给pel 
		//console.log('文本',pel,pel.nodeName,node.text);
		if(pel.nodeName=='#document-fragment' ||pel.id==vm.id+'__tmp'){
			thisel= document.createTextNode(node.text);
			pel.appendChild( thisel);
			return;
		}else{
			pel.innerHTML=pel.innerHTML+node.text;//
			return;
		}
	}
	

	core_vm.createcommon.idclass(vm,node,scope);		
	var thisel;
 	
	if(node.tag=='_exptext_')thisel= document.createElement('span');//document.createTextNode(node.text);
	else thisel=document.createElement(node.tag);
	

	

	if(!thisel){
		return null;	
	}	
	if(node.listid)thisel.listid=node.listid;
	if(node.id ){
		//if(node.id!==thisel.id)console.error('id不同2',node.id,thisel.id)
		thisel.id=node.id;//mob的id必须在生成el前加到node.style
	}


	
	
	
	for(var k in node.attr){
		if(k=='text' || k=='html')continue;	// || k=='class'
		thisel.setAttribute( k,node.attr[k])
	}		
	if(node.classList.length>0){
		//classList 与mob不同
		core_vm.web_private_style.check(vm,node);
		thisel.className=node.classList.join(' ');//直接classList赋值不行
	}
	
	
	if(newvmopt){
		pel.appendChild( thisel);
		
		newvmopt.el=thisel;
		vm.appendChild(newvmopt,node,1);

	}else if(thisel){

		
		core_vm.createcommon.event(vm,node,scope,thisel);	

		if(node.tag=='text'){	 thisel.textContent=node.text;			node.childNodes=[];}
		else if(node.attr.text){ thisel.textContent=node.attr.text;		node.childNodes=[];}
		else if(node.attr.html) {thisel.innerHTML=node.attr.html;		node.childNodes=[];}
		else if(node.text)		{thisel.textContent=node.text;			node.childNodes=[];}	
		
		if(insert_pos==undefined || insert_pos==pel.childNodes.length)pel.appendChild(thisel);
		else pel.insertBefore(thisel,pel.childNodes[insert_pos]);
				

		
			
		if(node.dir.hook)core_vm.elhook(vm,thisel,node.dir.hook,'selfCreated');
		if(node.childNodes && node.childNodes.length>0 && !node.childskip_inject){
			core_vm.create.nodes(vm,node,scope,thisel);

			
		}
		if(node.dir.hook)core_vm.elhook(vm,thisel,node.dir.hook,'childrenCreated');	

		

	}

	return thisel;


}
module.exports.nodes=function(vm,node,scope,pel,insert_pos,iflist){
	//原来传过来的参数是node.childNode,现在改为node,是因为可能要操作其下属

	var nodes=iflist?[node]:(node.childNodes||[]);
	if(!Array.isArray(nodes)) nodes=[nodes];
	if(nodes.length==0)nodes=[];
	var needif=0;
	var if_result=[],start_index=-1;
	core_vm.createblock.find_block(nodes,vm,scope,pel);


	for(var sn=0,len=nodes.length;sn<len;sn++){
		if(nodes[sn].dir && nodes[sn].dir.filter){
			needif=1;
			break;
		}
	}

	//console.log('create.nodes',nodes[0].utag);//,nodes
	for(var sn=0,len=nodes.length;sn<len;sn++){	
		var node=nodes[sn];
		
		if(sn=='if_result'||!node.tag)continue;
		if(node.$injectscope){
//强制转换
			//第一次遇到 转换vm 下级的不需要
			//console.error('注入的',vm.absrc)
			if(node.$injectfromvm_sid){
				var inject_vm=vm.getcache().vmsbysid[node.$injectfromvm_sid]; 
				if(!inject_vm){					
					core_vm.devalert(vm,'no inject_vm')
					continue;
				}else{
					vm=inject_vm;
				}
			}
			//不能使用vm.pvm 因为多层标记 导致pvm一直累积
			scope=node.$injectscope;
		}
		if(needif){
			if(!node.dir || !node.dir.filter){
				if_result[sn]=true;
				start_index=sn;
			}else{
				core_vm.calif.single(vm,if_result,node.dir.filter,sn,scope,start_index);//需要在这里 因为 inject
				if(node.dir.filter=='else')start_index=sn+1;
			}
		}
		if(needif===0 || if_result[sn]===true){
			if(!node.dir.list){
				module.exports.create(vm,node,scope,pel,insert_pos);
			}else{
				core_vm.list.gen(vm,node,scope,pel);
			}
		}
	}
	//delete if_result;
}      


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

var core_vm=__webpack_require__(0);

var check_block_text=function(nodes,name,text){
	//console.log('check_block_text',nodes.length)
	nodes.forEach(function(node){	
		//console.log('check_block_text',node.tag,node.text,name)	
		var find=0;
		if(node.event){
			//console.log('node.event',node.event)
			for(var k in node.event){
				if(node.event[k]==name){
					node.event[k]=text;
					find=1;
				}
			}
		}
		if(find==1)return;
		for(var k in node.attr){
			//console.log('qqqq',k,node.attr[k])
			if(typeof (node.attr[k])=='string' && node.attr[k].indexOf(name)>-1){
				//console.error('找到1',node.tag,node.attr.text,text)
				node.attr[k]=node.attr[k].replace(name,text);
				//break;
			} 
		}
		
		if(node.text && node.text.indexOf(name)>-1){
			//标签之间的
			//console.error('找到2',node.tag,node.text,text)
			node.text=node.text.replace(name,text);
			//break;
		}	
		
		if(node.childNodes && node.childNodes.length>0){
			check_block_text(node.childNodes,name,text);						
		}
	});			
}

module.exports.find_block=function(nodes,vm,scope,pel){
	nodes.forEach(function(node,sn){
		var utag=node.utag;
		if(vm.getcache().use.block[utag] || vm.getcache().check_if_import('block',vm[core_vm.aprand].absrcid,utag)){
			//console.log('发现wrapper',core_vm.tool.objClone(node));
			var oldparent=node.parentNode;
			var oldid=node.id;
			blocktext=vm.getcache().get_block_text(vm,utag);				
			if(!blocktext){
				return;
			}			
			
			//直接字符串替换 
			//var blocktext=blockobj;

			//var obj=core_vm.tool.objClone(blockobj.childNodes);			
			var s=[];
			for(var k in node.attr)if(s.indexOf(k)==-1)s.push(k);
			for(var k in node.attrexp)if(s.indexOf(k)==-1)s.push(k);
			s.forEach(function(name,i){
				var text=node.attr[name];
				if(!text && node.attrexp)text=node.attrexp[name];
				if(i==0 && utag.indexOf('-')==-1){
					if(!text && node.childNodes.length>0)text=node.childNodes[0].text;
				}
				if(text){
					text=core_vm.calexp.exp(vm,text,scope);
					//check_block_text(obj,'$'+name,text);
					blocktext=blocktext.replace(new RegExp('\\$'+name, 'g'),text)
				}
			})
				
			

			//nodes[sn]=obj[0];
			//字符串
			nodes[sn]=core_vm.calhtmltojson(blocktext,0,0,vm.getapp(),5)[0].childNodes[0];
			nodes[sn].parentNode=oldparent;
			if(oldid)nodes[sn].id=oldid;
			if(node.attr.style)nodes[sn].attr.style=node.attr.style;
		}
	})
}

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

var core_vm=__webpack_require__(0);
module.exports.idclass=function(vm,node,scope){
	//console.log('idclass',node.id)
	//watch的早计算过了
	if(node.id){
		if(node.id.indexOf('{')>-1)node.id=core_vm.calexp.exp(vm,node.id,scope);		
		if(vm.getapp().config.strategy.not_document_getelbyid && node.id.indexOf('_elid_'+vm.sid)==-1){
			var newid=core_vm.cal.forece_calnodeid(vm,node,scope,'doc');
			node.oriid=node.id;
			if(node.id)vm[core_vm.aprand].newid_2_oldid[newid]=node.id		
			node.id=newid;
		}
		vm.__regel('id',	 node.oriid||node.id,	  node.id);
	}
	if(node.attr.role){
		node.id=node.id||core_vm.cal.forece_calnodeid(vm,node,scope,'role');	
		vm.__regel('role',node.attr.role,node.id,scope.$index);	
	}
	
	node.classList=node.classList||[];
	var str=node.classList.join(' ').replace(/  /g,' ').replace(/^\s*|\s*$/g, '');
	if(str)node.classList=str.split(' ');
	else node.classList=[];	
	if(node.classList.length>0 ){
		for(var i=node.classList.length-1;i>-1;i--){if(node.classList[i]==='')node.classList.splice(i,1)}	
	}
	if(node.classList.length>0){
		node.id=node.id||core_vm.cal.forece_calnodeid(vm,node,scope,'class');	
		vm.__regel('classList',node.classList,node.id,scope.$index);
	}
	if(node.listid){
		node.id=node.id||core_vm.cal.forece_calnodeid(vm,node,scope,'list');
		vm.__regel('listel',node.listid,node.id,scope.$index);
	}
}

function decapitalize(str) {
  str = ""+str;
  return str.charAt(0).toLowerCase() + str.slice(1);
};
module.exports.event=function(vm,node,scope,thisel){
	if(!node.event)return;
	core_vm.tool.each(node.event,function(funcname,event){		
		var event_name=decapitalize(event);
		//console.log('这里绑定了el',event_name,vm.id,vm.sid,vm[core_vm.aprand].has_started)
		vm[core_vm.aprand].domeventnames[event_name]=1;
		if(funcname.indexOf('js:')==0){
			vm[core_vm.aprand].inline_onjs.push(funcname.substr(3));//不计算 因为可能用到{}
			funcname='inlinejs_on__'+(vm[core_vm.aprand].inline_onjs.length-1);
		}else{
			funcname=core_vm.calexp.exp(vm,funcname,scope)
		}
		core_vm.elset(thisel,'on-'+event_name,funcname,scope);
	})
		
}

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

var core_vm=__webpack_require__(0);
var global_vmid_seed=10;//不要为
var global_nodeid_seed=0;//不要为
var vmclass=function(id){
	this.id=id;
	this.__init();
	//console.log('vmclass new ',this.sid,this.id)
	//id用于查询 absrc用于是绝对路径 url不是绝对路径 用于 favor记录与下属href计算
	//url 是引用时写的
	//src 是格式化后的 mob.topvm.id=src 
}
var vmproto=vmclass.prototype;
var cb=function(){}




var need_keep=['appsid','id','sid','src','absrc','pel','pvm',];
var need_keep_rand=['absrcid','pvmevent','pvmelevent','pvmnode'];
vmproto.__init=function(ifclose){
	
	if(!ifclose){
		this.sid=this.sid||(++global_vmid_seed);
		this.id=this.id||('id_auto_'+String(this.sid));
	}
	if(ifclose){
		this.__auto_unsub_app();
		for(var k in this){
			if(!this.hasOwnProperty(k))continue;
			else if(need_keep.indexOf(k)>-1)continue;
			
			else if(k===core_vm.aprand)continue;
			else {
				this[k]=null;
			}
		}		
		for(var k in this[core_vm.aprand])if(need_keep_rand.indexOf(k)==-1)delete this[core_vm.aprand][k];
		
		
		//mob.views 如pop,dialog清理后才能删除
		
	}
	if(!ifclose){
		this[core_vm.aprand]={};
		
		Object.defineProperty(this,core_vm.aprand, {configurable: false,enumerable: false,writable:false});
	}
	
	let obj=this[core_vm.aprand];
	//只需要来自 inject,append,start的参数  
	if(!ifclose){
		obj.pvmevent={};//event-aa=xx cvm.pubup(aa)
		obj.pvmelevent={};//on-click=ss eventdom发现不了函数时有用
		obj.pvmnode=null;
	}
	obj.pvmslot={};//
	obj.has_started=0;
	obj.has_defined=0;
	obj.append_data={};
	obj.append_option={};
	obj.datafrom_store=[];
	obj.datafrom_parent=[];
	obj.cbs_on_define=[];
	obj.cbs_onstart=[];		
	obj.cbs_onclose=[];
	obj.cbs_onshow=[];
}
vmproto.__clean_tmp_after_start=function(){
	//来自__pvm的都没有clone
	delete this[core_vm.aprand].pvmslot;
	delete this[core_vm.aprand].append_data;
	delete this[core_vm.aprand].append_option;
	delete this[core_vm.aprand].has_started_self;
	delete this[core_vm.aprand].has_defined;
	delete this[core_vm.aprand].cbs_onstart;
	delete this[core_vm.aprand].cbs_onshow;
	delete this[core_vm.aprand].loadingsub_count;
	delete this[core_vm.aprand].startcb_of_vmstart;
	//根据配置 可能过早清理有问题

}
//node解析出一个 vm,就_init, start之前可能会修改其配置 setChildData ,src等 需要有基本属性
//流程是append(parse||pvm)->load(远程|cache|packed)-define->start
//close流程 最后需要新建一个vm 保持其id-src-pel-ppel-pelevnet-pelnode-,不包括pvmslot(来自pelnode)
//不包括appenddata-appendoption(只能来自手动append)

//属性类别:id-src-pel-pvm 调用时制定
//pelcb,peleveent,pelnode,pvmslot node里面指定
//append-data-option 应该与 pel部分是互斥的 类型不同
//start里面应该不包含src 只包含刷新 如果想换src 那就remove 再append
//aprand里面的是运行中需要的 不能清理的 define之前的可以清理
vmproto.__define=function(vmobj){
	//style,template 保存到$cache了
	//console.log('__define',this.id,this.sid)
	var tvm=this;
	if(typeof (vmobj)!=='object' ||vmobj===null)vmobj={};
	if(vmobj.sid)delete vmobj.sid;	
	if(vmobj.id)delete vmobj.id;	
	if(vmobj.src)delete vmobj.src;
	if(vmobj.pel)delete vmobj.pel;	
	if(vmobj.ppel)delete vmobj.ppel;

	for(var k in vmobj){
		if(vmproto[k]===undefined)tvm[k]=vmobj[k];	//else	console.log('you can not override vm.prototype.fn',k)
	}
	tvm.data=tvm.data||{};
	tvm.state=tvm.state||{};
	tvm.option=tvm.option||{};
	tvm.event=tvm.event||{};
	tvm.config=tvm.config||{};	
	if(!Array.isArray(tvm.config.cacheClasses))tvm.config.cacheClasses=[];
	//tvm.config.pelDisplayType=tvm.config.pelDisplayType||"block";
	tvm.config.appendto= (tvm.config.appendto==='ppel')?'ppel':"pel";
	tvm.__auto_sub_app();
	

	
	//basic:     sid,id,src,pel,pvm,absrc,
	//interface: data,event,option,state
	//config:    appendto,cacheClasses,pelDisplayType
	var obj=this[core_vm.aprand];

	//基本的
	obj.newid_2_oldid={}
	obj.vmchildren={};
	obj.rootscope={};
	obj.nodejson=[];	
	
	//element需要的
	obj.seed_of_el_aid=0;
	obj.els_binded=[];//bind的 close时清除
	obj.els=[];
	obj.elsdom={'id':{},'class':{},'role':{},'listel':{}};	
	obj.private_style={};
	
	//start中的
	obj.domeventnames={};	
	obj.domeventnames_binded=[];
	obj.cbs_onstart=[];		
	obj.cbs_onclose=[];
	obj.cbs_onshow=[];
	obj.loadingsub_count=0;
	obj.has_defined=1;
	obj.has_started=0;

	//运行中的
	obj.inline_onjs=[''];	
	obj.inline_watchjs=[''];	
	obj.watching_data={};
	obj.watching_state={};
	obj.watching_option={};
	obj.watching_list={};

	
	//console.error('看看define几次')
	

	this.__ensure_fn();

	return this;

}


__webpack_require__(37).setproto(vmproto);
__webpack_require__(36).setproto(vmproto);


__webpack_require__(49).setproto(vmproto);//store
__webpack_require__(40).setproto(vmproto);
__webpack_require__(41).setproto(vmproto);
__webpack_require__(42).setproto(vmproto);
__webpack_require__(39).setproto(vmproto);
__webpack_require__(43).setproto(vmproto);

__webpack_require__(46).setproto(vmproto);
__webpack_require__(44).setproto(vmproto);
__webpack_require__(45).setproto(vmproto);
__webpack_require__(48).setproto(vmproto);
__webpack_require__(38).setproto(vmproto);
__webpack_require__(47).setproto(vmproto);
//require("./vm.proto.event.js").setproto(vmproto);
//冒号放弃require("./vm.proto.pubsub.js").setproto(vmproto);
//require("./vm.proto.pubupdown.js").setproto(vmproto);

vmproto.__setsrc=function(src){
	if(typeof (src)!=='string')src='';
	this.src=src||'';
	if(this.src){
		this.absrc=_reqlib.gen_path(this.getapp(),this.src,this.pvm.absrc,true,5);
		this[core_vm.aprand].absrcid=this.getcache().geturlsid(this.absrc);
		//if(this.absrc.indexOf('/webapp/')!==0)
			//console.error('绝对地址',this.absrc,'相对地址',this[core_vm.aprand].absrcid)
	}
}
var libbatchdom=__webpack_require__(35);
vmproto.batchdom=function(fn, ctx){
	libbatchdom.set(fn, ctx)
};

vmproto.getapp=function(){
	
	return core_vm.wap; 
}
vmproto.getcache=function(){
	//console.error('getcache',this.appsid,this.id,gcache.napsid[this.appsid])
	
	return core_vm.wap.__cache; 
}




for(var k in vmproto){
	if(k[0]=='_')Object.defineProperty(vmproto,k,{configurable: false,enumerable:false,writable:false});
}

var _reqlib=__webpack_require__(1);
var define=function(opt,uap){
	//opt是外部数据 id,src,pvm,el, | vmobj 是内部数据是vm本身
	

		
	var tvm=new vmclass(opt.id);
	if(opt.el)tvm.pel=opt.el;	
	tvm.getcache().vmsbysid[tvm.sid]=tvm;
	

	
	if(opt.pvm){
		
		tvm.getcache().vmparent[tvm.sid]=opt.pvm.sid;
		tvm.pvm=opt.pvm;
		tvm.pvm[core_vm.aprand].vmchildren= tvm.pvm[core_vm.aprand].vmchildren || {};
		tvm.pvm[core_vm.aprand].vmchildren[tvm.id]=tvm.sid;
	}
	//console.log('define',tvm)
	tvm.__setsrc(opt.src||opt.url);
	return tvm;
}

module.exports={
	vmclass:vmclass,
	define:define,
	newvmid:function(){		
		global_nodeid_seed++;//bindsidofvm使用
		return 'id_auto_'+global_nodeid_seed;//web中不同的vm区分开来
	},
	protect:function(){	
		//console.log('保护vm')
		//core.protect.protect(vmclass);
		//core.protect.protect(vmproto);
		//主要是不能删除 不能改写


	}
}

//module.exports.protect(); //update core后 _又显示出来了


//vmproto.route=function(hash,cb){if(typeof (hash)=='string' && core_vm.isfn(cb))core_vm.route(hash).bind(cb,this);}
//vmproto.navigate=function(hash,title,force){core_vm.route.navigate(hash,title,force);}


module.exports.extend=function(name,fn){
	if(core_vm.isfn(fn))vmproto[name]=fn;//可能会失败 因为configurable=false
}







/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

var core_vm=__webpack_require__(0);
var hook=function(name,vm,el,when,node,libid){
	var fn=vm.getcache().use.elhook[name] || (vm.getcache().jslib[libid]?vm.getcache().jslib[libid].exports:null);
	if(core_vm.isfn(fn)){
		try{
			fn.call({},vm,el,when,node);
		}catch(e){
			core_vm.devalert(vm,'el-hook.'+name+':'+when,e)
		}
	}

}
module.exports=function(vm,el,src,when,node){
	var name=src; //value可以其他途径取得
	//console.log('hook',name)
	//when: selfCreated,childrenCreated,attached

	if(name.indexOf('this.')==0){
		var fn=core_vm.tool.objGetDeep(vm,name.substr(5));
		if(core_vm.isfn(fn)){
			try{
				fn.call({},vm,el,when,node);
			}catch(e){
				core_vm.devalert(vm,'el-hook.'+name+':'+when,e)
			}
		}
		if(when=='childrenCreated'){
			vm.__addto_onshow(function(){
				fn.call({},vm,el,'attached',node);
			})
		}
		return;
	}
	if(vm.getcache().use.elhook[name]){
		hook(name,vm,el,when,node);
		if(when=='childrenCreated'){
			vm.__addto_onshow(function(){
				hook(name,vm,el,'attached',node);
			})
		}
		return;
	}
	//return;
	var opt={
		app:vm.getapp(),
		loadvm:vm,pvmpath:vm.absrc,
		url:vm.getapp().config.path.elhook[name]||name,
		type:'lib',
		fresh:false,
		from:'loadelhook',elhook_second_times:(when=='childrenCreated'?true:false),
		refsid:vm[core_vm.aprand].absrcid
	};
	
	var fresh=vm._is_fresh_ing ;//只有mob.top可以设置
	opt.fresh=fresh;
	//console.log('需要elhook',when,el.childNodes.length)

	core_vm.require.load(opt,function(err,mod,spec){
		if(err){
			core_vm.onerror(vm.getapp(),'load_elhook_fail',spec.id,vm.absrc,err);
			return;
		}else if(core_vm.isfn(mod)){
			//console.log('hook下载',name,spec);
			if(vm.getapp().config.path.elhook[name]){
				vm.getcache().use.elhook[name]=mod;
				delete vm.getcache().jslib[spec.id];
				hook(name,vm,el,when,node);
			}else{
				hook(name,vm,el,when,node,spec.id);
			}
			if(when=='childrenCreated'){
//selfCreated
				vm.__addto_onshow(function(){
					hook(name,vm,el,'attached',node,spec.id);
				})
			}
		}
		//console.log("下载 elhook",mod);
	});
}

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

var core_vm=__webpack_require__(0);

var check_event_type=function(vm,e){
	if(!vm || !vm[core_vm.aprand].domeventnames[e.type]){
		//console.log('page not bind this event,: '+e.type)
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
	

	
	e.stopPropagation();//阻止事件冒泡,但不阻击默认行为	可以避免其他所有DOM元素响应这个事件
	//e.preventDefault(); //不阻击事件冒泡,但阻击默认行为	可以在触发默认操作之前终止事件 例如click <a>后的跳转
	
}

module.exports.get_funcname=function(e,vm){
	//on-click-self表示不capture下级 就是下级 算了 可以在函数里面自己解决
	var funcname='',str='on-'+e.type;

		
	var el=e.target;
	if(el.attributes[str+'-self'])			funcname=el.attributes[str+'-self'].value;
	else if(el.attributes[str])				funcname=el.attributes[str].value;
	//else if(el.attributes[str+':capture'])	funcname=el.attributes[str+':capture'].value;
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
	//return
	//设计是用来找不到函数式由pvm定义在pel上的函数 实际上 vm定义在pel上就可以了
	var funcname,pel=vm.pel,pvm=vm.pvm;
	funcname=core_vm.elget(pel,'on-'+e.type);
	module.exports.stopEvent(e);
	if((!funcname ||funcname=='parent') && vm[core_vm.aprand].pvmelevent[e.type])funcname=vm[core_vm.aprand].pvmelevent[e.type];
	//pel.on-click 传递给 vm[core_vm.aprand].pvmelevent
	//console.error('pelevent 2',funcname,vm.id);//,pvm,pel,vm.id
	if(!funcname){
		//console.log('!funcname')
		 return;
	}
	var fn=core_vm.getprefn(pvm,'domevent',funcname);
	if(!fn){
		//console.log('!fn')
		return;
	}
	core_vm.tryfn(pvm,fn,[e],'vm.domevent.pelevent');
}

module.exports.all=function(e,thisvm){
	//e.type=click
	//if(e.source.sn==undefined)return;//自动生成的如listview的item		
	//module.exports.stopEvent(e);//必须根据情况 处理
	//if(check_event_type(this.vm,e))return;
	//console.log('domevent',this,thisvm.id);
	
	//this=事件的开始者;
	
	var funcname=core_vm.eventdom.get_funcname(e,thisvm);
	
	//console.log("dom 事件",e.type,'this.id='+this.id,funcname);//,'utag='+e.source.utag,e.source.id,
	//list里面的 要得到index 可以从e.source向上 找placeholder 然后找顺序 太麻烦 现在是给函数加参数 xxx({$index})在计算时候得到index

	//console.log("dom 事件",e.type,"funcname="+funcname,'this.id='+thisvm.id,e.target,'vm.id='+thisvm.id,thisvm.url);//thisvm.data,
	//全部不冒泡
	if(funcname=='auto'){
		var elid=thisvm[core_vm.aprand].newid_2_oldid[e.target.id]||e.target.id;
		
		funcname=elid+'.'+e.type;
	}else	if(!funcname||funcname=='parent'){
		//取消 都停止向上冒泡if(true!==thisvm.domevent.bubbleParent)
		module.exports.stopEvent(e);
		
		//很多情况是跨越了el的边界  如touch定义在一个el上 手指移动超出边界时 找不到fn
		//console.log('没有funcname',thisvm.id);
		goto_pelevent(e,thisvm);
		//pel.on-click不会被利用 只有找不到函数式 到pvm执行定义在pel上的相同事件
		return ;//不管return 什么 都会继续冒泡
	}else if(funcname.indexOf('href:')===0){
	
			
			module.exports.stopEvent(e);
			return;//route处理	
			
			
	}
	

	var tvm=thisvm;//事件目标所在的vm
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
			tvm=thisvm.getcache().vmsbysid[owner];//thisvm._getgvm(owner);
		}
	}
	if(!tvm){
		//console.error("找不到目标  vm");
		module.exports.stopEvent(e);return;
	}

	//事件系统:目的是尽量隔离 bubbleParent=false 找不到函数不冒泡 找到执行后返回值为true才冒泡
	//vm.domevent.bubbleParent 默认为false 如果为true 找不到 funcname会向上冒泡
	//funcname为四种 on-click=xxx,xxx(a,b,c),to-dataname,js:xxx
	//在vm内部找触发的funcname 优先级on-click:self,on-click,on-click:capture
	//e.target自身没有,找parent的on-click:capture

	

	//console.log("func_process_real",funcname);
	var result;
	funcpara=funcpara||'';
	var fn;
	//console.log(e.source)
	

	//console.log("准备,funcname=",funcname);
	var fn=core_vm.getprefn(tvm,'domevent',funcname);
	if(!core_vm.isfn(fn))fn=tvm.getcache().use.domevent[funcname];

	if(core_vm.isfn(fn)){//包含js函数funcname.indexOf('js:')==0 &&
		//console.log("已有编译的函数",funcname);
		var array=[e].concat(funcpara.split(','));
		if(funcname.substr(0,4)=='app.'){
			result=core_vm.tryfn(thisvm.getapp(),fn,array,'vm.domevent.app');		
		}else{
			if(funcname.indexOf('inlinejs_on__')==0)array=[e,thisvm.getapp()];
			result=core_vm.tryfn(tvm,fn,array,'vm.domevent.inline');
		}

	}else if(funcname.indexOf('inlinejs_on__')==0){
		var jsid=parseInt(funcname.replace('inlinejs_on__',''));
		if(jsid>0){
			var str=tvm[core_vm.aprand].inline_onjs[jsid];
			tvm[core_vm.aprand].inline_onjs[jsid]='';//提到这里 vm.close后可能找不到位置了
			//console.log('inlinejs',jsid,str,thisvm.id,tvm.id)
			var fn;
			try{
				fn=new Function("e,app",str);
				
				result=fn.call(tvm,e,thisvm.getapp());
			}catch(error){			
				error.funcname=str;
				core_vm.onerror(tvm.getapp(),'inlinejs_fn_error',tvm.absrc,error);
				result=false;
			}
			if(core_vm.isfn(fn))tvm[funcname]=fn;
			else		tvm[funcname]=function(){};
		}
	}else if(funcname.substr(0,7)=='todata-' ||funcname.substr(0,8)=='tostate-'){
		//console.error('change',funcname);//,e
		//on-change="todata-name" on-return,on-check,
		var el=e.target;
				
		var newvalue= e.type=='check'?el.checked:(e.type=='change'&&el.value!='on'?el.value:(el.checked!=undefined?el.checked:el.value));
		//radio的value一直是on
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
		core_vm.tryfn(tvm,tvm.onerror,[e,'domevent'],'onerror.no.fn');
		core_vm.devalert(tvm,"no function,tvm.id=",tvm.id,'funcname='+funcname );//,tvm,e.target
		//module.exports.stopEvent(e);
	}
	//总是停止 
		module.exports.stopEvent(e);
	//如果不停止 引发pvm.pel的事件 但是 e.souce还是一个 找到的funcname也是一样,thisvm不同 会找到错误的函数
	//console.log('结果',result,funcname,tvm.id,fn)
	//if(!result)

	

}





/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

var core_vm=__webpack_require__(0);
var _requirecache=__webpack_require__(2);

module.exports.onload=function(spec,cb,meta,template,style_str,extend_from,when){
	//extend_from 有错误也无所谓
	//console.log('准备扩展')
	var mod_from=_requirecache.get(spec.app,spec.vm,extend_from,'','vm','genmod_2',spec.urlsid)||{};
	var mod_me=  _requirecache.get(spec.app,spec.vm,spec.id,    '','vm','genmod_1',spec.urlsid)||{}; 
	_requirecache.extendvm(spec.app,spec.id,extend_from);
	//console.log('扩展onload',extend_from,'template='+template.length);
	//此处复杂 
	spec.app.__cache.add_ref('vm',extend_from,spec.urlsid,'vmextend');
	if(mod_from){
		mod_from=core_vm.tool.objClone(mod_from);
		for(var k in spec.vm){
			delete mod_from[k];//避免原型的设定覆盖 this.data等直接写的 并且要求原型一定要export
		}
		core_vm.tool.deepmerge_notreplace(mod_me,mod_from);//target,src 顺序不能变 原则是 新的如果有 就不改变
	}
	
	var newbody,oldbody=spec.app.__cache.get_body_extend(extend_from);
	var fn=mod_me.extendTemplate || spec.vm.extendTemplate
	if(core_vm.isfn(fn)){
		try{
			newbody=fn.call(spec.vm,oldbody,template);
		}catch(e){
			core_vm.devalert(spec.app,'extendTemplate',e)
		}
	}else{
		newbody=template||oldbody;
	}				
	var newstyle='',oldstyle=spec.app.__cache.get_vmstyle_extend(extend_from);
	var fn=mod_me.extendStyle || spec.vm.extendStyle;
	if(core_vm.isfn(fn)){
		try{
			newstyle=fn.call(spec.vm,oldstyle,style_str);
		}catch(e){
			core_vm.devalert(spec.app,'extendStyle',e)
		}
	}else{
		newstyle=style_str||oldstyle;
	}
	spec.app.__cache.add_vmbody(spec.id,newbody,1);
	spec.app.__cache.add_vmstyle_inline(spec.id,newstyle);

	//console.log('扩展onload 完成')
	
	//todo meta没有保存 二次扩展时找不到 meta只有一个用途 title 2018-04-08
	cb(null,mod_me);	
};
module.exports.inmem=function(app,vm,id,extend_from){
	//console.log('扩展 inmem')
	var mod_from=_requirecache.get(app,vm,extend_from,'','vm','extendinmem')||{};
	var mod_me=  _requirecache.get(app,vm,id,    '','vm','extendinmem')||{}; 
	mod_from=core_vm.tool.objClone(mod_from);
	for(var k in vm)delete mod_from[k];//保护
	core_vm.tool.deepmerge_notreplace(mod_me,mod_from);//target,src 顺序不能变 原则是 新的如果有 就不改变
	return mod_me;	
}


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

var core_vm=__webpack_require__(0);



module.exports.biaojiinject_in_calcommon=function(vm,scope,nodes){
	//console.log("inject 标记",vm.id,vm.id,scope.aid);
	nodes.forEach(function(node,sn){
		//这一层不能标记 多次证明了2017-9-19
		core_vm.inject.biaojiinject_level_1(vm,scope,node.childNodes);
	});
}
module.exports.biaojiinject_level_1=function(vm,scope,nodes){
	nodes.forEach(function(node,sn){
		node.$injectscope=scope;
		node.$injectfromvm_sid=vm.sid;//node绝对不能直接关联vm 否则clone时max-size mem
		node.attr=node.attr ||{};
		node.attr.owner='parent';//多层传递 parent 是不是可以
		//只需要标记第一级
	});
}
module.exports.inject_one_string=function(pvm,vm,utag,text,where){
	var type=typeof (vm[where][utag]);
	var caninject=true;
	//console.log("inject_one_string",utag,type,text);
	
	if(type=='undefined')vm[where][utag]=text;
	else if(type=='boolean')vm[where][utag]=Boolean(text);
	else if(type=='number')vm[where][utag]=Number(text);
	else if(type=='float')vm[where][utag]=parseFloat(text);
	else if(type=='string')vm[where][utag]=String(text);
	else if(type=='object'){
		if(typeof (text)=='string'){
			var fn=new Function("e",'return   [ '+text+' ] ');
			var obj;
			try{
				obj=fn.call({},null);	
			}catch(e){}

			if(obj)text=obj[0];
		}
		if(typeof (text)=='object'){
			if(Array.isArray(vm[where][utag]) && Array.isArray(text) )vm[where][utag]=text;
			else if(!Array.isArray(vm[where][utag]) && !Array.isArray(text) )vm[where][utag]=text;
			else caninject=false;
		}else{
			caninject=false;
		}
	}else{
		vm[where][utag]=text;
	}
	//console.log('注入后',where,vm.id,vm[where])
	if(caninject){
		if(vm[core_vm.aprand].datafrom_parent.indexOf(utag)===-1)vm[core_vm.aprand].datafrom_parent.push(utag);
	}

}

module.exports.cal_inject_node=function(vm,innode){
	
	var new_data_node={tag:'data',utag:'data',attr:{},attrexp:{},childNodes:[]};
	var new_attr_node={tag:'option',utag:'option',attr:{},attrexp:{},childNodes:[]}
	var finddata=0,findattr=0;
	if(innode.dataset){
		//把dataset转移过来
		for(let k in innode.dataset)innode.attr['data-'+k]=innode.dataset[k]
	}
	core_vm.tool.each(innode.attr,function(v,k){
		if(k=='id' || k=='style' || k=='role' || k=='event'|| k==vm.getapp().config.vmtag+'-src')return;
		if(k.indexOf('data-')===0){
			k=k.substr(5);
			finddata=1;
			if(v.indexOf('{')==0)new_data_node.attrexp[k]=v;
			else new_data_node.attr[k]=v;
		}else if(k.indexOf('option-')===0){
			k=k.substr(7);
			findattr=1;

			if(typeof (v)=='string' && v.indexOf('{')==0)new_attr_node.attrexp[k]=v;
			else new_attr_node.attr[k]=v;
		}
	})

	if(finddata==1)innode.childNodes.push(new_data_node);
	if(findattr==1)innode.childNodes.push(new_attr_node);
}
module.exports.inject_from_pvm_before_start=function(vm){
	//console.log("计算附加node,vm.id="+vm.id,vm[core_vm.aprand].pvmnode);
	//<apple option-x=1><data a=1  b=2/><node name=1><btn /><node></apple>
	if(!vm[core_vm.aprand].pvmnode ){
		return;
	}
	var pvm=vm.pvm;
	var innode=core_vm.tool.objClone(vm[core_vm.aprand].pvmnode);
	//console.log('innode',innode,vm[core_vm.aprand].pvmnode)
	//slot的都是clone过得
	innode.childNodes.forEach(function(node,sn){
		if(!core_vm.isobj(node))return;
		node.attr=node.attr||{};
		if(node.utag=='option' || node.utag=='data'){
			vm[node.utag]=vm[node.utag]||{};
			if(node.attrexp){
				for(var k in node.attrexp)node.attr[k]=node.attrexp[k];
			}
			for(var k in node.attr){
				//有可能是boold number if(typeof (node.attr[k])=='string')continue;
				var text=node.attr[k];//不能去掉 {}因为可能是json
				if(typeof (node.attr[k])!=='string' || text.indexOf('this.')==-1){
					module.exports.inject_one_string(pvm,vm,k,text,node.utag);
					continue;
				}
				var watch_path=text.replace(/^\{*|\}*$/g, '').replace('this.','');
				var in_data=core_vm.tool.objGetDeep(pvm,watch_path);

				if(in_data==undefined){
					in_data=core_vm.calexp.exp(pvm,text,pvm[core_vm.aprand].rootscope,'_exptext_');//复杂表达式的注入
				}
				if(typeof (in_data)=='object'){
					in_data=core_vm.tool.objClone(in_data);
				}
				module.exports.inject_one_string(pvm,vm,k,in_data,node.utag);
			}
		}else{
			if(node.attr.slot){
				//console.log('slot',node.attr.slot)
				vm[core_vm.aprand].pvmslot[node.attr.slot]=node;
			}else{
				//console.log('没有插槽name')
				vm[core_vm.aprand].pvmslot[core_vm.aprand]=vm[core_vm.aprand].pvmslot[core_vm.aprand]||[];
				vm[core_vm.aprand].pvmslot[core_vm.aprand].push(node);
			}
		}
	});
}

module.exports.use_inject_nodes_when_create=function(tvm,node,scope){
//检查child
	//这个node 是cvm的node
	node.attrexp=node.attrexp||{};
	if(scope && node.attrexp && node.attrexp.name){
		node.attrexp.name=core_vm.calexp.exp(tvm,node.attrexp.name,scope);
	}
	var pnode=node.parentNode;
	var pc=node.parentNode.childNodes;
	var index=pc.indexOf(node);		
	//console.log('node.',index);
	var name=!scope ?'' :(node.attr.name||node.attrexp.name);
	//main slot 先找 没有scope
	
	//console.log("use_inject_nodes_when_create",node.attr.name,tvm[core_vm.aprand].pvmslot);

	if(scope && name){
		//注入<div slot=22></div>	//引用<slot name=nodeaa>default</slot>
		var res=tvm[core_vm.aprand].pvmslot[name];
		if(res){
			//index==-1是因为数组的原因	就不能插入到原parent下面只能替代
			if(index===-1){
				//是数组里面的 clone了node的
				node.tag=res.tag;
				node.utag=res.utag;
				node.attr={};
				for(var k in res.attr)node.attr[k]=res.attr[k];
				//其他不要了
				node.childNodes=res.childNodes;				
				//不能再加了 child已经加了node.attr.owner='parent';
			}else{
				pc.splice(index,1,res);
				pc[index].parentNode=pnode;
				return pc[index];
			}
			module.exports.bind_vm_pvm_when_inject_node(tvm,res);
		}
	}else if(!scope && tvm[core_vm.aprand].pvmslot[core_vm.aprand]){
		var index=pc.indexOf(node);	
		//console.log('slot.main',index)
		if(index==-1)index=0;
		pc.splice(index,1);
		var mainslots=tvm[core_vm.aprand].pvmslot[core_vm.aprand];
		//console.log('mainslots',mainslots)
		for(var k=0;k<mainslots.length;k++){			
			mainslots[k].attr.owner='parent';
			module.exports.bind_vm_pvm_when_inject_node(tvm,mainslots[k]);
			pc.splice(index+k,0,mainslots[k]);
			mainslots[k].parentNode=pnode;
			//彻底代替原来的<slot></slot>
		}
		//console.log('main',node.parentNode.childNodes)
	}
	
	//console.log("发现node 最终路径",abpath,res,node);
}
module.exports.bind_vm_pvm_when_inject_node=function(tvm,node){
	//inject node创建时使用来源vm, childvm可能没有绑定事件 这里提前标记
	//不是原生的节点 本vm如果要响应click需要附加绑定
	//console.log("bind_vm_pvm_when_inject_node",node,pnode);

	if(!node)return;
	if(node.event){
		for(var k in node.event){
			//console.log('增加tvm事件',tvm.id,k)
			tvm[core_vm.aprand].domeventnames[k]=1; 
		}
	}
	if(node.childNodes && node.childNodes.length>0){
		for(var i=0,len=node.childNodes.length;i<len;i++)module.exports.bind_vm_pvm_when_inject_node(tvm,node.childNodes[i]);
	}
}


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

var core_vm=__webpack_require__(0);

var lopt_aid=0;

module.exports.gendata=function(vm,node,scope,pel){
	//console.log('---gendata')
	var array=node.dir.list.split(' in ');

	array[1]=core_vm.calexp.exp(vm,array[1],scope);

	var abpath=core_vm.cal.now_path(scope,array[1],vm,'listgen');
	
	//if(abpath.indexOf('this.data.')!==0)abpath='this.data.'+abpath;//.substr(9);
	//if(abpath.indexOf('this.')!==0)abpath='this.data.'+abpath;
	//abpath=abpath.substr(5);

	abpath=abpath.replace(/^\s*|\s*$/g, '').replace(/\[([\s\S]*?)\]/g,function(a,b){
		return "."+b+".";//方括号转成点
	}).replace(/^\.*|\.*$/g, '').replace(/\'|\"/g, '');


	var listdata;
	if(abpath.indexOf('this.')===0)listdata=core_vm.tool.objGetDeep(vm,abpath.substr(5));
	else listdata=core_vm.tool.objGetDeep(vm.data,abpath);

	//console.log('list.gendata.abpath',abpath,listdata);
	return [array,abpath,listdata];
}
var g_classid=0;
var gen_watch_listclass=function(node){
	//console.log(node.dir,node.watchs)
	//数组里面需要watch的加入_list_id 比如删掉index=0的,index=1的自动提升,
	//修改index=0,根据_list_id找出一个el数组 第一个就是要找的el 但是要根据page的情况 甚至page也应该由datastore控制
	if(node.watchs){
		//每个list需要watch的 根据 listid 重新生成 node.id 保证id不重复
		//然后regel到listel 用getel('@'+id)可以找到
		//watch时 watch.listid
		//数据变化时 watching_data里面储存有path 根据listid 找出 els 根据path找出index 就找到具体的那个el了
		node.listid=++g_classid;
	}
	if(node.childNodes)node.childNodes.forEach(function(cnode){gen_watch_listclass(cnode)})

}
module.exports.gen=function(vm,node,scope,pel){
	node.id='';
	//console.log("list.gen abpath="+abpath,'list='+node.dir.list,listdata);
	var tmp=module.exports.gendata(vm,node,scope,pel);
	var array=tmp[0],abpath=tmp[1],listdata=tmp[2];
	if(!Array.isArray(listdata)){
		core_vm.onerror(vm.getapp(),'list_data_not_array',vm.absrc,{path:abpath},listdata);
		return;
	}else{
		//console.log("发现数组",listdata);
		gen_watch_listclass(node);
		var new_scope={
			alias:array[0],
			palias:array[1],
			path:abpath,
			pscope:scope,
		};


		new_scope.listdata=listdata;
		new_scope.$index=0;

		//console.log("找到 listdata,abpath=",abpath);
		var lopt={			
			vm:vm,
			node:node,
			scope:new_scope,
			//aid:lopt_aid++
		};
		var listing;
		//暂时支持attr,state的数组add-del
		//if(abpath.indexOf('this.option')==0)listing=vm.__listing_option;
		//else if(abpath.indexOf('this.state')==0)listing=vm.__listing_state;	else 
		listing=vm[core_vm.aprand].watching_list;

		listing[abpath]=listing[abpath]||[];
		listing[abpath].push(lopt);

		lopt.pel=pel;
		

		
			vm.__addto_onstart(function(){
				if(pel.nodeName=='#document-fragment' && pel.id==vm.id+'__tmp')lopt.pel=vm.pel;
			});	
			lopt.sn_in_parent=pel.childNodes.length;
		

		for(var k=0,len=listdata.length;k<len;k++){
			core_vm.list.new_node(k,listdata[k],lopt,lopt.sn_in_parent+k,'init');
		}
		
		
	}
	//return false;
}



module.exports.$add=function(lopt,k,v){
	//console.log('增加了回调', k,v,sid,this,lopt );	
	var insert_pos=core_vm.list.get_fel_sn_in_parent(lopt,'add')+k;
	core_vm.list.new_node(k,v,lopt,insert_pos,'add');
}



module.exports.$delat=function(lopt,index,oldv){
	var sn_in_parent=core_vm.list.get_fel_sn_in_parent(lopt,'delat');
	var childs=lopt.pel.childNodes; 
	
	lopt.vm.delel(childs[sn_in_parent+index]);
}

module.exports.$clean=function(lopt){
	//var listdata=this;
	var sn_in_parent=core_vm.list.get_fel_sn_in_parent(lopt,'clean');
	//console.log("sn_in_parent="+sn_in_parent,listdata.length);
	for(var i=this.length-1;i>-1;i--)lopt.vm.delel(lopt.pel.childNodes[sn_in_parent+i]); 
	
}
module.exports.$rebuild=function(lopt){
//放弃 改为sort后自动
	//console.log('更新了',this,this.length);//this是listdata
	var sn_in_parent=core_vm.list.get_fel_sn_in_parent(lopt,'rebuild');
	for(var k=0,len=this.length;k<len;k++){
		core_vm.list.new_node(k,this[k],lopt,sn_in_parent+k,'rebuild');
	}
}

module.exports.new_node=function(k,v,lopt,insert_pos,where){
	//console.log("--list new_node",where);
	//lopt.node.parentNode=null;
	var scope_node=core_vm.tool.objClone(lopt.node);
	delete scope_node.dir.list;
	delete scope_node['id'];
	lopt.scope.$index=k;	
	core_vm.cal.nodeid(lopt.vm,scope_node,lopt.scope);

	core_vm.create.nodes(lopt.vm,scope_node,lopt.scope,lopt.pel,insert_pos,true);
	
}

module.exports.get_fel_sn_in_parent=function(lopt){
	
	return lopt.sn_in_parent;
}








/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

var core_vm=__webpack_require__(0);

var _reqlib=__webpack_require__(1);

module.exports=function(vm,cb){
	if(vm[core_vm.aprand].has_defined || vm[core_vm.aprand].has_started ||!vm.src){
		//console.log('vm.can not load cause of has_start || has_defined',vm.id,vm[core_vm.aprand].has_started,vm.src)
		return;
	}
	if(!core_vm.isfn(cb))cb=function(){}
	if(vm.getcache().vmlib[vm.src]){	
		//path-use 已经有了
		vm.getcache().add_ref('vm',vm.src,vm[core_vm.aprand].absrcid,'loadsub');

		vm.__define(core_vm.tool.objClone(vm.getcache().vmlib[vm.src].exports));
		vm.absrc=vm.src;				
		vm.__initdata_then_start(cb);
		return;
	}
	//console.log("loadvm 开始,id=",vm.id,'vmsrc='+vm.src,vm.__load_fresh,vm.pvm[core_vm.aprand].absrcid);
	var pvm=vm.pvm;
	if(pvm)pvm[core_vm.aprand].loadingsub_count++;

	var fresh=vm._is_fresh_ing ;
	//fresh=false;//websocket更新
	var opt={
		app:vm.getapp(),
		loadvm:	pvm,		pvmpath	:pvm.absrc,
		url:	vm.absrc||vm.src,	    
		type	:'vm',
		from:	'loadvm',	fresh	:fresh,
		urlsid:vm[core_vm.aprand].absrcid,
		refsid:pvm[core_vm.aprand].absrcid,
		vm:vm,
	};
	_reqlib.cal_spec_path(opt);

	core_vm.require.load(opt,function(err,mod,spec){
		//下载错误 到这里
		//js 执行错误不到这里 mod会是
		if(err){
			core_vm.onerror(vm.getapp(),'load_vm_fail',spec.id || vm.src,err);
			if(pvm){
				pvm[core_vm.aprand].loadingsub_count--;							
				if(pvm[core_vm.aprand].loadingsub_count==0){
					core_vm.tryvmfn(pvm,null,'__onstart_a_zero_sub');
				}
			}
			cb.call(vm,err);
		}else{
			//console.log('动态加载vm成功',mod.__extend_from,spec.id);
			vm.__define(mod);
			vm.absrc=spec.id;	

			if(vm[core_vm.aprand].cbs_on_define){
				for(var k in vm[core_vm.aprand].cbs_on_define)vm[core_vm.aprand].cbs_on_define[k]();//获得absrc
				vm[core_vm.aprand].cbs_on_define=[];
			}
			vm.__initdata_then_start(cb);
		}
	});	
}

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {




var core_vm=__webpack_require__(0);
var _reqlib=__webpack_require__(1);
var _libcal=__webpack_require__(50);
var _requirecache=__webpack_require__(2);

var load_pending={};

if(1){
	// we make use of XHR
	if(XMLHttpRequest===undefined ||  typeof XMLHttpRequest === "undefined")
	XMLHttpRequest = function () {
		try {                return new ActiveXObject("Msxml2.XMLHTTP.6.0");            } catch (e) {}
		try {                return new ActiveXObject("Msxml2.XMLHTTP.3.0");            } catch (e) {}
		try {                return new ActiveXObject("Msxml2.XMLHTTP");	            } catch (e) {}
		throw new Error("This browser does not support XMLHttpRequest.");
	};
}





//3处都是clone 
//1.load时找到并 克隆 require(id)
//2.load->download_ok->evalResponse->evalResponse_genmod 此处克隆->cb_mod_with_extend_from 此处克隆两个

//require execute error 错误可以在chrome下看到哪一行 js_SyntaxError 看不到 


var setparaxhr=function(xhr,cacheexpire,cache_text){

	if(gcache.user.logintoken)xhr.setRequestHeader('logintoken',gcache.user.logintoken);
	else xhr.setRequestHeader('clientid',gcache.clientid||'');
	xhr.setRequestHeader('client-time',new Date().toUTCString());
	if(!cacheexpire ||!cache_text)return;
	//console.log("cacheexpire",cacheexpire);
	if(cacheexpire && cacheexpire.lastmodify)xhr.setRequestHeader('If-Modified-Since',cacheexpire.lastmodify);
	if(cacheexpire && cacheexpire.etag)xhr.setRequestHeader('If-None-Match',cacheexpire.etag);
	
}

function load(spec,callback) {	
	//spec:url,type,app, loadvm,pvmpath,
	//from,fresh,method,data
	//console.log('要下载',spec.type,spec.url,spec.text?'已有text':'')
	//console.error('===load===',spec.url,spec.fresh);//,spec.app.id
	if(typeof callback!='function')	callback=function(){};
	if(typeof spec === 'string')	spec = {url: spec}; 

	if (!spec.url) {
		//console.error("缺少 属性spec",spec);
		callback({type:'missing both url and id'},null,spec);
		return;
	}
	//vm load时加上refsid
	
	if(!spec.refsid ){
		console.log('没有refsid',spec.url)
		callback({type:'missing spec.refsid'},null,spec);
		return;
	}
	if(!spec.urlsid)	spec.urlsid=spec.app.__cache.geturlsid(spec.url);

	_reqlib.cal_spec_path(spec);
	
	if(spec && spec.text){
		spec.callback=callback;
		//console.log('有了text',spec.text.length,typeof (callback))
		//为index设计的 先loadfile('text' 先解析app.js 然后解析index.html 目的是为了同时下载 先解析app.js
		download_act(xhr,'onload',spec,'',null,true);
		return;
	}

	//console.log("load cal_spec_path 后",spec.url,spec.pvmpath,spec.id );
	if(spec.url==spec.pvmpath ||(spec.pvm && spec.url==spec.pvm.absrc) ||
		spec.id==spec.pvmpath ||(spec.pvm && spec.id==spec.pvm.absrc)){	
		//console.error("url 重复",spec.id,spec.url,spec.pvmpath);
		if(!spec.istop){
			callback(new Error("url duplicate"),null,spec);
			return;
		}
	}
	//console.log("load cal_spec_path 后",spec.url,spec.id,spec.from );
	//url带http id不带http
	if(spec.url.indexOf('http://www.localhost.com/')==0){
		spec.fresh=true;
		var cache_text=gcache.fileroot.get_text('mydevapps/'+spec.url.replace('http://www.localhost.com/',''));
		find_cache_file_mob(spec,cache_text,callback);
		return;
	}

	if(load_pending[spec.url]){
		load_pending[spec.url].push([spec,callback]);
		//console.log('有pending',spec.url)
		return;
	}

	if (spec.elhook_second_times || (!spec.fresh )){
		//elhook_second_times:elhook第二次就不再下载,

		//jslib都是作为deps出现的
		//jslib都在vm的require的缓存里面 都不需要再load
		//jslib在一个页面出现后,再在另外一个页面出现 如果abspath相同 不需要再load 自动找到
		//jslib的id也转成 /xxx/yyy的abs路径
		//vm的id都是 /xxx/yyy/xxx.vm等 根目录与location的根目录是一样的
		//lib的id 是 spec.app.config.path.lib 或者当前vm里面的 可以是 ./aaa.js
		//console.log("检查require 缓存",spec.id,spec.url,spec);
		var module=_requirecache.get(spec.app,spec.vm,spec.id,'',spec.type,'check',spec.urlsid);
		if(module){
			//console.log("==find_cachevm_inrequie",spec.id);
			find_cachevm_inrequie(module,spec,callback);
			return;
		}else{
			//console.log("没有找到 require 缓存",spec.url,spec);
		}
	}
	//
	//todo 此处的顺序要严格 有reqcache用reqcache 有filecache用,并且自动进入reqcache

	var cache_text=''; 
	//console.log('是否下载  ',spec.url ,load_pending[spec.url]);
	


	//console.log('将要下载,fresh=',spec.fresh,spec.loadfilefresh,spec.url);
	var xhr;
			xhr=new XMLHttpRequest();	
	

	xhr.hascallbacked=0;
	load_pending[spec.url]=[[spec,callback]];
	xhr.onreadystatechange = function (e) {
		//console.log("\n\n\nonreadystatechange",'readyState='+xhr.readyState,'status='+xhr.status,xhr.hascallbacked);
		//autoRedirect
		
		if (4 != xhr.readyState){
			//console.log("转向",spec.url,xhr.location );
			return;    
		}else if (0 == xhr.status) {
			download_act(xhr,'download_timeout',spec,cache_text);
		}else{
			//console.log('onreadystatechange',xhr.readyState,xhr.location);//,xhr.getheaderobj()
			download_act(xhr,'readystatechange',spec,cache_text);
		}
	};
	xhr.onload = function () {
		download_act(xhr,'onload',spec,cache_text);
	};
	xhr.onerror = function (error) {
		core_vm.devalert(spec.app,'onerror.xhr',xhr.location,error)
		download_act(xhr,'download_error',spec,cache_text,error);
	};
	try{
		xhr.open('GET',spec.url, true);
		if(spec.fresh){
			//xhr.setRequestHeader("fresh","true"); //fresh时总会返回304
		}
		xhr.send(null);
	}catch(e){
		//console.log('http 错误 捕捉');//一般捕捉不到
		xhr.onerror.call(xhr,'error-catched')
	}
	//devtools 打开时总是fresh 否则 总是取缓存
	
}

function download_act(xhr,type,spec,cache_text,error,withtext){	

	if(withtext){
		//mob已经解过密了
		_libcal.evalResponse(0,spec,spec.text,function(err,mod){download_ok_pendingcb(spec,err,mod);},loads);
		return
	}
	if(xhr.hascallbacked==1){
		//console.error('已经在处理了',spec.url)
		return;//mob 有可能过来多次
	}else{
		//console.error('还没有处理',spec.url)
		xhr.hascallbacked=1;
	}
	if(!load_pending[spec.url])return;
	//console.log("下载完成",spec.url,xhr.location,xhr.getAllResponseHeaders() );//,xhr.getResponseHeader('encrypt'),xhr.getAllResponseHeaders()
	//if(spec.url!=xhr.location){
		//console.error("下载转向了",spec.url,xhr.location );
		spec.url_goto=xhr.location; 
	//}
	//console.log("xhr."+type,spec.url,'xhr.readyState='+xhr.readyState,'xhr.status='+xhr.status,'xhr.hascallbacked='+xhr.hascallbacked);


	var sucess=0;
	if(type=='onload'){
		sucess=1;
	}else if(type=='readystatechange'){	
		if ((xhr.status < 300 && xhr.status >= 200) || (xhr.status === 0 && !spec.url.match(/^(?:https?|ftp):\/\//i))){
			sucess=1;
		}else{
			sucess=0;
			type='download_error'
		}
	}
	//console.log('下载完成',spec.id,sucess)
	var xhr_responseText=sucess>0 ? xhr.responseText:'';

	

	if(1){
			var result=core_vm.onload(spec.app,spec.url,xhr,spec);
			if(result)xhr_responseText=result;//解决less sass的问题	
	}

	 


	
	//url相同 type相同 赋予的使命不同	
	if(1){
		if(sucess==0){
			download_ok_pendingcb(spec,{type:type,url:spec.url,status:xhr.status,xhr:xhr} );//
		}else if(sucess==1){
			_libcal.evalResponse(3,spec,xhr_responseText,function(err,mod){download_ok_pendingcb(spec,err,mod);},loads);
		}	
	}	
	
}


function download_ok_pendingcb(spec,error,mod){
	//console.log("pendingcb",spec.url,error);
	var cbs=[];
	var specs=[];
	var first_type='';
	if(!load_pending[spec.url]){//withtext
		cbs[0]=spec.callback;
		specs[0]=spec;
		first_type=spec.type;
	}else{
		var len=load_pending[spec.url].length;
		for(var k=0;k<len;k++){
			cbs.push(load_pending[spec.url][k][1]);
			specs.push(load_pending[spec.url][k][0]);
		}
		first_type=load_pending[spec.url][0][0].type;
		delete load_pending[spec.url];
	}
	
	if(error){
		cbs.forEach(function(cb,i){		cb(error,null,specs[i]);	});
	}else{
		cbs.forEach(function(cb,i){	
			let spec=specs[i];
			if(spec.type=='css'){
				spec.app.__cache.loadok_style(spec,mod);
				cb(null,mod,spec);
			}else if(spec.type=='text'){
				cb(null,mod,spec);
			}else	if(spec.type=='block'){
				spec.app.__cache.loadok_block(spec,mod);
				cb(null,mod,spec);
			}else{//lib,vm
				if(spec.urlsid){
					//console.log('下载完了',spec.type);
					//同时两个vm 第一个 运行了 函数 第二个 没有 只是等待 exports 不行
					if(spec.type=='vm'){
						spec.app.__cache.add_ref('vm',spec.id,spec.refsid,'loadok');
					}
					if(spec.type=='lib'||spec.type=='json'){
						spec.app.__cache.add_ref('lib',spec.id,spec.refsid,'loadok');
					}
				}
				if(first_type=='text' && spec.type=='lib'){
					//console.log('第一个是text后面是lib',typeof (mod),'重新来过')
					spec.text=mod;
					core_vm.require.load(spec,cb);
				}else if(spec.type=='vm'){
					//genmod尝试过了 _requirecache.get(spec.app,spec.vm,spec.id,'','vm','pendingok',spec.urlsid);
					//console.log('啊啊啊啊',spec.id)
					cb(null,clone_mod(mod,spec),spec);
				}else{
					cb(null,clone_mod(mod,spec),spec);
				}
			}
		});
	}
}
//find in mem,file,http 都统一到 pending来
function clone_mod(mod,spec){
	if('css'==spec.type)return null;
	else if('lib'==spec.type)return mod;
	else if('vm'==spec.type)return core_vm.tool.objClone(mod);//全部clone 因为有可能打开再关闭 需要在require.cache保存原始	
	else if('text'==spec.type)return mod;
	else return null;	
}
//clone 的时机 find_cachevm_inrequie,find_cache_file_mob,evalResponse->pendingcb//保证正确克隆 不浪费

function find_cache_file_mob(spec,cache_text,loadcb){	
	//console.log("发现mob filecache",cache_text);
	_libcal.evalResponse(4,spec,cache_text,function(err,mod){
		loadcb(err,clone_mod(mod,spec),spec);
		//spec.callback=loadcb;
		//download_ok_pendingcb(spec,err,mod);
	},loads);
}
function find_cachevm_inrequie(mod,spec,loadcb){
	console.log("find_cachevm_inrequie",spec.type,mod.__extend_from);
	//这里是提前下载或者多个vm公用一个vm 
	//js lib模块不到这里来 直接 require('abc') 了
	loadcb(null,clone_mod(mod,spec),spec);//一定要克隆 extend工作已经做好了
}

function loads(urls, callback) {
	//console.error("loads");
	if(!Array.isArray(urls))urls=[urls];
	var len = urls.length;
	var errs = [];
	var mods = [];
	var specs=[];
	var errcount = 0;

	
	urls.forEach(function (url, i) {
		if(!url){
			len--;
			return;
		}
		load(url, function (err, mod,spec) {
			if (err) errcount++;
			errs[urls.indexOf(url)] = err;
			specs[urls.indexOf(url)] = spec;
			mods[urls.indexOf(url)] = mod||{};//错误给个默认的{}
			len--;
			if (len == 0) callback(errcount, errs, mods,specs);
		})
	});
}
module.exports={}
module.exports.load = load;
module.exports.loads = loads;
module.exports.normalizeUrl=_reqlib.normalizeUrl;


//load.opt={loadvm,pvmpath}
//loadobj={url,type,fresh,from} from=deps,loadelhook,loadvm,web-init,mob-appopenpage




/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

//<wrapper html=''> </wrapper>

var core_vm=__webpack_require__(0);

module.exports.setstore=function(app){

	if(!app.store||(typeof(app.store)!=='object' && typeof(app.store)!=='function')){
		app.store={};
	}
	if(!core_vm.isfn(app.store.init))app.store.init=function(cb){cb()};
	if(!core_vm.isfn(app.store.vminit))app.store.vminit=function(cvm,cb){cb()};
	if(!core_vm.isfn(app.store.get))app.store.get=function(cvm,path,cb){cb()};
	if(!core_vm.isfn(app.store.set))app.store.set=function(cvm,path,value,cb){cb()};
	if(!core_vm.isfn(app.store.add))app.store.add=function(cvm,path,index,value,cb){cb()};
	if(!core_vm.isfn(app.store.del))app.store.del=function(cvm,path,index,cb){cb()};
	
}
var defconf={
	isdev:false
	,precode:['pre','code']
	,vmtag:'vm'
	,strategy:{
		not_document_getelbyid:false,
		auto_deepclone_store_data:true,
		force_close_error_close_tag:true,
		force_close_not_match_close_tag:true,
		append_to_pel_wait_loading_child_vm:true,
		setChildState:true,
		cacheClassesAll:true,
	}
	,path:{
		lib:{},vm:{},block:{},elhook:{},
	}
} 
module.exports.checkappconfig=function(app,obj){
	//3次 空白一次 app.js setconfig一次 最后检查一次
	//console.error('checkappconfig',obj,'app.sid='+app.sid)
	app.config=app.config||app.pageconfig||{};
	var apconf=app.config;
	if(obj==0){		
		for(var k in defconf){
			if(Array.isArray(defconf[k])){
				apconf[k]=[];
				for(var m in defconf[k])apconf[k].push(defconf[k][m])
			}else if(typeof (defconf[k])=='object'){
				apconf[k]={};
				for(var m in defconf[k]){
					apconf[k][m]=defconf[k][m];
				}
			}else{
				apconf[k]=defconf[k];
			}
		}
		
		apconf.precode_regexp={};
		for(var k in apconf.precode){
			apconf.precode_regexp[apconf.precode[k]]=
				new RegExp('<'+apconf.precode[k]+'([\\s\\S]*?)>([\\s\\S]*?)<\/'+apconf.precode[k]+'>', 'gi');
		}
	}else if(obj==1){
		for(var k in apconf){
			if(defconf[k]!==undefined && typeof(defconf[k])!==typeof(apconf[k])){
				delete apconf[k];
			}
		}
		for(var k in defconf){
			if(apconf[k]==undefined)apconf[k]=core_vm.tool.objClone(defconf[k]);
		}
		for(var k in apconf.strategy){
			if(typeof(defconf.strategy[k])!==typeof(apconf.strategy[k]))delete apconf.strategy[k];
		}		
		for(var k in defconf.strategy){
			if(apconf.strategy[k]==undefined)apconf.strategy[k]=defconf.strategy[k];
		}
		apconf.precode_regexp={};
		for(var k in apconf.precode){
			if(typeof(apconf.precode[k])!=='string')delete apconf.precode[k];
		}
		for(var k in apconf.precode){
			apconf.precode_regexp[apconf.precode[k]]=
				new RegExp('<'+apconf.precode[k]+'([\\s\\S]*?)>([\\s\\S]*?)<\/'+apconf.precode[k]+'>', 'gi');
		}
		
		apconf.blockpath_regexp={};
		for(var k in apconf.path){
			if(typeof(apconf.path[k])!=='object')delete apconf.path[k];
		}
		for(var k in apconf.path.block){
			apconf.blockpath_regexp[k]=new RegExp('<'+k+' ', 'gi');
		}
		var _reqlib=__webpack_require__(1);

		for(var k in defconf.path){
			if(apconf.path[k]==undefined)apconf.path[k]={};
			for(var m in apconf.path[k]){
				if(typeof(apconf.path[k][m])!=='string')delete apconf.path[k][m];
				apconf.path[k][m]=_reqlib.gen_path(app,apconf.path[k][m],'',true,4);
				//提前计算
			}
		}

		


		//console.log('apconf',apconf.path)
	}
	//console.log('最终',	app.config)

}


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

var core_vm=__webpack_require__(0);


var app_loaded=false;
var index_loaded=false;
module.exports.init=function(){
	app_loaded=false;
	index_loaded=false;
}
var start_index_vm=function(app,index_vm,mycb){
	//console.error('start_index_vm');
	if(typeof (app.hookStart)!=='function')app.hookStart=function(cb){cb();}
	app.hookStart(function(){
		index_vm.__initdata_then_start(mycb);
	})	
}
var start_index_and_app=function(app,index_vm,cb){
	//console.log('开始 index-app都下载完了',app_loaded,index_loaded)
	start_index_vm(app,index_vm,cb);
	
}

var start_parse_index=function(app,file_indexvm,index_vm,cb,where){
	//console.error('start_parse_index',where,app.indexvm_text.length)
	if(app.indexvm_text==='' || !app_loaded){
		//if(app.indexvm_text=='')console.error('app.indexvm_text 没有下载')
		//if(!app_loaded)console.error('app.js 没有下载')
		return;
	}
	//console.error('index app.js都下载完了')
	if(app.indexvm_text===true){
		//没有index文件
		cb();
		return;
	}
	index_vm[core_vm.aprand].absrcid=1;
	//console.error('1开始start_parse_index',file_indexvm,app.indexvm_text.length)
	core_vm.require.load({
		app:app,
		loadvm:null,pvmpath:'',
		url:file_indexvm,
		type:'vm',from:'file_indexvm',
		text:app.indexvm_text,
		//urlsid:index_vm.sid,  
		urlsid:1,
		refsid:1,
		vm:index_vm
	},function(err,mod,spec){
		//console.log("加载 完成 index 文件",err,where, typeof (cb));
		delete app.indexvm_text;
		if(err){ 
			core_vm.devalert(index_vm,'load file_indexvm fail');
			if(typeof (cb)=='function')cb('error');
		}else{				  
			for(var k in mod){
				index_vm[k]=mod[k];
			} 
		}	
		index_vm.absrc=spec.id ;
		index_loaded=true;
		start_index_and_app(app,index_vm,cb);	 
	});	

}
var start_system=function(app,file_app,file_indexvm,index_vm,cb){
	//console.error('0开始start_system',file_app,file_indexvm,typeof (cb))
	app.indexvm_text='';
	if(file_indexvm){
		app.loadfile('text',file_indexvm,function(err,text){
			app.indexvm_text=text;
			start_parse_index(app,file_indexvm,index_vm,cb,3);
		});
	}else{
		app.indexvm_text=true;//web 没有indexvm文件
		start_parse_index(app,file_indexvm,index_vm,cb,4);
	}
	//有index 先下载 等待 app.js 汇合
	//无index 汇合等待app
	//有app 下载解析 与index会和 
	//无app 汇合 等待index
	if(file_app){
		//app.loadfile('text',file_app,function(err,text){	})				
		core_vm.require.load({
				app:app,
				loadvm:null,pvmpath:'',
				url:file_app,type:'lib',from:'file_app',
				urlsid:2,
				refsid:2,
				vm:null,
			},function(err,mod,spec){
			//console.log("加载完成 app.js 文件",err);//,mod
			if(err){ 
				core_vm.devalert(index_vm,'load app fail ');
			}
			core_vm.rootvmset.checkappconfig(app,1);
			core_vm.rootvmset.setstore(app);
			

						

			app_loaded=true;
			start_parse_index(app,file_indexvm,index_vm,cb,1);
		});
	}else{
		core_vm.rootvmset.checkappconfig(app, {});
		core_vm.rootvmset.setstore(app);
		app_loaded=true;
		start_parse_index(app,file_indexvm,index_vm,cb,2);
	}
}

module.exports.start_system=start_system;
module.exports.start_index_vm=start_index_vm;


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

var core_vm=__webpack_require__(0);
var global_rootvm={},index_vm={}

var check_body_when_not_file_indexvm=function(){	
	core_vm.wap.indexvm[core_vm.aprand].has_started=1;
	var s=Object.keys(core_vm.wap.config.path.vm);
	s.push(core_vm.wap.config.vmtag);
	
	
	//var el_src=document.body.querySelectorAll("[vm-src]") ;
	var el_src=document.body.querySelectorAll(s.join(',')) ;//或者其他标签
	//var el_name=vm.pel.querySelectorAll("[vm-name]") ;//name直接调用注册的vm
	var elsall=[];
	[].forEach.call(el_src,function(el){ elsall.push(el)});

	[].forEach.call(elsall,function(el){
		//console.log('checkbody',el)
		if(el.hasAttribute('autostart') && el.getAttribute('autostart')==false)return;
		var json={};
		json.src=core_vm.wap.config.path.vm[el.localName]||el.getAttribute('src') || '';
		json.id=el.getAttribute('id') || '';
		var nodes=[];

		el.childNodes.forEach(function(node){
			//这里不处理了
			
			el.removeChild(node);
		});
		//el.childNodes=[];
		//此处需要对index.body下的元素解析
		//event,injectnodes,data,attr style
		//pvm,el,id,src,pelevent,node,cb
		var vm=core_vm.define.define({pvm:core_vm.wap.indexvm,el:el,id:json.id,src:json.src});
		core_vm.load(vm,function(vm){
			//console.log('checkbody.top vm',vm)			
		})
	});
}

var start_system=function(){
	//core_vm.rootvmset.checkappconfig(core_vm.wap,'web');
	var file_app,file_indexvm;
	var scripts= document.getElementsByTagName('script');	
	//console.log(scripts)
    for (var i = scripts.length - 1; i > -1; i -= 1) {
		if(scripts[i].dataset['role']==='vmix'){ 			
			if(scripts[i].hasAttribute('app-file') || scripts[i].hasAttribute('index-file') ) {
				file_indexvm=scripts[i].getAttribute('index-file');
				file_app=scripts[i].getAttribute('app-file');
				break;
			}
		}
    }
	module.exports.root=global_rootvm;
	index_vm=core_vm.define.define({id:'__index__',pvm:null});
	index_vm.__define({});
	index_vm[core_vm.aprand].pvmevent={};
	
	index_vm.pel=document.body;
	module.exports.index=index_vm;
	core_vm.wap.indexvm=index_vm;
	

	index_vm.absrc=window.location.pathname;
	var dirpath=window.location.pathname;
	dirpath=dirpath.substr(0,dirpath.lastIndexOf('/'));

	
	window.location.dirpath=dirpath;
        var u = window.location.protocol + '//' + window.location.hostname;
        if (window.location.port && window.location.port !== 80) {
            u += ':' + window.location.port;
        }
	//u+=dirpath;
	window.location.fullhost=u;
	
	//console.log('web',file_app,file_indexvm)

	core_vm.rootvmstart.init();
	core_vm.rootvmstart.start_system(core_vm.wap,file_app,file_indexvm,index_vm,function(){
		if(!file_indexvm){
			check_body_when_not_file_indexvm();
		}
		//console.error('web.system.started')
	});

}
module.exports.start_system=start_system;
//从外边启动，不需要docreay

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {


var core_vm=__webpack_require__(0);


module.exports.web=function(vm){	
	//console.log('开始startvm',vm.id,vm.pel);
	//html附加模式不能实现 一个vm下的child一起启动 只能一个一个启动 靠id找下级的vm
	if(!vm.pel.style.display && vm.config.pelDisplayType)vm.pel.style.display=vm.config.pelDisplayType;
	var fragment = document.createDocumentFragment();
	fragment.id=vm.id+'__tmp'
	vm.__top_fragment=fragment;
	core_vm.create.nodes(vm,vm[core_vm.aprand].nodejson[0],vm[core_vm.aprand].rootscope,fragment);

}







/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

var core_vm=__webpack_require__(0);

var vm_tool={}
vm_tool.objGetDeep=function(obj,name){
//todo 考虑实际 也许 attr['a.b.c']是一个属性而不是attr.a.b.c 多级的应该自己指定
	//console.log('objGetDeep name='+name);
	//log(obj)
	if(obj==undefined)return obj;
	if(!(typeof obj =='object') || !(typeof name =='string') ){
		//error('1')
		return undefined;
	}
	name=name.replace(/^\s*|\s*$/g, '').replace(/\[([\s\S]*?)\]/g,function(a,b){
		//console.log('发现方括号',a,b)
		//[1]也转为.2便于遍历
		//error('2')
		return "."+b+".";
	}).replace(/^\.*|\.*$/g, '').replace(/\'|\"/g, '');
	//console.log('2 objGetDeep name='+name);
	var r_obj=obj;
	var parts = ~name.indexOf('.') ? name.split('.') : [name];
	//console.log("objGetDeep",parts,r_obj);
	for (var i = 0; i < parts.length; i++){
		r_obj = r_obj[parts[i]] 
		if(r_obj===undefined){
			break;
		}
	}
	return r_obj;
	//对于该函数的参数obj修改obj本省在函数外是无效的 修改 obj的属性在函数外有效 所有可以返回obj的内部属性而不影响obj本身
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
		//console.log("objSetDeep",obj,name,value);
		for(var i=1;i<len;i++){

			//console.log("objSetDeep",typeof p[i-1],p[i-1] );
			if(Array.isArray(n[i-1])  ){
				//p[i-1]=n[i-1].$sid.indexOf( parseInt(p[i-1] ));//.substr(4)
				//console.log("真的是",p[i-1],n[i-1]);
				p[i-1]=parseInt(p[i-1]);
			}
			if(ifnew && n[i-1][p[i-1]]==undefined){
				n[i-1][p[i-1]]={}
			}
			n[i]=n[i-1][p[i-1]];
			if(typeof n[i]!='object' || n[i]===null){
				//console.log("错误",i,n[i]);
				err=1;
				break;
			}
		}
		if(!err){
			n[len-1][p[len-1]]=value;
			//console.log("没有错误",n);	
		}
	}
	//return obj;
}

 

vm_tool.deepmerge=function(target, src) {
	if(typeof target!=='object' ||typeof src!=='object' )return;
	if(!Array.isArray(src) && Array.isArray(target))return;//src=[src];
	if(Array.isArray(src) && !Array.isArray(target))return;
	//here not deepclone
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
		//关键是不能覆盖
	}
} 

vm_tool.trim=function(str){
	//去除字符串头尾空格与tab
	//return str.replace(/^[\s\t ]+|[\s\t ]+$/g, '');
	return str.replace(/^\s*|\s*$/g, '');//.replace(/[\r\t\n]/g, " ");	 

}
vm_tool.trimquota=function(str){
	//去除字符串头尾 ' "
	//return str.replace(/^[\s\t ]+|[\s\t ]+$/g, '');
	return str.replace(/^[\'\"]*|[\'\"]*$/g, '');//.replace(/[\r\t\n]/g, " ");	 

}
vm_tool.parse_func_para=function(str){
	var res=[str,undefined];
	str.replace(/(.*?)\((.*?)\)(.*?)/g, function (all,a, b){
		//没有括号 all也没有
		 res[0]=vm_tool.trim(a);//函数名
		 res[1]=vm_tool.trim(b);//.split(",");//函数参数
	});
	return res;
}
vm_tool.parse_kv_para=function(str){
	var parames = {};
	//允许az09AZ -.[]
	var array=str.split(";");
	if(array.length==1)array=str.split(",")
	for(var i=0,len=array.length;i<len;i++){
		array[i].replace( /(.+)=(.+)/g, function(a, b, c){
			//console.log(a, b, c);
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
	

	//typeof ==function 已验证
	// 直接通过普通赋值的方式，就实现了函数的克隆，并且不会影响之前的对象。原因就是函数的克隆会在内存单独开辟一块空间，互不影响。
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
			if(!obj.hasOwnProperty(k) ||newobj[k] === obj[k] )continue;//有时对象嵌套 HTML EVENT不能克隆
			//console.log('clone',k,typeof(obj[k]))
			if(!obj[k]){
				newobj[k] = obj[k];
			}else	if(k=='parentNode' &&  obj[k].tag ){
				newobj[k] = obj[k];
				//此处是特殊处理的 有时候要clone node
			}else	if (typeof(obj[k]) === 'object' ){
				if(obj[k].nodeType!==undefined ||obj[k].nodeName!==undefined )newobj[k]=obj[k];
				
				else{
					//console.log('clone',k,obj[k])
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
	//var match = reCommentContents.exec(fn.toString());
	var match = /\/\*!?(?:\@preserve)?[ \t]*(?:\r\n|\n)([\s\S]*?)(?:\r\n|\n)\s*\*\//.exec(fn.toString());

	if (!match){
		throw new TypeError('Multiline comment missing.');
		return '';
	}
	match[1]=match[1].replace(/\/\/.*?[\r\n]/g,'');
	
	return match[1].replace(/\/\/.*?[\r\n]/g,'').replace(/\/\/.*?$/g,'');//最后一行用rn不能表示
};

 
vm_tool.each = function (obj, fn, context) {
  // Iterate over array-like objects numerically.
  if (obj != null && obj.length === +obj.length) {
    for (var i = 0; i < obj.length; i++) {
      fn.call(context, obj[i], i, obj);
    }
  } else {
    for (var key in obj) {
      // Use the Object prototype directly in case the object we are iterating
      // over does not inherit from `Object.prototype`.
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



/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

var core_vm=__webpack_require__(0);

	
	var check_array_repeat=function(s,listid,index){	
		//数组都加在0位置 就重复了
		var len=s.length;
		for(var i=len-1;i>-1;i--){
			if(s[i].listid && s[i].listid ==listid && s[i].$index==index){
				s.splice(i,1);
			}
		}	
	}
var calnode_watch=function(vm,node,scope,where){
//thisel,pel,
	if(!node.watchs  )return;
	//<input type=text bind=xxx />
	//< watch-a-b='cc(12)-to-s'> 监控a.b数据变化 调用 cc函数 返回值 赋给 el.s
	//< watch-a-b-watch-c-d='cc(12)-to-s'> 监控 a.b , c.d 数据变化
	//<a>aa{bb},ss{ddd}</a> 作为一个表达式监控 到 to-text
	//console.log('计算 监控对象=','scope.path='+scope.path,'scope.alias='+scope.alias,where,node.watchs,vm.id);
	//node.id已经计算过了
	var watchs=node.watchs;
	for (var j = 0,len=watchs.length; j<len; j++){
		var dataname=watchs[j][0];
		var elattr=watchs[j][1];
		if(elattr.indexOf('js:')!==0 && elattr[0]=='{')elattr=core_vm.calexp.exp(vm,elattr,scope);
		//计算过了
		node.id=node.id||core_vm.cal.forece_calnodeid(vm,node,scope,'watch');
		var wopt={
			vm:vm,
			node:node,//node 可以不要 只要 exp_text
			elid:node['id'],
			scope:scope,
			action:'prop',
			$index:scope.$index
		};
		if(node.listid)wopt.listid=node.listid;
		
		var  func,para,toelattr
		if(elattr.indexOf('js:')==0){
			//wopt.watchfunc=  elattr;	
			vm[core_vm.aprand].inline_watchjs.push(elattr.substr(3));
			wopt.watchfunc='inlinejs_watch__'+(vm[core_vm.aprand].inline_watchjs.length-1);
			
			wopt.watchpara=null;
		}else if(elattr.indexOf('-toel-')>0){
			var array=elattr.split('-toel-');
			wopt.toelattr=array[1];
			var tmp=core_vm.tool.parse_func_para(array[0]);
			wopt.watchfunc=  tmp[0];
			wopt.watchpara=  tmp[1];	
		}else if(elattr.substr(0,5)=='toel-'){
			wopt.toelattr=elattr.substr(5);
		}else{				
			var tmp=core_vm.tool.parse_func_para(elattr);
			wopt.watchfunc=  tmp[0];
			wopt.watchpara=  tmp[1];
		}
		var watch_path=core_vm.cal.now_path(scope,dataname,vm,'watch_path');

		//console.log("dataname="+dataname,'watch_path='+watch_path);
		var key=watch_path.substr(watch_path.lastIndexOf('.')+1);

		
		if(watch_path[0]=='[' && watch_path[watch_path.length-1]==']')watch_path=watch_path.substr(1,watch_path.length-2);
		watch_path=watch_path.replace(/\[/g,'.').replace(/\]/g,'');
		if(watch_path[0]=='.')watch_path=watch_path.substr(1);
		
		if(where=='noel'){
			//console.log('noel',wopt,watch_path)
			wopt.elid=-2;
		}
		

		//console.error('监控对象,str='+dataname,'elid='+wopt.elid,'watch_path='+watch_path);//'vmid='+vm.id,'path='+scope.path,'alias='+scope.alias,
		if(watch_path.indexOf('.-1')>-1){
			alert("watch_path.indexOf('.-1')>-1");
			continue;
		}

		var watch_obj=vm.data;
		var if_is_state='data';
		
		if(watch_path.indexOf('this.data.')==0){
			watch_path=watch_path.substr(10);
			watch_obj=vm.data||{};
			if_is_state='data';
		}else	if(watch_path.indexOf('this.state.')==0){
			watch_path=watch_path.substr(11);
			watch_obj=vm.state||{};
			if_is_state='state';
		}else	if(watch_path.indexOf('this.option.')==0){
			watch_path=watch_path.substr(12);
			watch_obj=vm.option||{};
			if_is_state='option';
		}
		var value=core_vm.tool.objGetDeep(watch_obj,watch_path);
		if(!wopt.watchfunc){
			//没有watchfunc 就有 toelattr 就已经被计算过了
			// && wopt.toelattr && node.tag!=='_exptext_'
			
		}else if(wopt.watchfunc){
			if(wopt.node.tag!=='_exptext_'){
				vm.__addto_onshow(function(){
					//console.log('第一次watch.cb',wopt.watchfunc,watch_path,wopt.elid,document.getElementById(wopt.elid))
					core_vm.watchcb.watch(wopt,watch_path,'',value);
				});
			}
		}
	
		//console.log('=================real watch',watch_path,scope.$index)
		
		var watching=vm[core_vm.aprand]['watching_'+if_is_state];
		if(watching){		
			watching[watch_path]=watching[watch_path]||[];
			if(scope.$index!==undefined)check_array_repeat(watching[watch_path],wopt.listid,wopt.$index)
			watching[watch_path].push(wopt);
		}
			
	}
}

exports=module.exports={
	cal:calnode_watch,
}

//<button  each="book in books" title="{book.name}" ></button> 


//watch-sss-watch-xxx=funcname
//watch-sss='toel-style-width' 监控两个属性	
//watch-sss='yyy-to-style-width' 监控两个属性到 dater.yyy返回值到style-width
//watch-sss=xxx(123) 到函数 sss(a,el) a=123



/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

var core_vm=__webpack_require__(0);

module.exports.watch=function(wopt,path,oldv,newv){
	//传递el还是el.id
	//传递el 当el被删除时 需要递归到doc才能最终确定 因为el.parent也可能被删除
	//mod 需要设计一个类似 document.getElementById(wopt.elid)
	//vm。getel 需要倒推判断 el.getParent().children.indexOf(el)是否为-1 如果是说明被清理 需要设为null
	//console.error("_watch_cb",this,'wopt.elid='+wopt.elid,'path='+path,'oldv=',oldv,'newv=',newv,'action='+wopt.action,'toelattr='+wopt.toelattr);//
	if(typeof (wopt)!=='object'){
		return;
	}
	

	//console.log('变了,path='+path,'oripath='+wopt.oripath,wopt.elid,oldv,newv,wopt.vm.id);
	//'scope.aid='+wopt.scope.aid,'elid='+wopt.elid,document.getElementById(wopt.elid)
	//'toelattr='+wopt.toelattr,oldv+' --> '+newv'wopt.$sid[0]='+wopt.$sid[0],wopt.$sid
	//console.log('变了,vm.id='+wopt.vm.id,'wopt.scope.$sid='+wopt.scope.$sid);


	var vm=wopt.vm;
	var el;

	if(wopt.el){
		el=wopt.el;//listview计算的新的el
	}else{
		
			el=document.getElementById(wopt.elid);
			if(!el && vm.getapp().config.strategy.not_document_getelbyid && wopt.elid.indexOf('_elid_')==-1){
				el=vm.getel("#"+wopt.elid);				
				//没有el有时原因是注册watch时的node.id=test 后来被改成_elid_112 需要getel一下就可以了
			}
		
		 
	}


	if(!el){
		core_vm.devalert(vm,'no el',wopt.elid,path);
		vm.__delel_watchcb_notfind(wopt.elid);
		return;
	}else{			

		var result=newv,bindtype=wopt.toelattr;
		//console.log('有el',el,'newv='+newv,'bindtype='+bindtype);
		if(!wopt.watchfunc){
			//console.log('是否需要计算呢?',path,wopt)
			wopt.vm.__reset_list_index(wopt);
			if(wopt.node.tag=='_exptext_' || wopt.node.utag=='_exptext_'){
				//web下是tag 直接创建text mob是utag tag被改为label
				result=core_vm.calexp.exp(wopt.vm,wopt.node.exp_text,wopt.scope,'_exptext_');
				//console.log('修改了result',result)
			}else if(wopt.node.attrexp && wopt.node.attrexp[bindtype]){			
				//console.log('复杂表达式 位于内部')
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
				//console.log('计算返回',result)
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
		//console.log('有el',el,'result='+result,'bindtype='+bindtype);

		if(bindtype && result!==undefined){
			//不需要 需要手动介入的直接到一个函数就可以了
			//console.log('可以修改dom,newv=',result)
			//if(vm.beforeElAutoUpdate.call(vm,{el:el,type:bindtype,newv:result,datapath:path})!==false)
			vm.batchdom(function(){
				//console.log('real')
				core_vm.watchcb.setweb(el,bindtype,result,wopt,path);
			});
		}
	}

}

module.exports.setweb=function(el,bindtype,newv,wopt,path){
	//console.log('cb bind web', 'bindtype='+bindtype,newv);
	

	if(bindtype=='html')bindtype='innerHTML';
	else if(bindtype=='class')bindtype='className';

	//console.error("数据变化引发 setweb",el,bindtype,newv,typeof (newv));
	if(core_vm.isfn(core_vm.wap.__cache.use.dataevent[bindtype])){
		core_vm.wap.__cache.use.dataevent[bindtype](el,newv,wopt,path);
	}else	if(bindtype=='innerHTML' || bindtype=='html'){
		el.innerHTML=newv;
	}else if(bindtype=='text'){
		if(el.textContent !=undefined)el.textContent=newv;
		else if(el.text !=undefined)el.text=newv;//mob		
		else if(el.innerText !=undefined)el.innerText=newv;
		//console.log(el.textContent,el.text,el.innerText)
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
	//http://www.jianshu.com/p/rRssiL JavaScript中的property和attribute的区别
}




/***/ }),
/* 28 */
/***/ (function(module, exports) {

//https://github.com/jfriend00/docReady/blob/master/docready.js
var readyList = [];
var readyFired = false;
var readyEventHandlersInstalled = false;
var ready=function () {
	if (!readyFired) {
		readyFired = true;
		for (var i = 0; i < readyList.length; i++) {
			readyList[i].fn.call(window, readyList[i].ctx);
		}
		readyList = [];
	}
}    
var readyStateChange=function () {
	if ( document.readyState === "complete" ) {
		ready();
	}
}
module.exports.docReady = function(callback, context) {
	if (readyFired) {
		setTimeout(function() {callback(context);}, 1);
		return;
	} else {
		readyList.push({fn: callback, ctx: context});
	}
	if (document.readyState === "complete" || (!document.attachEvent && document.readyState === "interactive")) {
		setTimeout(ready, 1);
	} else if (!readyEventHandlersInstalled) {
		if (document.addEventListener) {
			document.addEventListener("DOMContentLoaded", ready, false);
			window.addEventListener("load", ready, false);
		} else {
			document.attachEvent("onreadystatechange", readyStateChange);
			window.attachEvent("onload", ready);
		}
		readyEventHandlersInstalled = true;
	}
}



//把web的 config文件 及其 配置系统 转到 mob

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

var core_vm=__webpack_require__(0);
var g_classid=1;//全局的 多个vm一起的
module.exports.add=function(vm,text){
	//console.log("私有 add_private_style",vm.absrc,text);
	var id=vm.sid;
	//console.log("add_private_style id="+id);
	var css=vm[core_vm.aprand].private_style;

	text=text.replace(/\.\s{0,}([-\w]+){/g,function(a,b,c){ 
		css[b]=css[b]||'priv_'+(g_classid++);
		return '.'+css[b]+'{';
	});
	text=text.replace(/\.\s{0,}([-\w]+)\s{1,}/g,function(a,b,c){ 
		css[b]=css[b]||'priv_'+(g_classid++);
		return '.'+css[b]+' ';
	});
	//console.log('css.add',id,text)
	//mob 不支持私有 style对每个页面起作用
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
	//console.log('css.get',id,css,name,css[name])
	if(!css)return '';
	return css[name] || '';
}

module.exports.check=function(vm,node){
	//console.log("use_private_style vm.absrc="+vm.absrc,node.attr);
	var css=vm[core_vm.aprand].private_style;
	if(!css)return;
	node.classList.forEach(function(name,i){
		if(css[name]){
			node.classList[i]=css[name];
		}
	})
}

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

var core_vm=__webpack_require__(0);
core_vm.aprand='vm'+(new Date()).getTime().toString();

	
core_vm.define=__webpack_require__(13);

//core_vm.hook=require('../corevm/vm.hook.js');
core_vm.load=__webpack_require__(19),

core_vm.extend=__webpack_require__(16);
core_vm.start=__webpack_require__(24);
core_vm.elhook=__webpack_require__(14);

core_vm.inject=__webpack_require__(17);

core_vm.calhtmltojson=__webpack_require__(8); 
core_vm.cal = __webpack_require__(6);
core_vm.calexp=__webpack_require__(7);
core_vm.calif=__webpack_require__(9);
//core_vm.calblock=require('../corevm/vm.calblockwrapper.js');

//core_vm.watchlib=require('../corevm/vm.watchlib.js');
core_vm.watchcal=__webpack_require__(26);
core_vm.watchcb=__webpack_require__(27);

core_vm.create=__webpack_require__(10);
core_vm.createcommon=__webpack_require__(12);
core_vm.createvm=__webpack_require__(52);
core_vm.createblock=__webpack_require__(11);

core_vm.list=__webpack_require__(18);
//core_vm.listholder=require('../corevm/vm.listholder.js');

core_vm.eventdom=__webpack_require__(15);

core_vm.tool=__webpack_require__(25);
core_vm.require=__webpack_require__(20);




core_vm.rootvmset=__webpack_require__(21);
core_vm.rootvmstart=__webpack_require__(22);
core_vm.web=__webpack_require__(23);
core_vm.webdocready=__webpack_require__(28);


//core_vm.route=require('../corevm/mob/vm.web_route.js');
core_vm.web_private_style=__webpack_require__(29);

//core_vm.web_eventdom=require('../corevm/mob/vm.web_eventdom.js');
//core_vm.web_create=require('../corevm/mob/vm.web_create.js');
__webpack_require__(3);

core_vm.cacheclass=__webpack_require__(5);
core_vm.appclass=__webpack_require__(4);
core_vm.wap=new core_vm.appclass();
core_vm.wap.id='ly';
core_vm.wap.__cache=new core_vm.cacheclass();
core_vm.wap.blankvm=core_vm.define.define({id:'_blankforapp_'});
core_vm.wap.blankvm.__define({name:'_blank_'});

//core_vm.gcache=new core_vm.cacheclass();
Object.defineProperty(core_vm.wap,'blankvm',{enumerable:false});


module.exports={
	//core_vm:core_vm,
	vmix:{
		email:'peterli888@gmail.com',
		//是不是暴露一个app
	},
}
core_vm.webdocready.docReady(core_vm.web.start_system);


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {


var core_vm=__webpack_require__(0);
module.exports.setproto=function(proto){


proto.loadfilefresh_clear=function(id){
	//这个id=absrc
	if(this.vmlib[id]){
		//console.log('loadfilefresh_clear 发现vmlib');
		delete this.vmlib[id];
		delete this.vmbody[id];
		delete this.vmstyle[id];
	}
	if(this.jslib[id]){
		//console.log('loadfilefresh_clear 发现jslib');
		delete this.jslib[id];
	}

}
//vm.cache的位置
//cache.vmsbysid,pvm.vmchildren[id]=tvm.sid,
//nap.nowpage,nap.topvm[method_url]=vm;	nap.gvm[type]=vm;
//uap.hookstart_ing_vm

proto.removesid=function(sid){
	//console.error('cache.removesid',sid)
	delete this.vmsbysid[sid];
	delete this.vmparent[sid];//todo 这个没什么用
	for(var csid in this.vmparent){
		if(this.vmparent[csid]==sid){
			delete this.vmparent[csid];
			this.removesid(csid);//清理下面的
		}
	}
}
proto.keep=function(type,id){
	//加一个-1进去
	if(type=='vm' && this.vmlib[id])this.vmlib[id].inpath=1;
	if(type=='lib' && this.jslib[id])this.jslib[id].inpath=1;
}
proto.delete=function(mod,id){
	if(mod && mod[id] &&mod[id].refsids.length==0 &&!mod[id].inpath)delete mod[id];

}
proto.clean_when_vm_clean=function(vm){
	//console.error('clean_when_vm_clean',vm.absrc,vm.sid)
	//console.error('vmlib',	this.vmlib[vm.absrc].refsids);
	//根据sid clean cache记录
	//根据absrc清理 body,style,lib import
	//主要是 web的removechild,close
	//mob的 closepage, freshpage不过来

	this.removesid(vm.sid);

	//this.vmlib[id].refsids
	//removechild时 清理掉了 todo
	var absrc=vm.absrc;
	var absrcid=vm[core_vm.aprand].absrcid;
	if(!this.vmlib[absrc]||this.vmlib[absrc].inpath==1){	
		//console.log('close不清理 找不到vmlib',absrc)
		return;
	}
	var sameurl=0;
	for(var i in this.vmsbysid){
		if(this.vmsbysid[i][core_vm.aprand].has_started==0)continue;
		if(this.vmsbysid[i][core_vm.aprand].absrcid===vm[core_vm.aprand].absrcid)sameurl++;
	}
	if(sameurl>0){
		//console.log('vm不清理 剩余的还有absrc相同',absrc,this.vmlib[absrc]);

		return;
	}		
	//console.error('相同url都close了',this.vmlib[absrc].refsids)
	//remove或者更换src时清除
	//判断 use的vm不清理,path.vm不清理 
	//import的都清理	
	delete this.vmbody[absrc];
	delete this.vmstyle[absrc];
	delete this.vmlib[absrc];
	this.clean_import(absrcid);
	//__extend_from 的没有清理 并且没有sid

	//下面是全局清理
	for(var k in this.vmlib){
		var mod=this.vmlib[k];
		if(mod && Array.isArray(mod.refsids)){
			var index=mod.refsids.indexOf(absrcid);
			if(index>-1){
				mod.refsids.splice(index,1);
				this.delete(this.vmlib,k);
			}
		}
	}
	for(var k in this.jslib){
		var mod=this.jslib[k];
		if(mod && Array.isArray(mod.refsids)){
			var index=mod.refsids.indexOf(absrcid);
			if(index>-1){
				mod.refsids.splice(index,1);
				this.delete(this.jslib,k);
			}			
		}
	}
}	

}

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

var core_vm=__webpack_require__(0);
module.exports.setproto=function(proto){


proto.add_import_src_when_cal=function(type,urlsid,name,src){
	var a=urlsid+':'+name;
	if(type=='vm')	this.import_src_vm[a]=src;
	if(type=='block')this.import_src_block[a]=src;
	if(type=='lib'||type=='json')	this.import_src_lib[a]=src;

}
proto.check_if_import=function(type,urlsid,name){
	var a=urlsid+':'+name;
	if(type=='vm')	return this.import_src_vm[a]||'';
	if(type=='block')return this.import_src_block[a]||'';
	if(type=='lib'||type=='json')	return this.import_src_lib[a]||'';
}
proto.clean_import=function(absrcid){
	//	console.log('清除styletext',this.import_src_vm,this.vmlib)

	//console.log('看看',absrcid,this.import_src_block,this.importblock)
	for(var k in this.import_src_block){
		if(k.indexOf(absrcid+':')==0){
			var b_absrc=this.import_src_block[k];
			var styleobj=this.importblock[b_absrc];
			if(styleobj && styleobj.refsids){
				var index=styleobj.refsids.indexOf(absrcid);
				if(index>-1)styleobj.refsids.splice(index,1);
				this.delete(this.importblock,b_absrc);

			}
			delete this.import_src_block[k];
		}
	}
	for(var k in this.import_src_lib){
		if(k.indexOf(absrcid+':')==0){
			var b_absrc=this.import_src_lib[k];
			var styleobj=this.jslib[b_absrc];
			if(styleobj && styleobj.refsids){
				var index=styleobj.refsids.indexOf(absrcid);
				if(index>-1)styleobj.refsids.splice(index,1);
				this.delete(this.jslib,b_absrc);

			}
			delete this.import_src_lib[k];
		}
	}

	//console.log('清除styletext',this.import_src_vm)
	for(var k in this.import_src_vm)   {
		if(k.indexOf(absrcid+':')==0){
			for(var i in this.vmsbysid){
				if(this.vmsbysid[i].absrc===this.import_src_vm[k]){
					var vmod=this.vmlib[this.import_src_vm[k]];
					if(vmod && vmod.refsids){
						var index=vmod.refsids.indexOf(absrcid);
						if(index>-1){
							vmod.refsids.splice(index,1);
							this.clean_when_vm_clean(this.vmsbysid[i]);
						}
					}
					break;
				}
			}
			this.delete(this.import_src_vm,k);
			//vm自己会清理
		}
	}
	for(var k in this.importstyle){
		if(this.importstyle[k].refsids){
			var index=this.importstyle[k].refsids.indexOf(absrcid);
			if(index>-1)this.importstyle[k].refsids.splice(index,1);			
			this.delete(this.importstyle,k);
		}
		//todo 从document.style 删除
	}

}
}

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {


var core_vm=__webpack_require__(0);
module.exports.setproto=function(proto){


proto.add_jslib=function(id,mod,refsid){
	//console.log('add_jslib',id,refsid)
	//use define
	this.jslib[id]=mod;
	if(refsid)mod.refsids=[refsid];
	var path=this.getapp().config.path;
	for(var k in path.lib){
		if(path.lib[k]===id)this.keep('lib',id);
	}
}

proto.get_jslib=function(id){
	return this.jslib[id];
}
}

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {


var core_vm=__webpack_require__(0);
module.exports.setproto=function(proto){

proto.add_vmlib=function(id,mod,refsid){
	//console.log('add_vmlib',id,refsid,this.vmlib[id]?'有':'没有')
	mod.refsids=[refsid];
	this.vmlib[id] = mod;
	var path=this.getapp().config.path;
	for(var k in path.vm){
		if(path.vm[k]===id){
			this.keep('vm',id);
		}
	}
}
proto.add_vmbody=function(id,body,when){
	//console.log('newvmbody',absrc,when)
	this.vmbody[id]=body+'';
}		
proto.add_vmstyle_inline=function(id,style_str){
	this.vmstyle[id]=core_vm.tool.trim(style_str);
}
proto.get_vmlib=function(id){
	return this.vmlib[id];
}
proto.get_body_extend=function(absrc){
	return this.vmbody[absrc]||'';
}
proto.get_body=function(vm){ 
	return this.vmbody[vm.absrc]+'';
}

proto.get_vmstyle_extend=function(absrc){
	return this.vmstyle[absrc]||'';
}
proto.get_vmstyle=function(vm){
	var text=this.vmstyle[vm.absrc]||'';
	text+=this.__get_importstyle(vm);
	return text;
}


}

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

var core_vm=__webpack_require__(0);

var debug = 1 ? console.log.bind(console, '[fastdom]') : function() {};

var win=window;
var raf = function(cb) {
	  //console.log('16毫秒')
	  return setTimeout(cb, 16); 
};


var reads=[];
var writes=[];
var scheduled=false;
function runTasks(tasks) {
  //debug('run tasks');
  var task; while (task = tasks.shift()) task();
}

function flush() {
  //debug('flush');
  var error;
  try {
    //debug('flushing reads', reads.length);
    runTasks(reads);
    //debug('flushing writes', writes.length);
    runTasks(writes);
  } catch (e) { error = e; }

  scheduled = false;
  //不是等16ms 也不是16ms执行不完就停下来

  // If the batch errored we may still have tasks queued
  if (reads.length || writes.length) scheduleFlush();

  if (error) {
    debug('task errored', error.message);
    //if (fastdom.catch) fastdom.catch(error);
    //else throw error;
  }
}
var measure=function(fn, ctx) {
    //debug('measure');
    var task = !ctx ? fn : fn.bind(ctx);
    reads.push(task);
    scheduleFlush();
    return task;
  }

var mutate =function(fn, ctx) {
    //debug('mutate');
    var task = !ctx ? fn : fn.bind(ctx);
    writes.push(task);
    scheduleFlush();
    return task;
  }


function scheduleFlush() {
  if (!scheduled) {
    scheduled = true;
    raf(flush);//16ms后执行或者win调用
    //debug('flush scheduled');
  }
}


module.exports={
	get:measure,
	set:mutate,
}

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

var core_vm=__webpack_require__(0);
module.exports.setproto=function(proto){



proto.cleanList=function(p){
	if(Array.isArray(this[core_vm.aprand].watching_list[p])){
		var listdata=this.__getData(p);	
		this[core_vm.aprand].watching_list[p].forEach(function(l_opt){
			core_vm.list.$clean.call(listdata,l_opt);	
		});
	}
}
proto.rebuildList=function(p){
	if(Array.isArray(this[core_vm.aprand].watching_list[p])){
		var listdata=this.__getData(p);	
		this[core_vm.aprand].watching_list[p].forEach(function(l_opt){
			core_vm.list.$rebuild.call(listdata,l_opt);	
		});
	}		
	//Object.defineProperty(listdata,'$update',	{writable:false, enumerable: false, configurable: true});
}
proto.__blankfn=function(){}
proto.__getrandobj=function(){return this[core_vm.aprand]}

proto.__reset_list_index=function(wopt){
	//list.watchcb._exptext_ <a>{www}</a>用到 重要 暂时放到这里
	//标签内的需要自己设计$index
	//只有watchcb用到 
	if(wopt.$index!==undefined && wopt.scope && wopt.scope.$index!==undefined) wopt.scope.$index= wopt.$index;

}
proto.getClassName=function(name){
	return	core_vm.web_private_style.get(this,name);
}
proto.hasSlot=function(name){
	return this[core_vm.aprand].pvmslot[name]?true:false;
}
proto.__ensure_fn=function(){

	
}
}

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

var core_vm=__webpack_require__(0);
module.exports.setproto=function(proto){

proto.hasChild=function(id){	
	if(this[core_vm.aprand].vmchildren[id+''])return true;
	else return false;
}
proto.getChild=function(id){
	if(this[core_vm.aprand].vmchildren[id]){
		return this.getcache().vmsbysid[this[core_vm.aprand].vmchildren[id]];
	}else if(id.indexOf('.')>-1){
		var tvm=this;
		var parts = ~id.indexOf('.') ? id.split('.') : [id];
		for (var i = 0; i < parts.length; i++){
			tvm = tvm.getcache().vmsbysid[tvm[core_vm.aprand].vmchildren[parts[i]]]
			if(tvm===undefined)break;
		}
		return tvm;	
	}
}
proto.getParent=function(){
	return this.pvm;
}

proto.removeChild=function(id){
	var cvm;
	if(id instanceof core_vm.define.vmclass && this.sid===id.pvm.sid){
		if (this[core_vm.aprand].vmchildren[id.id] && this[core_vm.aprand].vmchildren[id.id]==id.sid){
			let realid=id.id;
			cvm=id;
			id=realid;
		}
	}
	else if(core_vm.isstr(id))cvm=this.getChild(id);

	if(cvm){
		cvm.__vmclose(true);		
		cvm.getcache().removesid(cvm.sid);
		delete this[core_vm.aprand].vmchildren[id];
	}
}
proto.appendChild=function(opt,pnode,ifpnode){
	//opt={id,el,src}
	if(!opt.id || this.hasChild(opt.id)){
		core_vm.devalert(this,'loadsub 缺少id或者重复',opt.id)
		return;
	}
	if(!opt.el)return;
	
	if(!core_vm.isfn(opt.el.appendChild))return;
	if(!opt.src ){
		if(opt.path)opt.src=this.getapp().config.path.vm[opt.path];
		else if(opt.tagname)opt.src=opt.tagname;//use的

	}
	if(!opt.src){
		//可能的 延迟加载的 console.error('没有src',opt)
	}
	
	var cvm=core_vm.define.define({pvm:this,el:opt.el,id:opt.id,src:opt.src});	
	if(ifpnode==1){
		if(pnode && pnode.tag){
			core_vm.inject.cal_inject_node(cvm,pnode);
			cvm[core_vm.aprand].pvmevent=pnode.vmevent||{};
			cvm[core_vm.aprand].pvmelevent=pnode.event||{};//ppel时有用 
			cvm[core_vm.aprand].pvmnode=pnode;//先有node 再解析 data-option	
			if(pnode.attr.autostart!=false){
				//console.log('这里loadsub')
				cvm._is_fresh_ing=this._is_fresh_ing;
				core_vm.load(cvm);
			}
		}
	}else if(opt){
//只有 append调用 解析node时直接存入__append_data了
		//console.log('__inject_for_me',json)
		//append start 时可以注入data-option	
		var children=(cvm[core_vm.aprand].pvmnode)?cvm[core_vm.aprand].pvmnode.childNodes:[];
		//收到append 原来的data被清理
		
		if(core_vm.isobj(opt.event)){
			cvm[core_vm.aprand].pvmevent=opt.event
		}
		if(core_vm.isobj(opt.data)){
			core_vm.tool.deepmerge(cvm[core_vm.aprand].append_data,opt.data);
			for(var k in opt.data){
				if(cvm[core_vm.aprand].datafrom_parent.indexOf(k)===-1){
					//console.log('插入一个 奇怪',k)
					cvm[core_vm.aprand].datafrom_parent.push(k);
				}
			}
			for(var i=children.length-1;i>-1;i--){
				if(children[i].tag=='data')children.splice(i,1)
			}
		}
		if(core_vm.isobj(opt.option)){
			core_vm.tool.deepmerge(cvm[core_vm.aprand].append_option,opt.option);
			for(var i =children.length-1;i>-1;i--){
				if(children[i].tag=='option')children.splice(i,1)
			}
		}
		return cvm;
	}

}






}

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

var core_vm=__webpack_require__(0);
module.exports.setproto=function(proto){

proto.__addto_onclose=function(cb){
	this[core_vm.aprand].cbs_onclose.push(cb);
}

proto.__vmclose=function(ifclean,iffresh){
//isfresh 取消了 全部清除
	//console.error("vm销毁,this.id=",this.id,'this.absrc='+this.absrc);
	if(!this[core_vm.aprand].has_started){
		return;
	}
	
	//ifclean时 要从 cache.vmbysid清理,pvm.chldren清理 资源清理
	var vm=this; 
	this[core_vm.aprand].has_started=0;

	for(var k in this[core_vm.aprand].cbs_onclose){
		this[core_vm.aprand].cbs_onclose[k].call(this);//都是内部函数
	}
	
	var vmpel=vm.pel;vmpel.setAttribute('bindsidofvm',0);vmpel.setAttribute('isvmpel',false); 
	//后面可能还会再startvmpel.setAttribute(this.getapp().config.vmtag+'-src','');
	//isvmpel 应该可以清理掉 2017-10-1 todo 不要清理 isvmpel
	var mypvm=this.pvm;	
	if(mypvm){
		core_vm.tryvmfn(mypvm,this,'beforechildclose');
		if(ifclean)delete mypvm[core_vm.aprand].vmchildren[this.id];
	}
	core_vm.tryvmfn(vm,null,'beforeclose');

	let vmchildren=vm[core_vm.aprand].vmchildren;
	if(vmchildren){	
		for(var k in vmchildren){
			vm.getcache().vmsbysid[vmchildren[k]].__vmclose(iffresh ?true:ifclean,iffresh);
			//fresh是chlid要清理掉,因为loadsub要新建
			delete vmchildren[k];
		}
	}
	this.__unbindall();
	if('ppel'!==vm.config.appendto){
		//几个因素 下级有ppel,一个el下 append了多个vm vm.close时不能清除vm.pel
		//console.log('close.无ppel',this.id);//,vm[core_vm.aprand].els,vm.pel.childNodes
		//这时候 els中有的元素是下级vm=ppel时 替换的 ,所有ppel的topel只能一个 需要清除所有child
		
			var els=vm[core_vm.aprand].els;
			for(var i=els.length-1;i>-1;i--){
				if(els[i].parentNode===vm.pel){
					vm.pel.removeChild(els[i]);
				}else {
					if(els[i].replaced_pel && els[i].replaced_pel.parentNode){
						els[i].replaced_pel.parentNode.removeChild(els[i].replaced_pel)
					}
					if(els[i].parentNode){
						els[i].parentNode.removeChild(els[i]);
					}
				}
			}			
			//console.error('close.无ppel,pel剩余',vm.pel.childNodes.length);
		
		
	}else{
		//web.ppel是vm[core_vm.aprand].els[0].parentNode 因为插入时可能是#document-fragment 需要 onshow才知道
		//mob.ppel 插入时就知道是谁
		//console.log('close.有ppel',this.id,vm[core_vm.aprand].els)
		var ppel=vm.ppel;
		var pel=vm.pel;
		if(ppel && pel){
			ppel.replaceChild(pel,vm[core_vm.aprand].els[0]);
			
		}
	}
	vm.__top_fragment=null;
	if(ifclean){
		if(vm.pel)vm.pel=null;
		vm.pel=null;
	}


	
	core_vm.tryvmfn(vm,null,'onclose');
	if(mypvm)core_vm.tryvmfn(mypvm,this,'onchildclose');

		
	var curStyle=document.getElementById("_privatestyle_"+vm.sid);
	if(curStyle)document.getElementsByTagName("head")[0].removeChild(curStyle);	
	

	//更多的全局注销
	//马上注销 还是延时 延时可以利用缓存 需要加一个 closetime 如果又打开了 但是延时clean 造成混乱 必须马上

	vm.__init(true);
	if(ifclean)vm.clean('vmclose'); //比如刷新时是下载了新文件再vmclose的这时候clean会clean掉新的内容
	this[core_vm.aprand].has_started=0;
	this[core_vm.aprand].has_defined=0;
}
//close 并没有 从全局清理 再start时 sid不变
//clean用于 mob 的 返回按钮时 page的清理 web需要自己控制是否清理

//用户可以自己清理内存占用 如 css
proto.clean=function(type){
	//console.log('vm.clean',type)
	if(this[core_vm.aprand].has_started==0 && this[core_vm.aprand].has_defined==0){
		this.getcache().clean_when_vm_clean(this);
	}
	//还是应该用vm自己的app 用appnow 在多个app切换时出错 2018-03-22
}
//close时移除style 需要把 style加在一个vmsid

proto.close=proto.__vmclose;

}

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

var core_vm=__webpack_require__(0);

module.exports.setproto=function(proto){


proto.setChildData=function(cvmid,p,v,cb){
	//console.log('setChildData',cvmid,p,v)
	var vm=this;
	if(!core_vm.isfn(cb))cb=this.__blankfn;
	if(typeof (cvmid)=='object')cvmid=cvmid.id;
	var cvm=this.getChild(cvmid);
	if(!cvm){
		cb(false);
		return;
	}
	if(!cvm[core_vm.aprand].has_started){	
		core_vm.tool.objSetDeep(cvm[core_vm.aprand].append_data,p,v,true);
		var path=p.split('.')[0];
		if(cvm[core_vm.aprand].datafrom_parent.indexOf(path)===-1){
			cvm[core_vm.aprand].datafrom_parent.push(path);
		}
		return;
	}
	var oldv=cvm.__getData(p);
	if(oldv===v){
		cb(false);
		return;
	}
	var fp=p.split('.')[0];
	if(cvm[core_vm.aprand].datafrom_parent.indexOf(fp)==-1){	
		cb(false,'datasource not match');
		return;
	}
	cvm.__confirm_set_data_to_el(cvm,p,v,oldv);
	cb(true,null);
	
	var fn=cvm.event['pvm.setdata'];
	if(core_vm.isfn(fn))fn.call(cvm,{path:p,oldv:oldv,newv:v})


}

proto.addChildData=function(cvmid,p,index,v,cb){	
	var vm=this;
	if(!core_vm.isfn(cb))cb=this.__blankfn;
	if(typeof (cvmid)=='object')cvmid=cvmid.id;
	var cvm=this.getChild(cvmid);
	if(!cvm){
		cb(false);
		return;
	}
	var fp=p.split('.')[0];
	if(cvm[core_vm.aprand].datafrom_parent.indexOf(fp)==-1){
		cb(false,'datasource not match');
		return;
	}
	cvm.__confirm_add_data_to_el(cvm,p,index,v,function(res){
		cb(res);
	});
	var fn=cvm.event['pvm.adddata'];
	if(core_vm.isfn(fn))fn.call(cvm,{path:p,index:index,value:v});

}
proto.delChildData=function(cvmid,p,index,count,cb){	
	var vm=this;
	if(!core_vm.isfn(cb))cb=this.__blankfn;
	if(typeof (cvmid)=='object')cvmid=cvmid.id;
	var cvm=this.getChild(cvmid);
	if(!cvm){
		cb(false);
		return;
	}
	var fp=p.split('.')[0];
	if(cvm[core_vm.aprand].datafrom_parent.indexOf(fp)==-1){	
		cb(false,'datasource not match');
		return;
	}
	cvm.__confirm_del_data_to_el(cvm,p,index,count,function(res){
		cb(res);
	});
	var fn=cvm.event['pvm.deldata'];
	if(core_vm.isfn(fn))fn.call(cvm,{path:p,index:index,count:count});

}
}

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

var core_vm=__webpack_require__(0);

module.exports.setproto=function(proto){

proto.__setData=function(p,v){
	core_vm.tool.objSetDeep(this.data,p,v)
}
proto.__getData=function(p){
	return core_vm.tool.objGetDeep(this.data,p)
}


var blank=function(){}

var check_source=function(vm,p){
	var fp=p.split('.')[0];
	if(vm[core_vm.aprand].datafrom_parent.indexOf(fp)>-1)return 'parent';
	if(vm[core_vm.aprand].datafrom_store.indexOf(fp)>-1)return 'store';
	return 'self';
}



proto.__autobind_setData=function(p,v,oldv){	
	this.setData(p,v);
}


proto.getData=function(p,cb){

	if(!p || !core_vm.isfn(cb))return;

	var vm=this;
	var source=check_source(vm,p);
	if(source=='self'){		
		cb(null,null,source);
	}else if(source=='store'){
		vm.getapp().store.get.call(vm.getapp(),vm,p,function(data,opt){
			cb(data,opt,source);	
		});	
	}else if(source=='parent'){
		var pcb=vm.pvm.dataProxy;
		if(pcb)pcb=pcb.get;
		if(core_vm.isfn(pcb)){
			pcb.call(vm.pvm,vm,p,function(data,opt){
				cb(data,opt,source);	
			})
		}else{
			cb(null)
		}
	}
}
proto.setData=function(p,v,cb){

	//console.log('setdata',p,v)
	var vm=this;
	if(!core_vm.isfn(cb))cb=vm.__blankfn;
	if(!p||v==undefined)return cb(false);
	var oldv=vm.__getData(p);
	if(oldv===v)return cb(false);

	var source=check_source(vm,p);
	if(source=='self'){		
		vm.__confirm_set_data_to_el(vm,p,v,oldv,cb);
		cb(true,null,source);
	}else if(source=='store'){
		vm.getapp().store.set.call(vm.getapp(),vm,p,v,function(res,opt){
			if(res)vm.__confirm_set_data_to_el(vm,p,v,oldv,cb);
			cb(res,opt,source);
		});	
	}else if(source=='parent'){
		var pcb=vm.pvm.dataProxy;
		if(pcb)pcb=pcb.set;
		if(core_vm.isfn(pcb)){
			pcb.call(vm.pvm,vm,p,v,function(res,opt){			
				if(res)vm.__confirm_set_data_to_el(vm,p,v,oldv,cb);
				cb(res,opt,source);	
			})
		}else{
			cb(false,null,source)
		}
	}else{
		cb(false,'datasource not match',source)
	}
}
proto.addData=function(p,index,v,cb){	
	var vm=this;
	if(!core_vm.isfn(cb))cb=vm.__blankfn;	
	if(!p||v==undefined)return cb(false);
	

	var source=check_source(vm,p);
	//console.log('adddata',source,p,index,v)

	if(source=='self'){
		vm.__confirm_add_data_to_el(vm,p,index,v,cb);
	}else if(source=='store'){
		vm.getapp().store.add.call(vm.getapp(),vm,p,index,v,function(res,opt){
			if(res)vm.__confirm_add_data_to_el(vm,p,index,v,cb);
			else cb(res,opt,source);
		});
	}else if(source=='parent'){
		var pcb=vm.pvm.dataProxy;
		if(pcb)pcb=pcb.add;
		if(core_vm.isfn(pcb)){
			pcb.call(vm.pvm,vm,p,index,v,function(res,opt){			
				if(res)vm.__confirm_add_data_to_el(vm,p,index,v,cb);
				else cb(res,opt,source);	
			})
		}else{
			cb(false,null,source)
		}
	}else{
		cb(false,'datasource not match',source);
	}
}
proto.delData=function(p,index,count,cb){
	//console.log('delData',p,index,count)
	var vm=this;
	if(!core_vm.isfn(cb))cb=vm.__blankfn;
	if(!p)return cb(false);
	if(parseInt(index)!==index)return;
	if(!count)count=1;

	var source=check_source(vm,p);
	
	if(source=='self'){
		vm.__confirm_del_data_to_el(vm,p,index,count,cb);
	}else if(source=='store'){
		vm.getapp().store.del.call(vm.getapp(),vm,p,index,count,function(res,opt){
			if(res)vm.__confirm_del_data_to_el(vm,p,index,count,cb)
			else cb(res,opt,source);
		});
	}else if(source=='parent'){
		var pcb=vm.pvm.dataProxy;
		if(pcb)pcb=pcb.del;
		if(core_vm.isfn(pcb)){
			pcb.call(vm.pvm,vm,p,index,count,function(res,opt){			
				if(res)vm.__confirm_del_data_to_el(vm,p,index,count,cb);
				else cb(res,opt,source);	
			})
		}else{
			cb(false,null,source)
		}
	}else{
		cb(false,'datasource not match',source)
	}
}


}

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

var core_vm=__webpack_require__(0);
module.exports.setproto=function(proto){


proto.setChildOption=function(cvmid,p,v,cb){
	var vm=this;
	if(!core_vm.isfn(cb))cb=this.__blankfn;
	//console.log('setChildOption',cvmid,p,v)
	var cvm=this.getChild(cvmid);
	if(!cvm)return cb(false);
	
	if(!cvm[core_vm.aprand].has_started){	
		core_vm.tool.objSetDeep(cvm[core_vm.aprand].append_option,p,v,true);
		return;
	}

	//console.log('cvm[core_vm.aprand].watching_option',cvm[core_vm.aprand].watching_option)
	var oldv=core_vm.tool.objGetDeep(cvm.option,p);	
	if(oldv===v)return cb(false);
	var obj=cvm[core_vm.aprand].watching_option[p];

	if(Array.isArray(obj)){
		//console.log('多个属性',obj.length)
		obj.forEach(function(opt){
			//console.log('属性',v,opt)
			core_vm.tool.objSetDeep(cvm.option,p,v);
			core_vm.watchcb.watch(opt,p,oldv,v)
		})
		
		var fn=cvm.event['pvm.setoption'];
		if(core_vm.isfn(fn))fn.call(cvm,{path:p,newv:v,oldv:oldv});


	}else{
		cb(false);		
	}
}

}

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

var core_vm=__webpack_require__(0);
module.exports.setproto=function(proto){

var __real_setState=function(vm,p,v,oldv){
	core_vm.tool.objSetDeep(vm.state,p,v);
	var s=vm[core_vm.aprand].watching_state[p];
	if(Array.isArray(s)){
		var len=s.length;
		s.forEach(function(opt,i){
			core_vm.watchcb.watch(opt,p,oldv,v);
		})
	}
}
proto.setState=function(p,v,cb){

	//console.log('setState',p,v,this[core_vm.aprand].watching_state)
	var vm=this;
	var oldv=core_vm.tool.objGetDeep(this.state,p);
	if(p===undefined)return;
	if(oldv===v)return ;
	__real_setState(this,p,v,oldv);
	
	if(!core_vm.isfn(cb))cb=this.__blankfn;
	this.pubup('state',{path:p,newv:v,oldv:oldv,},cb);

}
proto.__autobind_setstate=function(p,v,oldv){
	this.setState(p,v);
}
//proto.setstate=proto.setState;


}

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

var core_vm=__webpack_require__(0);

module.exports.setproto=function(proto){

proto.__confirm_set_data_to_el=function(vm,p,v,oldv){
	//console.log('__confirm_set_data_to_el',vm.id,p,v,oldv)
	if(oldv==undefined) oldv=vm.__getData(p);
	if(oldv===v)return;
	vm.__setData(p,v);
	var ps=p.split('.');
	var len=ps.length;
	if(ps[len-1]==parseInt(ps[len-1])){
		//setData('books.1',{name:11}) 用于原生listview的item修改
		var strp=p.substr(0,p.lastIndexOf('.'));
		
	}

	var __watching_data=vm[core_vm.aprand].watching_data[p]||vm[core_vm.aprand].watching_data['this.data.'+p];
	//console.log(__watching_data.length,Array.isArray(__watching_data));
	if(Array.isArray(__watching_data)){
		//console.log('多个',vm[core_vm.aprand].watching_data.length);
		var ifcheck=false;
		__watching_data.forEach(function(opt,w_sn){
			//console.log('数据改变',p,v,opt.listid);
			if(opt.listid){	
				//必须检查 增删
				//console.log('有listid,可能是数组',opt)
				var ps=p.split('.');
				var listpath='';
				for(var i=0;i<len;i++){
					if(i==0)listpath=ps[0];else listpath+='.'+ps[i];
					//console.log('listpath',listpath)
					if(Array.isArray(vm[core_vm.aprand].watching_list[listpath])){
						break;
					}
				}
				if(listpath==''){
					return;
				}
				var array=vm.__getData(listpath);
				if(!Array.isArray(array)){
					return;
				}
				var index,sid,path;
				for(var i=0;i<len;i++){
					if(parseInt(ps[i])==ps[i]){
						index=parseInt(ps[i]);
						break;
					}
				}
				if(index>-1){
					ps.splice(0,i+1);
					path=ps.join('.');
				}
				//console.log('发现数组,path='+path,'listpath='+listpath,'index='+index);//,'class=_list_'+opt.listid
				opt.el=vm.getel('@'+opt.listid);//特殊设计的
				
				//console.log('el全部',opt.el)
				if(opt.el){
					opt.el=opt.el[index];
					//发现数组 可能已经删除 需要根据class再次寻找
					//console.log('el',opt.el,opt.$index,index)		
					core_vm.watchcb.watch(opt,p,oldv,v);
				}
			}else{
				core_vm.watchcb.watch(opt,p,oldv,v);
			}
		})
	}
}


proto.__confirm_add_data_to_el=function(vm,p,index,v,cb){
	//console.log('__confirm_add_data_to_el')
	var array=vm.__getData(p);
	if(!Array.isArray(array))return cb(false);
	
	index=parseInt(index);
	if(index==-1)index=array.length;

	array.splice(index,0,v);
	//console.log('confirm_add_data',vm[core_vm.aprand].watching_list,vm[core_vm.aprand].watching_nlist);
	var _listing=vm[core_vm.aprand].watching_list[p]||vm[core_vm.aprand].watching_list['this.data.'+p];
	if(Array.isArray(_listing)){
		_listing.forEach(function(opt){
			core_vm.list.$add.call(array,opt,index,v);
		})
	}
	
	cb(true)
}

proto.__confirm_del_data_to_el=function(vm,p,index,count,cb){
	
	var array=vm.__getData(p);
	if(!Array.isArray(array))return cb(false);
	
	index=parseInt(index);
	if(index==-1)index=array.length;

	array.splice(index,count);
	var _listing=vm[core_vm.aprand].watching_list[p]||vm[core_vm.aprand].watching_list['this.data.'+p];
	if(Array.isArray(_listing)){
		_listing.forEach(function(opt){
			core_vm.list.$delat.call(array,opt,index);			
		})
	}
			
	cb(true);
}
}

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

var core_vm=__webpack_require__(0);


module.exports.setproto=function(proto){


function decapitalize(str) {
  str = ""+str;
  return str.charAt(0).toLowerCase() + str.slice(1);
};
var get_child_events=function(node,events){
	var events=events || [];
	if(node.event)for(var k in node.event){
		if(events.indexOf(k)===-1)events.push(decapitalize(k));
	}
	if(node.childNodes)for(var k in node.childNodes)events=get_child_events(node.childNodes[k],events);
	return events;
}

proto.__bind_as_top_view=function(node,el){
	//这里没有isvmpel
	core_vm.elset(el,'bindsidofvm',this.sid);
	
	el._hasbindastop=el._hasbindastop||[];
	var events=get_child_events(node,[]);
	//console.log('__bind_as_top_view',node.utag,events)
	for(var k in events){
		if(el._hasbindastop.indexOf(events[k])==-1){
			el._hasbindastop.push(events[k]);
			this.__bind(el,events[k],core_vm.eventdom.all);
		}
	}
}

proto.__unbindel=function(el){
	var s=this[core_vm.aprand].els_binded;
	var len=s.length;
	for(i=len-1;i>-1;i--){
		if(s[i][0]===el){
			el.removeEventListener(s[i][1],s[i][2]);
			s.splice(i,1);
			break;
		}
	}
}
proto.__unbindall=function(event,el,fn){
	this[core_vm.aprand].els_binded.forEach(function(e){e[0].removeEventListener(e[1],e[2]);});
	this[core_vm.aprand].els_binded=[];
}
proto.__bind=function(el,event,fn,ifdirect){
	if(!el || !core_vm.isfn(fn) ||typeof(event)!=='string' || !el.addEventListener)return;
	if(ifdirect){	
		//console.log('直接绑定函数',event)
		this[core_vm.aprand].els_binded.push([el,event,fn]);
		el.addEventListener(event,fn);
		return
	}
	var vm=this;
	

	
	var velfn=function(e){
		fn.call(e.target,e,vm);
	}
	

	this[core_vm.aprand].els_binded.push([el,event,velfn]);
	el.addEventListener(event,velfn);
}

proto.__bind_events=function(el){
	var domeventnames=this[core_vm.aprand].domeventnames;
	var domeventnames_binded=this[core_vm.aprand].domeventnames_binded;
	//console.log('__bind_events',el?el.id:'',this.id,domeventnames,Object.keys(domeventnames))

	for(var name in domeventnames){
		//console.log('name='+name)
		if(name.indexOf(':')>-1)name=name.substr(0,name.indexOf(':'));//:capture或者:self
		if(domeventnames_binded.indexOf(name)==-1){
			domeventnames_binded.push(name);
			//console.log("准备绑定",el||this.pel);
			if(el){
				this.__bind(el||this.pel,name,core_vm.eventdom.all);
			}else{
				for(var k in this[core_vm.aprand].els)
				this.__bind(this[core_vm.aprand].els[k],name,core_vm.eventdom.all);
			}
			//this.__bind(el||this.pel,name,core_vm.eventdom.all);
		}else{
			//console.log('已经绑定')
		}
	}		

}

}


//浏览器事件
//on(abort|blur|cancel|canplay|canplaythrough|change|click|close|contextmenu|cuechange|
//dblclick|drag|dragend|dragenter|dragleave|dragover|dragstart|drop|durationchange|emptied|ended|
//error|focus|input|invalid|keydown|keypress|keyup|
//load|loadeddata|loadedmetadata|loadstart|
//mousedown|mouseenter|mouseleave|mousemove|mouseout|mouseover|mouseup|mousewheel|
//pause|play|playing|progress|ratechange|reset|resize|scroll|seeked|seeking|select|show|
//stalled|submit|suspend|timeupdate|toggle|volumechange|waiting|autocomplete|autocompleteerror|
//beforecopy|beforecut|beforepaste|copy|cut|paste|search|selectstart|wheel|webkitfullscreenchange|webkitfullscreenerror|
//touchstart|touchmove|touchend|touchcancel|
//pointerdown|pointerup|pointercancel|pointermove|pointerover|pointerout|pointerenter|pointerleave)

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

var core_vm=__webpack_require__(0);


module.exports.setproto=function(proto){

function intersect(arr1, arr2) {
	if(!Array.isArray(arr1)||!Array.isArray(arr2))return [];
    var res = [];
    for(var i = 0; i < arr1.length; i++){
      for(var j = 0; j < arr2.length; j++){
        if(arr1[i] == arr2[j]){
          res.push(arr1[i]);
          arr1.splice(i,1);
          arr2.splice(j,1);
          i--;
          j--;
        }
      }
    }
    return res;
};
proto.__delel_watchcb_notfind=function(id){
	for(var k in this[core_vm.aprand].elsdom.id){
		if(this[core_vm.aprand].elsdom.id[k]==id){
			delete this[core_vm.aprand].elsdom.id[k];
		}
	}
}

proto.getel=function(name){
//得不到modalview
	if(!name)return this[core_vm.aprand].els;//top
	//dialog等没有加到dom的找不到
	if(name[0]!=='#' && name[0]!=='.'&& name[0]!=='$'&& name[0]!=='@')name='#'+name;
	var elsdom=this[core_vm.aprand].elsdom;
	if(name[0]=='#'){
		//console.log('getel',name,elsdom.id);
		var id=elsdom.id[name.substr(1)];
		if(id==undefined){
			return null;
		}else if(id==null){
			delete elsdom.id[name.substr(1)];
			return null;
		}else{
			return document.getElementById(id);
			//console.log('el呢',id,this.__getel_may_dialog(id))
			
		}
		//return document.getElementById(id);
	}else{
		var els=[],ids=[];
		if(name[0]=='@'){
//listel
			ids=elsdom['listel'][name.substr(1)];
		}else if(name[0]=='$'){
			ids=elsdom['role'][name.substr(1)];
		}else if(name[0]=='.'){
			name=name.substr(1);
			if(name.indexOf('.')==-1){
				ids=elsdom['class'][name];
			}else{
				name=name.split('.');
				for(var k in name)name[k]=core_vm.tool.trim(name[k]);
				var id_s=[];
				for(var k in name){
					id_s[k]=[];
					if(Array.isArray(elsdom['class'][name[k]])){
						elsdom['class'][name[k]].forEach(function(tid){
							id_s[k].push(tid);
						})
					}
				}
				ids=intersect(id_s[0],id_s[1]);
				if(id_s.length>2){
					for(var i=2;i<id_s.length;i++)ids=intersect(ids,id_s[i]);
				}
			}
		}

		if(ids){
			for(var i=0,len=ids.length;i<len;i++){
				els.push(document.getElementById(ids[i])||null);
				
			}
			for(var i=ids.length-1;i>-1;i--){
				if(els[i]==null){
					els.splice(i,1);
					ids.splice(i,1);
				}
			}
		}
		return els;
	}
	//多类选择器 tagp.x.y 就不实现了 mob上可以对元素style实现 选择器就算了 

}
//getel-需要统一 web mob
proto.__regel=function(type,name,webelid_or_mob_el,index){
	//可以用getviewbyid了 
	//console.error('regel',type,name,webelid_or_mob_el,index)
	var elsdom=this[core_vm.aprand].elsdom;
	if(type=='id'){
		elsdom.id[name]=webelid_or_mob_el;
	}else	if(type=='listel'){
		//console.log('reg.listel',name,webelid_or_mob_el,index)
		elsdom.listel[name]=elsdom.listel[name] || [];
		var obj=elsdom.listel[name];
		if(obj.indexOf(webelid_or_mob_el)==-1){
			if(index!=undefined)obj.splice(index,0,webelid_or_mob_el)
			else obj.push(webelid_or_mob_el);
			//数组的元素按照加进来的位置排序
		}
	}else	if(type=='classList'){
		var array=name;
		for(var k in  array){
			if(this.getapp().config.strategy.cacheClassesAll!==true || this.config.cacheClasses.indexOf(array[k])===-1)continue;
			elsdom.class[array[k]]=elsdom.class[array[k]] || [];
			if(elsdom.class[array[k]].indexOf(webelid_or_mob_el)==-1){
				if(index!=undefined)elsdom.class[array[k]].splice(index,0,webelid_or_mob_el)
				else elsdom.class[array[k]].push(webelid_or_mob_el);
				//数组的元素按照加进来的位置排序
			}
		}
	}else	if(type=='role'){
		elsdom.role[name]=elsdom.role[name] || [];
		if(elsdom.role[name].indexOf(webelid_or_mob_el)==-1){
			if(index!=undefined)elsdom.role[name].splice(index,0,webelid_or_mob_el)
			else elsdom.role[name].push(webelid_or_mob_el);
			//数组的元素按照加进来的位置排序
		}
	}
}
proto.delel=function(thisel,ifchild,ifhas_remove_from_parent){
	//还是需要delel 主要是清除缓存
	var velid,vclass,role;
	//if(thisel)thisel=thisel;
	//console.log('delel',thisel.id,ifchild,ifhas_remove_from_parent)
	if(!thisel)return;
	var elsdom=this[core_vm.aprand].elsdom;
	velid=thisel.getAttribute('id');vclass=thisel.getAttribute('classList');role=thisel.getAttribute('role');
	

	if(velid){
		for(var k in elsdom.id){
			if(elsdom.id[k]===velid)delete elsdom.id[k];
		}
		if(elsdom.id[velid])delete elsdom.id[velid];
		if(thisel.listid){
			var ids=elsdom['listel'][thisel.listid];
			if(Array.isArray(ids)){
				var index=ids.indexOf(velid);
				if(index>-1)ids.splice(index,1);
			}
		}
		if(role){
			if(elsdom.role[role]){
				var index=elsdom.role[role].indexOf(velid);
				if(index>-1)elsdom.role[role].splice(index,1);
			}
		}
		if(vclass){
			for(var k in  vclass){
				if(elsdom.class[vclass[k]]){
					var index=elsdom.class[vclass[k]].indexOf(velid);
					if(index>-1)elsdom.class[vclass[k]].splice(index,1);
				}
			}
		}
	}

	

	
	if(thisel.childNodes){
		for(var i=0,len=thisel.childNodes.length;i<len;i++){
			if(thisel.childNodes[i].nodeType==1)this.delel.call(this,thisel.childNodes[i],true);
		}
	}
	if(!ifchild)thisel.parentNode.removeChild(thisel);
	
}


}



/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

var core_vm=__webpack_require__(0);


module.exports.setproto=function(proto){


	
proto.sethtml=function(el,html){
	if(typeof (el)=='string')el=this.getel(el);
	if(!el)return;
	
	
	var els=el.childNodes;for(var i=els.length-1;i>-1;i--)el.removeChild(els[i]);

	this.addhtml(el,html);
	
}

proto.addhtml=function(el,html){
	
	if(typeof (el)=='string')el=this.getel(el);
	if(!el)return;

	var vm=this;//[core_vm.aprand];		
	//web下node_max_sn没有加 mob下是计算style时处理的，
	//node.sn主要是记录node的parent-child关系
	var json=core_vm.calhtmltojson(html,vm[core_vm.aprand].node_max_sn+1,0,vm.getapp(),2);//+1的node是_root_,psn=0 sn是最大sn+1
	//console.log('addhtml',json[0]);
	//json=json[0].childNodes;
	vm[core_vm.aprand].nodejson.push(json[0]);

	

	core_vm.create.nodes(vm,json[0],vm[core_vm.aprand].rootscope,el); 

	//console.log('addhtml',vm[core_vm.aprand].domeventnames)
	//console.log('addhtml',vm[core_vm.aprand].domeventnames_binded)
	//有的会无效this.__bind_events(el);
	this.__bind_as_top_view(json[0],el);
	//这时候应该绑定到el本身
}
}

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

var core_vm=__webpack_require__(0);
module.exports.setproto=function(proto){

proto.__auto_sub_app=function(){
	for(var k in this.event){
		if(k.substr(0,4)=='app.' && typeof (this.event[k]=='function'))this.getapp().sub(k.substr(4),this,this.event[k])
	}
}
proto.__auto_unsub_app=function(){	
	for(var k in this.event){
		if(k.substr(0,4)=='app.' && typeof (this.event[k]=='function'))this.getapp().unsub(k.substr(4),this,this.event[k])
	}
}
proto.pubapp=function(name,data,cb){
	this.getapp().pub(name,data,this,cb)
}
proto.pubup=function(name,data,cb){
	if(!this.pvm){
		return;
	}
	var fn=this[core_vm.aprand].pvmevent[name];
	if(!fn)fn=this.pvm.event[this.id+'.'+name];
	if(!fn)fn=this.pvm.event['child'+'.'+name];
	if(!fn)return;
	if(!core_vm.isfn(fn))fn=core_vm.tool.objGetDeep(this.pvm,fn);
	if(!core_vm.isfn(fn))fn=core_vm.tool.objGetDeep(this.pvm.event,fn);
	if(!core_vm.isfn(fn))return;
	var vm=this;
	var pvm=this.pvm;
	fn.call(this.pvm,data,this,function(data){
		if(core_vm.isfn(cb))cb.call(vm,data,pvm);
	})
}
//pubdown==pubto
proto.pubdown=function(cvmid,name,data,cb){	
	var vm=this;
	//console.log('pubdown',cvmid)
	if(typeof (cvmid)=='object')cvmid=cvmid.id;
	if(!cvmid)return false;
	var s=[]
	if(cvmid=='*'){
		s=Object.keys(this[core_vm.aprand].vmchildren)
	}else{
		s=[cvmid];	
	}

	s.forEach(function(cvmid){
		var cvm=vm.getChild(cvmid);
		if(!cvm){
			if(core_vm.isfn(cb))cb({error:'no.such.'+cvmid});
			return;
		}
		//console.log(cvm.event,cvmid+'.'+name)
		var fn=cvm.event['pvm.'+name];
		if(!core_vm.isfn(fn))return;
		fn.call(cvm,data,vm,function(data){
			if(core_vm.isfn(cb))cb.call(vm,data,cvm);
		})
	})
}

}

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

var core_vm=__webpack_require__(0);
module.exports.setproto=function(proto){

proto.__addto_onstart=function(cb){
	//list-elhook.js调用
	//console.log('加入开始回调 onstart',cb)
	//内部watch list等用的 还没有rect等
	if(this[core_vm.aprand].has_started!==1){
		this[core_vm.aprand].cbs_onstart.push(cb);
	}else{
		core_vm.tryfn(this,cb,[this],'vm.onstart')
	}
}
proto.__addto_onshow=function(cb){
	//elhook.js调用 dragableview,gif
	//console.log('加入开始回调onshow',this.id,this.src);
	if(this[core_vm.aprand].has_started!==1){
		this[core_vm.aprand].cbs_onshow.push(cb);
	}else{
		core_vm.tryfn(this,cb,[this],'vm.onshow.addto')
	}
}

proto.__onshow=function(){
	//console.log('__onshow----------------',this[core_vm.aprand].cbs_onshow.length,this[core_vm.aprand].cbs_onstart.length)
	//addto pel后 主要是modaltopview用的 创建一个view 需要高宽等于pel.rect.w
	for(var k in this[core_vm.aprand].cbs_onshow){
		core_vm.tryfn(this,this[core_vm.aprand].cbs_onshow[k],[this],'vm.onshow.exe')
	}
	this[core_vm.aprand].cbs_onshow=[];



	for(var k in this[core_vm.aprand].cbs_onstart){
		this[core_vm.aprand].cbs_onstart[k].call(this);//都是内部函数
	}
	this[core_vm.aprand].cbs_onstart=[];

	if(core_vm.isfn(this[core_vm.aprand].startcb_of_vmstart)){
		//console.log('__startcb_of_vmstart 是函数')
		core_vm.tryfn(this,this[core_vm.aprand].startcb_of_vmstart,[],'vm.start.cb,id='+this.id);
	}else{
		//console.error('__startcb_of_vmstart 不是函数',this.id)
	}
	//console.log('自动禁止')
	//
	

	this.__clean_tmp_after_start();
	

}

var check_slot=function(vm,nodes){
	//return;
	//先检查是想在parent里面去掉<slot 但是list里面调用slot不行 没有scope.index
	for(var sn=0,len=nodes.length;sn<len;sn++){	
		if(nodes[sn].tag=='slot' && (!nodes[sn].attr || !nodes[sn].attr.name) ){
			core_vm.inject.use_inject_nodes_when_create(vm,nodes[sn]);
		}else{
			check_slot(vm,nodes[sn].childNodes);
		}
	}
}
proto.__vmstart=function(startcb){	
	//app.demo首页老是显示不正常 object
	//console.log("vm.start",this.id,this[core_vm.aprand].has_started,typeof (startcb));
	if(this[core_vm.aprand].has_started==1){
		return;
	}
	var vm=this;

	if(core_vm.isfn(startcb))vm[core_vm.aprand].startcb_of_vmstart=startcb;
	if(core_vm.isfn(this.hookStart) && !this.__hookStart_has_called){
		vm.getapp().hookstart_ing_vm=vm;
		//hookstart有可能错误 try后错误了自动朝下走
		try{		
			this.hookStart.call(this,function(result){
				vm.getapp().hookstart_ing_vm=null;
				vm.__hookStart_has_called=1;				
				if(result!==false){
					vm.__vmstart(startcb);
				}else{
					if(vm[core_vm.aprand].startcb_of_vmstart)vm[core_vm.aprand].startcb_of_vmstart(false);
					vm.__init(true);//这样就清理了 pvm cache都不需要清理
				}
			});
		}catch(e){
			core_vm.devalert(vm.getnap(),'hookStart error',vm.src,e)
			vm.getapp().hookstart_ing_vm=null;
			this.hookStart=null;
			vm.__vmstart(startcb);
		}
		return;
	}
	
	core_vm.tryvmfn(vm.pvm,vm,'beforechildstart');
	core_vm.tryvmfn(vm,null,'beforestart');

	var bodytext=vm.getcache().get_body(vm);
	//console.error('bodytext',bodytext.length)
	if(core_vm.isfn(vm.hookTemplate)){	
		core_vm.cal.nodejson(vm,vm.hookTemplate(bodytext));
	}else{
		core_vm.cal.nodejson(vm,bodytext);
	}
	check_slot(vm,vm[core_vm.aprand].nodejson[0].childNodes);

	var styletext=vm.getcache().get_vmstyle(vm);
	//一个page退出时,在require.cache保存有 再次打开时 先去那里找 保存有template ,各种用户写的函数 以及刚刚cache的css
	if(styletext){
		if(core_vm.isfn(vm.hookStyle)){
			styletext=vm.hookStyle(styletext);
		}
		//console.log('styletext',styletext)
		
		core_vm.web_private_style.add(vm,styletext);
	}

	core_vm.start.web(vm);
	vm[core_vm.aprand].has_started_self=1;
	if(vm.getapp().config.strategy.append_to_pel_wait_loading_child_vm==false){
		core_vm.tryvmfn(vm,null,'__append_bin_el');
	}
	if(vm[core_vm.aprand].loadingsub_count==0){
		core_vm.tryvmfn(vm,null,'__onstart_a_zero_sub');
	}
}
//loadingsub_count -- 一共两处 load.err 与 __onstart_a_zero_sub
proto.__onstart_a_zero_sub=function(){
	var vm=this;
	//console.log('__onstart_a_zero_sub',this.id)
	if(this.__top_fragment && this[core_vm.aprand].has_started_self==1 
		&& vm.getapp().config.strategy.append_to_pel_wait_loading_child_vm==true){		
		core_vm.tryvmfn(vm,null,'__append_bin_el');

	}
	//append后为了保证dom准备好 用了settimeout 
	//onchildstartfinished 用户自己判断 如果设置了 wait_child child结束就是自己onstart
	//这里必须延时
	if(vm.pvm){
		setTimeout(function(){
			vm.pvm[core_vm.aprand].loadingsub_count--;
			if(vm.pvm[core_vm.aprand].loadingsub_count==0){
				//pvm是否已经start完成了呢 都可能 根据 设置 append_to_pel_wait_loading_child_vm	
				vm.pvm.__onstart_a_zero_sub();
			}
		},0);
	}else{
		setTimeout(function(){
			if(vm.getapp().hasstart==0){
				vm.getapp().hasstart=1;
				console.log('执行app.onstart1')
				vm.getapp().onstart();
			}
		},10);
	}
}

proto.__after_append_real=function(){
	//console.log('__after_append_real',this.id)
	var vm=this;

	vm[core_vm.aprand].has_started=1;
	
	delete vm._is_fresh_ing;
	vm.__onshow.call(vm);

	
	
	core_vm.tryvmfn(vm,vm,'onstart');
	core_vm.tryvmfn(vm.pvm,vm,'onchildstart');	

				

}
proto.__after_append=function(){
	//console.log('__after_append',this.id)
	var vm=this;
	if(vm.getapp().config.strategy.append_to_pel_wait_loading_child_vm==true){
		if(this.pvm){
			this.pvm.__addto_onshow(function(){
				vm.__after_append_real();
			})
		}else{
			this.__after_append_real()
		}
	}else{
		this.__after_append_real()
	}
}

proto.__append_bin_el=function(){
	//console.log('append_bin_el',vm.id);
	var vm=this;
	var fragment=vm.__top_fragment;
	if(!fragment)return ;

	
	var children=fragment.childNodes||[];

	var len=children.length;

	for(i=0;i<len;i++)vm[core_vm.aprand].els.push(children[i]);
	
	var vmpel=vm.pel;
	

	var i=0;
	var __appento_ppel=false;

	if(vm[core_vm.aprand].nodejson[0].childNodes.length==1 && len==1 &&
		((core_vm.elget(vmpel,'appendto')=='ppel')||'ppel'==vm.config.appendto)){
			vm.config.appendto='ppel';
			//ppel可能是  #document-fragment 不能保存
			core_vm.elset(vmpel,'_role_','placeholder');
			var el=children[0];
			
				//console.log('vm.ppel',vm.ppel ?'有':'无')
				//if(vm.ppel)console.log('id是否相同',vm.ppel.id,vmpel.parentNode.id)
			var ppel=vmpel.parentNode;
			ppel.appendChild(el);
			vmpel.after(el);
			ppel.removeChild(vmpel);
			vm.__addto_onshow(function(){
				vm.ppel=vm[core_vm.aprand].els[0].parentNode;
			})
			
			
			el.replaced_pel=vmpel;

			

			var node=vm[core_vm.aprand].nodejson[0].childNodes[0];
			node.event=node.event||{};
			if(vm[core_vm.aprand].pvmelevent)for(var k in vm[core_vm.aprand].pvmelevent)node.event[k]=vm[core_vm.aprand].pvmelevent[k];
			
			vm.__bind_as_top_view(node,el,'because.ppel');
			
			__appento_ppel=true;
	}else{
		vmpel.appendChild(fragment);
				
	}

	delete vm.__top_fragment;
	
	for(var k in vm[core_vm.aprand].pvmelevent){
		vm[core_vm.aprand].domeventnames[k]=1;
	}
	if(!__appento_ppel){
		//console.error('现在绑定vm事件')
		vm.__bind_events();
	}
	//确保el added
	setTimeout(function() {		
		vm.__after_append();
	},0);
}

proto.restart=function(json,cb){
	//console.log('restart',json);
	this.close();
	if(core_vm.isfn(json)){
		this.start(cb);
	}else if(core_vm.isobj(json)){
		if(json.src){
			this.__setsrc(json.src);
		}
		this._is_fresh_ing=json.fresh===true ?true:false;
		this.start(cb);
	}else{
		//可能 重新设置了data-option
		this.start(cb);
	}
}
proto.start=function(cb){	
	if(!core_vm.isfn(cb))cb=function(){}
	//console.log('自己start',this.pel,this.id,this.src)
	if(this[core_vm.aprand].has_defined){
		//console.log('已经load')
		this.__initdata_then_start(cb);
	}else{
		//都是去load
		//if(this.pvm)console.log('去load',this.absrc,this.pvm.absrc,this.pvm[core_vm.aprand].absrcid);
		core_vm.load(this,cb);
	}
}
proto.show=function(){	
	var els=this[core_vm.aprand].els;	
	

	for(var i=els.length-1;i>-1;i--){
		els[i].style.display=core_vm.elget(els[i],'lastdisplay')||"";
	}
	
}
proto.hide=function(){	
	var els=this[core_vm.aprand].els;	
	

	
	for(var i=els.length-1;i>-1;i--){
		core_vm.elset(els[i],'lastdisplay',els[i].style.display||"");
		els[i].style.display='none';
	}
	
}


}

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

var core_vm=__webpack_require__(0);
module.exports.setproto=function(proto){

proto.__initdata_then_start=function(cb){
	var vm=this;
	

	core_vm.elset(vm.pel,'bindsidofvm',this.sid);
	
	core_vm.elset(vm.pel,'isvmpel',true);
	vm[core_vm.aprand].rootscope={alias:'',path:'',pscope:null,aid:0};

	core_vm.inject.inject_from_pvm_before_start(vm,vm[core_vm.aprand].rootscope);

	core_vm.tool.deepmerge(vm.data,vm[core_vm.aprand].append_data);
	core_vm.tool.deepmerge(vm.option,vm[core_vm.aprand].append_option);

	//console.log('__initdata_then_start')
	if(!vm.getapp().store || !vm.getapp().store.vminit){
		vm.__vmstart(cb);
		return;
	}
	vm.getapp().store.vminit.call(vm.getapp(),vm,function(data){
		if(typeof(data)=='object' && !Array.isArray(data)){
			for(var k in data)vm[core_vm.aprand].datafrom_store.push(k);
			if(vm.getapp().config.strategy.auto_deepclone_store_data){
				core_vm.tool.deepmerge(vm.data,core_vm.tool.objClone(data));
			}else {
				for(var k in data)vm.data[k]=data[k];
			}
		}
		if(vm.pvm && vm.pvm.dataProxy && core_vm.isfn(vm.pvm.dataProxy.vminit)){
			vm.pvm.dataProxy.vminit.call(vm.pvm,vm,function(data){
		
				if(data && typeof(data)=='object' && !Array.isArray(data)){
					for(var k in data)vm[core_vm.aprand].datafrom_parent.push(k);
					if(vm.getapp().config.strategy.auto_deepclone_store_data){
						core_vm.tool.deepmerge(vm.data,core_vm.tool.objClone(data));
					}else {
						for(var k in data)vm.data[k]=data[k];
					}
				}
				
				//console.log('得到pvm数据')
				vm.__vmstart(cb);
			})
		}else{
			//console.log('得到store数据')		
			vm.__vmstart(cb);
		}
	});
	//不能把data改成proxy的原因是
	//data.a=b 可以拦截并询问许可,但是没法回调
}
}

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

var core_vm=__webpack_require__(0);
var _reqlib=__webpack_require__(1);
var _requirecache=__webpack_require__(2);
var _req_caltext=__webpack_require__(51);
var _libcal={};
module.exports=_libcal;


_libcal.evalResponse_genmod=function(spec,cb,meta,template,style_str,extend_from,when){
	//console.log('evalResponse_genmod',spec.id,spec.urlsid,'模板长度='+template.length,'extend_from='+extend_from,when);//	
	//有require缓存 不到这里来
	//这里  extend 不应该这里处理应在loadsub那里处理
	if(spec.type=='vm' && extend_from){	
		core_vm.extend.onload(spec,cb,meta,template,style_str,extend_from,when);
	}else{
		//没有原型 可能是lib 可能没有urlsid就是原型先下载 然后给真的用的 
		//原型里面不能有require的 import的 否则找不到
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
	//console.log("evalResponse",spec,responseText);
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
	//todo check extend-mod
	//console.log("下载完成 evalResponse,when=",when,spec.id,spec.fresh);//.toString() =protocol+//+hostname:port+pathname
			
	var array = _req_caltext(responseText, spec.id,spec.type,spec);

	var funcpara="require,module,exports,";
	funcpara+='app';
	 

	var func_str=array[0];

	try{
		
		var newfn=new Function(funcpara,(spec.app.config.isdev==true?"//# sourceURL="+spec.url+"\n":'')+array[0]);
	}catch(err){
		//console.error("evalResponse fail", err.lineno,spec.url,err,func_str);//
		//如 a=>s错误
		//这里得不到错误行数 文件级别的函数外的错误 
		core_vm.devalert(spec.app,'js_SyntaxError:',spec.url+"\n"+err.toString());
		//newfn=new Function(funcpara,'');//假冒一个函数
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
				needs.push({url:src,	type:'vm'});//重复加入在 load时也会自动加倒cb里面
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

		//console.log(spec.id,"依赖",needs,deps);
		for(var i=needs.length-1;i>-1;i--){
			needs[i].fresh=spec.fresh;
			needs[i].pvmpath=spec.id;
			needs[i].loadvm=spec.loadvm;
			
			needs[i].app=spec.app;
			//这里不给vmneeds[i].vm=spec.vm;
			if(needs[i].type=='vm' && spec.app.config.path.vm[needs[i].url]){
				needs[i].url=spec.app.config.path.vm[needs[i].url];
				needs[i].knowpath=true;
			}else	if((needs[i].type=='lib'||needs[i].type=='json') && spec.app.config.path.lib[needs[i].url]){
				needs[i].url=spec.app.config.path.lib[needs[i].url];
				needs[i].knowpath=true;
			}
			if(needs[i].type=='vm'){
				//vmneeds[i].vm= 此处没有vm 只是先现在而已
				//先建立vm的好处是写法简单 如果几个page使用一个组件
				//extend_from 时 是?先建立vm吗?
				//先建立主要是写起来方便
			}
			//needs[i].urlsid=spec.urlsid;后面会计算
		}
		for(var k in needs){
			_reqlib.cal_spec_path(needs[k],spec.url);//先计算 主要是下面判断是否有缓存
			if(needs[k].ifextend)extend_from=needs[k].id;
		}
		for(var i=needs.length-1;i>-1;i--){			
			needs[i].from='deps';//在cal_spec_path后设置为deps load时就不再计算了
			needs[i].refsid=spec.app.__cache.geturlsid(spec.id);
			if(!needs[i].refsid){
				console.error('找不到refsid',needs[i].url)
			}
			if(!spec.fresh && spec.app.__cache.check_ifhas(needs[i].type,needs[i].id,needs[i].refsid)){
				//console.error('找到缓存模块,不再下载',needs[i].id);
				//check 时加了refsid
				needs.splice(i,1);
			}
		}
		
		
		//console.error('准备下载deps',needs.length,extend_from)
		if(needs.length==0){
			_libcal.evalResponse_genmod(spec,cb,array[1],array[2],array[3],extend_from,0);
		}else{
			
			//needs中出了extend外的 vm,block可以不用等待用空函数去cb 用时pending就可以了 暂时都loads
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


/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

var core_vm=__webpack_require__(0);
var _reqlib=__webpack_require__(1);

var requirePattern = /(?:^|[^\w\$_.])require\s*\(\s*["']([^"']*)["']\s*\)/g;

//可以 import * as abc from './abc.js' 就不要考虑 require了
//可以 import {a,b} abc from './abc.js' 就不要考虑 require了
var reg_elhook=new RegExp(' el-hook=[\'\"](.*?)[\'\"]', 'ig');

var reg_vmsrc;
var reg_style=new RegExp("<style(.*?)>([^<]*)</style>", 'ig');//


var reg_body=new RegExp("<body(.*?)>([\\s\\S]*?)</body>", 'i');
var reg_template=new RegExp("<template(.*?)>([\\s\\S]*?)</template>", 'i');
var reg_script=new RegExp("<script(.*?)>([\\s\\S]*?)</script>", 'ig');
var reg_html=new RegExp("<html(.*?)>([\\s\\S]*?)</html>", 'i');

var reg_head=new RegExp("<head(.*?)>([\\s\\S]*?)</head>", 'i');
var reg_prototype=new RegExp("<prototype>([\\s\\S]*?)</prototype>", 'i');
var reg_import=new RegExp("<import([\\s\\S]*?)>[</import>]*?", 'ig');


var adddep=function(deps,obj){
	if(obj.src=='')return;
	var findsame=deps.length==0?0:1;
	for(var k in deps){
		var findsame=1;
		for(var n in obj){
			if(obj[n]!==deps[k][n])findsame=0;
		}
		if(findsame==1)break;
	}
	if(findsame==0)deps.push(obj);
}
var all_isnot_seen=function (str){
	for( var i=0,len=str.length; i<len; i++){
		if(str.charCodeAt(i)>32)	return false;
	}
	return true;//全部是不可见字符就忽略了
}
module.exports=function(content,id,type,spec){
	//if(spec.type=='vm')console.log("cal_vmtext 1",id,spec.type,spec.from,spec.urlsid,"长度="+content.length);
	var all_str=core_vm.delrem(content);
	var script_str= type=='vm' ? '':all_str;
	var style_str='',body_str=null,meta_str='',html_str='',extend_from='';	
	var deps=[];
	if(type=='vm'){	
		//console.error('vm.code',spec.app.config.precode,spec.app.config.precode_regexp)
		for(var k in spec.app.config.precode_regexp){
			all_str=all_str.replace(spec.app.config.precode_regexp[k],function(a,b,c,d){ 
				return '<'+k+b+'>'+core_vm.tool.htmlescape(c.replace(/\n/,''))+'</'+k+'>';
				//<pre>qq</pre> qq前的第一个换行需要去掉
			})
		}
		all_str=all_str.replace(reg_style,function(a,b,c,d){
			//console.log('发现css','a='+a,'b='+b,'c='+c,'d='+d)
			var match;
			if(b)match=b.match(/src=['"](.*?)['"]/);
			if(match){				
				adddep(deps,{type:'css',src:match[1],urlsid:spec.urlsid});				
			}else if(c){
				style_str+=c;	
			}
			return '';
		});	
		//import的目的是随潮流 相比在config里面设置一样,但是只能在当前页面使用
		all_str=all_str.replace(reg_import,function(a,b){
			//console.log('发现 import','b='+b,spec.urlsid);
			//导入后提前下载
			//导入后只能用<name></name> 省不了 <div vm-src 这里关键是想用这个div标签 因为有可能有的css框架限定了div
			var type,src,name;
			b.replace(/[\s]{1,}type=['"]([\S]*?)['"]([\s]{0,}|[\>\/])/i,function(a,b){type=b});
			b.replace(/[\s]{1,}src=['"]([\S]*?)['"]([\s]{0,}|[\>\/])/i,function(a,b){src=b});
			b.replace(/[\s]{1,}name=['"]([\S]*?)['"]([\s]{0,}|[\>\/])/i,function(a,b){name=b});
			//不能import lib json 因为路径计算复杂 可以 require('../ss/abc.js') 会计算成绝对路径
			//console.log('发现import type='+type,'src='+src,'name='+name)
			//这时pvm还没有
			var src=_reqlib.gen_path(spec.app,src,spec.id,true,1);
			//todo 如果path里面有 use里面有不加金deps
			
			if(type=='prototype'){
				extend_from=src;
			}
			
			spec.app.__cache.add_import_src_when_cal(type,spec.urlsid,name,src);
			
			if(spec.app.__cache.check_ifhas(type,src,spec.urlsid)){
				//console.error("引入已经有了",type,src)
				return "";
			}
			if(type=='vm' ){				
				//不加入deps load时自动load
			}else if(type=='block' ){
				adddep(deps,{type:type,from:'import',src:src,utag:(name||src)});
			}else if(type=='css' ){
				adddep(deps,{type:'css',src:src,urlsid:spec.urlsid});				
			}else if(type=='lib' ){
				adddep(deps,{type:'lib',src:src,urlsid:spec.urlsid});				
			}else if(type=='json' ){
				//console.log('有json')
				adddep(deps,{type:'json',src:src,urlsid:spec.urlsid});				
			}
			//
			return "";//vm不提前下载 因为没有vmid
		});
		//deps.vm 只有 import vm

		all_str=all_str.replace(reg_body,function(a,b,c){body_str=c;		return '';});			
		all_str=all_str.replace(reg_script,function(a,b,c){script_str+=c;	return '';});
		all_str=all_str.replace(reg_html,function(a,b,c){html_str=c;		return ''; 	});

		if(html_str){
			html_str=html_str.replace(reg_head,function(a,b,c){meta_str=c;return "";});	
			if(body_str==null)	body_str=html_str;
		}		
		if(body_str==null)all_str=all_str.replace(reg_template,function(a,b,c){body_str=c;return '';});
		if(body_str==null || all_isnot_seen(body_str))body_str='';

		body_str=body_str.replace(/\{app\.(.*?)}/g,function(a,b,c,d){
			//console.log('遇到主题',a,b)
			return 	core_vm.tool.objGetDeep(spec.app,b);
		})

		//不在这里处理 主要这里得不到是urlsid
		//reg_vmsrc=reg_vmsrc||new RegExp(' '+spec.app.config.vmtag+'-src'+'=[\'\"](.*?)[\'\"]', 'ig');
		//body_str.replace(reg_vmsrc,function(a,b,c,d){	adddep(deps,{type:'vm',src:b});	});
		
		body_str=body_str.replace(reg_elhook,function(a,b,c,d){			
			if(!spec.app.__cache.use.elhook[b] && b.indexOf('this.')!==0){				
				if(spec.app.config.path.elhook[b]){
					adddep(deps,{type:'lib',src:spec.app.config.path.elhook[b]});
					return ' el-hook="'+b+'" ';
				}else{
					var abs_b=_reqlib.gen_path(spec.app,b,spec.id,true,2);
					adddep(deps,{type:'lib',src:abs_b,importname:b});
					return ' el-hook="'+abs_b+'" ';
				}
			}else{
				return ' el-hook="'+b+'" ';
			}
		});
		//console.log(body_str)
		
		for(var k in spec.app.config.blockpath_regexp){		
			body_str.replace(spec.app.config.blockpath_regexp[k],function(a,b,c,d){ 
				adddep(deps,{type:'block',src:spec.app.config.path.block[k],pathtag:k});
				delete spec.app.config.blockpath_regexp[k];//下载后就不需要了
			})
		}
	}
	if(script_str){
		script_str=script_str.replace(requirePattern,function(a,b,c,d){
			//console.log('解析require',a,b,c)
			var importname=spec.app.__cache.check_if_import('lib',spec.urlsid,b);
			if(!importname) importname=spec.app.__cache.check_if_import('json',spec.urlsid,b);
			if(importname){
				//console.log('已经import了',b,importname)
				return a.replace(b,importname);
			}
			var abs_b,str;
			if(spec.app.config.path.lib[b]){
				abs_b=spec.app.config.path.lib[b];
				str=a;
			}else{
				abs_b=_reqlib.gen_path(spec.app,b,spec.id,true,3);		
				str=a.replace(b,abs_b);
			}

			if(spec.app.__cache.get_jslib(abs_b)){
				//console.log('找到lib',abs_b)
				return str;
			}			
			var obj={from:'require',type:'lib',src:abs_b}
			if(b.indexOf('.json')>0 && b.lastIndexOf('.json')===b.length-5)obj.type='json';
			adddep(deps,obj);
			return str;
		});
		//console.log(script_str)
	}
	
	if(!script_str && deps.length==0   && !extend_from){
		if(body_str==null)script_str=all_str;
		else script_str='';
	}
	//console.log('计算结果',deps,spec.id)

	//console.log("计算 script_str",script_str);
	return [script_str,meta_str,body_str,style_str,extend_from,deps ];
}

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

var core_vm=__webpack_require__(0);

module.exports=function(vm,node,scope){

	//计算表达式attrexp 条件  text
	//计算bind watch
	//计算vm到到bind 到 _sub_vm_tmp
	
	var config=vm.getapp().config;

	
	if(config.precode.indexOf(node.utag)>-1){
		return;
	}
	
	var newvm;
	core_vm.calexp.nodeattrexp(vm,node,scope);


	if(node.id && node.id[0]=='{')node.id=core_vm.calexp.exp(vm,node.id,scope);
	if(node.classList && node.classList.length>0 ){
		node.classList.forEach(function(str,i){
			if(node.classList[i][0]=='{')node.classList[i]=core_vm.calexp.exp(vm,str,scope);
		})
		node.classList=node.classList.join(' ').replace(/  /g,' ').split(' ');		
	}
	 //先计算数据 再计算style


	if(node.tag=='_exptext_'){
		node.text=core_vm.calexp.exp(vm,node.exp_text,scope,'_exptext_');
		
	}

	if(node.watchs){		
		if(node.id){
			node.id=core_vm.calexp.exp(vm,node.id,scope);
		}else {
			node.id=core_vm.cal.forece_calnodeid(vm,node,scope,'watch');
		}
		//watch时 nodeid要确定因为要作为elid保存
		core_vm.watchcal.cal(vm,node,scope,'common');
		//text html 的初始值应该在标签之间 
	}
	

	var utag=node.utag;
	if(utag===config.vmtag || node.attr[config.vmtag+'-src'] || vm.getcache().vmlib[utag]||
		config.path.vm[utag] || 	vm.getcache().check_if_import('vm',vm[core_vm.aprand].absrcid,utag)){
		if(node.id=='parent'||node.id=='child')node.id='';
		if(!node.id)node.id=core_vm.define.newvmid();
		node.childNodes=node.childNodes||[];
		node.attr=node.attr||{};

		//console.error("在"+vm.id+" 发现 vm ",'utag='+utag, node.event,node);
		if(node.childNodes.length>0)core_vm.inject.biaojiinject_in_calcommon(vm,scope,node.childNodes);
		newvm={
			src:vm.getcache().check_if_import('vm',vm[core_vm.aprand].absrcid,utag)||config.path.vm[utag]
				||node.attr[config.vmtag+'-src']||node.attr.src||utag,
			id:node.attr.id||node.id||core_vm.define.newvmid(),
		};
		if(vm.getcache().vmlib[utag]){
			newvm.src=utag;
			newvm.absrc=utag;
		}

		node.childskip_inject=1;
	}


	return newvm;
	//接下来处理 _root_ text等标签 
	//接下来 处理 event bind state 各自处理
}


/***/ }),
/* 53 */,
/* 54 */,
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

var core_vm=__webpack_require__(0);
module.exports.setproto=function(proto){


proto.loadok_block=function(spec,text){
	if(spec.utag){//import的
		this.importblock[spec.id]={text:text||''};
		this.add_ref('block',spec.id,spec.refsid,'loadok_block');

	}else if(spec.pathtag){//巡查的
		if(!this.use.block[spec.pathtag])this.use.block[spec.pathtag]=text;
	}
}
proto.get_block_text=function(vm,utag){
	//console.log('get_block_text',utag)
	if(this.use.block[utag])return this.use.block[utag];
	var src=this.check_if_import('block',vm[core_vm.aprand].absrcid,utag);
	if(!src)return '';
	var mod=this.importblock[src];		
	if(!mod)return '';		
	if(mod.refsids.indexOf(vm[core_vm.aprand].absrcid)===-1)mod.refsids.push(vm[core_vm.aprand].absrcid);
	return mod.text ||'';
	
}

proto.loadok_style=function(spec,text){	
	this.importstyle[spec.id]={text:text||''};
	this.add_ref('style',spec.id,spec.refsid,'loadok_style');
}


proto.__get_importstyle=function(vm){
	var text='';
	for(var k in this.importstyle){
		if(this.importstyle[k].refsids.indexOf(vm[core_vm.aprand].absrcid)>-1)
			text+=this.importstyle[k].text;
	}
	return text;
}
}

/***/ })
/******/ ]);
});