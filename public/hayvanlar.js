document.addEventListener("DOMContentLoaded", () => {
    hayvanlariGetir();
});

async function hayvanlariGetir() {
    try {
        const response = await fetch("/api/hayvanlar");
        const result = await response.json();

        if (!result.success) {
            console.error("Hayvanlar getirilemedi:", result.message);
            return;
        }

        tabloyuDoldur(result.data);

    } catch (error) {
        console.error("API bağlantı hatası:", error);
    }
}

function tabloyuDoldur(hayvanlar) {
    const tbody = document.getElementById("hayvanlarTablo");
    tbody.innerHTML = "";

    hayvanlar.forEach(hayvan => {
        const yas = yasHesapla(hayvan.dogum_tarihi);
        const avatarClass = avatarSinifiBelirle(hayvan.tur);
        const durumClass = durumSinifiBelirle(hayvan.saglik_durumu);
        const ilkHarf = hayvan.hayvan_adi.charAt(0).toUpperCase();

        const satir = `
            <tr>
                <td>
                    <div class="pet-info">
                        <span class="pet-avatar ${avatarClass}">${ilkHarf}</span>
                        <div>
                            <strong>${hayvan.hayvan_adi}</strong>
                            <p>${hayvan.cinsiyet || "Belirtilmedi"}</p>
                        </div>
                    </div>
                </td>

                <td>
                    <strong>${hayvan.tur}</strong>
                    <p>${hayvan.cins || "Cins belirtilmedi"}</p>
                </td>

                <td>${yas}</td>

                <td>${hayvan.sahip_adi}</td>

                <td>Henüz yok</td>

                <td>
                    <span class="status ${durumClass}">
                        ${hayvan.saglik_durumu || "Belirtilmedi"}
                    </span>
                </td>

                <td>
                    <div class="action-buttons">
                        <button class="view"><i class="fa-regular fa-eye"></i></button>
                        <button class="edit"><i class="fa-regular fa-pen-to-square"></i></button>
                        <button class="delete"><i class="fa-regular fa-trash-can"></i></button>
                    </div>
                </td>
            </tr>
        `;

        tbody.innerHTML += satir;
    });
}

function yasHesapla(dogumTarihi) {
    if (!dogumTarihi) {
        return "Belirtilmedi";
    }

    const dogum = new Date(dogumTarihi);
    const bugun = new Date();

    let yas = bugun.getFullYear() - dogum.getFullYear();
    const ayFarki = bugun.getMonth() - dogum.getMonth();

    if (ayFarki < 0 || (ayFarki === 0 && bugun.getDate() < dogum.getDate())) {
        yas--;
    }

    if (yas <= 0) {
        return "1 Yaş Altı";
    }

    return `${yas} Yaş`;
}

function avatarSinifiBelirle(tur) {
    if (!tur) return "cat";

    const temizTur = tur.toLowerCase();

    if (temizTur.includes("kedi")) {
        return "cat";
    }

    if (temizTur.includes("köpek") || temizTur.includes("kopek")) {
        return "dog";
    }

    return "bird";
}

function durumSinifiBelirle(durum) {
    if (!durum) return "healthy";

    const temizDurum = durum.toLowerCase();

    if (temizDurum.includes("sağlıklı") || temizDurum.includes("saglikli")) {
        return "healthy";
    }

    if (temizDurum.includes("aşı") || temizDurum.includes("asi")) {
        return "vaccine";
    }

    if (temizDurum.includes("kontrol")) {
        return "control";
    }

    return "healthy";
}