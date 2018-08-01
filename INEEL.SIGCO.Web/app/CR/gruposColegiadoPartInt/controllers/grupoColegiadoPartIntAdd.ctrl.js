(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("GrupoColegiadoPartIntAddCtrl", [
        "AuthService",
        "$scope",
        "$state",
        "$stateParams",
        "$filter",
        "$uibModal",
        "GruposColegiadoPartIntCRService",
        "PaisesService",
        "DTOptionsBuilder",
        GrupoColegiadoPartIntAddCtrl
        ]);

    function GrupoColegiadoPartIntAddCtrl(AuthService, $scope, $state, $stateParams, $filter, $uibModal, GruposColegiadoPartIntCRService, PaisesService, DTOptionsBuilder) {

        $scope.authentication = AuthService.authentication;
        $scope.dtOptions = DTOptionsBuilder.newOptions().withDOM('rt');
        $scope.grupoColegiadoPartInt = {};
        $scope.grupoColegiadoPartIIE = {};
        $scope.integrantesM = [];
        $scope.integrantesE = [];
        $scope.integrantes = [];
        $scope.integrantesIIEM = [];
        $scope.integrantesIIEE = [];
        $scope.integrantesIIE = [];


        $scope.grupoColegiadoPartInt.cargo = null;

        $scope.cargos = [];
        $scope.cargosIIE = [];
        $scope.NombresIIE = [];



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
                $scope.contacto = selectedItem.nombreCompleto;
                $scope.grupoColegiadoPartInt.contactoId = selectedItem.contactoId;
                $scope.grupoColegiadoPartInt.telefono = selectedItem.telefono;
                $scope.grupoColegiadoPartInt.correo = selectedItem.correo;
                $scope.grupoColegiadoPartInt.empresaId = selectedItem.empresa.empresaId; //checar si el objeto trae los FKs de la empresa, sino, ponerselos en el modal
                $scope.grupoColegiadoPartInt.nombreEmpresa = selectedItem.empresa.nombreEmpresa;
                $scope.grupoColegiadoPartInt.puesto = selectedItem.puesto;
                $scope.ContactoSeleccionada = selectedItem;
                $scope.form.$setDirty();
            });
        }


        //Buscar Integrante
        $scope.IntegranteSeleccionada = {};
        
        $scope.openIntegrante = function () {
            $scope.vinculo = {};
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/ContactosGetGral.html',
                controller: 'ContactosGetGralCtrl as showCase',
                scope: $scope,
            });
            modalInstance.result.then(function (selectedItem) {
                if ($scope.contacto == selectedItem.nombreCompleto) {
                    toastr.error("El titular no puede ser parte del listado de integrantes externos");
                    $scope.grupoColegiadoPartInt.cargo = null;
                    $scope.grupoColegiadoPartInt.cargox = "";
                    $scope.integrante = "";
                    return;
                }
               
                var idx = $scope.integrantesE.indexOf(selectedItem.contactoId);
                if (idx > -1) {
                    toastr.error("El contacto ya se encuentra en la lista de integrantes, indique otro");
                }              
                else {
                    $scope.integrante = selectedItem.nombreCompleto;
                    $scope.integrantes.push(selectedItem);
                    $scope.grupoColegiadoPartInt.nombreIntegrante = selectedItem.nombreCompleto;
                    $scope.grupoColegiadoPartInt.integranteId = selectedItem.contactoId;
                    $scope.grupoColegiadoPartInt.empresaI = selectedItem.empresa.nombreEmpresa;
                    $scope.grupoColegiadoPartInt.cargo = true;
                    $scope.IntegranteSeleccionada = selectedItem;
                    $scope.form.$setDirty();
                }
            });
        }


        $scope.add_integrante = function () {
            
            if ($scope.grupoColegiadoPartInt.cargox == "" || $scope.grupoColegiadoPartInt.cargox == null || $scope.grupoColegiadoPartInt.cargox == undefined) {
                toastr.error("Debe ingresar un cargo");
            }else{ 
                $scope.integrantesM.push(
                       {
                           "nombre": $scope.grupoColegiadoPartInt.nombreIntegrante,
                           "nombreEmpresa": $scope.grupoColegiadoPartInt.empresaI,
                           "contactoId": $scope.grupoColegiadoPartInt.integranteId,
                           "cargo": $scope.grupoColegiadoPartInt.cargox
                       });

                $scope.cargos.push($scope.grupoColegiadoPartInt.cargox);
                $scope.integrantesE.push($scope.grupoColegiadoPartInt.integranteId);

                $scope.grupoColegiadoPartInt.cargo = null;
                $scope.grupoColegiadoPartInt.cargox = "";
                $scope.integrante = "";
            }          
        }

        $scope.deleteIntegrante = function (index) {
            $scope.integrantesM.splice(index, 1);
            $scope.cargos.splice(index, 1);
            $scope.integrantesE.splice(index, 1);
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

        var paisId = 16;     
        PaisesService.getEstado(paisId).then(
             function (result) {
                    $scope.estados = result.data;
             },
             function (err) {
                toastr.error(err);
         });

        $scope.cargaMunicipio = function () {
            if ($scope.grupoColegiadoPartInt.estadoId != null) {
                PaisesService.getMunicipio($scope.grupoColegiadoPartInt.estadoId).then(
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
        
        $scope.AddGrupoColegiadoPartInt = function () {
          
            if ($scope.form.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                
                $scope.grupoColegiadoPartInt.integrantesE = $scope.integrantesE;
                $scope.grupoColegiadoPartInt.IntegrantesIE = $scope.integrantesIIEE;
                $scope.grupoColegiadoPartInt.NombresIE = $scope.NombresIIE;
                $scope.grupoColegiadoPartInt.cargos = $scope.cargos
                $scope.grupoColegiadoPartInt.cargosI = $scope.cargosIIE;
                $scope.grupoColegiadoPartInt.fechaRegistro = new Date();
                $scope.grupoColegiadoPartInt.autor = $scope.grupoColegiadoPartInt.nombreContacto + " " + $scope.grupoColegiadoPartInt.apellidoPaterno + " " + $scope.grupoColegiadoPartInt.apellidoMaterno;
                $scope.grupoColegiadoPartInt.estado = 1;
                $scope.grupoColegiadoPartInt.autor = AuthService.authentication.nombreCompleto;
                             
                GruposColegiadoPartIntCRService.create($scope.grupoColegiadoPartInt)
                    .then(
                        function(result) {
                            toastr.success(result.data);
                            $state.go($scope.globalRegresar());
                        },
                        function(err) {
                            toastr.error(err.data.message);
                            console.error(err.data);
                           
                     });
            }
        }


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



                var idx = $scope.integrantesIIEE.indexOf(selectedItem.clavePersona);
                if (idx > -1) {
                    toastr.error("El empleado ya se encuentra en la lista de integrantes internos, indique otro");
                }
                else {
                    $scope.PersonaSeleccionada = selectedItem;
                    $scope.clavePersonaIIE = $scope.PersonaSeleccionada.clavePersona;
                    $scope.nombrePersonaIIE = $scope.PersonaSeleccionada.nombreCompleto;

                    $scope.integranteIIE = selectedItem.nombreCompleto;

                    $scope.integrantesIIE.push(selectedItem);

                    $scope.grupoColegiadoPartIIE.nombreIntegrante = selectedItem.nombreCompleto;
                    $scope.grupoColegiadoPartIIE.claveEmpleado = selectedItem.clavePersona;
                    $scope.grupoColegiadoPartIIE.cargo = true;
                    $scope.form.$setDirty();
                }


           
                
            });
        };


        $scope.add_integrante_IIE = function () {
                        
            if ($scope.grupoColegiadoPartIIE.cargoy == "" || $scope.grupoColegiadoPartIIE.cargoy == null || $scope.grupoColegiadoPartIIE.cargoy == undefined) {
                toastr.error("Debe ingresar un cargo");
            } else {
                $scope.integrantesIIEM.push(
                       {
                           "nombre"       : $scope.grupoColegiadoPartIIE.nombreIntegrante,
                           "ClaveEmpleado": $scope.grupoColegiadoPartIIE.claveEmpleado,
                           "cargo"        : $scope.grupoColegiadoPartIIE.cargoy
                       });

                $scope.cargosIIE.push($scope.grupoColegiadoPartIIE.cargoy);
                $scope.NombresIIE.push($scope.grupoColegiadoPartIIE.nombreIntegrante);
                $scope.integrantesIIEE.push($scope.grupoColegiadoPartIIE.claveEmpleado);
                $scope.grupoColegiadoPartIIE.cargo = null;
                $scope.grupoColegiadoPartIIE.cargoy = "";
                $scope.integranteIIE  = "";
            }
        }


        $scope.deleteIntegranteIIE = function (index) {
            $scope.integrantesIIEM.splice(index, 1);
            $scope.cargosIIE.splice(index, 1);
            $scope.NombresIIE.splice(index, 1);
            $scope.integrantesIIEE.splice(index, 1);
        }

    }
})();