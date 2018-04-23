
var core_vm=require('./vm.0webcore.js');
module.exports.setproto=function(proto){
proto.add_jslib=function(id,mod,refsid){
	this.jslib[id]=mod;
	if(refsid)mod.refsids=[refsid];
	var path=this.getapp().config.path;
	for(var k in path.lib){
		if(path.lib[k]===id)this.keep('lib',id);
	}
}
proto.get_jslib=function(id){
	return this.jslib[id];
}
}