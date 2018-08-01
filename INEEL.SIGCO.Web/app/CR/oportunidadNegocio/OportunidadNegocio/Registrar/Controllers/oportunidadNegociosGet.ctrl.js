(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("OportunidadNegociosGetCtrl", [
            "AuthService",
            "$scope",
            "MenuService",
            "DTOptionsBuilder",
            "$uibModal",
            "OportunidadNegocioCRService",
            OportunidadNegociosGetCtrl
        ]);

    function OportunidadNegociosGetCtrl(AuthService, $scope, MenuService, DTOptionsBuilder, $uibModal, OportunidadNegocioCRService) {
        $scope.authentication = AuthService.authentication;
        var Id = $scope.authentication.userprofile.clavePersona;
        $scope.oportunidadesPorAsignar = [];
        $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('order', [3, 'desc']);

        $scope.idRol = MenuService.getRolId();
        if ($scope.idRol == 8) {
            $scope.datosUsuarioAux = AuthService.authentication.userprofile;
        } else {
            $scope.datosUsuarioAux = {
                'clavePersona': '',
                'fechaIngreso': '',
                'categoria': { 'descripcion': '' },
                'nombreCompleto': '',
                'unidadOrganizacional': { 'nombreUnidad': '' },
                'antiguedad': ''
            };
        }


        $scope.recargar = function () {
            OportunidadNegocioCRService.getOportunidadesPorAsignadar(Id).then(
                function (result) {
                    $scope.oportunidadesPorAsignar = result.data;
                },
                function (err) {
                    toastr.error(err);
                });
        }

        $scope.asignarOportunidad = function (o) {
            $scope.oportunidad = o;
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/CR/oportunidadNegocio/OportunidadNegocio/AsignarEspecialista/asignarEspecialista.html',
                controller: 'AsignarEspecialistaCtrl',
                scope: $scope
            });
            modalInstance.result.then(function (selectedItem) { });
        }

        $scope.recargar();

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
