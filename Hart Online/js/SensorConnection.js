/**
 * Created by Pestoff on 19.08.2017.
 */

var serialSelect = document.getElementById("SerialSelect");
var confirmButton = document.getElementById("ConfirmButton");
var sensorText = document.getElementById("sensorText");
var sendButton = document.getElementById("sendButton");
var hideButton = document.getElementById("hideButton");
var connectButton = document.getElementById("connectButton");
var sensorText = document.getElementById("sensorText");
var errorMessage = document.getElementById("errorMessage");
var connectionId;

var connectFlag = false;

var data=[0xFF,0xFF,0xFF,0xFF,0xFF,0x02,0x80,0x00,0x00,0x82];
var requesrArray = new Array();
var requestInformation;
// var data=[0xFF,0xFF,0xFF,0xFF,0xFF,0x82,0xA6,0x3B,0x00,0x00,0x00,0x03,0x00,0x1C];
var byteCount = 0;
var ArrayBuf = new Array(data.length);
var Sendbuffer = new Uint8Array(ArrayBuf);
for (var i = 0; i <= data.length; i++)
{
    Sendbuffer[i] = data[i];
}

IntializeLongAddress = function () {
    console.log("инициализация длинного ареса устройва");

    //FIXME нужно послать комманду 0 и извлечь оттуда определенный набор данных

    setTimeout(function () {
        errorMessage.innerHTML = "Could not connect to device! (timeout exception)"
    }, 500);

}



//Функция нахождения подключенных последовательных портов
var onGetDevices = function(ports) {

    serialSelect.options.length = 0;
    serialSelect.options[serialSelect.options.length] = new Option("", "empty");
    console.log(demoModFlag)
    if(demoModFlag === true) {
        for (var i = 1; i < 11; i++) {
            serialSelect.options[serialSelect.options.length] = new Option("COM" + i, i);
        }
    }
    else {
        for (var i = 0; i < ports.length; i++) {
            console.log(ports[i].path);
            serialSelect.options[serialSelect.options.length] = new Option(ports[i].path, ports[i].path);
        }
    }
}
// получение списка подключенных устройств
connectButton.onclick = function () {
    chrome.serial.getDevices(onGetDevices);
}


//Подключение к порту при нажатии на клавишу
confirmButton.onclick = function () {
    if(demoModFlag === true) {
        sensorText.innerHTML = GetSensorName();
        soapRequest(serialSelect.value);
    }
    else {
        chrome.serial.connect(serialSelect.value, {bitrate: 1200, dataBits: "eight", parityBit: "odd", stopBits: "one", receiveTimeout: 0}, onConnect );
        IntializeLongAddress();
    }
};

//Функция, вызываемая при подключении
onConnect = function(serialInfo) {
    console.log("Вызвалась функция подключения")

    connectionId = serialInfo.connectionId;
    chrome.serial.setPaused(connectionId, false, function () {});
    chrome.serial.setControlSignals(connectionId, { dtr: true, rts: false}, function () {});
    console.log(connectionId);
};

//Функция отправки сообщения
sendButton.onclick = function() {

    chrome.serial.flush(connectionId, function(result){
            chrome.serial.clearBreak(connectionId, function () {});
            chrome.serial.setControlSignals(connectionId, { rts: true}, function (result) {});
            chrome.serial.send(connectionId, Sendbuffer.buffer, function () {});

            setTimeout(function () {
                        chrome.serial.update(connectionId, { receiveTimeout: 250}, function () {});
                        chrome.serial.setControlSignals(connectionId, {rts: false}, function (result) {})},
                    11100 * Sendbuffer.byteLength / 1200);
    })
}

chrome.serial.onReceive.addListener(function (receiveInfo) {
    var data = receiveInfo.data;
    data = new Uint8Array(data);
    requesrArray[requesrArray.length] = receiveInfo.data;
    console.log(data);
    //chrome.serial.update(connectionId, { receiveTimeout: 0}, function () {});
});

chrome.serial.onReceiveError.addListener(function (reciveInfo) {
    chrome.serial.clearBreak(connectionId, function () {});
    if (reciveInfo.error === "timeout")
    {
        requesrArray = new Uint8Array(requesrArray);
        console.log(requesrArray);
        chrome.serial.update(connectionId, { receiveTimeout: 0}, function () {});
    }
	chrome.serial.setPaused(connectionId, false, function(){});
    console.log(reciveInfo)  ;
})

var onDisconnect = function(result) {
    if (result) {
        console.log("Disconnected from the serial port");
    } else {
        console.log("Disconnect failed");
    }
}

hideButton.onclick = function() {
    (chrome.serial.disconnect(connectionId, onDisconnect));
}

