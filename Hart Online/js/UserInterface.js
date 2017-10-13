var Application = angular.module('hOnline', [], function($provide) {
    $provide.decorator('$sniffer', function($delegate) {
        $delegate.history = false;
        return $delegate;
    });
});

sensorsName = ["Rosemount 644", "Metran 150R", "Rosemount 8800D", "Rosemount 3051C",
    "Metran-300", "Metran-305", "General Monitors IR4000", "Fisher DVC6200AC",
    "Fisher DLC3010", "Fisher DVC6kHW2"];

var demoModFlag = false;
var demoButton = document.getElementById("demoButton");

demoButton.onclick = function (){
    demoModFlag = true;
}

GetSensorName = function() {
    var Number = serialSelect.value;
    return "Sensor " + sensorsName[Number - 1] + " :";
}


Application.controller('sensorController', function($scope) {

    $scope.showPopUp = false;
    $scope.currentCommand;

    $scope.sensor;

    $scope.hideRequest = false;
    $scope.requestStatus = "Hide";
    $scope.StartScreen = true;

    $scope.hideResponce = false;
    $scope.responceStatus = "Hide";

    $scope.showBlock = false;
    $scope.treeStatus = "Hide";

    $scope.commandName = "Command :"
    $scope.commandNumber;

    RefreshScope = function () {
        if (string.charAt(0) === '{') {
            $scope.sensor = JSON.parse(string);
            console.log($scope.sensor);
            $scope.$apply();
        }
    }


    $scope.messageSender = function(){
        var parentElemrnt = document.getElementById("Output");
        var childMas = parentElemrnt.getElementsByClassName('content-repeat-value');
        var command = $scope.currentCommand.Reply;
        console.log(command)
        for (var i = 0; i < childMas.length; i++) {
            if (command.IsConstant === true)
            {
                childMas[i].innerHTML = command.Item;
            }
            console.log(command.Item);
            console.log($scope.sensor.Variables[command[i].Item]);
            childMas[i].innerHTML = $scope.sensor.Variables[command[i].Item].Value;
        }
    }



    $scope.chooseCommand  = function (obj) {
        console.log("i'm work!");
        $scope.currentCommand = obj.Transactions[0];
        $scope.commandNumber = obj.Number;
        var name = obj.Name[0].toUpperCase() + obj.Name.slice(1);
        $scope.commandName = "Command " + obj.Number + ": " + name.replace(/_/g, " ") ;
        console.log($scope.currentCommand);

        if(state == true)
        {
            element = "Hide";
        }
        else
        {
            element = "Show";
        }
    };

    $scope.showStartScreen = function () {
        $scope.StartScreen = !$scope.StartScreen;
    }

    $scope.showPopup = function () {
        $scope.showPopUp = !$scope.showPopUp;
    };

    $scope.showTree = function () {

        $scope.showBlock = !$scope.showBlock

        if($scope.showBlock == true)
        {
            $scope.treeStatus = "Hide";
        }
        else
        {
            $scope.treeStatus = "Show";
        }
    };

    $scope.showRequest = function () {
        $scope.hideRequest = !$scope.hideRequest;

        if($scope.hideRequest == false)
        {
            $scope.requestStatus = "Hide";
        }
        else
        {
            $scope.requestStatus = "Show";
        }
    }

    $scope.displayCommand = function (command) {

        var name = command.Name[0].toUpperCase() + command.Name.slice(1);

        name = name.replace(/_/g, " ");

        var string = "Command " + command.Number + " : " + name;
        return string;
    }

    $scope.displayVariableName = function (string) {

        if (string.IsConstant === true)
        {
            return "Constant";
        }

        name = $scope.sensor.Variables[string.Item].Name

        $scope.newName = name[0].toUpperCase() + name.slice(1);

        return $scope.newName.replace(/_/g, " ");
    }

    $scope.displayVariableValue = function (string) {

        //return $scope.sensor.Variables[string.Item].Value;
        return 0;
    }



    $scope.showResponce = function () {
        $scope.hideResponce = !$scope.hideResponce;

        if($scope.hideResponce == false)
        {
            $scope.responceStatus = "Hide";
        }
        else
        {
            $scope.responceStatus = "Show";
        }
    }
});
