if(!self.define){let e,i={};const t=(t,s)=>(t=new URL(t+".js",s).href,i[t]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=t,e.onload=i,document.head.appendChild(e)}else e=t,importScripts(t),i()})).then((()=>{let e=i[t];if(!e)throw new Error(`Module ${t} didn’t register its module`);return e})));self.define=(s,o)=>{const n=e||("document"in self?document.currentScript.src:"")||location.href;if(i[n])return;let r={};const c=e=>t(e,n),l={module:{uri:n},exports:r,require:c};i[n]=Promise.all(s.map((e=>l[e]||c(e)))).then((e=>(o(...e),r)))}}define(["./workbox-03ee9729"],(function(e){"use strict";e.setCacheNameDetails({prefix:"fabric-jWpvYxVtS4vOOaFj"}),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"https://erichsia7.github.io/fabric/dist/483.53b695f5a2ebc41b83c5.min.js",revision:null},{url:"https://erichsia7.github.io/fabric/dist/597.912af25bd65bfed76102.min.js",revision:null},{url:"https://erichsia7.github.io/fabric/dist/main.14888e8cb2c393797d7e.min.js",revision:null}],{}),e.registerRoute(/^https:\/\/fonts.googleapis.com/,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[]}),"GET")}));
//# sourceMappingURL=service-worker.js.map
