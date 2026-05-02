import chalk from 'chalk';
import { exec } from 'child_process';
import { getPaletteFromURL } from 'color-thief-node';


const threshold = 50;

let past = "";

// Main
export function getColorBA() {
    return new Promise((resolve, reject) => {
        exec('playerctl metadata mpris:artUrl', async (error, stdout, stderr) => {
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
                if (url !== past) {
                    const colorPalette = await getPaletteFromURL(stdout.trim());
                    const filteredPalette = colorPalette.filter((color) => {
                        const [r, g, b] = color;
                        // A color is kept if at least one of its RGB values is above the threshold
                        return r > threshold || g > threshold || b > threshold;
                    });
                    filteredPalette.forEach((v, i) => {
                        const [r, g, b] = colorPalette[i];
                        if (r > threshold || g > threshold || b > threshold) {
                            console.log(
                                'Dominant Color:',
                                chalk.rgb(r, g, b)(`rgb(${r}, ${g}, ${b})`)
                            );
                        }
                    });
                    console.log('Color Pallete:\n', colorPalette);
                    past = url;
                    resolve(colorPalette[0]);
                } else {
                    return null
                }
            } catch (err) {
                reject(err);
            }
        });
    });
}

// getColorBA()


