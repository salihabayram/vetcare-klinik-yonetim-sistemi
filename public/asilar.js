document.addEventListener("DOMContentLoaded", () => {
    asilariGetir();
});

async function asilariGetir() {
    try {
        const response = await fetch("/api/asilar");
        const result = await response.json();

        if (!result.success) {
            console.error("Aşı kayıtları getirilemedi:", result.message);
            return;
        }

        tabloyuDoldur(result.data);

    } catch (error) {
        console.error("API bağlantı hatası:", error);
    }
}

function tabloyuDoldur(asilar) {
    const tbody = document.getElementById("asilarTablo");
    tbody.innerHTML = "";

    asilar.forEach(asi => {
        const ilkHarf = asi.hayvan_adi.charAt(0).toUpperCase();
        const avatarClass = avatarSinifiBelirle(asi.tur);
        const durumClass = durumSinifiBelirle(asi.durum);

        const satir = `
            <tr>
                <td>
                    <div class="pet-info">
                        <span class="pet-avatar ${avatarClass}">${ilkHarf}</span>
                        <div>
                            <strong>${asi.hayvan_adi}</strong>
                            <p>${asi.tur}</p>
                        </div>
                    </div>
                </td>

                <td>${asi.sahip_adi}</td>

                <td>${asi.asi_adi}</td>

                <td>${asi.yapilma_tarihi || "-"}</td>

                <td>${asi.sonraki_doz_tarihi || "-"}</td>

                <td>
                    <span class="status ${durumClass}">
                        ${asi.durum}
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

    if (temizDurum.includes("yaklaş") || temizDurum.includes("yaklas")) {
        return "upcoming";
    }

    if (temizDurum.includes("tamam")) {
        return "done";
    }

    if (temizDurum.includes("gecik")) {
        return "late";
    }

    return "done";
}