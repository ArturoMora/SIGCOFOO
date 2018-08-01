(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("idiomasDetailsCtrl", ['AuthService', '$scope', 'IdiomasService', "$stateParams","globalGet", idiomasDetailsCtrl]);

    function idiomasDetailsCtrl(AuthService, $scope, IdiomasService, $stateParams, globalGet) {
        window.scrollTo(0, 0)
        var API = globalGet.get("api");
        $scope.urlDescarga = API + "Descarga/GetFile";
        $scope.id = $stateParams.id;
        $scope.id2 = $stateParams.id2;
        $scope.valor = "80";
        //get usuario
        //Extraer informacion del usuario//
        $scope.registroidiomas = {};
        $scope.authentication = AuthService.authentication;
        
        //$scope.value = 99;
        //$scope.options = {
        //    unit: "%",
        //    readOnly: true,
        //    subText: {
        //        enabled: true,
        //        text: 'CPU used',
        //        color: 'gray',
        //        font: 'auto'
        //    },
        //    trackWidth: 40,
        //    barWidth: 25,
        //    trackColor: '#656D7F',
        //    barColor: '#2CC185'
        //};
        

        //obtener el registro a mostrar
       IdiomasService.getbyid($scope.id).then(
            function (result) {
                IdiomasService.Persona(result.data.clavePersona).then(
                function (result) {
                    $scope.registroidiomas.nombreCompleto = result.data.nombreCompleto;
                });
                $scope.registroidiomas = result.data;
                if ($scope.registroidiomas.adjunto == null) {
                    $scope.regFile = true;
                } else {
                    $scope.regFile = false;
                    $scope.archivos = 1;
                }
                $scope.registroidiomas.fechaAcreditacion = new Date($scope.registroidiomas.fechaAcreditacion);
                $(document).ready(function () { // 6,32 5,38 2,34
                    $("#porcentajeConversacion").circliful({
                        animation: 1,
                        animationStep: 5,
                        foregroundBorderWidth: 15,
                        backgroundBorderWidth: 15,
                        percent: $scope.registroidiomas.porcentajeConversacion,
                        textSize: 28,
                        textStyle: 'font-size: 12px;',
                        textColor: '#666',
                        multiPercentage: 1,
                        percentages: [10, 20, 30],
                        fontColor: '#1ABB9C',
                        foregroundColor: '#1ABB9C',
                    });
                    $("#porcentajeEscritura").circliful({
                        animation: 1,
                        animationStep: 5,
                        foregroundBorderWidth: 15,
                        backgroundBorderWidth: 15,
                        percent: $scope.registroidiomas.porcentajeEscritura,
                        textSize: 28,
                        textStyle: 'font-size: 12px;',
                        textColor: '#666',
                        multiPercentage: 1,
                        percentages: [10, 20, 30],
                        fontColor: '#1ABB9C',
                        foregroundColor: '#1ABB9C',
                    });
                    $("#porcentajeLectura").circliful({
                        animation: 1,
                        animationStep: 5,
                        foregroundBorderWidth: 15,
                        backgroundBorderWidth: 15,
                        percent: $scope.registroidiomas.porcentajeLectura,
                        textSize: 28,
                        textStyle: 'font-size: 12px;',
                        textColor: '#666',
                        multiPercentage: 1,
                        percentages: [10, 20, 30],
                        fontColor: '#1ABB9C',
                        foregroundColor: '#1ABB9C',
                    });
                });
            },
            function (err) {
                toastr.error("No se han podido cargar los registros de idiomas.");
            }
        );
    }
})();