if(!self.define){let i,s={};const e=(e,t)=>(e=new URL(e+".js",t).href,s[e]||new Promise((s=>{if("document"in self){const i=document.createElement("script");i.src=e,i.onload=s,document.head.appendChild(i)}else i=e,importScripts(e),s()})).then((()=>{let i=s[e];if(!i)throw new Error(`Module ${e} didn’t register its module`);return i})));self.define=(t,r)=>{const n=i||("document"in self?document.currentScript.src:"")||location.href;if(s[n])return;let c={};const o=i=>e(i,n),l={module:{uri:n},exports:c,require:o};s[n]=Promise.all(t.map((i=>l[i]||o(i)))).then((i=>(r(...i),c)))}}define(["./workbox-03ee9729"],(function(i){"use strict";i.setCacheNameDetails({prefix:"fabric-1yHme4LHuqqhshlt"}),self.skipWaiting(),i.clientsClaim(),i.precacheAndRoute([{url:"https://erichsia7.github.io/fabric/dist/252.c266351eb74452222323.min.js",revision:null},{url:"https://erichsia7.github.io/fabric/dist/401.e3f3125b2f5703a83134.min.js",revision:null},{url:"https://erichsia7.github.io/fabric/dist/429.71ad61b9342ecfa43aae.min.js",revision:null},{url:"https://erichsia7.github.io/fabric/dist/448.2ceedcbd29bf1345d076.min.js",revision:null},{url:"https://erichsia7.github.io/fabric/dist/483.53b695f5a2ebc41b83c5.min.js",revision:null},{url:"https://erichsia7.github.io/fabric/dist/667.2094aad1847a750f7785.min.js",revision:null},{url:"https://erichsia7.github.io/fabric/dist/787.d8c2d8dfe45ef7cf2c8f.min.js",revision:null},{url:"https://erichsia7.github.io/fabric/dist/main-298dd76e.76a20b46da9b6277bb1a.min.css",revision:null},{url:"https://erichsia7.github.io/fabric/dist/main-37f2faf7.a374b6b19552e2c9d438.min.js",revision:null},{url:"https://erichsia7.github.io/fabric/dist/main-c7cefed2.a180f248267d259622d0.min.js",revision:null},{url:"https://erichsia7.github.io/fabric/dist/main-ef7d455c.f11d188045f0f483183a.min.js",revision:null}],{}),i.registerRoute(/^https:\/\/fonts.googleapis.com/,new i.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[]}),"GET")}));
//# sourceMappingURL=service-worker.js.map
