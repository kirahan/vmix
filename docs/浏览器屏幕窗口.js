/*console.log(window);
//alert(window.width +','+window.height)

if (window.innerWidth)winWidth = window.innerWidth;
else if ((document.body) && (document.body.clientWidth))winWidth = document.body.clientWidth;
// 获取窗口高度
if (window.innerHeight)winHeight = window.innerHeight;
else if ((document.body) && (document.body.clientHeight))winHeight = document.body.clientHeight;
console.log(winWidth,winHeight);
// 通过深入 Document 内部对 body 进行检测，获取窗口大小
if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth)
{
winHeight = document.documentElement.clientHeight;
winWidth = document.documentElement.clientWidth;
}*/

/*var s = ""; 
s += " \n网页可见区域宽：" +document.body.clientWidth; 
s += " \n网页可见区域高：" +document.body.clientHeight; 
s += " \n网页可见区域宽：" +document.body.offsetWidth +" (包括边线和滚动条的宽)"; 
s += " \n网页可见区域高：" +document.body.offsetHeight +" (包括边线的宽)"; 
s += " \n网页正文全文宽：" +document.body.scrollWidth; 
s += " \n网页正文全文高：" +document.body.scrollHeight; 
s += " \n网页被卷去的高(ff)：" +document.body.scrollTop; 
s += " \n网页被卷去的高(ie)：" +document.documentElement.scrollTop; 
s += " \n网页被卷去的左：" +document.body.scrollLeft; 
s += " \n网页正文部分上：" +window.screenTop; 
s += " \n网页正文部分左：" +window.screenLeft; 
s += " \n屏幕可用工作区高度：" +window.screen.availHeight; 
s += " \n屏幕可用工作区宽度：" +window.screen.availWidth;

s += " \n你的屏幕设置是 " +window.screen.colorDepth +" 位彩色"; 
s += " \n你的屏幕设置 " +window.screen.deviceXDPI +" 像素/英寸";
s += " \n屏幕分辨率的高：" +window.screen.height; 
s += " \n屏幕分辨率的宽：" +window.screen.width; 
//alert (s); 
//console.log(s);
*/
/*
1745 270
 
网页可见区域宽：1745 
网页可见区域高：0 
网页可见区域宽：1745 (包括边线和滚动条的宽) 
网页可见区域高：0 (包括边线的宽) 
网页正文全文宽：1745 
网页正文全文高：270 
网页被卷去的高(ff)：0 
网页被卷去的高(ie)：0 
网页被卷去的左：0 
网页正文部分上：0 
网页正文部分左：0 

屏幕分辨率的高：1080 
屏幕分辨率的宽：1920 
屏幕可用工作区高度：1040 
屏幕可用工作区宽度：1920 
你的屏幕设置是 24 位彩色 
你的屏幕设置 undefined 像素/英寸
*/
