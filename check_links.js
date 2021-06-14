let axios = require('axios');
let helper = require('./check_helper');

let wiki_map = {};
let source_links = {};
let target_links = {};

run();

async function run() {
  wiki_map = await helper.parse_wiki_map();
  get_unique_links();
  console.log('**** SOURCE LINK ERRORS ****')
  await check_links(source_links);
  console.log('**** TARGET LINK ERRORS ****')
  await check_links(target_links);
}


function get_unique_links() {
  let links = Object.keys(wiki_map);
  for(let i=0;i<links.length;i++) {
    let source = links[i];
    let target = wiki_map[source];
    source_links[source] = source;
    target_links[target] = target;
  }
}

async function check_links(link_map) {
  let links = Object.keys(link_map);
  for(let i=0;i<links.length;i++) {
    let link = links[i];
    try {
      let response = await axios.get(link);
      // console.log('SUCCESS',link);
    }
    catch(err) {
      console.log(link);
    }
  }
}
