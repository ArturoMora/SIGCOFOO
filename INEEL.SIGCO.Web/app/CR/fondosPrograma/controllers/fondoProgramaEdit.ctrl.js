(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("FondoProgramaEditCtrl", [
            "$scope",
            "$state",
            "$stateParams",
            "FondosProgramaCRService",
            "$uibModal",
            "DTOptionsBuilder",
            FondoProgramaEditCtrl
        ]);

    function FondoProgramaEditCtrl($scope, $state, $stateParams, FondosProgramaCRService, $uibModal, DTOptionsBuilder) {

        $scope.fondoPrograma_id = $stateParams.id;
        $scope.dtOptions = DTOptionsBuilder.newOptions().withDOM('rt');
        $scope.content = "si";
        $scope.seleccion = []; //Leti programa?
        $scope.sitiosWeb = [];
        $scope.sitiosWebNuevos = [];
        $scope.sitiosWebAntDel = [];
        $scope.areasSelected = [];
        $scope.areasNSelected = [];
        $scope.areasNuevos = [];
        $scope.areasAntDel = [];

        $scope.requiredatalisttestinputff = true;
        $scope.fondoPrograma = {};

        $scope.sitiosWebA = [];

        FondosProgramaCRService.getFondoProgramaFKById($scope.fondoPrograma_id).then(
            function (result) {
                $scope.fondoPrograma = result.data;
                $scope.areasSelected = $scope.fondoPrograma.tematicaPorFondoPrograma;
            },
            function (err) {
                console.error(err);
            }
        );

        //obtener lista de fuentes de financiamiento
        FondosProgramaCRService.getFuentesFinanciamientoActivas().then(
            function (result) {
                $scope.fuentesFinanciamiento = result.data;
            },
            function (err) {
                toastr.error("No se ha podido cargar los registros");
            }
        );

        //obtener lista de fuentes de financiamiento
        FondosProgramaCRService.GetTematicasNotSelect($scope.fondoPrograma_id).then(
            function (result) {
                $scope.areasNSelected = result.data;
            },
            function (err) {
                toastr.error("No se ha podido cargar los registros");
            }
        );


        // toggle selection to checks
        $scope.toggleSelection = function toggleSelection(tematicaId) {

            var idx = $scope.areasNuevos.indexOf(tematicaId);
            // is currently selected
            if (idx > -1) {
                $scope.areasNuevos.splice(idx, 1);
            }
                // is newly selected
            else {
                $scope.areasNuevos.push(tematicaId);
            }
            $scope.areasNuevos;
        };


        // $scope.$watchCollection("form.$dirty", function(newValue, oldValue){
        //     if(newValue!=oldValue){
        //         $scope.statusForm=newValue;
                
        //     }
        // })

        // $scope.statusFormBefore=function(){
        //     if($scope.form.$dirty){
        //         $scope.form.$dirty=false;
        //     }
        // }

        $scope.addLiga = function () {
          
            if ($scope.fondoPrograma) { //se hace esta comparación para comprobar que no es undefined
                var liga = $scope.fondoPrograma.descripcionLiga;
                if (liga != "" && liga != undefined) {
                    $scope.urlRegistrada = 0;

                    if ($scope.fondoPrograma.sitioWebFondoPrograma.length > 0) {
                        for (var i = 0; i < $scope.fondoPrograma.sitioWebFondoPrograma.length; i++) {
                            if ($scope.fondoPrograma.sitioWebFondoPrograma[i].url == liga) {
                                $scope.urlRegistrada = 1;
                                $scope.fondoPrograma.descripcionLiga = "";
                                break;
                            }
                        }
                    }


                    if ($scope.urlRegistrada == 0) {

                        var registro = {
                            "url": liga,
                            "descripcion": "",
                            "fechaRegistro": new Date(),
                            "autor": $scope.fondoPrograma.autor,
                            "estado": 1,
                            "fondoProgramaId": $scope.fondoPrograma.fondoProgramaId
                        }

                        FondosProgramaCRService.registrarURL(registro)
                         .then(
                              function (result) {

                                  $scope.fondoPrograma.sitioWebFondoPrograma.push(result.data);
                                  $scope.fondoPrograma.descripcionLiga = "";
                                //   if($scope.statusForm){

                                //   }
                                  toastr.success("Registro actualizado exitosamente!");
                              },
                              function (err) {
                                  console.error(err);
                              }
                        );

                    }
                    else {
                        toastr.error("La Liga de acceso indicada ya se encuentra asociada al fondo, indique otra");
                        console.log(err);
                        $scope.fondoPrograma.descripcionLiga = "";

                    }
                }
                else {
                    toastr.error("Se requiere un sitio Web, ejemplo: http://www.dominio.com");
                    $scope.fondoPrograma.descripcionLiga = "";
                }

            }
        }


            //ObtenerTematicas Para checks
            FondosProgramaCRService.getAreasTematicasChecks().then(
                function (result) {
                    $scope.areasTematicas = result.data;
                    $scope.loading = false;
                },
                function (err) {
                    toastr.error("No se han podido cargar los registros de Tem&aacute;ticas ");
                });

            //Buscar Empresa
            $scope.EmpresaSeleccionada = {};
            $scope.verempresa = false;
            $scope.openEmpresa = function () {
                $scope.institucion = {};
                var modalInstance = $uibModal.open({
                    size: 'lg',
                    templateUrl: 'app/vistasGenericas/EmpresasFilterGet.html',
                    controller: 'EmpresasFilterGetCtrl',
                    resolve: {
                        institucion: function () {
                            $scope.verempresa = false;
                            return $scope.institucion;
                        }
                    },
                    scope: $scope,
                });
                modalInstance.result.then(function (selectedItem) {
                    $scope.fondoPrograma.empresa.nombreEmpresa = selectedItem.nombreEmpresa;
                    $scope.fondoPrograma.empresaId = selectedItem.empresaId;
                    $scope.EmpresaSeleccionada = selectedItem;
                    $scope.form.$setDirty();
                });
            }

            
            $scope.deleteURL = function (obj) {

                var modalInstance = $uibModal.open({
                    templateUrl: 'app/vistasGenericas/eliminacionFisica.html',
                    controller: function ($uibModalInstance) {

                        $scope.ok = function () {

                            FondosProgramaCRService.elimnaURL(obj.sitioWebFondoProgramaId)
                                        .then(
                                            function (result) {
                                                toastr.success("Registro eliminado exitosamente!");
                                                
                                            },
                                            function (err) {
                                                console.error(err);
                                                $uibModalInstance.dismiss('cancel');
                                            });
                            $uibModalInstance.dismiss('close');
                            $scope.eliminaSitioWebFondo(obj, $uibModalInstance);

                        };

                        $scope.cancel = function () {
                            $uibModalInstance.dismiss('cancel');
                        };
                    },
                    scope: $scope
                });

                               
     

            };


            $scope.eliminaSitioWebFondo = function (obj, $uibModalInstance) {
                FondosProgramaCRService.elimnaURL(obj.sitioWebFondoProgramaId).then(
                    function (result) {
                        $scope.fondoPrograma.sitioWebFondoPrograma.splice($scope.fondoPrograma.sitioWebFondoPrograma.indexOf(obj), 1);
                        toastr.success("Registro eliminado exitosamente!");
                        
                    },
                    function (err) {
                        console.error(err);
                    });
                $uibModalInstance.dismiss('close');
            }

            $scope.saveFondoPrograma = function () {

                if ($scope.form.$invalid) {
                    toastr.error("Complete los datos requeridos");
                    return false;
                }


                $scope.seleccion;

                $scope.fondoPrograma.seleccion = $scope.seleccion;
                $scope.fondoPrograma.areasNuevos = $scope.areasNuevos;
                $scope.fondoPrograma.areasAntDel = $scope.seleccion;

                FondosProgramaCRService.update($scope.fondoPrograma).then(
                    function (result) {
                        toastr.success(result.data);
                        $scope.form.$setPristine();
                        $state.go("fondosProgramaGet");

                    },
                    function (err) {
                        console.error(err);
                    });
            };
        
    }
})();