var core_vm=require('./vm.0webcore.js');
module.exports.biaojiinject_in_calcommon=function(vm,scope,nodes){
	nodes.forEach(function(node,sn){
		core_vm.inject.biaojiinject_level_1(vm,scope,node.childNodes);
	});
}
module.exports.biaojiinject_level_1=function(vm,scope,nodes){
	nodes.forEach(function(node,sn){
		node.$injectscope=scope;
		node.$injectfromvm_sid=vm.sid;
		node.attr=node.attr ||{};
		node.attr.owner='parent';
	});
}
module.exports.inject_one_string=function(pvm,vm,utag,text,where){
	var type=typeof (vm[where][utag]);
	var caninject=true;
	if(type=='undefined')vm[where][utag]=text;
	else if(type=='boolean')vm[where][utag]=Boolean(text);
	else if(type=='number')vm[where][utag]=Number(text);
	else if(type=='float')vm[where][utag]=parseFloat(text);
	else if(type=='string')vm[where][utag]=String(text);
	else if(type=='object'){
		if(typeof (text)=='string'){
			var fn=new Function("e",'return   [ '+text+' ] ');
			var obj;
			try{
				obj=fn.call({},null);
			}catch(e){}
			if(obj)text=obj[0];
		}
		if(typeof (text)=='object'){
			if(Array.isArray(vm[where][utag]) && Array.isArray(text) )vm[where][utag]=text;
			else if(!Array.isArray(vm[where][utag]) && !Array.isArray(text) )vm[where][utag]=text;
			else caninject=false;
		}else{
			caninject=false;
		}
	}else{
		vm[where][utag]=text;
	}
	if(caninject){
		if(vm[core_vm.aprand].datafrom_parent.indexOf(utag)===-1)vm[core_vm.aprand].datafrom_parent.push(utag);
	}
}
module.exports.cal_inject_node=function(vm,node){
	var innode=node;
	var new_data_node={tag:'data',utag:'data',attr:{},attrexp:{},childNodes:[]};
	var new_attr_node={tag:'option',utag:'option',attr:{},attrexp:{},childNodes:[]}
	var finddata=0,findattr=0;
	core_vm.tool.each(innode.attr,function(v,k){
		if(k=='id' || k=='style' || k=='role' || k=='event'|| k==core_vm.wap.config.vmtag+'-src')return;
		if(k.indexOf('data-')===0){
			k=k.substr(5);
			finddata=1;
			if(v.indexOf('{')==0)new_data_node.attrexp[k]=v;
			else new_data_node.attr[k]=v;
		}else if(k.indexOf('option-')===0){
			k=k.substr(7);
			findattr=1;
			if(typeof (v)=='string' && v.indexOf('{')==0)new_attr_node.attrexp[k]=v;
			else new_attr_node.attr[k]=v;
		}
	})
	if(finddata==1)innode.childNodes.push(new_data_node);
	if(findattr==1)innode.childNodes.push(new_attr_node);
}
module.exports.inject_from_pvm_before_start=function(vm){
	if(!vm[core_vm.aprand].pvmnode ){
		return;
	}
	var pvm=vm.pvm;
	var innode=core_vm.tool.objClone(vm[core_vm.aprand].pvmnode);
	innode.childNodes.forEach(function(node,sn){
		if(!core_vm.isobj(node))return;
		node.attr=node.attr||{};
		if(node.utag=='option' || node.utag=='data'){
			vm[node.utag]=vm[node.utag]||{};
			if(node.attrexp){
				for(var k in node.attrexp)node.attr[k]=node.attrexp[k];
			}
			for(var k in node.attr){
				var text=node.attr[k];
				if(typeof (node.attr[k])!=='string' || text.indexOf('this.')==-1){
					module.exports.inject_one_string(pvm,vm,k,text,node.utag);
					continue;
				}
				var watch_path=text.replace(/^\{*|\}*$/g, '').replace('this.','');
				var in_data=core_vm.tool.objGetDeep(pvm,watch_path);
				if(in_data==undefined){
					in_data=core_vm.calexp.exp(pvm,text,pvm[core_vm.aprand].rootscope,'_exptext_');
				}
				if(typeof (in_data)=='object'){
					in_data=core_vm.tool.objClone(in_data);
				}
				module.exports.inject_one_string(pvm,vm,k,in_data,node.utag);
			}
		}else{
			if(node.attr.slot){
				vm[core_vm.aprand].pvmslot[node.attr.slot]=node;
			}else{
				vm[core_vm.aprand].pvmslot[core_vm.aprand]=vm[core_vm.aprand].pvmslot[core_vm.aprand]||[];
				vm[core_vm.aprand].pvmslot[core_vm.aprand].push(node);
			}
		}
	});
}
module.exports.use_inject_nodes_when_create=function(tvm,node,scope){
	node.attrexp=node.attrexp||{};
	if(scope && node.attrexp && node.attrexp.name){
		node.attrexp.name=core_vm.calexp.exp(tvm,node.attrexp.name,scope);
	}
	var pnode=node.parentNode;
	var pc=node.parentNode.childNodes;
	var index=pc.indexOf(node);
	var name=!scope ?'' :(node.attr.name||node.attrexp.name);
	if(scope && name){
		var res=tvm[core_vm.aprand].pvmslot[name];
		if(res){
			if(index===-1){
				node.tag=res.tag;
				node.utag=res.utag;
				node.attr={};
				for(var k in res.attr)node.attr[k]=res.attr[k];
				node.childNodes=res.childNodes;
			}else{
				pc.splice(index,1,res);
				pc[index].parentNode=pnode;
				return pc[index];
			}
			module.exports.bind_vm_pvm_when_inject_node(tvm,res);
		}
	}else if(!scope && tvm[core_vm.aprand].pvmslot[core_vm.aprand]){
		var index=pc.indexOf(node);
		if(index==-1)index=0;
		pc.splice(index,1);
		var mainslots=tvm[core_vm.aprand].pvmslot[core_vm.aprand];
		for(var k=0;k<mainslots.length;k++){
			mainslots[k].attr.owner='parent';
			module.exports.bind_vm_pvm_when_inject_node(tvm,mainslots[k]);
			pc.splice(index+k,0,mainslots[k]);
			mainslots[k].parentNode=pnode;
		}
	}
}
module.exports.bind_vm_pvm_when_inject_node=function(tvm,node){
	if(!node)return;
	if(node.event){
		for(var k in node.event){
			tvm[core_vm.aprand].domeventnames[k]=1;
		}
	}
	if(node.childNodes && node.childNodes.length>0){
		for(var i=0,len=node.childNodes.length;i<len;i++)module.exports.bind_vm_pvm_when_inject_node(tvm,node.childNodes[i]);
	}
}
