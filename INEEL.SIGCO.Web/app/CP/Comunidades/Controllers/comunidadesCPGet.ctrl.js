(function () {
    "use strict";

    angular
        .module("ineelCP")
        .controller("ComunidadesCPGetCtrl", [
        "AuthService",
        "$scope",
        "ComunidadesCPService",
        "$uibModal",
        "RolesUsuarioCPService",
        ComunidadesCPGetCtrl
        ]);

    function ComunidadesCPGetCtrl(AuthService, $scope, ComunidadesCPService, $uibModal, RolesUsuarioCPService) {
        $scope.authentication = AuthService.authentication;
        $scope.userLogin = AuthService.authentication.userprofile.clavePersona;


        var datosUsuarioComunidad = {
            "id": 0,
            "claveEmpleado": $scope.userLogin
        }


        RolesUsuarioCPService.getRolesUsuario(datosUsuarioComunidad).then(function(res) {
            $scope.rol = res;
            $scope.comunidadesPropias();

            //verificamos el rol del usuario, dependiendo de su rol se contaran las comunidades
            if ($scope.rol.administrador) {
                $scope.countAllComunidades(); //cuenta todas las comunidades
            } else {
                $scope.countComunidadesActivas(); //cuenta todas las comunidades activas
            }

        },function(err) {
            toastr.error("Error al obtener las funciones del usuario a las comunidades");
            console.log(err);
        });


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

        //Numero de comunidades en caso de que el usuario sea comun y corriente
        $scope.countComunidadesActivas = function () {
            ComunidadesCPService.getTotalComunidadesActivas().then(
                function (result) {
                    $scope.numeroComunidades = result.data;
                },
                function (err) {
                    console.log(err);
                });
        }

        //Numero de comunidades en caso de que el usuario sea el admin
        $scope.countAllComunidades = function () {
            ComunidadesCPService.getTotalComunidades().then(
                function (result) {
                    $scope.numeroComunidades = result.data;
                },
                function (err) {
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

        //independiente del roll traemos las comunidades del usuario
        $scope.comunidadesPropias = function () {
            ComunidadesCPService.getMisComunidades(AuthService.authentication.userprofile.clavePersona).then(
              function (result) {
                  $scope.comunidades = result.data;
              },
              function (err) {
                  toastr.error("No se han podido cargar los registros");
                  console.log(err);
              });
        }


   
      
    }
})();