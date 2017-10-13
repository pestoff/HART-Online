
// document.getElementById("ConfirmButtons").addEventListener("click", soapRequest);

var string;

function simpleSend() {
    string = jsonString;
    RefreshScope();
}

var expandedDeviceType = [2490392, 2490466, 2500211, 2490374, 10027132, 10027093, 14614660, 1245196, 1245188, 1245195]
var deviceRevision = [7, 3, 2, 3, 1, 1, 1, 1, 1, 1];
var ddRevision = [2, 3, 2, 7, 1, 1, 2, 1, 3, 5];


function soapRequest(sensorValue) {

    //FIXME добавить отправку нулевой команды на датчик

    // IntializeLongAddress();

    //FIXME выцепить отттуда необходимую информацию и передать её на сервер (expanded device type, device revision)


    var  requestString = '<?xml version="1.0" encoding="UTF-8"?>' +
        '<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">' +
        '<s:Body>' +
        '<GetDeviceModel xmlns="http://tempuri.org/">' +
        '<expandedDeviceType>'+ expandedDeviceType[sensorValue - 1] +'</expandedDeviceType>' + //FIXME тут должна быть переменная сенсора
        '<deviceRevision>'+ deviceRevision[sensorValue - 1] +'</deviceRevision>' + //FIXME тут должна быть переменная сенсора
        '<ddRevision>'+ ddRevision[sensorValue - 1] +'</ddRevision>' +
        '</GetDeviceModel>' +
        '</s:Body>' +
        '</s:Envelope>';

    var xhr = new XMLHttpRequest();

    xhr.timeout = 3000;

    xhr.open("POST", "http://83.142.167.140:18563/RequestProcessingService", true);
    if(!xhr){
        console.log("XHR ne robit");
    }

    xhr.onload = function () {
        var responseText = xhr.responseText;
        var lastIndex = responseText.indexOf("</GetDeviceModelResult>");
        string = responseText.substring(146, lastIndex);
        RefreshScope();
    }

    xhr.onerror = function () {
        console.log("error");
        errorMessage.innerHTML = "Error connecting to server (Error code " + this.status + ")";
    }

    xhr.setRequestHeader("SOAPAction", "http://tempuri.org/IRequestProcessingService/GetDeviceModel");
    xhr.setRequestHeader("Content-Type", "text/xml");
    xhr.send(requestString);
}

