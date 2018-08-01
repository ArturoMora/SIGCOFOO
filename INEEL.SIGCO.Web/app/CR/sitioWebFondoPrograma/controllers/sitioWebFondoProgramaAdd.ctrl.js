(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("SitioWebFondoProgramaAddCtrl", [
        "AuthService",
        "$scope",
        "$state",
        "$stateParams",
        "$filter",
        "SitioWebFondoProgramaCRService",
        SitioWebFondoProgramaAddCtrl
        ]);

    function SitioWebFondoProgramaAddCtrl(AuthService,$scope, $state, $stateParams,$filter, SitioWebFondoProgramaCRService) {
        
        $scope.AddSitioWebFondoPrograma = function () {
            //debugger;
            //var reg = new RegExp("^(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})$");
            //var wpg = "https://stackoverflow.com/questions/3809401/what-is-a-good-regular-expression-to-match-a-url";
            //var res = reg.test(wpg);
            if ($scope.sitioWebFondoProgramaForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                var sitioWebFondoPrograma = {
                    "url": $scope.sitioWebFondoPrograma.url,
                    "descripcion": $scope.sitioWebFondoPrograma.descripcion,
                    "fechaEfectiva": ($filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss')).toString(),
                    "fechaRegistro": ($filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss')).toString(),
                    "autor": AuthService.authentication.nombreCompleto,
                    "estado": 1,
                    "fondoProgramaId": 4
                };
                $scope.desactivar = true;
                SitioWebFondoProgramaCRService.create(sitioWebFondoPrograma).then(
                function (result) {
                    toastr.success(result.data);
                    $state.go("sitioWebFondoProgramaGet");
                },
                function (err) {
                    toastr.error(err.data.message);
                    console.error(err.data);
                    $scope.desactivar = false;
                });
            }
        }
    }
})();