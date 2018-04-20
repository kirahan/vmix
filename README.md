# vmix
view module web component system,with loader,parser,binder,watcher,dataflow-control,extend,private-style,custome-element,slot

## step.1 include vmix.js,it will take care everything
```<script src="vmix.js" data-role='vmix' app-file="app.js" index-file='index.vm.html'></script>```

## step.2 write a vm file,mix your html-style-data-event,
```
<style>...</style> 
<template>...</template> 
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
- [x] only define:no "new vm()",vmix.js do everrything,
- [x] code style: node style js module exports, or just this.abc=xyz,
- [x] viewModule: plain js define,no relation with html element,
- [x] file:       auto load-parse-cache-clean file,js inline,js require,
- [x] data-el:    one-way two-way data-bind,
- [x] dataflow:   3 data type(data,option,state),3 data source(store,parent,self),controllable dataflow,
- [x] interact:   up-down through defined data-option-state-event
- [x] custom Element name,private style,dom slot,inline js,


## [demo](https://github.com/peterli888/vmix/demo.md)
## [api](https://github.com/peterli888/vmix/api.md)
## [app](https://github.com/peterli888/vmix/app.md)
## [file](https://github.com/peterli888/vmix/file.md)
## [dataflow](https://github.com/peterli888/vmix/dataflow.md)
## [interact](https://github.com/peterli888/vmix/interact.md)
