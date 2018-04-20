# vmix
view module web component system,with loader,parser,binder,watcher,dataflow-control,extend,private-style,custome-element,slot

# step.1 include vmix.js
<script src="vmix.js" data-role='vmix' app-file="app.js" index-file='index.vm.html'></script>

# step.2 write a vm with filename=abc.html
<style>...</style>\n
<html>...</html>\n
<script>this.abc=xyz;</script>\n
# mix your template-style-data-event,

# step.3 import abc.html
<vm  id='xyz' src='./abc.html' />                 use default tag name,and define a src,\n
<div id='xyz' vm -src='./abc.html'/>              use any     tag name,and define a vm-src\n 
<abc id='xyz'/>\n
<import type="vm" src="./abc.html" name='abc'/>   import,then custome tag name <abc id='xyz'/>\n
app.config.path.vm.abc='abc.html'                 define,then custome tag name <abc id='xyz'/>\n
app.use('vm','abc',{template,style,lib}           app.use                      <abc id='yxz'/>\n

# specific
code style: node style js module exports,\n
viewModule: plain js define,need not create,no relation with el and core engine,  \n
file:       auto load-parse-cache file,js inline,js require\n
data-el:    one-way two-way data-bind,\n
dataflow:   3 data type,3 data source with permission,transparent controllable dataflow,\n
interact:   up-down through defined data-option-state-event\n
custom Element name,private style,dom slot,\n
