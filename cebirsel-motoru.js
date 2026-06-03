function rastgeleSayi(min, max) {
    let sayi = Math.floor(Math.random() * (max - min + 1)) + min;
    return sayi === 0 ? rastgeleSayi(min, max) : sayi;
}

// Terimleri şık bir şekilde birleştiren yardımcı fonksiyon (Örn: b=-5 ise "+ -5" yerine doğrudan "- 5" yazması için)
function terimBirlestir(katsayi, degisken) {
    if (katsayi === 1) return `${degisken}`;
    if (katsayi === -1) return `-${degisken}`;
    return `${katsayi}${degisken}`;
}

function sabitYaz(sayi, baslangicMi = false) {
    if (sayi >= 0) {
        return baslangicMi ? `${sayi}` : `+ ${sayi}`;
    } else {
        return `- ${Math.abs(sayi)}`;
    }
}

function calismaYapragiUret() {
    const qContainer = document.getElementById("questionsContainer");
    const aContainer = document.getElementById("answersContainer");
    const count = parseInt(document.getElementById("questionCount").value);
    const topic = document.getElementById("topicSelect").value;
    const difficulty = document.getElementById("difficultySelect").value;
    
    qContainer.innerHTML = "";
    aContainer.innerHTML = "";

    const tipler = ['ax+b=c', 'ax-b=c', 'ax+b=cx+d'];

    for (let i = 1; i <= count; i++) {
        let tip = topic === "karisik" ? tipler[Math.floor(Math.random() * tipler.length)] : topic;
        
        let a, b, c, d, x;
        let soruMetni = "";
        let cevapMetni = "";

        if (difficulty === "kolay") {
            x = Math.floor(Math.random() * 8) + 1; 
            a = Math.floor(Math.random() * 5) + 2; 
            b = Math.floor(Math.random() * 10) + 1; 
        } else if (difficulty === "orta") {
            x = rastgeleSayi(-10, 10);
            a = rastgeleSayi(-6, 6);
            b = rastgeleSayi(-15, 15);
        } else { 
            x = rastgeleSayi(-20, 20);
            a = rastgeleSayi(-12, 12);
            b = rastgeleSayi(-30, 30);
        }

        if (tip === 'ax+b=c') {
            c = (a * x) + b;
            soruMetni = `${terimBirlestir(a, 'x')} ${sabitYaz(b)} = ${c}`;
            cevapMetni = `x = ${x}`;
        } 
        else if (tip === 'ax-b=c') {
            b = Math.abs(b); // Kolaylık için b pozitif seçilip çıkartılır
            c = (a * x) - b;
            soruMetni = `${terimBirlestir(a, 'x')} - ${b} = ${c}`;
            cevapMetni = `x = ${x}`;
        } 
        else if (tip === 'ax+b=cx+d') {
            if (difficulty === "kolay") {
                c = a + (Math.floor(Math.random() * 3) + 1);
                d = (a * x + b) - (c * x);
            } else {
                c = rastgeleSayi(-6, 6);
                while (c === a) { c = rastgeleSayi(-6, 6); }
                d = (a * x + b) - (c * x);
            }
            soruMetni = `${terimBirlestir(a, 'x')} ${sabitYaz(b)} = ${terimBirlestir(c, 'x')} ${sabitYaz(d)}`;
            cevapMetni = `x = ${x}`;
        }

        // Soruyu Ekleme ($ işaretleri LaTeX formatını tetikler)
        qContainer.innerHTML += `
            <div class="question-item">
                <strong>${i})</strong> Aşağıdaki denklemi çözünüz.<br>
                <div class="equation-text">$ ${soruMetni} $</div>
                <div class="space-for-solution"></div>
            </div>
        `;

        // Cevabı Ekleme
        aContainer.innerHTML += `
            <div class="answer-item">
                <strong style="margin-right:8px;">S${i}:</strong> $ ${cevapMetni} $
            </div>
        `;
    }

    // ✨ MathJax Motorunu Yeniden Tetikleme Satırı
    if (window.MathJax && window.MathJax.typeset) {
        window.MathJax.typeset();
    }
}

window.onload = calismaYapragiUret;
