const express = require("express"),
      rashiRouter = express.Router(),
      request = require('request'),
      fs = require('fs'),
      path = require('path'),
      accessToken = require('../accessToken.json');

 const {getNakhatra} = require('./MasterRouter')   

rashiRouter.post('/kundali', (req, res) => {
    var ayanamsa = 1,
    user_id = 2,
    coordinates = '22.569722,88.369722',
    datetime = '1996-05-29T07:15:00Z',
    lang = 'en';
    var options = {
        'method': 'GET',
        'url': `https://api.prokerala.com/v2/astrology/planet-position?ayanamsa=${ayanamsa}&coordinates=${coordinates}&datetime=${datetime}&la=${lang}`,
        'headers': {
            'Accept': 'application/json',
            'Authorization': `Bearer ${accessToken.token}`
        }
    };
    request(options, async function (error, response) {
        if (error) throw new Error(error);
        // console.log(response.body);
        else{
            var data = JSON. parse(response.body)
            file_name = user_id+'-'+datetime.split(':').join('-');
            fs.writeFileSync(path.join(__dirname, `../raw_data/${file_name}.json`),JSON.stringify(data), 'utf-8')
            var arr =[]
            for(i=0; i<data.data.planet_position.length; i++){
                 nakhatra_name = await getNakhatra(data.data.planet_position[i].degree,data.data.planet_position[i].position)
                 console.log(nakhatra_name);
                 var planet = {
                           "planet_name" : data.data.planet_position[i].name,
                           "position" : data.data.planet_position[i].position,
                           "degree" : data.data.planet_position[i].degree,
                           "rashi_name" : data.data.planet_position[i].rasi.name,
                           "lord_name" : data.data.planet_position[i].rasi.lord.name,
                           "verdic_name" : data.data.planet_position[i].rasi.lord.vedic_name,
                           "nakhatra_name" : nakhatra_name.msg[0].nakhatra,
                           "from_deg" : nakhatra_name.msg[0].from_deg,
                           "to_deg" : nakhatra_name.msg[0].to_deg
                        }
                 arr.push(planet)   
            }
         res.send(arr)
        }
        
        // res.send(response.body)
       
    });
 
})

module.exports= {rashiRouter}