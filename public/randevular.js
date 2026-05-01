document.addEventListener("DOMContentLoaded", () => {
    randevulariGetir();
});

async function randevulariGetir() {
    try {
        const response = await fetch("/api/randevular");
        const result = await response.json();

        if (!result.success) {
            console.error("Randevular getirilemedi:", result.message);
            return;
        }

        tabloyuDoldur(result.data);

    } catch (error) {
        console.error("API bağlantı hatası:", error);
    }
}

function tabloyuDoldur(randevular) {
    const tbody = document.getElementById("randevularTablo");
    tbody.innerHTML = "";

    randevular.forEach(randevu => {
        const tarih = tarihFormatla(randevu.randevu_tarihi);
        const saat = saatFormatla(randevu.randevu_saati);
        const ilkHarf = randevu.hayvan_adi.charAt(0).toUpperCase();
        const avatarClass = avatarSinifiBelirle(randevu.tur);
        const durumClass = durumSinifiBelirle(randevu.durum);

        const satir = `
            <tr>
                <td>
                    <strong>${saat}</strong>
                    <p>${tarih}</p>
                </td>

                <td>
                    <div class="pet-info">
                        <span class="pet-avatar ${avatarClass}">${ilkHarf}</span>
                        <div>
                            <strong>${randevu.hayvan_adi}</strong>
                            <p>${randevu.tur}</p>
                        </div>
                    </div>
                </td>

                <td>${randevu.sahip_adi}</td>

                <td>${randevu.veteriner_adi}</td>

                <td>${randevu.islem_turu}</td>

                <td>
                    <span class="status ${durumClass}">
                        ${randevu.durum}
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

function tarihFormatla(tarih) {
    if (!tarih) return "-";

    const date = new Date(tarih);

    return date.toLocaleDateString("tr-TR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });
}

function saatFormatla(saat) {
    if (!saat) return "-";
    return saat;
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
    if (!durum) return "waiting";

    const temizDurum = durum.toLowerCase();

    if (temizDurum.includes("tamam")) {
        return "done";
    }

    if (temizDurum.includes("iptal")) {
        return "cancelled";
    }

    return "waiting";
}