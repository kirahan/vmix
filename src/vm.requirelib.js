var _reqlib={};
module.exports=_reqlib;
var _htmlescapehash= {
	'<': '&lt;',
	'>': '&gt;',
	'&': '&amp;',
	'"': '&quot;',
	"'": '&#x27;',
	'/': '&#x2f;'
};
var _htmlescapereplace= function(k){
	return  _htmlescapehash[k];
};
_reqlib.htmlescape=function(str){
	return typeof(str) !== 'string' ? str : str.replace(/[&<>"]/igm,  _htmlescapereplace);
}
function normalizeArray(v, keepBlanks) {
    var L = v.length,
        dst = new Array(L),
        dsti = 0,
        i = 0,
        part, negatives = 0,
        isRelative = (L && v[0] !== '');
    for (; i < L; ++i) {
        part = v[i];
        if (part === '..') {
            if (dsti > 1) {
                --dsti;
            } else if (isRelative) {
                ++negatives;
            } else {
                dst[0] = '';
            }
        } else if (part !== '.' && (dsti === 0 || keepBlanks || part !== '')) {
            dst[dsti++] = part;
        }
    }
    if (negatives) {
        dst[--negatives] = dst[dsti - 1];
        dsti = negatives + 1;
        while (negatives--) {
            dst[negatives] = '..';
        }
    }
    dst.length = dsti;
    return dst;
}
_reqlib.normalizeId=function(id, parentId) {
    id = id.replace(/\/+$/g, '');
    return normalizeArray((parentId ? parentId + '/../' + id : id).split('/')).join('/');
}
_reqlib.normalizeUrl=function(url, baseLocation) {
    if (!(/^\w+:/).test(url)) {
		var u=baseLocation.fullhost;
        var path = baseLocation.pathname;
		if(url.charAt(0)!='/' && url.charAt(0)!='.'){
		}
        if (url.charAt(0) === '/') {
            url = u + normalizeArray(url.split('/')).join('/');
        } else {
            path += ((path.charAt(path.length - 1) === '/') ? '' : '/../') + url;
            url = u + normalizeArray(path.split('/')).join('/');
        }
    }
    return url;
}
_reqlib.calUrl=function(href, pageurl) {
	var path = pageurl,url=href;
	if (pageurl.charAt(0) !== '/')pageurl="/"+pageurl;
	if (url.charAt(0) === '/') {
		url =  normalizeArray(url.split('/')).join('/');
	} else {
		path += ((path.charAt(path.length - 1) === '/') ? '' : '/../') + url;
		url =  normalizeArray(path.split('/')).join('/');
	}
    return url;
}
_reqlib.gen_path=function(url,from_path,needid){
	var location=window.location;
	if(from_path){
		if(from_path.indexOf(location.fullhost)==0)from_path=from_path.substr(location.fullhost.length);
	}
	from_path=from_path||location.pathname;
	if(url.indexOf('://')==-1)url=_reqlib.normalizeId(url, url[0]=='.' ? from_path :'');
	if(url.indexOf('://')==-1)url = _reqlib.normalizeUrl(url, location);
	if(!needid){
		return url;
	}else{
		url=url.split("//")[1];
		if(url)url=url.substr(url.indexOf('/'));
		return url;
	}
}
_reqlib.cal_spec_path=function(spec,from_path){
	if(spec.from=='deps')return;
	if(spec.url.indexOf('://')==-1)spec.url=_reqlib.gen_path(spec.url,from_path || spec.pvmpath)
	if(!spec.knowpath || !spec.id ){
		spec.id=spec.url.split("//")[1];
		if(spec.id)spec.id=spec.id.substr(spec.id.indexOf('/'));
	}
}
if (Object.defineProperty) {
	_reqlib.defineConstant = function (obj, name, value) {
		Object.defineProperty(obj, name, {
			value: value,
			writable: false,
			enumerable: false,
			configurable: false
		});
	}
} else {
	_reqlib.defineConstant = function (obj, name, value) {
		obj[name] = value;
	}
}
