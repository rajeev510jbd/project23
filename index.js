window.addEventListener('load', function()  {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d',{
    willReadFrequently:true
  });
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  console.log(ctx);

  class Particle {
    constructor(effect, x, y, color) {
      this.effect = effect;
      this.x = Math.random() * this.effect.canvasWidth;
      this.y = this.effect.canvasHeight;
      this.color = color;
      this.originX = x;
      this.originY = y;
      this.size = this.effect.gap;
      this.dx = 0;
      this.dy = 0;
      this.vx = 0;
      this.vy=0;
      this.force = 0;
      this.angle = 0;
      this.distance = 0;
      this.friction = Math.random() * 0.6 + 0.15;
      this.ease = Math.random() * 0.1 + 0.005;
    }

    draw() {
      this.effect.context.fillStyle = this.color;
      this.effect.context.fillRect(this.x, this.y, this.size, this.size);
    }

    update() {
      this.dx=this.effect.mouse.x-this.x;
      this.dy=this.effect.mouse.y-this.y;
      this.distance=this.dx*this.dx+this.dy*this.dy
      this.force=-this.effect.mouse.radius/this.distance
      if(this.distance<this.effect.mouse.radius)
      {
        this.angle=Math.atan2(this.dy,this.dx)
        this.vx += this.force*Math.cos(this.angle)
        this.vy += this.force*Math.sin(this.angle)
        
      }

      this.x += (this.vx*=this.friction)+(this.originX - this.x) * this.ease;
      this.y += (this.vy*=this.friction) + (this.originY - this.y)*this.ease;
    }
  }

  class Effect {
    constructor(context, canvasWidth, canvasHeight) {
      this.context = context;
      this.canvasWidth = canvasWidth;
      this.canvasHeight = canvasHeight;
      this.textX = this.canvasWidth / 2;
      this.textY = this.canvasHeight / 2;
      this.fontSize =180;
      this.lineHeight = this.fontSize * 0.9;
      this.maxTextWidth = this.canvasWidth * 0.8;
      this.textInput = document.getElementById("textInput");
      this.verticaloffset=0
      this.textInput.addEventListener('keyup', (e) => {
        if (e.key !== ' ') {
          this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
          this.WrapText(e.target.value);
        }
      });

      this.Particles = [];
      this.gap = 3;
      this.mouse = {
        radius: 20000,
        x: 0,
        y: 0
      }
      window.addEventListener("mousemove", (e) => {
        this.mouse.x = e.x;
        this.mouse.y = e.y;
      });
    }

    WrapText(text) {
      const gradient = this.context.createLinearGradient(0,0,this.canvasWidth,this.canvasHeight);
      gradient.addColorStop(0.3, "red");
      gradient.addColorStop(0.5, "orange");
      gradient.addColorStop(0.7, "yellow");
      this.context.fillStyle = gradient;
      this.context.textAlign = "center";
      this.context.textBaseline = "middle";
      this.context.lineWidth = 3;
      this.context.strokeStyle = "orange";
     
      this.context.font = this.fontSize + "px Bangers";
     
      let linesArray = [];
      let lineCounter = 0;
      let line = "";
      let words = text.split(" ");
      for (let i = 0; i < words.length; i++) {
        let testLine = line + words[i] + " ";

        if (this.context.measureText(testLine).width > this.maxTextWidth) {
          line = words[i] + " ";
          lineCounter++;
        } else {
          line = testLine;
        }

        linesArray[lineCounter] = line;
      }

      let textHeight = this.lineHeight * lineCounter;
      this.textY = canvas.height / 2 - textHeight / 2+this.verticaloffset;

      linesArray.forEach((el, index) => {
        this.context.fillText(el, this.textX, this.textY +( index*this.lineHeight));
        this.context.strokeText(
          el,
          this.textX,
          this.textY + (index *this.lineHeight)
        );
      });

      this.convertToParticles();
    }

    convertToParticles() {
      this.particles = [];
      const pixels = this.context.getImageData( 0,0, this.canvasWidth,this.canvasHeight).data;
      this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
      for (let y = 0; y < this.canvasHeight; y += this.gap) {
        for (let x = 0; x < this.canvasWidth; x += this.gap) {
          const index = (y * this.canvasWidth + x) * 4;
          const alpha = pixels[index + 3];

          if (alpha > 0) {
            const red = pixels[index];
            const green = pixels[index + 1];

            const blue = pixels[index + 2];

            const color = 'rgb(' + red + ',' + green + ',' + blue + ')';
            this.particles.push(new Particle(this, x, y, color));
          }
        }
      }
    }
    render() {
      this.particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
    }
    resize(width,height)

    {
this.canvasWidth=width;
this.canvasHeight=height
this.textX = this.canvasWidth / 2;
      this.textY = this.canvasHeight / 2;
      this.maxTextWidth = this.canvasWidth * 0.8;

        
    }
  }

  const effect = new Effect(ctx, canvas.width, canvas.height);
  effect.WrapText(effect.textInput.value);
  effect.render();
  function animate() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    effect.render();
    requestAnimationFrame(animate);
  }
  animate();


  this.window.addEventListener("resize",()=>{
    canvas.width=window.innerWidth;
    canvas.height=window.innerHeight;
    effect.WrapText(effect.textInput.value)
    effect.resize(canvas.width,canvas.height)



  })
});





























// ctx.linewidth=3
// ctx.strokeStyle='red'
// ctx.beginPath();
// ctx.moveTo(canvas.width/2,0)
// ctx.lineTo(canvas.width/2,canvas.height)
// ctx.stroke();

// ctx.strokeStyle='green'
// ctx.beginPath();
// ctx.moveTo(0,canvas.height/2)
// ctx.lineTo(canvas.width,canvas.height/2)
// ctx.stroke();

// // const text='Hello'
// // const textX=canvas.width/2;
// // const textY=canvas.height/2;

// const gradient=ctx.createLinearGradient(0,0,canvas.width,canvas.height)
// gradient.addColorStop(0.3,'red')
// gradient.addColorStop(0.5,'blue')
// gradient.addColorStop(0.7,'yellow')

// ctx.fillStyle=gradient
// ctx.strokeStyle='white'
// ctx.font='80px Helvetica'
// ctx.textAlign='center'
// ctx.textBaseline='middle'
// // ctx.fillText(text,textX,textY)
// // ctx.strokeText(text,textX,textY)

// const maxTextWidth=canvas.width*0.8
// const lineHeight=80

// function WrapText(text){
//     let linesArray=[]
//     let lineCounter=0
//     let line=''
//     let words=text.split(' ')
//     for(let i=0;i<words.length;i++)
//     {
//         let testLine=line+words[i]+' ';

//         if(ctx.measureText(testLine).width>maxTextWidth)
//         {
//             line=words[i]+''
//             lineCounter++

//         }

//         else
//         {
//             line=testLine;
//         }

//         linesArray[lineCounter]=line;

//     //ctx.fillText(testLine,canvas.width/2,canvas.height/2)
//     }

// let textHeight=lineHeight*lineCounter
// let textY=canvas.height/2-textHeight/2

// linesArray.forEach((el,index)=>{

//     ctx.fillText(el,canvas.width/2,textY+(index*lineHeight));

// });
// }
// //WrapText('A aaa')

// textInput.addEventListener('keyup',(e)=>{
//     ctx.clearRect(0,0,canvas.width,canvas.height)
// WrapText(e.target.value)
// });
