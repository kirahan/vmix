var core_vm=require('./vm.0webcore.js');
module.exports.setproto=function(proto){
proto.__confirm_set_data_to_el=function(vm,p,v,oldv){
	if(oldv==undefined) oldv=vm.__getData(p);
	if(oldv===v)return;
	vm.__setData(p,v);
	var ps=p.split('.');
	var len=ps.length;
	if(ps[len-1]==parseInt(ps[len-1])){
		var strp=p.substr(0,p.lastIndexOf('.'));
	}
	var __watching_data=vm[core_vm.aprand].watching_data[p]||vm[core_vm.aprand].watching_data['this.data.'+p];
	if(Array.isArray(__watching_data)){
		var ifcheck=false;
		__watching_data.forEach(function(opt,w_sn){
			if(opt.listid){
				var ps=p.split('.');
				var listpath='';
				for(var i=0;i<len;i++){
					if(i==0)listpath=ps[0];else listpath+='.'+ps[i];
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
				opt.el=vm.getel('@'+opt.listid);
				if(opt.el){
					opt.el=opt.el[index];
					core_vm.watchcb.watch(opt,p,oldv,v);
				}
			}else{
				core_vm.watchcb.watch(opt,p,oldv,v);
			}
		})
	}
}
proto.__confirm_add_data_to_el=function(vm,p,index,v,cb){
	var array=vm.__getData(p);
	if(!Array.isArray(array))return cb(false);
	index=parseInt(index);
	if(index==-1)index=array.length;
	array.splice(index,0,v);
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