const BPromise 		= require('bluebird');

const readDir 		= BPromise.promisify(require('fs').readdir);

const Exec 			= BPromise.promisify(require('child_process').exec);

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
const rasterFile 	= file => reg.exec(file);
// Coge el fichero raster y obtiene la fecha
const parseDate 			= date => new Date(
	+date.substring(date.length - 5, date.length - 1), 
	+date.substring(date.length - 7, date.length - 5) - 1, 
	+date.substring(0, date.length - 7)
);

module.exports = {
	readDir,
	getAlpha,
	Exec,
	rasterFile,
	parseDate
}