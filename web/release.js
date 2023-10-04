const { Octokit } = require('@octokit/core');
const fs = require('fs');
const path = require('path');

const octokit = new Octokit({ auth: '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' });

async function downloadLatestReleaseFiles(owner, repo, saveDirectory) {
    try {
        const response = await octokit.request(`GET /repos/${owner}/${repo}/releases/latest`, {
            owner,
            repo,
        });

        const assets = response.data.assets;

        if (assets.length > 0) {
            for (const asset of assets) {
                // Exclure les fichiers avec les extensions ".yml" et ".blockmap"
                if (!['.yml', '.blockmap'].some(extension => asset.name.endsWith(extension))) {
                    const fileResponse = await octokit.request('GET ' + asset.url, {
                        headers: {
                            Accept: 'application/octet-stream',
                        },
                        responseType: 'arraybuffer',
                    });

                    const filePath = path.join(saveDirectory, asset.name);
                    const buffer = Buffer.from(fileResponse.data);
                    fs.writeFileSync(filePath, buffer);
                    console.log(`File downloaded and saved: ${filePath}`);
                }
            }
        } else {
            console.log('No files found in the release.');
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// Remplacez ces valeurs par celles de votre dépôt
const owner = 'RedEarth-mc';
const repo = 'Launcher';
const saveDirectory = './web/public/share'; // Le répertoire où vous souhaitez enregistrer les fichiers

downloadLatestReleaseFiles(owner, repo, saveDirectory);
