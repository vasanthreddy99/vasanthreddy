const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Enter your MySQL password here
    database: 'notesdepot'
});

connection.connect((error) => {
    if (error) {
        console.error('Error connecting to database:', error);
        return;
    }
    console.log('Connected to database');
});

function query(sql, params) {
    return new Promise((resolve, reject) => {
        connection.query(sql, params, (error, results) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(results);
        });
    });
}

async function getDistinctYears() {
    const sql = 'SELECT DISTINCT year FROM notes';
    const rows = await query(sql);
    return rows.map(row => row.year);
}

async function getDistinctSemesters(year) {
    const sql = 'SELECT DISTINCT semester FROM notes WHERE year = ?';
    const rows = await query(sql, [year]);
    return rows.map(row => row.semester);
}

async function getDistinctSubjects(year, semester) {
    const sql = 'SELECT DISTINCT subject FROM notes WHERE year = ? AND semester = ?';
    const rows = await query(sql, [year, semester]);
    return rows.map(row => row.subject);
}

async function getNotes(year, semester, subject) {
    const sql = 'SELECT * FROM notes WHERE year = ? AND semester = ? AND subject = ?';
    const rows = await query(sql, [year, semester, subject]);
    return rows;
}

async function getPdfPathBySubject(subject) {
    const sql = 'SELECT pdf_path FROM notes WHERE subject = ?';
    const rows = await query(sql, [subject]);
    if (rows.length > 0) {
        return rows[0].pdf_path;
    }
    throw new Error('PDF not found');
}

module.exports = {
    getDistinctYears,
    getDistinctSemesters,
    getDistinctSubjects,
    getNotes,
    getPdfPathBySubject
};
