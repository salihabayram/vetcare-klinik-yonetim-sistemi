document.addEventListener("DOMContentLoaded", () => {
    tedavileriGetir();
});

async function tedavileriGetir() {
    try {
        const response = await fetch("/api/tedaviler");
        const result = await response.json();

        if (!result.success) {
            console.error("Tedavi kayıtları getirilemedi:", result.message);
            return;
        }

        tabloyuDoldur(result.data);

    } catch (error) {
        console.error("API bağlantı hatası:", error);
    }
}

function tabloyuDoldur(tedaviler) {
    const tbody = document.getElementById("tedavilerTablo");
    tbody.innerHTML = "";

    tedaviler.forEach(tedavi => {
        const ilkHarf = tedavi.hayvan_adi.charAt(0).toUpperCase();
        const avatarClass = avatarSinifiBelirle(tedavi.tur);
        const durumClass = durumSinifiBelirle(tedavi.durum);

        const satir = `
            <tr>
                <td>
                    <div class="pet-info">
                        <span class="pet-avatar ${avatarClass}">${ilkHarf}</span>
                        <div>
                            <strong>${tedavi.hayvan_adi}</strong>
                            <p>${tedavi.tur}</p>
                        </div>
                    </div>
                </td>

                <td>${tedavi.sahip_adi}</td>

                <td>${tedavi.ilac_adi}</td>

                <td>${tedavi.doz || "-"}</td>

                <td>${tedavi.kullanim_suresi || "-"}</td>

                <td>
                    <span class="status ${durumClass}">
                        ${tedavi.durum}
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
    if (!durum) return "active";

    const temizDurum = durum.toLowerCase();

    if (temizDurum.includes("aktif")) {
        return "active";
    }

    if (temizDurum.includes("tamam")) {
        return "done";
    }

    if (temizDurum.includes("kontrol")) {
        return "control";
    }

    return "active";
}