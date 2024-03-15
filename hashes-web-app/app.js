const sqlite3 = require('sqlite3').verbose();
const express = require('express');
const app = express();
const port = 3000;

app.use(express.json({limit: '50mb'}));

app.use(express.static('public'));

app.use(express.json());


// Create SQLite database
//const db = new sqlite3.Database(':memory:'); // In-memory database for demonstration purposes

// Provide a file path for the SQLite database
const dbPath = 'mydatabase.db';

// Create a new SQLite database connection
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database at', dbPath);
    }
});



// Create data table
db.serialize(() => {
	db.run("CREATE TABLE IF NOT EXISTS data (id INTEGER PRIMARY KEY AUTOINCREMENT, timestamp TEXT, name TEXT, md5sum TEXT, filename TEXT, filepath TEXT)");
});

app.post('/data', (req, res) => {
	const jsonData = req.body; // Access the entire JSON array directly
	console.log('Received:', jsonData);

	// Insert each object from the array into the SQLite database
	jsonData.forEach(item => {
		db.run(`INSERT INTO data (timestamp, name, md5sum, filename, filepath) VALUES (?, ?, ?, ?, ?)`,
			[item.timestamp, item.name, item.md5sum, item.filename, item.filepath],
			function(err) {
				if (err) {
					console.error(err.message);
				}
			}
		);
	});

	res.send('Data received and stored successfully');
});

app.get('/data', (req, res) => {
    db.all('SELECT * FROM data', (err, rows) => {
        if (err) {
            console.error('Error querying database:', err.message);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            res.json(rows); // Send data as JSON
        }
    });
});


app.get('/data/md5sum/:md5sum', (req, res) => {
    const md5sum = req.params.md5sum;

    db.all('SELECT * FROM data WHERE md5sum = ?', [md5sum], (err, rows) => {
        if (err) {
            console.error('Error querying database:', err.message);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            res.json(rows); // Send data as JSON
        }
    });
});

app.get('/data/filename/:filename', (req, res) => {
    const filename = req.params.filename;

    db.all('SELECT * FROM data WHERE filename = ?', [filename], (err, rows) => {
        if (err) {
            console.error('Error querying database:', err.message);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            res.json(rows); // Send data as JSON
        }
    });
});



// THANKS CHATGPT
// Endpoint to retrieve all elements from the database and display them
app.get('/test', (req, res) => {
	db.all("SELECT * FROM data", (err, rows) => {
		if (err) {
			console.error(err.message);
			res.status(500).send('Internal Server Error');
			return;
		}

		// Render the retrieved data in HTML format
		let html = '<h1>Data from Database</h1>';
		html += '<table border="1"><tr><th>ID</th><th>Timestamp</th><th>Name</th><th>MD5sum</th><th>Filename</th><th>Filepath</th></tr>';
		rows.forEach(row => {
			html += `<tr><td>${row.id}</td><td>${row.timestamp}</td><td>${row.name}</td><td>${row.md5sum}</td><td>${row.filename}</td><td>${row.filepath}</td></tr>`;
		});
		html += '</table>';

		res.send(html);
	});
});

app.listen(port, () => {
	console.log(`Server is listening at http://localhost:${port}`);
});

