# T-Rex-s-neural-network

T-Rex's neural network (AI for the game T-Rex / Dinosaur on Google Chrome).

## Learning mode

- Do not import `ai/bot.js` (line 13 in `index.html`).
- Play multiple games (achieve a score of at least 2000 points). Use jumps only.
- All your moves will be recorded. A move is defined by:
    - The current speed,
    - The distance until the next obstacle,
    - The width, height and altitude of this obstacle,
    - Whether you jumped or not.
- Execute `JSON.stringify(getSolutions())` in your console, and put the data into `ai/data.js` (in the `solutions` variable).

## Genetic Algorithms

- Run `node ai/ga.js` to find a possible intelligence for your records.
- Copy+paste the result (the array of numbers) of the last turn (with the best fitness found) into your `ai/bot.js` file (line 20).

## Run the bot

- Revert your modification into `index.html` (by reimporting the `ai/bot.js`)

## How to play without download all these files?

Copy+paste the file [`ai/import.js`](./ai/import.js) into your browser ([`chrome://dino/`](chrome://dino/)), then run:

```js
importAI([-95.56601421853227,-85.36168246829185,5.473159957604986,-2.2524794626783855,4.720944891882393,-7.4916691544085925, 3.7000145778189877,40.06859910598944,53.29819896989174,-44.78287614646953,66.270631606874,-30.201819957694955, 78.24397239483471,-16.543948021956993,67.37003637242792,1.5497033889439737,26.561100252678365,-22.206257738432278, 37.585476245910534,-24.108646500703816,5.2506611682817885,22.481568269598057,-12.369921294821879,-26.53789634952111, -96.61362135206807,-17.173819147522376,-122.38731979320482,26.08437453924002,6.4443673674408,-124.88919981892785, 10.603237872543774,-59.743113935904965,-5.817672852185882,30.60677704355442,-17.32040578223058,-6.90005628155993])
```
