var config={};


config.isdev=true;


config.strategy={
	not_document_getelbyid:true,
	auto_deepclone_store_data:true,
	force_close_error_close_tag:true,// 标签名 a-_b 含有其他字符为error
	force_close_not_match_close_tag:true,//</xx> xx与需要关闭的tag不符合 true 强制关闭 false 略过错误的部分 下面的作为child
	append_to_pel_wait_loading_child_vm:true,
	setChildState:true,
	cacheClassesAll:true,
}

config.precode=['pre','code'];//不处理
config.vmtag='vm';

config.path={
	lib:{
		'moda':'lib/moda.js',
		'lodash':'lib/lodash.js',
		//'abc':'document/abc.js',
	},elhook:{
		hookinpath:'document/el.hookinpath.js',		
	},vm:{
		'apple':'libvm/apple.html',
		'abc':'document/abc.html',
		collapsnav:'libui/collapsnav.vm',
		breadcrumb:'libui/breadcrumb.vm',
		tab:'libui/tab.vm',
		mynav:'libui/nav.vm',
		mynavbar:'libui/navbar.vm',
		gmodal:'libui/modal.vm',
		buttongroup:'libui/buttongroup.vm',
		dropdownbutton:'libui/dropdownbutton.vm',
		dropdownmenutoobar:'libui/dropdownmenutoobar.vm',
		pager:'libui/pager.vm',
		arraypager:'libui/arraypager.vm',
		alert:'libui/alert.vm',
		themebutton:'libui/themebutton.vm',
	},block:{
		blocklazytest:'block/blocklazytest.html',
		blocklazytest1:'block/blocklazytest.html',
		blocklazytest2:'block/blocklazytest2.html'
	}
	//lazy load
}



app.config=config;

var route=require('./applibroute.js');
route.setup(window.location.href,0);
app.route=function(path,vm,cb){
	route.bind(path,vm,cb);
}
app.navigate=function(hash,title,force){
	route.navigate(hash,title,force);
}
var usexyz=require('./appuse.js');

app.store=require('./appstore.js');
app.hookStart=function(cb){
	app.store.init(function(){
		cb();
	});
}
app.startTime=new Date().getTime();
app.theme={
	red:'#ff0000',
	color:{
		red:'red',
		ccc:'#ccc'
	}
}
//onload onerror 是页面级的 mob.app的在app目录下
app.onerror=function(type,where,e){
	console.error('错误跟踪','type='+type,'where='+where,e)
}
var _textcache={};
app.onload=function(url,xhr,opt){
	//console.error("下载了源文件",xhr.responseURL.replace('http://192.168.0.201:8080/webapp',''),xhr.responseText.length);
	_textcache[xhr.responseURL.replace('http://192.168.0.201:8080/webapp','')]=xhr.responseText;
}
app.onstart=function(){
	console.log('app.onstart');
}
app.sub('getvmsource',app,function(url,cb){
	cb(_textcache[url]||'')
})

app.route(		
	'#!/debugfile',function(file){
		console.log('app.route.debugfile',this)
	}	
)