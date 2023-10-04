
const net = require('net');

module.exports = class status {
    constructor(ip = '0.0.0.0', port = 25565) {
        this.ip = ip
        this.port = port
    }

    getStatus() {
        return new Promise((resolve) => {
            let start = new Date();
            let infosStatus = net.connect(this.port, this.ip, () => {
                infosStatus.write(Buffer.from([0xFE, 0x01]))
            });


            infosStatus.setTimeout(5 * 1000)

            infosStatus.on('data', (data) => {
                if (data != null && data != '') {
                    let infos = data.toString().split("\x00\x00\x00")
                    resolve({
                        error: false,
                        ms: Math.round(new Date() - start),
                        version: infos[2].replace(/\u0000/g, ''),
                        nameServer: infos[3].replace(/\u0000/g, ''),
                        playersConnect: infos[4].replace(/\u0000/g, ''),
                        playersMax: infos[5].replace(/\u0000/g, '')
                    })
                } else if (data == null) {
                    resolve({
                        error: true,
                        ms: "------",
                        version: "------",
                        nameServer: "Le serveur est hors ligne",
                        playersConnect: "------",
                        playersMax: "------",
                    })
                }

                infosStatus.end()
            });

            infosStatus.on('timeout', () => {
                resolve({
                    error: true,
                    ms: "------",
                    version: "------",
                    nameServer: "Le serveur est hors ligne",
                    playersConnect: "------",
                    playersMax: "------",
                })
                infosStatus.end()

            });

            infosStatus.on('error', (err) => {
                resolve({
                    error: true,
                    ms: "------",
                    version: "------",
                    nameServer: "Le serveur\nest hors ligne",
                    playersConnect: "------",
                    playersMax: "------",
                })
                console.log(err)
                infosStatus.end()
            })
        })
    }

}
