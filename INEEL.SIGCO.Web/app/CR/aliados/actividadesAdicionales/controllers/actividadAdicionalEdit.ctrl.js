(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("ActividadAdicionalEditCtrl", [
        "AuthService",
        "$scope",
        "$state",
        "$stateParams",
        "$filter",
        "AliadosCRService",
        "$uibModal",
        "DTOptionsBuilder",
        ActividadAdicionalEditCtrl
        ]);

    function ActividadAdicionalEditCtrl(AuthService, $scope, $state, $stateParams, $filter, AliadosCRService, $uibModal, DTOptionsBuilder) {
        $scope.authentication = AuthService.authentication;
        $scope.actividadAdicional_id = $stateParams.id;
        $scope.dtOptions = DTOptionsBuilder.newOptions().withDOM('rt');
        $scope.actividadesAdicional = {};

        $scope.datePicker50 = getRangoDeFechaDefault(0, 0, 50);
        // desdel el 75 a 50 años de la fecha actual

        $scope.uoselecionada = {};
        $scope.PersonaSeleccionado = {};
  
        AliadosCRService.getActividad($scope.actividadAdicional_id).then(
            function (result) {
                $scope.actividadesAdicional = result.data;
                $scope.actividadesAdicional.fechaActividad = new Date($scope.actividadesAdicional.fechaActividad);
            },
            function (err) {
                console.error(err);
        });

              
        $scope.openPersona = function () {
            $scope.selectItem = {};
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/PersonasFilterGet.html',
                controller: 'PersonasFilterGetCtrl',
                resolve: {
                    selectItem: function () {
                        return $scope.selectItem;
                    }
                },
                scope: $scope
            });

            modalInstance.result.then(function (selectedItem) {

                $scope.unidadYaRegistrada = 0;
                
                if ($scope.actividadesAdicional.personalActividadAdicional.length > 0) {
                    for (var i = 0; i < $scope.actividadesAdicional.personalActividadAdicional.length; i++) {
                        if ($scope.actividadesAdicional.personalActividadAdicional[i].clavePersona == selectedItem.clavePersona) {
                            $scope.unidadYaRegistrada = 1;
                            break;
                        }
                    }
                }

                if ($scope.unidadYaRegistrada == 0) {

                    var registro = {
                        "fechaRegistro": new Date(),
                        "estado": 1,
                        "autor": $scope.actividadesAdicional.autor,
                        "actividadAdicionalId": $scope.actividadesAdicional.actividadAdicionalId,
                        "clavePersona": selectedItem.clavePersona
                    };

                    AliadosCRService.registraPersona(registro)
                      .then(
                            function (result) {
                                result.data.personas = selectedItem;
                                $scope.actividadesAdicional.personalActividadAdicional.push(result.data);
                                // $scope.form.$setDirty();
                                toastr.success("Registro creado exitosamente!");

                            },
                            function (err) {
                                console.error(err);
                            }
                      );

                } else {
                    toastr.error("El investigador seleccionado ya se encuentra registrado");
                }

            });
        };
         
        $scope.deletePersona = function (obj) {
            var index = $scope.actividadesAdicional.personalActividadAdicional.indexOf(obj);

            debugger;
            var modalInstance = $uibModal.open({
                templateUrl: 'app/vistasGenericas/eliminacionFisica.html',
                controller: function ($uibModalInstance) {

                    $scope.ok = function () {
                        AliadosCRService.eliminaPersona(obj.personalActividadAdicionalId)
                        .then(
                            function (result) {
                                toastr.success("Registro eliminado exitosamente!");
                                $scope.actividadesAdicional.personalActividadAdicional.splice(index, 1);
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
  
        $scope.saveActividadAdicional = function () {
                                          
            AliadosCRService.updateActividad($scope.actividadesAdicional)
                    .then(
                        function(result) {
                           
                            toastr.success("Registro actualizado exitosamente!");
                            $scope.form.$setPristine();
                           
                        },
                        function(err) {
                            console.error(err);
                           
                        });
            
        };

        $scope.$watch('uoselecionada', function () {
            if ($scope.actividadesAdicional != null) {
                if ($scope.uoselecionada.claveUnidad != null || $scope.uoselecionada.claveUnidad != undefined)
                    $scope.saveUnidad();
            }
        });
        
        $scope.saveUnidad = function () {

            $scope.unidadYaRegistrada = 0;

            if ($scope.uoselecionada.claveUnidad != "") {

                if ($scope.actividadesAdicional != null) {
                    if ($scope.actividadesAdicional.areaActividadAdicional.length > 0) {
                        
                        for (var i = 0; i < $scope.actividadesAdicional.areaActividadAdicional.length; i++) {
                            if ($scope.actividadesAdicional.areaActividadAdicional[i].claveUnidad == $scope.uoselecionada.claveUnidad) {
                                $scope.unidadYaRegistrada = 1;
                                break;
                            }
                        }
                    }
                }
            }

            if ($scope.unidadYaRegistrada == 0) {

                var registro = {
                    "fechaRegistro": new Date(),
                    "estado": 1,
                    "autor": $scope.actividadesAdicional.autor,
                    "actividadAdicionalId": $scope.actividadesAdicional.actividadAdicionalId,
                    "claveUnidad": $scope.uoselecionada.claveUnidad
                }

                AliadosCRService.registraArea(registro)
                 .then(
                      function (result) {
                        result.data.unidadOrganizacional = $scope.uoselecionada;
                        $scope.actividadesAdicional.areaActividadAdicional.push(result.data);
                        toastr.success("Registro creado exitosamente!");
                        $scope.uoselecionada = null;
                      },
                      function (err) {
                        console.error(err);
                      }
                );

            } else {
                toastr.error("La unidad seleccionada ya se encuentra registrada");
                $scope.uoselecionada = null;
            }
        };

        $scope.deleteArea = function (obj) {
            var index = $scope.actividadesAdicional.areaActividadAdicional.indexOf(obj);
            var modalInstance = $uibModal.open({
                templateUrl: 'app/vistasGenericas/eliminacionFisica.html',
                controller: function ($uibModalInstance) {

                    $scope.ok = function () {
                        AliadosCRService.eliminaArea(obj.areaActividadAdicionalId)
                        .then(
                            function (result) {
                                toastr.success("Registro eliminado exitosamente!");
                                $scope.actividadesAdicional.areaActividadAdicional.splice(index, 1);
                                // $scope.form.$setDirty();
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

    }
})();