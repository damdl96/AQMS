const express = require('express');
const socketIO=require('socket.io');
const http = require('http');

const app = express();
const server =  http.createServer(app);
const io = socketIO.listen(server);

let temperature,tVOC,Co2,humidity;

app.use(express.static('public/'));
app.get('/',(req,res,next)=> {
    res.sendFile(__dirname + '/views/index.html');
});

const SerialPort = require('serialport');
const Readline = SerialPort.parsers.Readline;
const parser = new Readline();

const mySerial = new SerialPort("COM4",{
    baudRate:9600
});


server.listen(3000,()   => console.log('server on port: ',3000));
io.on('connection',()   => console.log('A new socket has connected'));

mySerial.on("err",err   => console.log(err.message));
mySerial.on("open",()   => console.log("Opened Serial Port"));
mySerial.on("data",data => {

    dataStream=data.toString();
    console.log(dataStream);
    let arr = dataStream.split(",").map(item => item.trim());
    temperature=arr[0];
    tVOC = arr[1];
    Co2= arr[2];
    humidity = arr[3];
    console.log(`Temp:${temperature}, TVOC:${tVOC}, Co2:${Co2}, humidity:${humidity}`);

    io.emit('arduino:temp',{
        value:temperature
    });
    io.emit('arduino:tvoc',{
        value:tVOC
    });
    io.emit('arduino:co2',{
        value:Co2
    });
    io.emit('arduino:hum',{
        value:humidity
    });
    
});
