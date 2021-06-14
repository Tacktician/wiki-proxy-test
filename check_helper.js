let fs = require('fs');

module.exports.parse_wiki_map = async function () {
  let wiki_url = 'https://wiki.saucelabs.com';
  let wiki_map = {};
  let text = fs.readFileSync('./map.conf',{encoding:'utf8', flag:'r'});
  // console.log(text);
  let arr = text.split('\n');
  for(let i=0;i<arr.length;i++) {
    let line = arr[i];
    if(line.startsWith('    /')) {
      line = line.trim().replace(';','').replace('\t',' ').replace(/\s+/g,' ');
      // console.log(line)
      let map = line.split(' ');
      let from = wiki_url + map[0];
      let to = 'https://' + map[1];
      wiki_map[from] = to;
      // console.log(from,to);
    }
  }
  return wiki_map;
}
