!function(e){function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}var t={};n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:r})},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},n.p="",n(n.s=0)}([function(e,n,t){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(n,"__esModule",{value:!0});var i=function(){function e(e,n){for(var t=0;t<n.length;t++){var r=n[t];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(n,t,r){return t&&e(n.prototype,t),r&&e(n,r),n}}(),u=t(1),a=(r(u),t(2));r(a),function(){function e(n){o(this,e),this._uploadIdEndpoint=n.uploadIdEndpoint,this._uploadEndpoint=n.uploadEndpoint}i(e,[{key:"hi",value:function(){alert("hi")}},{key:"_validateInitialization",value:function(){if(!this._uploadIdEndpoint)throw new Error("A valid endpoint to retrieve an upload identifier is required");if(!this._uploadEndpoint)throw new Error("A valid endpoint to retrieve an upload identifier is required")}}])}();n.default=A},function(e,n,t){"use strict";function r(){console.log("chunked")}Object.defineProperty(n,"__esModule",{value:!0}),n.default=r},function(e,n,t){"use strict";function r(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(n,"__esModule",{value:!0});var o=function(){function e(e,n){for(var t=0;t<n.length;t++){var r=n[t];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(n,t,r){return t&&e(n.prototype,t),r&&e(n,r),n}}(),i=function(){function e(){r(this,e)}return o(e,null,[{key:"get",value:function(e){return{json:!1}}},{key:"post",value:function(e,n,t){}},{key:"_fetch",value:function(e,n){var t={cache:"default",method:"GET",mode:"cors"};return Object.assign(t,n),new Promise(function(n,r){fetch(e,t).then(function(e){if(e.ok)switch(e.headers.get("Content-Type")){case"application/json":return e.json();default:return e.blob()}else r({error:e.error()})}).then(function(e){n(e)})})}}]),e}();n.default=i}]);