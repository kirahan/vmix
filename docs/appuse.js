app.use('elhook','hehe',function(vm,el,when,node){
		//console.log("extend.elhook",el?el.dataset:'',when,node);
		if(el)el.style.color='blue';
})

app.use('vmprototype','proto_extend_test',function(){
		console.log("extend.vmprototype test,this.id=",this.id);
})
app.use('filter','testfilter',function(v){
		return v+'__extend_by_filter.testfilter' 
})
app.use('method','testmethod',function(v){
		return v+'__extend_by_method.testmethod' 
})
app.use('domevent','testdomevent',function(e,para){
		console.log("this is in  extend.domevent",e,para);
})
app.use('dataevent','abc',function(el,newv,wopt,path){	
	//watch-a=toel-abc
	el.textContent="use.dataevent.abc__"+newv;
})

var trimquota=function(str){
	return str.replace(/^\s*|\s*$/g, '').replace(/^[\'\"]*|[\'\"]*$/g, '');
}

var trim=function(str){
	return str.replace(/^\s*|\s*$/g, '');
}
app.use('operator'," || ",function(str){
	//console.log('操作符',str)
	var res='',s=str.split(" || ");
	for(var i=0;i<s.length-1;i++){
		s[i]=trim(s[i]);
		if(s[i]==='false')s[i]=false;
		else if(s[i]==='true')s[i]=true;
		else if(s[i]==='null')s[i]=null;
		else if(s[i]==='undefined')s[i]=undefined;
	}
	res=s[0]||s[1];
	if(s.length>2)res=res||s[2];
	if(s.length>3)res=res||s[3];
	if(s.length>4)res=res||s[4];
	return res;
})
app.use('operator'," && ",function(str){
	var res='',s=str.split("&&");
	for(var i=0;i<s.length-1;i++){
		s[i]=trim(s[i]);
		if(s[i]==='false')s[i]=false;
		else if(s[i]==='true')s[i]=true;
		else if(s[i]==='null')s[i]=null;
		else if(s[i]==='undefined')s[i]=undefined;
	}
	res=s[0]&&s[1];
	if(s.length>2)res=res&&s[2];
	if(s.length>3)res=res&&s[3];
	if(s.length>4)res=res&&s[4];	
	return res;
})
app.use('operator'," ? ",function(str){
	//console.log('三元',str)
	if(str.indexOf(' : ')===-1)return;
	var res=trim(str.substr(0,str.indexOf(' ?')));
	if(res=='false')res=false;
	//console.log('res',res)
	var res1=trimquota(trim(str.substr(str.indexOf('?')+1,str.indexOf(':')-str.indexOf('?')-1)));
	var res2=trimquota(trim(str.substr(str.indexOf(':')+1)));
	return res ? res1 :res2
	//内部的已经计算过了 复杂的表达式是先计算里面的
})
	/*" + ":function(str){return 	''},
	" - ":function(str){return 	''},
	" * ":function(str){return 	''},
	" / ":function(str){return 	''},*/


app.use('lib','testlib',{a:1});
app.use('vm','testvm',{
	template:"<button on-click='testme' class='test'>testvm with template,style,lib,you can packed your vm like this</button>",
	style:".test{color:red}",
	lib:{
		testme:function(){
			console.log('testme')
		}
	}
})

app.use('block',{
	bolcktest:'<button>this is bolcktest</button>',	
	twobutton:'<button>ony one top node allowed</button><button>2</button>',

	badge:'<span class="badge">$badge</span>',
	badgetext:'<span class="badge">$text</span>',
	badgevalue:'<span class="badge">$value</span>',
	button_badge:'<button class="btn btn-primary" type="button" on-click="$click">$button   <span class="badge">$badge</span></button>',
	buttonindiv:'<div style="background-color:#eee;width:200px"><div style="padding:10px;color:red">$buttonindiv'
	+'<button>$text</button>$value</div></div>',
	alertx:`<div class="alert alert-danger" >
	  <span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
	  <span class="sr-only">Error:</span>$text</div>`,

	label_default:'<span class="label label-default">$text</span>',
	label_primary:'<span class="label label-primary">$text</span>',
	label_success:'<span class="label label-success">$text</span>',
	label_info:'<span class="label label-info">$text</span>',
	label_warning:'<span class="label label-warning">$text</span>',
	label_danger:'<span class="label label-danger">$text</span>',

	alert_success:'<div class="alert alert-success" >$text</div>',
	alert_info:'<div class="alert alert-info" >$text</div>',
	alert_warning:'<div class="alert alert-warning" >$text</div>',
	alert_danger:'<div class="alert alert-danger" >$text</div>',

	alert_success2:'<div class="alert alert-success alert-dismissible" ><button type="button" class="close" aria-label="Close" on-click="$click"><span aria-hidden="true">&times;</span></button>$text</div>',
	alert_info2:'<div class="alert alert-info alert-dismissible" ><button type="button" class="close" aria-label="Close" on-click="$click"><span aria-hidden="true">&times;</span></button>$text</div>',
	alert_warning2:'<div class="alert alert-warning alert-dismissible" ><button type="button" class="close" aria-label="Close" on-click="$click"><span aria-hidden="true">&times;</span></button>$text</div>',
	alert_danger2:'<div class="alert alert-danger alert-dismissible" ><button type="button" class="close" aria-label="Close" on-click="$click"><span aria-hidden="true">&times;</span></button>$text</div>',
	progressbar:'<div class="progress"><div class="progress-bar" role="progressbar" aria-valuenow="$value" aria-valuemin="0" aria-valuemax="100" style="width: $value%;">$value%</div></div>',
})
