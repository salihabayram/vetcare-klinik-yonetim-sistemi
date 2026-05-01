const { getConnection } = require("../db");

const sahipleriListele = async (req, res) => {
    try {
        const pool = await getConnection();

        const result = await pool.request().query(`
            SELECT 
                hs.sahip_id,
                hs.ad_soyad,
                hs.telefon,
                hs.email,
                hs.adres,
                hs.aktif_mi,
                hs.kayit_tarihi,
                COUNT(h.hayvan_id) AS hayvan_sayisi
            FROM HayvanSahipleri hs
            LEFT JOIN Hayvanlar h
                ON hs.sahip_id = h.sahip_id
                AND h.aktif_mi = 1
            WHERE hs.aktif_mi = 1
            GROUP BY 
                hs.sahip_id,
                hs.ad_soyad,
                hs.telefon,
                hs.email,
                hs.adres,
                hs.aktif_mi,
                hs.kayit_tarihi
            ORDER BY hs.sahip_id DESC
        `);

        res.json({
            success: true,
            data: result.recordset
        });

    } catch (error) {
        console.error("Hayvan sahipleri listeleme hatası:", error);

        res.status(500).json({
            success: false,
            message: "Hayvan sahipleri listelenirken hata oluştu.",
            error: error.message
        });
    }
};

module.exports = {
    sahipleriListele
};