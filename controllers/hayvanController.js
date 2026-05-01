const { getConnection } = require("../db");

const hayvanlariListele = async (req, res) => {
    try {
        const pool = await getConnection();

        const result = await pool.request().query(`
            SELECT 
                h.hayvan_id,
                h.hayvan_adi,
                h.tur,
                h.cins,
                h.cinsiyet,
                h.dogum_tarihi,
                h.kilo,
                h.saglik_durumu,
                hs.ad_soyad AS sahip_adi
            FROM Hayvanlar h
            INNER JOIN HayvanSahipleri hs 
                ON h.sahip_id = hs.sahip_id
            WHERE h.aktif_mi = 1
            ORDER BY h.hayvan_id DESC
        `);

        res.json({
            success: true,
            data: result.recordset
        });

    } catch (error) {
        console.error("Hayvanlar listeleme hatası:", error);

        res.status(500).json({
            success: false,
            message: "Hayvanlar listelenirken hata oluştu.",
            error: error.message
        });
    }
};

module.exports = {
    hayvanlariListele
};