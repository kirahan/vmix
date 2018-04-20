var rand=function(){
	return parseInt(Math.random()*100);
}
module.exports={

init:function(cb){
	console.log('app.store,loading data,waiting 10ms')
	setTimeout(function(){cb()},10)
},
vminit:function(cvm,cb){
	//console.log('-------------------store.vminit',cvm.absrc)
	if(cvm.absrc.indexOf('/array.page.html')>-1)cb({books:[{name:50},{name:1},{name:2},{name:3}]})
	else if(cvm.absrc.indexOf('/parent.data.sub.html')>-1)cb({storex:1,storey:1})
	else if(cvm.absrc.indexOf('data.store.sub1.html')>-1)cb({name:'from-store'})
	else if(cvm.absrc.indexOf('data.source.sub1.html')>-1)cb({name:'from-store',s:[1,2]})
	else cb()
},
get:function(cvm,path,cb){
	//console.log('store.get')
	if(cvm.absrc.indexOf('/array.page.html')>-1 && path=='books'){
		cb([{name:rand()},{name:rand()},{name:rand()},{name:rand()}])
	}else{

	cb()
	}
},
set:function(cvm,path,value,cb){
	//console.log('store.set',cvm,path,value,)
	if(cvm.absrc.indexOf('/parent.data.sub.html')>-1){
		//console.log('setData',path)
		if(path=='storex')return cb(true)
		else if(path=='storey')return cb(false)
	}
	cb(true);
},
add:function(cvm,path,index,value,cb){
	//console.log('store.add',cvm.data[path])
	cb(true)
},
del:function(cvm,path,index,count,cb){
	cb(true)
}

}

/*
get时发给vm的数据是否clone store自己决定
prop来自store vm不应该修改 要通知 set ,store收到后自己决定广播,修改哪几个vm的prop
watch的 on-change=todata-xx 自动汇报 给center center决定如何修改 cb(true)就自动修改
vm手动进行的 this.data.x=y 可以修改ui 但是如果是clone的就没有到store

state是vm自己的,自己修改后 更新ui
*/
