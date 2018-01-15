var core_vm=require('./vm.0webcore.js');
module.exports.setproto=function(proto){
function decapitalize(str) {
  str = ""+str;
  return str.charAt(0).toLowerCase() + str.slice(1);
};
var get_child_events=function(node,events){
	var events=events || [];
	if(node.event)for(var k in node.event){
		if(events.indexOf(k)===-1)events.push(decapitalize(k));
	}
	if(node.childNodes)for(var k in node.childNodes)events=get_child_events(node.childNodes[k],events);
	return events;
}
proto.__bind_as_top_view=function(node,el){
	core_vm.elset(el,'bindsidofvm',this.sid);
	el._hasbindastop=el._hasbindastop||[];
	var events=get_child_events(node,[]);
	for(var k in events){
		if(el._hasbindastop.indexOf(events[k])==-1){
			el._hasbindastop.push(events[k]);
			this.__bind(el,events[k],core_vm.eventdom.all);
		}
	}
}
proto.__unbindel=function(el){
	var s=this[core_vm.aprand].els_binded;
	var len=s.length;
	for(i=len-1;i>-1;i--){
		if(s[i][0]===el){
			el.removeEventListener(s[i][1],s[i][2]);
			s.splice(i,1);
			break;
		}
	}
}
proto.__unbindall=function(event,el,fn){
	this[core_vm.aprand].els_binded.forEach(function(e){e[0].removeEventListener(e[1],e[2]);});
	this[core_vm.aprand].els_binded=[];
}
proto.__bind=function(el,event,fn,ifdirect){
	if(!el || !core_vm.isfn(fn) ||typeof(event)!=='string' || !el.addEventListener)return;
	if(ifdirect){
		el.addEventListener(event,fn);
		return
	}
	var vm=this;
	
	var velfn=function(e){
		fn.call(e.target,e,vm);
	}
	this[core_vm.aprand].els_binded.push([el,event,velfn]);
	el.addEventListener(event,velfn);
}
proto.__bind_events=function(el){
	var domeventnames=this[core_vm.aprand].domeventnames;
	var domeventnames_binded=this[core_vm.aprand].domeventnames_binded;
	for(var name in domeventnames){
		if(name.indexOf(':')>-1)name=name.substr(0,name.indexOf(':'));
		if(domeventnames_binded.indexOf(name)==-1){
			domeventnames_binded.push(name);
			if(el){
				this.__bind(el||this.pel,name,core_vm.eventdom.all);
			}else{
				for(var k in this[core_vm.aprand].els)
				this.__bind(this[core_vm.aprand].els[k],name,core_vm.eventdom.all);
			}
		}else{
		}
	}
}
}
//pointerdown|pointerup|pointercancel|pointermove|pointerover|pointerout|pointerenter|pointerleave)