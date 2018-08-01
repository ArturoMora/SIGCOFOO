(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("MisOportunidadesRegistradasGetCtrl", [
            "AuthService",
            "$scope",
            "DTOptionsBuilder",
            "OportunidadNegocioCRService",
            MisOportunidadesRegistradasGetCtrl
        ]);

    function MisOportunidadesRegistradasGetCtrl(AuthService, $scope, DTOptionsBuilder, OportunidadNegocioCRService) {
        $scope.authentication = AuthService.authentication;
        var Id = $scope.authentication.userprofile.clavePersona;
        $scope.oportunidades = [];
        $scope.dtOptions = DTOptionsBuilder.newOptions()
            .withOption('order', [3, 'desc']);

        OportunidadNegocioCRService.getMisOportunidadesRegistradas(Id).then(
            function (result) {
                $scope.oportunidadesRegistradas = result.data;
            },
            function (err) {
                toastr.error(err);
            });


        //La funcion removeAccents esta disponible de manera general para todo el sigco, por lo que no es necesario repetir el codigo aqui
        var searchType = jQuery.fn.DataTable.ext.type.search;

        searchType.string = function (data) {
            return !data ?
                '' :
                typeof data === 'string' ?
                    removeAccents(data) :
                    data;
        };

        searchType.html = function (data) {
            return !data ?
                '' :
                typeof data === 'string' ?
                    removeAccents(data.replace(/<.*?>/g, '')) :
                    data;
        };

    }
})();
