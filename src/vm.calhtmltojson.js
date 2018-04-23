
var core_vm=require('./vm.0webcore.js');
var tapp;
var trim=function(str){
	return str.replace(/^\s*|\s*$/g, '');
}
var all_isnot_seen=function (str){
	for( var i=0,len=str.length; i<len; i++){
		if(str.charCodeAt(i)>32)	return false;
	}
	return true;
}
function issimple(str){
	return (str.indexOf(':')>-1 || str.indexOf('|')>-1 || str.indexOf('?')>-1 || str.indexOf('(')>-1 || str.indexOf(')')>-1)?false:true;
}
function index_of(str,needle){
	var r = str.match(new RegExp(needle, 'i' ));
	return r==null?-1:r.index;
}
function stripquote(val) {
	return val.replace(/^['"`]|['"`]$/g, '');
}
var reg_close  =/^<\s*\/\s*([\w-_]+)\s*>/;
var reg_start=/^<\s*([\w]{1,})\s*/;
var reg_self_close=/^\s*\/\s*>/;
function add_watch(node,name,method){
	node.watchs=node.watchs||[];
	name=name.split('-watch-');
	for(var i=0,len=name.length;i<len;i++)node.watchs.push([name[i].replace(/\-/g,'.'),method])
}
var DATA=0,OPTIONS=1,STATE=2;
var gsn=0;
var parse=function (xml,html_gsn,psn) {
  xml = trim(xml);
  xml = xml.replace(/\<\!--[\s\S]*?--\>/g, '');
  xml="<_root_>"+xml+"</_root_>";
  gsn=html_gsn || 0;
  psn=psn||0;
  var nodescache=[];
  return gendoc();
function gendoc() {
	return {
	  _root_: gentag(null,psn),
	  nodescache:nodescache,
	}
}
function gentag(parentNode,psn) {
	var m = nodematch(reg_start,'start');
	if (!m){
		return;
	}
	var node = {
		sn:gsn++,
		psn: (psn!=undefined?psn:(parentNode ? parentNode.sn:0)),
		id:'',
		tag:m[1],
		utag:m[1].toLowerCase(),
		attr:{},
		dir:{},
		childNodes:[],
		parentNode:parentNode,
	};
	nodescache[node.sn]=node;
	parse_attr(node);
	if(node.attr && node.attr.class){
		node.classList=node.attr.class.split(' ');
		delete node.attr.class;
	}else if(node.attrexp && node.attrexp.class){
		node.classList=node.attrexp.class.split(' ');
		delete node.attrexp.class;
	}else{
		node.classList=[];
	}
	if (nodematch(reg_self_close,'selfclose')) {
		return node;
	}
	var index=xml.indexOf('>');
	xml = xml.slice(index+1);
	var nowtagLower=node.tag.toLowerCase();
	if(nowtagLower=='br' || nowtagLower=='hr')return node;
	child_or_content(node);
	while(!nodematch(reg_close,'close',node.tag,node)){
		if(xml)child_or_content(node);
		else break;
	}
	return node;
}
function parse_attr(node){
	var find_attr1=0,find_attr2=0;
	while (!(eos() || is('>') || is('?>') || is('/>')  )) {
		find_attr1=1;
		find_attr2=1;
		var attr = attribute();
		if(attr){
			if(node.tag=='data'||(node.tag=='option' && node.parentNode.tag!=='select')){
				node.attr[attr.name] = attr.value;
			}else if(attr.name=='id') {
				node.id=attr.value;
			}
			else if(attr.name=='el-filter'||attr.name=='el-hook'||attr.name=='el-list'){
				node.dir[attr.name.substr(3)]=attr.value;
			}else	if(attr.name.substr(0,6)=='watch-'){
				attr.name=attr.name.substr(6);
				if(attr.name[0]=='[' && attr.name[attr.name.length-1]==']')attr.name=attr.name.substr(1,attr.name.length-2);
				add_watch(node,attr.name,attr.value);
			}else	if(attr.name.substr(0,3)=='on-'){
				node.event=node.event||{};
				node.event[attr.name.substr(3)]=attr.value;
			}else	if(attr.name.substr(0,6)=='event-'){
				node.vmevent=node.vmevent||{};
				node.vmevent[attr.name.substr(6)]=attr.value;
			}else{
				var tmp = attr.value.match(/{([\S\s]*?)}/);
				if(tmp==null){
					node.attr[attr.name] = attr.value;
					if(attr.value.toLowerCase()==='true')node.attr[attr.name]=true;
					else if(attr.value.toLowerCase()==='false'){
						node.attr[attr.name]=false;
					}
				}else{
					node.attrexp=node.attrexp||{};
					var last_indexOf_kuohao=attr.value.lastIndexOf('{');
					if(last_indexOf_kuohao==0 && tmp.index==0 && tmp[0]==attr.value  && issimple(tmp[1])){
						var path=trim(tmp[1]);
						var if_data_to_el=0,if_el_to_data=0;
						if(path[0]=='!'){if_data_to_el=1;path=path.substr(1);}
						if(path[path.length-1]=='!'){if_el_to_data=1;path=path.substr(0,path.length-1);}
						var datatype=DATA;
						if(path.indexOf('this.option.')==0){
							datatype=OPTIONS;
							if_data_to_el=1;
							if_el_to_data=0;
						}else if(path.indexOf('this.state.')==0){
							datatype=STATE;
						}
						node.attrexp[attr.name]="{"+path+"}";
						if(if_data_to_el){
							add_watch(node,path,'toel-'+attr.name);
						}
						if(if_el_to_data){
							node.event=node.event||{};
							if(datatype==STATE)node.event['change']="tostate-"+path.replace('this.state.','');
							else if(datatype==DATA)node.event['change']="todata-"+path;
						}
					}else{
						node.attrexp[attr.name]=attr.value;
						add_multi_watch(node,attr.value,'toel-'+attr.name);
					}
				}
			}
		}else{
			find_attr1=0;
			attr = attribute2();
			if(attr){
				if(!all_isnot_seen(attr.name)){
					attr.name=attr.name.replace(/\W/g, '');
					if(attr.name){
						node.attr[attr.name]=true;
					}
				}
			}else{
				find_attr2=0;
			}
		}
		if(find_attr1+find_attr2==0){
			xml = xml.slice(xml.indexOf('>'));
		}
	}
}
function child_or_content(node){
	var child,tcontent;
	var find_child=0,find_content=0;
	while (1) {
		find_child=1;
		find_content=1;
		child = gentag(node);
		if(child){
			node.childNodes.push(child);
		}else{
			find_child=0;
		}
		tcontent = parse_content();
		if(tcontent){
			add_content_node(node,tcontent);
		}else{
			find_content=0;
		}
		if(find_child+find_content==0)break;
	}
}
function new_node(type,pnode){
	var node={tag:type,utag:type,
		childNodes:[],dir:{},attr:{},psn:pnode.sn,sn:gsn++,parentNode:pnode};
	nodescache[node.sn]=node;
	pnode.childNodes.push(node);
	return node;
}
function ifhave_operator (str) {
	if(str.indexOf('|')>-1 ||(str.indexOf('?')>-1 && str.indexOf(':')>-1)
		||(str.indexOf('(')>-1 && str.indexOf(')')>-1) ||str.indexOf('&&')>-1)return true;
}
function add_multi_watch(node,str,where) {
	if(where!='toel-text' && ifhave_operator(str)){
		return;
	}
	var needwatch=[];
	str.replace(/([\S\s]*?)\{([\S\s]*?)\}/g,function(a,b,c,d,e,f,g){
		c=trim(c);
		if(!c)return;
		if(c.indexOf('this.option.')==0){
			if(c[0]!='!')c='!'+c;
		}
		if(c[c.length-1]=='!')c=c.substr(0,c.length-1);
		if(c[0]==='!' && needwatch.indexOf(c)===-1){
			needwatch.push(c.substr(1));
		}
	});
	for(var i=0,len=needwatch.length;i<len;i++){
		add_watch(node,needwatch[i],where);
	}
}
function add_content_node(node,tcontent){
	if(all_isnot_seen(tcontent))return;
	if(tcontent.indexOf('\\u')>-1)tcontent=tcontent.replace(/\\u[a-fA-F0-9]{4}/g,function(a,b,c){return unescape(a.replace(/\\u/,'%u'))});
	if(tcontent.indexOf('\\U')>-1)tcontent=tcontent.replace(/\\U[a-fA-F0-9]{4}/g,function(a,b,c){return unescape(a.replace(/\\U/,'%u'))});
	var tag=node.tag.toLowerCase();
	if(tapp.config.precode.indexOf(tag)>-1){
		node.attr=node.attr||{};
		node.attr.text=core_vm.tool.htmlunescape(tcontent);
		return;
	}
	var tmp = tcontent.match(/{([\S\s]*?)}/g);
	if(tmp==null){
		if(tag=='text'){
			node.text=tcontent;
		}else{
			var textnode=new_node('_text_',node);
			textnode.text=tcontent;
		}
		return;
	}else{
			if(ifhave_operator(tcontent)){
				var textnode=new_node('_exptext_',node);
				textnode.text='';
				textnode.exp_text=tcontent;
				add_multi_watch(textnode,tcontent,'toel-text');
				return;
			}
			tcontent.replace(/([\S\s]*?)\{([\S\s]*?)\}/g,function(a,b,c,d,e,f,g){
				if(trim(b)){
					var textnode=new_node('_text_',node);
					textnode.text=trim(b);
				}
				c=trim(c);
				if(c){
					if(c[c.length-1]=='!')c=c.substr(0,c.length-1);
					var textnode=new_node('_exptext_',node);
					textnode.text='';
					textnode.exp_text='{'+c+'}';
					if(c.indexOf('this.option.')==0){
						if(c[0]!='!')c='!'+c;
					}
					if(c[0]==='!'){
						add_watch(textnode,c.substr(1),'toel-text');
					}
				}
			});
			var index=tcontent.lastIndexOf('}');
			if(index!=tcontent.length-2){
				var shengyu=tcontent.substr(index+2);
				if(trim(shengyu)){
					var textnode=new_node('_text_',node);
					textnode.text=trim(shengyu);
				}
			}
	}
}
function parse_content() {
	var m = nodematch(/^([^<]*)/,'content');
	return m?m[1]:'';
}
function attribute2(){
	var m = nodematch(/^\s*([_-\w]+)\s*/ ,'attrstate');
	if(m) return { name: m[1], value:  (m[1]) }
}
function attribute() {
	var m = nodematch(/([_-\w]+)\s*=\s*(\`[^`]*\`|"[^"]*"|'[^']*'|[ ]|[^<>\/\s]*)\s*/ ,'attr');
	if(m){
		return { name: trim(m[1]), value: trim(stripquote(m[2])) }
	}
}
function nodematch(re,where,tag,node) {
	var m = xml.match(re);
	if(where=='attr'  ){
		if(m && ( m['index']>0   && !all_isnot_seen(m['input'].substr(0,m['index'])))){
			return;
		}
	}else	if(where=='close'){
		if(m){
			xml = xml.substr(m.index+m[0].length);
			if(m[1]==tag   || m[1].toLowerCase()==tag.toLowerCase()){
				return true;
			}else{
				return tapp.config.strategy.force_close_not_match_close_tag?true: false;
			}
		}else{
			xml = xml.slice(xml.indexOf('>')+1);
			return tapp.config.strategy.force_close_error_close_tag?true: false;
		}
	}
	if (!m)return;
	xml = xml.slice(m.index+m[0].length);
	return m;
}
function eos() {
	return 0 == xml.length;
}
function is(prefix) {
	return 0 == xml.indexOf(prefix);
}
}
function declaration() {
	var m = nodematch(/^<\?xml\s*/,'declaration');
	if (!m) return;
	var node = {
	  attr: {}
	};
	while (!(eos() || is('?>'))) {
	  var attr = attribute();
	  if (!attr) return node;
	  node.attr[attr.tag] = attr.value;
	}
	nodematch(/\?>\s*/,'declaration 2');
	return node;
}
function removeDOCTYPE(html) {
	return html
  .replace(/<\?xml.*\?>\n/, '')
  .replace(/<!doctype.*\>\n/, '')
  .replace(/<!DOCTYPE.*\>\n/, '');
}
module.exports=function(html,maxsn,psn,app,where){
	tapp=app;
	html=html
      .replace(/<\?xml.*\?>\n/, '')
      .replace(/<!doctype.*\>\n/, '')
      .replace(/<!DOCTYPE.*\>\n/, '')
	.replace(new RegExp('<script[^]*>[\\s\\S]*?</script>','gi'),'')
	.replace(new RegExp('<style[^]*>[\\s\\S]*?</style>','gi'),'')
	.replace(/\/\s*>/g, "/>")
	.replace(/\/\>/g, " />")
	.replace(/\<\>/g, "");
	var all=parse(html,maxsn,psn,app);
	return [all._root_,all.nodescache];
}
