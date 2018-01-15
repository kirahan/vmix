var core_vm=require('./vm.0webcore.js');
	var check_array_repeat=function(s,listid,index){
		var len=s.length;
		for(var i=len-1;i>-1;i--){
			if(s[i].listid && s[i].listid ==listid && s[i].$index==index){
				s.splice(i,1);
			}
		}
	}
var calnode_watch=function(vm,node,scope,where){
	if(!node.watchs  )return;
	var watchs=node.watchs;
	for (var j = 0,len=watchs.length; j<len; j++){
		var dataname=watchs[j][0];
		var elattr=watchs[j][1];
		if(elattr.indexOf('js:')!==0 && elattr[0]=='{')elattr=core_vm.calexp.exp(vm,elattr,scope);
		node.id=node.id||core_vm.cal.forece_calnodeid(vm,node,scope,'watch');
		var wopt={
			vm:vm,
			node:node,
			elid:node['id'],
			scope:scope,
			action:'prop',
			$index:scope.$index
		};
		if(node.listid)wopt.listid=node.listid;
		var  func,para,toelattr
		if(elattr.indexOf('js:')==0){
			vm[core_vm.aprand].inline_watchjs.push(elattr.substr(3));
			wopt.watchfunc='inlinejs_watch__'+(vm[core_vm.aprand].inline_watchjs.length-1);
			wopt.watchpara=null;
		}else if(elattr.indexOf('-toel-')>0){
			var array=elattr.split('-toel-');
			wopt.toelattr=array[1];
			var tmp=core_vm.tool.parse_func_para(array[0]);
			wopt.watchfunc=  tmp[0];
			wopt.watchpara=  tmp[1];
		}else if(elattr.substr(0,5)=='toel-'){
			wopt.toelattr=elattr.substr(5);
		}else{
			var tmp=core_vm.tool.parse_func_para(elattr);
			wopt.watchfunc=  tmp[0];
			wopt.watchpara=  tmp[1];
		}
		var watch_path=core_vm.cal.now_path(scope,dataname,vm,'watch_path');
		var key=watch_path.substr(watch_path.lastIndexOf('.')+1);
		if(watch_path[0]=='[' && watch_path[watch_path.length-1]==']')watch_path=watch_path.substr(1,watch_path.length-2);
		watch_path=watch_path.replace(/\[/g,'.').replace(/\]/g,'');
		if(watch_path[0]=='.')watch_path=watch_path.substr(1);
		if(where=='noel'){
			wopt.elid=-2;
		}
		if(watch_path.indexOf('.-1')>-1){
			alert("watch_path.indexOf('.-1')>-1");
			continue;
		}
		var watch_obj=vm.data;
		var if_is_state='data';
		if(watch_path.indexOf('this.data.')==0){
			watch_path=watch_path.substr(10);
			watch_obj=vm.data||{};
			if_is_state='data';
		}else	if(watch_path.indexOf('this.state.')==0){
			watch_path=watch_path.substr(11);
			watch_obj=vm.state||{};
			if_is_state='state';
		}else	if(watch_path.indexOf('this.option.')==0){
			watch_path=watch_path.substr(12);
			watch_obj=vm.option||{};
			if_is_state='option';
		}
		var value=core_vm.tool.objGetDeep(watch_obj,watch_path);
		if(!wopt.watchfunc){
		}else if(wopt.watchfunc){
			if(wopt.node.tag!=='_exptext_'){
				vm.__addto_onshow(function(){
					core_vm.watchcb.watch(wopt,watch_path,'',value);
				});
			}
		}
		var watching=vm[core_vm.aprand]['watching_'+if_is_state];
		if(watching){
			watching[watch_path]=watching[watch_path]||[];
			if(scope.$index!==undefined)check_array_repeat(watching[watch_path],wopt.listid,wopt.$index)
			watching[watch_path].push(wopt);
		}
	}
}
exports=module.exports={
	cal:calnode_watch,
}
