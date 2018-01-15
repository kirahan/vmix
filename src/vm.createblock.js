var core_vm=require('./vm.0webcore.js');
var check_block_text=function(nodes,name,text){
	nodes.forEach(function(node){
		var find=0;
		if(node.event){
			for(var k in node.event){
				if(node.event[k]==name){
					node.event[k]=text;
					find=1;
				}
			}
		}
		if(find==1)return;
		for(var k in node.attr){
			if(typeof (node.attr[k])=='string' && node.attr[k].indexOf(name)>-1){
				node.attr[k]=node.attr[k].replace(name,text);
			}
		}
		if(node.text && node.text.indexOf(name)>-1){
			node.text=node.text.replace(name,text);
		}
		if(node.childNodes && node.childNodes.length>0){
			check_block_text(node.childNodes,name,text);
		}
	});
}
module.exports.find_block=function(nodes,vm,scope,pel){
	nodes.forEach(function(node,sn){
		var utag=node.utag;
		if(core_vm.gcache.use.block[utag] || core_vm.gcache.importblock_src[vm[core_vm.aprand].absrcid+':'+utag]){
			var oldparent=node.parentNode;
			var oldid=node.id;
			var blocktext=core_vm.gcache.use.block[utag] ;
			if(!blocktext){
				blocktext=core_vm.gcache.get_importblock(vm,utag);
			}
			if(!blocktext){
				return;
			}
			var s=[];
			for(var k in node.attr)if(s.indexOf(k)==-1)s.push(k);
			for(var k in node.attrexp)if(s.indexOf(k)==-1)s.push(k);
			s.forEach(function(name,i){
				var text=node.attr[name];
				if(!text && node.attrexp)text=node.attrexp[name];
				if(i==0 && utag.indexOf('-')==-1){
					if(!text && node.childNodes.length>0)text=node.childNodes[0].text;
				}
				if(text){
					text=core_vm.calexp.exp(vm,text,scope);
					blocktext=blocktext.replace(new RegExp('\\$'+name, 'g'),text)
				}
			})
			nodes[sn]=core_vm.calhtmltojson(blocktext,0,0)[0].childNodes[0];
			nodes[sn].parentNode=oldparent;
			if(oldid)nodes[sn].id=oldid;
			if(node.attr.style)nodes[sn].attr.style=node.attr.style;
		}
	})
}