"use strict";(self.webpackChunkdocumentation=self.webpackChunkdocumentation||[]).push([[274],{3905:(e,t,r)=>{r.d(t,{Zo:()=>u,kt:()=>m});var n=r(7294);function l(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function a(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?a(Object(r),!0).forEach((function(t){l(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):a(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function o(e,t){if(null==e)return{};var r,n,l=function(e,t){if(null==e)return{};var r,n,l={},a=Object.keys(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||(l[r]=e[r]);return l}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(l[r]=e[r])}return l}var c=n.createContext({}),s=function(e){var t=n.useContext(c),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},u=function(e){var t=s(e.components);return n.createElement(c.Provider,{value:t},e.children)},d="mdxType",p={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},b=n.forwardRef((function(e,t){var r=e.components,l=e.mdxType,a=e.originalType,c=e.parentName,u=o(e,["components","mdxType","originalType","parentName"]),d=s(r),b=l,m=d["".concat(c,".").concat(b)]||d[b]||p[b]||a;return r?n.createElement(m,i(i({ref:t},u),{},{components:r})):n.createElement(m,i({ref:t},u))}));function m(e,t){var r=arguments,l=t&&t.mdxType;if("string"==typeof e||l){var a=r.length,i=new Array(a);i[0]=b;var o={};for(var c in t)hasOwnProperty.call(t,c)&&(o[c]=t[c]);o.originalType=e,o[d]="string"==typeof e?e:l,i[1]=o;for(var s=2;s<a;s++)i[s]=r[s];return n.createElement.apply(null,i)}return n.createElement.apply(null,r)}b.displayName="MDXCreateElement"},957:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>c,contentTitle:()=>i,default:()=>p,frontMatter:()=>a,metadata:()=>o,toc:()=>s});var n=r(7462),l=(r(7294),r(3905));const a={},i="Embed cell",o={unversionedId:"features/table/cells/cell-embed",id:"features/table/cells/cell-embed",title:"Embed cell",description:"Description",source:"@site/docs/features/table/cells/cell-embed.mdx",sourceDirName:"features/table/cells",slug:"/features/table/cells/cell-embed",permalink:"/features/table/cells/cell-embed",draft:!1,editUrl:"https://github.com/trey-wallis/obsidian-dataloom/tree/master/docusaurus/docs/features/table/cells/cell-embed.mdx",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"Date cell",permalink:"/features/table/cells/cell-date"},next:{title:"File cell",permalink:"/features/table/cells/cell-file"}},c={},s=[{value:"Description",id:"description",level:2},{value:"Usage",id:"usage",level:2}],u={toc:s},d="wrapper";function p(e){let{components:t,...r}=e;return(0,l.kt)(d,(0,n.Z)({},u,r,{components:t,mdxType:"MDXLayout"}),(0,l.kt)("h1",{id:"embed-cell"},"Embed cell"),(0,l.kt)("h2",{id:"description"},"Description"),(0,l.kt)("p",null,"This cell renders an embedded link."),(0,l.kt)("h2",{id:"usage"},"Usage"),(0,l.kt)("p",null,"This cell accepts any text. It will render an embedded link using the ",(0,l.kt)("a",{parentName:"p",href:"https://help.obsidian.md/Editing+and+formatting/Embedding+web+pages"},"embedded file syntax"),"."),(0,l.kt)("p",null,"The embed type will render any links that Obsidian supports. Currently Obsidian supports embedded Twitter and YouTube links."))}p.isMDXComponent=!0}}]);