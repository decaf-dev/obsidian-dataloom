"use strict";(self.webpackChunkdocumentation=self.webpackChunkdocumentation||[]).push([[622],{3905:(e,t,r)=>{r.d(t,{Zo:()=>u,kt:()=>m});var l=r(7294);function n(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function a(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);t&&(l=l.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,l)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?a(Object(r),!0).forEach((function(t){n(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):a(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function o(e,t){if(null==e)return{};var r,l,n=function(e,t){if(null==e)return{};var r,l,n={},a=Object.keys(e);for(l=0;l<a.length;l++)r=a[l],t.indexOf(r)>=0||(n[r]=e[r]);return n}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(l=0;l<a.length;l++)r=a[l],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(n[r]=e[r])}return n}var c=l.createContext({}),s=function(e){var t=l.useContext(c),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},u=function(e){var t=s(e.components);return l.createElement(c.Provider,{value:t},e.children)},d="mdxType",p={inlineCode:"code",wrapper:function(e){var t=e.children;return l.createElement(l.Fragment,{},t)}},f=l.forwardRef((function(e,t){var r=e.components,n=e.mdxType,a=e.originalType,c=e.parentName,u=o(e,["components","mdxType","originalType","parentName"]),d=s(r),f=n,m=d["".concat(c,".").concat(f)]||d[f]||p[f]||a;return r?l.createElement(m,i(i({ref:t},u),{},{components:r})):l.createElement(m,i({ref:t},u))}));function m(e,t){var r=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var a=r.length,i=new Array(a);i[0]=f;var o={};for(var c in t)hasOwnProperty.call(t,c)&&(o[c]=t[c]);o.originalType=e,o[d]="string"==typeof e?e:n,i[1]=o;for(var s=2;s<a;s++)i[s]=r[s];return l.createElement.apply(null,i)}return l.createElement.apply(null,r)}f.displayName="MDXCreateElement"},5814:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>c,contentTitle:()=>i,default:()=>p,frontMatter:()=>a,metadata:()=>o,toc:()=>s});var l=r(7462),n=(r(7294),r(3905));const a={},i="Last edited time cell",o={unversionedId:"features/table/cells/cell-last-edited-time",id:"features/table/cells/cell-last-edited-time",title:"Last edited time cell",description:"Description",source:"@site/docs/features/table/cells/cell-last-edited-time.mdx",sourceDirName:"features/table/cells",slug:"/features/table/cells/cell-last-edited-time",permalink:"/features/table/cells/cell-last-edited-time",draft:!1,editUrl:"https://github.com/trey-wallis/obsidian-dataloom/tree/master/docusaurus/docs/features/table/cells/cell-last-edited-time.mdx",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"File cell",permalink:"/features/table/cells/cell-file"},next:{title:"Tag cell",permalink:"/features/table/cells/cell-multi-tag"}},c={},s=[{value:"Description",id:"description",level:2},{value:"Usage",id:"usage",level:2},{value:"Settings",id:"settings",level:2}],u={toc:s},d="wrapper";function p(e){let{components:t,...r}=e;return(0,n.kt)(d,(0,l.Z)({},u,r,{components:t,mdxType:"MDXLayout"}),(0,n.kt)("h1",{id:"last-edited-time-cell"},"Last edited time cell"),(0,n.kt)("h2",{id:"description"},"Description"),(0,n.kt)("p",null,"This cell renders the last edited time of the row."),(0,n.kt)("h2",{id:"usage"},"Usage"),(0,n.kt)("p",null,"This value is uneditable. It is updated when you make a change to a cell in the row."),(0,n.kt)("h2",{id:"settings"},"Settings"),(0,n.kt)("p",null,(0,n.kt)("a",{parentName:"p",href:"../../../features/table/column-settings#linking-loom-files#date-format"},"Date format")))}p.isMDXComponent=!0}}]);