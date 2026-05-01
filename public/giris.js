document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("girisForm");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const sifre = document.getElementById("sifre").value.trim();
        const mesaj = document.getElementById("mesaj");

        mesaj.textContent = "";
        mesaj.className = "message";

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, sifre })
            });

            const result = await response.json();

            if (!result.success) {
                mesaj.textContent = result.message || "Giriş başarısız.";
                mesaj.classList.add("error");
                return;
            }

            localStorage.setItem("vetcareUser", JSON.stringify(result.user));

            mesaj.textContent = "Giriş başarılı, yönlendiriliyorsunuz...";
            mesaj.classList.add("success");

            setTimeout(() => {
                window.location.href = "anasayfa.html";
            }, 700);

        } catch (error) {
            console.error("Giriş hatası:", error);
            mesaj.textContent = "Sunucu bağlantı hatası oluştu.";
            mesaj.classList.add("error");
        }
    });
});