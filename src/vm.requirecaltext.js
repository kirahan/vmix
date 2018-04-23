var core_vm=require('./vm.0webcore.js');
var _reqlib=require('./vm.requirelib.js');
var requirePattern = /(?:^|[^\w\$_.])require\s*\(\s*["']([^"']*)["']\s*\)/g;
var reg_elhook=new RegExp(' el-hook=[\'\"](.*?)[\'\"]', 'ig');
var reg_vmsrc;
var reg_style=new RegExp("<style(.*?)>([^<]*)</style>", 'ig');
var reg_body=new RegExp("<body(.*?)>([\\s\\S]*?)</body>", 'i');
var reg_template=new RegExp("<template(.*?)>([\\s\\S]*?)</template>", 'i');
var reg_script=new RegExp("<script(.*?)>([\\s\\S]*?)</script>", 'ig');
var reg_html=new RegExp("<html(.*?)>([\\s\\S]*?)</html>", 'i');
var reg_head=new RegExp("<head(.*?)>([\\s\\S]*?)</head>", 'i');
var reg_prototype=new RegExp("<prototype>([\\s\\S]*?)</prototype>", 'i');
var reg_import=new RegExp("<import([\\s\\S]*?)>[</import>]*?", 'ig');
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
var all_isnot_seen=function (str){
	for( var i=0,len=str.length; i<len; i++){
		if(str.charCodeAt(i)>32)	return false;
	}
	return true;
}
module.exports=function(content,id,type,spec){
	var all_str=core_vm.delrem(content);
	var script_str= type=='vm' ? '':all_str;
	var style_str='',body_str=null,meta_str='',html_str='',extend_from='';
	var deps=[];
	if(type=='vm'){
		for(var k in spec.app.config.precode_regexp){
			all_str=all_str.replace(spec.app.config.precode_regexp[k],function(a,b,c,d){
				return '<'+k+b+'>'+core_vm.tool.htmlescape(c.replace(/\n/,''))+'</'+k+'>';
			})
		}
		all_str=all_str.replace(reg_style,function(a,b,c,d){
			var match;
			if(b)match=b.match(/src=['"](.*?)['"]/);
			if(match){
				adddep(deps,{type:'css',src:match[1],urlsid:spec.urlsid});
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
			var src=_reqlib.gen_path(spec.app,src,spec.id,true,1);
			if(type=='prototype'){
				extend_from=src;
			}
			spec.app.__cache.add_import_src_when_cal(type,spec.urlsid,name,src);
			if(spec.app.__cache.check_ifhas(type,src,spec.urlsid)){
				return "";
			}
			if(type=='vm' ){
			}else if(type=='block' ){
				adddep(deps,{type:type,from:'import',src:src,utag:(name||src)});
			}else if(type=='css' ){
				adddep(deps,{type:'css',src:src,urlsid:spec.urlsid});
			}else if(type=='lib' ){
				adddep(deps,{type:'lib',src:src,urlsid:spec.urlsid});
			}else if(type=='json' ){
				adddep(deps,{type:'json',src:src,urlsid:spec.urlsid});
			}
			return "";
		});
		all_str=all_str.replace(reg_body,function(a,b,c){body_str=c;		return '';});
		all_str=all_str.replace(reg_script,function(a,b,c){script_str+=c;	return '';});
		all_str=all_str.replace(reg_html,function(a,b,c){html_str=c;		return ''; 	});
		if(html_str){
			html_str=html_str.replace(reg_head,function(a,b,c){meta_str=c;return "";});
			if(body_str==null)	body_str=html_str;
		}
		if(body_str==null)all_str=all_str.replace(reg_template,function(a,b,c){body_str=c;return '';});
		if(body_str==null || all_isnot_seen(body_str))body_str='';
		body_str=body_str.replace(/\{app\.(.*?)}/g,function(a,b,c,d){
			return 	core_vm.tool.objGetDeep(spec.app,b);
		})
		body_str=body_str.replace(reg_elhook,function(a,b,c,d){
			if(!spec.app.__cache.use.elhook[b] && b.indexOf('this.')!==0){
				if(spec.app.config.path.elhook[b]){
					adddep(deps,{type:'lib',src:spec.app.config.path.elhook[b]});
					return ' el-hook="'+b+'" ';
				}else{
					var abs_b=_reqlib.gen_path(spec.app,b,spec.id,true,2);
					adddep(deps,{type:'lib',src:abs_b,importname:b});
					return ' el-hook="'+abs_b+'" ';
				}
			}else{
				return ' el-hook="'+b+'" ';
			}
		});
		for(var k in spec.app.config.blockpath_regexp){
			body_str.replace(spec.app.config.blockpath_regexp[k],function(a,b,c,d){
				adddep(deps,{type:'block',src:spec.app.config.path.block[k],pathtag:k});
				delete spec.app.config.blockpath_regexp[k];
			})
		}
	}
	if(script_str){
		script_str=script_str.replace(requirePattern,function(a,b,c,d){
			var importname=spec.app.__cache.check_if_import('lib',spec.urlsid,b);
			if(!importname) importname=spec.app.__cache.check_if_import('json',spec.urlsid,b);
			if(importname){
				return a.replace(b,importname);
			}
			var abs_b,str;
			if(spec.app.config.path.lib[b]){
				abs_b=spec.app.config.path.lib[b];
				str=a;
			}else{
				abs_b=_reqlib.gen_path(spec.app,b,spec.id,true,3);
				str=a.replace(b,abs_b);
			}
			if(spec.app.__cache.get_jslib(abs_b)){
				return str;
			}
			var obj={from:'require',type:'lib',src:abs_b}
			if(b.indexOf('.json')>0 && b.lastIndexOf('.json')===b.length-5)obj.type='json';
			adddep(deps,obj);
			return str;
		});
	}
	if(!script_str && deps.length==0   && !extend_from){
		if(body_str==null)script_str=all_str;
		else script_str='';
	}
	return [script_str.replace(/cor\e\./g,'co.').replace(/gcach\e\./g,'o0.'),
		meta_str,body_str,style_str,extend_from,deps ];
}