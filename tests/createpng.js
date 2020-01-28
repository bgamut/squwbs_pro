const fs = require('fs')
const Spectro = require('spectro')
const PNG = require('pngjs').PNG
console.log('starting init')
const colorMap = {
	'130': '#fff',
	'90': '#f00',
	'40': '#00f',
	'10': '#000',
}
var cFunc = Spectro.colorize(colorMap)

const wFunc = 'Blackman'
var spectro = new Spectro({
	overlap: 0.5,
	wFunc: wFunc
})

console.log('reading file')
var audioFile = fs.createReadStream('/Users/bernardahn/Desktop/tf_data_prep/loops/140_G#m_Dolphin_SoftChords.wav', {start: 44})
audioFile.pipe(spectro)


function createImage(spectrogram) {
    console.log('creating image')
	// Create a png
	var png = new PNG({
		width: spectrogram.length,
		height: spectrogram[0].length,
		filterType: -1
	})
	for (var y = 0; y < png.height; y++) {
		for (var x = 0; x < png.width; x++) {

			// Get the color
			var intensity = spectrogram[x][png.height - y - 1]
			// Now we can use the colorize function to get rgb values for the amplitude
			var col = cFunc(intensity)

			// Draw the pixel
			var idx = (png.width * y + x) << 2
			png.data[idx  ] = col[0]
			png.data[idx+1] = col[1]
			png.data[idx+2] = col[2]
			png.data[idx+3] = 255
        }
        console.log(y/png.height)
	}
	png.pack().pipe(fs.createWriteStream(__dirname + wFunc + '.png'))
	console.log(`Spectrogram written to ${wFunc}.png`)
}

// Capture when the file stream completed
var fileRead = false
audioFile.on('end', () => {fileRead = true,console.log('done reading file')})

spectro.on('data', (err, frame) => {
	// Check if any error occured
	if (err) return console.error('Spectro ended with error:', err)
})

spectro.on('end', (err, data) => {
	// Check if the file was read completely
	if (fileRead !== true) return console.log('Have not finished reading file')
	// Check if any error occured
	if (err) return console.error('Spectro ended with error:', err)
	// Stop spectro from waiting for data and stop all of it's workers
	spectro.stop()
	
	const time = (spectro.getExecutionTime() / 1000) + 's'
	console.log(`Spectrogram created in ${time}`)

	const max = Spectro.maxApplitude(data)
	const min = Spectro.minApplitude(data)
	console.log(`Max amplitude is ${max}, min amplitude is ${min}`)

	createImage(data)
})