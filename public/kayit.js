document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("kayitForm");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const adSoyad = document.getElementById("adSoyad").value.trim();
        const email = document.getElementById("email").value.trim();
        const telefon = document.getElementById("telefon").value.trim();
        const rolId = document.getElementById("rolId").value;
        const sifre = document.getElementById("sifre").value.trim();
        const sifreTekrar = document.getElementById("sifreTekrar").value.trim();
        const mesaj = document.getElementById("mesaj");

        mesaj.textContent = "";
        mesaj.className = "message";

        if (sifre !== sifreTekrar) {
            mesaj.textContent = "Şifreler eşleşmiyor.";
            mesaj.classList.add("error");
            return;
        }

        if (sifre.length < 6) {
            mesaj.textContent = "Şifre en az 6 karakter olmalıdır.";
            mesaj.classList.add("error");
            return;
        }

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    adSoyad,
                    email,
                    telefon,
                    rolId,
                    sifre
                })
            });

            const result = await response.json();

            if (!result.success) {
                mesaj.textContent = result.message || "Kayıt işlemi başarısız.";
                mesaj.classList.add("error");
                return;
            }

            mesaj.textContent = "Personel kaydı başarıyla oluşturuldu. Giriş sayfasına yönlendiriliyorsunuz...";
            mesaj.classList.add("success");

            setTimeout(() => {
                window.location.href = "giris.html";
            }, 1200);

        } catch (error) {
            console.error("Kayıt hatası:", error);
            mesaj.textContent = "Sunucu bağlantı hatası oluştu.";
            mesaj.classList.add("error");
        }
    });
});