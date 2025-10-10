const szablonSrc = "szablon.png";
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let userImg = null;
let szablonImg = new Image();
szablonImg.src = szablonSrc;

const circle = { x: 385, y: 240, r: 220 }; // Dostosuj (x, y, r) do pozycji białego koła na szablonie.jpg!

function drawTemplate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(szablonImg, 0, 0, canvas.width, canvas.height);
  if(userImg) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.r, 0, Math.PI*2, true);
    ctx.closePath();
    ctx.clip();

    let scale, x, y;
    if(userImg.width > userImg.height){
      scale = (2*circle.r) / userImg.height;
      x = circle.x - (userImg.width*scale)/2;
      y = circle.y - circle.r;
    }else{
      scale = (2*circle.r) / userImg.width;
      x = circle.x - circle.r;
      y = circle.y - (userImg.height*scale)/2;
    }
    ctx.drawImage(userImg, x, y, userImg.width*scale, userImg.height*scale);
    ctx.restore();
  }
}

document.getElementById('upload').onchange = e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    userImg = new Image();
    userImg.onload = () => {
      drawTemplate();
      document.getElementById('download').disabled = false;
    };
    userImg.src = ev.target.result;
  }
  reader.readAsDataURL(file);
};

szablonImg.onload = drawTemplate;

document.getElementById('download').onclick = () => {
  const link = document.createElement('a');
  link.download = 'pionierki_profilaktyki.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
};
