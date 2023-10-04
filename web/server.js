const express = require('express');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const https = require('https');
const dotenv = require('dotenv'); dotenv.config();

const app = express();
const port = 3000;


const clientFilesPath = path.join(__dirname, 'client_files');
const releaseFilesPath = path.join(__dirname, 'public', 'share');

app.use('/client_files', express.static(clientFilesPath));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/files', (req, res) => {
    function dirToArray(dir) {
        const result = [];
        const entries = fs.readdirSync(dir, { withFileTypes: true });

        entries.forEach(entry => {
            if (!['.', '..'].includes(entry.name)) {
                const filePath = path.join(dir, entry.name);
                if (entry.isDirectory()) {
                    result.push(...dirToArray(filePath));
                } else {
                    const hash = crypto.createHash('sha1').update(fs.readFileSync(filePath)).digest('hex');
                    const size = fs.statSync(filePath).size;
                    const pathRelativeToClientFiles = path.relative(clientFilesPath, filePath);
                    const url = `http://${req.headers.host}/client_files/${pathRelativeToClientFiles}`;
                    let type = 'FILE';
                    if (pathRelativeToClientFiles.includes('libraries')) {
                        type = 'LIBRARY';
                    } else if (pathRelativeToClientFiles.includes('mods')) {
                        type = 'MOD';
                    } else if (pathRelativeToClientFiles.includes('versions')) {
                        if (path.extname(pathRelativeToClientFiles) === '.json') {
                            type = 'VERSIONCUSTOM';
                        } else if (path.extname(pathRelativeToClientFiles) === '.jar') {
                            type = 'VERSIONS';
                        }
                    }
                    result.push({
                        path: pathRelativeToClientFiles,
                        size: size,
                        sha1: hash,
                        url: url,
                        type: type
                    });
                }
            }
        });

        return result;
    }

    const filesList = dirToArray(clientFilesPath);
    res.json(filesList);
});


app.get('/download', (req, res) => {
    fs.readdir(releaseFilesPath, (err, files) => {
        if (err) {
            return res.status(500).send('Erreur lors de la lecture du répertoire');
        }

        const generateLink = (file) => {
            const filePath = path.join(releaseFilesPath, file);
            let iconClass = '';
           

            if (file.includes('mac')) {
                iconClass = 'fab fa-apple';
             
            } else if (file.includes('win')) {
                iconClass = 'fab fa-windows';
    
            } else if (file.includes('linux')) {
                iconClass = 'fab fa-linux';
    
            }

            return `
            <a href="/share/${file}" target="_blank" class="download-link">
                <i class="${iconClass} fa-3x"></i>
                <span>${file}</span>
            </a>`;
        };

        const linkItems = files.map(generateLink);

        const indexFilePath = path.join(__dirname, 'public', 'index.html');

        fs.readFile(indexFilePath, 'utf8', (err, data) => {
            if (err) {
                return res.status(500).send('Erreur lors de la lecture du fichier index.html');
            }

            // Remove the first four <a> links before <!-- FILE_LIST -->
            const modifiedHTML = data.replace(/(<a[^>]*class="download-link"[^>]*>.*?<\/a>\s*){4}\s*<!-- FILE_LIST -->/s, '<!-- FILE_LIST -->');

            // Insert the generated file links after the removed links
            const finalHTML = modifiedHTML.replace('<!-- FILE_LIST -->', linkItems.join(''));
            res.send(finalHTML);
        });
    });
});



app.get('/new-release-download', (req, res) => {
    const authToken = req.header('Authorization').split(' ')[1];
    // console.log(authToken)
    // console.log(process.env.EXPECTED_AUTH_TOKEN)
    // Vérifier si le jeton d'authentification correspond à celui attendu
    if (authToken === process.env.EXPECTED_AUTH_TOKEN) {
        exec('node ./web/release.js', (error, stdout, stderr) => {
            if (error) {
                console.error(`Erreur lors de l'exécution du fichier : ${error}`);
                // Répondre avec une erreur
                res.status(500).json({ message: 'Erreur lors de l\'exécution du fichier.' });
                return;
            }
        })
        res.status(200).json({ message: 'Téléchargement réussi.' });
    } else {
        // En cas d'authentification incorrecte
        res.status(401).json({ message: 'Accès non autorisé.' });
    }
});

app.get('/theo', (req, res) => {
    const authToken = req.header('Authorization').split(' ')[1];
    // console.log(authToken)
    // console.log(process.env.EXPECTED_AUTH_TOKEN)
    // Vérifier si le jeton d'authentification correspond à celui attendu
    if (authToken === process.env.THEO) {
        exec('sudo ', (error, stdout, stderr) => {
            if (error) {
                console.error(`Erreur lors de l'exécution du fichier : ${error}`);
                // Répondre avec une erreur
                res.status(500).json({ message: 'Erreur lors de l\'exécution du fichier.' });
                return;
            }
        })
        res.status(200).json({ message: 'Téléchargement réussi.' });
    } else {
        // En cas d'authentification incorrecte
        res.status(401).json({ message: 'Accès non autorisé.' });
    }
});


app.get('/', (req, res) => {
    console.log('hey')
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});







app.get('/mods', (req, res) => {
    const modsFilePath = path.join(__dirname, 'public', 'mods.html');
    res.sendFile(modsFilePath);
});

app.get('/modsfile', (req, res) => {
    const modsFilesPath = path.join(__dirname, 'client_files/mods');

    function dirToArray(dir) {
        const result = [];
        const entries = fs.readdirSync(dir, { withFileTypes: true });

        entries.forEach(entry => {
            if (entry.isFile()) {
                const filePath = path.join(dir, entry.name);
                const hash = crypto.createHash('sha1').update(fs.readFileSync(filePath)).digest('hex');
                const size = fs.statSync(filePath).size;
                const modsFilesPath = path.join(__dirname, 'client_files/mods');
                const pathRelativeToClientFiles = path.relative(modsFilesPath, filePath);
                result.push({
                    path: pathRelativeToClientFiles,
                    size: size,
                    sha1: hash,
                });
            }
        });

        return result;
    }

    const filesList = dirToArray(modsFilesPath);
    res.json(filesList);
});







const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './web/client_files/mods');
        cb(null, '../a9d8c9e77858473d8937c3557c49860d/mods');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

app.use(express.static(path.join(__dirname, 'public')));

// Affichage de la page HTML sur la route /upload
app.get('/upload', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'upload.html'));
});

app.post('/upload', upload.single('file'), (req, res) => {
    res.send('Fichier uploadé avec succès');
});

app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, 'public', 'index.html'));
});
/*
const privateKey = fs.readFileSync(path.join(__dirname, 'certificates', 'private-key.pem'), 'utf8');
const certificate = fs.readFileSync(path.join(__dirname, 'certificates', 'certificate.pem'), 'utf8');

const credentials = { key: privateKey, cert: certificate };

const httpsServer = https.createServer(credentials, app);

httpsServer.listen(443, () => {
    console.log('Serveur HTTPS en cours d\'écoute sur le port 443');
});
*/


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
