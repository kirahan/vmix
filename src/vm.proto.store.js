var core_vm=require('./vm.0webcore.js');
module.exports.setproto=function(proto){
proto.__initdata_then_start=function(cb){
	var vm=this;
	core_vm.elset(vm.pel,'bindsidofvm',vm.sid);
	core_vm.elset(vm.pel,'isvmpel',true);
	vm[core_vm.aprand].rootscope={alias:'',path:'',pscope:null,aid:0};
	core_vm.inject.inject_from_pvm_before_start(vm,vm[core_vm.aprand].rootscope);
	core_vm.tool.deepmerge(vm.data,vm[core_vm.aprand].append_data);
	core_vm.tool.deepmerge(vm.option,vm[core_vm.aprand].append_option);
	core_vm.wap.store.vminit.call(core_vm.wap,vm,function(data){
		if(typeof(data)=='object' && !Array.isArray(data)){
			for(var k in data)vm[core_vm.aprand].datafrom_store.push(k);
			if(core_vm.wap.config.strategy.auto_deepclone_store_data){
				core_vm.tool.deepmerge(vm.data,core_vm.tool.objClone(data));
			}else {
				for(var k in data)vm.data[k]=data[k];
			}
		}
		if(vm.pvm && vm.pvm.dataProxy && core_vm.isfn(vm.pvm.dataProxy.vminit)){
			vm.pvm.dataProxy.vminit.call(vm.pvm,vm,function(data){
				if(data && typeof(data)=='object' && !Array.isArray(data)){
					for(var k in data)vm[core_vm.aprand].datafrom_parent.push(k);
					if(core_vm.wap.config.strategy.auto_deepclone_store_data){
						core_vm.tool.deepmerge(vm.data,core_vm.tool.objClone(data));
					}else {
						for(var k in data)vm.data[k]=data[k];
					}
				}
				vm.__vmstart(cb);
			})
		}else{
			vm.__vmstart(cb);
		}
	});
}
}