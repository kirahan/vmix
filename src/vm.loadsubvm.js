var core_vm=require('./vm.0webcore.js');
module.exports.load=function(vm,cb){
	if(vm[core_vm.aprand].has_defined || vm[core_vm.aprand].has_started ||!vm.src){
		return;
	}
	if(!core_vm.isfn(cb))cb=function(){}
	if(core_vm.gcache.vmlib[vm.src]){
		core_vm.gcache.add_vmlib_ref(vm.src,vm[core_vm.aprand].absrcid,'loadsub');
		vm.__define(core_vm.tool.objClone(core_vm.gcache.vmlib[vm.src].exports));
		vm.absrc=vm.src;
		vm.__initdata_then_start(cb);
		return;
	}
	var pvm=vm.pvm;
	if(pvm)pvm[core_vm.aprand].loadingsub_count++;
	var fresh=vm._is_fresh_ing ;
	var opt={
		loadvm:	pvm,		pvmpath	:pvm.absrc,
		url:	vm.absrc||vm.src,
		type	:'vm',
		from:	'loadvm',	fresh	:fresh,
		urlid:vm[core_vm.aprand].absrcid,
		refid:pvm[core_vm.aprand].absrcid
	};
	core_vm.require.load(opt,function(err,mod,spec){
		if(err){
			core_vm.onerror('load_vm_fail',spec.id || vm.src,err);
			if(pvm){
				pvm[core_vm.aprand].loadingsub_count--;
				if(pvm[core_vm.aprand].loadingsub_count==0){
					core_vm.tryvmfn(pvm,null,'__onstart_a_zero_sub');
				}
			}
			cb.call(vm,err);
		}else{
			vm.__define(mod);
			vm.absrc=spec.id;
			if(vm[core_vm.aprand].cbs_on_define){
				for(var k in vm[core_vm.aprand].cbs_on_define)vm[core_vm.aprand].cbs_on_define[k]();
				vm[core_vm.aprand].cbs_on_define=[];
			}
			vm.__initdata_then_start(cb);
		}
	});
}