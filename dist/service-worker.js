if(!self.define){let i,s={};const e=(e,t)=>(e=new URL(e+".js",t).href,s[e]||new Promise((s=>{if("document"in self){const i=document.createElement("script");i.src=e,i.onload=s,document.head.appendChild(i)}else i=e,importScripts(e),s()})).then((()=>{let i=s[e];if(!i)throw new Error(`Module ${e} didn’t register its module`);return i})));self.define=(t,r)=>{const n=i||("document"in self?document.currentScript.src:"")||location.href;if(s[n])return;let o={};const c=i=>e(i,n),l={module:{uri:n},exports:o,require:c};s[n]=Promise.all(t.map((i=>l[i]||c(i)))).then((i=>(r(...i),o)))}}define(["./workbox-03ee9729"],(function(i){"use strict";i.setCacheNameDetails({prefix:"fabric-MlW6OV1ePoCJ5QsD"}),self.skipWaiting(),i.clientsClaim(),i.precacheAndRoute([{url:"https://erichsia7.github.io/fabric/dist/401.e3f3125b2f5703a83134.min.js",revision:null},{url:"https://erichsia7.github.io/fabric/dist/429.71ad61b9342ecfa43aae.min.js",revision:null},{url:"https://erichsia7.github.io/fabric/dist/483.a257cbd8e1b831ae7e9c.min.js",revision:null},{url:"https://erichsia7.github.io/fabric/dist/493.60d0a6bdfc0917989fd1.min.js",revision:null},{url:"https://erichsia7.github.io/fabric/dist/555.46107d69acc794c87225.min.js",revision:null},{url:"https://erichsia7.github.io/fabric/dist/667.2094aad1847a750f7785.min.js",revision:null},{url:"https://erichsia7.github.io/fabric/dist/main-102ff935.9819582a1db0a26e320d.min.js",revision:null},{url:"https://erichsia7.github.io/fabric/dist/main-298dd76e.3a0a3b39232270454dff.min.css",revision:null},{url:"https://erichsia7.github.io/fabric/dist/main-ef7d455c.b936435639f8a330413e.min.js",revision:null}],{}),i.registerRoute(/^https:\/\/fonts.googleapis.com/,new i.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[]}),"GET")}));
//# sourceMappingURL=service-worker.js.map
