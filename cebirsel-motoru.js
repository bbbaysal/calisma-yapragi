function rastgeleSayi(min, max) {
    let sayi = Math.floor(Math.random() * (max - min + 1)) + min;
    return sayi === 0 ? rastgeleSayi(min, max) : sayi; // Katsayı 0 olmasın
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

        // Zorluk seviyesine göre kök (x) ve katsayı aralıkları
        if (difficulty === "kolay") {
            x = Math.floor(Math.random() * 8) + 1; // x pozitif (1-8)
            a = Math.floor(Math.random() * 5) + 2; // a pozitif (2-6)
            b = Math.floor(Math.random() * 10) + 1; // b pozitif (1-10)
        } else if (difficulty === "orta") {
            x = rastgeleSayi(-10, 10);
            a = rastgeleSayi(-6, 6);
            b = rastgeleSayi(-15, 15);
        } else { // zor seviye
            x = rastgeleSayi(-20, 20);
            a = rastgeleSayi(-12, 12);
            b = rastgeleSayi(-30, 30);
        }

        // Denklem Yapılarını Kurgulama (Ters Mühendislik ile Tam Sayı Çıkmasını Sağlama)
        if (tip === 'ax+b=c') {
            c = (a * x) + b;
            let bIsaret = b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`;
            soruMetni = `${a}x ${bIsaret} = ${c}`;
            cevapMetni = `x = ${x}`;
        } 
        else if (tip === 'ax-b=c') {
            // Kolay modda negatif karmaşası olmaması için b'yi mutlak alalım
            b = Math.abs(b);
            c = (a * x) - b;
            soruMetni = `${a}x - ${b} = ${c}`;
            cevapMetni = `x = ${x}`;
        } 
        else if (tip === 'ax+b=cx+d') {
            // ax + b = cx + d modelinde a != c olmalı yoksa x yok olur
            if (difficulty === "kolay") {
                c = a + (Math.floor(Math.random() * 3) + 1);
                d = (a * x + b) - (c * x);
            } else {
                c = rastgeleSayi(-6, 6);
                while (c === a) { c = rastgeleSayi(-6, 6); }
                d = (a * x + b) - (c * x);
            }
            
            let bIsaret = b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`;
            let dIsaret = d >= 0 ? `+ ${d}` : `- ${Math.abs(d)}`;
            soruMetni = `${a}x ${bIsaret} = ${c}x ${dIsaret}`;
            cevapMetni = `x = ${x}`;
        }

        // Başındaki gizli artı işaretlerini temizleme (Örn: +3x yerine 3x yazsın)
        soruMetni = soruMetni.replace(/^\+/, "").replace(/= \+/, "= ");

        // Soruyu Ekleme
        qContainer.innerHTML += `
            <div class="question-item">
                <strong>${i})</strong> Aşağıdaki denklemde "x" değerini bulunuz.<br>
                <div style="margin-top:10px; font-weight:bold; letter-spacing:1px;">${soruMetni}</div>
                <div class="space-for-solution"></div>
            </div>
        `;

        // Cevabı Ekleme
        aContainer.innerHTML += `
            <div class="answer-item">
                <strong>Soru ${i}:</strong> ${cevapMetni}
            </div>
        `;
    }
}

window.onload = calismaYapragiUret;
