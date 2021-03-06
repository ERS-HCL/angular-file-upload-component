const IncomingForm = require('formidable').IncomingForm;
const fs = require('fs');

module.exports = function upload(req, res) {
  var form = new IncomingForm();
  let readStream;
  form.on('file', (field, file) => {
    // Do something with the file
    // e.g. save it to the database
    // you can access it using file.path
    readStream = fs.createReadStream(file.path);
  });
  form.on('end', () => {
    res.json();
  });
  form.parse(req);
  form.on('error', function(err) {
    console.log(err);
  });
  form.on('progress', function(bytesReceived, bytesExpected) {
    console.log(bytesReceived);
    console.log(bytesExpected);
  });
};
