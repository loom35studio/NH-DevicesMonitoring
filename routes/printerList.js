const { db, dbAvailable } = require('./settings.js');

async function getAllPrinters() {
  if (!dbAvailable) {
    console.warn('Database not available, returning empty printer list');
    return [];
  }
  const sql = `SELECT p.*,\n      b.pages AS black_pages, b.percentage AS black_percentage,\n      c.pages AS cyan_pages, c.percentage AS cyan_percentage,\n      y.pages AS yellow_pages, y.percentage AS yellow_percentage,\n      m.pages AS magenta_pages, m.percentage AS magenta_percentage\n    FROM printer p\n    LEFT JOIN black b ON b.printerID = p.ID\n    LEFT JOIN cyan c ON c.printerID = p.ID\n    LEFT JOIN yellow y ON y.printerID = p.ID\n    LEFT JOIN magenta m ON m.printerID = p.ID\n    ORDER BY p.ID`;
  const [rows] = await db.promise().query(sql);
  return rows;
}

async function getPrintersBySociety(society) {
  if (!dbAvailable) {
    console.warn('Database not available, returning empty printer list');
    return [];
  }
  const sql = `SELECT p.*,\n      b.pages AS black_pages, b.percentage AS black_percentage,\n      c.pages AS cyan_pages, c.percentage AS cyan_percentage,\n      y.pages AS yellow_pages, y.percentage AS yellow_percentage,\n      m.pages AS magenta_pages, m.percentage AS magenta_percentage\n    FROM printer p\n    LEFT JOIN black b ON b.printerID = p.ID\n    LEFT JOIN cyan c ON c.printerID = p.ID\n    LEFT JOIN yellow y ON y.printerID = p.ID\n    LEFT JOIN magenta m ON m.printerID = p.ID\n    WHERE LOWER(p.society) = LOWER(?)\n    ORDER BY p.ID`;
  const [rows] = await db.promise().query(sql, [society]);
  return rows;
}

module.exports = {
  getAllPrinters,
  getPrintersBySociety,
};
