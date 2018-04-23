var core_vm=require('./vm.0webcore.js');
var _reqlib=require('./vm.requirelib.js');
module.exports=function(vm,cb){
	if(vm[core_vm.aprand].has_defined || vm[core_vm.aprand].has_started ||!vm.src){
		return;
	}
	if(!core_vm.isfn(cb))cb=function(){}
	if(vm.getcache().vmlib[vm.src]){
		vm.getcache().add_ref('vm',vm.src,vm[core_vm.aprand].absrcid,'loadsub');
		vm.__define(core_vm.tool.objClone(vm.getcache().vmlib[vm.src].exports));
		vm.absrc=vm.src;
		vm.__initdata_then_start(cb);
		return;
	}
	var pvm=vm.pvm;
	if(pvm)pvm[core_vm.aprand].loadingsub_count++;
	var fresh=vm._is_fresh_ing ;
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
		if(err){
			core_vm.onerror(vm.getapp(),'load_vm_fail',spec.id || vm.src,err);
			if(pvm){
				pvm[core_vm.aprand].loadingsub_count--;
				if(pvm[core_vm.aprand].loadingsub_count==0){
					pvm.__onstart_a_zero_sub()
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