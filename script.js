// ========== NAVBAR ==========
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
window.addEventListener('scroll', () => { navbar.classList.toggle('scrolled', window.scrollY > 50); });
navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

// ========== SCROLL REVEAL ==========
const sections = document.querySelectorAll('.section');
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
sections.forEach(s => observer.observe(s));

// ========== SEISMIC WAVE CANVAS (Hero) ==========
(function(){
  const c = document.getElementById('seismicWaveCanvas');
  if(!c) return;
  const ctx = c.getContext('2d');
  function resize(){ c.width = c.parentElement.offsetWidth; c.height = c.parentElement.offsetHeight; }
  resize(); window.addEventListener('resize', resize);
  let t = 0;
  function draw(){
    ctx.clearRect(0,0,c.width,c.height);
    const cy = c.height/2;
    for(let w=0; w<3; w++){
      ctx.beginPath();
      ctx.strokeStyle = `rgba(59,130,246,${0.3 - w*0.08})`;
      ctx.lineWidth = 2;
      for(let x=0; x<c.width; x++){
        const y = cy + Math.sin((x*0.008)+(t*0.02)+(w*1.5))*40*(1+w*0.5) + Math.sin((x*0.003)+(t*0.01))*20;
        x===0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
      }
      ctx.stroke();
    }
    t++; requestAnimationFrame(draw);
  }
  draw();
})();

// ========== ELASTIC REBOUND ANIMATION ==========
(function(){
  const c = document.getElementById('reboundCanvas');
  if(!c) return;
  const ctx = c.getContext('2d');
  let phase = 0, progress = 0, animating = false;
  const labels = ['鎖定 Locked','應力累積 Accumulating','破裂！Rupture!','回跳 Rebound'];

  function draw(){
    ctx.clearRect(0,0,c.width,c.height);
    const mx = c.width/2, my = c.height/2;
    // Background
    ctx.fillStyle='#111827'; ctx.fillRect(0,0,c.width,c.height);
    // Fault line
    ctx.strokeStyle='#ef4444'; ctx.lineWidth=3; ctx.setLineDash([8,4]);
    ctx.beginPath(); ctx.moveTo(mx, 20); ctx.lineTo(mx, c.height-20); ctx.stroke();
    ctx.setLineDash([]);

    const offset = phase===0 ? 0 : phase===1 ? progress*30 : phase===2 ? 30-progress*30 : 0;
    const strain = phase===1 ? progress : phase===2 ? 1-progress : 0;

    // Left block
    ctx.fillStyle='#1e3a5f';
    ctx.fillRect(20, 40, mx-30, c.height-80);
    // Right block
    ctx.fillStyle='#1e3a5f';
    ctx.fillRect(mx+10, 40, mx-30, c.height-80);

    // Grid lines showing deformation
    ctx.strokeStyle='rgba(59,130,246,0.4)'; ctx.lineWidth=1;
    for(let i=0; i<6; i++){
      const y = 60 + i*(c.height-120)/5;
      // Left
      ctx.beginPath(); ctx.moveTo(30,y);
      ctx.lineTo(mx-20, y - strain*offset*(i-2.5)/3);
      ctx.stroke();
      // Right
      ctx.beginPath(); ctx.moveTo(mx+20, y + strain*offset*(i-2.5)/3);
      ctx.lineTo(c.width-30, y);
      ctx.stroke();
    }

    // Arrows
    if(phase>=1){
      ctx.fillStyle='#f97316';
      // Left arrow (up)
      drawArrow(ctx, mx-50, my, mx-50, my-offset);
      // Right arrow (down)
      drawArrow(ctx, mx+50, my, mx+50, my+offset);
    }

    // Rupture effect
    if(phase===2 && progress<0.3){
      ctx.fillStyle=`rgba(239,68,68,${0.5-progress*1.5})`;
      ctx.beginPath(); ctx.arc(mx, my, 50+progress*200, 0, Math.PI*2); ctx.fill();
    }

    // Label
    ctx.fillStyle='#e2e8f0'; ctx.font='bold 16px Inter,sans-serif'; ctx.textAlign='center';
    ctx.fillText(labels[phase], mx, 30);

    // Phase indicator
    for(let i=0;i<4;i++){
      ctx.fillStyle = i===phase ? '#3b82f6' : '#334155';
      ctx.beginPath(); ctx.arc(mx-30+i*20, c.height-15, 5, 0, Math.PI*2); ctx.fill();
    }
  }

  function drawArrow(ctx,x1,y1,x2,y2){
    ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.strokeStyle='#f97316'; ctx.lineWidth=2; ctx.stroke();
    const a=Math.atan2(y2-y1,x2-x1);
    ctx.beginPath(); ctx.moveTo(x2,y2);
    ctx.lineTo(x2-8*Math.cos(a-0.5),y2-8*Math.sin(a-0.5));
    ctx.lineTo(x2-8*Math.cos(a+0.5),y2-8*Math.sin(a+0.5));
    ctx.closePath(); ctx.fill();
  }

  function animate(){
    if(!animating) return;
    progress += 0.008;
    if(progress >= 1){ progress=0; phase=(phase+1)%4; }
    draw(); requestAnimationFrame(animate);
  }

  draw();
  c.addEventListener('click', ()=>{ if(!animating){animating=true;animate();}else{animating=false;} });
  c.style.cursor='pointer';
})();

// ========== TIMELINE ==========
document.querySelectorAll('.timeline-item').forEach(item => {
  item.addEventListener('click', ()=>{
    document.querySelectorAll('.timeline-item').forEach(i=>i.classList.remove('active'));
    item.classList.add('active');
  });
});

// ========== FAULT TYPE INTERACTIVE ==========
(function(){
  const canvas = document.getElementById('faultTypeCanvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  const label = document.getElementById('faultTypeLabel');
  const btns = document.querySelectorAll('.fault-btn');
  const descs = {
    'strike-ll': '左移走向滑移斷層：上盤向右水平移動 (λ=0°)',
    'strike-rl': '右移走向滑移斷層：上盤向左水平移動 (λ=180°)',
    'reverse': '逆衝斷層：上盤向上移動 (λ=90°)',
    'normal': '正斷層：上盤向下移動 (λ=270°)'
  };

  function drawFault(type){
    ctx.clearRect(0,0,400,300);
    ctx.fillStyle='#111827'; ctx.fillRect(0,0,400,300);
    const mx=200,my=150;
    // Ground
    ctx.fillStyle='#1e293b'; ctx.fillRect(0,100,400,200);
    // Fault line
    ctx.strokeStyle='#ef4444'; ctx.lineWidth=3;
    if(type==='strike-ll'||type==='strike-rl'){
      ctx.beginPath(); ctx.moveTo(mx,50); ctx.lineTo(mx,250); ctx.stroke();
      // Arrows
      ctx.fillStyle='#3b82f6';
      const dir = type==='strike-ll'?-1:1;
      drawBlockArrow(ctx,mx-60,my,-dir); drawBlockArrow(ctx,mx+60,my,dir);
      ctx.fillStyle='#94a3b8'; ctx.font='13px Inter'; ctx.textAlign='center';
      ctx.fillText(type==='strike-ll'?'Left-lateral':'Right-lateral',mx,270);
    } else {
      // Dipping fault
      ctx.beginPath(); ctx.moveTo(100,80); ctx.lineTo(300,220); ctx.stroke();
      ctx.fillStyle='#3b82f6';
      if(type==='reverse'){
        drawBlockArrow2(ctx,150,100,0,-1); drawBlockArrow2(ctx,280,200,0,1);
        ctx.fillStyle='#94a3b8'; ctx.font='13px Inter'; ctx.textAlign='center';
        ctx.fillText('Reverse/Thrust (上盤上移)',mx,270);
      } else {
        drawBlockArrow2(ctx,150,100,0,1); drawBlockArrow2(ctx,280,200,0,-1);
        ctx.fillStyle='#94a3b8'; ctx.font='13px Inter'; ctx.textAlign='center';
        ctx.fillText('Normal (上盤下移)',mx,270);
      }
    }
    // Labels
    ctx.fillStyle='#64748b'; ctx.font='11px Inter'; ctx.textAlign='left';
    ctx.fillText('Hanging wall',20,130); ctx.fillText('Foot wall',300,130);
  }

  function drawBlockArrow(ctx,x,y,dir){
    ctx.beginPath();
    ctx.moveTo(x,y-8); ctx.lineTo(x+dir*30,y-8);
    ctx.lineTo(x+dir*30,y-15); ctx.lineTo(x+dir*45,y);
    ctx.lineTo(x+dir*30,y+15); ctx.lineTo(x+dir*30,y+8);
    ctx.lineTo(x,y+8); ctx.closePath(); ctx.fill();
  }
  function drawBlockArrow2(ctx,x,y,dx,dy){
    ctx.beginPath();
    ctx.moveTo(x-8,y); ctx.lineTo(x-8,y+dy*25);
    ctx.lineTo(x-15,y+dy*25); ctx.lineTo(x,y+dy*40);
    ctx.lineTo(x+15,y+dy*25); ctx.lineTo(x+8,y+dy*25);
    ctx.lineTo(x+8,y); ctx.closePath(); ctx.fill();
  }

  btns.forEach(btn=>{
    btn.addEventListener('click',()=>{
      btns.forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const type=btn.dataset.type;
      drawFault(type); label.textContent=descs[type];
    });
  });
  drawFault('strike-ll');
})();

// ========== RADIATION PATTERN ==========
(function(){
  const c = document.getElementById('radiationCanvas');
  if(!c) return;
  const ctx = c.getContext('2d');
  let mouseX=c.width/2, mouseY=c.height/2;

  function draw(){
    ctx.clearRect(0,0,c.width,c.height);
    ctx.fillStyle='#111827'; ctx.fillRect(0,0,c.width,c.height);
    const cx=c.width/2, cy=c.height/2, R=180;

    // Draw radiation lobes
    for(let a=0; a<360; a+=1){
      const rad=a*Math.PI/180;
      const amp=Math.sin(2*rad)*R*0.8;
      const absAmp=Math.abs(amp);
      const x=cx+absAmp*Math.cos(rad), y=cy-absAmp*Math.sin(rad);
      ctx.fillStyle=amp>0?'rgba(59,130,246,0.6)':'rgba(239,68,68,0.6)';
      ctx.beginPath(); ctx.arc(x,y,2,0,Math.PI*2); ctx.fill();
    }

    // Fill lobes
    ctx.globalAlpha=0.15;
    for(let lobe=0;lobe<4;lobe++){
      ctx.fillStyle=lobe%2===0?'#3b82f6':'#ef4444';
      ctx.beginPath();
      const startA=lobe*90, endA=(lobe+1)*90;
      ctx.moveTo(cx,cy);
      for(let a=startA;a<=endA;a++){
        const rad=a*Math.PI/180;
        const amp=Math.abs(Math.sin(2*rad))*R*0.8;
        ctx.lineTo(cx+amp*Math.cos(rad),cy-amp*Math.sin(rad));
      }
      ctx.closePath(); ctx.fill();
    }
    ctx.globalAlpha=1;

    // Axes
    ctx.strokeStyle='rgba(255,255,255,0.2)'; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(cx-R-20,cy); ctx.lineTo(cx+R+20,cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx,cy-R-20); ctx.lineTo(cx,cy+R+20); ctx.stroke();

    // Labels
    ctx.fillStyle='#3b82f6'; ctx.font='bold 14px Inter'; ctx.textAlign='center';
    ctx.fillText('C (+)',cx+R*0.7+30,cy-R*0.7-10);
    ctx.fillStyle='#ef4444';
    ctx.fillText('D (−)',cx-R*0.7-30,cy-R*0.7-10);
    ctx.fillStyle='#94a3b8'; ctx.font='12px Inter';
    ctx.fillText('Fault plane',cx+R+10,cy+15);
    ctx.fillText('Auxiliary',cx,cy-R-10);

    // Nodal planes (dashed)
    ctx.strokeStyle='rgba(255,255,255,0.3)'; ctx.setLineDash([5,5]);
    ctx.beginPath(); ctx.moveTo(cx,cy-R-10); ctx.lineTo(cx,cy+R+10); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx-R-10,cy); ctx.lineTo(cx+R+10,cy); ctx.stroke();
    ctx.setLineDash([]);

    // Mouse indicator
    const dx=mouseX-cx, dy=mouseY-cy;
    const angle=Math.atan2(-dy,dx);
    const amp2=Math.sin(2*angle);
    ctx.fillStyle=amp2>0?'#3b82f6':'#ef4444';
    ctx.beginPath(); ctx.arc(mouseX,mouseY,6,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#e2e8f0'; ctx.font='12px monospace'; ctx.textAlign='left';
    ctx.fillText(`θ=${(angle*180/Math.PI).toFixed(0)}° amp=${amp2.toFixed(2)}`,mouseX+12,mouseY-8);
  }

  c.addEventListener('mousemove',e=>{
    const r=c.getBoundingClientRect();
    mouseX=e.clientX-r.left; mouseY=e.clientY-r.top; draw();
  });
  draw();
})();

// ========== INTERACTIVE BEACHBALL ==========
(function(){
  const c = document.getElementById('beachballCanvas');
  if(!c) return;
  const ctx = c.getContext('2d');
  const strikeS=document.getElementById('strikeSlider');
  const dipS=document.getElementById('dipSlider');
  const rakeS=document.getElementById('rakeSlider');
  const strikeV=document.getElementById('strikeVal');
  const dipV=document.getElementById('dipVal');
  const rakeV=document.getElementById('rakeVal');
  const faultL=document.getElementById('faultLabel');

  function getFaultType(rake){
    const r=((rake%360)+360)%360;
    if(r>45&&r<135) return '逆衝斷層 Thrust';
    if(r>225&&r<315) return '正斷層 Normal';
    if((r>=0&&r<=45)||(r>=135&&r<=225)||(r>=315&&r<=360)) return '走向滑移 Strike-slip';
    return '混合型 Oblique';
  }

  function drawBeachball(){
    const strike=+strikeS.value, dip=+dipS.value, rake=+rakeS.value;
    strikeV.textContent=strike+'°'; dipV.textContent=dip+'°'; rakeV.textContent=rake+'°';
    faultL.textContent=getFaultType(rake);

    ctx.clearRect(0,0,c.width,c.height);
    const cx=c.width/2, cy=c.height/2, R=140;
    const sR=strike*Math.PI/180, dR=dip*Math.PI/180, rR=rake*Math.PI/180;

    // Compute nodal plane normals
    const n1=[- Math.sin(dR)*Math.sin(sR), -Math.sin(dR)*Math.cos(sR), Math.cos(dR)];
    const d1=[Math.cos(rR)*Math.cos(sR)+Math.sin(rR)*Math.cos(dR)*Math.sin(sR),
             -Math.cos(rR)*Math.sin(sR)+Math.sin(rR)*Math.cos(dR)*Math.cos(sR),
              Math.sin(rR)*Math.sin(dR)];

    // For each pixel, compute P-wave polarity
    const imgData = ctx.createImageData(c.width, c.height);
    for(let py=0; py<c.height; py++){
      for(let px=0; px<c.width; px++){
        const dx=(px-cx)/R, dy=(cy-py)/R;
        const r2=dx*dx+dy*dy;
        if(r2>1) continue;
        const dz=Math.sqrt(1-r2);
        // Ray direction in geographic coords (lower hemisphere)
        const ray=[dx, dy, -dz];
        // P-wave polarity: (ray·n)(ray·d)
        const rn=ray[0]*n1[0]+ray[1]*n1[1]+ray[2]*n1[2];
        const rd=ray[0]*d1[0]+ray[1]*d1[1]+ray[2]*d1[2];
        const pol=rn*rd;
        const idx=(py*c.width+px)*4;
        if(pol>0){
          imgData.data[idx]=30; imgData.data[idx+1]=58; imgData.data[idx+2]=138; imgData.data[idx+3]=220;
        } else {
          imgData.data[idx]=226; imgData.data[idx+1]=232; imgData.data[idx+2]=240; imgData.data[idx+3]=220;
        }
      }
    }
    ctx.putImageData(imgData,0,0);

    // Circle outline
    ctx.strokeStyle='#3b82f6'; ctx.lineWidth=3;
    ctx.beginPath(); ctx.arc(cx,cy,R,0,Math.PI*2); ctx.stroke();

    // N/S/E/W labels
    ctx.fillStyle='#94a3b8'; ctx.font='bold 12px Inter'; ctx.textAlign='center';
    ctx.fillText('N',cx,cy-R-8); ctx.fillText('S',cx,cy+R+16);
    ctx.fillText('E',cx+R+12,cy+4); ctx.fillText('W',cx-R-12,cy+4);
  }

  [strikeS,dipS,rakeS].forEach(s=>s.addEventListener('input',drawBeachball));
  drawBeachball();
})();

// ========== KATEX RENDER ==========
document.addEventListener('DOMContentLoaded',()=>{
  try{
    const fp=document.getElementById('formula-p');
    if(fp) katex.render('u_r = \\frac{1}{4\\pi\\rho\\alpha^3} F(t-r/\\alpha)\\sin 2\\theta \\cos\\phi',fp,{displayMode:true});
    const fm=document.getElementById('formula-m0');
    if(fm) katex.render('M_0 = \\mu \\bar{D} S',fm,{displayMode:true});
  }catch(e){}
});

