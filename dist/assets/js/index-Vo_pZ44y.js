const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/js/HomePage-B2BA1fON.js","assets/js/vendor-frSDhvcu.js","assets/js/Herobanner-CacwlC5R.js","assets/js/vendor-router-CdLpK7Hz.js","assets/js/ProductCard-BLZfNBJE.js","assets/js/seo-MhTlIJlM.js","assets/js/LoginWrapper-B4NtgB4h.js","assets/js/useProduct-DwD5ms5c.js","assets/js/vendor-apollo-CIbFPnud.js","assets/js/Login-CQHOWs1y.js","assets/js/AccountPage-BxHp1zaC.js","assets/js/ProductDetailPage-D25hUUtW.js","assets/js/ErrorMessage-DHxw210G.js","assets/js/AddToCartButton-_YNzBzn1.js","assets/js/FeaturedProducts-vca_8CJD.js","assets/js/CategoryPage-DucB-MTb.js","assets/js/ProductFilter-D1eJOwrX.js","assets/js/Cart-Du_DMd6V.js","assets/js/Checkout-x57pERyM.js","assets/js/SearchResults-We6yQnwK.js","assets/js/EmptyState-7luI3g9b.js","assets/js/WishlistPage-Bq8A7ljR.js","assets/js/Page404-BE9CU5z3.js","assets/js/Faqs-DvzgyGdu.js","assets/js/ShippingReturns-ClrvtHSg.js","assets/js/PrivacyPolicyPage-BZr7XrLj.js","assets/js/ContactPage-CCbtxFaY.js"])))=>i.map(i=>d[i]);
import{r as e,j as t,F as r,k as s,l as a,R as n,m as i,n as o,o as l,y as c,p as d,q as u,s as m,t as g,u as h,v as p,x as y,z as x,L as f}from"./vendor-frSDhvcu.js";import{c as b,A as v,I as w,g as _}from"./vendor-apollo-CIbFPnud.js";import{L as j,u as N,a as k,b as S,c as P,R as C,d as $,N as I,B as q}from"./vendor-router-CdLpK7Hz.js";!function(){const e=document.createElement("link").relList;if(!(e&&e.supports&&e.supports("modulepreload"))){for(const e of document.querySelectorAll('link[rel="modulepreload"]'))t(e);new MutationObserver((e=>{for(const r of e)if("childList"===r.type)for(const e of r.addedNodes)"LINK"===e.tagName&&"modulepreload"===e.rel&&t(e)})).observe(document,{childList:!0,subtree:!0})}function t(e){if(e.ep)return;e.ep=!0;const t=function(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),"use-credentials"===e.crossOrigin?t.credentials="include":"anonymous"===e.crossOrigin?t.credentials="omit":t.credentials="same-origin",t}(e);fetch(e.href,t)}}();const A={},E=function(e,t,r){let s=Promise.resolve();if(t&&t.length>0){let e=function(e){return Promise.all(e.map((e=>Promise.resolve(e).then((e=>({status:"fulfilled",value:e})),(e=>({status:"rejected",reason:e}))))))};document.getElementsByTagName("link");const r=document.querySelector("meta[property=csp-nonce]"),a=(null==r?void 0:r.nonce)||(null==r?void 0:r.getAttribute("nonce"));s=e(t.map((e=>{if((e=function(e){return"/"+e}(e))in A)return;A[e]=!0;const t=e.endsWith(".css"),r=t?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${e}"]${r}`))return;const s=document.createElement("link");return s.rel=t?"stylesheet":"modulepreload",t||(s.as="script"),s.crossOrigin="",s.href=e,a&&s.setAttribute("nonce",a),document.head.appendChild(s),t?new Promise(((t,r)=>{s.addEventListener("load",t),s.addEventListener("error",(()=>r(new Error(`Unable to preload CSS for ${e}`))))})):void 0})))}function a(e){const t=new Event("vite:preloadError",{cancelable:!0});if(t.payload=e,window.dispatchEvent(t),!t.defaultPrevented)throw e}return s.then((t=>{for(const e of t||[])"rejected"===e.status&&a(e.reason);return e().catch(a)}))},T={},F={},D=3e5,O=(e,t,r={})=>{const{cacheTime:s=D}=r;if(T[e]&&T[e].expiry>Date.now())return Promise.resolve(T[e].data);if(F[e])return F[e];const a=t().then((t=>(T[e]={data:t,expiry:Date.now()+s},delete F[e],t))).catch((t=>{throw delete F[e],t}));return F[e]=a,a},z=new v({link:b({uri:"http://magento.local:8001//graphql",credentials:"same-origin"}),cache:new w({typePolicies:{Query:{fields:{products:{merge:(e={items:[]},t)=>t}}}}}),defaultOptions:{watchQuery:{fetchPolicy:"cache-and-network"}}}),R="all-categories",U=e=>`category-tree-${e}`,L=e=>`category-${e}`,B=e=>`category-children-${e}`,G=e=>`featured-categories-${e}`,M=e=>`category-filters-${e}`,W=(e,t)=>`products-category-${e}-${JSON.stringify(t)}`,J=_`
  fragment CategoryFields on CategoryTree {
    id
    name
    url_key
    level
    path
    children_count
    image
    description
    meta_title
    meta_keywords
    meta_description
  }
`,K=_`
  fragment ProductFields on ProductInterface {
    id
    sku
    name
    url_key
    price_range {
      minimum_price {
        regular_price {
          value
          currency
        }
        final_price {
          value
          currency
        }
        discount {
          amount_off
          percent_off
        }
      }
    }
    image {
      url
      label
    }
    small_image {
      url
      label
    }
    thumbnail {
      url
      label
    }
    short_description {
      html
    }
  }
`,V=async()=>O(R,(async()=>{try{const{data:e}=await z.query({query:_`
            query GetAllCategories {
              categories {
                items {
                  id
                  name
                  url_key
                  level
                  path
                  children {
                    id
                    name
                    url_key
                    level
                    path
                    children {
                      id
                      name
                      url_key
                      level
                      path
                    }
                  }
                }
              }
            }
          `,fetchPolicy:"network-only"}),t=[],r=(e,s="")=>{const a=[];if(!e)return a;for(const n of e){if(n.id<=2){if(n.children&&n.children.length>0){const e=r(n.children);t.push(...e)}continue}const e={category_id:n.id,name:n.name,url_key:n.url_key||"",level:n.level,parent_id:n.path?n.path.split("/").slice(-2,-1)[0]:null,path:s?`${s}/${n.url_key||n.id}`:n.url_key||String(n.id),children:[]};n.children&&n.children.length>0&&(e.children=r(n.children,e.path)),a.push(e),t.push(e)}return a};return e.categories&&e.categories.items&&e.categories.items.length>0&&r(e.categories.items),{original:e.categories.items,items:t}}catch(e){throw e}}),{cacheTime:6e5}),H=async(e=2)=>O(U(e),(async()=>{try{const{data:t}=await z.query({query:_`
            query GetCategoryTree($id: String!) {
              categories(filters: { ids: { eq: $id } }) {
                items {
                  id
                  name
                  url_key
                  level
                  path
                  children {
                    id
                    name
                    url_key
                    level
                    path
                    children {
                      id
                      name
                      url_key
                      level
                      path
                      children {
                        id
                        name
                        url_key
                        level
                        path
                      }
                    }
                  }
                }
              }
            }
          `,variables:{id:String(e)},fetchPolicy:"network-only"}),r=e=>{if(!e)return null;const t={category_id:e.id,id:e.id,name:e.name,url_key:e.url_key||"",level:e.level,path:e.path,children_data:[]};return e.children&&e.children.length>0&&(t.children_data=e.children.map((e=>r(e)))),t};return t.categories&&t.categories.items&&0!==t.categories.items.length?r(t.categories.items[0]):null}catch(t){throw t}}),{cacheTime:6e5}),Y=async e=>O(L(e),(async()=>{try{const{data:t}=await z.query({query:_`
            query GetCategoryById($id: String!) {
              categories(filters: { ids: { eq: $id } }) {
                items {
                  ...CategoryFields
                }
              }
            }
            ${J}
          `,variables:{id:String(e)},fetchPolicy:"network-only"});if(!t.categories||!t.categories.items||0===t.categories.items.length)throw new Error(`Category with ID ${e} not found`);const r=t.categories.items[0];return{id:r.id,parent_id:r.path?r.path.split("/").slice(-2,-1)[0]:null,name:r.name,is_active:!0,level:r.level,path:r.path,url_key:r.url_key,children_count:r.children_count||0,meta_title:r.meta_title,meta_keywords:r.meta_keywords,meta_description:r.meta_description,image:r.image,description:r.description}}catch(t){throw t}}),{cacheTime:6e5}),Q=async e=>{try{const{data:t}=await z.query({query:_`
        query GetCategoryByUrlKey($urlKey: String!) {
          categories(filters: { url_key: { eq: $urlKey } }) {
            items {
              ...CategoryFields
            }
          }
        }
        ${J}
      `,variables:{urlKey:e},fetchPolicy:"network-only"});if(!t.categories||!t.categories.items||0===t.categories.items.length)throw new Error(`Category with URL key "${e}" not found`);const r=t.categories.items[0];return{category_id:r.id,id:r.id,name:r.name,url_key:r.url_key,level:r.level,parent_id:r.path?r.path.split("/").slice(-2,-1)[0]:null,path:r.path,image:r.image,description:r.description,meta_title:r.meta_title,meta_keywords:r.meta_keywords,meta_description:r.meta_description,children_count:r.children_count||0,children:[]}}catch(t){throw t}},Z=async(e,t={})=>O(W(e,t),(async()=>{try{const{pageSize:r=20,currentPage:s=1,sortField:a="position",sortDirection:n="ASC"}=t,i={};i[a]=n.toLowerCase();const{data:o}=await z.query({query:_`
            query GetProductsByCategory(
              $categoryId: String!
              $pageSize: Int!
              $currentPage: Int!
              $sort: ProductAttributeSortInput
            ) {
              products(
                filter: { category_id: { eq: $categoryId } }
                pageSize: $pageSize
                currentPage: $currentPage
                sort: $sort
              ) {
                total_count
                items {
                  ...ProductFields
                }
                page_info {
                  page_size
                  current_page
                  total_pages
                }
              }
            }
            ${K}
          `,variables:{categoryId:String(e),pageSize:r,currentPage:s,sort:i},fetchPolicy:"network-only"});return{items:o.products.items,total_count:o.products.total_count,search_criteria:{filter_groups:[{filters:[{field:"category_id",value:String(e),condition_type:"eq"}]}],page_size:r,current_page:s,sort_orders:[{field:a,direction:n}]},page_info:o.products.page_info}}catch(r){throw r}}),{cacheTime:3e5}),X=async(e,t={})=>{try{const r=await Q(e);if(!r||!r.category_id)throw new Error(`Invalid category with URL key "${e}"`);return Z(r.category_id,t)}catch(r){throw r}},ee=async e=>O(B(e),(async()=>{try{const{data:t}=await z.query({query:_`
            query GetChildCategories($parentId: String!) {
              categories(filters: { parent_id: { eq: $parentId } }) {
                items {
                  ...CategoryFields
                }
              }
            }
            ${J}
          `,variables:{parentId:String(e)},fetchPolicy:"network-only"});return t.categories&&t.categories.items?{items:t.categories.items.map((t=>({id:t.id,parent_id:e,name:t.name,is_active:!0,level:t.level,path:t.path,url_key:t.url_key,children_count:t.children_count||0,image:t.image,description:t.description})))}:{items:[]}}catch(t){throw t}}),{cacheTime:6e5}),te=async e=>{try{const{data:t}=await z.query({query:_`
        query GetCategoryPath($categoryId: String!) {
          categories(filters: { ids: { eq: $categoryId } }) {
            items {
              id
              name
              url_key
              level
              path
              breadcrumbs {
                category_id
                category_name
                category_url_key
                category_level
              }
            }
          }
        }
      `,variables:{categoryId:String(e)},fetchPolicy:"network-only"});if(!t.categories||!t.categories.items||0===t.categories.items.length)throw new Error(`Category with ID ${e} not found`);const r=t.categories.items[0];if(!r.breadcrumbs||0===r.breadcrumbs.length)return[{id:r.id,name:r.name,url_key:r.url_key,level:r.level}];const s=r.breadcrumbs.map((e=>({id:e.category_id,name:e.category_name,url_key:e.category_url_key,level:e.category_level})));return s.push({id:r.id,name:r.name,url_key:r.url_key,level:r.level}),s}catch(t){throw t}},re=async(e=10)=>O(G(e),(async()=>{try{const{data:t}=await z.query({query:_`
            query GetFeaturedCategories {
              categories(filters: { level: { gt: "1" } }) {
                items {
                  id
                  name
                  url_key
                  level
                  path
                  image
                  children_count
                  description
                }
              }
            }
          `,fetchPolicy:"network-only"});if(!t.categories||!t.categories.items)return{items:[]};return{items:t.categories.items.filter((e=>e.image)).slice(0,e).map((e=>({id:e.id,name:e.name,url_key:e.url_key,level:e.level,path:e.path,image:e.image,children_count:e.children_count||0,description:e.description})))}}catch(t){throw t}}),{cacheTime:6e5}),se=async e=>O(M(e),(async()=>{try{const{data:t}=await z.query({query:_`
            query GetCategoryFilters($categoryId: String!) {
              products(filter: { category_id: { eq: $categoryId } }) {
                aggregations {
                  attribute_code
                  count
                  label
                  options {
                    count
                    label
                    value
                  }
                }
              }
            }
          `,variables:{categoryId:String(e)},fetchPolicy:"network-only"});return{layer_filter:t.products.aggregations}}catch(t){throw t}}),{cacheTime:6e5}),ae=async(e,t=20)=>{try{const{data:r}=await z.query({query:_`
        query SearchCategories($searchTerm: String!) {
          categories(filters: { name: { match: $searchTerm } }) {
            items {
              id
              name
              url_key
              level
              path
              children_count
              image
              description
            }
          }
        }
      `,variables:{searchTerm:e},fetchPolicy:"network-only"});if(!r.categories||!r.categories.items)return{items:[]};const s=r.categories.items.filter((e=>e.id>2&&e.level>1));return{items:s.slice(0,t).map((e=>({id:e.id,name:e.name,url_key:e.url_key,level:e.level,path:e.path,children_count:e.children_count||0,image:e.image,description:e.description})))}}catch(r){throw r}},ne=e.createContext(null),ie=({children:r})=>{const[s,a]=e.useState(null),[n,i]=e.useState(!1),[o,l]=e.useState(null),[c,d]=e.useState(!1),[u,m]=e.useState(null),g=e.useCallback((async()=>{try{i(!0),l(null);const e=await H();if(!e)throw new Error("Could not load category tree");return a(e),d(!0),i(!1),e}catch(e){return l("Failed to load categories. Please try again later."),i(!1),null}}),[]),h=e.useCallback((async e=>{try{i(!0),l(null);const t=await Q(e);return m(t),i(!1),t}catch(t){return l("Failed to load category. Please try again later."),i(!1),null}}),[]),p=e.useCallback(((e,t=s)=>{if(!t)return null;if(t.id===e||t.category_id===e)return t;const r=t.children_data||t.children||[];for(const s of r){const t=p(e,s);if(t)return t}return null}),[s]),y=e.useCallback(((e,t=s,r=[])=>{if(!t)return[];const a=[...r,t];if(t.url_key===e)return a;const n=t.children_data||t.children||[];for(const s of n){const t=y(e,s,a);if(t.length>0)return t}return[]}),[s]),x=e.useCallback((e=>{const t=p(e);return t&&(t.children_data||t.children)||[]}),[p]),f=e.useCallback((e=>{const t=p(e);if(!t)return!1;if(void 0!==t.children_count)return t.children_count>0;return(t.children_data||t.children||[]).length>0}),[p]),b=e.useCallback((()=>{if(!s)return[];const e=(t,r=[])=>{if(!t)return r;r.push(t);return(t.children_data||t.children||[]).forEach((t=>e(t,r))),r};return e(s)}),[s]),v=e.useCallback((()=>l(null)),[]),w={categoryTree:s,loading:n,error:o,initialized:c,currentCategory:u,loadCategoryTree:g,loadCategoryByUrlKey:h,getCategoryById:p,getCategoryPath:y,getSubcategories:x,hasChildren:f,getAllCategories:b,clearError:v};return t.jsx(ne.Provider,{value:w,children:r})},oe=()=>{const t=e.useContext(ne);if(!t)throw new Error("useCategory must be used within a CategoryProvider");return t};function le(){return t.jsx("div",{style:{width:"100vw",height:"100vh",zIndex:999},children:t.jsx("div",{className:"fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-80 backdrop-blur-sm",children:t.jsxs("div",{className:"flex flex-col items-center",children:[t.jsx("div",{className:"animate-spin rounded-full h-14 w-14 border-4 border-t-indigo-600 border-b-indigo-600 border-transparent"}),t.jsx("span",{className:"mt-4 text-base font-semibold text-gray-700 tracking-wide",children:"Loading..."})]})})})}const ce=e.memo((({item:s,level:a,parentSlug:n,activeLevels:i,handleMouseEnter:o,handleMouseLeave:l})=>{const c=(e,t)=>1===t?e.subcategories||[]:2===t?e.children||[]:3===t?e.subchildren||[]:4===t&&e.subsubchildren||[],d=c(s,a).length>0,u=`${s.slug}`,m=e.useRef(null),[g,h]=e.useState("left-full ml-1");return e.useEffect((()=>{if(m.current&&d&&i[a]===s.id){const e=m.current.getBoundingClientRect(),t=window.innerWidth;e.right+200>t?h("right-full mr-1"):h("left-full ml-1")}}),[i,a,s.id,d]),t.jsxs("li",{className:"group relative",ref:m,onMouseEnter:()=>o(a,s.id),onMouseLeave:()=>l(a),children:[t.jsxs(j,{to:`/category/${u}`,className:`flex items-center justify-between px-4 py-2 text-sm ${1===a?"font-medium text-gray-800 hover:text-indigo-600":"text-gray-700 hover:bg-indigo-50"} rounded-md transition-colors duration-200`,children:[s.name,d&&t.jsx(r,{className:"ml-2 text-gray-400 group-hover:text-indigo-500 text-xs"})]}),d&&i[a]===s.id&&t.jsx("div",{className:`absolute top-0 ${g} z-50 animate-fadeIn`,children:t.jsx("ul",{className:"bg-white shadow-xl rounded-lg py-2 px-1 min-w-[200px] border border-gray-100",children:c(s,a).map((e=>t.jsx(ce,{item:e,level:a+1,parentSlug:u,activeLevels:i,handleMouseEnter:o,handleMouseLeave:l},e.id)))})})]})})),de=e.memo((({item:e,level:r,parentSlug:n,expandedCategories:i,toggleCategory:o,setMobileMenuOpen:l})=>{const c=`${e.slug}`,d=(u=e,1===(m=r)?u.subcategories||[]:2===m?u.children||[]:3===m?u.subchildren||[]:4===m&&u.subsubchildren||[]);var u,m;const g=d&&d.length>0,h=i[`${r}-${e.id}`],p=N();return t.jsxs("li",{className:"border-b border-gray-100 last:border-b-0",children:[t.jsxs("div",{className:"flex items-center justify-between py-3",children:[t.jsx("button",{onClick:()=>{p(`/category/${c}`),l(!1)},className:"flex-1 text-left "+(1===r?"font-medium text-gray-800":"text-gray-700  sdasasa"),children:e.name}),g&&t.jsx("button",{className:"p-2 text-gray-500 hover:text-indigo-600 focus:outline-none transition-colors",onClick:()=>o(e.id,r),children:h?t.jsx(s,{size:16}):t.jsx(a,{size:16})})]}),g&&h&&t.jsx("div",{className:"ml-4 mb-1",children:t.jsx("ul",{className:""+(r>1?"border-l-2 border-gray-200 pl-4":""),children:d.map((e=>t.jsx(de,{item:e,level:r+1,parentSlug:c,expandedCategories:i,toggleCategory:o,setMobileMenuOpen:l},e.id)))})})]})})),ue=n.memo((()=>{const[r,s]=e.useState([]),{categoryTree:a,loading:n,error:l,initialized:c,loadCategoryTree:d}=oe(),[u,m]=e.useState(!1),[g,h]=e.useState({}),[p,y]=e.useState({}),x=e.useRef(null),[f,b]=e.useState(!1);e.useEffect((()=>{const e=()=>{b(window.scrollY>10)};return window.addEventListener("scroll",e),()=>window.removeEventListener("scroll",e)}),[]);const v=e.useCallback(((e,t=1)=>e?e.map((e=>{const r={id:e.id,name:e.name,slug:e.url_key},s=e.children_data;if(s&&s.length>0){r[w(t)]=v(s,t+1)}return r})):[]),[]),w=e.useCallback((e=>1===e?"subcategories":2===e?"children":"sub"+"sub".repeat(e-3)+"children"),[]);e.useEffect((()=>{c||d()}),[c,d]),e.useEffect((()=>{if(a&&a.children_data){const e=v(a.children_data);s(e)}}),[a,v]),e.useEffect((()=>{function e(e){x.current&&!x.current.contains(e.target)&&(y({}),window.innerWidth<768&&m(!1))}return document.addEventListener("mousedown",e),()=>{document.removeEventListener("mousedown",e)}}),[]);const _=e.useCallback(((e,t)=>{window.innerWidth>=768&&y((r=>({...r,[e]:t})))}),[]),N=e.useCallback((e=>{window.innerWidth>=768&&y((t=>{const r={...t};return Object.keys(r).filter((t=>parseInt(t)>=e)).forEach((e=>delete r[e])),r}))}),[]),k=e.useCallback((()=>{m((e=>!e)),h({})}),[]),S=e.useCallback(((e,t)=>{h((r=>{const s=`${t}-${e}`,a={...r};return a[s]?(delete a[s],Object.keys(a).forEach((e=>{e.startsWith(`${t+1}-`)&&delete a[e]}))):(a[s]=!0,Object.keys(a).forEach((e=>{e.startsWith(`${t}-`)&&e!==s&&delete a[e]}))),a}))}),[]);return t.jsx("nav",{ref:x,className:`sticky top-0 z-50 bg-white ${f?"shadow-md":"shadow-sm"} transition-shadow duration-300`,children:t.jsxs("div",{className:"container mx-auto px-4",children:[t.jsxs("div",{className:"md:hidden flex justify-between items-center py-3",children:[t.jsx("button",{className:"text-gray-700 hover:text-indigo-600 focus:outline-none transition-colors",onClick:k,"aria-label":u?"Close menu":"Open menu",children:u?t.jsx(i,{size:24}):t.jsx(o,{size:24})}),t.jsx("span",{className:"font-semibold text-lg text-gray-800",children:"Categories"}),t.jsx("div",{className:"w-6"})]}),n&&t.jsx("div",{className:"py-4 flex justify-center",children:t.jsx(le,{size:"md"})}),l&&t.jsx("div",{className:"text-center py-4 text-red-600 bg-red-50 rounded-lg",children:"Failed to load categories. Please try again."}),!n&&!l&&u&&t.jsx("div",{className:"md:hidden bg-white rounded-lg shadow-inner max-h-[calc(100vh-120px)] overflow-y-auto overscroll-contain",children:t.jsx("ul",{className:"p-3",children:r.map((e=>t.jsx(de,{item:e,level:1,parentSlug:"",expandedCategories:g,toggleCategory:S,setMobileMenuOpen:m},e.id)))})}),!n&&!l&&t.jsx("ul",{className:"hidden md:flex justify-center space-x-1",children:r.map((e=>{var r;return t.jsxs("li",{className:"relative",onMouseEnter:()=>_(1,e.id),onMouseLeave:()=>N(1),children:[t.jsx(j,{to:`/category/${e.slug||e.id}`,className:`block px-5 py-4 font-medium text-gray-800 hover:text-indigo-600 ${p[1]===e.id?"text-indigo-600":""} transition-colors duration-200`,children:e.name}),(null==(r=e.subcategories)?void 0:r.length)>0&&p[1]===e.id&&t.jsx("div",{className:"absolute top-full left-1/2 transform -translate-x-1/2 z-50",children:t.jsx("ul",{className:"bg-white shadow-xl rounded-lg py-2 px-1 min-w-[200px] border border-gray-100 animate-fadeIn",children:e.subcategories.map((r=>t.jsx(ce,{item:r,level:2,parentSlug:e.slug||e.id,activeLevels:p,handleMouseEnter:_,handleMouseLeave:N},r.id)))})})]},e.id)}))})]})})})),me="magentoCustomerToken",ge="magentoUserInfo",he="ecommerce_session_cart",pe="magento_guest_cart_id",ye=`${"http://magento.local:8001/".replace(/\/$/,"")}/graphql`,xe=l.create({baseURL:ye,headers:{"Content-Type":"application/json"}});xe.interceptors.request.use((e=>{const t=Ne.getToken();return t&&(e.headers.Authorization=`Bearer ${t}`),e}),(e=>Promise.reject(e)));const fe="http://magento.local:8001/rest/V1";let be=fe;const ve="://",we=fe.indexOf(ve);if(we>-1){be=fe.substring(0,we+3)+fe.substring(we+3).replace(/\/\/+/g,"/")}else be=fe.replace(/\/\/+/g,"/");const _e=be,je=l.create({baseURL:_e,headers:{"Content-Type":"application/json"}});l.create({baseURL:_e,headers:{"Content-Type":"application/json"}});const Ne=new class{createAuthenticatedApi(e){return l.create({baseURL:_e,headers:{"Content-Type":"application/json",Authorization:`Bearer ${e}`}})}isAuthenticated(){return!!this.getToken()}getToken(){return localStorage.getItem(me)}setToken(e){localStorage.setItem(me,e),je.defaults.headers.common.Authorization=`Bearer ${e}`}getUserInfo(){const e=localStorage.getItem(ge);return e?JSON.parse(e):null}setUserInfo(e){localStorage.setItem(ge,JSON.stringify(e))}async login(e,t){try{const r=await je.post("/integration/customer/token",{username:e,password:t});return r.data&&(this.setToken(r.data),await this.fetchAndStoreUserInfo()),r.data}catch(r){throw r}}async refreshToken(){try{const e=this.getUserInfo();return e&&e.email,null}catch(e){return null}}async fetchAndStoreUserInfo(){try{const e=await this.getCurrentCustomer();return this.setUserInfo(e),e}catch(e){throw e}}async register(e){try{const t={customer:{email:e.email,firstname:e.firstName,lastname:e.lastName,store_id:1,website_id:1},password:e.password};return(await je.post("/customers",t)).data}catch(t){throw t}}async getCurrentCustomer(){try{const e=this.getToken();if(!e)throw new Error("No authentication token found");return(await je.get("/customers/me",{headers:{Authorization:`Bearer ${e}`}})).data}catch(e){throw e}}async logout(e=!0){try{const t=this.getToken();return t&&e&&await je.post("/customers/logout",{},{headers:{Authorization:`Bearer ${t}`}}),localStorage.clear(),sessionStorage.clear(),delete je.defaults.headers.common.Authorization,!0}catch(t){return localStorage.removeItem(me),localStorage.removeItem(ge),localStorage.removeItem("ecommerce_cart"),localStorage.removeItem("magento_guest_cart_id"),sessionStorage.clear(),delete je.defaults.headers.common.Authorization,!0}}async requestPasswordReset(e){try{return(await je.put("/customers/password",{email:e,template:"email_reset",websiteId:1})).data}catch(t){throw t}}async resetPassword(e,t,r){try{return(await je.post("/customers/resetPassword",{email:e,resetToken:t,newPassword:r})).data}catch(s){throw s}}async updateCustomerInfo(e){try{const t=this.getToken();if(!t)throw new Error("No authentication token found");const r=await je.put("/customers/me",{customer:e},{headers:{Authorization:`Bearer ${t}`}});return this.setUserInfo(r.data),r.data}catch(t){throw t}}async changePassword(e,t){try{const r=this.getToken();if(!r)throw new Error("No authentication token found");return(await je.put("/customers/me/password",{currentPassword:e,newPassword:t},{headers:{Authorization:`Bearer ${r}`}})).data}catch(r){throw r}}setupAuthHeader(){const e=this.getToken();return!!e&&(je.defaults.headers.common.Authorization=`Bearer ${e}`,!0)}};je.interceptors.request.use((e=>{const t=Ne.getToken();return t&&(e.headers.Authorization=`Bearer ${t}`),e}),(e=>Promise.reject(e))),je.interceptors.response.use((e=>e),(async e=>{if(e.response&&401===e.response.status){const r=e.config;if(!r._retry){r._retry=!0;try{const e=await Ne.refreshToken();if(e)return r.headers.Authorization=`Bearer ${e}`,je(r)}catch(t){}}}return Promise.reject(e)})),Ne.setupAuthHeader();const ke=()=>Ne.isAuthenticated(),Se=()=>Ne.getToken(),Pe=(e,t)=>Ne.login(e,t),Ce=e=>Ne.logout(e),$e=()=>Ne.getCurrentCustomer(),Ie=e=>Ne.updateCustomerInfo(e),qe=(e,t)=>Ne.changePassword(e,t);let Ae=null;const Ee=async()=>{try{const e=!!localStorage.getItem("magentoCustomerToken"),t=xe,r="\n      mutation {\n        createEmptyCart\n      }\n    ",s=(await t.post("",{query:r})).data.data.createEmptyCart;return e||sessionStorage.setItem("guest_cart_id",s),s}catch(e){throw new Error("Failed to create cart")}},Te=async()=>{try{if(!!!localStorage.getItem("magentoCustomerToken"))throw new Error("This function is only for logged-in customers");const e=xe,t="\n      mutation {\n        createEmptyCart\n      }\n    ",r=await e.post("",{query:t});if(r.data.errors)throw new Error(r.data.errors[0].message);const s=r.data.data.createEmptyCart;return localStorage.setItem("customer_cart_id",s),s}catch(e){throw new Error("Failed to create active cart")}},Fe=async()=>{if(!!localStorage.getItem("magentoCustomerToken")){const e=localStorage.getItem("customer_cart_id");return e||await Te()}{const e=sessionStorage.getItem("guest_cart_id");return e||await Ee()}},De=async(e=null)=>{var t,r,s;try{const n=!!localStorage.getItem("magentoCustomerToken"),i=xe;let o;if(e||(e=await Fe()),n){const e="\n        query {\n          customerCart {\n            id\n            items {\n              id\n              product {\n                id\n                name\n                sku\n                price {\n                  regularPrice {\n                    amount {\n                      value\n                      currency\n                    }\n                  }\n                }\n                small_image {\n                  url\n                }\n              }\n              quantity\n              prices {\n                price {\n                  value\n                  currency\n                }\n                row_total {\n                  value\n                  currency\n                }\n              }\n            }\n            prices {\n              grand_total {\n                value\n                currency\n              }\n              subtotal_including_tax {\n                value\n                currency\n              }\n             \n            }\n          }\n        }\n      ";try{o=await i.post("",{query:e}),Ae=o.data.data.customerCart}catch(a){if(!(null==(s=null==(r=null==(t=a.response)?void 0:t.data)?void 0:r.errors)?void 0:s.some((e=>e.message.includes("Current customer does not have an active cart")))))throw a;await Te(),o=await i.post("",{query:e}),Ae=o.data.data.customerCart}}else{const t="\n        query($cartId: String!) {\n          cart(cart_id: $cartId) {\n            id\n            items {\n              id\n              product {\n                id\n                name\n                sku\n                price {\n                  regularPrice {\n                    amount {\n                      value\n                      currency\n                    }\n                  }\n                }\n                image {\n                  url\n                }\n              }\n              quantity\n              prices {\n                price {\n                  value\n                  currency\n                }\n                row_total {\n                  value\n                  currency\n                }\n              }\n            }\n            prices {\n              grand_total {\n                value\n                currency\n              }\n              subtotal_including_tax {\n                value\n                currency\n              }\n              \n            }\n          }\n        }\n      ";o=await i.post("",{query:t,variables:{cartId:e}}),Ae=o.data.data.cart}return n?(localStorage.setItem("customer_cart_data",JSON.stringify(Ae)),localStorage.setItem("customer_cart_id",Ae.id)):(sessionStorage.setItem("guest_cart_data",JSON.stringify(Ae)),sessionStorage.setItem("guest_cart_id",Ae.id)),Ae}catch(a){if(localStorage.getItem("magentoCustomerToken")){const e=localStorage.getItem("customer_cart_data");if(e)return JSON.parse(e)}else{const e=sessionStorage.getItem("guest_cart_data");if(e)return JSON.parse(e)}throw new Error("Failed to fetch cart")}},Oe=async(e,t=null)=>{var r;try{if(!e)throw new Error("Coupon code is required");const s=!!localStorage.getItem("magentoCustomerToken"),a=xe;if(t||(t=await Fe()),!t)throw new Error("Cart ID is required to apply a coupon");const n="\n      mutation ApplyCoupon($cartId: String!, $couponCode: String!) {\n        applyCouponToCart(input: { cart_id: $cartId, coupon_code: $couponCode }) {\n          cart {\n            applied_coupons {\n              code\n            }\n            prices {\n              grand_total {\n                value\n                currency\n              }\n              subtotal_with_discount_excluding_tax {\n                value\n                currency\n              }\n              discounts {\n                amount {\n                  value\n                  currency\n                }\n                label\n              }\n              applied_taxes {\n                amount {\n                  value\n                  currency\n                }\n                label\n              }\n            }\n            items {\n              id\n              quantity\n              prices {\n                price {\n                  value\n                  currency\n                }\n                row_total {\n                  value\n                  currency\n                }\n                total_item_discount {\n                  value\n                  currency\n                }\n              }\n            }\n          }\n        }\n      }\n    ",i=await a.post("",{query:n,variables:{cartId:t,couponCode:e}});if((null==(r=i.data.errors)?void 0:r.length)>0)throw new Error(i.data.errors[0].message);const o=i.data.data.applyCouponToCart.cart;return Ae={...Ae,...o},s?localStorage.setItem("customer_cart_data",JSON.stringify(Ae)):sessionStorage.setItem("guest_cart_data",JSON.stringify(Ae)),{success:!0,cart:o,message:`Coupon "${e}" applied successfully`}}catch(s){return{success:!1,message:s.message||"Failed to apply coupon",error:s}}},ze=async(e=null)=>{try{const t=xe;e||(e=await Fe());const r="\n      mutation($cartId: String!) {\n        removeCouponFromCart(input: { cart_id: $cartId }) {\n          cart {\n            applied_coupons {\n              code\n            }\n          }\n        }\n      }\n    ",s={cartId:e},a=(await t.post("",{query:r,variables:s})).data.data.removeCouponFromCart.cart;return Ae={...Ae,...a},localStorage.getItem("magentoCustomerToken")?localStorage.setItem("customer_cart_data",JSON.stringify(Ae)):sessionStorage.setItem("guest_cart_data",JSON.stringify(Ae)),await De(e),{success:!0,cart:a,message:"Coupon removed successfully"}}catch(t){throw new Error("Failed to remove coupon")}},Re=e.createContext();function Ue({children:r}){const[s,a]=e.useState(null),[n,i]=e.useState(!0),[o,l]=e.useState(null);e.useEffect((()=>{(async()=>{var e;try{if(ke()){const e=await $e();a(e)}}catch(t){401===(null==(e=t.response)?void 0:e.status)&&localStorage.removeItem(me)}finally{i(!1)}})()}),[]);const c={currentUser:s,loading:n,error:o,isAuthenticated:()=>!!localStorage.getItem(me),login:e.useCallback((async(e,t)=>{var r,s;i(!0),l(null);try{await Pe(e,t);const r=await $e();return a(r),r}catch(n){throw l((null==(s=null==(r=n.response)?void 0:r.data)?void 0:s.message)||"Login failed. Please check your credentials."),n}finally{i(!1)}}),[]),register:e.useCallback((async e=>{var t,r;i(!0),l(null);try{const t=await(e=>Ne.register(e))(e);await Pe(e.email,e.password);const r=await $e();return a(r),t}catch(s){throw l((null==(r=null==(t=s.response)?void 0:t.data)?void 0:r.message)||"Registration failed. Please try again."),s}finally{i(!1)}}),[]),logout:e.useCallback((async()=>{i(!0);try{localStorage.removeItem(me),a(null)}catch(e){localStorage.removeItem(me),a(null)}finally{i(!1)}}),[]),requestPasswordReset:e.useCallback((async e=>{var t,r;i(!0),l(null);try{const t=await(e=>Ne.requestPasswordReset(e))(e);return t}catch(s){throw l((null==(r=null==(t=s.response)?void 0:t.data)?void 0:r.message)||"Failed to request password reset."),s}finally{i(!1)}}),[]),resetPassword:e.useCallback((async(e,t,r)=>{var s,a;i(!0),l(null);try{const s=await((e,t,r)=>Ne.resetPassword(e,t,r))(e,t,r);return s}catch(n){throw l((null==(a=null==(s=n.response)?void 0:s.data)?void 0:a.message)||"Failed to reset password."),n}finally{i(!1)}}),[]),updateProfile:e.useCallback((async e=>{var t,r;i(!0),l(null);try{const t=await Ie(e);return a(t),t}catch(s){throw l((null==(r=null==(t=s.response)?void 0:t.data)?void 0:r.message)||"Failed to update profile."),s}finally{i(!1)}}),[]),changePassword:e.useCallback((async(e,t)=>{var r,s;i(!0),l(null);try{return await qe(e,t)}catch(a){throw l((null==(s=null==(r=a.response)?void 0:r.data)?void 0:s.message)||"Failed to change password."),a}finally{i(!1)}}),[]),updateName:async({firstname:e,lastname:t,email:r})=>{try{const s=await Ie({firstname:e,lastname:t,email:r});return s?(a((s=>({...s,firstname:e,lastname:t,email:r}))),{success:!0}):{success:!1,error:s.error||"Failed to update name"}}catch(s){return{success:!1,error:s.message||"An error occurred while updating name"}}},updateEmail:async(e,t,r)=>{try{const s=await Ie({email:e,firstname:t,lastname:r});return s?(a((s=>({...s,email:e,firstname:t,lastname:r}))),{success:!0}):{success:!1,error:s.error||"Failed to update email"}}catch(s){return{success:!1,error:s.message||"An error occurred while updating email"}}},updatePassword:async(e,t)=>{try{const r=await qe(e,t);return r?{success:!0}:{success:!1,error:r.error||"Failed to update password"}}catch(r){return{success:!1,error:r.message||"An error occurred while updating password"}}},clearError:()=>l(null)};return t.jsx(Re.Provider,{value:c,children:r})}const Le=()=>{const t=e.useContext(Re);if(!t)throw new Error("useAuth must be used within an AuthProvider");return t},Be=`${"http://magento.local:8001/".replace(/\/$/,"")}/graphql`,Ge=async()=>{var e,t;const r=Se();if(!r)return{success:!1,message:"Authentication required",data:[]};try{const e=await l.post(Be,{query:"\n          query GetWishlist {\n            customer {\n              wishlist {\n                id\n                items_count\n                items {\n                  id\n                  product {\n                    id\n                    name\n                    stock_status\n                    sku\n                    url_key\n                  \n                    price {\n                      regularPrice {\n                        amount {\n                          value\n                          currency\n                        }\n                      }\n                    }\n                    image {\n                      url\n                    }\n                   \n                  }\n                }\n              }\n            }\n          }\n        "},{headers:{Authorization:`Bearer ${r}`,"Content-Type":"application/json"}});if(e.data.errors)return{success:!1,message:e.data.errors[0].message||"Failed to fetch wishlist items",data:[]};return{success:!0,data:e.data.data.customer.wishlist.items.map((e=>{var t,r,s;return{_id:e.product.id,wishlistItemId:e.id,name:e.product.name,sku:e.product.sku,url_key:e.product.url_key,price:(null==(s=null==(r=null==(t=e.product.price)?void 0:t.regularPrice)?void 0:r.amount)?void 0:s.value)||0,images:e.product.image?[e.product.image.url]:[],stock_status:e.product.stock_status}}))}}catch(s){return{success:!1,message:(null==(t=null==(e=s.response)?void 0:e.data)?void 0:t.message)||"Failed to fetch wishlist items",data:[]}}},Me=async e=>{var t,r;const s=Se();try{const t=await l.post(Be,{query:'\n          mutation RemoveProductFromWishlistBySku($sku: String!) {\n            removeProductsFromWishlist(\n              wishlistId: "0"\n              wishlistItemsIds: []\n              skus: [$sku]\n            ) {\n              wishlist {\n                id\n                items_count\n              }\n              user_errors {\n                code\n                message\n              }\n            }\n          }\n        ',variables:{sku:String(e)}},{headers:{Authorization:`Bearer ${s}`,"Content-Type":"application/json"}});if(t.data.errors)return{success:!1,message:t.data.errors[0].message||"Failed to remove product from wishlist"};const r=t.data.data.removeProductsFromWishlist.user_errors;return r&&r.length>0?{success:!1,message:r[0].message||"Failed to remove product from wishlist"}:{success:!0,message:"Product removed from wishlist successfully",data:t.data.data.removeProductsFromWishlist.wishlist}}catch(a){return{success:!1,message:(null==(r=null==(t=a.response)?void 0:t.data)?void 0:r.message)||"Failed to remove product from wishlist"}}},We=e.createContext(),Je=()=>e.useContext(We),Ke=({children:r})=>{const[s,a]=e.useState([]),[n,i]=e.useState(!1),{currentUser:o}=Le(),d=ke();e.useEffect((()=>{(async()=>{d?await u():a([])})()}),[d]);const u=async()=>{if(ke){i(!0);try{const e=await Ge();a(e.data||[])}catch(e){c.error("Failed to load wishlist items")}finally{i(!1)}}};return t.jsx(We.Provider,{value:{wishlistItems:s,loading:n,addItemToWishlist:async e=>{var t,r;if(!d)return c.info("Please login to add items to wishlist"),!1;i(!0);try{const t=await(async e=>{var t,r;const s=Se();if(!s)return{success:!1,message:"Authentication required"};try{const t=await l.post(Be,{query:'\n          mutation AddProductToWishlist($productId: String!) {\n            addProductsToWishlist(\n              wishlistId: "0" \n              wishlistItems: [\n                {\n                  sku: $productId,\n                  quantity: 1.0\n                }\n              ]\n            ) {\n              wishlist {\n                id\n                items_count\n              }\n              user_errors {\n                code\n                message\n              }\n            }\n          }\n        ',variables:{productId:String(e)}},{headers:{Authorization:`Bearer ${s}`,"Content-Type":"application/json"}});if(t.data.errors)return{success:!1,message:t.data.errors[0].message||"Failed to add product to wishlist"};const r=t.data.data.addProductsToWishlist.user_errors;return r&&r.length>0?{success:!1,message:r[0].message||"Failed to add product to wishlist"}:{success:!0,message:"Product added to wishlist successfully",data:t.data.data.addProductsToWishlist.wishlist}}catch(a){return{success:!1,message:(null==(r=null==(t=a.response)?void 0:t.data)?void 0:r.message)||"Failed to add product to wishlist"}}})(e);return t.success?(await u(),c.success(t.message||"Product added to wishlist"),!0):(c.error(t.message||"Failed to add product to wishlist"),!1)}catch(s){return c.error((null==(r=null==(t=s.response)?void 0:t.data)?void 0:r.message)||"Failed to add product to wishlist"),!1}finally{i(!1)}},removeItemFromWishlist:async e=>{var t,r;if(!d)return c.info("Please login to manage wishlist"),!1;i(!0);try{const t=await(async e=>{const t=Se();if(!t)return{success:!1,message:"Authentication required"};try{const r=await Ge();if(!r.success)return r;const s=r.data.find((t=>t._id===e||t.sku===e));if(!s)return{success:!1,message:"Product not found in wishlist"};const a=s.wishlistItemId,n=await l.post(Be,{query:'\n          mutation RemoveProductFromWishlist($wishlistItemId: ID!) {\n            removeProductsFromWishlist(\n              wishlistId: "0"\n              wishlistItemsIds: [$wishlistItemId]\n            ) {\n              wishlist {\n                id\n                items_count\n              }\n              user_errors {\n                code\n                message\n              }\n            }\n          }\n        ',variables:{wishlistItemId:String(a)}},{headers:{Authorization:`Bearer ${t}`,"Content-Type":"application/json"}});if(n.data.errors)return{success:!1,message:n.data.errors[0].message||"Failed to remove product from wishlist"};const i=n.data.data.removeProductsFromWishlist.user_errors;return i&&i.length>0?{success:!1,message:i[0].message||"Failed to remove product from wishlist"}:{success:!0,message:"Product removed from wishlist successfully",data:n.data.data.removeProductsFromWishlist.wishlist}}catch(r){return Me(e)}})(e);return t.success?(a((t=>t.filter((t=>t._id!==e)))),c.success(t.message||"Product removed from wishlist"),!0):(c.error(t.message||"Failed to remove product from wishlist"),!1)}catch(s){return c.error((null==(r=null==(t=s.response)?void 0:t.data)?void 0:r.message)||"Failed to remove product from wishlist"),!1}finally{i(!1)}},isInWishlist:e=>s.some((t=>t._id===e)),refreshWishlist:u},children:r})};const Ve=n.memo((function(){const[r,s]=e.useState(""),[a,n]=e.useState(""),[i,o]=e.useState(!1),[l,c]=e.useState({}),u=N(),m=k(),{fetchCartData:g,mergeWithUserCart:h}=Ye(),{refreshWishlist:p}=Je(),{login:y}=Le();return t.jsxs("form",{onSubmit:async e=>{var t,s,n;if(e.preventDefault(),(()=>{const e={};return r.trim()?/\S+@\S+\.\S+/.test(r)||(e.email="Email is invalid"):e.email="Email is required",a?a.length<6&&(e.password="Password must be at least 6 characters"):e.password="Password is required",c(e),0===Object.keys(e).length})()){o(!0);try{await y(r,a);try{await h(),await Promise.all([g(),p()]),d.fire({icon:"success",title:"Login Successful",text:"You have been logged in successfully!",timer:1500,showConfirmButton:!1}).then((()=>{var e;const t=(null==(e=m.state)?void 0:e.from)||"/account";u(t,{replace:!0})}))}catch(i){const e=(null==(t=m.state)?void 0:t.from)||"/account";u(e,{replace:!0})}}catch(l){const e=(null==(n=null==(s=l.response)?void 0:s.data)?void 0:n.message)||l.message||"Invalid email or password. Please try again.";d.fire({icon:"error",title:"Login Failed",text:e})}finally{o(!1)}}},className:"space-y-4",children:[t.jsxs("div",{children:[t.jsx("label",{htmlFor:"email",className:"block text-sm font-medium text-gray-700 mb-1",children:"Email Address"}),t.jsx("input",{type:"email",id:"email",name:"email",value:r,onChange:e=>s(e.target.value),className:"w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 "+(l.email?"border-red-500":"border-gray-300"),placeholder:"your@email.com"}),l.email&&t.jsx("p",{className:"mt-1 text-sm text-red-600",children:l.email})]}),t.jsxs("div",{children:[t.jsx("label",{htmlFor:"password",className:"block text-sm font-medium text-gray-700 mb-1",children:"Password"}),t.jsx("input",{type:"password",id:"password",name:"password",value:a,onChange:e=>n(e.target.value),className:"w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 "+(l.password?"border-red-500":"border-gray-300"),placeholder:"••••••••"}),l.password&&t.jsx("p",{className:"mt-1 text-sm text-red-600",children:l.password})]}),t.jsxs("div",{className:"flex items-center justify-between",children:[t.jsxs("div",{className:"flex items-center",children:[t.jsx("input",{id:"remember-me",name:"remember-me",type:"checkbox",className:"h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"}),t.jsx("label",{htmlFor:"remember-me",className:"ml-2 block text-sm text-gray-700",children:"Remember me"})]}),t.jsx("div",{className:"text-sm",children:t.jsx(j,{to:"/resetpassword",className:"font-medium text-indigo-600 hover:text-indigo-500",children:"Forgot your password?"})})]}),t.jsx("div",{children:t.jsx("button",{type:"submit",disabled:i,className:"w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50",children:i?t.jsxs("span",{className:"flex items-center",children:[t.jsxs("svg",{className:"animate-spin -ml-1 mr-2 h-4 w-4 text-white",xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",children:[t.jsx("circle",{className:"opacity-25",cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"4"}),t.jsx("path",{className:"opacity-75",fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"})]}),"Signing in..."]}):"Sign in"})})]})})),He=e.createContext(null);function Ye(){const t=e.useContext(He);if(!t)throw new Error("useCart must be used within a CartProvider");return t}function Qe({children:r}){const[s,a]=e.useState(null),[n,i]=e.useState([]),[o,l]=e.useState(!0),[c,d]=e.useState(!1),[u,m]=e.useState(null),[g,h]=e.useState(localStorage.getItem(pe)),p=async()=>{l(!0),m(null);let e=g;try{const r=Ne.isAuthenticated();let s;if(r)s=await De();else{if(!e){if(e=await Ee(),!e)throw new Error("Failed to create guest cart ID.");localStorage.setItem(pe,e),h(e)}if(!e)return i([]),a({items:[]}),void l(!1);s=await De(e)}if(s){const e=(t=s)&&Array.isArray(t.items)?t.items.map((e=>{var t,r,s;const a=e.product||{},n=e.prices||{},i=n.price||{},o=(null==(t=n.row_total)?void 0:t.value)/e.quantity||i.value||0;return{id:e.id,sku:a.sku,name:a.name,price:o,qty:e.quantity,image:(null==(r=a.small_image)?void 0:r.url)||(null==(s=a.image)?void 0:s.url)||"/placeholder.jpg",item_id:e.id,product_id:a.id}})):[];a(s),i(e),localStorage.setItem(he,JSON.stringify(e))}else i([]),a({items:[]}),r||e||localStorage.removeItem(pe)}catch(r){m(`Failed to load cart data: ${r.message}. Please try again.`);const e=localStorage.getItem(he);if(e)try{const t=JSON.parse(e);i(t),a({items:t})}catch(s){i([]),a({items:[]})}else i([]),a({items:[]})}finally{l(!1)}var t};N(),k();const y=async e=>{d(!0),m(null);const t=Ne.isAuthenticated();try{const r={sku:e.sku},s=e.qty||1;return await(async(e,t=1,r=null)=>{var s;try{if(!e)throw new Error("Product is required");if(!e.sku)throw new Error("Product SKU is required");const a=!!localStorage.getItem("magentoCustomerToken"),n=xe;r||(r=await Fe());try{await De(r)}catch(u){r=await Ee()}const i=a?`\n      mutation($sku: String!, $quantity: Float!) {\n        addProductsToCart(\n          cartId: "${r}"\n          cartItems: [\n            {\n              sku: $sku\n              quantity: $quantity\n            }\n          ]\n        ) {\n          cart {\n            id\n            items {\n              id\n              product {\n                name\n                sku\n                image {\n                  url\n                }\n              }\n              quantity\n              prices {\n                price {\n                  value\n                  currency\n                }\n              }\n            }\n          }\n          user_errors {\n            code\n            message\n          }\n        }\n      }\n    `:"\n      mutation($cartId: String!, $sku: String!, $quantity: Float!) {\n        addProductsToCart(\n          cartId: $cartId\n          cartItems: [\n            {\n              sku: $sku\n              quantity: $quantity\n            }\n          ]\n        ) {\n          cart {\n            id\n            items {\n              id\n              product {\n                name\n                sku\n                image {\n                  url\n                }\n              }\n              quantity\n              prices {\n                price {\n                  value\n                  currency\n                }\n              }\n            }\n          }\n          user_errors {\n            code\n            message\n          }\n        }\n      }\n    ",o=a?{sku:e.sku,quantity:t}:{cartId:r,sku:e.sku,quantity:t},l=await n.post("",{query:i,variables:o});if(l.data.errors){const e=l.data.errors[0].message;throw new Error(e)}if((null==(s=l.data.data.addProductsToCart.user_errors)?void 0:s.length)>0){const e=l.data.data.addProductsToCart.user_errors[0].message;throw new Error(e)}return await De(r),l.data.data.addProductsToCart.cart}catch(u){let t="Failed to add product to cart";throw u.message.includes("Could not find a cart with ID")?t="Your session expired, please try again":u.message.includes("Could not find a product with SKU")?t="This product is no longer available":u.message.includes("The requested qty is not available")&&(t="The requested quantity is not available"),new Error(t)}})(r,s,t?null:g),await p(),{success:!0}}catch(r){throw m(`Failed to add item to cart: ${r.message}. Please try again.`),r}finally{d(!1)}},x=async e=>{d(!0),m(null);const t=Ne.isAuthenticated();try{n.find((t=>t.id===e));const r=t?s?s.id:null:g;return await(async(e,t=null)=>{if(!e)throw new Error("Item ID is required to remove an item from the cart");if(isNaN(parseInt(e)))throw new Error("Invalid item ID format");if(parseInt(e)<=0)throw new Error("Item ID must be a positive integer");try{localStorage.getItem("magentoCustomerToken");const r=xe;t||(t=await Fe());const s="\n      mutation($cartId: String!, $itemId: Int!) {\n        removeItemFromCart(\n          input: {\n            cart_id: $cartId\n            cart_item_id: $itemId\n          }\n        ) {\n          cart {\n            id # It's good practice to fetch the cart ID back\n            items {\n              id\n            }\n            # Consider fetching other relevant cart details if needed after removal\n          }\n        }\n      }\n    ",a={cartId:t,itemId:parseInt(e)};return await r.post("",{query:s,variables:a}),await De(t),!0}catch(u){throw new Error("Failed to remove item from cart")}})(e,r),await p(),{success:!0}}catch(r){throw m(`Failed to remove item: ${r.message}. Please try again.`),r}finally{d(!1)}};e.useEffect((()=>{p();const e=setInterval((()=>{Ne.isAuthenticated()&&p()}),3e5);return()=>clearInterval(e)}),[]);const f={cart:s,cartItems:n,loading:o,updating:c,error:u,fetchCartData:p,addItemToCart:y,removeItem:x,updateItemQuantity:async(e,t)=>{d(!0),m(null);const r=Ne.isAuthenticated();try{if(t<=0)return x(e);n.find((t=>t.id===e));return await(async(e,t,r=null)=>{try{const s=!!localStorage.getItem("magentoCustomerToken"),a=xe;r||(r=await Fe());const n=s?"\n      mutation($itemId: Int!, $quantity: Float!) {\n        updateCartItems(\n          input: {\n            cart_items: [\n              {\n                cart_item_id: $itemId\n                quantity: $quantity\n              }\n            ]\n          }\n        ) {\n          cart {\n            items {\n              id\n              quantity\n            }\n          }\n        }\n      }\n    ":"\n      mutation($cartId: String!, $itemId: Int!, $quantity: Float!) {\n        updateCartItems(\n          input: {\n            cart_id: $cartId\n            cart_items: [\n              {\n                cart_item_id: $itemId\n                quantity: $quantity\n              }\n            ]\n          }\n        ) {\n          cart {\n            items {\n              id\n              quantity\n            }\n          }\n        }\n      }\n    ",i=s?{itemId:parseInt(e),quantity:t}:{cartId:r,itemId:parseInt(e),quantity:t},o=await a.post("",{query:n,variables:i});return await De(r),o.data.data.updateCartItems.cart}catch(u){throw new Error("Failed to update item quantity")}})(e,t,r?null:g),await p(),{success:!0}}catch(s){throw m(`Failed to update quantity: ${s.message}. Please try again.`),s}finally{d(!1)}},calculateSubtotal:()=>n.reduce(((e,t)=>e+t.price*t.qty),0),getCartItemCount:()=>n.reduce(((e,t)=>e+t.qty),0),isInCart:e=>n.find((t=>t.sku===e))||null,clearCart:async()=>{d(!0),m(null);try{return i([]),a(null),localStorage.removeItem(he),Ne.isAuthenticated()||(localStorage.removeItem(pe),h(null)),{success:!0}}catch(e){throw m("Failed to clear cart. Please try again."),e}finally{d(!1)}},mergeWithUserCart:async()=>{d(!0),m(null);try{const r=localStorage.getItem(he);localStorage.getItem(pe);if(r&&Ne.isAuthenticated()){let s=[];try{s=JSON.parse(r)}catch(e){return localStorage.removeItem(he),localStorage.removeItem(pe),h(null),await p(),{success:!1,message:"Failed to parse guest cart for merge."}}if(Array.isArray(s)&&s.length>0)for(const e of s)if(e.sku&&e.qty)try{await y({sku:e.sku,qty:e.qty})}catch(t){}localStorage.removeItem(he),localStorage.removeItem(pe),h(null)}return await p(),{success:!0}}catch(r){throw m(`Failed to merge carts: ${r.message}. Please try again.`),await p().catch((e=>{})),r}finally{d(!1)}}};return t.jsx(He.Provider,{value:f,children:r})}const Ze=n.memo((function(){const[r,s]=e.useState(!1),[a,n]=e.useState(""),[i,o]=e.useState(!1),l=e.useRef(null),c=N(),{getCartItemCount:d}=Ye(),{wishlistItems:u=[]}=Je();e.useEffect((()=>{r&&l.current&&l.current.focus()}),[r]);const m=e=>{e.preventDefault(),a.trim()&&(c(`/search?q=${encodeURIComponent(a.trim())}`),s(!1),n(""))},g=e=>{n(e.target.value)};return t.jsxs("header",{className:"bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-40 border-b border-gray-100",children:[t.jsxs("div",{className:"container mx-auto px-4 py-3",children:[t.jsxs("div",{className:"flex justify-between items-center",children:[t.jsx(j,{to:"/",className:"text-2xl font-bold text-indigo-600 hover:text-indigo-700 transition-all duration-300 ease-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:ring-offset-2 rounded-lg px-2 py-1","aria-label":"EcoShop Home",children:"EcoShop"}),t.jsxs("div",{className:"hidden md:flex items-center space-x-4",children:[t.jsxs("form",{onSubmit:m,className:"relative flex-1 max-w-md",children:[t.jsxs("div",{className:"relative group",children:[t.jsx("input",{ref:l,type:"text",placeholder:"Search products...",className:"w-full pl-12 pr-12 py-3 border border-gray-200 rounded-2xl text-sm bg-gray-50/50 \n                    transition-all duration-300 ease-out\n                    hover:bg-white hover:border-gray-300 hover:shadow-md\n                    focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 \n                    focus:bg-white focus:shadow-lg focus:scale-[1.02]\n                    placeholder:text-gray-400",value:a,onChange:g,"aria-label":"Search products"}),t.jsx("span",{className:"absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-indigo-500 transition-colors duration-200",children:t.jsx("i",{className:"fas fa-search"})}),a&&t.jsx("button",{type:"button",onClick:()=>n(""),className:"absolute right-12 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 \n                      hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200\n                      focus:outline-none focus:ring-2 focus:ring-red-300","aria-label":"Clear search",children:t.jsx("i",{className:"fas fa-times"})}),t.jsx("button",{type:"submit",className:"absolute right-4 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 \n                    hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all duration-200\n                    focus:outline-none focus:ring-2 focus:ring-indigo-300","aria-label":"Submit search",children:t.jsx("i",{className:"fas fa-arrow-right"})})]}),i&&t.jsx("div",{className:"absolute z-50 w-full mt-2 bg-white/95 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-xl py-3 animate-in slide-in-from-top-2 duration-200",children:t.jsxs("div",{className:"p-4 text-gray-500 flex items-center space-x-2",children:[t.jsx("div",{className:"animate-spin w-4 h-4 border-2 border-indigo-200 border-t-indigo-600 rounded-full"}),t.jsx("span",{children:"Searching..."})]})})]}),t.jsxs("div",{className:"flex items-center space-x-2",children:[t.jsxs(j,{to:ke()?"/account":"/login",className:"p-3 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 \n                  transition-all duration-200 ease-out transform hover:scale-110\n                  focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:ring-offset-2 \n                  rounded-xl relative group","aria-label":ke()?"My Account":"Login",children:[t.jsx("i",{className:"fas fa-user text-lg"}),t.jsx("div",{className:"absolute inset-0 bg-gradient-to-r from-indigo-500/0 to-purple-500/0 group-hover:from-indigo-500/10 group-hover:to-purple-500/10 rounded-xl transition-all duration-300"})]}),t.jsxs(j,{to:"/wishlist",className:"p-3 text-gray-600 hover:text-red-500 hover:bg-red-50 \n                  transition-all duration-200 ease-out transform hover:scale-110\n                  focus:outline-none focus:ring-2 focus:ring-red-400/50 focus:ring-offset-2 \n                  rounded-xl relative group","aria-label":"Wishlist",children:[t.jsx("i",{className:"fas fa-heart text-lg"}),u.length>0&&t.jsx("span",{className:"absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold shadow-lg animate-pulse",children:u.length}),t.jsx("div",{className:"absolute inset-0 bg-gradient-to-r from-red-500/0 to-pink-500/0 group-hover:from-red-500/10 group-hover:to-pink-500/10 rounded-xl transition-all duration-300"})]}),t.jsxs(j,{to:"/cart",className:"p-3 text-gray-600 hover:text-green-600 hover:bg-green-50 \n                  transition-all duration-200 ease-out transform hover:scale-110\n                  focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:ring-offset-2 \n                  rounded-xl relative group","aria-label":"Shopping Cart",children:[t.jsx("i",{className:"fas fa-shopping-cart text-lg"}),d()>0&&t.jsx("span",{className:"absolute -top-1 -right-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold shadow-lg animate-bounce",children:d()}),t.jsx("div",{className:"absolute inset-0 bg-gradient-to-r from-green-500/0 to-emerald-500/0 group-hover:from-green-500/10 group-hover:to-emerald-500/10 rounded-xl transition-all duration-300"})]})]})]}),t.jsxs("div",{className:"flex md:hidden items-center space-x-2",children:[t.jsxs("button",{onClick:()=>s(!r),className:"p-3 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 \n                transition-all duration-200 ease-out transform hover:scale-110 active:scale-95\n                focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:ring-offset-2 \n                rounded-xl relative group","aria-label":"Search",children:[t.jsx("i",{className:`fas ${r?"fa-times":"fa-search"} text-lg transition-transform duration-200 ${r?"rotate-90":""}`}),t.jsx("div",{className:"absolute inset-0 bg-gradient-to-r from-indigo-500/0 to-purple-500/0 group-hover:from-indigo-500/10 group-hover:to-purple-500/10 rounded-xl transition-all duration-300"})]}),t.jsx(j,{to:ke()?"/account":"/login",className:"p-3 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 \n                transition-all duration-200 ease-out transform hover:scale-110 active:scale-95\n                focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:ring-offset-2 \n                rounded-xl relative group","aria-label":ke()?"My Account":"Login",children:t.jsx("i",{className:"fas fa-user text-lg"})}),t.jsxs(j,{to:"/wishlist",className:"p-3 text-gray-600 hover:text-red-500 hover:bg-red-50 \n                transition-all duration-200 ease-out transform hover:scale-110 active:scale-95\n                focus:outline-none focus:ring-2 focus:ring-red-400/50 focus:ring-offset-2 \n                rounded-xl relative group","aria-label":"Wishlist",children:[t.jsx("i",{className:"fas fa-heart text-lg"}),u.length>0&&t.jsx("span",{className:"absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold shadow-lg animate-pulse",children:u.length})]}),t.jsxs(j,{to:"/cart",className:"p-3 text-gray-600 hover:text-green-600 hover:bg-green-50 \n                transition-all duration-200 ease-out transform hover:scale-110 active:scale-95\n                focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:ring-offset-2 \n                rounded-xl relative group","aria-label":"Shopping Cart",children:[t.jsx("i",{className:"fas fa-shopping-cart text-lg"}),d()>0&&t.jsx("span",{className:"absolute -top-1 -right-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold shadow-lg animate-bounce",children:d()})]})]})]}),r&&t.jsx("div",{className:"mt-4 md:hidden animate-in slide-in-from-top-2 duration-300",children:t.jsxs("form",{onSubmit:m,className:"relative group",children:[t.jsx("input",{ref:l,type:"text",placeholder:"Search products...",className:"w-full pl-12 pr-12 py-3 border border-gray-200 rounded-2xl text-sm bg-gray-50/50 \n                  transition-all duration-300 ease-out\n                  hover:bg-white hover:border-gray-300 hover:shadow-md\n                  focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 \n                  focus:bg-white focus:shadow-lg\n                  placeholder:text-gray-400",value:a,onChange:g,autoFocus:!0,"aria-label":"Search products"}),t.jsx("span",{className:"absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-indigo-500 transition-colors duration-200",children:t.jsx("i",{className:"fas fa-search"})}),a&&t.jsx("button",{type:"button",onClick:()=>n(""),className:"absolute right-12 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 \n                    hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200\n                    focus:outline-none focus:ring-2 focus:ring-red-300","aria-label":"Clear search",children:t.jsx("i",{className:"fas fa-times"})}),t.jsx("button",{type:"button",onClick:()=>{s(!1),n("")},className:"absolute right-4 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 \n                  hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200\n                  focus:outline-none focus:ring-2 focus:ring-gray-300","aria-label":"Close search",children:t.jsx("i",{className:"fas fa-times"})}),i&&t.jsx("div",{className:"absolute z-50 w-full mt-2 bg-white/95 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-xl py-3 animate-in slide-in-from-top-2 duration-200",children:t.jsxs("div",{className:"p-4 text-gray-500 flex items-center space-x-2",children:[t.jsx("div",{className:"animate-spin w-4 h-4 border-2 border-indigo-200 border-t-indigo-600 rounded-full"}),t.jsx("span",{children:"Searching..."})]})})]})})]}),t.jsx(ue,{})]})})),Xe=n.memo((()=>t.jsx("footer",{className:"bg-gray-900 text-white pt-12 pb-6",children:t.jsxs("div",{className:"container mx-auto px-4",children:[t.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8",children:[t.jsxs("div",{children:[t.jsx("h3",{className:"text-xl font-bold mb-4",children:"EcoShop"}),t.jsx("p",{className:"text-gray-400 mb-4",children:"Your one-stop shop for all your needs."}),t.jsxs("div",{className:"flex space-x-4",children:[t.jsx("a",{href:"https://www.facebook.com/letscms/",target:"_blank",rel:"noopener noreferrer",className:"w-6 h-6 inline-flex justify-center items-center text-gray-400 hover:text-white",children:t.jsx("i",{className:"fab fa-facebook-f"})}),t.jsx("a",{href:"https://x.com/letscms",target:"_blank",rel:"noopener noreferrer",className:"w-6 h-6 inline-flex justify-center items-center text-gray-400 hover:text-white",children:t.jsx("i",{className:"fab fa-twitter"})}),t.jsx("a",{href:"https://www.instagram.com/letscms/",target:"_blank",rel:"noopener noreferrer",className:"w-6 h-6 inline-flex justify-center items-center text-gray-400 hover:text-white",children:t.jsx("i",{className:"fab fa-instagram"})}),t.jsx("a",{href:"https://api.whatsapp.com/send?phone=919717478599",target:"_blank",rel:"noopener noreferrer",className:"w-6 h-6 inline-flex justify-center items-center text-gray-400 hover:text-white",children:t.jsx("i",{className:"fab fa-whatsapp"})})]})]}),t.jsx("div",{}),t.jsxs("div",{children:[t.jsx("h4",{className:"font-bold mb-4",children:"Customer Service"}),t.jsxs("ul",{className:"space-y-2",children:[t.jsx("li",{children:t.jsx(j,{to:"/contact",className:"text-gray-400 hover:text-white",children:"Contact Us"})}),t.jsx("li",{children:t.jsx(j,{to:"/faq",className:"text-gray-400 hover:text-white",children:"FAQs"})}),t.jsx("li",{children:t.jsx(j,{to:"/shipping-returns",className:"text-gray-400 hover:text-white",children:"Shipping & Returns"})}),t.jsx("li",{children:t.jsx(j,{to:"/privacy-policy",className:"text-gray-400 hover:text-white",children:"Privacy Policy"})})]})]}),t.jsxs("div",{children:[t.jsx("h4",{className:"font-bold mb-4",children:"Contact"}),t.jsxs("ul",{className:"space-y-2 text-gray-400",children:[t.jsxs("li",{children:[t.jsx("i",{className:"fas fa-map-marker-alt mr-2"})," 1/19. First Floor. In-front of Central Bank. Naurangabad, G T Road, Aligarh 202001, India."]}),t.jsxs("li",{children:[t.jsx("i",{className:"fas fa-phone mr-2"})," +91 9717478599"]}),t.jsxs("li",{children:[t.jsx("i",{className:"fas fa-envelope mr-2"})," info@letscms.com"]})]})]})]}),t.jsxs("div",{className:"border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center text-center",children:[t.jsx("p",{className:"text-gray-400 text-sm",children:"© 2025 EcoShop. All rights reserved."}),t.jsx("div",{className:"mt-4 md:mt-0"})]})]})}))),et=({size:e="large",color:r="indigo"})=>{const s={small:"h-6 w-6",medium:"h-12 w-12",large:"h-16 w-16"},a={indigo:"border-indigo-500",blue:"border-blue-500",red:"border-red-500",green:"border-green-500",gray:"border-gray-500"},n=s[e]||s.medium,i=a[r]||a.indigo;return t.jsx("div",{className:`animate-spin rounded-full ${n} border-t-2 border-b-2 ${i}`})},tt=e.memo((({size:e,color:r})=>t.jsx("div",{className:"fixed inset-0 flex items-center justify-center bg-white bg-opacity-70 backdrop-blur-sm z-50",children:t.jsx(et,{size:e,color:r})}))),rt="\n  fragment OrderDetails on CustomerOrder {\n    id\n    order_number\n    created_at\n    grand_total\n    status\n    shipping_address {\n      firstname\n      lastname\n      street\n      city\n      region\n      postcode\n      telephone\n      country_code\n    }\n    billing_address {\n      firstname\n      lastname\n      street\n      city\n      region\n      postcode\n      telephone\n      country_code\n    }\n     \n     shipping_method\n    payment_methods {\n      name\n      type\n      additional_data {\n        name\n        value\n      }\n    }\n    total {\n      subtotal {\n        value\n        currency\n      }\n      total_shipping {\n        value\n        currency\n      }\n      total_tax {\n        value\n        currency\n      }\n      discounts {\n        amount {\n          value\n          currency\n        }\n        label\n      }\n    }\n     items {\n      id\n      # Fetch product details including image via the nested 'product' object\n      product {\n        name\n        sku\n        url_key # Corrected: 'urk_key' to 'url_key'\n        small_image {\n          url\n          label # It's good practice to get the label too\n        }\n      }\n      # Removed redundant fields, as they are now under 'product'\n      # product_name # Removed\n      # product_sku # Removed\n      # product_url_key # Removed\n\n      product_sale_price {\n        value\n        currency\n      }\n      quantity_ordered\n      product_type\n    }\n  }\n",st=(e,t="USD",r="en-US")=>new Intl.NumberFormat(r,{style:"currency",currency:t,minimumFractionDigits:2,maximumFractionDigits:2}).format(e),at=(e,t="en-US")=>{const r=new Date(e);return new Intl.DateTimeFormat(t,{year:"numeric",month:"long",day:"numeric"}).format(r)},nt=n.memo((()=>{const{user:r}=S(),[s,a]=e.useState([]),[n,i]=e.useState(!0),[o,l]=e.useState(null),c=N();e.useEffect((()=>{r?(async()=>{i(!0),l(null);try{const e=await(async(e=5)=>{var t,r;try{const s=`\n  ${rt}\n  query GetRecentCustomerOrders($pageSize: Int!) {\n    customer {\n      orders(\n        pageSize: $pageSize\n        sort: { sort_field: CREATED_AT, sort_direction: DESC }\n      ) {\n        items {\n          ...OrderDetails\n          id\n        }\n      }\n    }\n  }\n`,a=await xe.post("/graphql",{query:s,variables:{pageSize:e}});if(a.data.errors)throw new Error(a.data.errors[0].message);return(null==(r=null==(t=a.data.data.customer)?void 0:t.orders)?void 0:r.items)||[]}catch(o){return[]}})(5);e&&Array.isArray(e)?a(e):e&&e.error?(e.auth_error?l("Please refresh the page or navigate to another section."):l(e.error||"Unable to load recent orders"),a([])):(a([]),l("Unable to load recent orders. Unexpected data format."))}catch(e){l("Unable to load recent orders. Please try again later."),a([])}finally{i(!1)}})():(i(!1),l("Please log in to view your recent orders."))}),[r]);const d=e=>{var r;if(!e)return"No address available";const s=`${e.firstname||""} ${e.lastname||""}`.trim(),a=Array.isArray(e.street)?e.street.join(", "):e.street||"",n=e.city||"",i=(null==(r=e.region)?void 0:r.region)||e.region||"",o=e.postcode||"",l=e.country_id||"",c=e.telephone||"";return t.jsxs(t.Fragment,{children:[s,t.jsx("br",{}),a&&t.jsxs(t.Fragment,{children:[a,t.jsx("br",{})]}),n&&i&&o&&t.jsxs(t.Fragment,{children:[n,", ",i," ",o,t.jsx("br",{})]}),l&&t.jsxs(t.Fragment,{children:[l,t.jsx("br",{})]}),c&&t.jsxs(t.Fragment,{children:["T: ",c]})]})},u=e=>{if(!e)return"bg-gray-100 text-gray-800";const t=e.toLowerCase();return"complete"===t?"bg-green-100 text-green-800":"pending"===t?"bg-yellow-100 text-yellow-800":"processing"===t?"bg-blue-100 text-blue-800":"canceled"===t||"cancelled"===t?"bg-red-100 text-red-800":"bg-gray-100 text-gray-800"};return r?t.jsxs("div",{children:[t.jsx("h1",{className:"text-2xl font-bold mb-6",children:"My Dashboard"}),t.jsx("div",{className:"bg-indigo-50 border-l-4 border-indigo-500 p-4 mb-6",children:t.jsxs("p",{className:"text-indigo-700",children:["Hello,"," ",t.jsxs("span",{className:"font-semibold",children:[(null==r?void 0:r.firstname)||""," ",(null==r?void 0:r.lastname)||""]}),"! From your account dashboard you can view your recent orders, manage your shipping and billing addresses, and edit your password and account details."]})}),t.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-6 mb-8",children:[t.jsxs("div",{className:"border rounded-lg p-4",children:[t.jsxs("div",{className:"flex justify-between items-center mb-4",children:[t.jsx("h2",{className:"text-lg font-semibold",children:"Account Information"}),t.jsx(j,{to:"/account/edit",className:"text-sm text-indigo-600 hover:text-indigo-800",children:"Edit"})]}),t.jsxs("div",{className:"space-y-2",children:[t.jsxs("p",{children:[t.jsx("span",{className:"text-gray-600",children:"Name:"})," ",(null==r?void 0:r.firstname)||""," ",(null==r?void 0:r.lastname)||""]}),t.jsxs("p",{children:[t.jsx("span",{className:"text-gray-600",children:"Email:"})," ",(null==r?void 0:r.email)||""]})]})]}),t.jsxs("div",{className:"border rounded-lg p-4",children:[t.jsxs("div",{className:"flex justify-between items-center mb-4",children:[t.jsx("h2",{className:"text-lg font-semibold",children:"Default Addresses"}),t.jsx(j,{to:"/account/addresses",className:"text-sm text-indigo-600 hover:text-indigo-800",children:"Manage Addresses"})]}),(null==r?void 0:r.addresses)&&r.addresses.length>0?t.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[t.jsxs("div",{children:[t.jsx("h3",{className:"font-medium text-gray-700 mb-1",children:"Default Billing"}),t.jsx("address",{className:"text-sm not-italic",children:d(r.addresses.find((e=>e.default_billing))||r.addresses[0])})]}),t.jsxs("div",{children:[t.jsx("h3",{className:"font-medium text-gray-700 mb-1",children:"Default Shipping"}),t.jsx("address",{className:"text-sm not-italic",children:d(r.addresses.find((e=>e.default_shipping))||r.addresses[0])})]})]}):t.jsx("p",{className:"text-gray-500",children:"You have not set a default billing or shipping address."})]})]}),t.jsxs("div",{className:"border rounded-lg p-4",children:[t.jsxs("div",{className:"flex justify-between items-center mb-4",children:[t.jsx("h2",{className:"text-lg font-semibold",children:"Recent Orders"}),t.jsx(j,{to:"/account/orders",className:"text-sm text-indigo-600 hover:text-indigo-800",children:"View All Orders"})]}),n?t.jsx("div",{className:"flex justify-center py-8",children:t.jsx(le,{})}):o?t.jsxs("div",{className:"bg-red-50 border-l-4 border-red-500 p-4",children:[t.jsx("p",{className:"text-red-700",children:o}),t.jsx("button",{onClick:()=>window.location.reload(),className:"mt-2 text-sm text-indigo-600 hover:text-indigo-800",children:"Refresh Page"})]}):s.length>0?t.jsx("div",{className:"overflow-x-auto",children:t.jsxs("table",{className:"min-w-full divide-y divide-gray-200",children:[t.jsx("thead",{className:"bg-gray-50",children:t.jsxs("tr",{children:[t.jsx("th",{scope:"col",className:"px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",children:"Order #"}),t.jsx("th",{scope:"col",className:"px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",children:"Date"}),t.jsx("th",{scope:"col",className:"px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",children:"Ship To"}),t.jsx("th",{scope:"col",className:"px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",children:"Total"}),t.jsx("th",{scope:"col",className:"px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",children:"Status"}),t.jsx("th",{scope:"col",className:"px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",children:"Actions"})]})}),t.jsx("tbody",{className:"bg-white divide-y divide-gray-200",children:s.map((e=>t.jsxs("tr",{children:[t.jsxs("td",{className:"px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900",children:["#",e.order_number||"N/A"]}),t.jsx("td",{className:"px-4 py-4 whitespace-nowrap text-sm text-gray-500",children:e.created_at?at(e.created_at):"N/A"}),t.jsx("td",{className:"px-4 py-4 whitespace-nowrap text-sm text-gray-500",children:e.shipping_address?`${e.shipping_address.firstname||""} ${e.shipping_address.lastname||""}`.trim():"N/A"}),t.jsxs("td",{className:"px-4 py-4 whitespace-nowrap text-sm text-gray-500",children:["$","number"==typeof e.grand_total?e.grand_total.toFixed(2):"0.00"]}),t.jsx("td",{className:"px-4 py-4 whitespace-nowrap",children:t.jsx("span",{className:`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${u(e.status)}`,children:e.status||"Unknown"})}),t.jsx("td",{className:"px-4 py-4 whitespace-nowrap text-sm text-gray-500",children:t.jsx(j,{to:`/account/orders/${e.entity_id||e.id}`,className:"text-indigo-600 hover:text-indigo-900",children:"View Order"})})]},e.entity_id||e.id||Math.random().toString())))})]})}):t.jsxs("div",{className:"bg-gray-50 p-6 text-center rounded-md",children:[t.jsx("p",{className:"text-gray-500",children:"You have not placed any orders yet."}),t.jsx(j,{to:"/products",className:"mt-3 inline-block text-indigo-600 hover:text-indigo-800",children:"Browse Products"})]})]})]}):t.jsxs("div",{className:"text-center py-10",children:[t.jsx("h1",{className:"text-2xl font-bold mb-4",children:"My Account"}),t.jsx("p",{className:"mb-6",children:"Please log in to view your account dashboard."}),t.jsx("button",{onClick:()=>c("/login"),className:"bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700",children:"Log In"})]})})),it=n.memo((()=>{const[r,s]=e.useState([]),[a,n]=e.useState(!0),[i,o]=e.useState(null),[l,c]=e.useState(1),[d,u]=e.useState(1),[m,g]=e.useState("all");e.useEffect((()=>{(async()=>{n(!0);try{const e=await(async()=>{var e,t,r,s;try{const a=`\n      ${rt}\n      query GetCustomerOrders {\n        customer {\n          orders {\n            items {\n              ...OrderDetails\n            }\n            total_count\n          }\n        }\n      }\n    `,n=await xe.post("/graphql",{query:a});if(n.data.errors)throw new Error(n.data.errors[0].message);const i=(null==(t=null==(e=n.data.data.customer)?void 0:e.orders)?void 0:t.items)||[];let o=(null==(s=null==(r=n.data.data.customer)?void 0:r.orders)?void 0:s.total_count)||0;return 0===o&&i.length>0&&(o=i.length),{items:i,total_count:o}}catch(i){return{items:[],total_count:0,error:i.message||"Failed to fetch orders"}}})();e&&e.items?(s(e.items),u(Math.ceil(e.total_count/10)),o(null)):e&&e.error?(o(e.error||"Unable to load orders. Please try again later."),s([]),u(1)):(o("Unable to load orders due to an unexpected response. Please try again later."),s([]),u(1))}catch(e){o("Unable to load orders due to a network or unexpected issue. Please try again later."),s([]),u(1)}finally{n(!1)}})()}),[l,m]);const h=e=>{c(e),window.scrollTo(0,0)},p=e=>{switch(e.toLowerCase()){case"complete":return"bg-green-100 text-green-800";case"processing":return"bg-blue-100 text-blue-800";case"pending":return"bg-yellow-100 text-yellow-800";case"canceled":return"bg-red-100 text-red-800";default:return"bg-gray-100 text-gray-800"}};return t.jsxs("div",{children:[t.jsx("h1",{className:"text-2xl font-bold mb-6",children:"My Orders"}),t.jsxs("div",{className:"flex flex-col sm:flex-row justify-between items-center mb-6",children:[t.jsxs("div",{className:"mb-4 sm:mb-0",children:[t.jsx("label",{htmlFor:"filter",className:"mr-2 text-gray-700",children:"Filter by:"}),t.jsxs("select",{id:"filter",value:m,onChange:e=>{g(e.target.value),c(1)},className:"border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500",children:[t.jsx("option",{value:"all",children:"All Orders"}),t.jsx("option",{value:"processing",children:"Processing"}),t.jsx("option",{value:"complete",children:"Complete"}),t.jsx("option",{value:"pending",children:"Pending"}),t.jsx("option",{value:"canceled",children:"Canceled"})]})]}),t.jsxs("div",{className:"relative",children:[t.jsx("input",{type:"text",placeholder:"Search orders...",className:"border border-gray-300 rounded-md pl-10 pr-4 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"}),t.jsx("div",{className:"absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none",children:t.jsx("i",{className:"fas fa-search text-gray-400"})})]})]}),a?t.jsx("div",{className:"flex justify-center py-8",children:t.jsx(le,{})}):i?t.jsx("div",{className:"bg-red-50 border-l-4 border-red-500 p-4",children:t.jsx("p",{className:"text-red-700",children:i})}):r.length>0?t.jsxs(t.Fragment,{children:[t.jsx("div",{className:"overflow-x-auto shadow rounded-lg",children:t.jsxs("table",{className:"min-w-full divide-y divide-gray-200",children:[t.jsx("thead",{className:"bg-gray-50",children:t.jsxs("tr",{children:[t.jsx("th",{scope:"col",className:"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",children:"Order #"}),t.jsx("th",{scope:"col",className:"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",children:"Date"}),t.jsx("th",{scope:"col",className:"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",children:"Ship To"}),t.jsx("th",{scope:"col",className:"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",children:"Total"}),t.jsx("th",{scope:"col",className:"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",children:"Status"}),t.jsx("th",{scope:"col",className:"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",children:"Actions"})]})}),t.jsx("tbody",{className:"bg-white divide-y divide-gray-200",children:[...r].sort(((e,t)=>new Date(t.created_at)-new Date(e.created_at))).map((e=>{var r,s;return t.jsxs("tr",{className:"hover:bg-gray-50",children:[t.jsxs("td",{className:"px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900",children:["#",e.order_number]}),t.jsx("td",{className:"px-6 py-4 whitespace-nowrap text-sm text-gray-500",children:at(e.created_at)}),t.jsxs("td",{className:"px-6 py-4 whitespace-nowrap text-sm text-gray-500",children:[null==(r=e.shipping_address)?void 0:r.firstname," ",null==(s=e.shipping_address)?void 0:s.lastname]}),t.jsx("td",{className:"px-6 py-4 whitespace-nowrap text-sm text-gray-500",children:st(e.grand_total)}),t.jsx("td",{className:"px-6 py-4 whitespace-nowrap",children:t.jsx("span",{className:`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${p(e.status)}`,children:e.status})}),t.jsxs("td",{className:"px-6 py-4 whitespace-nowrap text-sm font-medium",children:[t.jsx(j,{to:`/account/orders/${e.order_number}`,className:"text-indigo-600 hover:text-indigo-900 mr-4",children:"View"}),"complete"===e.status&&t.jsx(j,{to:`/account/orders/${e.id}/reorder`,className:"text-indigo-600 hover:text-indigo-900",children:"Reorder"})]})]},e.id)}))})]})}),d>1&&t.jsx("div",{className:"flex justify-center mt-6",children:t.jsxs("nav",{className:"relative z-0 inline-flex rounded-md shadow-sm -space-x-px","aria-label":"Pagination",children:[t.jsxs("button",{onClick:()=>h(l-1),disabled:1===l,className:"relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium "+(1===l?"text-gray-300 cursor-not-allowed":"text-gray-500 hover:bg-gray-50"),children:[t.jsx("span",{className:"sr-only",children:"Previous"}),t.jsx("i",{className:"fas fa-chevron-left"})]}),[...Array(d)].map(((e,r)=>t.jsx("button",{onClick:()=>h(r+1),className:"relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium "+(l===r+1?"z-10 bg-indigo-50 border-indigo-500 text-indigo-600":"text-gray-500 hover:bg-gray-50"),children:r+1},r))),t.jsxs("button",{onClick:()=>h(l+1),disabled:l===d,className:"relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium "+(l===d?"text-gray-300 cursor-not-allowed":"text-gray-500 hover:bg-gray-50"),children:[t.jsx("span",{className:"sr-only",children:"Next"}),t.jsx("i",{className:"fas fa-chevron-right"})]})]})})]}):t.jsxs("div",{className:"bg-gray-50 rounded-lg p-8 text-center",children:[t.jsx("div",{className:"text-gray-500 mb-4",children:t.jsx("i",{className:"fas fa-shopping-bag text-4xl"})}),t.jsx("h3",{className:"text-lg font-medium text-gray-900 mb-2",children:"No Orders Found"}),t.jsx("p",{className:"text-gray-500 mb-4",children:"You haven't placed any orders yet."}),t.jsx(j,{to:"/products",className:"inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700",children:"Start Shopping"})]})]})})),ot=n.memo((()=>{var r,s,a,n,i,o,l,c;const{orderId:d}=P(),u=N(),[m,g]=e.useState(null),[h,p]=e.useState(!0),[y,x]=e.useState(null);e.useEffect((()=>{(async()=>{p(!0);try{const e=await(async e=>{var t,r;if(!e)return null;try{const s=`\n      ${rt}\n      query GetCustomerOrders {\n        customer {\n          orders {\n            items {\n              ...OrderDetails\n            }\n          }\n        }\n      }\n    `,a=await xe.post("/graphql",{query:s});if(a.data.errors)throw new Error(a.data.errors[0].message);return((null==(r=null==(t=a.data.data.customer)?void 0:t.orders)?void 0:r.items)||[]).find((t=>t.order_number===String(e)))}catch(y){return null}})(d);e?(g(e),x(null)):x("Order not found")}catch(e){x("Failed to load order details")}finally{p(!1)}})()}),[d]);const f=()=>m.extension_attributes&&m.extension_attributes.shipping_assignments&&m.extension_attributes.shipping_assignments[0]&&m.extension_attributes.shipping_assignments[0].shipping&&m.extension_attributes.shipping_assignments[0].shipping.address?m.extension_attributes.shipping_assignments[0].shipping.address:null;return h?t.jsx("div",{className:"flex justify-center items-center h-64",children:t.jsx("div",{className:"animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"})}):y?t.jsx("div",{className:"bg-red-50 p-4 rounded-md text-red-800",children:y}):m?t.jsxs("div",{children:[t.jsxs("div",{className:"flex justify-between items-center mb-6",children:[t.jsxs("h1",{className:"text-2xl font-bold",children:["Order #",m.order_number]}),t.jsxs("button",{onClick:()=>u("/account/orders"),className:"text-indigo-600 hover:text-indigo-800",children:[t.jsx("i",{className:"fas fa-arrow-left mr-2"}),"Back to Orders"]})]}),t.jsxs("div",{className:"flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 bg-gray-50 p-4 rounded-lg",children:[t.jsxs("div",{children:[t.jsx("p",{className:"text-gray-600 text-sm",children:"Order Date:"}),t.jsx("p",{className:"font-medium",children:at(m.created_at)})]}),t.jsxs("div",{className:"mt-2 sm:mt-0",children:[t.jsx("p",{className:"text-gray-600 text-sm",children:"Status:"}),t.jsx("span",{className:`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${(e=>{switch(null==e?void 0:e.toLowerCase()){case"complete":return"bg-green-100 text-green-800";case"processing":return"bg-blue-100 text-blue-800";case"pending":return"bg-yellow-100 text-yellow-800";case"canceled":return"bg-red-100 text-red-800";default:return"bg-gray-100 text-gray-800"}})(m.status)}`,children:m.status})]}),t.jsxs("div",{className:"mt-2 sm:mt-0",children:[t.jsx("p",{className:"text-gray-600 text-sm",children:"Total:"}),t.jsx("p",{className:"font-bold",children:st(m.grand_total)})]})]}),t.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-6 mb-8",children:[f()&&t.jsxs("div",{className:"border rounded-lg p-4",children:[t.jsx("h2",{className:"text-lg font-semibold mb-2",children:"Shipping Address"}),t.jsxs("address",{className:"not-italic",children:[f().firstname," ",f().lastname,t.jsx("br",{}),Array.isArray(f().street)?f().street.join(", "):f().street,t.jsx("br",{}),f().city,", ",f().region," ",f().postcode,t.jsx("br",{}),f().country_id,t.jsx("br",{}),"T: ",f().telephone]})]}),t.jsxs("div",{className:"border rounded-lg p-4",children:[t.jsx("h2",{className:"text-lg font-semibold mb-2",children:"Billing Address"}),t.jsxs("address",{className:"not-italic",children:[m.billing_address.firstname," ",m.billing_address.lastname,t.jsx("br",{}),Array.isArray(m.billing_address.street)?m.billing_address.street.join(", "):m.billing_address.street,t.jsx("br",{}),m.billing_address.city,", ",m.billing_address.region," ",m.billing_address.postcode,t.jsx("br",{}),m.billing_address.country_id,t.jsx("br",{}),"T: ",m.billing_address.telephone]})]}),t.jsxs("div",{className:"border rounded-lg p-4",children:[t.jsx("h2",{className:"text-lg font-semibold mb-2",children:"Payment Method"}),m.payment_methods.length>0?t.jsxs("div",{children:[t.jsx("p",{className:"font-medium",children:m.payment_methods[0].name}),m.payment_methods[0].additional_data.length>0&&t.jsx("div",{className:"mt-2",children:m.payment_methods[0].additional_data.map(((e,r)=>t.jsxs("p",{children:[e.name,": ",e.value]},r)))})]}):t.jsx("p",{children:"No payment method information available"})]}),t.jsxs("div",{className:"border rounded-lg p-4",children:[t.jsx("h2",{className:"text-lg font-semibold mb-2",children:"Shipping Method"}),t.jsx("p",{children:m.shipping_method||"No shipping method information available"})]})]}),t.jsxs("div",{className:"mb-8",children:[t.jsx("h2",{className:"text-lg font-semibold mb-4",children:"Items Ordered"}),t.jsx("div",{className:"overflow-x-auto shadow rounded-lg",children:t.jsxs("table",{className:"min-w-full divide-y divide-gray-200",children:[t.jsx("thead",{className:"bg-gray-50",children:t.jsxs("tr",{children:[t.jsx("th",{scope:"col",className:"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",children:"Product"}),t.jsx("th",{scope:"col",className:"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",children:"SKU"}),t.jsx("th",{scope:"col",className:"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",children:"Price"}),t.jsx("th",{scope:"col",className:"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",children:"Qty"}),t.jsx("th",{scope:"col",className:"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",children:"Subtotal"})]})}),t.jsx("tbody",{className:"bg-white divide-y divide-gray-200",children:m.items.map((e=>t.jsx(j,{to:`/product/${e.product.url_key}`,className:"no-underline",children:t.jsxs("tr",{className:"hover:bg-gray-50",children:[t.jsx("td",{className:"px-6 py-4",children:t.jsxs("div",{className:"flex items-center",children:[t.jsx("div",{className:"w-12 h-12 bg-gray-200 rounded mr-3 flex items-center justify-center",children:e.product&&e.product.small_image&&e.product.small_image.url?t.jsx("img",{src:e.product.small_image.url,alt:e.product.small_image.label||e.product.name,className:"w-full h-full object-cover rounded"}):t.jsx("i",{className:"fas fa-box text-gray-400"})}),t.jsxs("div",{children:[t.jsx("div",{className:"text-sm font-medium text-gray-900",children:e.product.name}),t.jsxs("div",{className:"text-xs text-gray-500 mt-1",children:["SKU: ",e.product.sku]})]})]})}),t.jsx("td",{className:"px-6 py-4 whitespace-nowrap text-sm text-gray-500",children:e.product.sku}),t.jsx("td",{className:"px-6 py-4 whitespace-nowrap text-sm text-gray-500",children:st(e.product_sale_price.value)}),t.jsx("td",{className:"px-6 py-4 whitespace-nowrap text-sm text-gray-500",children:e.quantity_ordered}),t.jsx("td",{className:"px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium",children:st(e.product_sale_price.value*e.quantity_ordered)})]},e.id)},e.id)))})]})})]}),t.jsxs("div",{className:"mb-8",children:[t.jsx("h2",{className:"text-lg font-semibold mb-4",children:"Order Summary"}),t.jsx("div",{className:"bg-gray-50 p-4 rounded-lg",children:t.jsxs("div",{className:"space-y-2",children:[t.jsxs("div",{className:"flex justify-between",children:[t.jsx("span",{className:"text-gray-600",children:"Subtotal"}),t.jsx("span",{children:st(null==(s=null==(r=m.total)?void 0:r.subtotal)?void 0:s.value)})]}),t.jsxs("div",{className:"flex justify-between",children:[t.jsx("span",{className:"text-gray-600",children:"Shipping & Handling"}),t.jsx("span",{children:st(null==(n=null==(a=m.total)?void 0:a.total_shipping)?void 0:n.value)})]}),t.jsxs("div",{className:"flex justify-between",children:[t.jsx("span",{className:"text-gray-600",children:"Tax"}),t.jsx("span",{children:st(null==(o=null==(i=m.total)?void 0:i.total_tax)?void 0:o.value)})]}),(null==(c=null==(l=m.total)?void 0:l.discounts)?void 0:c.length)>0&&t.jsxs("div",{className:"flex justify-between",children:[t.jsx("span",{className:"text-gray-600",children:"Discount"}),t.jsxs("span",{className:"text-green-600",children:["-",st(m.total.discounts[0].amount.value)]})]}),t.jsxs("div",{className:"flex justify-between border-t pt-2 mt-2",children:[t.jsx("span",{className:"font-semibold",children:"Grand Total"}),t.jsx("span",{className:"font-bold",children:st(m.grand_total)})]})]})})]}),t.jsxs("div",{className:"flex flex-wrap gap-4",children:["complete"===m.status&&t.jsxs(j,{to:`/account/orders/${m.entity_id}/reorder`,className:"inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700",children:[t.jsx("i",{className:"fas fa-redo mr-2"}),"Reorder"]}),t.jsxs("button",{className:"inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50",onClick:()=>(e=>{const t=window.open("","_blank");if(!t)return void alert("Please allow pop-ups to print the order");const r=e.extension_attributes&&e.extension_attributes.shipping_assignments&&e.extension_attributes.shipping_assignments[0]&&e.extension_attributes.shipping_assignments[0].shipping&&e.extension_attributes.shipping_assignments[0].shipping.address?e.extension_attributes.shipping_assignments[0].shipping.address:null,s=`\n    <!DOCTYPE html>\n    <html>\n    <head>\n      <title>Order #${e.increment_id}</title>\n      <meta charset="utf-8">\n      <meta name="viewport" content="width=device-width, initial-scale=1">\n      <style>\n        body {\n          font-family: Arial, sans-serif;\n          line-height: 1.6;\n          color: #333;\n          max-width: 800px;\n          margin: 0 auto;\n          padding: 20px;\n        }\n        h1 {\n          font-size: 24px;\n          margin-bottom: 20px;\n          border-bottom: 1px solid #eee;\n          padding-bottom: 10px;\n        }\n        h2 {\n          font-size: 18px;\n          margin-top: 20px;\n          margin-bottom: 10px;\n        }\n        .order-info {\n          display: flex;\n          justify-content: space-between;\n          margin-bottom: 20px;\n          background-color: #f9f9f9;\n          padding: 15px;\n          border-radius: 5px;\n        }\n        .order-info div {\n          flex: 1;\n        }\n        .address-container {\n          display: flex;\n          flex-wrap: wrap;\n          gap: 20px;\n          margin-bottom: 20px;\n        }\n        .address-box {\n          flex: 1;\n          min-width: 250px;\n          border: 1px solid #ddd;\n          border-radius: 5px;\n          padding: 15px;\n        }\n        table {\n          width: 100%;\n          border-collapse: collapse;\n          margin-bottom: 20px;\n        }\n        th, td {\n          border: 1px solid #ddd;\n          padding: 10px;\n          text-align: left;\n        }\n        th {\n          background-color: #f2f2f2;\n        }\n        .summary {\n          background-color: #f9f9f9;\n          padding: 15px;\n          border-radius: 5px;\n        }\n        .summary-row {\n          display: flex;\n          justify-content: space-between;\n          margin-bottom: 8px;\n        }\n        .summary-total {\n          font-weight: bold;\n          border-top: 1px solid #ddd;\n          padding-top: 8px;\n          margin-top: 8px;\n        }\n        .status-badge {\n          display: inline-block;\n          padding: 3px 8px;\n          border-radius: 12px;\n          font-size: 12px;\n          font-weight: bold;\n        }\n        .status-complete { background-color: #d1fae5; color: #065f46; }\n        .status-processing { background-color: #dbeafe; color: #1e40af; }\n        .status-pending { background-color: #fef3c7; color: #92400e; }\n        .status-canceled { background-color: #fee2e2; color: #b91c1c; }\n        @media print {\n          body { \n            print-color-adjust: exact;\n            -webkit-print-color-adjust: exact;\n          }\n        }\n      </style>\n    </head>\n    <body>\n      <h1>Order #${e.increment_id}</h1>\n      \n      <div class="order-info">\n        <div>\n          <p style="color: #666; margin-bottom: 5px;">Order Date:</p>\n          <p style="font-weight: 500; margin-top: 0;">${at(e.created_at)}</p>\n        </div>\n        <div>\n          <p style="color: #666; margin-bottom: 5px;">Status:</p>\n          <span class="status-badge status-${e.status.toLowerCase()}">${e.status}</span>\n        </div>\n        <div>\n          <p style="color: #666; margin-bottom: 5px;">Total:</p>\n          <p style="font-weight: 700; margin-top: 0;">${st(e.grand_total)}</p>\n        </div>\n      </div>\n      \n      <div class="address-container">\n        ${r?`\n        <div class="address-box">\n          <h2>Shipping Address</h2>\n          <p>\n            ${r.firstname} ${r.lastname}<br>\n            ${Array.isArray(r.street)?r.street.join(", "):r.street}<br>\n            ${r.city}, ${r.region} ${r.postcode}<br>\n            ${r.country_id}<br>\n            T: ${r.telephone}\n          </p>\n        </div>\n        `:""}\n        \n        <div class="address-box">\n          <h2>Billing Address</h2>\n          <p>\n            ${e.billing_address.firstname} ${e.billing_address.lastname}<br>\n            ${Array.isArray(e.billing_address.street)?e.billing_address.street.join(", "):e.billing_address.street}<br>\n            ${e.billing_address.city}, ${e.billing_address.region} ${e.billing_address.postcode}<br>\n            ${e.billing_address.country_id}<br>\n            T: ${e.billing_address.telephone}\n          </p>\n        </div>\n      </div>\n      \n      <div class="address-container">\n        <div class="address-box">\n          <h2>Payment Method</h2>\n          <p>${e.payment.method}</p>\n        </div>\n        \n        <div class="address-box">\n          <h2>Shipping Method</h2>\n          <p>${e.shipping_description}</p>\n        </div>\n      </div>\n      \n      <h2>Items Ordered</h2>\n      <table>\n        <thead>\n          <tr>\n            <th>Product</th>\n            <th>SKU</th>\n            <th>Price</th>\n            <th>Qty</th>\n            <th>Subtotal</th>\n          </tr>\n        </thead>\n        <tbody>\n          ${e.items.map((e=>`\n            <tr>\n              <td>\n                <div style="font-weight: 500;">${e.name}</div>\n                ${e.options?e.options.map((e=>`\n                  <div style="font-size: 12px; color: #666; margin-top: 5px;">\n                    <span style="font-weight: 500;">${e.label}:</span> ${e.value}\n                  </div>\n                `)).join(""):""}\n              </td>\n              <td>${e.sku}</td>\n              <td>${st(e.price)}</td>\n              <td>${e.qty_ordered}</td>\n              <td style="font-weight: 500;">${st(e.row_total)}</td>\n            </tr>\n          `)).join("")}\n        </tbody>\n      </table>\n      \n      <h2>Order Summary</h2>\n      <div class="summary">\n        <div class="summary-row">\n          <span>Subtotal</span>\n          <span>${st(e.subtotal)}</span>\n        </div>\n        \n        ${e.discount_amount>0?`\n        <div class="summary-row">\n          <span>Discount</span>\n          <span style="color: #059669;">-${st(Math.abs(e.discount_amount))}</span>\n        </div>\n        `:""}\n        \n        <div class="summary-row">\n          <span>Shipping & Handling</span>\n          <span>${st(e.shipping_amount)}</span>\n        </div>\n        \n        ${e.tax_amount>0?`\n        <div class="summary-row">\n          <span>Tax</span>\n          <span>${st(e.tax_amount)}</span>\n        </div>\n        `:""}\n        \n        <div class="summary-row summary-total">\n          <span>Grand Total</span>\n          <span>${st(e.grand_total)}</span>\n        </div>\n      </div>\n    </body>\n    </html>\n  `;t.document.open(),t.document.write(s),t.document.close(),t.onload=function(){t.print()}})(m),children:[t.jsx("i",{className:"fas fa-print mr-2"}),"Print Order"]}),"complete"!==m.status&&"canceled"!==m.status&&t.jsxs(j,{to:`/account/orders/${m.entity_id}/track`,className:"inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50",children:[t.jsx("i",{className:"fas fa-truck mr-2"}),"Track Order"]})]})]}):t.jsx("div",{className:"bg-yellow-50 p-4 rounded-md text-yellow-800",children:"Order not found"})})),lt="http://magento.local:8001/rest/V1",ct=()=>{const e=localStorage.getItem(me);return e?{"Content-Type":"application/json",Authorization:`Bearer ${e}`}:null},dt=async e=>{if(!e.ok){const t=await e.json().catch((()=>({message:`HTTP error ${e.status}`})));throw new Error(t.message||`HTTP error ${e.status}`)}return e.json()},ut=async()=>{const e=ct();if(!e)throw new Error("Authentication token not found.");const t=await fetch(`${lt}/customers/me`,{method:"GET",headers:e});return dt(t)},mt=async()=>{try{const e=ct();if(!e)throw new Error("Authentication token not found.");const t=await fetch(`${lt}/customers/me`,{method:"GET",headers:e});return dt(t)}catch(e){throw e}};function gt(e){const t={...e};return t.street&&!Array.isArray(t.street)?t.street=[t.street]:Array.isArray(t.street)&&(t.street=t.street.filter((e=>e&&""!==e.trim()))),t.region_input&&!t.region&&(t.region={region:t.region_input}),void 0!==t.region_id&&""!==t.region_id&&null!==t.region_id&&(t.region||(t.region={}),t.region.region_id=parseInt(t.region_id,10)),delete t.region_input,delete t.region_id,delete t.customerId,delete t.email,t.telephone||(t.telephone=""),t.country_id||(t.country_id="US"),t}const ht=async e=>{try{const t=ct();if(!t)throw new Error("Authentication token not found.");const r=await fetch(`${lt}/customers/me`,{method:"GET",headers:t});if(!r.ok)throw new Error("Failed to fetch customer details.");const s=await r.json(),a=gt(e),n={id:s.id,email:s.email,firstname:s.firstname,lastname:s.lastname,addresses:[...s.addresses||[],a]},i=await fetch(`${lt}/customers/me`,{method:"PUT",headers:{...t,"Content-Type":"application/json"},body:JSON.stringify({customer:n})});return dt(i)}catch(t){throw t}},pt=async e=>{try{if(!e.id)throw new Error("Address ID is required for updating.");const t=ct();if(!t)throw new Error("Authentication token not found.");const r=await fetch(`${lt}/customers/me`,{method:"GET",headers:t});if(!r.ok)throw new Error("Failed to fetch customer details.");const s=await r.json(),a=e.id;if(!(s.addresses&&s.addresses.some((e=>e.id===a))))throw new Error(`Address with ID ${a} not found.`);const n=s.addresses.map((t=>t.id===a?{...t,...gt(e)}:t)),i={...s,addresses:n},o=await fetch(`${lt}/customers/me`,{method:"PUT",headers:{...t,"Content-Type":"application/json"},body:JSON.stringify({customer:i})});return dt(o)}catch(t){throw t}},yt=async e=>{try{const t=ct();if(!t)throw new Error("Authentication token not found.");const r=await ut();if(!(r.addresses&&r.addresses.some((t=>t.id===e))))throw new Error(`Address with ID ${e} not found.`);const s=r.addresses.find((t=>t.id===e)),a=r.addresses.filter((t=>t.id!==e)),n={...r,addresses:a};(s.default_billing||s.default_shipping)&&(a.length>0?(s.default_billing&&(n.default_billing=a[0].id),s.default_shipping&&(n.default_shipping=a[0].id)):(delete n.default_billing,delete n.default_shipping));const i=await fetch(`${lt}/customers/me`,{method:"PUT",headers:{...t,"Content-Type":"application/json"},body:JSON.stringify({customer:n})});return await dt(i),!0}catch(t){throw t}},xt=async e=>{try{const t=ct();if(!t)throw new Error("Authentication token not found.");const r=await fetch(`${lt}/directory/countries/${e}`,{method:"GET",headers:t}),s=await dt(r);return s.available_regions?s.available_regions:[]}catch(t){throw t}};const ft=n.memo((function({initialData:r=null,onSuccess:s,onCancel:a}){const n=!!(null==r?void 0:r.id),i=localStorage.getItem("magentoUserInfo"),o=i?JSON.parse(i):null,[l,c]=e.useState({id:(null==r?void 0:r.id)||null,customerId:(null==o?void 0:o.id)||null,firstname:"",lastname:"",email:(null==o?void 0:o.email)||"",street:["",""],city:"",region_input:"",region_id:"",postcode:"",country_id:"US",telephone:"",default_billing:!1,default_shipping:!1}),[d,u]=e.useState(!1),[m,g]=e.useState(null),[h,p]=e.useState(!1),[y,x]=e.useState([]),[f,b]=e.useState([]);e.useEffect((()=>{(async()=>{try{const e=await(async()=>{try{const e=ct();if(!e)throw new Error("Authentication token not found.");const t=await fetch(`${lt}/directory/countries`,{method:"GET",headers:e});return await dt(t)}catch(m){throw m}})();x(e||[])}catch(e){x([])}})()}),[]),e.useEffect((()=>{r&&!h&&(c({id:r.id||null,customerId:r.customerId||(null==o?void 0:o.id)||null,firstname:r.firstname||"",lastname:r.lastname||"",email:r.email||(o?o.email:""),street:Array.isArray(r.street)?[...r.street,...Array(Math.max(0,2-r.street.length)).fill("")].slice(0,2):[r.street||"",""],city:r.city||"",region_input:"object"==typeof r.region?r.region.region||"":r.region||"",region_id:"object"==typeof r.region?r.region.region_id||"":r.region_id||"",postcode:r.postcode||"",country_id:r.country_id||"US",telephone:r.telephone||"",default_billing:r.default_billing||!1,default_shipping:r.default_shipping||!1}),p(!0))}),[r,o,h]);const v=e=>{const{name:t,value:r,type:s,checked:a}=e.target;if(g(null),t.startsWith("street[")){const e=parseInt(t.match(/\[(\d+)\]/)[1],10),s=[...l.street];s[e]=r,c((e=>({...e,street:s})))}else c((e=>({...e,[t]:"checkbox"===s?a:r})))};return t.jsxs("div",{className:"bg-gray-50 p-6 rounded-lg border border-gray-200",children:[t.jsx("h3",{className:"text-xl font-medium mb-4",children:n?"Edit Address":"Add New Address"}),m&&t.jsx("div",{className:"bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4",children:m}),t.jsxs("form",{onSubmit:async e=>{e.preventDefault(),u(!0),g(null);try{if(!l.email)throw new Error("Customer email is required");const e={...l,street:l.street.filter((e=>e&&""!==e.trim())),region:{region:l.region_input,region_id:l.region_id?parseInt(l.region_id,10):null}};delete e.region_input,n&&e.id?await pt(e):(delete e.id,await ht(e)),s&&s()}catch(t){g(t.message||"Failed to save address. Please try again.")}finally{u(!1)}},children:[t.jsxs("div",{className:"mb-4",children:[n&&t.jsx("input",{type:"hidden",name:"id",id:"id",value:l.id||"",readOnly:!0}),t.jsx("input",{type:"hidden",name:"customerId",id:"customerId",value:l.customerId||"",readOnly:!0}),t.jsx("input",{type:"hidden",name:"email",id:"email",value:l.email||"",readOnly:!0})]}),t.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4 mb-4",children:[t.jsxs("div",{children:[t.jsx("label",{htmlFor:"firstname",className:"block text-sm font-medium text-gray-700 mb-1",children:"First Name*"}),t.jsx("input",{id:"firstname",type:"text",name:"firstname",value:l.firstname,onChange:v,required:!0,className:"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"})]}),t.jsxs("div",{children:[t.jsx("label",{htmlFor:"lastname",className:"block text-sm font-medium text-gray-700 mb-1",children:"Last Name*"}),t.jsx("input",{id:"lastname",type:"text",name:"lastname",value:l.lastname,onChange:v,required:!0,className:"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"})]})]}),t.jsxs("div",{className:"mb-4",children:[t.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Street Address*"}),t.jsx("input",{type:"text",name:"street[0]",value:l.street[0],onChange:v,placeholder:"Street Address Line 1",required:!0,className:"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-2"}),t.jsx("input",{type:"text",name:"street[1]",value:l.street[1],onChange:v,placeholder:"Street Address Line 2 (optional)",className:"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"})]}),t.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4 mb-4",children:[t.jsxs("div",{children:[t.jsx("label",{htmlFor:"country_id",className:"block text-sm font-medium text-gray-700 mb-1",children:"Country*"}),t.jsxs("select",{id:"country_id",name:"country_id",value:l.country_id,onChange:e=>{v(e),(async e=>{const t=e.target.value,r=await xt(t);b(r||[])})(e)},required:!0,className:"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500",children:[t.jsx("option",{value:"",children:"Select Country"}),y.map((e=>t.jsx("option",{value:e.id,children:e.full_name_english||e.name},e.id)))]})]}),t.jsxs("div",{children:[t.jsx("label",{htmlFor:"region_input",className:"block text-sm font-medium text-gray-700 mb-1",children:"State/Province/Region*"}),0===f.length&&t.jsx("input",{id:"region_input",type:"text",name:"region_input",value:l.region_input,onChange:v,placeholder:"Enter State/Province/Region",required:!0,className:"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"}),f.length>0&&t.jsxs("select",{id:"region_id",name:"region_id",value:l.region_id,onChange:e=>{v(e)},required:!0,className:"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500",children:[t.jsx("option",{value:"",children:"Select Country"}),f.map((e=>t.jsx("option",{value:e.id,children:e.full_name_english||e.name},e.id)))]})]})]}),t.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4 mb-4",children:[t.jsxs("div",{children:[t.jsx("label",{htmlFor:"city",className:"block text-sm font-medium text-gray-700 mb-1",children:"City*"}),t.jsx("input",{id:"city",type:"text",name:"city",value:l.city,onChange:v,required:!0,className:"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"})]}),t.jsxs("div",{children:[t.jsx("label",{htmlFor:"postcode",className:"block text-sm font-medium text-gray-700 mb-1",children:"Zip/Postal Code*"}),t.jsx("input",{id:"postcode",type:"text",name:"postcode",value:l.postcode,onChange:v,required:!0,className:"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"})]})]}),t.jsxs("div",{className:"mb-4",children:[t.jsx("label",{htmlFor:"telephone",className:"block text-sm font-medium text-gray-700 mb-1",children:"Phone Number*"}),t.jsx("input",{id:"telephone",type:"number",name:"telephone",value:l.telephone,onChange:v,required:!0,className:"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"})]}),t.jsxs("div",{className:"mb-6",children:[t.jsxs("div",{className:"flex items-center mb-2",children:[t.jsx("input",{type:"checkbox",id:"default_shipping",name:"default_shipping",checked:l.default_shipping,onChange:v,className:"h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"}),t.jsx("label",{htmlFor:"default_shipping",className:"ml-2 block text-sm text-gray-700",children:"Use as default shipping address"})]}),t.jsxs("div",{className:"flex items-center",children:[t.jsx("input",{type:"checkbox",id:"default_billing",name:"default_billing",checked:l.default_billing,onChange:v,className:"h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"}),t.jsx("label",{htmlFor:"default_billing",className:"ml-2 block text-sm text-gray-700",children:"Use as default billing address"})]})]}),t.jsxs("div",{className:"flex justify-end space-x-3",children:[t.jsx("button",{type:"button",onClick:a,className:"px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50",children:"Cancel"}),t.jsx("button",{type:"submit",disabled:d,className:"px-4 py-2 rounded-md text-white bg-indigo-600 hover:bg-indigo-700 "+(d?"opacity-70 cursor-not-allowed":""),children:d?"Saving...":n?"Update Address":"Add Address"})]})]})]})}));class bt extends n.Component{constructor(e){super(e),this.state={hasError:!1,error:null}}static getDerivedStateFromError(e){return{hasError:!0,error:e}}componentDidCatch(e,t){}render(){var e;return this.state.hasError?t.jsxs("div",{className:"p-4 bg-red-50 border border-red-200 rounded-md",children:[t.jsx("h2",{className:"text-red-800 font-medium",children:"Something went wrong"}),t.jsx("p",{className:"text-red-600 mt-1",children:null==(e=this.state.error)?void 0:e.message})]}):this.props.children}}const vt=n.memo((function(){const[r,s]=e.useState([]),[a,n]=e.useState(!0),[i,o]=e.useState(null),[l,c]=e.useState(!1),[d,u]=e.useState(null);e.useEffect((()=>{m()}),[]);const m=async()=>{try{n(!0);const e=await mt();s(e.addresses),o(null)}catch(e){o("Failed to load addresses. Please try again later.")}finally{n(!1)}},g=()=>{u(null),c(!0)},h=async(e,t)=>{try{await(async(e,t)=>{if("shipping"!==t&&"billing"!==t)throw new Error('Type must be either "shipping" or "billing"');const r=ct();if(!r)throw new Error("Authentication token not found.");try{const s=await ut();if(!(s.addresses&&Array.isArray(s.addresses)&&s.addresses.some((t=>t.id===e))))throw new Error(`Address with ID ${e} not found in customer's addresses.`);const a={...s};"shipping"===t?a.default_shipping=String(e):a.default_billing=String(e),a.addresses&&Array.isArray(a.addresses)&&(a.addresses=a.addresses.map((r=>{const s=r.id===e;let a=r.default_shipping,n=r.default_billing;return"shipping"===t?a=s:n=s,{...r,default_shipping:a,default_billing:n}})));const n=await fetch(`${lt}/customers/me`,{method:"PUT",headers:{...r,"Content-Type":"application/json"},body:JSON.stringify({customer:a})});return dt(n)}catch(i){throw i}})(e,t);const a=r.map((r=>({...r,default_billing:"billing"===t?r.id===e:r.default_billing,default_shipping:"shipping"===t?r.id===e:r.default_shipping})));s(a)}catch(a){o(`Failed to set default ${t} address. Please try again.`)}};return a?t.jsx("div",{className:"min-h-[300px] flex items-center justify-center",children:t.jsx("div",{className:"animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"})}):t.jsxs("div",{className:"bg-white p-6 rounded-lg shadow-sm",children:[t.jsxs("div",{className:"flex justify-between items-center mb-6",children:[t.jsx("h2",{className:"text-2xl font-medium text-gray-800",children:"Address Book"}),t.jsx("button",{onClick:g,className:"bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md transition duration-150 ease-in-out",children:"Add New Address"})]}),i&&t.jsx("div",{className:"bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4",children:i}),l?t.jsx(bt,{children:t.jsx(ft,{initialData:d,onSuccess:()=>{c(!1),m()},onCancel:()=>{c(!1),u(null)}})}):t.jsx(t.Fragment,{children:0===r.length?t.jsxs("div",{className:"text-center py-8 text-gray-500",children:[t.jsx("p",{children:"You have no saved addresses."}),t.jsx("button",{onClick:g,className:"mt-4 text-indigo-600 hover:text-indigo-800 underline",children:"Add your first address"})]}):t.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-6",children:r.map((e=>{var a;return t.jsx("div",{className:"border rounded-lg p-4 relative",children:t.jsxs("div",{className:"flex flex-col",children:[t.jsxs("div",{className:"flex justify-between items-start mb-2",children:[t.jsxs("h3",{className:"font-medium text-lg",children:[e.firstname," ",e.lastname]}),t.jsxs("div",{className:"flex space-x-2",children:[t.jsx("button",{onClick:()=>(e=>{u(e),c(!0)})(e),className:"text-sm text-gray-600 hover:text-indigo-600",children:"Edit"}),t.jsx("button",{onClick:()=>(async e=>{if(window.confirm("Are you sure you want to delete this address?"))try{if(!e)throw new Error("Invalid address ID");await yt(e),s(r.filter((t=>t.id!==e)))}catch(t){o("Failed to delete address. Please try again.")}})(e.id),className:"text-sm text-gray-600 hover:text-red-600",children:"Delete"})]})]}),t.jsxs("div",{className:"text-gray-600 mb-4",children:[t.jsx("p",{children:Array.isArray(e.street)?e.street.join(", "):e.street}),t.jsxs("p",{children:[e.city,", ",(null==(a=e.region)?void 0:a.region)||e.region," ",e.postcode]}),t.jsx("p",{children:e.country_id}),t.jsxs("p",{children:["T: ",e.telephone]})]}),t.jsxs("div",{className:"flex flex-wrap gap-2 mt-auto",children:[e.default_shipping&&t.jsx("span",{className:"bg-green-100 text-green-800 text-xs px-2 py-1 rounded",children:"Default Shipping"}),e.default_billing&&t.jsx("span",{className:"bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded",children:"Default Billing"})]}),t.jsxs("div",{className:"flex flex-wrap gap-2 mt-3",children:[!e.default_shipping&&t.jsx("button",{onClick:()=>h(e.id,"shipping"),className:"text-xs text-gray-600 hover:text-indigo-600 underline",children:"Use as shipping address"}),!e.default_billing&&t.jsx("button",{onClick:()=>h(e.id,"billing"),className:"text-xs text-gray-600 hover:text-indigo-600 underline",children:"Use as billing address"})]})]})},e.id)}))})})]})}));const wt=n.memo((function(){const{currentUser:r,loading:s,error:a,updateName:n,updateEmail:i,updatePassword:o}=Le(),[l,c]=e.useState(!1),[d,x]=e.useState(!1),[f,b]=e.useState(!1),[v,w]=e.useState(""),[_,j]=e.useState(""),[N,k]=e.useState(""),[S,P]=e.useState(""),[C,$]=e.useState(""),[I,q]=e.useState(""),[A,E]=e.useState({loading:!1,error:null,success:!1}),[T,F]=e.useState({loading:!1,error:null,success:!1}),[D,O]=e.useState({loading:!1,error:null,success:!1});return e.useEffect((()=>{r&&(w(r.firstname||""),j(r.lastname||""),k(r.email||""))}),[r]),s&&!r?t.jsx("div",{className:"min-h-screen bg-gray-50 flex items-center justify-center",children:t.jsx("div",{className:"animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"})}):a&&!r?t.jsx("div",{className:"min-h-screen bg-gray-50 flex items-center justify-center",children:t.jsxs("div",{className:"bg-white p-8 rounded-xl shadow-md max-w-md w-full",children:[t.jsxs("div",{className:"flex items-center text-red-500 mb-4",children:[t.jsx(u,{size:24,className:"mr-2"}),t.jsx("h2",{className:"text-xl font-bold",children:"Error Loading Profile"})]}),t.jsx("p",{className:"text-gray-700",children:a}),t.jsx("button",{onClick:()=>window.location.reload(),className:"mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600",children:"Retry"})]})}):t.jsx("div",{className:"min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8",children:t.jsxs("div",{className:"max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden",children:[t.jsxs("div",{className:"bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-8 text-white",children:[t.jsx("h1",{className:"text-3xl font-bold",children:"My Account"}),t.jsx("p",{className:"mt-2 text-blue-100",children:"Manage your personal information and account settings"})]}),t.jsx("div",{className:"p-6",children:t.jsxs("div",{className:"space-y-6",children:[t.jsxs("div",{className:"bg-gray-50 p-4 rounded-lg",children:[t.jsxs("div",{className:"flex items-center justify-between",children:[t.jsxs("div",{className:"flex items-center space-x-3",children:[t.jsx(m,{className:"text-blue-500"}),t.jsx("span",{className:"font-medium text-gray-700",children:"Full Name"})]}),l?null:t.jsxs("button",{onClick:()=>c(!0),className:"text-blue-500 hover:text-blue-700 flex items-center space-x-1",children:[t.jsx(g,{size:16}),t.jsx("span",{children:"Edit"})]})]}),l?t.jsxs("div",{className:"mt-2 ml-8 space-y-2",children:[t.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[t.jsxs("div",{children:[t.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"First Name"}),t.jsx("input",{type:"text",value:v,onChange:e=>w(e.target.value),className:"border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"})]}),t.jsxs("div",{children:[t.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Last Name"}),t.jsx("input",{type:"text",value:_,onChange:e=>j(e.target.value),className:"border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"})]})]}),A.error&&t.jsx("p",{className:"text-red-500 text-sm",children:A.error}),t.jsxs("div",{className:"flex items-center space-x-2",children:[t.jsxs("button",{onClick:async()=>{if(v.trim()&&_.trim()){E({loading:!0,error:null,success:!1});try{const e=await n({firstname:v.trim(),lastname:_.trim(),email:r.email});e.success?(E({loading:!1,error:null,success:!0}),c(!1),setTimeout((()=>{E((e=>({...e,success:!1})))}),3e3)):E({loading:!1,error:e.error||"Failed to update name",success:!1})}catch(e){E({loading:!1,error:e.message||"Failed to update name",success:!1})}}else E({loading:!1,error:"First name and last name cannot be empty",success:!1})},disabled:A.loading,className:"bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600 flex items-center space-x-1 "+(A.loading?"opacity-70 cursor-not-allowed":""),children:[A.loading?t.jsx("span",{className:"inline-block h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin mr-1"}):t.jsx(h,{size:16}),t.jsx("span",{children:"Save"})]}),t.jsx("button",{onClick:()=>{c(!1),w((null==r?void 0:r.firstname)||""),j((null==r?void 0:r.lastname)||""),E({loading:!1,error:null,success:!1})},className:"bg-gray-300 text-gray-700 px-3 py-2 rounded-md hover:bg-gray-400",disabled:A.loading,children:"Cancel"})]})]}):t.jsxs("div",{className:"mt-2 ml-8",children:[t.jsx("p",{className:"text-gray-800",children:r?`${r.firstname||""} ${r.lastname||""}`.trim():""}),A.success&&t.jsx("p",{className:"text-green-500 text-sm mt-1",children:"Name updated successfully!"})]})]}),t.jsxs("div",{className:"bg-gray-50 p-4 rounded-lg",children:[t.jsxs("div",{className:"flex items-center justify-between",children:[t.jsxs("div",{className:"flex items-center space-x-3",children:[t.jsx(p,{className:"text-blue-500"}),t.jsx("span",{className:"font-medium text-gray-700",children:"Email Address"})]}),d?null:t.jsxs("button",{onClick:()=>x(!0),className:"text-blue-500 hover:text-blue-700 flex items-center space-x-1",children:[t.jsx(g,{size:16}),t.jsx("span",{children:"Edit"})]})]}),d?t.jsxs("div",{className:"mt-2 ml-8 space-y-2",children:[t.jsx("input",{type:"email",value:N,onChange:e=>k(e.target.value),className:"border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"}),T.error&&t.jsx("p",{className:"text-red-500 text-sm",children:T.error}),t.jsxs("div",{className:"flex items-center space-x-2",children:[t.jsxs("button",{onClick:async()=>{if(N.trim()&&/\S+@\S+\.\S+/.test(N)){F({loading:!0,error:null,success:!1});try{const e=await i(N.trim(),r.firstname,r.lastname);e.success?(F({loading:!1,error:null,success:!0}),x(!1),setTimeout((()=>{F((e=>({...e,success:!1})))}),3e3)):F({loading:!1,error:e.error||"Failed to update email",success:!1})}catch(e){F({loading:!1,error:e.message||"Failed to update email",success:!1})}}else F({loading:!1,error:"Please enter a valid email",success:!1})},disabled:T.loading,className:"bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600 flex items-center space-x-1 "+(T.loading?"opacity-70 cursor-not-allowed":""),children:[T.loading?t.jsx("span",{className:"inline-block h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin mr-1"}):t.jsx(h,{size:16}),t.jsx("span",{children:"Save"})]}),t.jsx("button",{onClick:()=>{x(!1),k(null==r?void 0:r.email),F({loading:!1,error:null,success:!1})},className:"bg-gray-300 text-gray-700 px-3 py-2 rounded-md hover:bg-gray-400",disabled:T.loading,children:"Cancel"})]})]}):t.jsxs("div",{className:"mt-2 ml-8",children:[t.jsx("p",{className:"text-gray-800",children:null==r?void 0:r.email}),T.success&&t.jsx("p",{className:"text-green-500 text-sm mt-1",children:"Email updated successfully!"})]})]}),t.jsxs("div",{className:"bg-gray-50 p-4 rounded-lg",children:[t.jsxs("div",{className:"flex items-center justify-between",children:[t.jsxs("div",{className:"flex items-center space-x-3",children:[t.jsx(y,{className:"text-blue-500"}),t.jsx("span",{className:"font-medium text-gray-700",children:"Password"})]}),f?null:t.jsxs("button",{onClick:()=>b(!0),className:"text-blue-500 hover:text-blue-700 flex items-center space-x-1",children:[t.jsx(g,{size:16}),t.jsx("span",{children:"Change"})]})]}),f?t.jsxs("form",{onSubmit:async e=>{if(e.preventDefault(),C===I)if(C.length<8)O({loading:!1,error:"Password must be at least 8 characters",success:!1});else{O({loading:!0,error:null,success:!1});try{const e=await o(S,C);e.success?(O({loading:!1,error:null,success:!0}),setTimeout((()=>{b(!1),P(""),$(""),q(""),O((e=>({...e,success:!1})))}),3e3)):O({loading:!1,error:e.error,success:!1})}catch(t){O({loading:!1,error:t.message,success:!1})}}else O({loading:!1,error:"Passwords don't match",success:!1})},className:"mt-2 ml-8 space-y-3",children:[t.jsxs("div",{children:[t.jsx("label",{className:"block text-sm font-medium text-gray-700",children:"Current Password"}),t.jsx("input",{type:"password",value:S,onChange:e=>P(e.target.value),className:"mt-1 border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500",required:!0})]}),t.jsxs("div",{children:[t.jsx("label",{className:"block text-sm font-medium text-gray-700",children:"New Password"}),t.jsx("input",{type:"password",value:C,onChange:e=>$(e.target.value),className:"mt-1 border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500",required:!0})]}),t.jsxs("div",{children:[t.jsx("label",{className:"block text-sm font-medium text-gray-700",children:"Confirm New Password"}),t.jsx("input",{type:"password",value:I,onChange:e=>q(e.target.value),className:"mt-1 border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500",required:!0})]}),D.error&&t.jsx("p",{className:"text-red-500 text-sm",children:D.error}),t.jsxs("div",{className:"flex space-x-2",children:[t.jsxs("button",{type:"submit",disabled:D.loading,className:"bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center space-x-1 "+(D.loading?"opacity-70 cursor-not-allowed":""),children:[D.loading?t.jsx("span",{className:"inline-block h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin mr-1"}):null,t.jsx("span",{children:"Update Password"})]}),t.jsx("button",{type:"button",onClick:()=>{b(!1),P(""),$(""),q(""),O({loading:!1,error:null,success:!1})},className:"bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400",disabled:D.loading,children:"Cancel"})]})]}):t.jsxs("div",{className:"mt-2 ml-8",children:[t.jsx("p",{className:"text-gray-800",children:"••••••••"}),D.success&&t.jsx("p",{className:"text-green-500 text-sm mt-1",children:"Password updated successfully!"})]})]})]})})]})})}));function _t(){const[r,s]=e.useState(""),[a,n]=e.useState(!1),[i,o]=e.useState(""),[l,c]=e.useState("");return t.jsxs("div",{className:"max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl",children:[t.jsx("h2",{className:"text-2xl font-semibold text-center text-gray-800 mb-6",children:"Reset Your Password"}),t.jsxs("form",{onSubmit:async e=>{var t,a;if(e.preventDefault(),n(!0),o(""),c(""),!r)return c("Please enter your email address."),void n(!1);try{await Ne.requestPasswordReset(r),o("If an account exists for this email, a password reset link has been sent. Please check your inbox (and spam folder)."),s("")}catch(i){(null==(a=null==(t=i.response)?void 0:t.data)?void 0:a.message)||i.message,c("This email does not exist. Please check and try again.")}finally{n(!1)}},children:[t.jsxs("div",{className:"mb-4",children:[t.jsx("label",{htmlFor:"email",className:"block text-sm font-medium text-gray-700 mb-1",children:"Email Address"}),t.jsx("input",{type:"email",id:"email",name:"email",value:r,onChange:e=>s(e.target.value),placeholder:"you@example.com",required:!0,className:"mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"})]}),i&&t.jsx("div",{className:"mb-4 p-3 text-sm text-green-700 bg-green-100 border border-green-400 rounded-md",children:i}),l&&t.jsx("div",{className:"mb-4 p-3 text-sm text-red-700 bg-red-100 border border-red-400 rounded-md",children:l}),t.jsx("div",{className:"mt-6",children:t.jsx("button",{type:"submit",disabled:a,className:"w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300",children:a?t.jsx(tt,{className:"h-5 w-5 text-white"}):"Send Password Reset Link"})})]})]})}const jt=e.lazy((()=>E((()=>import("./HomePage-B2BA1fON.js")),__vite__mapDeps([0,1,2,3,4,5,6,7,8])))),Nt=e.lazy((()=>E((()=>import("./Login-CQHOWs1y.js")),__vite__mapDeps([9,1,3,8])))),kt=e.lazy((()=>E((()=>import("./AccountPage-BxHp1zaC.js")),__vite__mapDeps([10,1,3,8])))),St=e.lazy((()=>E((()=>import("./ProductDetailPage-D25hUUtW.js")),__vite__mapDeps([11,1,7,12,13,6,3,5,8])))),Pt=e.lazy((()=>E((()=>import("./FeaturedProducts-vca_8CJD.js")),__vite__mapDeps([14,1,7,12,3,8])))),Ct=e.lazy((()=>E((()=>import("./CategoryPage-DucB-MTb.js")),__vite__mapDeps([15,1,7,16,4,5,6,3,8])))),$t=e.lazy((()=>E((()=>import("./Cart-Du_DMd6V.js")),__vite__mapDeps([17,1,3,8])))),It=e.lazy((()=>E((()=>import("./Checkout-x57pERyM.js")),__vite__mapDeps([18,1,3,8])))),qt=e.lazy((()=>E((()=>import("./SearchResults-We6yQnwK.js")),__vite__mapDeps([19,1,7,16,4,5,6,3,12,20,8])))),At=e.lazy((()=>E((()=>import("./WishlistPage-Bq8A7ljR.js")),__vite__mapDeps([21,1,20,3,13,6,8])))),Et=e.lazy((()=>E((()=>import("./Page404-BE9CU5z3.js")),__vite__mapDeps([22,1,3])))),Tt=e.lazy((()=>E((()=>import("./Faqs-DvzgyGdu.js")),__vite__mapDeps([23,1,2])))),Ft=e.lazy((()=>E((()=>import("./ShippingReturns-ClrvtHSg.js")),__vite__mapDeps([24,1])))),Dt=e.lazy((()=>E((()=>import("./PrivacyPolicyPage-BZr7XrLj.js")),__vite__mapDeps([25,1])))),Ot=e.lazy((()=>E((()=>import("./ContactPage-CCbtxFaY.js")),__vite__mapDeps([26,1])))),zt=()=>t.jsx("div",{className:"p-6 text-lg",children:"Reviews Page"}),Rt=({children:e})=>{const r=k();return ke()?e:t.jsx(I,{to:"/login",state:{from:r},replace:!0})};function Ut(){return t.jsx(t.Fragment,{children:t.jsx(e.Suspense,{fallback:t.jsx("div",{className:"flex justify-center items-center h-screen",children:t.jsx(tt,{})}),children:t.jsxs(C,{children:[t.jsx($,{path:"/",element:t.jsx(jt,{})}),t.jsx($,{path:"/login",element:t.jsx(Nt,{})}),t.jsx($,{path:"resetpassword",element:t.jsx(_t,{})}),t.jsx($,{path:"/categorypage",element:t.jsx(Pt,{})}),t.jsx($,{path:"/category/:slug",element:t.jsx(Ct,{})}),t.jsx($,{path:"/product/:urlKey",element:t.jsx(St,{})}),t.jsx($,{path:"/cart",element:t.jsx($t,{})}),t.jsx($,{path:"/checkout",element:t.jsx(It,{})}),t.jsx($,{path:"/search",element:t.jsx(qt,{})}),t.jsx($,{path:"/faq",element:t.jsx(Tt,{})}),t.jsx($,{path:"/shipping-returns",element:t.jsx(Ft,{})}),t.jsx($,{path:"/contact",element:t.jsx(Ot,{})}),t.jsx($,{path:"/privacy-policy",element:t.jsx(Dt,{})}),t.jsxs($,{path:"/account",element:t.jsx(Rt,{children:t.jsx(kt,{})}),children:[t.jsx($,{index:!0,element:t.jsx(nt,{})}),t.jsxs($,{path:"orders",children:[t.jsx($,{index:!0,element:t.jsx(it,{})}),t.jsx($,{path:":orderId",element:t.jsx(ot,{})})]}),t.jsx($,{path:"addresses",element:t.jsx(vt,{})}),t.jsx($,{path:"edit",element:t.jsx(wt,{})}),t.jsx($,{path:"reviews",element:t.jsx(zt,{})})]}),t.jsx($,{path:"/wishlist",element:t.jsx(Rt,{children:t.jsx(At,{})})}),t.jsx($,{path:"*",element:t.jsx(Et,{})})]})})})}const Lt=e=>`all-products-${JSON.stringify(e||{})}`,Bt=e=>`product-${e}`,Gt=e=>`product-sku-${e}`,Mt=e=>`product-url-${e}`,Wt=e=>`related-products-${e}`,Jt=e=>`cross-sell-${e}`,Kt=e=>`up-sell-${e}`,Vt=e=>`product-reviews-${e}`,Ht=e=>`product-attributes-${e}`,Yt=(e,t)=>`products-category-${e}-${JSON.stringify(t||{})}`,Qt=e=>`product-filters-${e}`,Zt=e=>`product-stock-${e}`,Xt="global-product-aggregations",er={PRODUCT_LIST:3e5,PRODUCT_DETAIL:6e5,PRODUCT_ATTRIBUTES:18e5,PRODUCT_REVIEWS:3e5,PRODUCT_STOCK:12e4,GLOBAL_PRODUCT_AGGREGATIONS:18e5},tr=(e,t,r="PRODUCT_LIST")=>O(e,t,{cacheTime:er[r]}),rr=_`
  fragment ProductBasicFields on ProductInterface {
    id
    sku
    name
    url_key
    type_id # Added to identify product type
    __typename # Added to get GraphQL object type
    price_range {
      minimum_price {
        regular_price {
          value
          currency
        }
        final_price {
          value
          currency
        }
        discount {
          amount_off
          percent_off
        }
      }
    }
    small_image {
      url
      label
    }
  }
`,sr=_`
  fragment ProductDetailFields on ProductInterface {
    ...ProductBasicFields
    description {
      html
    }
    short_description {
      html
    }
    meta_title
    meta_keyword
    meta_description
    media_gallery {
      url
      label
      position
    }
    categories {
      id
      name
      url_key
      url_path
    }
    stock_status
    only_x_left_in_stock
    rating_summary
    review_count
    special_price
    special_from_date
    special_to_date

    ... on ConfigurableProduct {
      configurable_options {
        id
        attribute_id
        label
        position
        use_default
        attribute_code
        values {
          value_index
          label
          swatch_data {
            # type field removed as it's not standard on SwatchDataInterface directly
            value # e.g., hex color, image path
            # thumbnail # Optionally query for thumbnail if your swatches use it
          }
        }
      }
      variants {
        product {
          id
          sku
          name # Add name for variant display
          stock_status # Add stock_status for variant
          price_range {
            # Add price for variant
            minimum_price {
              final_price {
                value
                currency
              }
              regular_price {
                value
                currency
              }
            }
          }
          small_image {
            url
            label
          }
          # Potentially more fields if needed for variant selection logic
        }
        attributes {
          code
          value_index
          label # Add label for variant attribute
        }
      }
    }

    ... on BundleProduct {
      items {
        option_id
        title
        required
        type
        position
        sku
        options {
          id
          quantity
          position
          is_default
          price
          price_type
          can_change_quantity
          label # Product name for the option
          product {
            id
            sku
            name
            stock_status
            price_range {
              minimum_price {
                final_price {
                  value
                  currency
                }
              }
            }
            small_image {
              url
              label
            }
          }
        }
      }
    }

    ... on DownloadableProduct {
      downloadable_product_links {
        id
        title
        price
        number_of_downloads
        is_shareable
        #link_file # Corrected from link_url, this is typically the relative path to the file
        sample_type # Added to know if sample is a URL or file
        sample_file # Path to sample file
        sample_url # URL for sample if it's an external link
        sort_order
      }
      downloadable_product_samples {
        id
        title
        sample_type # Added to know if sample is a URL or file
        sample_file # Path to sample file
        sample_url # URL for sample if it's an external link
        sort_order
      }
      links_purchased_separately
    }
    ... on GroupedProduct {
      items {
        product {
          id
          sku
          name
          type_id # Good to have for completeness
          stock_status
          url_key # For linking to the simple product page
          price_range {
            # Price of the individual simple product
            minimum_price {
              final_price {
                value
                currency
              }
              regular_price {
                value
                currency
              }
            }
          }
          small_image {
            url
            label
          }
          # ...ProductBasicFields # Alternatively, spread basic fields if all are needed
        }
        qty # This is default_quantity for the grouped product item
        position
      }
    }
  }
  ${rr}
`,ar={getProducts:async(e={})=>tr(Lt(e),(async()=>{try{const{pageSize:t=20,currentPage:r=1,filterGroups:s=[],searchTerm:a}=e,n=e.sortField||(a?"relevance":"position"),i=e.sortDirection||(a?"DESC":"ASC"),o={};Array.isArray(s)&&s.forEach((e=>{e&&Array.isArray(e.filters)&&e.filters.forEach((e=>{const{field:t,value:r,condition_type:s,from:a,to:n}=e;if("price"===t&&(a||n))o.price||(o.price={}),a&&(o.price.from=String(a)),n&&(o.price.to=String(n));else switch(o[t]||(o[t]={}),s){case"eq":default:o[t].eq=r;break;case"neq":o[t].neq=r;break;case"like":o[t].match=r;break;case"in":o[t].in=Array.isArray(r)?r:[r];break;case"nin":o[t].nin=Array.isArray(r)?r:[r];break;case"gt":o[t].gt=r;break;case"lt":o[t].lt=r;break;case"gteq":o[t].gteq=r;break;case"lteq":o[t].lteq=r}}))}));const l={};l[n]=i.toUpperCase();const{data:c}=await z.query({query:_`
            query GetProducts(
              $filter: ProductAttributeFilterInput
              $search: String # Add search term variable
              $pageSize: Int!
              $currentPage: Int!
              $sort: ProductAttributeSortInput
            ) {
              products(
                filter: $filter
                search: $search # Add search term to query
                pageSize: $pageSize
                currentPage: $currentPage
                sort: $sort
              ) {
                total_count
                items {
                  ...ProductBasicFields
                  id
                  name
                  sku
                  url_key
                  stock_status
                  price_range {
                    minimum_price {
                      regular_price {
                        value
                        currency
                      }
                      final_price {
                        value
                        currency
                      }
                      discount {
                        amount_off
                        percent_off
                      }
                    }
                  }
                  small_image {
                    url
                    label
                  }
                }
                page_info {
                  page_size
                  current_page
                  total_pages
                }
              }
            }
            ${rr}
          `,variables:{filter:o,search:a,pageSize:t,currentPage:r,sort:l},fetchPolicy:"cache-first"});return{items:c.products.items||[],total_count:c.products.total_count||0,page_info:{page_size:e.pageSize,current_page:e.currentPage,total_pages:Math.ceil(c.products.total_count/e.pageSize)}}}catch(t){return{items:[],total_count:0,search_criteria:e,page_info:{page_size:e.pageSize||20,current_page:e.currentPage||1,total_pages:0}}}}),"PRODUCT_LIST"),getProductById:async e=>tr(Bt(e),(async()=>{try{const{data:t}=await z.query({query:_`
            query GetProductById($id: Int!) {
              products(filter: { id: { eq: $id } }) {
                items {
                  ...ProductDetailFields
                }
              }
            }
            ${sr}
          `,variables:{id:parseInt(e,10)},fetchPolicy:"cache-first"});if(!t.products.items.length)throw new Error(`Product with ID ${e} not found`);return t.products.items[0]}catch(t){throw t}}),"PRODUCT_DETAIL"),getProductBySku:async e=>tr(Gt(e),(async()=>{try{const{data:t}=await z.query({query:_`
            query GetProductBySku($sku: String!) {
              products(filter: { sku: { eq: $sku } }) {
                items {
                  ...ProductDetailFields
                }
              }
            }
            ${sr}
          `,variables:{sku:e},fetchPolicy:"cache-first"});if(!t.products.items.length)throw new Error(`Product with SKU ${e} not found`);return t.products.items[0]}catch(t){throw t}}),"PRODUCT_DETAIL"),getProductByUrlKey:async e=>tr(Mt(e),(async()=>{try{const{data:t}=await z.query({query:_`
            query GetProductByUrlKey($urlKey: String!) {
              products(filter: { url_key: { eq: $urlKey } }) {
                items {
                  ...ProductDetailFields
                  id
                  name
                  sku
                  url_key
                  type_id
                  __typename
                  stock_status
                  description {
                    html
                  }
                  short_description {
                    html
                  }
                  meta_title
                  meta_keyword
                  meta_description

                  price_range {
                    minimum_price {
                      regular_price {
                        value
                        currency
                      }
                      final_price {
                        value
                        currency
                      }
                      discount {
                        amount_off
                        percent_off
                      }
                    }
                  }
                  media_gallery {
                    url
                    label
                  }

                  ... on ConfigurableProduct {
                    configurable_options {
                      attribute_code
                      values {
                        uid
                        value_index
                        label
                      }
                    }
                    variants {
                      attributes {
                        code
                        value_index
                      }
                      product {
                        id
                        name
                        sku
                        stock_status
                        price_range {
                          minimum_price {
                            regular_price {
                              value
                              currency
                            }
                            final_price {
                              value
                              currency
                            }
                            discount {
                              amount_off
                              percent_off
                            }
                          }
                        }
                      }
                    }
                  }

                  ... on DownloadableProduct {
                    downloadable_product_links {
                      id
                      title
                      price
                      sort_order
                    }
                  }

                  ... on GroupedProduct {
                    items {
                      position
                      qty
                      product {
                        id
                        name
                        sku
                        stock_status
                        price_range {
                          minimum_price {
                            regular_price {
                              value
                              currency
                            }
                            final_price {
                              value
                              currency
                            }
                            discount {
                              amount_off
                              percent_off
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
            ${sr}
          `,variables:{urlKey:e},fetchPolicy:"cache-first"});if(!t.products.items.length)throw new Error(`Product with URL key ${e} not found`);return t.products.items[0]}catch(t){throw t}}),"PRODUCT_DETAIL"),searchProducts:async(e,t={})=>{const{pageSize:r=20,currentPage:s=1,sortField:a="relevance",sortDirection:n="DESC",filterGroups:i=[]}=t,o=`search_products_term-${e}_page-${s}_size-${r}_sort-${a}-${n.toUpperCase()}_filters-${JSON.stringify(i)}`;return tr(o,(async()=>{try{const t={};t[a]=n.toUpperCase();const o={};Array.isArray(i)&&i.forEach((e=>{e&&Array.isArray(e.filters)&&e.filters.forEach((e=>{const{field:t,value:r,condition_type:s,from:a,to:n}=e;if("price"===t&&(a||n))o.price||(o.price={}),a&&(o.price.from=String(a)),n&&(o.price.to=String(n));else switch(o[t]||(o[t]={}),s){case"eq":default:o[t].eq=r;break;case"neq":o[t].neq=r;break;case"like":o[t].match=r;break;case"in":o[t].in=Array.isArray(r)?r:[r];break;case"nin":o[t].nin=Array.isArray(r)?r:[r];break;case"gt":o[t].gt=r;break;case"lt":o[t].lt=r;break;case"gteq":o[t].gteq=r;break;case"lteq":o[t].lteq=r}}))}));const{data:l}=await z.query({query:_`
            query SearchProducts(
              $searchTerm: String!
              $pageSize: Int!
              $currentPage: Int!
              $sort: ProductAttributeSortInput
              $filter: ProductAttributeFilterInput # Add filter variable
            ) {
              products(
                search: $searchTerm
                pageSize: $pageSize
                currentPage: $currentPage
                sort: $sort
                filter: $filter # Use filter in the query
              ) {
                total_count
                items {
                  ...ProductBasicFields
                  id
                  sku
                  name
                  url_key
                  stock_status
                  price_range {
                    minimum_price {
                      regular_price {
                        value
                        currency
                      }
                      final_price {
                        value
                        currency
                      }
                      discount {
                        amount_off
                        percent_off
                      }
                    }
                  }
                  small_image {
                    url
                    label
                  }
                }
                page_info {
                  page_size
                  current_page
                  total_pages
                }
              }
            }
            ${rr}
          `,variables:{searchTerm:e,pageSize:r,currentPage:s,sort:t,filter:o},fetchPolicy:"cache-first"});return{items:l.products.items||[],total_count:l.products.total_count||0,search_criteria:{search_term:e,page_size:r,current_page:s,sort_orders:[{field:a,direction:n}],filter_groups:i},page_info:l.products.page_info||{page_size:r,current_page:s,total_pages:Math.ceil((l.products.total_count||0)/r)}}}catch(t){return{items:[],total_count:0,search_criteria:{search_term:e,page_size:r,current_page:s,sort_orders:[{field:a,direction:n.toUpperCase()}],filter_groups:i},page_info:{page_size:r,current_page:s,total_pages:0}}}}),"PRODUCT_LIST")},getRelatedProducts:async e=>tr(Wt(e),(async()=>{try{const{data:t}=await z.query({query:_`
            query GetRelatedProducts($sku: String!) {
              products(filter: { sku: { eq: $sku } }) {
                items {
                  related_products {
                    ...ProductBasicFields
                  }
                }
              }
            }
            ${rr}
          `,variables:{sku:e},fetchPolicy:"cache-first"});return t.products.items.length&&t.products.items[0].related_products||[]}catch(t){return[]}}),"PRODUCT_LIST"),getCrossSellProducts:async e=>tr(Jt(e),(async()=>{try{const{data:t}=await z.query({query:_`
            query GetCrossSellProducts($sku: String!) {
              products(filter: { sku: { eq: $sku } }) {
                items {
                  crosssell_products {
                    ...ProductBasicFields
                  }
                }
              }
            }
            ${rr}
          `,variables:{sku:e},fetchPolicy:"cache-first"});return t.products.items.length&&t.products.items[0].crosssell_products||[]}catch(t){return[]}}),"PRODUCT_LIST"),getUpSellProducts:async e=>tr(Kt(e),(async()=>{try{const{data:t}=await z.query({query:_`
            query GetUpSellProducts($sku: String!) {
              products(filter: { sku: { eq: $sku } }) {
                items {
                  upsell_products {
                    ...ProductBasicFields
                  }
                }
              }
            }
            ${rr}
          `,variables:{sku:e},fetchPolicy:"cache-first"});return t.products.items.length&&t.products.items[0].upsell_products||[]}catch(t){return[]}}),"PRODUCT_LIST"),getProductReviews:async e=>tr(Vt(e),(async()=>{var t;try{const{data:r}=await z.query({query:_`
            query GetProductReviews($sku: String!) {
              products(filter: { sku: { eq: $sku } }) {
                items {
                  reviews {
                    items {
                      nickname
                      summary
                      text
                      average_rating
                      created_at
                    }
                  }
                }
              }
            }
          `,variables:{sku:e},fetchPolicy:"cache-first"});return r.products.items.length&&(null==(t=r.products.items[0].reviews)?void 0:t.items)||[]}catch(r){return[]}}),"PRODUCT_REVIEWS"),submitProductReview:async(e,t)=>{try{const{data:r}=await z.mutate({mutation:_`
        mutation CreateProductReview(
          $sku: String!
          $nickname: String!
          $summary: String!
          $text: String!
          $ratings: [ProductReviewRatingInput!]!
        ) {
          createProductReview(
            input: {
              sku: $sku
              nickname: $nickname
              summary: $summary
              text: $text
              ratings: $ratings
            }
          ) {
            review {
              nickname
              summary
              text
              average_rating
              created_at
            }
          }
        }
      `,variables:{sku:e,nickname:t.nickname,summary:t.summary,text:t.text,ratings:t.ratings.map((e=>({id:e.id,value_id:e.value_id})))}});return r.createProductReview.review}catch(r){throw r}},getProductAttributes:async e=>tr(Ht(e),(async()=>{try{const{data:t}=await z.query({query:_`
            query GetProductAttributes($attributeCode: String!) {
              customAttributeMetadata(
                attributes: [
                  {
                    attribute_code: $attributeCode
                    entity_type: "catalog_product"
                  }
                ]
              ) {
                items {
                  attribute_code
                  attribute_type
                  entity_type
                  input_type
                  attribute_options {
                    value
                    label
                  }
                }
              }
            }
          `,variables:{attributeCode:e},fetchPolicy:"cache-first"});if(!t.customAttributeMetadata.items.length)throw new Error(`Attribute ${e} not found`);return t.customAttributeMetadata.items[0]}catch(t){throw t}}),"PRODUCT_ATTRIBUTES"),getProductsByCategory:async(e,t={})=>tr(Yt(e,t),(async()=>{try{const{pageSize:r=20,currentPage:s=1,sortField:a="position",sortDirection:n="ASC",filterGroups:i=[]}=t,o="string"==typeof n?n.toUpperCase():"ASC",l={};Array.isArray(i)&&i.forEach((e=>{e&&Array.isArray(e.filters)&&e.filters.forEach((e=>{if("category_id"!==e.field){const{field:t,value:r,condition_type:s,from:a,to:n}=e;if("price"===t&&(a||n))l.price||(l.price={}),a&&"*"!==a&&(l.price.from=String(a)),n&&"*"!==n&&(l.price.to=String(n));else switch(l[t]||(l[t]={}),s){case"eq":l[t].eq=r;break;case"neq":l[t].neq=r;break;case"like":l[t].match=r;break;case"in":l[t].in=Array.isArray(r)?r:[r];break;case"nin":l[t].nin=Array.isArray(r)?r:[r];break;case"gt":l[t].gt=r;break;case"lt":l[t].lt=r;break;case"gteq":l[t].gteq=r;break;case"lteq":l[t].lteq=r;break;default:void 0===s&&(l[t].eq=r)}}}))}));const c={};c[a]=o;const d={category_id:{eq:String(e)},...l},{data:u}=await z.query({query:_`
            query GetProductsByCategory(
              $filter: ProductAttributeFilterInput
              $pageSize: Int!
              $currentPage: Int!
              $sort: ProductAttributeSortInput
            ) {
              products(
                filter: $filter
                pageSize: $pageSize
                currentPage: $currentPage
                sort: $sort
              ) {
                total_count
                items {
                  ...ProductBasicFields
                  stock_status
                  id
                  sku
                  name
                  url_key

                  price_range {
                    minimum_price {
                      regular_price {
                        value
                        currency
                      }
                      final_price {
                        value
                        currency
                      }
                      discount {
                        amount_off
                        percent_off
                      }
                    }
                  }
                  small_image {
                    url
                    label
                  }
                  rating_summary
                  review_count
                }
                page_info {
                  page_size
                  current_page
                  total_pages
                }
              }
            }
            ${rr}
          `,variables:{filter:d,pageSize:r,currentPage:s,sort:c},fetchPolicy:"cache-first"});return{items:u.products.items||[],total_count:u.products.total_count||0,search_criteria:{filter_groups:[{filters:[{field:"category_id",value:String(e),condition_type:"eq"}]},...i],page_size:r,current_page:s,sort_orders:[{field:a,direction:o}]},page_info:u.products.page_info||{page_size:r,current_page:s,total_pages:0}}}catch(r){return{items:[],total_count:0,search_criteria:{filter_groups:[{filters:[{field:"category_id",value:String(e),condition_type:"eq"}]}],page_size:t.pageSize||20,current_page:t.currentPage||1,sort_orders:[{field:t.sortField||"position",direction:(t.sortDirection||"ASC").toUpperCase()}]},page_info:{page_size:t.pageSize||20,current_page:t.currentPage||1,total_pages:0}}}}),"PRODUCT_LIST"),getProductFilters:async e=>tr(Qt(e),(async()=>{try{const{data:t}=await z.query({query:_`
            query GetProductFilters($categoryId: String!) {
              products(filter: { category_id: { eq: $categoryId } }) {
                aggregations {
                  attribute_code
                  count
                  label
                  options {
                    label
                    value
                    count
                  }
                }
              }
            }
          `,variables:{categoryId:String(e)},fetchPolicy:"cache-first"});return t.products.aggregations||[]}catch(t){return[]}}),"PRODUCT_FILTERS"),getGlobalProductAggregations:async()=>tr(Xt,(async()=>{try{const{data:e}=await z.query({query:_`
            query GetGlobalProductAggregations {
              products(filter: {}) {
                # Empty filter for global aggregations
                aggregations {
                  attribute_code
                  label
                  count # Total products for this aggregation
                  options {
                    label
                    value
                    count # Products matching this specific option
                  }
                }
              }
            }
          `,fetchPolicy:"cache-first"});return e.products&&e.products.aggregations?e.products.aggregations:[]}catch(e){throw e}}),"GLOBAL_PRODUCT_AGGREGATIONS"),getProductStockStatus:async e=>{const t=_`
    query GetProductStockStatus($sku: String!) {
      products(filter: { sku: { eq: $sku } }) {
        items {
          sku
          stock_status
          only_x_left_in_stock
          quantity_and_stock_status {
            quantity
            is_in_stock
          }
        }
      }
    }
  `;return tr(Zt(e),(async()=>{try{const{data:r}=await z.query({query:t,variables:{sku:e},fetchPolicy:"cache-first"}),s=r.products.items[0];if(!s)throw new Error(`Product with SKU ${e} not found`);return{sku:s.sku,is_in_stock:s.quantity_and_stock_status.is_in_stock,quantity:s.quantity_and_stock_status.quantity,stock_status:s.stock_status,only_x_left_in_stock:s.only_x_left_in_stock}}catch(r){throw r}}),"PRODUCT_STOCK")}},nr=e.createContext(),ir=()=>{const t=e.useContext(nr);if(!t)throw new Error("useProducts must be used within a ProductProvider");return t},or=({children:r})=>{const[s,a]=e.useState([]),[n,i]=e.useState([]),[o,l]=e.useState([]),[c,d]=e.useState([]),[u,m]=e.useState({}),[g,h]=e.useState({}),[p,y]=e.useState({}),[x,f]=e.useState({}),[b,v]=e.useState([]),[w,_]=e.useState(!0),[j,N]=e.useState(null),[k,S]=e.useState(null);e.useEffect((()=>{(async()=>{try{_(!0),S(new Date),N(null)}catch(e){N(e.message||"Failed to fetch initial product data")}finally{_(!1)}})()}),[]);const P=e.useCallback((async(e={})=>{const{searchTerm:t,...r}=e,n=[JSON.stringify(r)];t&&n.push(`searchTerm-${t}`);const i=n.join("-");if(_(!0),s[i])return _(!1),s[i];try{const t=await ar.getProducts(e);return a(t),t}catch(o){return N(o.message||"Failed to fetch products"),{items:[],total_count:0}}finally{_(!1)}}),[s,_,a,N]),C=e.useCallback((async e=>{if(g[`id-${e}`])return g[`id-${e}`];try{const t=await ar.getProductById(e);return h((r=>({...r,[`id-${e}`]:t}))),t}catch(t){throw t}}),[h]),$=e.useCallback((async e=>{if(g[`sku-${e}`])return g[`sku-${e}`];try{const t=await ar.getProductBySku(e);return h((r=>({...r,[`sku-${e}`]:t}))),t}catch(t){throw t}}),[h]),I=e.useCallback((async e=>{if(g[`url-${e}`])return g[`url-${e}`];try{const t=await ar.getProductByUrlKey(e);return h((r=>({...r,[`url-${e}`]:t}))),t}catch(t){throw t}}),[h]),q=e.useCallback((async(e={})=>{const{searchQuery:t,currentPage:r,pageSize:s,sortField:a,sortDirection:n,filterGroups:i,...o}=e,l=[`query-${t}`,`page-${r||1}`,`size-${s||20}`,`sort-${a||"relevance"}_${n||"DESC"}`];i&&i.length>0&&l.push(`filters-${JSON.stringify(i)}`);const c=l.join("-");if(_(!0),p[c])return _(!1),p[c];try{const e={currentPage:r,pageSize:s,sortField:a,sortDirection:n,filterGroups:i,...o},l=await ar.searchProducts(t,e);return y((e=>({...e,[c]:l}))),l}catch(d){return N(d.message||`Failed to search products for "${t}"`),{items:[],total_count:0}}finally{_(!1)}}),[p,_,y,N]),A=e.useCallback((async(e,t={})=>{const r=`${e}-${JSON.stringify(t)}`;if(_(!0),u[r])return _(!1),u[r];try{const s=await ar.getProductsByCategory(e,t);return m((e=>({...e,[r]:s}))),s}catch(s){return N(s.message||`Failed to fetch products for category ${e}`),{items:[],total_count:0}}finally{_(!1)}}),[u,_,m,N]),E=e.useCallback((async e=>{if(_(!0),x[e])return _(!1),x[e];try{const t=await ar.getProductFilters(e);return f((r=>({...r,[e]:t}))),t}catch(t){return N(t.message||`Failed to fetch filters for category ${e}`),[]}finally{_(!1)}}),[x,_,f,N]),T=e.useCallback((async()=>{if(b.length>0)return b;try{_(!0);const e=await ar.getGlobalProductAggregations();return v(e||[]),e||[]}catch(e){return N(e.message||"Failed to fetch global product aggregations"),[]}finally{_(!1)}}),[b,_,v,N]),F=e.useCallback((async()=>{try{_(!0);const e=await ar.getBestSellingProducts(10);return d(e.items||[]),a({}),h({}),m({}),y({}),f({}),v([]),S(new Date),N(null),!0}catch(e){return N(e.message||"Failed to refresh products"),!1}finally{_(!1)}}),[_,i,l,d,a,h,m,y,f,v,S,N]),D=e.useCallback((async e=>{try{return await ar.getRelatedProducts(e)}catch(t){return[]}}),[]),O=e.useCallback((async e=>{try{return await ar.getCrossSellProducts(e)}catch(t){return[]}}),[]),z=e.useCallback((async e=>{try{return await ar.getUpSellProducts(e)}catch(t){return[]}}),[]),R=e.useCallback((async e=>{try{return await ar.getProductReviews(e)}catch(t){return[]}}),[]),U=e.useCallback((async(e,t)=>{try{return await ar.submitProductReview(e,t)}catch(r){throw r}}),[]),L=e.useCallback((async e=>{try{return await ar.getProductStockStatus(e)}catch(t){throw t}}),[]),B=e.useMemo((()=>({featuredProducts:n,newProducts:o,bestSellingProducts:c,productFilters:x,globalProductAggregations:b,loading:w,error:j,lastFetched:k,getProducts:P,getProductById:C,getProductBySku:$,getProductByUrlKey:I,searchProducts:q,getProductsByCategory:A,getProductFilters:E,fetchGlobalProductAggregations:T,getRelatedProducts:D,getCrossSellProducts:O,getUpSellProducts:z,getProductReviews:R,submitProductReview:U,getProductStockStatus:L,refreshAllProducts:F})),[n,o,c,x,b,w,j,k,P,C,$,I,q,A,E,T,D,O,z,R,U,L,F]);return t.jsx(nr.Provider,{value:B,children:r})},lr=e.createContext(),cr=({children:r})=>{const[s,a]=e.useState([]),[n,i]=e.useState(!1),[o,l]=e.useState(null),c=e.useCallback((async()=>{i(!0),l(null);try{const e=await mt();a((null==e?void 0:e.addresses)||[])}catch(e){l(e.message||"Failed to fetch addresses"),a([])}finally{i(!1)}}),[]);e.useEffect((()=>{localStorage.getItem("authToken")?c():a([])}),[c]);return t.jsx(lr.Provider,{value:{addresses:s,loading:n,error:o,fetchAddresses:c,addAddress:async e=>{i(!0),l(null);try{const t=await ht(e);return a((e=>[...e,t])),t}catch(t){throw l(t.message||"Failed to add address"),t}finally{i(!1)}},updateAddress:async e=>{i(!0),l(null);try{const t=await pt(e);return a((e=>e.map((e=>e.id===t.id?t:e)))),t}catch(t){throw l(t.message||"Failed to update address"),t}finally{i(!1)}},deleteAddress:async e=>{i(!0),l(null);try{await yt(e),a((t=>t.filter((t=>t.id!==e))))}catch(t){throw l(t.message||"Failed to delete address"),t}finally{i(!1)}}},children:r})},dr=()=>{const t=e.useContext(lr);if(void 0===t)throw new Error("useAddress must be used within an AddressProvider");return t};x.createRoot(document.getElementById("root")).render(t.jsxs(e.StrictMode,{children:[t.jsx(q,{children:t.jsx(Ue,{children:t.jsx(Qe,{children:t.jsx(Ke,{children:t.jsx(ie,{children:t.jsx(cr,{children:t.jsxs(or,{children:[t.jsx(Ze,{}),t.jsx(Ut,{}),t.jsx(Xe,{})]})})})})})})}),t.jsx(f,{})]}));export{Oe as A,ze as B,ir as C,Ue as D,Qe as E,le as L,Ke as W,E as _,Le as a,Ve as b,z as c,Je as d,tt as e,st as f,$e as g,V as h,ke as i,H as j,Y as k,Ce as l,Q as m,Z as n,X as o,ee as p,se as q,re as r,ae as s,te as t,oe as u,Ye as v,Ne as w,je as x,dr as y,xt as z};
//# sourceMappingURL=index-Vo_pZ44y.js.map
