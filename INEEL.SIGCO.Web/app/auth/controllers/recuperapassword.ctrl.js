(function () {
    "use strict";

    angular
        .module("ineel.services")
        .controller("recuperapasswordCtrl", ["$scope", "$state", "AuthService", "globalGet", "$http", recuperapasswordCtrl]);

    function recuperapasswordCtrl($scope, $state, AuthService, globalGet, $http) {


        var API = globalGet.get("api");

        $scope.userName = AuthService.authentication.userName;

        $scope.enviarcorreo = function (correo) {
            var endPoint = API + "Correo/SendNotificacion/" + correo;
            return $http.post(endPoint, correo);
        };

        $scope.obtenerCodigo = function (userName) {
            var endPoint = API + "RecuperaPassword/RecuperarPasswordGC/"+userName;
            return $http.get(endPoint);
        };



        $scope.enviar = function () {

            $scope.obtenerCodigo($scope.clavePersona).then(
                function (result) {

                    if (result.data != null) {
                        var mail = {
                            "modulo": "SIGCO",
                            "seccion": "Recuperar contraseña",
                            "tipoCorreo": 'RecuperaContrasena',
                            "Descripcion1": result.data,
                            "clavePersona": $scope.clavePersona
                        };

                        $scope.respuestacorreo = null;
                        $scope.enviarcorreo(mail).then(
                            function (response) {
                                if (response.data == true)
                                    $scope.respuestacorreo = true;
                                else
                                    $scope.respuestacorreo = false;
                            },
                            function (err) {
                                console.log('No se puedo enviar el correo. ');
                            });

                    }

                },
                function (err) {
                    alert('error:' + err.message);
                }
            );
        }
    }
}());

