var core_vm=require('./vm.0webcore.js');
var _reqlib=require('./vm.requirelib.js');
var requirePattern = /(?:^|[^\w\$_.])require\s*\(\s*["']([^"']*)["']\s*\)/g;
var reg_elhook=new RegExp(' el-hook=[\'\"](.*?)[\'\"]', 'ig');
var reg_vmsrc;
var reg_style=new RegExp("<style(.*?)>([^<]*)</style>", 'ig');
var reg_body=new RegExp("<body(.*?)>([\\s\\S]*?)</body>", 'ig');
var reg_template=new RegExp("<template(.*?)>([\\s\\S]*?)</template>", 'ig');
var reg_script=new RegExp("<script(.*?)>([\\s\\S]*?)</script>", 'ig');
var reg_html=new RegExp("<html(.*?)>([\\s\\S]*?)</html>", 'ig');
var reg_head=new RegExp("<head(.*?)>([\\s\\S]*?)</head>", 'ig');
var reg_import=new RegExp("<import([\\s\\S]*?)>", 'ig');
var adddep=function(deps,obj){
	if(obj.src=='')return;
	var findsame=deps.length==0?0:1;
	for(var k in deps){
		var findsame=1;
		for(var n in obj){
			if(obj[n]!==deps[k][n])findsame=0;
		}
		if(findsame==1)break;
	}
	if(findsame==0)deps.push(obj);
}
module.exports=function(content,id,type,spec){
	var all_str=core_vm.delrem(content);
	var script_str= type=='vm' ? '':all_str;
	var style_str='',body_str='',meta_str='',html_str='',extend_from='';
	var deps=[];
	if(type=='vm'){
		for(var k in core_vm.wap.config.precode_regexp){
			all_str=all_str.replace(core_vm.wap.config.precode_regexp[k],function(a,b,c,d){
				return '<'+k+b+'>'+core_vm.tool.htmlescape(c.replace(/\n/,''))+'</'+k+'>';
			})
		}
		all_str=all_str.replace(reg_style,function(a,b,c,d){
			var match;
			if(b)match=b.match(/src=['"](.*?)['"]/);
			if(match){
				adddep(deps,{type:'css',src:match[1],urlid:spec.urlid});
			}else if(c){
				style_str+=c;
			}
			return '';
		});
		all_str=all_str.replace(reg_import,function(a,b){
			var type,src,name;
			b.replace(/[\s]{1,}type=['"]([\S]*?)['"]([\s]{0,}|[\>\/])/i,function(a,b){type=b});
			b.replace(/[\s]{1,}src=['"]([\S]*?)['"]([\s]{0,}|[\>\/])/i,function(a,b){src=b});
			b.replace(/[\s]{1,}name=['"]([\S]*?)['"]([\s]{0,}|[\>\/])/i,function(a,b){name=b});
			var src=_reqlib.gen_path(src,spec.id,true);
			if(type=='prototype'){
				extend_from=src;
			}else if(type=='vm' ){
				core_vm.gcache.add_vm_src_import(spec.urlid,name,src);
			}else if(type=='block' ){
				core_vm.gcache.add_block_src_import(spec.urlid,name,src)
			}
			if(type=='block')adddep(deps,{type:type,from:'import',src:src,importname:(name||src)});
			return "";
		});
		all_str=all_str.replace(reg_body,function(a,b,c){body_str=c; return '';});
		all_str=all_str.replace(reg_script,function(a,b,c){script_str+=c;	return '';});
		all_str=all_str.replace(reg_html,function(a,b,c){html_str=c;		return ''; 	});
		if(html_str){
			html_str=html_str.replace(reg_head,function(a,b,c){meta_str=c;return "";});
			if(!body_str)	body_str=html_str;
		}
		if(!body_str)all_str=all_str.replace(reg_template,function(a,b,c){body_str=c;return '';});
		if(!body_str)body_str=all_str;
		if(body_str){
			body_str=body_str.replace(/\{app\.(.*?)}/g,function(a,b,c,d){
				return 	core_vm.tool.objGetDeep(core_vm.wap,b);
			})
		}
		body_str=body_str.replace(reg_elhook,function(a,b,c,d){
			if(!core_vm.gcache.use.elhook[b] && b.indexOf('this.')!==0){
				if(core_vm.wap.config.path.elhook[b]){
					adddep(deps,{type:'lib',src:core_vm.wap.config.path.elhook[b]});
					return ' el-hook="'+b+'" ';
				}else{
					var abs_b=_reqlib.gen_path(b,spec.id,true);
					adddep(deps,{type:'lib',src:abs_b,importname:b});
					return ' el-hook="'+abs_b+'" ';
				}
			}else{
				return ' el-hook="'+b+'" ';
			}
		});
		for(var k in core_vm.wap.config.block_regexp){
			body_str.replace(core_vm.wap.config.block_regexp[k],function(a,b,c,d){
				adddep(deps,{type:'block',src:core_vm.wap.config.path.block[k],blockpathname:k});
				delete core_vm.wap.config.block_regexp[k];
			})
		}
	}
	if(script_str){
		script_str=script_str.replace(requirePattern,function(a,b,c,d){
			if(core_vm.gcache.get_jslib(b)){
				return a;
			}
			var obj={from:'require',type:'lib',}
			if(b.indexOf('.json')>0 && b.lastIndexOf('.json')===b.length-5)obj.type='json';
			if(core_vm.wap.config.path.lib[b]){
				obj.src=core_vm.wap.config.path.lib[b];
				adddep(deps,obj);
				return a;
			}else{
				var abs_b=_reqlib.gen_path(b,spec.id,true);
					obj.src=abs_b;
					adddep(deps,obj);
				return a.replace(b,abs_b);
			}
		});
	}
	if(!script_str && deps.length==0   && !extend_from){
		if(!body_str)script_str=all_str;
		else script_str='';
	}
	return [script_str,meta_str,body_str,style_str,extend_from,deps ];
}