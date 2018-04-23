var core_vm=require('./vm.0webcore.js');
module.exports.create=function(vm,node,scope,pel,insert_pos){
	if(node.tag=='_root_' ){
		core_vm.create.nodes(vm,node,scope,pel);
		return ;
	}
	if(!vm){
		core_vm.delalert.error('create miss vm')
		return;
	}
	if(node.utag=='slot'){
		node=core_vm.inject.use_inject_nodes_when_create(vm,node,scope)||node;
	}
	var newvmopt=core_vm.createvm(vm,node,scope);
	if(node.dir.hook && node.dir.hook.indexOf('node:')==0){
		core_vm.elhook(vm,null,node.dir.hook.substr(5),'beforeCreated',node);
	}
	if(node.tag=='_text_' ||(node.tag=='_exptext_' && !node.watchs)  ){
		if(pel.nodeName=='#document-fragment' ||pel.id==vm.id+'__tmp'){
			thisel= document.createTextNode(node.text);
			pel.appendChild( thisel);
			return;
		}else{
			pel.innerHTML=pel.innerHTML+node.text;
			return;
		}
	}
	core_vm.createcommon.idclass(vm,node,scope);
	var thisel;
	if(node.tag=='_exptext_')thisel= document.createElement('span');
	else thisel=document.createElement(node.tag);
	if(!thisel){
		return null;
	}
	if(node.listid)thisel.listid=node.listid;
	if(node.id ){
		thisel.id=node.id;
	}
	for(var k in node.attr){
		if(k=='text' || k=='html')continue;
		thisel.setAttribute( k,node.attr[k])
	}
	if(node.classList.length>0){
		core_vm.web_private_style.check(vm,node);
		thisel.className=node.classList.join(' ');
	}
	if(newvmopt){
		pel.appendChild( thisel);
		newvmopt.el=thisel;
		vm.appendChild(newvmopt,node,1);
	}else if(thisel){
		core_vm.createcommon.event(vm,node,scope,thisel);
		if(node.tag=='text'){	 thisel.textContent=node.text;			node.childNodes=[];}
		else if(node.attr.text){ thisel.textContent=node.attr.text;		node.childNodes=[];}
		else if(node.attr.html) {thisel.innerHTML=node.attr.html;		node.childNodes=[];}
		else if(node.text)		{thisel.textContent=node.text;			node.childNodes=[];}
		if(insert_pos==undefined || insert_pos==pel.childNodes.length)pel.appendChild(thisel);
		else pel.insertBefore(thisel,pel.childNodes[insert_pos]);
		if(node.dir.hook)core_vm.elhook(vm,thisel,node.dir.hook,'selfCreated');
		if(node.childNodes && node.childNodes.length>0 && !node.childskip_inject){
			core_vm.create.nodes(vm,node,scope,thisel);
		}
		if(node.dir.hook)core_vm.elhook(vm,thisel,node.dir.hook,'childrenCreated');
	}
	return thisel;
}
module.exports.nodes=function(vm,node,scope,pel,insert_pos,iflist){
	var nodes=iflist?[node]:(node.childNodes||[]);
	if(!Array.isArray(nodes)) nodes=[nodes];
	if(nodes.length==0)nodes=[];
	var needif=0;
	var if_result=[],start_index=-1;
	core_vm.createblock.find_block(nodes,vm,scope,pel);
	for(var sn=0,len=nodes.length;sn<len;sn++){
		if(nodes[sn].dir && nodes[sn].dir.filter){
			needif=1;
			break;
		}
	}
	for(var sn=0,len=nodes.length;sn<len;sn++){
		var node=nodes[sn];
		if(sn=='if_result'||!node.tag)continue;
		if(node.$injectscope){
			if(node.$injectfromvm_sid){
				var inject_vm=vm.getcache().vmsbysid[node.$injectfromvm_sid];
				if(!inject_vm){
					core_vm.devalert(vm,'no inject_vm')
					continue;
				}else{
					vm=inject_vm;
				}
			}
			scope=node.$injectscope;
		}
		if(needif){
			if(!node.dir || !node.dir.filter){
				if_result[sn]=true;
				start_index=sn;
			}else{
				core_vm.calif.single(vm,if_result,node.dir.filter,sn,scope,start_index);
				if(node.dir.filter=='else')start_index=sn+1;
			}
		}
		if(needif===0 || if_result[sn]===true){
			if(!node.dir.list){
				module.exports.create(vm,node,scope,pel,insert_pos);
			}else{
				core_vm.list.gen(vm,node,scope,pel);
			}
		}
	}
}
