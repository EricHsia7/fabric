if(!self.define){let i,e={};const s=(s,t)=>(s=new URL(s+".js",t).href,e[s]||new Promise((e=>{if("document"in self){const i=document.createElement("script");i.src=s,i.onload=e,document.head.appendChild(i)}else i=s,importScripts(s),e()})).then((()=>{let i=e[s];if(!i)throw new Error(`Module ${s} didn’t register its module`);return i})));self.define=(t,r)=>{const n=i||("document"in self?document.currentScript.src:"")||location.href;if(e[n])return;let c={};const o=i=>s(i,n),l={module:{uri:n},exports:c,require:o};e[n]=Promise.all(t.map((i=>l[i]||o(i)))).then((i=>(r(...i),c)))}}define(["./workbox-03ee9729"],(function(i){"use strict";i.setCacheNameDetails({prefix:"fabric-XCnFJM2ZXIwxcOn4"}),self.skipWaiting(),i.clientsClaim(),i.precacheAndRoute([{url:"https://erichsia7.github.io/fabric/dist/401.e3f3125b2f5703a83134.min.js",revision:null},{url:"https://erichsia7.github.io/fabric/dist/429.71ad61b9342ecfa43aae.min.js",revision:null},{url:"https://erichsia7.github.io/fabric/dist/483.a257cbd8e1b831ae7e9c.min.js",revision:null},{url:"https://erichsia7.github.io/fabric/dist/493.60d0a6bdfc0917989fd1.min.js",revision:null},{url:"https://erichsia7.github.io/fabric/dist/555.46107d69acc794c87225.min.js",revision:null},{url:"https://erichsia7.github.io/fabric/dist/667.2094aad1847a750f7785.min.js",revision:null},{url:"https://erichsia7.github.io/fabric/dist/main-102ff935.63329f392befee6cb113.min.js",revision:null},{url:"https://erichsia7.github.io/fabric/dist/main-298dd76e.7aafecedce2702cad183.min.css",revision:null},{url:"https://erichsia7.github.io/fabric/dist/main-ef7d455c.fda80419d983ca2b3cfd.min.js",revision:null}],{}),i.registerRoute(/^https:\/\/fonts.googleapis.com/,new i.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[]}),"GET")}));
//# sourceMappingURL=service-worker.js.map
