// Canvas elementini ve context'i alın
const canvas = document.getElementById("myCanvas");
const context = canvas.getContext("2d");

// Fare izi çizgisi oluşturma için bir dizi tanımlayın
let trail = [];

// Animasyon durumunu izlemek için bir değişken tanımlayın
let isAnimating = false;

let timeoutId;

canvas.addEventListener("mousemove", function (event) {
  const x = event.clientX;
  const y = event.clientY;
  // Fare izi çizgisi için x ve y koordinatlarını trail dizisine ekleme
  trail.push({ x, y });
  // Animasyonu başlatma
  if (!isAnimating) {
    animate();
    isAnimating = true;
  }
  // Zamanlayıcıyı sıfırlama
  clearTimeout(timeoutId);
  // Yeni bir zamanlayıcı oluşturma
  timeoutId = setTimeout(function() {
    // trail dizisini ve animasyonu durdurma
    trail = [];
    isAnimating = false;
    // canvas temizleme
    context.clearRect(0, 0, canvas.width, canvas.height);
  }, 2000); // 2 saniye sonra
});


// Animasyon döngüsü
function animate() {
  // Canvas'ı temizleme
  context.clearRect(0, 0, canvas.width, canvas.height);

// Fare izi çizgisi oluşturma
for (let i = 0; i < trail.length; i++) {
  context.beginPath();
  if (i > 0) {
    // Önceki noktaya çizgi ile bağlantı oluşturma
    context.moveTo(trail[i-1].x, trail[i-1].y);
    context.lineTo(trail[i].x, trail[i].y);
    for (let j = 1; j <= 5; j++) {
      const k = i - (j * 5);
      if (k >= 0) {
        context.lineTo(trail[k].x, trail[k].y);
      }
    }
    // Opaklık ve kalınlık değerleri hesaplanır
    for (let j = 0; j < 60; j++) {
      const opacity = 1 - (i + j * 0.1) / (trail.length + 5);
      const thickness = 4 - (1 * i / trail.length);
      context.strokeStyle = "rgba(0, 0, 0, " + (0.5 - i+ trail.length) + ")";
      context.lineWidth = 4 - (1 * i / trail.length);
      context.stroke();
    }
  } else {
    // İlk noktada bir daire çizme
    context.arc(trail[i].x, trail[i].y, 2, 0, Math.PI * 200);
    context.fillStyle = "rgba(0, 0, 0, 1)";
    context.fill();
  }
}

 // İz silme işlemi: trail dizisini, en son eklenen noktadan geriye doğru gezerek, silinmesi gereken noktalara ulaşınca kesiyoruz.
 let i = trail.length - 100;
while (trail.length > 10 && (Math.abs(trail[10].x - trail[trail.length - 1].x) > 200 || Math.abs(trail[0].y - trail[trail.length - 1].y) > 200 || trail.length > 40)) {
  trail.shift();
}


// Sonraki frame'i hazırlama
if (trail.length > 0) {
  requestAnimationFrame(animate);
} else {
  isAnimating = false;
}
}

// Canvas'a mouseout event listener'ı ekleyin
canvas.addEventListener("mouseout", function () {
  // trail dizisini temizleme
  trail = [];
});
