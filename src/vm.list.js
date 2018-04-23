var core_vm=require('./vm.0webcore.js');
var lopt_aid=0;
module.exports.gendata=function(vm,node,scope,pel){
	var array=node.dir.list.split(' in ');
	array[1]=core_vm.calexp.exp(vm,array[1],scope);
	var abpath=core_vm.cal.now_path(scope,array[1],vm,'listgen');
	abpath=abpath.replace(/^\s*|\s*$/g, '').replace(/\[([\s\S]*?)\]/g,function(a,b){
		return "."+b+".";
	}).replace(/^\.*|\.*$/g, '').replace(/\'|\"/g, '');
	var listdata;
	if(abpath.indexOf('this.')===0)listdata=core_vm.tool.objGetDeep(vm,abpath.substr(5));
	else listdata=core_vm.tool.objGetDeep(vm.data,abpath);
	return [array,abpath,listdata];
}
var g_classid=0;
var gen_watch_listclass=function(node){
	if(node.watchs){
		node.listid=++g_classid;
	}
	if(node.childNodes)node.childNodes.forEach(function(cnode){gen_watch_listclass(cnode)})
}
module.exports.gen=function(vm,node,scope,pel){
	node.id='';
	var tmp=module.exports.gendata(vm,node,scope,pel);
	var array=tmp[0],abpath=tmp[1],listdata=tmp[2];
	if(!Array.isArray(listdata)){
		core_vm.onerror(vm.getapp(),'list_data_not_array',vm.absrc,{path:abpath},listdata);
		return;
	}else{
		gen_watch_listclass(node);
		var new_scope={
			alias:array[0],
			palias:array[1],
			path:abpath,
			pscope:scope,
		};
		new_scope.listdata=listdata;
		new_scope.$index=0;
		var lopt={
			vm:vm,
			node:node,
			scope:new_scope,
		};
		var listing;
		listing=vm[core_vm.aprand].watching_list;
		listing[abpath]=listing[abpath]||[];
		listing[abpath].push(lopt);
		lopt.pel=pel;
			vm.__addto_onstart(function(){
				if(pel.nodeName=='#document-fragment' && pel.id==vm.id+'__tmp')lopt.pel=vm.pel;
			});
			lopt.sn_in_parent=pel.childNodes.length;
		for(var k=0,len=listdata.length;k<len;k++){
			core_vm.list.new_node(k,listdata[k],lopt,lopt.sn_in_parent+k,'init');
		}
	}
}
module.exports.$add=function(lopt,k,v){
	var insert_pos=core_vm.list.get_fel_sn_in_parent(lopt,'add')+k;
	core_vm.list.new_node(k,v,lopt,insert_pos,'add');
}
module.exports.$delat=function(lopt,index,oldv){
	var sn_in_parent=core_vm.list.get_fel_sn_in_parent(lopt,'delat');
	var childs=lopt.pel.childNodes;
	lopt.vm.delel(childs[sn_in_parent+index]);
}
module.exports.$clean=function(lopt){
	var sn_in_parent=core_vm.list.get_fel_sn_in_parent(lopt,'clean');
	for(var i=this.length-1;i>-1;i--)lopt.vm.delel(lopt.pel.childNodes[sn_in_parent+i]);
}
module.exports.$rebuild=function(lopt){
	var sn_in_parent=core_vm.list.get_fel_sn_in_parent(lopt,'rebuild');
	for(var k=0,len=this.length;k<len;k++){
		core_vm.list.new_node(k,this[k],lopt,sn_in_parent+k,'rebuild');
	}
}
module.exports.new_node=function(k,v,lopt,insert_pos,where){
	var scope_node=core_vm.tool.objClone(lopt.node);
	delete scope_node.dir.list;
	delete scope_node['id'];
	lopt.scope.$index=k;
	core_vm.cal.nodeid(lopt.vm,scope_node,lopt.scope);
	core_vm.create.nodes(lopt.vm,scope_node,lopt.scope,lopt.pel,insert_pos,true);
}
module.exports.get_fel_sn_in_parent=function(lopt){
	return lopt.sn_in_parent;
}
