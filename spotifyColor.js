#!/usr/bin/env node

import { exec } from 'child_process';
import { getColorBA } from "./getSpotifyColor.js";

const ip = "192.168.3.200";
const port = 8123;
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiIxNDIwZTM5NzA3NGI0MjVkYjQwMjk5M2Q1ZGE4YmQwNCIsImlhdCI6MTc1NjkxNjUxMCwiZXhwIjoyMDcyMjc2NTEwfQ.K31dfDenAoVP3aaU5U8e0AUWIZB4o8hYxAywio0UQPA"


async function main() {
    const rgb = await getColorBA();
    console.log(rgb)
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
            .then(data => console.log(data))
            .catch(error => console.error("Error turning off light:", error));
    }
}

setInterval(() => {
    main().catch((error) => console.log(error));
}, 2000);


