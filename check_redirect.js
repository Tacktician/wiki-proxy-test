let axios = require('axios');
let helper = require('./check_helper');
const { http, https } = require('follow-redirects');

let wiki_map = {};
run();

async function run() {
  wiki_map = await helper.parse_wiki_map();
  await check_redirects();
  // test();
}

async function test() {
  try {
    let url = 'http://www.dorado.com';
    // let url = 'https://wiki.saucelabs.comSelenium+Bootcamp+by+Dave+Haeffner';
    let response = await axios.get(url);
    console.log(response.request.res.responseUrl);
  }
  catch(err) {
    console.log(err);
  }
}

async function check_redirects() {
  let keys = Object.keys(wiki_map);
  for(let i=0;i<keys.length;i++) {
    let src = keys[i];
    let target = wiki_map[src];
    try {
      let response = await axios.get(src);
      let result = response.request.res.responseUrl;
      if(result!==target) {
        console.log(src);
        // console.log(response.status);
        console.log('  EXPECT',target);
        console.log('  ACTUAL',result);
      }
    }
    catch(err) {
      console.log('ERROR',src)
    }
  }
}
