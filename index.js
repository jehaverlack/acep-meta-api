// ES6
import path from 'path';
import express from 'express';
import https from 'https';
import config from './libs/config.js';
import applib from './libs/app-lib.js';
import apilib from './libs/api-lib.js';

const app = express();
const is_admin = applib.running_as_admin();

// Validate if running with Administrative (Root) permissions is allowed.
if (is_admin && !config.SECURITY.RUN_AS_ADMIN) {
  console.log("ERROR: Running with Administrative permissions is not permitted.");
  console.log("       See: " + config.APP.CONF_FILE);
  process.exit(1);
}