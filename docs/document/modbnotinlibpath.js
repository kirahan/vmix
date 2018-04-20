console.log("this is modbnotinlibpath ");
var mod2=require('./modbnotinlibpath2.js');
module.exports ={
	str:"This text was required from modbnotinlibpath.js!",
	str2:mod2.str
}