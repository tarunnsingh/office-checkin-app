const { PythonShell } = require("python-shell");

var mno = '9917360131'
var msg = 'hey buddy'
var options = {
    mode: 'text',
    encoding: 'utf8',
    pythonOptions: ['-u'],
    scriptPath: './',
    args: [mno, msg],
    pythonPath: 'C:/Users/Acer/AppData/Local/Programs/Python/Python36/python.exe',
};

var test = new PythonShell('./sms.py', options);
test.on('message', function(message) {
    console.log(message)
});