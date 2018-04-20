
var pubsub=require('./applibpubsub.js');
app.sub=pubsub.sub;
app.subonece=pubsub.subonece;
app.unsub=pubsub.unsub;
app.pub=pubsub.pub;

var cache={};
var pubsub={};
module.exports=pubsub;
pubsub.sub=function(name,vm,cb){
	if(typeof (name)!=='string' || typeof (cb)!=='function')return;
	cache[name]=cache[name]||{};
	cache[name][vm.sid]=[vm,cb,0];
}
pubsub.subonce=function(name,vm,cb){
	if(typeof (name)!=='string' || (typeof (cb)!=='function'))return;
	cache[name]=cache[name]||{};
	cache[name][vm.sid]=[vm,cb,1];
}
pubsub.unsub=function(name,vm,cb){
	if(typeof (name)!=='string' || (cb &&typeof (cb)!=='function'))return;
	cache[name]=cache[name]||{};
	if(cache[name][vm.sid]){
		if(!cb || cb==cache[name][vm.sid][1])
		delete cache[name][vm.sid];
	}
}

var each = function (obj, fn, context) {
    for (var key in obj) {
		if (obj.hasOwnProperty(key)) {
			fn.call(context, obj[key], key, obj);
		}
    }
  
}
pubsub.pub=function(name,data,cb,from){
	//console.log('pub',vm.id,cache[name])
	if(typeof (name)!=='string' )return;
	if(typeof(cb)!=='function')cb=function(){}
	cache[name]=cache[name]||{};
	var evs=cache[name];
	each(evs,function(ev,sid){	
		if(ev[2]===-1)delete evs[sid];
	})
	each(evs,function(ev,sid){	
		ev[1].call(ev[0],data,function(data){
			cb(data,ev[0])
		},from);
		if(ev[2]==1)ev[2]=-1;
	})
}
