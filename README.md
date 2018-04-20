# vmix
view module web component system,with loader,parser,binder,watcher,dataflow-control,extend,private-style,custome-element,slot

## step.1 include vmix.js,it will take care everything
```<script src="vmix.js" data-role='vmix' app-file="app.js" index-file='index.vm.html'></script>```

## step.2 write a vm file,mix your html-style-data-event,
```
<style>...</style> 
<template>...</template> 
<script>
this.abc=xyz;
module.exports={,,,}
</script>
```
## step.3 import abc.html
```
<vm  id='xyz' src='./abc.html' />                 use default tag name,and define a src,
<div id='xyz' vm -src='./abc.html'/>              use any     tag name,and define a vm-src
<abc id='xyz'/>                                   custom Element name
```
## specific
- [x] code style: node style js module exports, 
- [x] viewModule: plain js define,need not create,no relation with el and core engine,
- [x] file:       auto load-parse-cache file,js inline,js require,
- [x] data-el:    one-way two-way data-bind,
- [x] dataflow:   3 data type,3 data source with permission,transparent controllable dataflow,
- [x] interact:   up-down through defined data-option-state-event
- [x] custom Element name,private style,dom slot,
