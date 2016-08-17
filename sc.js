//console.log(process.argv);

const fs 			= require('fs'),
	Exec 			= require('child_process').exec,
	path 			= require('path'),
	dataDir 		= './datos', // Directorio de donde coger los archivos raster
	reg 			= /.*p$/, // Regex detecto p al final del archivo

	// Devuelve una letra entre A-Z y A1-Z1 si se supera length > 26
	getNums 		= length => length <= 26 ? 
		Array.from({length}, (el, i)=> String.fromCharCode(i + 65)) : 
		Array.from({length : 26}, (el, i)=> String.fromCharCode(i + 65)).concat(Array.from({length : length - 26}, (el, i)=> String.fromCharCode(i + 65) + 1)),

	// Comprueba que sea el tipo de archivo que se quiere
	_RasterFile 	= file => reg.exec(file),
	// Coge el fichero raster y obtiene la fecha
	_ParseDate 		= date => new Date(
		+date.substring(date.length - 5, date.length - 1), 
		+date.substring(date.length - 7, date.length - 5) - 1, 
		+date.substring(0, date.length - 7)
	),
	// Fecha de hoy
	today 			= new Date(2016, 6, 29),
	// Fecha hace 40 días
	last40days 		= new Date(2016, 6, 29);
	last40days.setDate(last40days.getDate() - 40);

	// Lista de archivos finales
	let listFiles 	= [];
	// nombre del archivo resultante
	let resultRasterName = `${today.getDate()}${today.getMonth() + 1 < 10 ? '0' + (today.getMonth() + 1) : today.getMonth() + 1}${today.getFullYear()}rp.tiff`;

fs.readdir(dataDir, (err, files)=>{
	if(err) return console.error(err);

	// Ficheros filtrados con el Regex
	let rasterFiles = files.filter(_RasterFile);
	// Fecha de los ficheros anteriores
	let dateList 	= rasterFiles.map(_ParseDate);
	// Puesta en común de las dos listas
	listFiles 		= rasterFiles.map( (f, i) => ({
		name 	: f,
		path 	: dataDir + '/' + f,
		date 	: dateList[i]
	}))
	// Cogiendo los ficheros de los últimos 40 días
	.filter( f => f.date.getTime() >= last40days.getTime() )
	// Ordenándolas por fecha
	.sort( (a, b) => b.date.getTime() - a.date.getTime() );

	// Array de letras en base a el número de archivos
	let ArrayLetras = getNums(listFiles.length);

	// Expresión de los cálculos a realizar ej : A + B + C + ...
	let calc = ArrayLetras.join(' + ');

	// Comando final que se ejecutará ej: gdal_calc.py -A ./datos/10072016p -B ... --calc="expresión" --outfile nombreArchivoFinal.tiff
	let exec = listFiles.reduce( (execString, file, idx) => execString + '-' + ArrayLetras[idx] + ' ' + file.path + ' ', 'gdal_calc.py ') + 
		'--calc="' + calc + '" --outfile ' + resultRasterName;

	console.log('executing...', exec);

	Exec(exec, (error, stdout, stderr)=>{
		console.log(stdout);
	});
})
