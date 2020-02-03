var binary = require('node-binary');
binary.download({
    os: 'darwin',
    arch: 'x64',
    version: 'v13.3.0'
}, '/opt/node', function(error, binaryPath) {
    if(error) throw error;
 
    console.log('The node binary for OS X x64 was downloaded to ' + binaryPath);
});