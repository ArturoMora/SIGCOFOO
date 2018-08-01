(function () {
    'use strict';
    angular
        .module("ineelDESCARGAS")
        .controller('DescargaITFcaratula', ['$scope', '$location', '$stateParams',
            'AuthService', 'MenuService', 'DescargasService', '$window', DescargaITFcaratula]);

    function DescargaITFcaratula($scope, $location, $stateParams, AuthService,
        MenuService, DescargasService, $window) {
        debugger;
        $scope.authentication = AuthService.authentication;
        var token = $stateParams.id;
        var fileName = $stateParams.fileName;
        //$scope.decrypted = DescargasService.desencriptar(token);
        $scope.descarga = false;
        $scope.loading = true;
        DescargasService.downloadGenericPDF("/InformeTecnicoFinal/ReporteCaratula/", token, fileName).then(
            function (result) {
                console.log("descarga OK");
                console.log(result);
                $scope.descarga = true;
                $scope.loading = false;
            },
            function (error) {
                console.log("descarga error");
                console.log(error);
                $scope.loading = false;

            }
        );
        $scope.close = function () {
            //alert("foo");
            $window.close();
        }
    }
}());