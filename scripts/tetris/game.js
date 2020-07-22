"use strict";!function(){var a=document.getElementById("r_preview"),i=document.getElementById("u_preview"),s=document.getElementById("board"),o=document.getElementById("ghost"),d=document.getElementById("locked"),c=document.getElementById("r_score_num"),p=document.getElementById("u_score"),v=document.getElementById("r_level_num"),y=document.getElementById("u_level"),u=document.getElementById("r_lines_num"),h=document.getElementById("u_lines"),I=document.getElementById("high_scores"),n=document.getElementById("grid_container"),l=document.getElementById("start"),r=document.getElementById("pause_screen"),m=document.getElementById("stat_row_line_number"),g=document.getElementById("stat_row_line_piece"),f=(document.getElementById("temp_score"),document.getElementById("scores_msg"));function T(){for(var e=["I","O","S","Z","L","J","T"],t=0;t<7;t++){var a=Math.floor(7*Math.random()),i=e[a];e[a]=e[t],e[t]=i}return e}function x(e){var t={};return t.width="S"==e.type||"Z"==e.type||"L"==e.type||"J"==e.type||"T"==e.type?e.rotation%180?2:3:"O"==e.type?2:e.rotation%180?1:4,t.height="S"==e.type||"Z"==e.type||"L"==e.type||"J"==e.type||"T"==e.type?e.rotation%180?3:2:"O"==e.type?2:e.rotation%180?4:1,null!==e.x&&null!==e.y&&(t.x1=e.x,t.y1=e.y,t.x2=e.x+t.width,t.y2=e.y+t.height,t.area=[t.y1+1,t.x1+1,t.y2+1,t.x2+1].join(" / ")),t}function C(e,t){var a=document.createElement("div"),i=x({type:e,rotation:t});a.className="game_piece gp_type_"+e+" gp_rot_"+t,a.style.gridTemplateColumns="repeat("+i.width+", 1fr)",a.style.gridTemplateRows="repeat("+i.height+", 1fr)";for(var n=i.height*i.width;0<n;n--)a.appendChild(document.createElement("div"));return a}function _(e){for(var t=x(e),a=[],i=t.height-1;0<=i;i--)for(var n=t.width-1;0<=n;n--)"I"!=e.type&&"O"!=e.type&&("S"==e.type?e.rotation%180?1==n&&0==i||0==n&&2==i:0==n&&0==i||2==n&&1==i:"Z"==e.type?e.rotation%180?0==n&&0==i||1==n&&2==i:2==n&&0==i||0==n&&1==i:"L"==e.type?0==e.rotation?2!=n&&0==i:90==e.rotation?1==n&&2!=i:180==e.rotation?0!=n&&1==i:0==n&&0!=i:"J"==e.type?0==e.rotation?0!=n&&0==i:90==e.rotation?1==n&&0!=i:180==e.rotation?2!=n&&1==i:0==n&&2!=i:0==e.rotation?0==n&&0==i||2==n&&0==i:90==e.rotation?1==n&&0==i||1==n&&2==i:180==e.rotation?0==n&&1==i||2==n&&1==i:0==n&&0==i||0==n&&2==i)||a.push([n+t.x1,i+t.y1]);return a}function w(e,t,a){t=t||0,a=a||0;var i=x(e);if(i.x1+t<0||10<i.x2+t||18<i.y2+a)return 1;for(var n=_(e),l=n.length-1;0<=l;l--)if(game.grid[n[l][1]+a][n[l][0]+t])return 1}function E(){game.piece.type=game.piece.next.shift(),game.piece.next=game.piece.next.length?game.piece.next:T(),game.piece.landed=!1,game.piece.lockDelayed=!1,game.piece.lastRotated=!1;var e=x(game.piece);game.piece.x=Math.floor(5-e.width/2),game.piece.y=1,game.piece.rotation=0,game.piece.element=C(game.piece.type,game.piece.rotation),game.piece.ghost=C(game.piece.type,game.piece.rotation),game.piece.ghost.classList.add("flashing");var t=C(game.piece.next[0],0),e=x({type:game.piece.next[0],rotation:0});t.style.gridArea="1 / 1 / "+(e.height+1)+" / "+(e.width+1),i.textContent=a.textContent="",i.style.gridTemplateColumns=a.style.gridTemplateColumns=t.style.gridTemplateColumns,i.style.gridTemplateRows=a.style.gridTemplateRows=t.style.gridTemplateRows,a.parentNode.style.padding=1==e.height?"10% 0":"",i.parentNode.style.padding=1==e.height?"12.5% 0":"",a.style.width=20*e.width+"%",i.style.width=25*e.width+"%",i.appendChild(t),a.appendChild(t.cloneNode(!0)),game.piece.render(),clearInterval(game.gravityInterval),!game.paused&&game.started&&(game.gravityInterval=setInterval(game.gravitate,w(game.piece,0,1)?Math.max(game.speed,500):game.speed)),w(game.piece)&&game.end()}function b(e){return e.toString().replace(/(\d)(?=(...)+$)/g,"$1 ")}window.game=window.game||{piece:{type:null,x:null,y:null,next:null,rotation:null,element:null,ghost:null,landed:null,lockDelayed:null,lastRotated:null,rotate:function(e){if(!game.piece.landed)if("CLOCKWISE"==e){if(game.piece.rotation=(game.piece.rotation+90)%360,"I"==game.piece.type){var t={0:[-1,1],90:[2,-1],180:[-2,2],270:[1,-2]}[game.piece.rotation],a={0:[0,0,1,0,-2,0,1,-2,-2,1],90:[0,0,-2,0,1,0,-2,-1,1,2],180:[0,0,-1,0,2,0,-1,2,2,-1],270:[0,0,2,0,-1,0,2,1,-1,-2]}[game.piece.rotation];game.piece.x+=t[0],game.piece.y+=t[1];for(var i=0;i<10;i+=2)if(!w(game.piece,a[i],-a[i+1]))return game.piece.x+=a[i],game.piece.y-=a[i+1],game.piece.render(),game.piece.lastRotated=!0,void(w(game.piece,0,1)?(clearInterval(game.gravityInterval),game.gravityInterval=setInterval(game.gravitate,Math.max(game.speed,500)),game.piece.lockDelayed=!0):game.piece.lockDelayed&&(clearInterval(game.gravityInterval),game.gravityInterval=setInterval(game.gravitate,game.speed),game.piece.lockDelayed=!1))}else if("O"!=game.piece.type){var n={0:[0,0],90:[1,0],180:[-1,1],270:[0,-1]}[game.piece.rotation],l={0:[0,0,-1,0,-1,1,0,2,1,-2],90:[0,0,-1,0,-1,1,0,-2,-1,-2],180:[0,0,1,0,1,-1,0,2,1,2],270:[0,0,1,0,1,1,0,-2,1,-2]}[game.piece.rotation];game.piece.x+=n[0],game.piece.y+=n[1];for(var r=0;r<10;r+=2)if(!w(game.piece,l[r],-l[r+1]))return game.piece.x+=l[r],game.piece.y-=l[r+1],game.piece.render(),game.piece.lastRotated=8!=r||"triple",void(w(game.piece,0,1)?(clearInterval(game.gravityInterval),game.gravityInterval=setInterval(game.gravitate,Math.max(game.speed,500)),game.piece.lockDelayed=!0):game.piece.lockDelayed&&(clearInterval(game.gravityInterval),game.gravityInterval=setInterval(game.gravitate,game.speed),game.piece.lockDelayed=!1))}else;game.piece.rotation=(game.piece.rotation+270)%360,game.piece.x-=translate[0],game.piece.y-=translate[1]}else{if(game.piece.rotation=(game.piece.rotation+270)%360,"I"==game.piece.type){var m={0:[-2,1],90:[2,-2],180:[-1,2],270:[1,-1]}[game.piece.rotation],g={0:[0,0,2,0,-1,0,2,1,-1,-2],90:[0,0,1,0,-2,0,1,-2,-2,1],180:[0,0,-2,0,1,0,-2,-1,1,2],270:[0,0,-1,0,2,0,-1,2,2,-1]}[game.piece.rotation];game.piece.x+=m[0],game.piece.y+=m[1];for(var s=0;s<10;s+=2)if(!w(game.piece,g[s],-g[s+1]))return game.piece.x+=g[s],game.piece.y-=g[s+1],game.piece.render(),game.piece.lastRotated=!0,void(w(game.piece,0,1)?(clearInterval(game.gravityInterval),game.gravityInterval=setInterval(game.gravitate,Math.max(game.speed,500)),game.piece.lockDelayed=!0):(game.piece.lockDelayed&&(clearInterval(game.gravityInterval),game.gravityInterval=setInterval(game.gravitate,game.speed)),game.piece.lockDelayed=!1))}else if("O"!=game.piece.type){var o={0:[-1,0],90:[1,-1],180:[0,1],270:[0,0]}[game.piece.rotation],d={0:[0,0,1,0,1,-1,0,2,1,2],90:[0,0,-1,0,-1,1,0,-2,-1,-2],180:[0,0,-1,0,-1,-1,0,2,-1,2],270:[0,0,1,0,1,1,0,-2,1,-2]}[game.piece.rotation];game.piece.x+=o[0],game.piece.y+=o[1];for(var c=0;c<10;c+=2)if(!w(game.piece,d[c],-d[c+1]))return game.piece.x+=d[c],game.piece.y-=d[c+1],game.piece.render(),game.piece.lastRotated=8!=c||"triple",void(w(game.piece,0,1)?(clearInterval(game.gravityInterval),game.gravityInterval=setInterval(game.gravitate,Math.max(game.speed,500)),game.piece.lockDelayed=!0):(game.piece.lockDelayed&&(clearInterval(game.gravityInterval),game.gravityInterval=setInterval(game.gravitate,game.speed)),game.piece.lockDelayed=!1))}else;game.piece.rotation=(game.piece.rotation+90)%360,game.piece.x-=translate[0],game.piece.y-=translate[1]}},move:function(e){return!game.piece.landed&&("DOWN"==e?!w(game.piece,0,1)&&(clearInterval(game.gravityInterval),game.gravityInterval=setInterval(game.gravitate,game.speed),game.piece.lastRotated=!1,game.gravitate(),game.stats.score++,p.textContent="Score: "+b(game.stats.score),c.textContent=b(game.stats.score),!0):"LEFT"==e?!w(game.piece,-1,0)&&(game.piece.x--,game.piece.render(),game.piece.lastRotated=!1,w(game.piece,0,1)?(clearInterval(game.gravityInterval),game.gravityInterval=setInterval(game.gravitate,Math.max(game.speed,500)),game.piece.lockDelayed=!0):(game.piece.lockDelayed&&(clearInterval(game.gravityInterval),game.gravityInterval=setInterval(game.gravitate,game.speed)),game.piece.lockDelayed=!1),!0):"RIGHT"==e?!w(game.piece,1,0)&&(game.piece.x++,game.piece.render(),game.piece.lastRotated=!1,w(game.piece,0,1)?(clearInterval(game.gravityInterval),game.gravityInterval=setInterval(game.gravitate,Math.max(game.speed,500)),game.piece.lockDelayed=!0):(game.piece.lockDelayed&&(clearInterval(game.gravityInterval),game.gravityInterval=setInterval(game.gravitate,game.speed)),game.piece.lockDelayed=!1),!0):void 0)},render:function(e){var t=x(game.piece);if(this.element.className=this.ghost.className="game_piece gp_type_"+this.type+" gp_rot_"+this.rotation,this.ghost.className+=" flashing",s.appendChild(this.element),this.element.style.gridTemplateColumns=this.ghost.style.gridTemplateColumns="repeat("+t.width+", 1fr)",this.element.style.gridTemplateRows=this.ghost.style.gridTemplateRows="repeat("+t.height+", 1fr)",this.element.style.gridArea=t.area,!e){o.appendChild(this.ghost);for(var a=0;a<18;a++)if(w(game.piece,0,a+1)){this.ghost.style.gridArea=t.y1+a+1+" / "+(t.x1+1)+" / "+(t.y2+a+1)+" / "+(t.x2+1);break}}},drop:function(){if(!game.piece.landed)for(var e=0;e<18;e++){if(w(game.piece,0,1)){if(0==e)return;return game.piece.render(!0),game.piece.lastRotated=!1,game.gravitate(),game.stats.score+=2*e,p.textContent="Score: "+b(game.stats.score),c.textContent=b(game.stats.score),void(game.refTime=performance.now())}game.piece.y++}}},gravitate:function(){if(game.elapsedGravityTime=null,game.midGravityTimeout=null,w(game.piece,0,1)){for(var i=_(game.piece),e=i.length-1;0<=e;e--)game.grid[i[e][1]][i[e][0]]=!0;for(var t,a,n,l,r,m=[],g=0;g<18;g++)game.grid[g].every(function(e){return e})&&m.push(g);"T"==game.piece.type&&game.piece.lastRotated?(t=i[0==game.piece.rotation||270==game.piece.rotation?1:2],a=l=void 0,3<=(l=0==game.piece.rotation?(a=17==t[1]?2:game.grid[t[1]+1][t[0]-1]+game.grid[t[1]+1][t[0]+1],game.grid[t[1]-1][t[0]-1]+game.grid[t[1]-1][t[0]+1]):90==game.piece.rotation?(a=0==t[0]?2:game.grid[t[1]-1][t[0]-1]+game.grid[t[1]+1][t[0]-1],game.grid[t[1]-1][t[0]+1]+game.grid[t[1]+1][t[0]+1]):180==game.piece.rotation?(a=0==t[1]?2:game.grid[t[1]-1][t[0]-1]+game.grid[t[1]-1][t[0]+1],game.grid[t[1]+1][t[0]-1]+game.grid[t[1]+1][t[0]+1]):(a=9==t[0]?2:game.grid[t[1]-1][t[0]+1]+game.grid[t[1]+1][t[0]+1],game.grid[t[1]-1][t[0]-1]+game.grid[t[1]+1][t[0]-1]))+a&&(2==l||"triple"==game.piece.lastRotated?("T-Spin,"==game.lastType.toString().substring(0,7)?(n=parseInt(game.lastType.substring(7)),game.stats.score+=(0==m.length?600:1==m.length?1<=n?1100:700:2==m.length?2<=n?1500:900:3==m.length?3<=n?1900:1100:0)*game.stats.level,message.clearType="BACK-TO-BACK T-SPIN"):(game.stats.score+=(0==m.length?400:1==m.length?700:2==m.length?900:3==m.length?1100:0)*game.stats.level,message.clearType="T-SPIN"),game.lastType="T-Spin,"+m.length,game.stats.tSpins.regular++):(game.stats.score+=("T-Spin Mini"==game.lastType?150:100)*game.stats.level,message.clearType=("T-Spin Mini"==game.lastType?"BACK-TO-BACK ":"")+"T-SPIN MINI",game.lastType="T-Spin Mini",game.stats.tSpins.mini++),game.lvlLines+=0==m.length?1:1==m.length?2:2==m.length?4:3==m.length?1:0)):"Tetris"!=game.lastType&&(game.lastType=null),game.piece.landed=!0,clearInterval(game.gravityInterval),o.textContent="",m.length?(game.stats.lineTypes[1==m.length?"single":2==m.length?"double":3==m.length?"triple":"tetris"]++,game.stats.lineTypes[game.piece.type]++,game.stats.score+=(1==m.length?100:2==m.length?300:3==m.length?500:4==m.length?800:0)*game.stats.level,4==m.length?("Tetris"==game.lastType?(game.stats.score+=400*game.stats.level,message.clearType="BACK-TO-BACK TETRIS",game.lvlLines+=12):(message.clearType="TETRIS",game.lvlLines+=8),game.lastType="Tetris"):"Tetris"==game.lastType&&(game.lastType=null),message.combo=++game.combo,game.stats.score+=50*game.combo*game.stats.level,game.stats.lines+=m.length,game.lvlLines+=1==m.length?1:2==m.length?3:3==m.length?5:0,r=Math.ceil((Math.sqrt(8*game.lvlLines+9)-Math.sqrt(5))/Math.sqrt(20)),game.stats.level!=r&&(game.stats.level=r,game.speed=1e3*Math.pow(.8-.007*(game.stats.level-1),game.stats.level-1),message.leveled=!0),p.textContent="Score: "+b(game.stats.score),y.textContent="Level: "+b(game.stats.level),h.textContent="Lines: "+b(game.stats.lines),c.textContent=b(game.stats.score),v.textContent=b(game.stats.level),u.textContent=b(game.stats.lines),game.piece.element.classList.add("flashing"),setTimeout(function(){for(var e=i.length-1;0<=e;e--){var t=document.createElement("div");t.style.gridArea="1 / "+(i[e][0]+1)+" / 2 / "+(i[e][0]+2),t.className="gp_type_"+game.piece.type,d.children[i[e][1]].appendChild(t)}game.piece.element.parentNode&&s.removeChild(game.piece.element);for(var a=this.length-1;0<=a;a--)d.children[this[a]].className="flashing";setTimeout(function(){for(var e=this.length-1;0<=e;e--)d.children[this[e]].className="";setTimeout(function(){for(var e=this.length-1;0<=e;e--)d.children[this[e]].className="flashing";setTimeout(function(){for(var e=0,t=this.length;e<t;e++)d.removeChild(d.children[this[e]]),d.insertBefore(document.createElement("div"),d.firstElementChild),game.grid.splice(this[e],1),game.grid.unshift(new Array(10).fill(!1));setTimeout(E,(10+Math.floor((18-x(game.piece).y2)/2))/60*1e3)}.bind(this),10/60*1e3)}.bind(this),10/60*1e3)}.bind(this),10/60*1e3)}.bind(m),10/60*1e3)):(game.combo=-1,game.piece.element.classList.add("flashing"),setTimeout(function(){for(var e=i.length-1;0<=e;e--){var t=document.createElement("div");t.style.gridArea="1 / "+(i[e][0]+1)+" / 2 / "+(i[e][0]+2),t.className="gp_type_"+game.piece.type,d.children[i[e][1]].appendChild(t)}s.removeChild(game.piece.element),E()},10/60*1e3)),message.show()}else game.piece.y++,game.piece.render(!0),game.piece.lastRotated=!1,w(game.piece,0,1)&&(clearInterval(game.gravityInterval),game.gravityInterval=setInterval(game.gravitate,Math.max(game.speed,500)),game.piece.lockDelayed=!0);game.refTime=performance.now()},pause:function(){document.body.classList.add("game_paused"),game.midGravityTimeout&&(clearInterval(game.midGravityTimeout),game.midGravityTimeout=null),game.elapsedGravityTime=(game.elapsedGravityTime||0)+performance.now()-game.refTime,clearInterval(game.gravityInterval),game.paused=!0},play:function(){document.body.classList.remove("game_paused"),game.midGravityTimeout=setTimeout(function(){game.gravitate(),clearInterval(game.gravityInterval),game.gravityInterval=setInterval(game.gravitate,w(game.piece,0,1)?Math.max(game.speed,500):game.speed)},game.speed-game.elapsedGravityTime),game.paused=!1,game.refTime=performance.now()},start:function(){game.started=!0,game.speed=800,clearInterval(game.gravityInterval),game.gravityInterval=setInterval(game.gravitate,game.speed),game.grid=new Array(18).fill().map(function(){return new Array(10).fill(!1)}),game.lastType=null,game.combo=-1,game.piece.next=T(),game.piece.type=game.piece.next.shift(),s.textContent="",o.textContent="",d.innerHTML="<div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>";var e=x(game.piece);game.piece.x=Math.floor(5-e.width/2),game.piece.y=1,game.piece.rotation=0,game.piece.element=C(game.piece.type,game.piece.rotation),game.piece.ghost=C(game.piece.type,game.piece.rotation),game.piece.ghost.classList.add("flashing"),game.piece.landed=!1,game.piece.lockDelayed=!1,game.piece.lastRotated=!1;var t=C(game.piece.next[0],0),e=x({type:game.piece.next[0],rotation:0});t.style.gridArea="1 / 1 / "+(e.height+1)+" / "+(e.width+1),i.textContent=a.textContent="",i.style.gridTemplateColumns=a.style.gridTemplateColumns=t.style.gridTemplateColumns,i.style.gridTemplateRows=a.style.gridTemplateRows=t.style.gridTemplateRows,a.parentNode.style.padding=1==e.height?"10% 0":"",i.parentNode.style.padding=1==e.height?"12.5% 0":"",a.style.width=20*e.width+"%",i.style.width=25*e.width+"%",i.appendChild(t),a.appendChild(t.cloneNode(!0)),game.piece.render(),game.stats.score=0,game.stats.level=1,game.stats.lines=0,game.lvlLines=0,game.stats.lineTypes.single=game.stats.lineTypes.double=game.stats.lineTypes.triple=game.stats.lineTypes.tetris=0,game.stats.lineTypes.S=game.stats.lineTypes.Z=game.stats.lineTypes.L=game.stats.lineTypes.J=game.stats.lineTypes.O=game.stats.lineTypes.T=game.stats.lineTypes.I=0,game.stats.tSpins.regular=game.stats.tSpins.mini=0,game.paused=!1,p.textContent="Score: 0",y.textContent="Level: 1",h.textContent="Lines: 0",c.textContent="0",v.textContent="1",u.textContent="0",document.body.classList.add("playing"),document.body.classList.remove("game_paused"),document.body.classList.remove("new_score"),document.body.removeAttribute("data-score"),game.minoWidth=n.getBoundingClientRect().width/10},end:function(){game.started=!1,clearInterval(game.gravityInterval),document.body.classList.remove("playing"),document.body.setAttribute("data-score",game.stats.score);var e=document.getElementById("start_btn");l.insertBefore(document.getElementById("restart"),l.lastElementChild.previousElementSibling),l.firstElementChild.appendChild(e),e.textContent="Play Again",l.style.justifyContent="initial",document.getElementById("fin_score").textContent=b(game.stats.score),document.getElementById("fin_level").textContent=b(game.stats.level),document.getElementById("fin_lines").textContent=b(game.stats.lines),document.getElementById("fin_tSpin_mini").textContent=b(game.stats.tSpins.mini),document.getElementById("fin_tSpin_reg").textContent=b(game.stats.tSpins.regular);for(var t=["single","double","triple","tetris"],a=t.length-1;0<=a;a--)m.children[a].children[0].textContent=b(game.stats.lineTypes[t[a]]);for(var i=["S","Z","L","J","T","O","I"],n=i.length-1;0<=n;n--)g.children[n].children[1].textContent=b(game.stats.lineTypes[i[n]]);firebase.firestore().collection("tetris").doc("scores").get({source:"server"}).then(function(e){var t;e.metadata.fromCache?document.body.classList.contains("no_scores")||(document.body.classList.add("scores_err"),f.firstElementChild.textContent="These scores may not be up-to-date. Connect to the Internet to get updated scores."):(t=e.data(),game.scores=t.p.map(function(e){return{owner:"p",value:e}}).concat(t.s.map(function(e){return{owner:"s",value:e}})).sort(function(e,t){return t.value-e.value}),document.body.classList.remove("no_scores"),document.body.classList.remove("scores_err"))}).catch(function(){document.body.classList.contains("no_scores")||(document.body.classList.add("scores_err"),f.firstElementChild.textContent="These scores may not be up-to-date. Connect to the Internet to get updated scores.")}),game.updateScores()},stats:{lines:null,level:null,score:null,lineTypes:{single:null,double:null,triple:null,tetris:null,S:null,Z:null,L:null,J:null,O:null,T:null,I:null},tSpins:{regular:null,mini:null}},lvlLines:null,grid:null,gravityInterval:null,midGravityTimeout:null,speed:null,lastType:null,combo:null,refTime:null,elapsedGravityTime:null,paused:null,minoWidth:(window.game||{minoWidth:null}).minoWidth,scores:(window.game||{scores:null}).scores,dimensions:x,started:!1,updateScores:function(){if(game.scores){var e=document.body.getAttribute("data-score")||"0",t=document.getElementById("temp_score");if(+e>game.scores.filter(function(e){return e.owner==auth.userID})[4].value){document.body.classList.add("new_score");var a={owner:auth.userID,value:+e},i=game.scores.slice().concat([a]).sort(function(e,t){return t.value-e.value});11==I.children.length?I.appendChild(document.createElement("div")):t&&(t.id="");for(var n=0,l=0,r=i.length;l<r;l++)i[l].owner==auth.userID&&n++,I.children[l+1].id=i[l]==a?"temp_score":6==n&&i[l].owner==auth.userID?"old_score":"",I.children[l+1].innerHTML="<div></div><span>"+b(i[l].value)+"</span>",I.children[l+1].className="score_"+i[l].owner;document.getElementById("pw").value="",document.getElementById("pw_submit").disabled=!1,document.getElementById("new_score_2").firstElementChild.textContent="Re-enter your password to add it to the high scores list."}else{12==I.children.length&&I.removeChild(t||I.lastElementChild);for(var m=0,g=game.scores.length;m<g;m++)I.children[m+1].id="",I.children[m+1].innerHTML="<div></div><span>"+b(game.scores[m].value)+"</span>",I.children[m+1].className="score_"+game.scores[m].owner}}}},game.scores&&game.updateScores(),window.message={clearType:null,combo:0,leveled:!1,show:function(){var e,t=[this.clearType||"",this.combo?"COMBO × "+(this.combo+1):"",this.leveled?"LEVEL UP":""].filter(function(e){return e}).join("\n");this.clearType=null,this.combo=0,this.leveled=!1,t&&((e=document.createElement("div")).innerText=t,e.className="game_msg",r.parentNode.insertBefore(e,r),setTimeout(function(){e.parentNode.removeChild(e)},3e3))}},window.addEventListener("blur",game.pause),document.getElementById("play_btn").addEventListener("click",game.play),document.getElementById("play_btn").addEventListener("touchstart",function(e){e.stopPropagation(),game.play()}),document.getElementById("r_pause").addEventListener("click",function(){game.paused?game.play():game.pause()}),document.getElementById("u_pause").addEventListener("click",function(){game.paused?game.play():game.pause()}),document.getElementById("r_end").addEventListener("click",game.end),document.getElementById("u_end").addEventListener("click",game.end),document.getElementById("start_btn").addEventListener("click",game.start)}();