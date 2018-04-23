var core_vm=require('./vm.0webcore.js');
var app_loaded=false;
var index_loaded=false;
module.exports.init=function(){
	app_loaded=false;
	index_loaded=false;
}
var start_index_vm=function(app,index_vm,mycb){
	if(typeof (app.hookStart)!=='function')app.hookStart=function(cb){cb();}
	app.hookStart(function(){
		index_vm.__initdata_then_start(mycb);
	})
}
var start_index_and_app=function(app,index_vm,cb){
	start_index_vm(app,index_vm,cb);
}
var start_parse_index=function(app,file_indexvm,index_vm,cb,where){
	if(app.indexvm_text==='' || !app_loaded){
		return;
	}
	if(app.indexvm_text===true){
		cb();
		return;
	}
	index_vm[core_vm.aprand].absrcid=1;
	core_vm.require.load({
		app:app,
		loadvm:null,pvmpath:'',
		url:file_indexvm,
		type:'vm',from:'file_indexvm',
		text:app.indexvm_text,
		urlsid:1,
		refsid:1,
		vm:index_vm
	},function(err,mod,spec){
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
	app.indexvm_text='';
	if(file_indexvm){
		app.loadfile('text',file_indexvm,function(err,text){
			app.indexvm_text=text;
			start_parse_index(app,file_indexvm,index_vm,cb,3);
		});
	}else{
		app.indexvm_text=true;
		start_parse_index(app,file_indexvm,index_vm,cb,4);
	}
	if(file_app){
		core_vm.require.load({
				app:app,
				loadvm:null,pvmpath:'',
				url:file_app,type:'lib',from:'file_app',
				urlsid:2,
				refsid:2,
				vm:null,
			},function(err,mod,spec){
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
