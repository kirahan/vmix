
var core_vm=require('./vm.0webcore.js');
module.exports.setproto=function(proto){
proto.check=function(type,id,refid){
  var mod=((type=='vm' && this.get_vmlib(id))
	  ||((type=='lib'||type=='json') && this.get_jslib(id))
	  ||(type=='css' && this.importstyle[id])
	  ||(type=='block' && this.importblock_txt[id])
	  );
  if(mod){
	if(mod.refids.indexOf(refid)===-1){
		mod.refids.push(refid)
	}
  }
  return mod?true:false;
}
proto.add_jslib_ref=function(libid,refid,where){
	var mod=  this.jslib[libid];
	if(mod && mod.refids && mod.refids.indexOf(refid)===-1){
		mod.refids.push(refid);
	}
}
proto.newjslib=function(id,mod,refid){
	this.jslib[id]=mod;
	if(refid)mod.refids=[refid];
	this.check_if_lib_inpath(id);
}
proto.get_jslib=function(id){
	return this.jslib[id];
}
}