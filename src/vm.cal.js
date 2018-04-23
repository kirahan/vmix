var core_vm=require('./vm.0webcore.js');
var calnodejson=function(vm,tempalte_html){
	vm[core_vm.aprand].node_max_sn=1;
	var html=vm.template || tempalte_html||'';
	html=core_vm.calif.multi(vm,html);
	var tmp=core_vm.calhtmltojson(html,vm[core_vm.aprand].node_max_sn,0,vm.getapp(),3);
	vm[core_vm.aprand].nodejson.push(tmp[0])
}
var forece_calnodeid=function(vm,node,scope,head){
		vm[core_vm.aprand].seed_of_el_aid++;
		return head+'_elid_'+vm.sid+'_'+vm[core_vm.aprand].seed_of_el_aid;
}
var calnodeid=function(vm,node,scope){
	if(!node.id){
		vm[core_vm.aprand].seed_of_el_aid++;
		node['id']='vm_elid_'+vm.sid+'_'+vm[core_vm.aprand].seed_of_el_aid;
	}
	return node.id;
}
var cal_now_path=function(pscope,str,vm,where){
	var abpath='';
	var t_scope=pscope;
	if(str==t_scope.alias){
		abpath=t_scope.path;
		if(t_scope.listdata!=undefined && t_scope.$index!==undefined){
			abpath+="."+t_scope.$index;
		}
	}else {
		while(1){
			if(str.indexOf(t_scope.alias+'.')==0){
				abpath=t_scope.path;
				if(t_scope.listdata!==undefined && t_scope.$index!==undefined){
					abpath+='.'+t_scope.$index;
				}
				abpath+='.'+str.replace(t_scope.alias+'.','');
				break;
			}
			t_scope=t_scope.pscope;
			if(t_scope==null)break;
		}
	}
	if(!abpath){
		abpath=str;
	}
	if(abpath[0]=='.')abpath=abpath.substr(1);
	return abpath;
}
var merge_json_str=function(vm,where,str,skipmerge){
	var fn=new Function("e",'return   [ '+str+' ] ');
	var obj;
	try{
		obj=fn.call({},null);
	}catch(e){}
	if(Array.isArray(obj) && obj[0]){
		if(skipmerge)return obj[0];
		else{
			vm[where]=vm[where]||{};
			if(typeof obj[0]=='object')core_vm.tool.deepmerge(vm[where],obj[0]);
		}
	}
}
exports=module.exports={
	nodejson:calnodejson,
	nodeid:calnodeid,
	forece_calnodeid:forece_calnodeid,
	now_path:cal_now_path,
	merge_json_str:merge_json_str,
}
