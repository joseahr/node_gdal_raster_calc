const { readDir, getAlpha, Exec, rasterFile, parseDate, 
		cmdOptions : { directories = ['./datos'], outdir = '.'} } 	= require('./util'),
	// Directorio de donde coger los archivos raster
	// Fecha de hoy
	today 			= new Date(2016, 6, 29),
	// Fecha hace 40 días
	last40days 		= new Date(2016, 6, 29);
	last40days.setDate(last40days.getDate() - 40);

	// nombre del archivo resultante
	let resultRasterName = `${today.getDate()}${today.getMonth() + 1 < 10 ? '0' + (today.getMonth() + 1) : today.getMonth() + 1}${today.getFullYear()}rp.tiff`;

Promise.all(directories.map(d =>{
	return readDir(d)
	.then( files => files.map( f => ({ name : f, path : d + '/' + f }) ) )
}))
.then( files =>{
	// Concatenamos los Arrays de objetos (files)
	files = files.reduce( (a, b)=> a.concat(b));
	// Ficheros filtrados con el Regex
	let rasterFiles = files.filter(rasterFile);
	// Fecha de los ficheros anteriores
	let dateList 	= rasterFiles.map(parseDate);
	// Puesta en común de las dos listas
	let listFiles 		= rasterFiles.map( (f, i) => Object.assign(f, {
		date 	: dateList[i]
	}))
	// Cogiendo los ficheros de los últimos 40 días
	.filter( f => f.date.getTime() >= last40days.getTime() )
	// Ordenándolas por fecha
	.sort( (a, b) => b.date.getTime() - a.date.getTime() );

	// Array de letras en base a el número de archivos
	let ArrayLetras = getAlpha(listFiles.length);

	// Expresión de los cálculos a realizar ej : A + B + C + ...
	let calc = ArrayLetras.join(' + ');

	// Comando final que se ejecutará ej: gdal_calc.py -A ./datos/10072016p -B ... --calc="expresión" --outfile nombreArchivoFinal.tiff
	let exec = listFiles.reduce( (execString, file, idx) => `${execString}-${ArrayLetras[idx]} ${file.path} `, 'gdal_calc.py ') + 
		`--calc="${calc}" --outfile ${outdir}/${resultRasterName}`;

	console.log('executing...', exec);

	return Exec(exec);

})
.then( stdout =>{
	console.log(stdout);
	// Comando para reclasificar valores
	let exec = `gdal_calc.py -A ${outdir}/${resultRasterName} --calc="(A*(A<=20)) + (20*(A>20))" --outfile ${outdir}/${resultRasterName} --overwrite`;
	console.log('executing', exec);
	return Exec(exec);
})
.then( stdout =>{
	console.log('Fin', stdout);
})
.catch(console.error.bind(console)); 