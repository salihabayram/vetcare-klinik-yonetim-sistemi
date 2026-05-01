const { getConnection } = require("../db");

const login = async (req, res) => {
    try {
        const { email, sifre } = req.body;

        if (!email || !sifre) {
            return res.status(400).json({
                success: false,
                message: "E-posta ve şifre alanları zorunludur."
            });
        }

        const pool = await getConnection();

        const result = await pool.request()
            .input("email", email)
            .input("sifre", sifre)
            .query(`
                SELECT 
                    k.kullanici_id,
                    k.ad_soyad,
                    k.email,
                    k.telefon,
                    k.aktif_mi,
                    r.rol_adi
                FROM Kullanicilar k
                INNER JOIN Roller r
                    ON k.rol_id = r.rol_id
                WHERE 
                    k.email = @email
                    AND k.sifre = @sifre
                    AND k.aktif_mi = 1
            `);

        if (result.recordset.length === 0) {
            return res.status(401).json({
                success: false,
                message: "E-posta veya şifre hatalı."
            });
        }

        res.json({
            success: true,
            message: "Giriş başarılı.",
            user: result.recordset[0]
        });

    } catch (error) {
        console.error("Giriş API hatası:", error);

        res.status(500).json({
            success: false,
            message: "Giriş işlemi sırasında hata oluştu.",
            error: error.message
        });
    }
};

const register = async (req, res) => {
    try {
        const { adSoyad, email, telefon, rolId, sifre } = req.body;

        if (!adSoyad || !email || !rolId || !sifre) {
            return res.status(400).json({
                success: false,
                message: "Ad soyad, e-posta, rol ve şifre alanları zorunludur."
            });
        }

        const pool = await getConnection();

        const emailKontrol = await pool.request()
            .input("email", email)
            .query(`
                SELECT kullanici_id
                FROM Kullanicilar
                WHERE email = @email
            `);

        if (emailKontrol.recordset.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Bu e-posta adresiyle kayıtlı bir personel zaten var."
            });
        }

        await pool.request()
            .input("rol_id", Number(rolId))
            .input("ad_soyad", adSoyad)
            .input("email", email)
            .input("sifre", sifre)
            .input("telefon", telefon || null)
            .query(`
                INSERT INTO Kullanicilar
                (rol_id, ad_soyad, email, sifre, telefon)
                VALUES
                (@rol_id, @ad_soyad, @email, @sifre, @telefon)
            `);

        res.status(201).json({
            success: true,
            message: "Personel kaydı başarıyla oluşturuldu."
        });

    } catch (error) {
        console.error("Kayıt API hatası:", error);

        res.status(500).json({
            success: false,
            message: "Kayıt işlemi sırasında hata oluştu.",
            error: error.message
        });
    }
};

module.exports = {
    login,
    register
};