(function () {
    "use strict";

    angular
        .module("ineelCP")
        .controller("TipoLineamientoGetCtrl", [
            "AuthService",
            "$scope",
            "TipoLineamientoCPService",
            "$uibModal",
            TipoLineamientoGetCtrl
        ]);

    function TipoLineamientoGetCtrl(AuthService, $scope, TipoLineamientoCPService, $uibModal) {

        $scope.authentication = AuthService.authentication;
        TipoLineamientoCPService.getAll().then(
            function (result) {
                $scope.tipoLineamientos = result.data;
            },
            function (err) {
                console.error("No se han podido cargar los registros");
            });

        $scope.saveEstado = function (lineamiento) {

            var modalInstance = $uibModal.open({
                templateUrl: 'app/vistasGenericas/registroLogico' + (lineamiento.estado == true ? 'Active' : 'Delete') + '.html',
                controller: function ($uibModalInstance) {
                    $scope.ok = function () {
                        TipoLineamientoCPService.updateEstado(lineamiento).then(
                            function (result) {

                            },
                            function (err) {
                                $scope.cancel();
                            });
                        $uibModalInstance.close();
                    };
                    $scope.cancel = function () {
                        var idx = ($scope.tipoLineamientos.indexOf(lineamiento));
                        $scope.tipoLineamientos[idx].estado = !$scope.tipoLineamientos[idx].estado;
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                scope: $scope
            });
        }

        function removeAccents(data) {
            return data
                .replace(/έ/g, 'ε')
                .replace(/[ύϋΰ]/g, 'υ')
                .replace(/ό/g, 'ο')
                .replace(/ώ/g, 'ω')
                .replace(/ά/g, 'α')
                .replace(/[ίϊΐ]/g, 'ι')
                .replace(/ή/g, 'η')
                .replace(/\n/g, ' ')
                .replace(/á/g, 'a')
                .replace(/é/g, 'e')
                .replace(/í/g, 'i')
                .replace(/ó/g, 'o')
                .replace(/ú/g, 'u')
                .replace(/ê/g, 'e')
                .replace(/î/g, 'i')
                .replace(/ô/g, 'o')
                .replace(/è/g, 'e')
                .replace(/ï/g, 'i')
                .replace(/ü/g, 'u')
                .replace(/ã/g, 'a')
                .replace(/õ/g, 'o')
                .replace(/ç/g, 'c')
                .replace(/ì/g, 'i');
        }

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