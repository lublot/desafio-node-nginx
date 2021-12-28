const mysql = require('mysql')
const express = require('express')
const app = express()

const port = 3000
const dbConfig = {
    host: 'db',
    user: 'root',
    password: 'root',
    database: 'nodedb'
}

app.get('/', async (_, res) => {
    const people = await handleQuery('SELECT * FROM people')
    console.log(people)
    res.send(`
        <h1>FullCycle Rocks!</h1>
        <ul>
            ${people.map((person) => `<li>${person.name}</li>`).join('')}
        </ul>
    `)
})

app.listen(port, async () => {
    console.log(`Server is running on port ${port}`);
    const CREATE_TABLE = `
        CREATE TABLE IF NOT EXISTS people (id INT NOT NULL AUTO_INCREMENT, name VARCHAR(50), PRIMARY KEY (id));
    `;
    await handleQuery(CREATE_TABLE)
    const INSERT_QUERY = `
        INSERT INTO people (name) values ('Emerson'), ('FullCycle'), ('Wesley'), ('Luiz');
    `;
    await handleQuery(INSERT_QUERY)
})

async function handleQuery(sql) {
    const conn = mysql.createConnection(dbConfig);

    const queryPromise = new Promise((resolve, reject) => {
        conn.query(sql, function (error, results) {
            if (error) reject(error);
            resolve(results)
        })
    })

    const queryResults = await queryPromise;
    conn.end();
    return queryResults;
}
