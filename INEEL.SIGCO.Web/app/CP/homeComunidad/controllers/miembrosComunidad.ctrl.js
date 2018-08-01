(function () {
    "use strict";

    angular
        .module("ineelCP")
        .controller("MiembrosComunidadCtrl", [
            "AuthService",
            "$scope",
            "$state",
            "$filter",
            "$stateParams",
            "MiembrosCPService",       
            "$uibModal",
            MiembrosComunidadCtrl
        ]);

    function MiembrosComunidadCtrl(AuthService, $scope, $state, $filter, $stateParams, MiembrosCPService,  $uibModal) {
        $scope.authentication = AuthService.authentication;
        $scope.comunidad_id = $stateParams.id;

        $scope.modD1 = "active";
        $scope.modD2 = "";

        $scope.objetoEliminar = {};

        $scope.obtenMiembrosRegistrados = function (){ 

            MiembrosCPService.getMiembrosByComunidad($scope.comunidad_id).then(
                function (result) {
                    $scope.miembros = result.data;
                },
                function (err) {
                    toastr.error("No se han podido cargar los registros");
                });
        }

        $scope.obtenMiembrosNoActivos = function () {

            MiembrosCPService.getMiembrosByComunidadInactivos($scope.comunidad_id).then(
                function (result) {
                    $scope.miembrosInactivos = result.data;
                },
                function (err) {
                    toastr.error("No se han podido cargar los registros");
                });
        }

        $scope.deleteMiembro = function (obj) {
           
            $scope.objetoEliminar = obj;
            if (obj.rolId == 3 || obj.rolId == 4) {
                $scope.datosUsuario = "LiSe";
                $scope.mensajeEliminacion = "Le recomendamos asignar el rol de lider o secretario a otro usuario de la comunidad antes de eliminarlo";
          
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/CP/homeComunidad/eliminacionModal/eliminacionFisica.html',
                controller: 'eliminarMiembroCPCtrl',
                scope: $scope
            });

            $scope.objetoEliminar = {};
            } else {

                MiembrosCPService.getInformacionRegistrada(obj.miembroId).then( //verifica si el miembro ha hecho contribuciones a la comunidad
                   function (result) {
                       
                       if (result.data == "Datos") {
                           $scope.datosUsuario = "Si";
                           $scope.mensajeEliminacion = "El miembro que desea eliminar ha hecho contribuciones a la comunidad, Desea darlo de baja ";
                       } else {

                           $scope.datosUsuario = "No";
                           $scope.mensajeEliminacion = "Desea dar de baja o eliminar al miembro seleccionado, actualmente, este no cuenta con contribuciones a la comunidad";
                       }

                       var modalInstance = $uibModal.open({
                           size: 'lg',
                           templateUrl: 'app/CP/homeComunidad/eliminacionModal/eliminacionFisica.html',
                           controller: 'eliminarMiembroCPCtrl',
                           scope: $scope
                       });


                   },
                   function (err) {
                       toastr.error("No se han podido eliminar el registro");
                   });
            }
        }

        $scope.eliminarTotalMente = function () {
            MiembrosCPService.delete($scope.objetoEliminar.miembroId).then(
               function (result) {
                   var idx = ($scope.miembros.indexOf($scope.objetoEliminar));
                   $scope.miembros.splice(idx, 1);
                   $scope.objetoEliminar = {};
                   toastr.success("Miembro eliminado correctamente!");
               },
               function (err) {
                   toastr.error("No se han podido eliminar el registro");
               });
          
        }

        $scope.darBaja = function () {
        
            $scope.objetoEliminar.estado = false;
            $scope.objetoEliminar.fechaBaja = ($filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss')).toString();

            MiembrosCPService.update($scope.objetoEliminar).then(
                function (result) {

                   var idx = ($scope.miembros.indexOf($scope.objetoEliminar));
                   $scope.miembros.splice(idx, 1);
                   
                   if ($scope.miembrosInactivos == undefined || $scope.miembrosInactivos == null) {
                       $scope.miembrosInactivos = [];
                   }
                   $scope.miembrosInactivos.push($scope.objetoEliminar);
                   $scope.objetoEliminar = {};
                   toastr.success("Registro actualizado correctamente!");
                   //$state.reload();
               },
               function (err) {
                   toastr.error("No se han podido dar de baja al miembro");
               });

        }

        $scope.guardarMiembro = function () {
            if ($scope.nuevoMiembroSeleccionado.nombreCompleto != "") {
                var miembro = {
                    "fechaAlta": ($filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss')).toString(),
                    "aceptacion": false,
                    "nombrePersona": $scope.nuevoMiembroSeleccionado.nombreCompleto,
                    "idPersonas": $scope.nuevoMiembroSeleccionado.clavePersona,
                    "rolId": 2,
                    "idCP": $scope.comunidad_id,
                    "estado": true
                };

                var personaYaRegistrada = 0;

                for (var i = 0; i < $scope.miembros.length; i++) {
                    if ($scope.miembros[i].idPersonas == $scope.nuevoMiembroSeleccionado.clavePersona) {
                        personaYaRegistrada = 1;
                        break;
                    }
                }

                for (var i = 0; i < $scope.miembrosInactivos.length; i++) {
                    if ($scope.miembrosInactivos[i].idPersonas == $scope.nuevoMiembroSeleccionado.clavePersona) {
                        personaYaRegistrada = 1;
                        break;
                    }
                }
                if (personaYaRegistrada == 0) {
                    MiembrosCPService.registraMiembro(miembro)
                       .then(
                           function (result) {

                               var roles = {
                                   "nombre": "Miembro"
                               }

                               result.data.rolesCP = roles;
                               $scope.miembros.push(result.data);
                               toastr.success("Miembro registrado exitosamente!");
                               $scope.nuevoMiembroSeleccionado = null;
                               $scope.muestraPanel = false;
                           },
                           function (err) {
                               toastr.error("No se ha podido agregar el investigador a la comunidad");
                           }
                    );
                } else {
                    toastr.error("El investigador que desea agregar ya es miembro de la comunidad");
                }
            }
            
        }//FIN DE AGREGAR MIEMBRO

        ///IMPORTANTE: Con esta propiedad establecida en true filtramos el personal del ineel, de manera que en el modal solo se mostrara personal activo
        //En caso de que la propiedad no exista no hay ningun problema, por default el modal de personas mostrara todo el personal sin importar su estado 
        $scope.openUser = function () {
        $scope.filtraPersonalActivo=true;  
           var modalInstance = $uibModal.open({  
               size: 'lg',
               templateUrl: 'app/vistasGenericas/PersonasFilterGet.html',
               controller: 'PersonasFilterGetCtrl',
               scope: $scope
           });
           modalInstance.result.then(function (item) {
               $scope.nuevoMiembroSeleccionado=item;
           });
        }

        //Para cambiar de vistas (miembros activos/inactivos)
        $scope.activa1 = function () {
            $scope.modD1 = "active";
            $scope.modD2 = "";
        }

        $scope.activa2 = function () {
            $scope.modD1 = "";
            $scope.modD2 = "active";

        
        }

        //Activar miembro inactivo
        $scope.saveEstado = function (obj) {
                     
            var modalInstance = $uibModal.open({
                templateUrl: 'app/vistasGenericas/registroLogico' + (obj.estado == true ? 'Active' : 'Delete') + '.html',

                controller: function ($uibModalInstance) {
                    $scope.ok = function () {
                        MiembrosCPService.updateEstado(obj).then(
                            function (result) {
                                var roles = {
                                    "nombre": "Miembro"
                                }
                                obj.rolesCP = roles;
                                $scope.miembros.push(obj);
                                var idx = ($scope.miembrosInactivos.indexOf(obj));
                                $scope.miembrosInactivos.splice(idx, 1);
                                toastr.success("Registro actualizado correctamente!");
                            },
                            function (err) {
                                $scope.cancel();
                            });
                        $uibModalInstance.close();
                    };
                    $scope.cancel = function () {
                        var idx=($scope.miembrosInactivos.indexOf(obj));
                        $scope.miembrosInactivos[idx].estado = !$scope.miembrosInactivos[idx].estado;
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                scope: $scope
            });
        }

        $scope.obtenMiembrosRegistrados();
        $scope.obtenMiembrosNoActivos();
    }

})();