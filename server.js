const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const { getConnection } = require("./db");
const authRoutes = require("./routes/authRoutes");
const sahipRoutes = require("./routes/sahipRoutes");
const hayvanRoutes = require("./routes/hayvanRoutes");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/auth", authRoutes);
app.use("/api/sahipler", sahipRoutes);
app.use("/api/hayvanlar", hayvanRoutes);

// Giris sayfasi yönlendirmesi
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "giris.html"));
});

// Veritabanı bağlantı test endpoint'i
app.get("/api/test", async (req, res) => {
    try {
        const pool = await getConnection();

        const result = await pool.request().query(`
            SELECT TOP 5 
                hayvan_id,
                hayvan_adi,
                tur,
                cins,
                saglik_durumu
            FROM Hayvanlar
        `);

        res.json({
            success: true,
            message: "Veritabanı bağlantısı başarılı.",
            data: result.recordset
        });
    } catch (error) {
        console.error("API test hatası:", error);

        res.status(500).json({
            success: false,
            message: "Veritabanı bağlantısı başarısız.",
            error: error.message
        });
    }
});





app.get("/api/randevular", async (req, res) => {
    try {
        const pool = await getConnection();

        const result = await pool.request().query(`
            SELECT
                r.randevu_id,
                r.randevu_tarihi,
                CONVERT(VARCHAR(5), r.randevu_saati, 108) AS randevu_saati,
                r.islem_turu,
                r.durum,
                r.aciklama,
                h.hayvan_adi,
                h.tur,
                hs.ad_soyad AS sahip_adi,
                k.ad_soyad AS veteriner_adi
            FROM Randevular r
            INNER JOIN Hayvanlar h
                ON r.hayvan_id = h.hayvan_id
            INNER JOIN HayvanSahipleri hs
                ON r.sahip_id = hs.sahip_id
            INNER JOIN Kullanicilar k
                ON r.veteriner_id = k.kullanici_id
            ORDER BY r.randevu_tarihi DESC, r.randevu_saati DESC
        `);

        res.json({
            success: true,
            data: result.recordset
        });

    } catch (error) {
        console.error("Randevular listeleme hatası:", error);

        res.status(500).json({
            success: false,
            message: "Randevular listelenirken hata oluştu.",
            error: error.message
        });
    }
});

app.get("/api/muayeneler", async (req, res) => {
    try {
        const pool = await getConnection();

        const result = await pool.request().query(`
            SELECT
                m.muayene_id,
                CONVERT(VARCHAR(10), m.muayene_tarihi, 104) AS muayene_tarihi,
                CONVERT(VARCHAR(5), m.muayene_tarihi, 108) AS muayene_saati,
                m.sikayet,
                m.tani,
                m.tedavi_aciklamasi,
                m.durum,
                m.kontrol_gerekli_mi,
                m.kontrol_tarihi,
                h.hayvan_adi,
                h.tur,
                hs.ad_soyad AS sahip_adi,
                k.ad_soyad AS veteriner_adi
            FROM Muayeneler m
            INNER JOIN Hayvanlar h
                ON m.hayvan_id = h.hayvan_id
            INNER JOIN HayvanSahipleri hs
                ON m.sahip_id = hs.sahip_id
            INNER JOIN Kullanicilar k
                ON m.veteriner_id = k.kullanici_id
            ORDER BY m.muayene_tarihi DESC
        `);

        res.json({
            success: true,
            data: result.recordset
        });

    } catch (error) {
        console.error("Muayeneler listeleme hatası:", error);

        res.status(500).json({
            success: false,
            message: "Muayeneler listelenirken hata oluştu.",
            error: error.message
        });
    }
});

app.get("/api/asilar", async (req, res) => {
    try {
        const pool = await getConnection();

        const result = await pool.request().query(`
            SELECT
                a.asi_id,
                a.asi_adi,
                CONVERT(VARCHAR(10), a.yapilma_tarihi, 104) AS yapilma_tarihi,
                CONVERT(VARCHAR(10), a.sonraki_doz_tarihi, 104) AS sonraki_doz_tarihi,
                a.durum,
                a.aciklama,
                h.hayvan_adi,
                h.tur,
                hs.ad_soyad AS sahip_adi
            FROM Asilar a
            INNER JOIN Hayvanlar h
                ON a.hayvan_id = h.hayvan_id
            INNER JOIN HayvanSahipleri hs
                ON h.sahip_id = hs.sahip_id
            ORDER BY a.sonraki_doz_tarihi ASC
        `);

        res.json({
            success: true,
            data: result.recordset
        });

    } catch (error) {
        console.error("Aşılar listeleme hatası:", error);

        res.status(500).json({
            success: false,
            message: "Aşılar listelenirken hata oluştu.",
            error: error.message
        });
    }
});

app.get("/api/tedaviler", async (req, res) => {
    try {
        const pool = await getConnection();

        const result = await pool.request().query(`
            SELECT
                t.tedavi_id,
                t.ilac_adi,
                t.doz,
                t.kullanim_suresi,
                CONVERT(VARCHAR(10), t.baslangic_tarihi, 104) AS baslangic_tarihi,
                CONVERT(VARCHAR(10), t.bitis_tarihi, 104) AS bitis_tarihi,
                t.durum,
                t.aciklama,
                h.hayvan_adi,
                h.tur,
                hs.ad_soyad AS sahip_adi
            FROM Tedaviler t
            INNER JOIN Hayvanlar h
                ON t.hayvan_id = h.hayvan_id
            INNER JOIN HayvanSahipleri hs
                ON h.sahip_id = hs.sahip_id
            ORDER BY t.baslangic_tarihi DESC
        `);

        res.json({
            success: true,
            data: result.recordset
        });

    } catch (error) {
        console.error("Tedaviler listeleme hatası:", error);

        res.status(500).json({
            success: false,
            message: "Tedaviler listelenirken hata oluştu.",
            error: error.message
        });
    }
});

app.get("/api/odemeler", async (req, res) => {
    try {
        const pool = await getConnection();

        const result = await pool.request().query(`
            SELECT
                o.odeme_id,
                o.islem_turu,
                o.islem_adi,
                o.tutar,
                CONVERT(VARCHAR(10), o.odeme_tarihi, 104) AS odeme_tarihi,
                o.odeme_yontemi,
                o.durum,
                o.aciklama,
                h.hayvan_adi,
                hs.sahip_id,
                hs.ad_soyad AS sahip_adi
            FROM Odemeler o
            INNER JOIN Hayvanlar h
                ON o.hayvan_id = h.hayvan_id
            INNER JOIN HayvanSahipleri hs
                ON o.sahip_id = hs.sahip_id
            ORDER BY o.odeme_id DESC
        `);

        res.json({
            success: true,
            data: result.recordset
        });

    } catch (error) {
        console.error("Ödemeler listeleme hatası:", error);

        res.status(500).json({
            success: false,
            message: "Ödemeler listelenirken hata oluştu.",
            error: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`VetCare+ server ${PORT} portunda çalışıyor.`);
});