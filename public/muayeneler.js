document.addEventListener("DOMContentLoaded", () => {
    muayeneleriGetir();
});

async function muayeneleriGetir() {
    try {
        const response = await fetch("/api/muayeneler");
        const result = await response.json();

        if (!result.success) {
            console.error("Muayeneler getirilemedi:", result.message);
            return;
        }

        tabloyuDoldur(result.data);

    } catch (error) {
        console.error("API bağlantı hatası:", error);
    }
}

function tabloyuDoldur(muayeneler) {
    const tbody = document.getElementById("muayenelerTablo");
    tbody.innerHTML = "";

    muayeneler.forEach(muayene => {
        const tarih = {
            tarih: muayene.muayene_tarihi,
            saat: muayene.muayene_saati
        };
        const ilkHarf = muayene.hayvan_adi.charAt(0).toUpperCase();
        const avatarClass = avatarSinifiBelirle(muayene.tur);
        const durumClass = durumSinifiBelirle(muayene.durum);

        const satir = `
            <tr>
                <td>
                    <strong>${tarih.tarih}</strong>
                    <p>${tarih.saat}</p>
                </td>

                <td>
                    <div class="pet-info">
                        <span class="pet-avatar ${avatarClass}">${ilkHarf}</span>
                        <div>
                            <strong>${muayene.hayvan_adi}</strong>
                            <p>${muayene.tur}</p>
                        </div>
                    </div>
                </td>

                <td>${muayene.sahip_adi}</td>

                <td>
                    <div class="exam-summary">
                        <p><strong>Şikayet:</strong> ${muayene.sikayet || "Belirtilmedi"}</p>
                        <p><strong>Tanı:</strong> ${muayene.tani || "Belirtilmedi"}</p>
                        <p><strong>Tedavi:</strong> ${muayene.tedavi_aciklamasi || "Belirtilmedi"}</p>
                    </div>
                </td>

                <td>
                    <span class="status ${durumClass}">
                        ${muayene.durum}
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

const tarih = {
    tarih: muayene.muayene_tarihi,
    saat: muayene.muayene_saati
};

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
    if (!durum) return "done";

    const temizDurum = durum.toLowerCase();

    if (temizDurum.includes("tamam")) {
        return "done";
    }

    if (temizDurum.includes("kontrol")) {
        return "control";
    }

    if (temizDurum.includes("takip")) {
        return "follow";
    }

    return "done";
}