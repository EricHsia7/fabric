if(!self.define){let i,e={};const s=(s,t)=>(s=new URL(s+".js",t).href,e[s]||new Promise((e=>{if("document"in self){const i=document.createElement("script");i.src=s,i.onload=e,document.head.appendChild(i)}else i=s,importScripts(s),e()})).then((()=>{let i=e[s];if(!i)throw new Error(`Module ${s} didn’t register its module`);return i})));self.define=(t,n)=>{const r=i||("document"in self?document.currentScript.src:"")||location.href;if(e[r])return;let o={};const c=i=>s(i,r),l={module:{uri:r},exports:o,require:c};e[r]=Promise.all(t.map((i=>l[i]||c(i)))).then((i=>(n(...i),o)))}}define(["./workbox-03ee9729"],(function(i){"use strict";i.setCacheNameDetails({prefix:"fabric-5vQi86WTxMoA6TZs"}),self.skipWaiting(),i.clientsClaim(),i.precacheAndRoute([{url:"https://erichsia7.github.io/fabric/dist/320.7ed4a5a97fc2d69ff4e9.min.js",revision:null},{url:"https://erichsia7.github.io/fabric/dist/483.53b695f5a2ebc41b83c5.min.js",revision:null},{url:"https://erichsia7.github.io/fabric/dist/main-102ff935.559c2f567462ac05118a.min.js",revision:null},{url:"https://erichsia7.github.io/fabric/dist/main-298dd76e.2baae0a900076c72729a.min.js",revision:null},{url:"https://erichsia7.github.io/fabric/dist/main-298dd76e.dea147ed7918265ebf3e.min.css",revision:null}],{}),i.registerRoute(/^https:\/\/fonts.googleapis.com/,new i.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[]}),"GET")}));
//# sourceMappingURL=service-worker.js.map
