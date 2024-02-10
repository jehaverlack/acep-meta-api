// ES6
import path from 'path';
import fs from 'fs';
import os from 'os';
import { v4 as uuidv4 } from 'uuid';
import xlsx from 'xlsx';
import * as applib from './app-lib.js';
import config from './config.js';


function get_usage(api_key) {
  let usage = {}

  usage['APP'] = {}
  usage['APP']['Name']      = config.PACKAGE.name
  usage['APP']['Desc']      = config.PACKAGE.description
  usage['APP']['Version']   = config.PACKAGE.version + ' (' + config.PACKAGE.version_date + ')'
  usage['APP']['Git']       = config.PACKAGE.repository.url
  usage['APP']['Author']    = config.PACKAGE.author
  usage['APP']['License']   = config.PACKAGE.license
  usage['APP']['Copyright'] = "Copyright " + config.PACKAGE.copyright
  usage['APP']['Org']       = config.PACKAGE.copyright_url
  usage['APP']['Access']    = "Read Only"

  usage['HELP'] = {}
  usage['HELP']['BASE'] = config.WEB.BASE_URL + '/'
  usage['HELP']['HELP'] = config.WEB.BASE_URL + '/help'
  usage['HELP']['USAGE'] = config.WEB.BASE_URL + '/usage'

  usage['CONFIG'] = config.WEB.BASE_URL + '/config'

  usage['API'] = {}
  usage['API']['DESC'] = "API Usage"
  usage['API']['URL']  = config.WEB.BASE_URL + '/api'


  usage['API']['DOCUMENTS'] = {}
  usage['API']['DOCUMENTS']['DESC'] = "List of Available Documents"
  usage['API']['DOCUMENTS']['URL']  = config.WEB.BASE_URL + '/api/documents'

  return usage
}
export { get_usage };


function api_router(req_array) {
  let payload = {}
  payload['CONTENT-TYPE'] = 'application/json'

  // applib.logger(JSON.stringify(req_array, null, 2))

  switch (req_array[0]) {
    case 'xxx':
      // let documents = get_documents()
      // // applib.logger(JSON.stringify(Object.keys(documents['PAYLOAD']), null, 2))
      // if (req_array[1]) {
      //   if (Object.keys(documents['PAYLOAD']).includes(req_array[1]))  {
      //     // applib.logger("DEBUG: Checkpoint 1")
      //     return get_document(req_array)
      //   } else {
      //     // applib.logger("DEBUG: Checkpoint 2")
      //     let err = {}
      //     err['ERROR'] = "Unknown Document: " + req_array[1]
      //     payload['PAYLOAD'] = err
      //     return payload
      //   }
      // } else {
      //   // applib.logger("DEBUG: Checkpoint 3")
      //   return get_documents()
      // }  
    default:
      // applib.logger("DEBUG: Checkpoint 4")

      payload['PAYLOAD'] = get_usage()
      return payload
      break;
  }
}

export { api_router };


function verify_key(api_key) {
  let verfied = false
  for (k in config['CREDENTIALS']['API_KEYS']) {
    if (api_key == config['CREDENTIALS']['API_KEYS'][k]) {
      verfied = true
      applibs.logger('INFO: API_KEY: ' + k)
    }
  }

  return verfied
}


export { verify_key };

function access_denied(resout) {
  let error_res = {}
  error_res['ERROR'] = 'Access Denied'
  resout.writeHead(200, {'Content-Type': 'application/json'})
  resout.end(JSON.stringify(error_res, null, 2))
}

export { access_denied };


function convertCsvToJson(csvText) {
  if (!csvText || typeof csvText !== 'string') {
      throw new Error('Invalid input: CSV text is empty or undefined.');
  }

  const lines = csvText.trim().split('\n');
  if (lines.length < 2) {
      throw new Error('Invalid input: CSV text does not contain valid data.');
  }

  const headers = lines.shift().split(',').map(header => header.trim());
  const jsonArray = [];

  lines.forEach(line => {
      const values = line.split(',');
      const obj = {};

      headers.forEach((header, index) => {
          obj[header] = values[index] ? encodeURIComponent(values[index].trim()) : '';
      });

      jsonArray.push(obj);
  });

  return jsonArray;
}

export { convertCsvToJson };



function convertXlsxToJson(filePath) {
  // Read the Excel file synchronously
  const workbook = xlsx.readFile(filePath);

  // Initialize an empty JSON array to store the data
  const jsonArray = [];

  // Process each sheet in the workbook
  workbook.SheetNames.forEach(sheetName => {
      // Convert the sheet to JSON
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = xlsx.utils.sheet_to_json(worksheet);

      // Add the JSON data to the array
      jsonArray.push({ [sheetName]: jsonData });
  });

  return jsonArray;
}

export { convertXlsxToJson };


// API Query Functions