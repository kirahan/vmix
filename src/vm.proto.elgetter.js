var core_vm=require('./vm.0webcore.js');
module.exports.setproto=function(proto){
function intersect(arr1, arr2) {
	if(!Array.isArray(arr1)||!Array.isArray(arr2))return [];
    var res = [];
    for(var i = 0; i < arr1.length; i++){
      for(var j = 0; j < arr2.length; j++){
        if(arr1[i] == arr2[j]){
          res.push(arr1[i]);
          arr1.splice(i,1);
          arr2.splice(j,1);
          i--;
          j--;
        }
      }
    }
    return res;
};
proto.__delel_watchcb_notfind=function(id){
	for(var k in this[core_vm.aprand].elsdom.id){
		if(this[core_vm.aprand].elsdom.id[k]==id){
			delete this[core_vm.aprand].elsdom.id[k];
		}
	}
}
proto.getel=function(name){
	if(!name)return this[core_vm.aprand].els;
	if(name[0]!=='#' && name[0]!=='.'&& name[0]!=='$'&& name[0]!=='@')name='#'+name;
	var elsdom=this[core_vm.aprand].elsdom;
	if(name[0]=='#'){
		var id=elsdom.id[name.substr(1)];
		if(id==undefined){
			return null;
		}else if(id==null){
			delete elsdom.id[name.substr(1)];
			return null;
		}else{
			return document.getElementById(id);
		}
	}else{
		var els=[],ids=[];
		if(name[0]=='@'){
			ids=elsdom['listel'][name.substr(1)];
		}else if(name[0]=='$'){
			ids=elsdom['role'][name.substr(1)];
		}else if(name[0]=='.'){
			name=name.substr(1);
			if(name.indexOf('.')==-1){
				ids=elsdom['class'][name];
			}else{
				name=name.split('.');
				for(var k in name)name[k]=core_vm.tool.trim(name[k]);
				var id_s=[];
				for(var k in name){
					id_s[k]=[];
					if(Array.isArray(elsdom['class'][name[k]])){
						elsdom['class'][name[k]].forEach(function(tid){
							id_s[k].push(tid);
						})
					}
				}
				ids=intersect(id_s[0],id_s[1]);
				if(id_s.length>2){
					for(var i=2;i<id_s.length;i++)ids=intersect(ids,id_s[i]);
				}
			}
		}
		if(ids){
			for(var i=0,len=ids.length;i<len;i++){
				els.push(document.getElementById(ids[i])||null);
			}
			for(var i=ids.length-1;i>-1;i--){
				if(els[i]==null){
					els.splice(i,1);
					ids.splice(i,1);
				}
			}
		}
		return els;
	}
}
proto.__regel=function(type,name,webelid_or_mob_el,index){
	var elsdom=this[core_vm.aprand].elsdom;
	if(type=='id'){
		elsdom.id[name]=webelid_or_mob_el;
	}else	if(type=='listel'){
		elsdom.listel[name]=elsdom.listel[name] || [];
		var obj=elsdom.listel[name];
		if(obj.indexOf(webelid_or_mob_el)==-1){
			if(index!=undefined)obj.splice(index,0,webelid_or_mob_el)
			else obj.push(webelid_or_mob_el);
		}
	}else	if(type=='classList'){
		var array=name;
		for(var k in  array){
			if(core_vm.wap.config.strategy.cacheClassesAll!==true || this.config.cacheClasses.indexOf(array[k])===-1)continue;
			elsdom.class[array[k]]=elsdom.class[array[k]] || [];
			if(elsdom.class[array[k]].indexOf(webelid_or_mob_el)==-1){
				if(index!=undefined)elsdom.class[array[k]].splice(index,0,webelid_or_mob_el)
				else elsdom.class[array[k]].push(webelid_or_mob_el);
			}
		}
	}else	if(type=='role'){
		elsdom.role[name]=elsdom.role[name] || [];
		if(elsdom.role[name].indexOf(webelid_or_mob_el)==-1){
			if(index!=undefined)elsdom.role[name].splice(index,0,webelid_or_mob_el)
			else elsdom.role[name].push(webelid_or_mob_el);
		}
	}
}
proto.delel=function(thisel,ifchild,ifhas_remove_from_parent){
	var velid,vclass,role;
	if(!thisel)return;
	var elsdom=this[core_vm.aprand].elsdom;
	velid=thisel.getAttribute('id');vclass=thisel.getAttribute('classList');role=thisel.getAttribute('role');
	if(velid){
		for(var k in elsdom.id){
			if(elsdom.id[k]===velid)delete elsdom.id[k];
		}
		if(elsdom.id[velid])delete elsdom.id[velid];
		if(thisel.listid){
			var ids=elsdom['listel'][thisel.listid];
			if(Array.isArray(ids)){
				var index=ids.indexOf(velid);
				if(index>-1)ids.splice(index,1);
			}
		}
		if(role){
			if(elsdom.role[role]){
				var index=elsdom.role[role].indexOf(velid);
				if(index>-1)elsdom.role[role].splice(index,1);
			}
		}
		if(vclass){
			for(var k in  vclass){
				if(elsdom.class[vclass[k]]){
					var index=elsdom.class[vclass[k]].indexOf(velid);
					if(index>-1)elsdom.class[vclass[k]].splice(index,1);
				}
			}
		}
	}
	
	if(thisel.childNodes){
		for(var i=0,len=thisel.childNodes.length;i<len;i++){
			if(thisel.childNodes[i].nodeType==1)this.delel.call(this,thisel.childNodes[i],true);
		}
	}
	if(!ifchild)thisel.parentNode.removeChild(thisel);
}
}
