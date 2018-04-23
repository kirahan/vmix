var core_vm=require('./vm.0webcore.js');
var seed_of_appsid=0;
var appclass=function(){
	this.sid=++seed_of_appsid;
	this.config={};
	core_vm.rootvmset.checkappconfig(this,0);
	this.hasstart=0;
	this.__events={}
	Object.defineProperty(this,'__events',{enumerable:false});
}
var proto=appclass.prototype;
proto.sub=function(name,vm,cb){
	this.__events[name]=this.__events[name]||[];
	this.__events[name].push([vm,cb,0]);
}
proto.subonce=function(name,vm,cb){
	this.__events[name]=this.__events[name]||[];
	this.__events[name].push([vm,cb,1]);
}
proto.unsub=function(name,vm,cb){
	var evs=this.__events[name];
	if(!evs)return ;
	for(var k=evs.length-1;k>-1;k--){
		if(vm==evs[k][0] && cb==evs[k][1]){
			evs.splice(k,1);
		}
	}
}
proto.pub=function(name,data,vm,cb){
	if(typeof(cb)!=='function')cb=function(){}
	var evs=this.__events[name];
	if(!evs)return cb({error:'no.listener'})
	core_vm.tool.each(evs,function(ev,sid){	if(ev[2]===-1)delete evs[sid];	})
	core_vm.tool.each(evs,function(ev){
		ev[1].call(ev[0],data,vm,function(data){
			cb.call(vm,data,ev[0])
		});
		if(ev[2]==1)ev[2]=-1;
	})
	for(var k=evs.length-1;k>-1;k--){
		if(-1==evs[k][2])evs.splice(k,1);
	}
}
proto.loadfile=function(type,filename,cb){
	var loadobj={url:filename};
	if(type=='vm')loadobj.type='vm';
	else if(type=='text')loadobj.type='text';
	else loadobj.type='lib';
	loadobj.urlsid=2;
	loadobj.refsid=2;
	loadobj.app=this;
	core_vm.require.load(loadobj,function(err,module,spec){
		if (core_vm.isfn(cb)) cb(err,module,spec);
	})
}
proto.setData=function(vm,p,v,cb){
	if(!(vm instanceof core_vm.define.vmclass))return;
	if(!core_vm.isfn(cb))cb=this.blankvm.__blankfn;
	if(vm[core_vm.aprand].datafrom_store.indexOf(p.split('.')[0])==-1)return cb(false);
	var oldv=vm.__getData(p);
	if(oldv===v){
		cb(false);
		return;
	}
	this.blankvm.__confirm_set_data_to_el(vm,p,v);cb(true);
	var fn=vm.event['app.setdata'];
	if(core_vm.isfn(fn))fn.call(vm,{path:p,oldv:oldv,newv:v})
}
proto.addData=function(vm,p,index,v,cb){
	if(!(vm instanceof core_vm.define.vmclass))return;
	if(!core_vm.isfn(cb))cb=this.blankvm.__blankfn;
	if(vm[core_vm.aprand].datafrom_store.indexOf(p.split('.')[0])==-1)return cb(false);
	this.blankvm.__confirm_add_data_to_el(vm,p,index,v,function(res){
		cb(res);
	});
	var fn=vm.event['app.adddata'];
	if(core_vm.isfn(fn))fn.call(vm,{path:p,index:index,value:v})
}
proto.delData=function(vm,p,index,count,cb){
	if(!(vm instanceof core_vm.define.vmclass))return;
	if(!core_vm.isfn(cb))cb=this.blankvm.__blankfn;
	if(vm[core_vm.aprand].datafrom_store.indexOf(p.split('.')[0])==-1)return cb(false);
	this.blankvm.__confirm_del_data_to_el(vm,p,index,count||1,function(res){
		cb(res);
	});
	var fn=vm.event['app.deldata'];
	if(core_vm.isfn(fn))fn.call(vm,{path:p,index:index,count:count});
}
proto.use=function(where,name,fn){
	if(!core_vm.isstr(where)  )return;
	if(core_vm.isobj(name)){
		for(var k in name)this.use(where,k,name[k]);
		return;
	}
	if( !core_vm.isstr(name) )return;
	if(where=='vm'){
		if(!core_vm.isobj(fn) || (!fn.template&&!fn.body))return;
		this.__cache.vmbody[name]=fn.template||fn.body;
		this.__cache.vmstyle[name]=fn.style||'';
		this.__cache.add_vmlib(name,{exports:fn.lib||{}});
		this.__cache.keep('vm',name);
		return;
	}else	if(where=='lib'){
		this.__cache.add_jslib(name,{exports:fn});
		this.__cache.keep('lib',name);
		return;
	}
	if(where==='block' && !core_vm.isstr(fn))return;
	if(where!=='block' &&  !core_vm.isfn(fn))return;
	if(where=='vmprototype'){
		core_vm.define.extend(name,fn,this);
	}else if(this.__cache.use[where]){
		this.__cache.use[where][name]=fn;
	}
}
module.exports=appclass;