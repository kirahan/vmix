var core_vm=require('./vm.0webcore.js');
var global_vmid_seed=10;
var global_nodeid_seed=0;
var vmclass=function(id){
	this.id=id;
	this.__init();
}
var vmproto=vmclass.prototype;
var cb=function(){}
var need_keep=['appsid','id','sid','src','absrc','pel','pvm',];
var need_keep_rand=['absrcid','pvmevent','pvmelevent','pvmnode'];
vmproto.__init=function(ifclose){
	if(!ifclose){
		this.sid=this.sid||(++global_vmid_seed);
		this.id=this.id||('id_auto_'+String(this.sid));
	}
	if(ifclose){
		this.__auto_unsub_app();
		for(var k in this){
			if(!this.hasOwnProperty(k))continue;
			else if(need_keep.indexOf(k)>-1)continue;
			else if(k===core_vm.aprand)continue;
			else {
				this[k]=null;
			}
		}
		for(var k in this[core_vm.aprand])if(need_keep_rand.indexOf(k)==-1)delete this[core_vm.aprand][k];
	}
	if(!ifclose){
		this[core_vm.aprand]={};
		Object.defineProperty(this,core_vm.aprand, {configurable: false,enumerable: false,writable:false});
	}
	let obj=this[core_vm.aprand];
	if(!ifclose){
		obj.pvmevent={};
		obj.pvmelevent={};
		obj.pvmnode=null;
	}
	obj.pvmslot={};
	obj.has_started=0;
	obj.has_defined=0;
	obj.append_data={};
	obj.append_option={};
	obj.datafrom_store=[];
	obj.datafrom_parent=[];
	obj.cbs_on_define=[];
	obj.cbs_onstart=[];
	obj.cbs_onclose=[];
	obj.cbs_onshow=[];
}
vmproto.__clean_tmp_after_start=function(){
	delete this[core_vm.aprand].pvmslot;
	delete this[core_vm.aprand].append_data;
	delete this[core_vm.aprand].append_option;
	delete this[core_vm.aprand].has_started_self;
	delete this[core_vm.aprand].has_defined;
	delete this[core_vm.aprand].cbs_onstart;
	delete this[core_vm.aprand].cbs_onshow;
	delete this[core_vm.aprand].loadingsub_count;
	delete this[core_vm.aprand].startcb_of_vmstart;
}
vmproto.__define=function(vmobj){
	var tvm=this;
	if(typeof (vmobj)!=='object' ||vmobj===null)vmobj={};
	if(vmobj.sid)delete vmobj.sid;
	if(vmobj.id)delete vmobj.id;
	if(vmobj.src)delete vmobj.src;
	if(vmobj.pel)delete vmobj.pel;
	if(vmobj.ppel)delete vmobj.ppel;
	for(var k in vmobj){
		if(vmproto[k]===undefined)tvm[k]=vmobj[k];
	}
	tvm.data=tvm.data||{};
	tvm.state=tvm.state||{};
	tvm.option=tvm.option||{};
	tvm.event=tvm.event||{};
	tvm.config=tvm.config||{};
	if(!Array.isArray(tvm.config.cacheClasses))tvm.config.cacheClasses=[];
	tvm.config.appendto= (tvm.config.appendto==='ppel')?'ppel':"pel";
	tvm.__auto_sub_app();
	var obj=this[core_vm.aprand];
	obj.newid_2_oldid={}
	obj.vmchildren={};
	obj.rootscope={};
	obj.nodejson=[];
	obj.seed_of_el_aid=0;
	obj.els_binded=[];
	obj.els=[];
	obj.elsdom={'id':{},'class':{},'role':{},'listel':{}};
	obj.private_style={};
	obj.domeventnames={};
	obj.domeventnames_binded=[];
	obj.cbs_onstart=[];
	obj.cbs_onclose=[];
	obj.cbs_onshow=[];
	obj.loadingsub_count=0;
	obj.has_defined=1;
	obj.has_started=0;
	obj.inline_onjs=[''];
	obj.inline_watchjs=[''];
	obj.watching_data={};
	obj.watching_state={};
	obj.watching_option={};
	obj.watching_list={};
	this.__ensure_fn();
	return this;
}
require("./vm.proto.child.js").setproto(vmproto);
require("./vm.proto.base.js").setproto(vmproto);
require("./vm.proto.store.js").setproto(vmproto);
require("./vm.proto.dataflow.data.js").setproto(vmproto);
require("./vm.proto.dataflow.option.js").setproto(vmproto);
require("./vm.proto.dataflow.state.js").setproto(vmproto);
require("./vm.proto.dataflow.child.js").setproto(vmproto);
require("./vm.proto.dataflow.toui.js").setproto(vmproto);
require("./vm.proto.elhtml.js").setproto(vmproto);
require("./vm.proto.elbind.js").setproto(vmproto);
require("./vm.proto.elgetter.js").setproto(vmproto);
require("./vm.proto.start.js").setproto(vmproto);
require("./vm.proto.close.js").setproto(vmproto);
require("./vm.proto.event.js").setproto(vmproto);
vmproto.__setsrc=function(src){
	if(typeof (src)!=='string')src='';
	this.src=src||'';
	if(this.src){
		this.absrc=_reqlib.gen_path(this.getapp(),this.src,this.pvm ?this.pvm.absrc:'',true,5);
		this[core_vm.aprand].absrcid=this.getcache().geturlsid(this.absrc);
	}
}
var libbatchdom=require("./vm.batchdom.js");
vmproto.batchdom=function(fn, ctx){
	libbatchdom.set(fn, ctx)
};
vmproto.getapp=function(){
	return core_vm.wap;
}
vmproto.getcache=function(){
	return core_vm.wap.__cache;
}
for(var k in vmproto){
	if(k[0]=='_')Object.defineProperty(vmproto,k,{configurable: false,enumerable:false,writable:false});
}
var _reqlib=require('./vm.requirelib.js');
var define=function(opt,uap){
	var tvm=new vmclass(opt.id);
	if(opt.el)tvm.pel=opt.el;
	tvm.getcache().vmsbysid[tvm.sid]=tvm;
	if(opt.pvm){
		tvm.getcache().vmparent[tvm.sid]=opt.pvm.sid;
		tvm.pvm=opt.pvm;
		tvm.pvm[core_vm.aprand].vmchildren= tvm.pvm[core_vm.aprand].vmchildren || {};
		tvm.pvm[core_vm.aprand].vmchildren[tvm.id]=tvm.sid;
	}
	tvm.__setsrc(opt.src||opt.url);
	return tvm;
}
module.exports={
	vmclass:vmclass,
	define:define,
	newvmid:function(){
		global_nodeid_seed++;
		return 'id_auto_'+global_nodeid_seed;
	},
	protect:function(){
	}
}
module.exports.extend=function(name,fn){
	if(core_vm.isfn(fn))vmproto[name]=fn;
}
