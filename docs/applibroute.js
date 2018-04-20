
var config_duplicate=false;
var gmap={};
var global_before,global_after;

var _route= function(path,ifrun){
    if(typeof path=='undefined')path='';
	if(path[path.length-1]!=='/')path+="/";
	this.path = path;

	if(!ifrun && !gmap[path]){//不是run才加进 gmap	
 		gmap[path]=gmap[path]||{};
		var tobj=gmap[path];	
 		tobj.events=[];
 		tobj.contexts=[];
 		tobj.argnames=[];//每个route只有一个与上面两个不同
		tobj.xiegangs=this.path.split('/').length;
		tobj.prefix=path.substr(0,path.indexOf('/:'));
		tobj.regx=path.replace(tobj.prefix,'').replace(/\:([^/]*?)\//g,
			function(a,b,c){
			tobj.argnames.push(b);
			return '/([^/]*?)/';
		}).replace(/\/\//g,'/');
		if(tobj.regx[tobj.regx.length-1]!='/')tobj.regx+='/';

		//console.log('new 路由',path,tobj);
		tobj.regx=new RegExp(tobj.regx);

	}	
};

_route.prototype.getall= function() {
	//console.log('_route.prototype.get,this.path='+this.path);
	//this.path是 location.hash
	this.argarray = [];//每找到一个符合条件的bindfunc 把run的参数封装成符合route的格式
	this.events=[];
	this.contexts=[];
	//最后都要有一个/表示结束已经自动处理
	if(typeof gmap[this.path]=='object' && gmap[this.path].events.length>0){
		for(var i=0; i<gmap[this.path].events.length; i++){
			this.events.push(gmap[this.path].events[i]);
			this.contexts.push(gmap[this.path].contexts[i]);
		}
		//console.log("find route with no para 没有参数");
		return this;
	}
	this.xiegangs=this.path.split('/').length;
	for(r in gmap){
		//可能路径参数设计不同
		//#!/view/action/:action/:para/ 与 #!/view/action/:qqq/:www/ 是两个 但是 regx应该是相同的
		var found=false;
		var argarray=[];
		if(gmap[r].xiegangs!=this.xiegangs || this.path.indexOf(gmap[r].prefix)!==0)continue;//斜杠个数不等也不行
		this.path.replace(gmap[r].prefix,'').replace(gmap[r].regx,function(a,b,c,d,e){
			//core.error("匹配参数para=",a,'b='+b,'c='+c,'d='+d,'e='+e);
			argarray=Array.prototype.slice.call(arguments, 1,arguments.length-2);
			//console.log('argarray',argarray,arguments);
			found=true;				
		});	
		
		if(found==true){
			//console.log("这个符合",r);
			for(var i=0; i<gmap[r].events.length; i++){
			  this.events.push(gmap[r].events[i]);
			  this.contexts.push(gmap[r].contexts[i]);
			  this.argarray.push(argarray);
			}
		}
	}	
	//debug.log('route this.path=(\''+this.path+'\')\n');
	return this;
};


_route.prototype.bind= function(fn,obj) {
	//console.log('路由bind',obj)
	if(this.path=='')			return 'nothing to bind';
	if(typeof fn != 'function')	return 'fn is invalid and cannot bind to route';
	if(config_duplicate===true || gmap[this.path].events.length==0){
		gmap[this.path].events.push(fn);
		gmap[this.path].contexts.push(obj);
	}
};
_route.prototype.unbind= function(fn,obj) {
	if(this.path=='')			return 'nothing to bind';
	if(typeof fn != 'function')	return 'fn is invalid and cannot bind to route';
	if(gmap[this.path]){
		var index = gmap[this.path].events.indexOf(fn);
		if(index>-1){
			gmap[this.path].events.splice(index,1);
			gmap[this.path].contexts.splice(index,1);
		}
	}	  
};
_route.prototype.run= function() {
	//console.log("route run");
	this.getall();
	if(global_before){
		try{
			global_before(this.path,this.argarray);
		}catch(e){
			core.error('route before error',e)
		}
	}
	var results=[];
	if(this.events.length==0){
		return false;
	}
	for(var i=0; i<this.events.length; i++){
	  this.events[i].apply(this.contexts[i] || null,this.argarray[i]);	
	}
	if(global_after){
		try{
			global_after(this.path,this.argarray);	
		}catch(e){
			core.error('route after error',e)
		}
	}
};

var route={};

route.bind=function(path,context,cb){
	new _route(path).bind(cb,context)
}
route.run=function(path,){
	new _route(path,true).run();
}
var pushStatefunc=function(e){
	//点击href='#sss'会触发 或者 history.go back会触发
	//console.log(e);
	//console.log(window.location.hash);
	//core.error("_popstate","hash="+location.hash,e.state, history );//"old="+window._hash_last,
	if(location.hash ){
		//if(window._hash_last==location.hash)return;window._hash_last=location.hash;
		route.run(window.location.hash);
		var str=location.hash;// "?/"+hash.substr(1)
		//if(!e.state)window.history.pushState({ }, document.title,'?/'+str.substr(1));else
		window.history.replaceState({hash:str}, document.title, '?'+str.substr(1));//第三个参数为将替换掉 location.hash 改变url
		//如果 pushState 后window.history多出来一个 如果不 replaceState history.go()时得不到 e.state 只是 loc.hash改变
		// window.location.assign(config_rooturl+"/"+hash.substr(1));会刷新浏览器
		//window.location.hash='';
	}else if(!location.hash){
		//console.log("没有 location.hash",e.state);
		if(e.state && e.state.hash)route.run(e.state.hash);
	}
};
var hashchangefunc=function(){
	//if(window._hash_last==location.hash)return;window._hash_last=location.hash;
	route.run(location.hash);

};



var config_usepushState=0;
route.setup=function(rooturl,usepushState){
	config_usepushState=usepushState;
	config_rooturl=rooturl;
	//window._hash_last='';
	//window.location.hash='';
	window.removeEventListener('popstate',	pushStatefunc);
	window.removeEventListener('hashchange',hashchangefunc);
	if(config_usepushState && window.history && window.history.pushState){
		window.addEventListener('popstate',pushStatefunc);
	}else{
		window.addEventListener('hashchange',hashchangefunc);
	}
};
route.navigate= function(hash, title,force) {
	if(!config_usepushState){		
		if(title)window.document.title=title;
		if(force && location.hash===hash)route.run(location.hash);
		else if(location.hash!==hash)location.hash= (hash[0]=='#')?hash :"#"+hash;
	}else{
		route.run(hash);
		window.history.pushState({hash:hash}, title?title :document.title, hash);
	}
};
route.setblankindex=function(){
	window.location.hash="";
}
route.starthistory=function(){//为收藏夹启动的webapp
	if(window.location.hash!='')route.run(window.location.hash);
}
route.set_global_before=function(func){	if(typeof func == 'function')global_before=func;}
route.set_global_after=function(func){	if(typeof func == 'function')global_after=func;}





module.exports=route;

/*

route.setupduplicate=function(type){
	config_duplicate=Boolean(type);
}
*/