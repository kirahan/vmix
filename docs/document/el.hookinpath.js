

module.exports=function(vm,el,when,node){
	//selfCreated,childrenCreated,attached
	//console.log('hook,inpath,when='+when)
	if(el && el.dataset['x']!=123)return;
	if(when=='childrenCreated'){
		el.style.background='#eee';
		el.childNodes[0].style.color='green';
	}
}