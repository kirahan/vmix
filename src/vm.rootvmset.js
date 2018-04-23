
var core_vm=require('./vm.0webcore.js');
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
		var _reqlib=require('./vm.requirelib.js');
		for(var k in defconf.path){
			if(apconf.path[k]==undefined)apconf.path[k]={};
			for(var m in apconf.path[k]){
				if(typeof(apconf.path[k][m])!=='string')delete apconf.path[k][m];
				apconf.path[k][m]=_reqlib.gen_path(app,apconf.path[k][m],'',true,4);
			}
		}
	}
}
