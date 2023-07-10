"use strict";(self.webpackChunkdocumentation=self.webpackChunkdocumentation||[]).push([[708],{3905:(e,t,a)=>{a.d(t,{Zo:()=>p,kt:()=>c});var n=a(7294);function r(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function d(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function o(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?d(Object(a),!0).forEach((function(t){r(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):d(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function i(e,t){if(null==e)return{};var a,n,r=function(e,t){if(null==e)return{};var a,n,r={},d=Object.keys(e);for(n=0;n<d.length;n++)a=d[n],t.indexOf(a)>=0||(r[a]=e[a]);return r}(e,t);if(Object.getOwnPropertySymbols){var d=Object.getOwnPropertySymbols(e);for(n=0;n<d.length;n++)a=d[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var l=n.createContext({}),s=function(e){var t=n.useContext(l),a=t;return e&&(a="function"==typeof e?e(t):o(o({},t),e)),a},p=function(e){var t=s(e.components);return n.createElement(l.Provider,{value:t},e.children)},u="mdxType",m={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},h=n.forwardRef((function(e,t){var a=e.components,r=e.mdxType,d=e.originalType,l=e.parentName,p=i(e,["components","mdxType","originalType","parentName"]),u=s(a),h=r,c=u["".concat(l,".").concat(h)]||u[h]||m[h]||d;return a?n.createElement(c,o(o({ref:t},p),{},{components:a})):n.createElement(c,o({ref:t},p))}));function c(e,t){var a=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var d=a.length,o=new Array(d);o[0]=h;var i={};for(var l in t)hasOwnProperty.call(t,l)&&(i[l]=t[l]);i.originalType=e,i[u]="string"==typeof e?e:r,o[1]=i;for(var s=2;s<d;s++)o[s]=a[s];return n.createElement.apply(null,o)}return n.createElement.apply(null,a)}h.displayName="MDXCreateElement"},1119:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>l,contentTitle:()=>o,default:()=>m,frontMatter:()=>d,metadata:()=>i,toc:()=>s});var n=a(7462),r=(a(7294),a(3905));const d={},o="Embedding dashboards",i={unversionedId:"other/embedding-dashboards",id:"other/embedding-dashboards",title:"Embedding dashboards",description:"Basic usage",source:"@site/docs/other/embedding-dashboards.mdx",sourceDirName:"other",slug:"/other/embedding-dashboards",permalink:"/other/embedding-dashboards",draft:!1,editUrl:"https://github.com/trey-wallis/obsidian-dataloom/tree/master/docusaurus/docs/other/embedding-dashboards.mdx",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"Creating a snippet",permalink:"/guides/create-a-snippet"},next:{title:"Export",permalink:"/other/export"}},l={},s=[{value:"Basic usage",id:"basic-usage",level:2},{value:"Setting a width and height",id:"setting-a-width-and-height",level:2},{value:"Examples",id:"examples",level:3}],p={toc:s},u="wrapper";function m(e){let{components:t,...a}=e;return(0,r.kt)(u,(0,n.Z)({},p,a,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"embedding-dashboards"},"Embedding dashboards"),(0,r.kt)("h2",{id:"basic-usage"},"Basic usage"),(0,r.kt)("blockquote",null,(0,r.kt)("p",{parentName:"blockquote"},"Please make sure that you have enabled ",(0,r.kt)("a",{parentName:"p",href:"../getting-started/quick-start#linking-dashboard-files"},"detection of all extensions"))),(0,r.kt)("p",null,"A dashboard may be embedded into a note by using the ",(0,r.kt)("a",{parentName:"p",href:"https://help.obsidian.md/Linking+notes+and+files/Embedding+files"},"embedded file syntax"),"."),(0,r.kt)("p",null,"Example dashboard"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-markdown"},"![[my-dashboard.dashboard]]\n")),(0,r.kt)("p",null,"An embedded dashboard will preform the same functions as a normal dashboard, the only limitation being a smaller window."),(0,r.kt)("p",null,"Changes that are made to an embedded dashboard will be saved to the dashboard file. Changes made to an embedded dashboard will also update any open tabs that contain a dashboard."),(0,r.kt)("h2",{id:"setting-a-width-and-height"},"Setting a width and height"),(0,r.kt)("p",null,"An embedded dashboard has a default width of ",(0,r.kt)("inlineCode",{parentName:"p"},"100%")," and a default height of ",(0,r.kt)("inlineCode",{parentName:"p"},"340px"),". A height of ",(0,r.kt)("inlineCode",{parentName:"p"},"340px")," will render exactly 4 body rows."),(0,r.kt)("p",null,"If you would like to modify the width or height of a dashboard, you can use the ",(0,r.kt)("a",{parentName:"p",href:"https://help.obsidian.md/Linking+notes+and+files/Embedding+files#Embed+an+image+in+a+note"},"embedded image syntax"),"."),(0,r.kt)("blockquote",null,(0,r.kt)("p",{parentName:"blockquote"},"Note: setting a value of ",(0,r.kt)("inlineCode",{parentName:"p"},"0")," will use the default value.")),(0,r.kt)("h3",{id:"examples"},"Examples"),(0,r.kt)("p",null,"An embedded dashboard with a width of ",(0,r.kt)("inlineCode",{parentName:"p"},"300px")," and height of ",(0,r.kt)("inlineCode",{parentName:"p"},"300px")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-markdown"},"![[Untitled.dashboard|300x300]]\n")),(0,r.kt)("p",null,"An embedded dashboard with a default with and height of ",(0,r.kt)("inlineCode",{parentName:"p"},"300px")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-markdown"},"![[Untitled.dashboard|0x300]]\n")),(0,r.kt)("p",null,"An embedded dashboard with a width of ",(0,r.kt)("inlineCode",{parentName:"p"},"300px")," and a default height"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-markdown"},"![[Untitled.dashboard|300x0]]\n")))}m.isMDXComponent=!0}}]);