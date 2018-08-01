(function () {
    "use strict";

    angular
        .module("ineelCP")
        .controller("SitiosComunidadCtrl", [
            "AuthService",
            "$scope",
            "$uibModal",
            "SitiosInteresCPService",
            SitiosComunidadCtrl
        ]);

    function SitiosComunidadCtrl(AuthService, $scope, $uibModal, SitiosInteresCPService) {
        $scope.authentication = AuthService.authentication;

        $scope.obtenerSitios = function () {
            SitiosInteresCPService.getByComunidad($scope.comunidad.comunidadId).then(function (res) {
                $scope.sitiosComunidad = res.data;
            }, function (err) {
                toastr.error("Error al obtener los sitios de la comunidad");
                console.log(err);
            });
        }



        $scope.agregaRegistro = function () {
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/CP/modalesCP/sitiosInteres/AgregarSitioComunidad.html',
                controller: 'AgregarSitioComunidadCtrl',
                scope: $scope
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.obtenerSitios();
            });
        }

        $scope.editaRegistro = function (objeto) {
            $scope.registroEdit = objeto;
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/CP/modalesCP/sitiosInteres/EditarSitioComunidad.html',
                controller: 'EditarSitioComunidadCtrl',
                scope: $scope
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.obtenerSitios();
            });
        }

        $scope.eliminaRegistro = function (id) {
            SitiosInteresCPService.delete(id).then(function (result) {
                toastr.success(result.data);
                $scope.obtenerSitios();
            }, function (err) {
                toastr.error("Error al eliminar el sitio");
                console.log(err);
            });
        }

        $scope.obtenerSitios();


        //La funcion removeAccents puede ser accedida de manera global en el archivo globalINEEL.js

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