(function () {
    "use strict";
    angular
        .module("ineelGI")
        .controller("tecnologiaLicenciadaDetailsGAJ", ['AuthService', '$scope', 'tecnologiaLicenciadaService', "$stateParams", "globalGet", "$rootScope","$state", tecnologiaLicenciadaDetailsGAJ]);

    function tecnologiaLicenciadaDetailsGAJ(AuthService, $scope, tecnologiaLicenciadaService, $stateParams, globalGet, $rootScope, $state) {
        window.scrollTo(0, 0)
        var id = $rootScope.getGlobalID();
        $scope.registro = {};
        $scope.leccion = {};
        var API = globalGet.get("api");
        $scope.urlDescarga = API + "Descarga/GetFile";
        //Obtener datos de usuario
        $scope.authentication = AuthService.authentication;
        //Extraer informacion del usuario//

        //obtener el registro a mostrar
        debugger;
        tecnologiaLicenciadaService.getbyid(id).then(
            function (result) {
                $scope.registro = result.data;
                if ($scope.registro.lecciones == null) {
                    $scope.registro.lecciones = [];
                    $scope.lecciones = [];
                } else {
                    $scope.lecciones = $scope.registro.lecciones;
                }
            },
            function (error) {
                toastr.error(error);
            });


        $scope.addLeccion = function () {
            debugger;
            /*1 GCyDN, 2 GAJ, 3 Gerencia tecnica*/
            if ($scope.leccion.comentario == null) {
                toastr.error("Ingrese el comentario de la lección");
                return false;
            }


            var registro = {
                'fecha': new Date(),
                'tipo': 2,
                'comentario': $scope.leccion.comentario,
                'estado': true,
                'tecnologiaLicenciadaId': id,
                'clavePersona': $scope.ClavePersonaLogin,
                'id': 0
            }

            $scope.lecciones.push(registro);
            $scope.leccion = null;
        }

        $scope.deleteLeccion = function (registro) {
            var idx = ($scope.lecciones.indexOf(registro));
            $scope.lecciones.splice(idx, 1);
        };

        $scope.update = function () {
            tecnologiaLicenciadaService.crearLecciones($scope.lecciones).then(
            function (result) {
                toastr.success("Registro Actualizado");
                $state.reload();
            },
            function (err) {
                console.error(err);
                toastr.error("Error al agregar los pagos");
                $state.reload();
            });
        }
    }
})();