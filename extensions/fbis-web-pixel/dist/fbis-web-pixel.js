(()=>{var P=Object.create;var S=Object.defineProperty;var j=Object.getOwnPropertyDescriptor;var L=Object.getOwnPropertyNames;var A=Object.getPrototypeOf,J=Object.prototype.hasOwnProperty;var _=(s,c)=>()=>(s&&(c=s(s=0)),c);var R=(s,c)=>()=>(c||s((c={exports:{}}).exports,c),c.exports);var C=(s,c,n,u)=>{if(c&&typeof c=="object"||typeof c=="function")for(let d of L(c))!J.call(s,d)&&d!==n&&S(s,d,{get:()=>c[d],enumerable:!(u=j(c,d))||u.enumerable});return s};var U=(s,c,n)=>(n=s!=null?P(A(s)):{},C(c||!s||!s.__esModule?S(n,"default",{value:s,enumerable:!0}):n,s));var I=(s,c,n)=>new Promise((u,d)=>{var p=l=>{try{f(n.next(l))}catch(g){d(g)}},h=l=>{try{f(n.throw(l))}catch(g){d(g)}},f=l=>l.done?u(l.value):Promise.resolve(l.value).then(p,h);f((n=n.apply(s,c)).next())});var k,v=_(()=>{k="WebPixel::Render"});var y,O=_(()=>{v();y=s=>shopify.extend(k,s)});var $=_(()=>{O()});var T=_(()=>{$()});var N=R(b=>{"use strict";T();var w="https://finally-back-in-stock-a2662c637241.herokuapp.com";y(({configuration:s,analytics:c,browser:n,init:u})=>{c.subscribe("product_viewed",t=>I(b,null,function*(){let e=d(u.context.document.location.search,"fbis"),r=d(u.context.document.location.search,"email");if(console.log(e,r),e){h(`${e}_view`);{let o=t.data.productVariant.id,i=t.data.productVariant.product.id,a=yield fetch(`${w}/api/customer_activity`,{method:"POST",body:JSON.stringify([{productId:i,variantId:o,shopifyURL:location.host,uuid:e,customerEmail:r,browserTrackId:t.clientId,status:"view"}])}).then(m=>m.json());a.success?(p(`${e}_view`,o,30),p(`${e}_view_email`,r,30),p(o,e),l(t.clientId,"fbis_viewed",i,o,e)):console.error(a.message)}}})),c.subscribe("product_added_to_cart",t=>I(b,null,function*(){console.log(t);let e=t.data.cartLine.merchandise.id,r=t.data.cartLine.merchandise.product.id,o=f(e),i=f(`${o}_view`),a=p(`${o}_view_email`);if(o&&!h(`${o}_cart`)&&i==e){let m=yield fetch(`${w}/api/customer_activity`,{method:"POST",body:JSON.stringify([{productId:r,variantId:t.data.cartLine.merchandise.id,shopifyURL:location.host,uuid:o,browserTrackId:t.clientId,email:a,status:"add_to_cart"}])}).then(E=>E.json());m.success?(p(`${o}_cart`,e,30),l(t.clientId,"fbis_added_to_cart",r,e,o,a)):console.error(m.message)}else console.log("Add to Cart!!")})),c.subscribe("product_removed_from_cart",t=>{console.log("Product Removed!!",t)}),c.subscribe("checkout_completed",t=>I(b,null,function*(){let e=g(t.clientId,"fbis_added_to_cart");if(e){let r=[];e.forEach(i=>{r.push({productId:i.productId,variantId:i.variantId,shopifyURL:location.host,uuid:i.uuid,browserTrackId:t.clientId,status:"completed"})});let o=yield fetch(`${w}/api/customer_activity`,{method:"POST",body:JSON.stringify(r)}).then(i=>i.json());x(t.clientId)}console.log(t)}));function d(t,e){let r=t.substring(1).split("&"),o={};return r.forEach(i=>{let[a,m]=i.split("=");o[a]=m}),o[e]}function p(t,e,r,o="/"){let i=new Date;i.setTime(i.getTime()+r*24*60*60*1e3);let a="expires="+i.toUTCString();document.cookie=`${t}=${e}; ${a}; path=${o}`}function h(t){let e=document.cookie.split("; ");for(let r=0;r<e.length;r++)if(e[r].split("=")[0]===t)return!0;return!1}function f(t){let e=t+"=",r=document.cookie.split(";");for(let o=0;o<r.length;o++){let i=r[o];for(;i.charAt(0)==" ";)i=i.substring(1,i.length);if(i.indexOf(e)==0)return i.substring(e.length,i.length)}return null}function l(t,e,r,o,i){try{let a=JSON.parse(sessionStorage.getItem(t))||{};a[e]||(a[e]=[]),a[e].push({uuid:i,productId:r,variantId:o}),sessionStorage.setItem(t,JSON.stringify(a))}catch(a){console.error("Data error",a)}}function g(t,e){let r=sessionStorage.getItem(t);if(r)return JSON.parse(r)[e]}function x(t){sessionStorage.removeItem(t)}})});var K=U(N());})();
