document.addEventListener("DOMContentLoaded", () => {
    odemeleriGetir();
});

async function odemeleriGetir() {
    try {
        const response = await fetch("/api/odemeler");
        const result = await response.json();

        if (!result.success) {
            console.error("Ödeme kayıtları getirilemedi:", result.message);
            return;
        }

        tabloyuDoldur(result.data);

    } catch (error) {
        console.error("API bağlantı hatası:", error);
    }
}

function tabloyuDoldur(odemeler) {
    const tbody = document.getElementById("odemelerTablo");
    tbody.innerHTML = "";

    odemeler.forEach(odeme => {
        const basHarfler = basHarfleriAl(odeme.sahip_adi);
        const kayitNo = `HS-${String(odeme.sahip_id).padStart(4, "0")}`;
        const durumClass = durumSinifiBelirle(odeme.durum);
        const tutar = tutarFormatla(odeme.tutar);

        const odemeTarihi = odeme.odeme_tarihi || "Bekleniyor";

        const satir = `
            <tr>
                <td>
                    <div class="owner-info">
                        <span>${basHarfler}</span>
                        <div>
                            <strong>${odeme.sahip_adi}</strong>
                            <p>${kayitNo}</p>
                        </div>
                    </div>
                </td>

                <td>${odeme.hayvan_adi}</td>

                <td>${odeme.islem_adi}</td>

                <td><strong>${tutar}</strong></td>

                <td>${odemeTarihi}</td>

                <td>
                    <span class="status ${durumClass}">
                        ${odeme.durum}
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

function basHarfleriAl(adSoyad) {
    if (!adSoyad) return "?";

    const parcalar = adSoyad.trim().split(" ");

    if (parcalar.length === 1) {
        return parcalar[0].charAt(0).toUpperCase();
    }

    const ilkHarf = parcalar[0].charAt(0).toUpperCase();
    const sonHarf = parcalar[parcalar.length - 1].charAt(0).toUpperCase();

    return ilkHarf + sonHarf;
}

function tutarFormatla(tutar) {
    if (tutar === null || tutar === undefined) {
        return "0 TL";
    }

    return `${Number(tutar).toLocaleString("tr-TR")} TL`;
}

function durumSinifiBelirle(durum) {
    if (!durum) return "waiting";

    const temizDurum = durum.toLowerCase();

    if (temizDurum.includes("ödendi") || temizDurum.includes("odendi")) {
        return "paid";
    }

    if (temizDurum.includes("bekliyor")) {
        return "waiting";
    }

    if (temizDurum.includes("iade") || temizDurum.includes("iptal")) {
        return "refund";
    }

    return "waiting";
}