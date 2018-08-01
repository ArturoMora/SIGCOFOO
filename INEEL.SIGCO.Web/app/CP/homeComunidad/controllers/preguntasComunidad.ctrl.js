(function () {
    "use strict";

    angular
        .module("ineelCP")
        .controller("PreguntasComunidadCtrl", [
            "AuthService",
            "$scope",
            "PreguntasCPService",
            "$uibModal",
            PreguntasComunidadCtrl
        ]);

    function PreguntasComunidadCtrl(AuthService, $scope,PreguntasCPService, $uibModal) {
        $scope.authentication = AuthService.authentication;
      

        $scope.obtenerRegistros = function () {
            PreguntasCPService.getByComunidad2($scope.comunidad.comunidadId).then(function (res) {
                $scope.preguntasComunidad = res.data;
            }, function (err) {
                toastr.error("Error al obtener los registros de preguntas");
                console.log(err);
            });
        }

        $scope.agregaRegistro = function () {
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/CP/modalesCP/preguntas/AgregarPreguntasComunidad.html',
                controller: 'AgregarPreguntaComunidadCtrl',
                scope: $scope
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.obtenerRegistros();
            });
        }

        $scope.editaRegistro = function (objeto) {
            $scope.registroEdit = objeto;
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/CP/modalesCP/preguntas/EditarPreguntaComunidad.html',
                controller: 'EditarPreguntaComunidadCtrl',
                scope: $scope
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.obtenerRegistros();
            });
        }

        $scope.eliminaRegistro = function (id) {
            PreguntasCPService.delete(id).then(function (result) {
                toastr.success(result.data);
                $scope.obtenerRegistros();
            }, function (err) {
                toastr.error("Error al eliminar el sitio");
                console.log(err);
            });
        }

        $scope.obtenerRegistros();

     

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