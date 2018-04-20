var core_vm=require('../src/vm.0webcore.js');
core_vm.aprand='vm'+(new Date()).getTime().toString();

core_vm.rootvmset=require('../src/vm.rootvmset.js');
core_vm.rootvmstart=require('../src/vm.rootvmstart.js');
core_vm.web=require('../src/vm.rootvmstartweb.js');
core_vm.webdocready=require('../src/vm.web.docready.js');

core_vm.define=require('../src/vm.define.js');

core_vm.loadsubvm=require('../src/vm.loadsubvm.js'),

core_vm.start=require('../src/vm.start.js');
core_vm.elhook=require('../src/vm.elhook.js');

core_vm.inject=require('../src/vm.inject.js');

core_vm.cal = require('../src/vm.cal.js');
core_vm.calexp=require('../src/vm.calexp.js');
core_vm.calif=require('../src/vm.calif.js');
core_vm.calhtmltojson=require('../src/vm.calhtmltojson.js'); 

core_vm.watchcal=require('../src/vm.watchcal.js');
core_vm.watchcb=require('../src/vm.watchcb.js');

core_vm.create=require('../src/vm.create.js');
core_vm.createcommon=require('../src/vm.createcommon.js');
core_vm.createblock=require('../src/vm.createblock.js');

core_vm.list=require('../src/vm.list.js');

core_vm.eventdom=require('../src/vm.eventdom.js');

core_vm.tool=require('../src/vm.tool.js');
core_vm.require=require('../src/vm.require.js');






core_vm.web_private_style=require('../src/vm.web_private_style.js');

require('../src/vm.00.js');

core_vm.cacheclass=require('../src/vm.0cache.js');
core_vm.gcache=new core_vm.cacheclass();
core_vm.appclass=require('../src/vm.0app.js');
core_vm.wap=new core_vm.appclass();
core_vm.wap.blankvm=core_vm.define.define({id:'_blankforapp_'});
core_vm.wap.blankvm.__define({name:'_blank_'});
Object.defineProperty(core_vm.wap,'blankvm',{enumerable:false});


module.exports={
	vmix:{
		email:'peterli888@gmail.com',
	},
}
core_vm.webdocready.docReady(core_vm.web.start_system);
