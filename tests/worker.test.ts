import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {build} from 'esbuild';
import {Miniflare} from 'miniflare';
const origin='https://school.test';
const hash=(s:string)=>createHash('sha256').update(s).digest('hex');
const script=(await build({entryPoints:[new URL('../cloudflare/worker.ts',import.meta.url).pathname],bundle:true,write:false,format:'esm',platform:'browser'})).outputFiles[0].text;
test('school records stay private, owner links are one-use and logout revokes the session',async()=>{
 const mf=new Miniflare({modules:true,script,compatibilityDate:'2026-07-30',d1Databases:['DB']});try{
 const db=await mf.getD1Database('DB');
 for(const file of (await readdir(new URL('../migrations/',import.meta.url))).filter(x=>x.endsWith('.sql')).sort()){
  const sql=(await readFile(new URL('../migrations/'+file,import.meta.url),'utf8')).replace(/^--.*$/gm,'');
  for(const statement of sql.split(';').map(x=>x.trim()).filter(Boolean))await db.prepare(statement).run();
 }
 const request=(path:string,body?:any,cookie='',otherOrigin=origin)=>mf.dispatchFetch(origin+path,{method:body===undefined?'GET':'POST',headers:{Origin:otherOrigin,Cookie:cookie,'Content-Type':'application/json'},...(body===undefined?{}:{body:JSON.stringify(body)})});
 assert.equal((await db.prepare('SELECT COUNT(*) AS n FROM staff').first() as any).n,0);
 assert.equal((await db.prepare('SELECT COUNT(*) AS n FROM students').first() as any).n,0);
 assert.equal((await request('/api/students')).status,401);
 assert.equal((await request('/api/vlearning/student-sync',{name:'Forged Student'})).status,403);
 assert.equal((await request('/api/vlearning/marks-sync',{score:100})).status,403);
 assert.equal((await request('/api/online-learning')).status,401);
 const code='a'.repeat(64);await db.prepare('INSERT INTO school_access_codes(code_hash,expires) VALUES(?,?)').bind(hash(code),Date.now()+60000).run();
 assert.equal((await request('/api/auth/platform-login',{code},'','https://untrusted.test')).status,403);
 const login=await request('/api/auth/platform-login',{code});assert.equal(login.status,200);const cookie=login.headers.get('set-cookie')!.split(';')[0];
 const loginBody=await login.json() as any;assert.match(loginBody.token,/^[a-f0-9]{64}$/);
 const embedded=await mf.dispatchFetch(origin+'/api/online-learning',{headers:{Authorization:'Bearer '+loginBody.token}});assert.equal(embedded.status,200,'embedded school requests work without third-party cookies');
 assert.equal((await request('/api/auth/platform-login',{code})).status,401);
 const session=await request('/api/auth/session',undefined,cookie);assert.equal((await session.json() as any).teacher.role,'Headteacher');
 const records=await request('/api/online-learning',undefined,cookie);assert.equal(records.status,200);assert.equal((await records.json() as any).totals.students,0);
 assert.equal((await request('/api/students',{surname:'Forged'},cookie,'https://untrusted.test')).status,403);
 assert.equal((await request('/api/auth/logout',{},cookie)).status,200);
 assert.equal((await request('/api/online-learning',undefined,cookie)).status,401);
 }finally{await mf.dispose();}
});
