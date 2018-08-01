(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("ActividadAdicionalAddCtrl", [
        "AuthService",
        "$scope","$rootScope",
        "$state",
        "$stateParams",
        "$filter",
        "AliadosCRService",
        "$uibModal",
        "DTOptionsBuilder",
        ActividadAdicionalAddCtrl
        ]);

    function ActividadAdicionalAddCtrl(AuthService, $scope, $rootScope, $state, $stateParams, $filter, AliadosCRService, $uibModal, DTOptionsBuilder) {
        $scope.authentication = AuthService.authentication;
        $scope.dtOptions = DTOptionsBuilder.newOptions().withDOM('frtp');
        $scope.aliado_id = $stateParams.id;
        $scope.actividadAdicional = {};

        $scope.actividad = {};

        $scope.unidadesO = [];


        $scope.nombreUnidad = {};
        $scope.unidadesOA = [];

        //Para modal de personas
        $scope.personasO = [];
        $scope.personasOA = [];
        $scope.ruPersonasOA = [];
        $scope.fechasPersonasOA = [];


        $scope.datePicker50 = getRangoDeFechaDefault(0, 0, 50);
        // desdel el 75 a 50 años de la fecha actual
        

        //obtiene el nombre del aliado
        AliadosCRService.getAliado($scope.aliado_id).then(
            function (result) {
                $scope.aliados = result.data;
                $scope.actividadAdicional = result.data;
            },
            function (err) {
                console.error(err);
        });


        $scope.$watch('nombreUnidad', function () {
            $scope.openArea();
        });


        $scope.openArea = function () {
           
            if ($scope.nombreUnidad != null) {

                $scope.unidadYaRegistrada = 0;

                if ($scope.nombreUnidad.claveUnidad != "") {




                    for (var i = 0; i < $scope.unidadesOA.length; i++) {
                        if ($scope.unidadesOA[i] == $scope.nombreUnidad.claveUnidad) {
                            $scope.unidadYaRegistrada = 1;
                            break;
                        }
                    }


                }



               
                if ($scope.unidadYaRegistrada == 1) {
                    toastr.error("El área seleccionada ya se encuentra asociada a la actividad, seleccione otra");
                    $scope.nombreUnidad = null;
                }
                else {
                    if ($scope.nombreUnidad.claveUnidad != null || $scope.nombreUnidad.claveUnidad != undefined) {
                        $scope.actividadAdicional.nombreUnidad = $scope.nombreUnidad.nombreUnidad;
                        $scope.actividadAdicional.claveUnidad = $scope.nombreUnidad.claveUnidad;
                        $scope.actividadAdicional.fechaEfectiva = $scope.nombreUnidad.fechaEfectiva;
                        $scope.unidadesO.push($scope.nombreUnidad);
                        $scope.unidadesOA.push($scope.nombreUnidad.claveUnidad);
                        $scope.nombreUnidad = null;
                    }
                }
            }
        }

        $scope.deleteArea = function (area, index) {
            $scope.descripcionRow = area.nombreUnidad;
            var modalInstance = $uibModal.open({
                templateUrl: 'app/vistasGenericas/eliminacionFisica.html',
                controller: function ($uibModalInstance) {

                    $scope.ok = function () {
                        $scope.unidadesO.splice(index, 1);
                        $scope.unidadesOA.splice(index, 1);
                        $uibModalInstance.dismiss('close');
                    };

                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                scope: $scope
            });
        };

        ////////////////////////////////////Buscar EO
        $scope.PersonaSeleccionado = {};
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
                var idx = $scope.personasOA.indexOf(selectedItem.clavePersona);
                if (idx > -1) {
                    toastr.error("La persona seleccionada ya se encuentra asociada a la actividad, seleccione otra");
                }
                //    // is newly selected
                else {
                   
                    $scope.PersonaSeleccionado = selectedItem;
                    $scope.actividadAdicional.nombrePersona = selectedItem.nombreCompleto;
                    $scope.personasO.push(selectedItem);
                    $scope.personasOA.push(selectedItem.clavePersona);
                    $scope.form.$setDirty();
                    
                }
            });
        }

  

        $scope.deletePersona = function (persona, index) {
            $scope.descripcionRow = persona.nombreCompleto;
            var modalInstance = $uibModal.open({
                templateUrl: 'app/vistasGenericas/eliminacionFisica.html',
                controller: function ($uibModalInstance) {

                    $scope.ok = function () {
                        $scope.personasO.splice(index, 1);
                        $scope.personasOA.splice(index, 1);

                        
                        $uibModalInstance.dismiss('close');
                    };

                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                scope: $scope
            });
        };

        $scope.AddActividadAdicional = function () {
            
                $scope.actividadAdicional.DescripcionActividad = $scope.actividadAdicional.descripcionActividad;
              
              
                $scope.unidadesOA = [];
                for (var i = 0; i < $scope.unidadesO.length; i++) {
                    $scope.unidadesOA.push($scope.unidadesO[i].claveUnidad);
                }//siguiendo la logina inicial,
                $scope.actividadAdicional.AreasActividad = $scope.unidadesOA;
         

                $scope.actividadAdicional.ClavePersonaActividad = $scope.personasOA;
              

                
              
                //$scope.desactivar = true;
                AliadosCRService.createActividad($scope.actividadAdicional)
                    .then(
                        function(result) {
                            toastr.success(result.data);
                            $rootScope.globalRegresar();
                            //$state.go("aliadosGet");
                        },
                        function(err) {
                            toastr.error(err.data.message);
                            console.error(err.data);
                            $scope.desactivar = false;
                        });
            //}
        }
    }
})();