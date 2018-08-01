(function () {
    "use strict";

    angular
        .module("ineelCP")
        .controller("TemasInnovacionGetCtrl", [
            "AuthService",
            "$scope",
            "$state",
            "$stateParams",
            "$rootScope",
            "RolesUsuarioCPService",
            "TemasInnovacionCPService",
            TemasInnovacionGetCtrl
        ]);

    function TemasInnovacionGetCtrl(AuthService, $scope, $state, $stateParams, $rootScope, RolesUsuarioCPService, TemasInnovacionCPService) {
        $scope.comunidadId = $stateParams.id;
        $scope.authentication = AuthService.authentication;

        $scope.cargaRegistros=function(){
            TemasInnovacionCPService.GetAllByComunidad($scope.comunidadId).then(
                function (result) {
                    $scope.temas = result.data;
                },
                function (err) {
                    toastr.error("No se han podido cargar los registros");
                    console.log(err);
                });
        }
        

        var datosUsuarioComunidad = {
            "id": $scope.comunidadId,
            "claveEmpleado": AuthService.authentication.userprofile.clavePersona
        };

        RolesUsuarioCPService.getRolesUsuario(datosUsuarioComunidad).then(function (res) {
            $scope.rol = res;
        }, function (err) {
            toastr.error("Error al obtener los permisos del usuario");
            console.log(err);
        });

        $scope.eliminaRegistro = function (idRegistro) {
            TemasInnovacionCPService.DeleteOCWithAutores(idRegistro).then(function (result) {
                $scope.cargaRegistros();
                toastr.success("Registro eliminado exitosamente!");
            }, function (err) {
                toastr.error("Error al eliminar el registro");
                console.log(err);
            });
        }


        $scope.regresar = function () {
            $rootScope.globalRegresar();
        }

        $scope.cargaRegistros();


        //La funcion removeAccents esta en global ineel, y es accesible desde cualquier controlador del SIGCO
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