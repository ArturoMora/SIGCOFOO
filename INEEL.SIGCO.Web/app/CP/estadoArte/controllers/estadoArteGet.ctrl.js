(function () {
    "use strict";

    angular
        .module("ineelCP")
        .controller("EstadoArteGetCtrl", [
            "AuthService",
            "$scope",
            "$state",
            "$stateParams",
            "EstadoArteCPService",
            'RolesUsuarioCPService',
            EstadoArteGetCtrl
        ]);

    function EstadoArteGetCtrl(AuthService, $scope, $state, $stateParams, EstadoArteCPService, RolesUsuarioCPService) {
        $scope.comunidadId = $stateParams.id;
        $scope.authentication = AuthService.authentication;

        var datosUsuarioComunidad = {
            "id": $scope.comunidadId,
            "claveEmpleado": AuthService.authentication.userprofile.clavePersona
        }

        $scope.cargaRegistros=function(){
            EstadoArteCPService.getByComunidad($scope.comunidadId).then(
                function (result) {
                    $scope.estadoArte = result.data;
                },
                function (err) {
                    toastr.error("No se han podido cargar los registros");
                    console.log(err);
                });
        }
        

        RolesUsuarioCPService.getRolesUsuario(datosUsuarioComunidad).then(function (res) {
            $scope.rol = res;
        },function(err) {
            toastr.error("Error al obtener los permisos del usuario");
            console.log(err);
        });

        $scope.eliminaArte = function (idRegistro) {
            EstadoArteCPService.DeleteOCWithAutores(idRegistro).then(function (result) {
                $scope.cargaRegistros();
                toastr.success("Registro eliminado exitosamente!");
            }, function (err) {
                toastr.error("Error al eliminar el registro");
                console.log(err);
            });
        }

        $scope.cargaRegistros();

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