export const SHAPES = [ [[1,1,1,1]], [[1,1],[1,1]], [[0,1,0],[1,1,1]], [[0,1,1],[1,1,0]], [[1,1,0],[0,1,1]], [[1,0,0],[1,1,1]], [[0,0,1],[1,1,1]] ];
export const COLORS = ['#36b9df','#f5c447','#a67be8','#58cba0','#f27c99','#688cec','#f5a35e'];
export function rotate(matrix){return matrix[0].map((_,x)=>matrix.map(row=>row[x]).reverse());}
export class Game {
 constructor(random=Math.random){this.random=random;this.reset();}
 reset(){this.board=Array.from({length:20},()=>Array(10).fill(0));this.score=0;this.lines=0;this.over=false;this.bag=[];this.next=this.pick();this.spawn();}
 get level(){return 1+Math.floor(this.lines/10);}
 pick(){if(!this.bag.length){this.bag=[0,1,2,3,4,5,6];for(let i=6;i>0;i--){const j=Math.floor(this.random()*(i+1));[this.bag[i],this.bag[j]]=[this.bag[j],this.bag[i]];}}const id=this.bag.pop();return {id,matrix:SHAPES[id].map(row=>[...row])};}
 spawn(){this.active=this.next;this.next=this.pick();this.x=Math.floor((10-this.active.matrix[0].length)/2);this.y=0;if(!this.valid(this.active.matrix,this.x,this.y))this.over=true;}
 valid(matrix,x,y){return matrix.every((row,dy)=>row.every((v,dx)=>!v||(x+dx>=0&&x+dx<10&&y+dy>=0&&y+dy<20&&!this.board[y+dy][x+dx])));}
 move(dx){if(!this.over&&this.valid(this.active.matrix,this.x+dx,this.y)){this.x+=dx;return true;}return false;}
 turn(){if(this.over)return;const matrix=rotate(this.active.matrix);for(const offset of [0,-1,1,-2,2])if(this.valid(matrix,this.x+offset,this.y)){this.active.matrix=matrix;this.x+=offset;return true;}return false;}
 ghostY(){let y=this.y;while(this.valid(this.active.matrix,this.x,y+1))y++;return y;}
 drop(soft=false){if(this.over)return false;if(this.valid(this.active.matrix,this.x,this.y+1)){this.y++;if(soft)this.score++;return true;}this.lock();return false;}
 hardDrop(){if(this.over)return;const y=this.ghostY();this.score+=(y-this.y)*2;this.y=y;this.lock();}
 lock(){this.active.matrix.forEach((row,dy)=>row.forEach((v,dx)=>{if(v)this.board[this.y+dy][this.x+dx]=this.active.id+1;}));const kept=this.board.filter(row=>row.some(v=>!v));const cleared=20-kept.length;this.score+=([0,100,300,500,800][cleared]||0)*this.level;this.lines+=cleared;this.board=[...Array.from({length:cleared},()=>Array(10).fill(0)),...kept];this.spawn();}
}
