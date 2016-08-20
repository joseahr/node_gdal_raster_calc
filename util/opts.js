const GetOpt 	= require('node-getopt');

const options 	= [
  ['o' , 'outdir=ARG'				, 'Directorio de datos'],
  ['d' , 'directories=ARG+'			, 'Directorio de salida'],
  ['h' , 'help'						, 'muestra información de las opciones'],
  ['v' , 'version'					, 'show version']
];

const getopt 	= new GetOpt(options).bindHelp();

const opts 		= getopt
					//.parse(process.argv.slice(2));
					.parseSystem()
					.options;
if(opts.version){

	const pkg = require('../package.json');

	console.log('version', pkg.version);

	process.exit(0);
}

module.exports = opts;