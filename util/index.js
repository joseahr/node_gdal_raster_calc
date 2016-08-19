const bPromise 		= require('bluebird');

const readDir 		= bPromise.promisify(require('fs').readdir);

const Exec 			= bPromise.promisify(require('child_process').exec);

const cmdOptions 	= require('./opts');

const getAlpha 		= length => {
    let letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = letters.substr(0, length).split('');
    for (let i = 1, numberedCount = Math.floor((length - 1)/26); i <= numberedCount; i++) {
        length -= letters.length;
        result.push.apply(result,
            letters.substr(0, length).replace(/./g, '$&' + i + ' ').trim().split(' '));
    }
    return result;
};
const reg 			= /.*p$/; // Regex detecto p al final del archivo
// Comprueba que sea el tipo de archivo que se quiere
const rasterFile 	= ({name}) => reg.exec(name);
// Coge el fichero raster y obtiene la fecha
const parseDate 	= ({name}) => new Date(
	+name.substring(name.length - 5, name.length - 1), 
	+name.substring(name.length - 7, name.length - 5) - 1, 
	+name.substring(0, name.length - 7)
);

module.exports = {
	readDir,
	getAlpha,
	Exec,
	rasterFile,
	parseDate,
	cmdOptions
}