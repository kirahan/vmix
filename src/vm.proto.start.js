var core_vm=require('./vm.0webcore.js');
module.exports.setproto=function(proto){
proto.__addto_onstart=function(cb){
	if(this[core_vm.aprand].has_started!==1){
		this[core_vm.aprand].cbs_onstart.push(cb);
	}else{
		core_vm.tryfn(this,cb,[this],'vm.onstart')
	}
}
proto.__addto_onshow=function(cb){
	if(this[core_vm.aprand].has_started!==1){
		this[core_vm.aprand].cbs_onshow.push(cb);
	}else{
		core_vm.tryfn(this,cb,[this],'vm.onshow.addto')
	}
}
proto.__onshow=function(){
	for(var k in this[core_vm.aprand].cbs_onshow){
		core_vm.tryfn(this,this[core_vm.aprand].cbs_onshow[k],[this],'vm.onshow.exe')
	}
	this[core_vm.aprand].cbs_onshow=[];
	for(var k in this[core_vm.aprand].cbs_onstart){
		this[core_vm.aprand].cbs_onstart[k].call(this);
	}
	this[core_vm.aprand].cbs_onstart=[];
	if(core_vm.isfn(this[core_vm.aprand].startcb_of_vmstart)){
		core_vm.tryfn(this,this[core_vm.aprand].startcb_of_vmstart,[],'vm.start.cb,id='+this.id);
	}else{
	}
	this.__clean_tmp_after_start();
}
var check_slot=function(vm,nodes){
	for(var sn=0,len=nodes.length;sn<len;sn++){
		if(nodes[sn].tag=='slot' && (!nodes[sn].attr || !nodes[sn].attr.name) ){
			core_vm.inject.use_inject_nodes_when_create(vm,nodes[sn]);
		}else{
			check_slot(vm,nodes[sn].childNodes);
		}
	}
}
proto.__vmstart=function(startcb){
	if(this[core_vm.aprand].has_started==1){
		return;
	}
	var vm=this;
	if(core_vm.isfn(startcb))vm[core_vm.aprand].startcb_of_vmstart=startcb;
	if(core_vm.isfn(this.hookStart) && !this.__hookStart_has_called){
		vm.getapp().hookstart_ing_vm=vm;
		try{
			this.hookStart.call(this,function(result){
				vm.getapp().hookstart_ing_vm=null;
				vm.__hookStart_has_called=1;
				if(result!==false){
					vm.__vmstart(startcb);
				}else{
					if(vm[core_vm.aprand].startcb_of_vmstart)vm[core_vm.aprand].startcb_of_vmstart(false);
					vm.__init(true);
				}
			});
		}catch(e){
			core_vm.devalert(vm.getnap(),'hookStart error',vm.src,e)
			vm.getapp().hookstart_ing_vm=null;
			this.hookStart=null;
			vm.__vmstart(startcb);
		}
		return;
	}
	core_vm.tryvmfn(vm.pvm,vm,'beforechildstart');
	core_vm.tryvmfn(vm,null,'beforestart');
	var bodytext=vm.getcache().get_body(vm);
	if(core_vm.isfn(vm.hookTemplate)){
		core_vm.cal.nodejson(vm,vm.hookTemplate(bodytext));
	}else{
		core_vm.cal.nodejson(vm,bodytext);
	}
	check_slot(vm,vm[core_vm.aprand].nodejson[0].childNodes);
	var styletext=vm.getcache().get_vmstyle(vm);
	if(styletext){
		if(core_vm.isfn(vm.hookStyle)){
			styletext=vm.hookStyle(styletext);
		}
		core_vm.web_private_style.add(vm,styletext);
	}
	core_vm.start.web(vm);
	vm[core_vm.aprand].has_started_self=1;
	if(vm.getapp().config.strategy.append_to_pel_wait_loading_child_vm==false){
		vm.__append_bin_el();
	}
	if(vm[core_vm.aprand].loadingsub_count==0){
		vm.__onstart_a_zero_sub()
	}
}
proto.__onstart_a_zero_sub=function(){
	var vm=this;
	if(this.__top_fragment && this[core_vm.aprand].has_started_self==1
		&& vm.getapp().config.strategy.append_to_pel_wait_loading_child_vm==true){
		vm.__append_bin_el();
	}
	if(vm.pvm){
		setTimeout(function(){
			vm.pvm[core_vm.aprand].loadingsub_count--;
			if(vm.pvm[core_vm.aprand].loadingsub_count==0){
				vm.pvm.__onstart_a_zero_sub();
			}
		},0);
	}else{
		setTimeout(function(){
			if(vm.getapp().hasstart==0){
				vm.getapp().hasstart=1;
				console.log('执行app.onstart1')
				vm.getapp().onstart();
			}
		},10);
	}
}
proto.__after_append_real=function(){
	var vm=this;
	vm[core_vm.aprand].has_started=1;
	delete vm._is_fresh_ing;
	vm.__onshow.call(vm);
	core_vm.tryvmfn(vm,vm,'onstart');
	core_vm.tryvmfn(vm.pvm,vm,'onchildstart');
}
proto.__after_append=function(){
	var vm=this;
	if(vm.getapp().config.strategy.append_to_pel_wait_loading_child_vm==true){
		if(this.pvm){
			this.pvm.__addto_onshow(function(){
				vm.__after_append_real();
			})
		}else{
			this.__after_append_real()
		}
	}else{
		this.__after_append_real()
	}
}
proto.__append_bin_el=function(){
	var vm=this;
	var fragment=vm.__top_fragment;
	if(!fragment)return ;
	var children=fragment.childNodes||[];
	var len=children.length;
	for(i=0;i<len;i++)vm[core_vm.aprand].els.push(children[i]);
	var vmpel=vm.pel;
	var i=0;
	var __appento_ppel=false;
	if(vm[core_vm.aprand].nodejson[0].childNodes.length==1 && len==1 &&
		((core_vm.elget(vmpel,'appendto')=='ppel')||'ppel'==vm.config.appendto)){
			vm.config.appendto='ppel';
			core_vm.elset(vmpel,'_role_','placeholder');
			var el=children[0];
			var ppel=vmpel.parentNode;
			ppel.appendChild(el);
			vmpel.after(el);
			ppel.removeChild(vmpel);
			vm.__addto_onshow(function(){
				vm.ppel=vm[core_vm.aprand].els[0].parentNode;
			})
			el.replaced_pel=vmpel;
			var node=vm[core_vm.aprand].nodejson[0].childNodes[0];
			node.event=node.event||{};
			if(vm[core_vm.aprand].pvmelevent)for(var k in vm[core_vm.aprand].pvmelevent)node.event[k]=vm[core_vm.aprand].pvmelevent[k];
			vm.__bind_as_top_view(node,el,'because.ppel');
			__appento_ppel=true;
	}else{
		vmpel.appendChild(fragment);
	}
	delete vm.__top_fragment;
	for(var k in vm[core_vm.aprand].pvmelevent){
		vm[core_vm.aprand].domeventnames[k]=1;
	}
	if(!__appento_ppel){
		vm.__bind_events();
	}
	setTimeout(function() {
		vm.__after_append();
	},0);
}
proto.restart=function(json,cb){
	this.close();
	if(core_vm.isfn(json)){
		this.start(cb);
	}else if(core_vm.isobj(json)){
		if(json.src){
			this.__setsrc(json.src);
		}
		this._is_fresh_ing=json.fresh===true ?true:false;
		this.start(cb);
	}else{
		this.start(cb);
	}
}
proto.start=function(cb){
	if(!core_vm.isfn(cb))cb=function(){}
	if(this[core_vm.aprand].has_defined){
		this.__initdata_then_start(cb);
	}else{
		core_vm.load(this,cb);
	}
}
proto.show=function(){
	var els=this[core_vm.aprand].els;
	for(var i=els.length-1;i>-1;i--){
		els[i].style.display=core_vm.elget(els[i],'lastdisplay')||"";
	}
}
proto.hide=function(){
	var els=this[core_vm.aprand].els;
	for(var i=els.length-1;i>-1;i--){
		core_vm.elset(els[i],'lastdisplay',els[i].style.display||"");
		els[i].style.display='none';
	}
}
}