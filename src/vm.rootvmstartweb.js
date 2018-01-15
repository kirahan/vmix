var core_vm=require('./vm.0webcore.js');
var global_rootvm={},index_vm={}
var check_body=function(){
	core_vm.wap.indexvm[core_vm.aprand].has_started=1;
	var s=Object.keys(core_vm.wap.config.path.vm);
	s.push(core_vm.wap.config.vmtag);
	var el_src=document.body.querySelectorAll(s.join(',')) ;
	var elsall=[];
	[].forEach.call(el_src,function(el){ elsall.push(el)});
	[].forEach.call(elsall,function(el){
		if(el.hasAttribute('autostart') && el.getAttribute('autostart')==false)return;
		var json={};
		json.src=core_vm.wap.config.path.vm[el.localName]||el.getAttribute('src') || '';
		json.id=el.getAttribute('id') || '';
		var nodes=[];
		el.childNodes.forEach(function(node){
			el.removeChild(node);
		});
		var vm=core_vm.define.define({pvm:core_vm.wap.indexvm,el:el,id:json.id,src:json.src});
		core_vm.loadsubvm.load(vm,function(vm){
		})
	});
}
var start_system=function(){
	var file_app,file_indexvm;
	var scripts= document.getElementsByTagName('script');
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
	window.location.fullhost=u;
	core_vm.rootvmstart.init();
	core_vm.rootvmstart.start_system(core_vm.wap,file_app,file_indexvm,index_vm,function(){
		if(!file_indexvm){
			check_body();
		}
	});
}
module.exports.start_system=start_system;
