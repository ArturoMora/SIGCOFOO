(function () {
    "use strict";

    angular
        .module("ineelCP")
        .controller("otrascomunidadesCPGetCtrl", [
        "AuthService",
        "$scope",
        "ComunidadesCPService",
        "$uibModal",
        "RolesUsuarioCPService",
        otrascomunidadesCPGetCtrl
        ]);

    function otrascomunidadesCPGetCtrl(AuthService, $scope,  ComunidadesCPService, $uibModal,RolesUsuarioCPService) {
        $scope.authentication = AuthService.authentication;
        $scope.userLogin = AuthService.authentication.userprofile.clavePersona;

        var datosUsuarioComunidad = {
            "id": 0,
            "claveEmpleado": $scope.userLogin
        }

        //Verificamos el rol del usuario
        $scope.getComunidades = function () {
            RolesUsuarioCPService.getRolesUsuario(datosUsuarioComunidad).then(function (res) {
                $scope.rol = res;
                if ($scope.rol.administrador) {
                    $scope.obtenTodasComunidad();
                } else {
                    $scope.getComunidadesActivas();
                }
                $scope.countMisComunidades(AuthService.authentication.userprofile.clavePersona);

            }, function (err) {
                toastr.error("Error al obtener las funciones del usuario a las comunidades");
                console.log(err);
            });
            
        }

        function removeAccents(value) {
            return value
                .replace(/á/g, 'a').replace(/é/g, 'e').replace(/í/g, 'i').replace(/ó/g, 'o').replace(/ú/g, 'u');
        }
        
        $scope.ignoreAccents = function(item) {               
            if (!$scope.search)
                return true;       
            var text = removeAccents(item.comunidad.descripcion.toLowerCase())
            var search = removeAccents($scope.search.toLowerCase());
            return text.indexOf(search) > -1;
        };

        //cuenta mis comunidades
        $scope.countMisComunidades = function (clave) {
            ComunidadesCPService.getTotalMisComunidades(clave).then(
                function (result) {
                    $scope.numeroComunidades = result.data;
                },
                function (err) {
                    toastr.error("No se han podido cargar los registros");
                    console.log(err);
                });
        }

        //En caso de ser un usuario normal solo se cargan las comunidades activas
        $scope.getComunidadesActivas=function() {
            ComunidadesCPService.getActivas().then(
                function (result) {
                    $scope.comunidades = result.data;
                },
                function (err) {
                    toastr.error("No se han podido cargar los registros");
                    console.log(err);
                });
        }
        

        //En caso de ser el admin traeremos todas las comunidades
        $scope.obtenTodasComunidad = function () {
            ComunidadesCPService.getAll().then(
              function (result) {
                  $scope.comunidades = result.data;
              },
              function (err) {
                  toastr.error("No se han podido cargar los registros");
                  console.log(err);
              });
        }

        $scope.saveEstado = function (comunidad, val) {

            var modalInstance = $uibModal.open({
                templateUrl: 'app/vistasGenericas/registroLogico' + (comunidad.estado == true ? 'Active' : 'Delete') + '.html',
                controller: function ($uibModalInstance) {
                    $scope.ok = function () {
                        ComunidadesCPService.updateEstado(comunidad).then(
                            function (result) {

                            },
                            function (err) {
                                $scope.cancel();
                            });
                        $uibModalInstance.close();
                    };
                    $scope.cancel = function () {
                        for (var c = 0; c < $scope.comunidades.length; c++) {
                            if ($scope.comunidades[c].comunidad == comunidad) {
                                //var idx = ($scope.comunidades[c].comunidad.indexOf(comunidad));
                                $scope.comunidades[c].comunidad.estado = !$scope.comunidades[c].comunidad.estado;
                                $uibModalInstance.dismiss('cancel');
                            }

                        }


                    };
                },
                scope: $scope
            });
        }


        $scope.getComunidades();
    }
})();