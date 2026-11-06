import http from 'node:http';
import {readFile} from 'node:fs/promises';
const files = {'/':['index.html','text/html; charset=utf-8'],'/style.css':['style.css','text/css'],'/app.js':['app.js','text/javascript'],'/game.js':['game.js','text/javascript']};
http.createServer(async(req,res)=>{
 const entry=files[new URL(req.url,'http://localhost').pathname];
 if(!entry){res.writeHead(404);return res.end('Not found');}
 try {const data=await readFile(new URL(entry[0],import.meta.url));res.writeHead(200,{'Content-Type':entry[1]});res.end(data);}catch{res.writeHead(500);res.end('Server error');}
}).listen(Number(process.env.PORT)||3000,'0.0.0.0',()=>console.log('Tetris server ready'));
