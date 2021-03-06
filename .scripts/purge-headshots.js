const fs = require('fs');
const csv = require('fast-csv');
const slug = require('slug');
const house = 'us-house/data/us-house.csv';
const headshots = './source/headshots';
const img64 = './us-house/images/headshots/64x64';
const img128 = './us-house/images/headshots/128x128';
const img256 = './us-house/images/headshots/256x256';
const img512 = './us-house/images/headshots/512x512';
const img1024 = './us-house/images/headshots/1024x1024';

let current = [];
let keepers = [];

fs.readdir(headshots, (err, files) => {
  files.forEach(file => {
    current.push(file);
  });
});

if (fs.existsSync(house)) {
  var stream = fs.createReadStream(house);
  csv.parseStream(stream, { headers : true }).on('data', (data) => {
    keepers.push(`${slug(data.first_name + ' ' + data.last_name, { lower: true, replacement: '-' })}.jpg`);
  }).on('end', () => {
    if (keepers.length > 0) {
      // Loop through current headshots and see if we want to keep it, if not, delete it
      current.forEach(img => {
        if (keepers.indexOf(img) === -1) {
          console.log(`PURGING: ${img} ...`);

          try { fs.unlinkSync(`${headshots}/${img}`); } catch (err) {}
          try { fs.unlinkSync(`${img64}/${img}`); } catch (err) {}
          try { fs.unlinkSync(`${img128}/${img}`); } catch (err) {}
          try { fs.unlinkSync(`${img256}/${img}`); } catch (err) {}
          try { fs.unlinkSync(`${img512}/${img}`); } catch (err) {}
          try { fs.unlinkSync(`${img1024}/${img}`); } catch (err) {}
        }
      })

      console.log("\n✓ PURGE COMPLETE\n");
    }
  });
} else {
  console.log(house + ' not found');
}
