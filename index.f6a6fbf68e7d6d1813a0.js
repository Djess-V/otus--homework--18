!function(){"use strict";const t={randomUUID:"undefined"!=typeof crypto&&crypto.randomUUID&&crypto.randomUUID.bind(crypto)};let e;const n=new Uint8Array(16);function s(){if(!e&&(e="undefined"!=typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto),!e))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return e(n)}const o=[];for(let t=0;t<256;++t)o.push((t+256).toString(16).slice(1));const i=function(e,n,i){if(t.randomUUID&&!n&&!e)return t.randomUUID();const a=(e=e||{}).random||(e.rng||s)();if(a[6]=15&a[6]|64,a[8]=63&a[8]|128,n){i=i||0;for(let t=0;t<16;++t)n[i+t]=a[t];return n}return function(t,e=0){return(o[t[e+0]]+o[t[e+1]]+o[t[e+2]]+o[t[e+3]]+"-"+o[t[e+4]]+o[t[e+5]]+"-"+o[t[e+6]]+o[t[e+7]]+"-"+o[t[e+8]]+o[t[e+9]]+"-"+o[t[e+10]]+o[t[e+11]]+o[t[e+12]]+o[t[e+13]]+o[t[e+14]]+o[t[e+15]]).toLowerCase()}(a)};class a{listeners=[];previousPath=null;constructor(t="history"){this.mode=t,this.currentPath=this.getPath(),this.init()}static isMatch=(t,e)=>t instanceof RegExp&&t.test(e)||"function"==typeof t&&t(e)||"string"==typeof t&&t===e;static getQueryParams=()=>{const t=/\?(.+)$/.exec(window.location.href);return t?t[1].split("&").reduce(((t,e)=>{const[n,s]=e.split("=");return t[n]=s,t}),{}):{}};init=()=>{"history"===this.mode?window.addEventListener("popstate",this.bindHandlePopState):"hash"===this.mode&&window.addEventListener("hashchange",this.bindHandleHashChange),document.body.addEventListener("click",this.bindHandleClick)};unsubscribeAll=()=>{"history"===this.mode?window.removeEventListener("popstate",this.bindHandlePopState):"hash"===this.mode&&window.removeEventListener("hashchange",this.bindHandleHashChange),document.body.removeEventListener("click",this.bindHandleClick)};getPath=()=>"hash"===this.mode?""===window.location.hash?"/":window.location.hash.slice(1):window.location.pathname+window.location.search;handleListener=async({match:t,hooks:e},n,s={})=>{const o={...s,...a.getQueryParams()},i={currentPath:n,previousPath:this.previousPath,state:o};this.previousPath&&a.isMatch(t,this.previousPath)&&e.onLeave?await e.onLeave(i):(a.isMatch(t,n)&&e.onBeforeEnter&&await e.onBeforeEnter(i),a.isMatch(t,n)&&e.onEnter&&await e.onEnter(i))};handleAllListeners=(t,e,n={})=>{const s=this.listeners.find((e=>a.isMatch(e.match,t)));s&&this.handleListener(s,e,n);const o=this.listeners.find((t=>a.isMatch(t.match,e)));o&&this.handleListener(o,e,n)};on=(t,e={})=>{const n=i(),s={id:n,match:t,hooks:e};return this.listeners.push(s),this.handleListener(s,this.currentPath),()=>{this.listeners=this.listeners.filter((t=>t.id!==n))}};go=(t,e={})=>{this.previousPath=this.currentPath,"hash"===this.mode?window.location.hash=t:"history"===this.mode&&window.history.pushState(e,"",t),this.currentPath=this.getPath(),this.handleAllListeners(this.previousPath,this.currentPath,e)};handleClick=t=>{if(!t.target.matches("a"))return;t.preventDefault();const e=t.target.getAttribute("href")??"";this.go(e)};bindHandleClick=this.handleClick.bind(this);handlePopState=()=>{this.previousPath=this.currentPath,this.currentPath=this.getPath(),this.handleAllListeners(this.previousPath,this.currentPath,{})};bindHandlePopState=this.handlePopState.bind(this);handleHashChange=()=>{this.currentPath!==this.getPath()&&(this.previousPath=this.currentPath,this.currentPath=this.getPath(),this.handleAllListeners(this.previousPath,this.currentPath,{}))};bindHandleHashChange=this.handleHashChange.bind(this)}const r=t=>(...e)=>{console.log(`${t} args=${JSON.stringify(e)}`),document.getElementById("root").innerHTML=`${t}`},h=t=>(...e)=>{console.log(`${t} args=${JSON.stringify(e)}`)},c=t=>(...e)=>{console.log(`${t} args=${JSON.stringify(e)}`)};window.addEventListener("load",(()=>{const t=document.querySelectorAll("[data-name=terms]");t.forEach((e=>e.addEventListener("click",(()=>{"history"===e.dataset.id&&document.querySelectorAll("a").forEach((t=>{t.href="/otus--homework--18"+t.pathname})),(t=>{const e=document.getElementById("nav"),n=document.getElementById("root");e.style.display="flex",n.style.display="",((t,e)=>{let n="/otus--homework--18";"hash"===e&&(n=""),t.on(new RegExp(`^${n}/$`),{onEnter:r("/"),onLeave:c("[onLeave] /")});const s=t.on((t=>t===`${n}/contacts`),{onEnter:r("/contacts"),onBeforeEnter:h("[onBeforeEnter] /contacts")});t.on(`${n}/about`,{onEnter:r("/about"),onLeave:c("[onLeave] /about")}),t.on(`${n}/about/us`,{onEnter:r("/about/us")}),t.on(new RegExp(`^${n}/login$`),{onEnter:r("/login"),onBeforeEnter:h("[onBeforeEnter] /login")});const o=document.getElementById("contacts"),i=t=>{t.preventDefault(),setTimeout((()=>{s(),console.log("------  Произведена отписка от выполнения хуков при последующих кликах на ссылку - '/contacts'  ------")}),0),o?.removeEventListener("click",i)};o?.addEventListener("click",i)})(new a(t),t)})(e.dataset.id),t.forEach((t=>{t.remove()}))}))))}))}();