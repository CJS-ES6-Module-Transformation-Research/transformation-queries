!function(e){var t={};function n(r){if(t[r])return t[r].exports;var u=t[r]={i:r,l:!1,exports:{}};return e[r].call(u.exports,u,u.exports,n),u.l=!0,u.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var u in e)n.d(r,u,function(t){return e[t]}.bind(null,u));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=1)}([function(e,t){e.exports=require("stream")},function(e,t,n){"use strict";n.r(t);var r,u=n(0),o=n.n(u);function i(e,t,n){e=e||function(e){this.queue(e)},t=t||function(){this.queue(null)};var r=!1,u=!1,i=[],a=!1,f=new o.a;function l(){for(;i.length&&!f.paused;){var e=i.shift();if(null===e)return f.emit("end");f.emit("data",e)}}function c(){f.writable=!1,t.call(f),!f.readable&&f.autoDestroy&&f.destroy()}return f.readable=f.writable=!0,f.paused=!1,f.autoDestroy=!(n&&!1===n.autoDestroy),f.write=function(t){return e.call(this,t),!f.paused},f.queue=f.push=function(e){return a||(null===e&&(a=!0),i.push(e),l()),f},f.on("end",(function(){f.readable=!1,!f.writable&&f.autoDestroy&&process.nextTick((function(){f.destroy()}))})),f.end=function(e){if(!r)return r=!0,arguments.length&&f.write(e),c(),f},f.destroy=function(){if(!u)return u=!0,r=!0,i.length=0,f.writable=f.readable=!1,f.emit("close"),f},f.pause=function(){if(!f.paused)return f.paused=!0,f},f.resume=function(){return f.paused&&(f.paused=!1,f.emit("resume")),l(),f.paused||f.emit("drain"),f},f}r=i,i.through=i,t.default=r}]);