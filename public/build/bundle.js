var app=function(){"use strict";function t(){}function e(t,e){for(const n in e)t[n]=e[n];return t}function n(t){return t()}function s(){return Object.create(null)}function r(t){t.forEach(n)}function i(t){return"function"==typeof t}function o(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}function l(t,n,s,r){return t[1]&&r?e(s.ctx.slice(),t[1](r(n))):s.ctx}function a(t,e,n,s,r,i,o){const a=function(t,e,n,s){if(t[2]&&s){const r=t[2](s(n));if(void 0===e.dirty)return r;if("object"==typeof r){const t=[],n=Math.max(e.dirty.length,r.length);for(let s=0;s<n;s+=1)t[s]=e.dirty[s]|r[s];return t}return e.dirty|r}return e.dirty}(e,s,r,i);if(a){const r=l(e,n,s,o);t.p(r,a)}}function c(t,e){t.appendChild(e)}function u(t,e,n){t.insertBefore(e,n||null)}function f(t){t.parentNode.removeChild(t)}function m(t){return document.createElement(t)}function p(t){return document.createElementNS("http://www.w3.org/2000/svg",t)}function d(t){return document.createTextNode(t)}function g(){return d(" ")}function h(t,e,n){null==n?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function $(t,e){e=""+e,t.wholeText!==e&&(t.data=e)}let b;function C(t){b=t}const v=[],w=[],y=[],x=[],k=Promise.resolve();let M=!1;function U(t){y.push(t)}let _=!1;const j=new Set;function S(){if(!_){_=!0;do{for(let t=0;t<v.length;t+=1){const e=v[t];C(e),D(e.$$)}for(C(null),v.length=0;w.length;)w.pop()();for(let t=0;t<y.length;t+=1){const e=y[t];j.has(e)||(j.add(e),e())}y.length=0}while(v.length);for(;x.length;)x.pop()();M=!1,_=!1,j.clear()}}function D(t){if(null!==t.fragment){t.update(),r(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(U)}}const A=new Set;let E;function q(){E={r:0,c:[],p:E}}function L(){E.r||r(E.c),E=E.p}function P(t,e){t&&t.i&&(A.delete(t),t.i(e))}function z(t,e,n,s){if(t&&t.o){if(A.has(t))return;A.add(t),E.c.push((()=>{A.delete(t),s&&(n&&t.d(1),s())})),t.o(e)}}function Z(t,e){z(t,1,1,(()=>{e.delete(t.key)}))}function B(t,e,n,s,r,i,o,l,a,c,u,f){let m=t.length,p=i.length,d=m;const g={};for(;d--;)g[t[d].key]=d;const h=[],$=new Map,b=new Map;for(d=p;d--;){const t=f(r,i,d),l=n(t);let a=o.get(l);a?s&&a.p(t,e):(a=c(l,t),a.c()),$.set(l,h[d]=a),l in g&&b.set(l,Math.abs(d-g[l]))}const C=new Set,v=new Set;function w(t){P(t,1),t.m(l,u),o.set(t.key,t),u=t.first,p--}for(;m&&p;){const e=h[p-1],n=t[m-1],s=e.key,r=n.key;e===n?(u=e.first,m--,p--):$.has(r)?!o.has(s)||C.has(s)?w(e):v.has(r)?m--:b.get(s)>b.get(r)?(v.add(s),w(e)):(C.add(r),m--):(a(n,o),m--)}for(;m--;){const e=t[m];$.has(e.key)||a(e,o)}for(;p;)w(h[p-1]);return h}function N(t){t&&t.c()}function O(t,e,s){const{fragment:o,on_mount:l,on_destroy:a,after_update:c}=t.$$;o&&o.m(e,s),U((()=>{const e=l.map(n).filter(i);a?a.push(...e):r(e),t.$$.on_mount=[]})),c.forEach(U)}function V(t,e){const n=t.$$;null!==n.fragment&&(r(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function T(t,e){-1===t.$$.dirty[0]&&(v.push(t),M||(M=!0,k.then(S)),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function I(e,n,i,o,l,a,c=[-1]){const u=b;C(e);const m=e.$$={fragment:null,ctx:null,props:a,update:t,not_equal:l,bound:s(),on_mount:[],on_destroy:[],before_update:[],after_update:[],context:new Map(u?u.$$.context:[]),callbacks:s(),dirty:c,skip_bound:!1};let p=!1;if(m.ctx=i?i(e,n.props||{},((t,n,...s)=>{const r=s.length?s[0]:n;return m.ctx&&l(m.ctx[t],m.ctx[t]=r)&&(!m.skip_bound&&m.bound[t]&&m.bound[t](r),p&&T(e,t)),n})):[],m.update(),p=!0,r(m.before_update),m.fragment=!!o&&o(m.ctx),n.target){if(n.hydrate){const t=function(t){return Array.from(t.childNodes)}(n.target);m.fragment&&m.fragment.l(t),t.forEach(f)}else m.fragment&&m.fragment.c();n.intro&&P(e.$$.fragment),O(e,n.target,n.anchor),S()}C(u)}class G{$destroy(){V(this,1),this.$destroy=t}$on(t,e){const n=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return n.push(e),()=>{const t=n.indexOf(e);-1!==t&&n.splice(t,1)}}$set(t){var e;this.$$set&&(e=t,0!==Object.keys(e).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}const K=new Map([["mail-front","M44.3,-65C56.3,-52.3,64.1,-37.8,67,-23.1C69.8,-8.5,67.7,6.4,63.4,20.9C59,35.3,52.5,49.4,41.6,56.3C30.7,63.3,15.3,63.2,-1.2,64.9C-17.7,66.5,-35.5,69.9,-49.3,63.8C-63.2,57.8,-73.2,42.4,-75.5,26.6C-77.8,10.7,-72.4,-5.5,-66.2,-20.5C-59.9,-35.4,-52.7,-49,-41.5,-62C-30.3,-74.9,-15.1,-87.3,0.5,-88C16.2,-88.7,32.3,-77.7,44.3,-65Z"],["mail-back","M43.5,-62.1C55.3,-51.3,62.9,-37.1,69.7,-21.4C76.5,-5.7,82.5,11.5,80.4,28.7C78.4,45.8,68.3,63,53.5,74.4C38.8,85.8,19.4,91.5,2.4,88.2C-14.6,84.9,-29.2,72.6,-40.1,59.9C-50.9,47.2,-58.1,34.2,-65.9,19.3C-73.8,4.3,-82.4,-12.6,-79.2,-26.8C-76.1,-41,-61.2,-52.4,-46.1,-62.1C-30.9,-71.8,-15.5,-79.7,0.2,-80C15.9,-80.3,31.7,-72.9,43.5,-62.1Z"],["twitter-front","M45.3,-63.4C56.8,-54.1,62.7,-38.2,63.8,-23.4C64.8,-8.7,61,5,54.8,15.8C48.5,26.7,39.8,34.8,30.3,39.3C20.8,43.9,10.4,45,-4.6,51.3C-19.6,57.6,-39.2,69.2,-48.7,64.7C-58.3,60.1,-57.9,39.4,-61.9,21.4C-66,3.4,-74.5,-11.8,-74,-27.3C-73.5,-42.9,-63.9,-58.9,-50.1,-67.4C-36.2,-75.9,-18.1,-77,-0.6,-76.2C17,-75.4,33.9,-72.7,45.3,-63.4Z"],["twitter-back","M47.8,-63C63,-54.8,77.1,-42.2,82.6,-26.5C88.1,-10.9,85.1,7.9,78.8,25.1C72.5,42.2,62.9,57.8,49.2,68.5C35.5,79.2,17.8,85.1,1.9,82.5C-14,79.9,-27.9,68.8,-38,56.9C-48.2,45,-54.4,32.4,-60.4,18.6C-66.4,4.7,-72,-10.3,-68.3,-22.3C-64.6,-34.4,-51.5,-43.6,-38.5,-52.6C-25.6,-61.5,-12.8,-70.2,1.8,-72.6C16.3,-75,32.6,-71.2,47.8,-63Z"],["github-front","M48.6,-64.5C63.6,-56,76.7,-42.6,77.7,-28C78.7,-13.4,67.5,2.5,60,17.7C52.6,32.9,48.8,47.5,39.4,56.6C30.1,65.6,15,69.2,-0.7,70.1C-16.3,71,-32.7,69.3,-44.1,60.8C-55.5,52.4,-62.1,37.3,-62.6,23.3C-63.1,9.2,-57.7,-3.9,-55.7,-20.5C-53.6,-37.2,-55,-57.4,-46.3,-68C-37.6,-78.6,-18.8,-79.7,-1,-78.3C16.8,-77,33.6,-73.1,48.6,-64.5Z"],["github-back","M48.4,-63.6C64.1,-55.2,79.1,-42.9,84.1,-27.4C89.1,-11.8,84.1,6.9,77.1,24C70.1,41.1,61.2,56.5,48,65.3C34.8,74.1,17.4,76.3,1,74.9C-15.4,73.5,-30.7,68.5,-41.7,59C-52.7,49.4,-59.2,35.4,-65.9,20.1C-72.6,4.9,-79.4,-11.6,-77.1,-26.9C-74.7,-42.3,-63.1,-56.5,-48.7,-65.4C-34.3,-74.2,-17.1,-77.7,-0.4,-77.1C16.4,-76.6,32.7,-72,48.4,-63.6Z"]]);function R(e){let n,s,r;return{c(){n=p("svg"),s=p("path"),h(s,"d",K.get(e[2])),h(s,"transform","translate(100 100)"),h(n,"class",r="blob blob-"+e[1]+" blob-"+e[0]+" svelte-mlv4ww"),h(n,"viewBox","0 0 200 200")},m(t,e){u(t,n,e),c(n,s)},p(t,[e]){3&e&&r!==(r="blob blob-"+t[1]+" blob-"+t[0]+" svelte-mlv4ww")&&h(n,"class",r)},i:t,o:t,d(t){t&&f(n)}}}function Y(t,e,n){let{icon:s}=e,{position:r}=e;const i=[s,r].join("-");return t.$$set=t=>{"icon"in t&&n(0,s=t.icon),"position"in t&&n(1,r=t.position)},[s,r,i]}class F extends G{constructor(t){super(),I(this,t,Y,R,o,{icon:0,position:1})}}const H=new Map([["mail","M256 8C118.941 8 8 118.919 8 256c0 137.059 110.919 248 248 248 48.154 0 95.342-14.14 135.408-40.223 12.005-7.815 14.625-24.288 5.552-35.372l-10.177-12.433c-7.671-9.371-21.179-11.667-31.373-5.129C325.92 429.757 291.314 440 256 440c-101.458 0-184-82.542-184-184S154.542 72 256 72c100.139 0 184 57.619 184 160 0 38.786-21.093 79.742-58.17 83.693-17.349-.454-16.91-12.857-13.476-30.024l23.433-121.11C394.653 149.75 383.308 136 368.225 136h-44.981a13.518 13.518 0 0 0-13.432 11.993l-.01.092c-14.697-17.901-40.448-21.775-59.971-21.775-74.58 0-137.831 62.234-137.831 151.46 0 65.303 36.785 105.87 96 105.87 26.984 0 57.369-15.637 74.991-38.333 9.522 34.104 40.613 34.103 70.71 34.103C462.609 379.41 504 307.798 504 232 504 95.653 394.023 8 256 8zm-21.68 304.43c-22.249 0-36.07-15.623-36.07-40.771 0-44.993 30.779-72.729 58.63-72.729 22.292 0 35.601 15.241 35.601 40.77 0 45.061-33.875 72.73-58.161 72.73z"],["twitter","M419.6 168.6c-11.7 5.2-24.2 8.7-37.4 10.2 13.4-8.1 23.8-20.8 28.6-36 -12.6 7.5-26.5 12.9-41.3 15.8 -11.9-12.6-28.8-20.6-47.5-20.6 -42 0-72.9 39.2-63.4 79.9 -54.1-2.7-102.1-28.6-134.2-68 -17 29.2-8.8 67.5 20.1 86.9 -10.7-0.3-20.7-3.3-29.5-8.1 -0.7 30.2 20.9 58.4 52.2 64.6 -9.2 2.5-19.2 3.1-29.4 1.1 8.3 25.9 32.3 44.7 60.8 45.2 -27.4 21.4-61.8 31-96.4 27 28.8 18.5 63 29.2 99.8 29.2 120.8 0 189.1-102.1 185-193.6C399.9 193.1 410.9 181.7 419.6 168.6z"],["github","M256 70.7c-102.6 0-185.9 83.2-185.9 185.9 0 82.1 53.3 151.8 127.1 176.4 9.3 1.7 12.3-4 12.3-8.9V389.4c-51.7 11.3-62.5-21.9-62.5-21.9 -8.4-21.5-20.6-27.2-20.6-27.2 -16.9-11.5 1.3-11.3 1.3-11.3 18.7 1.3 28.5 19.2 28.5 19.2 16.6 28.4 43.5 20.2 54.1 15.4 1.7-12 6.5-20.2 11.8-24.9 -41.3-4.7-84.7-20.6-84.7-91.9 0-20.3 7.3-36.9 19.2-49.9 -1.9-4.7-8.3-23.6 1.8-49.2 0 0 15.6-5 51.1 19.1 14.8-4.1 30.7-6.2 46.5-6.3 15.8 0.1 31.7 2.1 46.6 6.3 35.5-24 51.1-19.1 51.1-19.1 10.1 25.6 3.8 44.5 1.8 49.2 11.9 13 19.1 29.6 19.1 49.9 0 71.4-43.5 87.1-84.9 91.7 6.7 5.8 12.8 17.1 12.8 34.4 0 24.9 0 44.9 0 51 0 4.9 3 10.7 12.4 8.9 73.8-24.6 127-94.3 127-176.4C441.9 153.9 358.6 70.7 256 70.7z"]]);function J(e){let n,s,r,i;return{c(){n=p("svg"),s=p("path"),h(s,"d",r=H.get(e[0])),h(n,"class",i="icon "+e[0]+" svelte-1cd6int"),h(n,"viewBox","0 0 512 512")},m(t,e){u(t,n,e),c(n,s)},p(t,[e]){1&e&&r!==(r=H.get(t[0]))&&h(s,"d",r),1&e&&i!==(i="icon "+t[0]+" svelte-1cd6int")&&h(n,"class",i)},i:t,o:t,d(t){t&&f(n)}}}function Q(t,e,n){let{type:s}=e;return t.$$set=t=>{"type"in t&&n(0,s=t.type)},[s]}class W extends G{constructor(t){super(),I(this,t,Q,J,o,{type:0})}}function X(t){let e,n;const s=t[2].default,r=function(t,e,n,s){if(t){const r=l(t,e,n,s);return t[0](r)}}(s,t,t[1],null);return{c(){e=m("a"),r&&r.c(),h(e,"target","_blank"),h(e,"href",t[0]),h(e,"class","svelte-sfptub")},m(t,s){u(t,e,s),r&&r.m(e,null),n=!0},p(t,[i]){r&&r.p&&2&i&&a(r,s,t,t[1],i,null,null),(!n||1&i)&&h(e,"href",t[0])},i(t){n||(P(r,t),n=!0)},o(t){z(r,t),n=!1},d(t){t&&f(e),r&&r.d(t)}}}function tt(t,e,n){let{$$slots:s={},$$scope:r}=e,{url:i}=e;return t.$$set=t=>{"url"in t&&n(0,i=t.url),"$$scope"in t&&n(1,r=t.$$scope)},[i,r,s]}class et extends G{constructor(t){super(),I(this,t,tt,X,o,{url:0})}}const nt=[{name:"mail",url:"mailto:sophia.mersmann.blog@gmail.com"},{name:"twitter",url:"https://twitter.com/sophiamersmann"},{name:"github",url:"https://github.com/sophiamersmann"}];function st(t,e,n){const s=t.slice();return s[0]=e[n].name,s[1]=e[n].url,s}function rt(e){let n,s,r,i,o,l;return n=new F({props:{icon:e[0],position:"back"}}),r=new F({props:{icon:e[0],position:"front"}}),o=new W({props:{type:e[0]}}),{c(){N(n.$$.fragment),s=g(),N(r.$$.fragment),i=g(),N(o.$$.fragment)},m(t,e){O(n,t,e),u(t,s,e),O(r,t,e),u(t,i,e),O(o,t,e),l=!0},p:t,i(t){l||(P(n.$$.fragment,t),P(r.$$.fragment,t),P(o.$$.fragment,t),l=!0)},o(t){z(n.$$.fragment,t),z(r.$$.fragment,t),z(o.$$.fragment,t),l=!1},d(t){V(n,t),t&&f(s),V(r,t),t&&f(i),V(o,t)}}}function it(t,e){let n,s,r,i;return s=new et({props:{url:e[1],$$slots:{default:[rt]},$$scope:{ctx:e}}}),{key:t,first:null,c(){n=m("div"),N(s.$$.fragment),r=g(),h(n,"class","brand-icon svelte-1sh4z0s"),this.first=n},m(t,e){u(t,n,e),O(s,n,null),c(n,r),i=!0},p(t,n){e=t;const r={};16&n&&(r.$$scope={dirty:n,ctx:e}),s.$set(r)},i(t){i||(P(s.$$.fragment,t),i=!0)},o(t){z(s.$$.fragment,t),i=!1},d(t){t&&f(n),V(s)}}}function ot(t){let e,n,s=[],r=new Map,i=nt;const o=t=>t[0];for(let e=0;e<i.length;e+=1){let n=st(t,i,e),l=o(n);r.set(l,s[e]=it(l,n))}return{c(){e=m("div");for(let t=0;t<s.length;t+=1)s[t].c();h(e,"class","social-media svelte-1sh4z0s")},m(t,r){u(t,e,r);for(let t=0;t<s.length;t+=1)s[t].m(e,null);n=!0},p(t,[n]){0&n&&(i=nt,q(),s=B(s,n,o,1,t,i,r,e,Z,it,null,st),L())},i(t){if(!n){for(let t=0;t<i.length;t+=1)P(s[t]);n=!0}},o(t){for(let t=0;t<s.length;t+=1)z(s[t]);n=!1},d(t){t&&f(e);for(let t=0;t<s.length;t+=1)s[t].d()}}}class lt extends G{constructor(t){super(),I(this,t,null,ot,o,{})}}function at(e){let n,s,r,i,o;return i=new lt({}),{c(){n=m("header"),s=m("div"),s.innerHTML='<img src="memoji-421x421.png" alt="Memoji" width="421" height="421" class="svelte-cmqlpq"/> \n    <h1 class="svelte-cmqlpq">Sophia Mersmann</h1>',r=g(),N(i.$$.fragment),h(s,"class","brand svelte-cmqlpq"),h(n,"class","svelte-cmqlpq")},m(t,e){u(t,n,e),c(n,s),c(n,r),O(i,n,null),o=!0},p:t,i(t){o||(P(i.$$.fragment,t),o=!0)},o(t){z(i.$$.fragment,t),o=!1},d(t){t&&f(n),V(i)}}}class ct extends G{constructor(t){super(),I(this,t,null,at,o,{})}}function ut(t,e,n){const s=t.slice();return s[1]=e[n],s}function ft(t){let e,n,s=t[1]+"";return{c(){e=m("span"),n=d(s),h(e,"class","svelte-fed7kt")},m(t,s){u(t,e,s),c(e,n)},p(t,e){1&e&&s!==(s=t[1]+"")&&$(n,s)},d(t){t&&f(e)}}}function mt(e){let n,s=e[0],r=[];for(let t=0;t<s.length;t+=1)r[t]=ft(ut(e,s,t));return{c(){n=m("div");for(let t=0;t<r.length;t+=1)r[t].c();h(n,"class","tags svelte-fed7kt")},m(t,e){u(t,n,e);for(let t=0;t<r.length;t+=1)r[t].m(n,null)},p(t,[e]){if(1&e){let i;for(s=t[0],i=0;i<s.length;i+=1){const o=ut(t,s,i);r[i]?r[i].p(o,e):(r[i]=ft(o),r[i].c(),r[i].m(n,null))}for(;i<r.length;i+=1)r[i].d(1);r.length=s.length}},i:t,o:t,d(t){t&&f(n),function(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}(r,t)}}}function pt(t,e,n){let{tags:s=[]}=e;return t.$$set=t=>{"tags"in t&&n(0,s=t.tags)},[s]}class dt extends G{constructor(t){super(),I(this,t,pt,mt,o,{tags:0})}}function gt(t){let e,n;return{c(){e=m("img"),e.src!==(n=t[5])&&h(e,"src",n),h(e,"alt",t[0]),h(e,"width","1024"),h(e,"height","768"),h(e,"class","svelte-1vlms5b")},m(t,n){u(t,e,n)},p(t,s){32&s&&e.src!==(n=t[5])&&h(e,"src",n),1&s&&h(e,"alt",t[0])},d(t){t&&f(e)}}}function ht(t){let e,n,s,r,i,o,l,a;return l=new dt({props:{tags:t[2]}}),{c(){e=m("span"),n=d(t[0]),s=g(),r=m("span"),i=d(t[1]),o=g(),N(l.$$.fragment),h(e,"class","title svelte-1vlms5b"),h(r,"class","subtitle svelte-1vlms5b")},m(t,f){u(t,e,f),c(e,n),u(t,s,f),u(t,r,f),c(r,i),u(t,o,f),O(l,t,f),a=!0},p(t,e){(!a||1&e)&&$(n,t[0]),(!a||2&e)&&$(i,t[1]);const s={};4&e&&(s.tags=t[2]),l.$set(s)},i(t){a||(P(l.$$.fragment,t),a=!0)},o(t){z(l.$$.fragment,t),a=!1},d(t){t&&f(e),t&&f(s),t&&f(r),t&&f(o),V(l,t)}}}function $t(t){let e,n,s,r;return s=new et({props:{url:t[6],$$slots:{default:[bt]},$$scope:{ctx:t}}}),{c(){e=m("span"),e.textContent="/",n=g(),N(s.$$.fragment),h(e,"class","separator svelte-1vlms5b")},m(t,i){u(t,e,i),u(t,n,i),O(s,t,i),r=!0},p(t,e){const n={};64&e&&(n.url=t[6]),1024&e&&(n.$$scope={dirty:e,ctx:t}),s.$set(n)},i(t){r||(P(s.$$.fragment,t),r=!0)},o(t){z(s.$$.fragment,t),r=!1},d(t){t&&f(e),t&&f(n),V(s,t)}}}function bt(e){let n,s,r,i;return r=new W({props:{type:"github"}}),{c(){n=m("div"),s=d("Source\n            "),N(r.$$.fragment),h(n,"class","icon-wrapper svelte-1vlms5b")},m(t,e){u(t,n,e),c(n,s),O(r,n,null),i=!0},p:t,i(t){i||(P(r.$$.fragment,t),i=!0)},o(t){z(r.$$.fragment,t),i=!1},d(t){t&&f(n),V(r)}}}function Ct(t){let e,n,s,r,i,o,l,a,p,b,C,v,w=t[3].toLocaleDateString("en-UK",t[7])+"";n=new et({props:{url:t[4],$$slots:{default:[gt]},$$scope:{ctx:t}}}),o=new et({props:{url:t[4],$$slots:{default:[ht]},$$scope:{ctx:t}}});let y=t[6]&&$t(t);return{c(){e=m("div"),N(n.$$.fragment),s=g(),r=m("div"),i=m("div"),N(o.$$.fragment),l=g(),a=m("div"),p=m("time"),b=d(w),C=g(),y&&y.c(),h(i,"class","top svelte-1vlms5b"),h(p,"datetime",t[8]),h(a,"class","bottom svelte-1vlms5b"),h(r,"class","caption svelte-1vlms5b"),h(e,"class","card")},m(t,f){u(t,e,f),O(n,e,null),c(e,s),c(e,r),c(r,i),O(o,i,null),c(r,l),c(r,a),c(a,p),c(p,b),c(a,C),y&&y.m(a,null),v=!0},p(t,[e]){const s={};16&e&&(s.url=t[4]),1057&e&&(s.$$scope={dirty:e,ctx:t}),n.$set(s);const r={};16&e&&(r.url=t[4]),1031&e&&(r.$$scope={dirty:e,ctx:t}),o.$set(r),(!v||8&e)&&w!==(w=t[3].toLocaleDateString("en-UK",t[7])+"")&&$(b,w),t[6]?y?(y.p(t,e),64&e&&P(y,1)):(y=$t(t),y.c(),P(y,1),y.m(a,null)):y&&(q(),z(y,1,1,(()=>{y=null})),L())},i(t){v||(P(n.$$.fragment,t),P(o.$$.fragment,t),P(y),v=!0)},o(t){z(n.$$.fragment,t),z(o.$$.fragment,t),z(y),v=!1},d(t){t&&f(e),V(n),V(o),y&&y.d()}}}function vt(t,e,n){let{title:s}=e,{subtitle:r}=e,{tags:i=[]}=e,{date:o=new Date}=e,{url:l}=e,{imageUrl:a}=e,{githubUrl:c}=e;const u=t=>t.toString().padStart(2,0),f=[o.getFullYear(),u(o.getMonth()+1),u(o.getDate())].join("-");return t.$$set=t=>{"title"in t&&n(0,s=t.title),"subtitle"in t&&n(1,r=t.subtitle),"tags"in t&&n(2,i=t.tags),"date"in t&&n(3,o=t.date),"url"in t&&n(4,l=t.url),"imageUrl"in t&&n(5,a=t.imageUrl),"githubUrl"in t&&n(6,c=t.githubUrl)},[s,r,i,o,l,a,c,{month:"short",year:"numeric"},f]}class wt extends G{constructor(t){super(),I(this,t,vt,Ct,o,{title:0,subtitle:1,tags:2,date:3,url:4,imageUrl:5,githubUrl:6})}}const yt=[{title:"kleineAnfragen visualisiert",subtitle:"Visualisierung kleiner und großer Anfragen aus dem Bundestag und aus den Landesparlamenten (Daten von kleineAnfragen.de)",tags:["data visualisation","design & development","self-initiated","d3.js","Vue.js","politics"],date:new Date(2021,0,25),url:"https://sophiamersmann.github.io/kleine-anfragen-visualised/",imageUrl:"cards/card-kleine-anfragen-1024x768.png",githubUrl:"https://github.com/sophiamersmann/kleine-anfragen-visualised"},{title:"Minesweeper",subtitle:"Built with Vue.js",tags:["design & development","self-initiated","Vue.js","games"],date:new Date(2020,9,1),url:"https://sophiamersmann.github.io/minesweeper/",imageUrl:"cards/card-minesweeper-1024x768.png",githubUrl:"https://github.com/sophiamersmann/minesweeper"},{title:"Newcomer Parties To European Parliaments",subtitle:"A visualisation of parties elected into parliament for the first time",tags:["data visualisation","data analysis","design & development","self-initiated","d3.js","politics"],date:new Date(2020,7,1),url:"https://sophiamersmann.github.io/newcomer-parties/",imageUrl:"cards/card-newcomer-parties-1024x768.png",githubUrl:"https://github.com/sophiamersmann/newcomer-parties"},{title:"Rummy Calendar",subtitle:"Of weeks and months when all we had was playing cards",tags:["data visualisation","data collection & analysis","design & development","self-initiated","d3.js","corona"],date:new Date(2020,5,1),url:"https://sophiamersmann.github.io/rummy-calendar/",imageUrl:"cards/card-rummy-calendar-1024x768.png",githubUrl:"https://github.com/sophiamersmann/rummy-calendar"},{title:"ProteinLens",subtitle:"A web server to explore allosteric communication within a protein (developed in the Yaliraki Group at Imperial College London)",tags:["webserver","data visualisation","Django","d3.js","bioinformatics","Imperical College London"],date:new Date(2019,8,1),url:"https://proteinlens.io/",imageUrl:"cards/card-proteinlens-1024x768.png",githubUrl:null},{title:"Posterior Error Probability Estimation for Peptide Search Engine Results in OpenMS",subtitle:"As part of Google Summer of Code 2018 (Master thesis)",tags:["research","master thesis","data visualisation","d3.js","Imperical College London"],date:new Date(2020,8,1),url:"https://sophiamersmann.github.io/master-thesis/",imageUrl:"cards/card-master-thesis-1024x768.png",githubUrl:"https://github.com/sophiamersmann/master-thesis"}];function xt(t,e,n){const s=t.slice();return s[0]=e[n],s}function kt(t,n){let s,r,i;const o=[n[0]];let l={};for(let t=0;t<o.length;t+=1)l=e(l,o[t]);return r=new wt({props:l}),{key:t,first:null,c(){s=d(""),N(r.$$.fragment),this.first=s},m(t,e){u(t,s,e),O(r,t,e),i=!0},p(t,e){n=t;const s=0&e?function(t,e){const n={},s={},r={$$scope:1};let i=t.length;for(;i--;){const o=t[i],l=e[i];if(l){for(const t in o)t in l||(s[t]=1);for(const t in l)r[t]||(n[t]=l[t],r[t]=1);t[i]=l}else for(const t in o)r[t]=1}for(const t in s)t in n||(n[t]=void 0);return n}(o,[(i=n[0],"object"==typeof i&&null!==i?i:{})]):{};var i;r.$set(s)},i(t){i||(P(r.$$.fragment,t),i=!0)},o(t){z(r.$$.fragment,t),i=!1},d(t){t&&f(s),V(r,t)}}}function Mt(t){let e,n,s=[],r=new Map,i=yt;const o=t=>t[0].title;for(let e=0;e<i.length;e+=1){let n=xt(t,i,e),l=o(n);r.set(l,s[e]=kt(l,n))}return{c(){e=m("div");for(let t=0;t<s.length;t+=1)s[t].c();h(e,"class","stack svelte-149oxck")},m(t,r){u(t,e,r);for(let t=0;t<s.length;t+=1)s[t].m(e,null);n=!0},p(t,[n]){0&n&&(i=yt,q(),s=B(s,n,o,1,t,i,r,e,Z,kt,null,xt),L())},i(t){if(!n){for(let t=0;t<i.length;t+=1)P(s[t]);n=!0}},o(t){for(let t=0;t<s.length;t+=1)z(s[t]);n=!1},d(t){t&&f(e);for(let t=0;t<s.length;t+=1)s[t].d()}}}class Ut extends G{constructor(t){super(),I(this,t,null,Mt,o,{})}}function _t(e){let n,s,r,i,o;return n=new ct({}),i=new Ut({}),{c(){N(n.$$.fragment),s=g(),r=m("main"),N(i.$$.fragment)},m(t,e){O(n,t,e),u(t,s,e),u(t,r,e),O(i,r,null),o=!0},p:t,i(t){o||(P(n.$$.fragment,t),P(i.$$.fragment,t),o=!0)},o(t){z(n.$$.fragment,t),z(i.$$.fragment,t),o=!1},d(t){V(n,t),t&&f(s),t&&f(r),V(i)}}}return new class extends G{constructor(t){super(),I(this,t,null,_t,o,{})}}({target:document.body})}();
//# sourceMappingURL=bundle.js.map
