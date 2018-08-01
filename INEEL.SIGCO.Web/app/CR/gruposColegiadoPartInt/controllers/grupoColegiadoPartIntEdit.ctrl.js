(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("GrupoColegiadoPartIntEditCtrl", [
        "AuthService",
        "$scope",
        "$state",
        "$stateParams",
        "PaisesService",
        "GruposColegiadoPartIntCRService",
        "$uibModal",
         "DTOptionsBuilder",
        GrupoColegiadoPartIntEditCtrl
        ]);

    function GrupoColegiadoPartIntEditCtrl(AuthService, $scope, $state, $stateParams, PaisesService, GruposColegiadoPartIntCRService, $uibModal, DTOptionsBuilder) {
        $scope.authentication = AuthService.authentication;
        $scope.grupoColegiadoPartInt_id = $stateParams.id;
        
        $scope.cargo1 = null;
        $scope.integrante = "";
     
        $scope.cargo2 = null;
        $scope.integranteIIE = "";

        var estadoId = 0;
        var paisId = 16; 





        var paisId = 16;
        PaisesService.getEstado(paisId).then(
             function (result) {
                 $scope.estados = result.data;
             },
             function (err) {
                 toastr.error(err);
             });


        GruposColegiadoPartIntCRService.getGrupoColegiadoPartIntFKById($scope.grupoColegiadoPartInt_id).then(
            function (result) {
                $scope.gruposColegiadoPartInt = result.data;
                
                if ($scope.gruposColegiadoPartInt.estadoId != null) {
                    estadoId = $scope.gruposColegiadoPartInt.estadoId;


                    PaisesService.getMunicipio(estadoId).then(
                        function (result) {
                            $scope.municipios = result.data;
                        },
                        function (err) {
                            toastr.error(err);
                        });
                } 
                                              
            },
            function (err) {
                console.error(err);
        });
                
            

        //Buscar Contacto
        $scope.ContactoSeleccionada = {};
        $scope.vercontacto = false;
        $scope.openContacto = function () {
            $scope.vinculo = {};
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/ContactosGetGral.html',
                controller: 'ContactosGetGralCtrl as showCase',
                scope: $scope,
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.gruposColegiadoPartInt.contacto.nombreCompleto = selectedItem.nombreCompleto;
                $scope.gruposColegiadoPartInt.contactoId = selectedItem.contactoId;
                $scope.gruposColegiadoPartInt.contacto.telefono = selectedItem.telefono;
                $scope.gruposColegiadoPartInt.contacto.correo = selectedItem.correo;
                $scope.gruposColegiadoPartInt.contacto.empresa.empresaId = selectedItem.empresa.empresaId; //checar si el objeto trae los FKs de la empresa, sino, ponerselos en el modal
                $scope.gruposColegiadoPartInt.contacto.empresa.nombreEmpresa = selectedItem.empresa.nombreEmpresa;
                $scope.gruposColegiadoPartInt.contacto.puesto = selectedItem.puesto;
                $scope.ContactoSeleccionada = selectedItem;
                $scope.form.$setDirty();
            });
        }


        //obtener lista de NaturalezasInteraccionEstado
        GruposColegiadoPartIntCRService.getNaturalezasInteraccionEstado().then(
             function (result) {
                 $scope.naturalezasInteraccion = result.data;
             },
             function (err) {
                toastr.error("No se ha podido cargar los registros");
            }
        );

              
        //Buscar Integrante
        $scope.IntegranteSeleccionada = {};
        $scope.verintegrante = false;
        $scope.openIntegrante = function () {
            $scope.vinculo = {};
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/ContactosGetGral.html',
                controller: 'ContactosGetGralCtrl as showCase',
                scope: $scope,
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.elementoRegistrado = 0;
                if ($scope.gruposColegiadoPartInt.contacto.nombreCompleto == selectedItem.nombreCompleto) {
                    toastr.error("El titular no puede ser parte del listado de integrantes externos");
                    $scope.cargo1 = null;
                    $scope.gruposColegiadoPartInt.cargox = "";
                    $scope.integrante = "";
                    return;
                }

                if (selectedItem.contactoId != "") {

                    if ($scope.gruposColegiadoPartInt.integranteGrupoColegiadoExterno != null) {
                        if ($scope.gruposColegiadoPartInt.integranteGrupoColegiadoExterno.length >= 0) {

                            for (var i = 0; i < $scope.gruposColegiadoPartInt.integranteGrupoColegiadoExterno.length; i++) {
                                if ($scope.gruposColegiadoPartInt.integranteGrupoColegiadoExterno[i].contactoId == selectedItem.contactoId) {
                                    $scope.elementoRegistrado = 1;
                                    break;
                                }
                            }
                        }
                    }
                }

                if ($scope.elementoRegistrado == 1) {
                    toastr.error("El contacto ya se encuentra en la lista de integrantes, indique otro");
                    $scope.integrante = "";
                } else {
                    $scope.cargo1 = true;
                    $scope.IntegranteSeleccionada = selectedItem;
                    $scope.integrante = $scope.IntegranteSeleccionada.nombreCompleto;
                    $scope.form.$setDirty();
                }
            });
        }


        $scope.add_integrante = function () {
            if ($scope.gruposColegiadoPartInt.cargox == "" || $scope.gruposColegiadoPartInt.cargox == null || $scope.gruposColegiadoPartInt.cargox == undefined) {
                toastr.error("Debe ingresar un cargo");
            } else {

                var registro = {
                    "nombre": $scope.IntegranteSeleccionada.nombreCompleto,
                    "fechaRegistro": new Date(),
                    "estado": 1,
                    "autor": $scope.gruposColegiadoPartInt.autor,
                    "grupoColegiadoPartIntId": $scope.gruposColegiadoPartInt.grupoColegiadoPartIntId,
                    "contactoId": $scope.IntegranteSeleccionada.contactoId,
                    "cargoGC": $scope.gruposColegiadoPartInt.cargox,

                };

                GruposColegiadoPartIntCRService.registraIntegranteGCExterno(registro)
                    .then(
                        function (result) {

                            var registro = {
                                "nombreCompleto": $scope.IntegranteSeleccionada.nombreCompleto,
                                "empresa": {
                                    "nombreEmpresa": $scope.IntegranteSeleccionada.empresa.nombreEmpresa
                                }
                            };

                            result.data.contacto = registro;
                            $scope.gruposColegiadoPartInt.integranteGrupoColegiadoExterno.push(result.data);
                            toastr.success("Registro creado exitosamente!");
                        },
                        function (err) {
                            console.error(err);
                });

                $scope.cargo1 = null;
                $scope.gruposColegiadoPartInt.cargox = "";
                $scope.integrante = "";

            }
        };


        $scope.delete_integrante = function (obj) {
            var index = $scope.gruposColegiadoPartInt.integranteGrupoColegiadoExterno.indexOf(obj);
            var modalInstance = $uibModal.open({
                templateUrl: 'app/vistasGenericas/eliminacionFisica.html',
                controller: function ($uibModalInstance) {

                    $scope.ok = function () {
                        GruposColegiadoPartIntCRService.deleteIntegranteGCExterno(obj.integranteGrupoColegiadoExternoId)
                        .then(
                            function (result) {
                                toastr.success("Registro eliminado exitosamente!");
                                $scope.gruposColegiadoPartInt.integranteGrupoColegiadoExterno.splice(index, 1);
                            },
                            function (err) {
                                console.error(err);
                            });
                        $uibModalInstance.dismiss('close');
                    };

                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                scope: $scope
            });
        };


        
        $scope.PersonaSeleccionada = {};
        $scope.openUser = function () {
            $scope.empleado = {};
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/PersonasFilterGet.html',
                controller: 'PersonasFilterGetCtrl',
                resolve: {
                    empleado: function () {
                        return $scope.empleado;
                    }
                },
                scope: $scope
            });
            modalInstance.result.then(function (selectedItem) {
                
                 $scope.elementoRegistrado = 0;
                               

                if (selectedItem.clavePersona != "") {

                    if ($scope.gruposColegiadoPartInt.integranteGrupoColegiadoInterno != null) {
                        if ($scope.gruposColegiadoPartInt.integranteGrupoColegiadoInterno.length >= 0) {

                            for (var i = 0; i < $scope.gruposColegiadoPartInt.integranteGrupoColegiadoInterno.length; i++) {
                                if ($scope.gruposColegiadoPartInt.integranteGrupoColegiadoInterno[i].claveEmpleado == selectedItem.clavePersona) {
                                    $scope.elementoRegistrado = 1;
                                    break;
                                }
                            }
                        }
                    }
                }

                if ($scope.elementoRegistrado == 1) {
                    toastr.error("El empleado ya se encuentra en la lista de integrantes, indique otro");
                    $scope.integranteIIE = "";
                } else {
                    $scope.cargo2 = true;
                    $scope.PersonaSeleccionada = selectedItem;
                    $scope.integranteIIE = $scope.PersonaSeleccionada.nombreCompleto;
                    $scope.form.$setDirty();
                }

            });
        };
                
        $scope.add_integrante_IIE = function () {

            if ($scope.gruposColegiadoPartInt.cargoy == "" || $scope.gruposColegiadoPartInt.cargoy == null || $scope.gruposColegiadoPartInt.cargoy == undefined) {
                toastr.error("Debe ingresar un cargo");
            } else {
               
                var registro = {
                    "nombre": $scope.PersonaSeleccionada.nombreCompleto,
                    "fechaRegistro": new Date(),
                    "estado": 1,
                    "autor": $scope.gruposColegiadoPartInt.autor,
                    "grupoColegiadoPartIntId": $scope.gruposColegiadoPartInt.grupoColegiadoPartIntId,
                    "claveEmpleado": $scope.PersonaSeleccionada.clavePersona,
                    "cargoGC": $scope.gruposColegiadoPartInt.cargoy,
                };

                GruposColegiadoPartIntCRService.registraIntegranteGCInterno(registro)
                    .then(
                        function (result) {
                         
                            $scope.gruposColegiadoPartInt.integranteGrupoColegiadoInterno.push(result.data);
                            toastr.success("Registro creado exitosamente!");
                        },
                        function (err) {
                            console.error(err);
                 });

                $scope.cargo2 = null;
                $scope.gruposColegiadoPartInt.cargoy  = "";
                $scope.integranteIIE = "";
            }
        }



        $scope.delete_integrante_IIE = function (obj) {
            var index = $scope.gruposColegiadoPartInt.integranteGrupoColegiadoInterno.indexOf(obj);
          
            var modalInstance = $uibModal.open({
                templateUrl: 'app/vistasGenericas/eliminacionFisica.html',
                controller: function ($uibModalInstance) {

                    $scope.ok = function () {
                        GruposColegiadoPartIntCRService.deleteIntegranteInternoGC(obj.integranteGrupoColegiadoInternoId)
                        .then(
                            function (result) {
                                toastr.success("Registro eliminado exitosamente!");
                                $scope.gruposColegiadoPartInt.integranteGrupoColegiadoInterno.splice(index, 1);
                            },
                            function (err) {
                                console.error(err);
                            });
                        $uibModalInstance.dismiss('close');
                    };

                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                scope: $scope
            });
        };



        $scope.cargaMunicipio = function () {
           
            if ($scope.gruposColegiadoPartInt.estadoId != null) {
                PaisesService.getMunicipio($scope.gruposColegiadoPartInt.estadoId).then(
                function (result) {
                    $scope.municipios = result.data;
                },
                function (err) {
                    toastr.error(err);
                });
            }
            else {
                $scope.municipios = [];
            }
        }





        $scope.saveGrupoColegiadoPartInt = function () {

            if ($scope.form.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            }
            if($scope.gruposColegiadoPartInt.integranteGrupoColegiadoExterno.length==0){
                toastr.error("Complete los datos requeridos");
                return false;
            }
             else {
                              
               
                GruposColegiadoPartIntCRService.update($scope.gruposColegiadoPartInt)
                    .then(
                        function(result) {
                            toastr.success(result.data);
                            $scope.form.$setPristine();
                            //$state.go("partesInteresadasAdmInicio");
                        },
                        function(err) {
                            console.error(err);                          
                });
            }
        };

    }
})();