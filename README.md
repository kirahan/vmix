# vmix.js
view module web component system,with loader,parser,binder,watcher,dataflow-control,extend,private-style,custome-element,slot

## step.1 include vmix.js,it will take care everything
```<script src="vmix.js" data-role='vmix' app-file="app.js" index-file='index.vm.html'></script>```

## step.2 write a vm file abc.html,mix your html-style-data-event,
```
<style>...</style> 
<template>
<tag attra={a} attrb={b(1,2,3)} attrc={!c!}/>
<tag on-click="a" />
<tag watch-a="b" />
<tag el-filter="a " el-hook="b" el-list="c"/>
<tag vm-src="abd.html">
</template> 
<script>
this.data={};
this.abc=function(){};

or module.exports={
  option,state,event,method,fn,
}
</script>
```
## step.3 import abc.html
```
<vm  id='xyz' src='./abc.html' />                 use default tag name,and define a src,
<div id='xyz' vm -src='./abc.html'/>              use any     tag name,and define a vm-src
<abc id='xyz'/>                                   custom Element name
```
## specific
- [x] Declarative:no global object,no "new vm()",vmix.js do everrything,
- [x] node style: node style js module exports, or just this.abc=xyz,
- [x] viewModule: plain js define,no relation with html element,
- [x] file:       auto load-parse-cache-clean file,js inline,js require,
- [x] data-el:    one-way two-way data-bind,
- [x] dataflow:   3 data type(data,option,state),3 data source(store,parent,self),controllable dataflow,
- [x] interact:   up-down through defined data-option-state-event
- [x] custom Element name,private style,dom slot,inline js,


#### [vm demo](https://peterli888.github.io/vmix/#!/document/vmdemo)
#### [vm api](https://peterli888.github.io/vmix/#!/document/vmapi)
#### [app config](https://peterli888.github.io/vmix/#!/document/app)
#### [file load](https://peterli888.github.io/vmix/#!/document/file)
#### [element](https://peterli888.github.io/vmix/#!/document/element)
#### [vm dataflow](https://peterli888.github.io/vmix/#!/document/dataflow)
#### [vm interact](https://peterli888.github.io/vmix/#!/document/interact)
