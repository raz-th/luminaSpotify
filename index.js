#!/usr/bin / env node
import { exec } from 'child_process';
const ip = "192.168.3.200";
const port = 8123;
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiIxNDIwZTM5NzA3NGI0MjVkYjQwMjk5M2Q1ZGE4YmQwNCIsImlhdCI6MTc1NjkxNjUxMCwiZXhwIjoyMDcyMjc2NTEwfQ.K31dfDenAoVP3aaU5U8e0AUWIZB4o8hYxAywio0UQPA"


function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
    ] : null;
}


const getAlbumId = () => {
    return new Promise((resolve, reject) => {
        exec('playerctl metadata xesam:url', async (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error.message}`);
                return reject(error);
            }
            if (stderr) {
                console.error(`Stderr: ${stderr}`);
                return reject(new Error(stderr));
            }
            try {
                const url = stdout.trim()
                resolve(url.split("/track/", 2)[1])
            } catch (err) {
                reject(err);
            }
        });
    })
}

const getColor = (id) => {
    return new Promise((resolve, reject) => {
        try {
            fetch(`https://open.spotify.com/track/${id}`).then((v) => v.text()).then((data) => {
                const style = data.split('<div class="gsyf5AkxvVEMilYkkHdr"')[1].split(">", 1)[0].trim()
                const hex = style.split('style="background:linear-gradient(', 2)[1].split(" ", 1)[0]
                resolve(hexToRgb(hex))
            }).catch((e) => { return e })
        } catch (e) { reject(e) }
    })
}





async function main() {
    getAlbumId().then((id) => {
        // console.log(id)
        getColor(id).then((rgb) => {
            // console.log(rgb)
            if (rgb) {
                fetch(`http://${ip}:${port}/api/services/light/turn_on`, {
                    method: 'POST',
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        entity_id: "light.tapo_light_strip_79a2_light_bulb",
                        rgb_color: rgb,

                    })
                })
                    .then(response => response.json())
                    .then(data => {})
                    .catch(error => console.error("Error turning on light:", error));
            }
        })
    }).catch((a) => console.error(a))


}

setInterval(() => {
    main().catch((error) => console.log(error));
}, 500);


