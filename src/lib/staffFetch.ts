// Keep the embedded school session in memory. Cookies are optional in an iframe.
let staffToken='';
export function setStaffToken(token:string){staffToken=/^[a-f0-9]{64}$/.test(token)?token:'';}
export function installStaffFetch(){
 const original=window.fetch.bind(window);
 window.fetch=(input:RequestInfo|URL,init?:RequestInit)=>{
  const target=new URL(input instanceof Request?input.url:String(input),window.location.href);
  if(staffToken&&target.origin===window.location.origin&&target.pathname.startsWith('/api/')){
   const headers=new Headers(init?.headers||(input instanceof Request?input.headers:undefined));headers.set('Authorization','Bearer '+staffToken);
   return original(input,{...init,headers});
  }
  return original(input,init);
 };
}
