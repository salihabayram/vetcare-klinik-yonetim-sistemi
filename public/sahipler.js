document.addEventListener("DOMContentLoaded", () => {
    sahipleriGetir();
});

async function sahipleriGetir() {
    try {
        const response = await fetch("/api/sahipler");
        const result = await response.json();

        if (!result.success) {
            console.error("Hayvan sahipleri getirilemedi:", result.message);
            return;
        }

        tabloyuDoldur(result.data);

    } catch (error) {
        console.error("API bağlantı hatası:", error);
    }
}

function tabloyuDoldur(sahipler) {
    const tbody = document.getElementById("sahiplerTablo");
    tbody.innerHTML = "";

    sahipler.forEach(sahip => {
        const basHarfler = basHarfleriAl(sahip.ad_soyad);
        const kayitNo = `HS-${String(sahip.sahip_id).padStart(4, "0")}`;
        const hayvanText = sahip.hayvan_sayisi > 0
            ? `${sahip.hayvan_sayisi} Hayvan`
            : "Hayvan Yok";

        const satir = `
            <tr>
                <td>
                    <div class="owner-info">
                        <span>${basHarfler}</span>
                        <div>
                            <strong>${sahip.ad_soyad}</strong>
                            <p>Kayıt No: ${kayitNo}</p>
                        </div>
                    </div>
                </td>

                <td>${sahip.telefon || "Belirtilmedi"}</td>

                <td>${sahip.email || "Belirtilmedi"}</td>

                <td>${hayvanText}</td>

                <td><span class="status active">Aktif</span></td>

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