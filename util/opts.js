const GetOpt = require('node-getopt');

const options = [
  ['o' , 'outdir=ARG'  		   , 'Directorio de datos'],
  ['d' , 'directories=ARG+' 	   , 'Directorio de salida'],
  ['h' , 'help'                , 'muestra información de las opciones'],
  ['v' , 'version'             , 'show version']
];

module.exports = new GetOpt(options).bindHelp();