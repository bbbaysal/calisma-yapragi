// En Büyük Ortak Bölen (EBOB) - Sadeleştirme için
function ebob(a, b) {
    return b === 0 ? Math.abs(a) : ebob(b, a % b);
}

function rastgeleSayi(min, max) {
    let sayi = Math.floor(Math.random() * (max - min + 1)) + min;
    return sayi === 0 ? rastgeleSayi(min, max) : sayi;
}

// Kesir nesnesi oluşturma ve otomatik sadeleştirme
function Kesir(pay, payda) {
    if (payda === 0) payda = 1;
    let ortakBolen = ebob(pay, payda);
    this.pay = pay / ortakBolen;
    this.payda = payda / ortakBolen;
    
    if (this.payda < 0) {
        this.pay = -this.pay;
        this.payda = -this.payda;
    }
}

// ✨ LaTeX / MathJax Formatında Kesir Basma Fonksiyonu
function kesirYaz(kesir) {
    if (kesir.payda === 1) {
        return `${kesir.pay}`;
    }
    // Negatif kesirlerde eksiyi en öne şık duracak şekilde yerleştirir
    if (kesir.pay < 0) {
        return `-\\frac{${Math.abs(kesir.pay)}}{${kesir.payda}}`;
    }
    return `\\frac{${kesir.pay}}{${kesir.payda}}`;
}

function calismaYapragiUret() {
    const qContainer = document.getElementById("questionsContainer");
    const aContainer = document.getElementById("answersContainer");
    const count = parseInt(document.getElementById("questionCount").value);
    const topic = document.getElementById("topicSelect").value;
    const difficulty = document.getElementById("difficultySelect").value;
    
    qContainer.innerHTML = "";
    aContainer.innerHTML = "";

    const islemler = ['+', '-', '\\cdot', ':']; // Matematiksel çarpma ve bölme sembolleri LaTeX uyumlu yapıldı

    for (let i = 1; i <= count; i++) {
        let islem = topic === "karisik" ? islemler[Math.floor(Math.random() * islemler.length)] : topic;
        
        // Formül dönüştürmeleri
        if(islem === '×') islem = '\\cdot';
        if(islem === '÷') islem = ':';

        let p1, pd1, p2, pd2;

        if (difficulty === "kolay") {
            pd1 = rastgeleSayi(2, 8);
            pd2 = islem === '+' || islem === '-' ? pd1 : rastgeleSayi(2, 5);
            p1 = rastgeleSayi(1, pd1 - 1);
            p2 = rastgeleSayi(1, pd2 - 1);
        } else if (difficulty === "orta") {
            pd1 = rastgeleSayi(2, 10);
            pd2 = rastgeleSayi(2, 10);
            p1 = rastgeleSayi(1, pd1 + 2);
            p2 = rastgeleSayi(1, pd2 + 2);
        } else {
            pd1 = rastgeleSayi(2, 15);
            pd2 = rastgeleSayi(2, 15);
            p1 = rastgeleSayi(-12, 12);
            p2 = rastgeleSayi(-12, 12);
        }

        let k1 = new Kesir(p1, pd1);
        let k2 = new Kesir(p2, pd2);
        let kSonuc;

        if (islem === '+') {
            kSonuc = new Kesir((k1.pay * k2.payda) + (k2.pay * k1.payda), k1.payda * k2.payda);
        } else if (islem === '-') {
            if(difficulty === "kolay" && (k1.pay/k1.payda < k2.pay/k2.payda)) {
                let temp = k1; k1 = k2; k2 = temp;
            }
            kSonuc = new Kesir((k1.pay * k2.payda) - (k2.pay * k1.payda), k1.payda * k2.payda);
        } else if (islem === '\\cdot') {
            kSonuc = new Kesir(k1.pay * k2.pay, k1.payda * k2.payda);
        } else if (islem === ':') {
            while(k2.pay === 0) { k2 = new Kesir(rastgeleSayi(1, 5), pd2); }
            kSonuc = new Kesir(k1.pay * k2.payda, k1.payda * k2.pay);
        }

        // MathJax'ın tetiklenmesi için formüllerin başına ve sonuna $ işareti konuldu
        qContainer.innerHTML += `
            <div class="question-item">
                <span style="font-weight:bold; margin-right:15px;">${i})</span>
                $ ${kesirYaz(k1)} ${islem} ${kesirYaz(k2)} = $
            </div>
        `;

        aContainer.innerHTML += `
            <div class="answer-item">
                <strong style="margin-right:8px;">S${i}:</strong> $ ${kesirYaz(kSonuc)} $
            </div>
        `;
    }

    // ✨ Sihirli Satır: Dinamik üretilen LaTeX formüllerini MathJax kütüphanesine taratıp şık kesirlere dönüştürür
    if (window.MathJax && window.MathJax.typeset) {
        window.MathJax.typeset();
    }
}

window.onload = calismaYapragiUret;
