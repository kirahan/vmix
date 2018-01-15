
var core_vm=require('./vm.0webcore.js');
var _reqlib=require('./vm.requirelib.js');
var _libcal=require('./vm.requirecal.js');
var _requirecache=require('./vm.requirecache.js');
var load_pending={};
{
	if(XMLHttpRequest===undefined ||  typeof XMLHttpRequest === "undefined")
	XMLHttpRequest = function () {
		try {                return new ActiveXObject("Msxml2.XMLHTTP.6.0");            } catch (e) {}
		try {                return new ActiveXObject("Msxml2.XMLHTTP.3.0");            } catch (e) {}
		try {                return new ActiveXObject("Msxml2.XMLHTTP");	            } catch (e) {}
		throw new Error("This browser does not support XMLHttpRequest.");
	};
}
var setparaxhr=function(xhr,cacheexpire,cache_text){
	if(gcache.user.logintoken)xhr.setRequestHeader('logintoken',gcache.user.logintoken);
	else xhr.setRequestHeader('clientid',gcache.clientid||'');
	xhr.setRequestHeader('client-time',new Date().toUTCString());
	if(!cacheexpire ||!cache_text)return;
	if(cacheexpire && cacheexpire.lastmodify)xhr.setRequestHeader('If-Modified-Since',cacheexpire.lastmodify);
	if(cacheexpire && cacheexpire.etag)xhr.setRequestHeader('If-None-Match',cacheexpire.etag);
}
function load(spec,callback) {
	if(typeof callback!='function')	callback=function(){};
	if(typeof spec === 'string')	spec = {url: spec};
	if (!spec.url) {
		callback({type:'missing both url and id'},null,spec);
		return;
	}
	if(!spec.refid ){
		callback({type:'missing spec.refid'},null,spec);
		return;
	}
	if(!spec.urlid)	spec.urlid=core_vm.gcache.geturlsid(spec.url);
	_reqlib.cal_spec_path(spec);
	if(spec && spec.text){
		spec.callback=callback;
		download_act(xhr,'onload',spec,'',null,true);
		return;
	}
	if(spec.url==spec.pvmpath ||(spec.pvm && spec.url==spec.pvm.absrc) ||
		spec.id==spec.pvmpath ||(spec.pvm && spec.id==spec.pvm.absrc)){
		if(!spec.istop){
			callback(new Error("url duplicate"),null,spec);
			return;
		}
	}
	if(spec.url.indexOf('http://www.localhost.com/')==0){
		spec.fresh=true;
		var cache_text=gcache.fileroot.get_text('mydevapps/'+spec.url.replace('http://www.localhost.com/',''));
		find_cache_file_mob(spec,cache_text,callback);
		return;
	}
	if(load_pending[spec.url]){
		load_pending[spec.url].push([spec,callback]);
		return;
	}
	if (spec.elhook_second_times || (!spec.fresh )){
		var module=_requirecache(spec.id,'',spec.type,'load',spec.urlid);
		if(module){
			find_cachevm_inrequie(module,spec,callback);
			return;
		}else{
		}
	}
	var cache_text='';
	var xhr;
			xhr=new XMLHttpRequest();
	xhr.hascallbacked=0;
	load_pending[spec.url]=[[spec,callback]];
	xhr.onreadystatechange = function (e) {
		if (4 != xhr.readyState){
			return;
		}else if (0 == xhr.status) {
			download_act(xhr,'download_timeout',spec,cache_text);
		}else{
			download_act(xhr,'readystatechange',spec,cache_text);
		}
	};
	xhr.onload = function () {
		download_act(xhr,'onload',spec,cache_text);
	};
	xhr.onerror = function (error) {
		core_vm.devalert('onerror',xhr.location,error)
		download_act(xhr,'download_error',spec,cache_text,error);
	};
	try{
		xhr.open('GET',spec.url, true);
		if(spec.fresh){
		}
		xhr.send(null);
	}catch(e){
		xhr.onerror.call(xhr,'error-catched')
	}
}
function download_act(xhr,type,spec,cache_text,error,withtext){
	if(withtext){
		_libcal.evalResponse(spec,spec.text,function(err,mod){download_ok_pendingcb(spec,err,mod);},loads);
		return
	}
	if(xhr.hascallbacked==1){
		return;
	}else{
		xhr.hascallbacked=1;
	}
	if(!load_pending[spec.url])return;
		spec.url_goto=xhr.location;
	var sucess=0;
	if(type=='onload'){
		sucess=1;
	}else if(type=='readystatechange'){
		if ((xhr.status < 300 && xhr.status >= 200) || (xhr.status === 0 && !spec.url.match(/^(?:https?|ftp):\/\//i))){
			sucess=1;
		}else{
			sucess=0;
			type='download_error'
		}
	}
	var xhr_responseText=sucess>0 ? xhr.responseText:'';
	{
			var result=core_vm.onload(spec.url,xhr,spec);
			if(result)xhr_responseText=result;
	}
	{
		if(sucess==0){
			download_ok_pendingcb(spec,{type:type,url:spec.url,status:xhr.status,xhr:xhr} );
		}else if(sucess==1){
			_libcal.evalResponse(spec,xhr_responseText,function(err,mod){download_ok_pendingcb(spec,err,mod);},loads);
		}
	}
}
function download_ok_pendingcb(spec,error,mod){
	var cbs=[];
	var specs=[];
	var first_type='';
	if(!load_pending[spec.url]){
		cbs[0]=spec.callback;
		specs[0]=spec;
		first_type=spec.type;
	}else{
		var len=load_pending[spec.url].length;
		for(var k=0;k<len;k++){
			cbs.push(load_pending[spec.url][k][1]);
			specs.push(load_pending[spec.url][k][0]);
		}
		first_type=load_pending[spec.url][0][0].type;
		delete load_pending[spec.url];
	}
	if(error){
		cbs.forEach(function(cb,i){		cb(error,null,specs[i]);	});
	}else{
		cbs.forEach(function(cb,i){
			if(specs[i].type=='css'){
				core_vm.gcache.add_importstyle_when_loadcb(specs[i],mod);
				cb(null,mod,specs[i]);
			}else	if(specs[i].type=='block'){
				if(specs[i].importname){
					core_vm.gcache.set_block_text_import(specs[i].id,specs[i].urlid,specs[i].importname,mod,specs[i].refid);
				}else if(specs[i].blockpathname){
					core_vm.gcache.add_block_inpath(specs[i].blockpathname,mod);
				}
				cb(null,mod,specs[i]);
			}else if(specs[i].type=='text'){
				cb(null,mod,specs[i]);
			}else{
				if(specs[i].urlid){
					if(specs[i].type=='vm'){
						core_vm.gcache.add_vmlib_ref(specs[i].id,specs[i].refid,'loadok');
					}
					if(specs[i].type=='lib'||specs[i].type=='json'){
						core_vm.gcache.add_jslib_ref(specs[i].id,specs[i].refid,'loadok');
					}
				}
				if(first_type=='text' && specs[i].type=='lib'){
					specs[i].text=mod;
					core_vm.require.load(specs[i],cb);
				}else{
					cb(null,clone_mod(mod,specs[i]),specs[i]);
				}
			}
		});
	}
}
function clone_mod(mod,spec){
	if('css'==spec.type)return null;
	else if('lib'==spec.type)return mod;
	else if('vm'==spec.type)return core_vm.tool.objClone(mod);
	else if('text'==spec.type)return mod;
	else return null;
}
function find_cachevm_inrequie(mod,spec,loadcb){
	loadcb(null,clone_mod(mod,spec),spec);
}
function find_cache_file_mob(spec,cache_text,loadcb){
	_libcal.evalResponse(spec,cache_text,function(err,mod){
		loadcb(err,clone_mod(mod,spec),spec);
	},loads);
}
function loads(urls, callback) {
	if(!Array.isArray(urls))urls=[urls];
	var len = urls.length;
	var errs = [];
	var mods = [];
	var specs=[];
	var errcount = 0;
	urls.forEach(function (url, i) {
		if(!url){
			len--;
			return;
		}
		load(url, function (err, mod,spec) {
			if (err) errcount++;
			errs[urls.indexOf(url)] = err;
			specs[urls.indexOf(url)] = spec;
			mods[urls.indexOf(url)] = mod||{};
			len--;
			if (len == 0) callback(errcount, errs, mods,specs);
		})
	});
}
module.exports={}
module.exports.load = load;
module.exports.loads = loads;
module.exports.normalizeUrl=_reqlib.normalizeUrl;
