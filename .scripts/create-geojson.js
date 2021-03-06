var fs = require('fs');
var path = require('path');

var geojson, data;
var geojson_file = path.join(__dirname, '../source/us-house.geojson');
var data_file = path.join(__dirname, '../us-house/data/us-house.json');

var collection = {
  "type": "FeatureCollection",
  "provider": {
    "name": "Civil Services - 117th Congress United States House of Representatives",
    "email": "hello@civil.services",
    "twitter": "https://twitter.com/CivilServiceUSA",
    "homepage": "https://civil.services",
    "repository": "https://github.com/CivilServiceUSA/us-house"
  },
  "features": []
};

/**
 * Get JSON Properties for Given District
 * @param props
 * @returns {*}
 */
function getProperties(props) {
  for (var i = 0; i < data.length; i++) {
    if (data[i].state_code.toString() === props.STATE_ABBR.toString() && (!data[i].district || !props.CDFIPS || parseInt(data[i].district, 10) === parseInt(props.CDFIPS, 10))) {
      return data[i];
    }
  }
}

/**
 * Create Single District Map
 * @param data - GeoJSON Data for District
 */
function createDistrictMap(geoJSON) {
  if (typeof geoJSON.properties === 'object') {
    var district = {
      "type": "Feature",
      "provider": {
        "name": "Civil Services - 117th Congress United States House of Representatives",
        "email": "hello@civil.services",
        "twitter": "https://twitter.com/CivilServiceUSA",
        "homepage": "https://civil.services",
        "repository": "https://github.com/CivilServiceUSA/us-house"
      },
      "properties": geoJSON.properties,
      "geometry": geoJSON.geometry
    };

    var districtID = (parseInt(geoJSON.properties.district, 10) > 0) ? '-' + geoJSON.properties.district : '';
    var filename = 'us-house/geojson/us-house-' + geoJSON.properties.state_code_slug + districtID + '.geojson';
    fs.writeFile(filename, JSON.stringify(district), function (){});

    console.log('✓ Created ./' + filename);
  } else {
    console.error('× Invalid Data: ' + geoJSON.state_name + ' ' + geoJSON.district);
  }
}

/**
 * Create All Districts Map
 */
function createDistrictsMap() {
  var filename = 'us-house/geojson/us-house.geojson';
  fs.writeFile(filename, JSON.stringify(collection), function (){});

  console.log('✓ Created ./' + filename);
}


if (!fs.existsSync(geojson_file)) {
  console.error('× Missing GeoJSON Source: ' + geojson_file.replace(path.join(__dirname, '../'), './'));
} else if (!fs.existsSync(data_file)) {
  console.error('× Missing JSON Data: ' + data_file.replace(path.join(__dirname, '../'), './'));
} else {

  geojson = JSON.parse(fs.readFileSync(geojson_file, 'utf8'));
  data = JSON.parse(fs.readFileSync(data_file, 'utf8'));

  for (var i = 0; i < geojson.features.length; i++) {
    var currentProps  = geojson.features[i].properties;

    if (currentProps.CDFIPS !== '98') {
      geojson.features[i].properties = getProperties(currentProps);
      collection.features.push(geojson.features[i]);
      createDistrictMap(geojson.features[i]);
    }
  }

  createDistrictsMap();

  console.log('\n☆ GeoJSON Creation Completed ' + '\n');
}
