(function () {
    "use strict";

    var app = angular.module("ineelCH");

    app.controller("asociacionGetCtrl", ["AuthService", "$scope","$rootScope", "AsociacionesService", "$uibModal", "DTOptionsBuilder", "DTColumnBuilder", "DTColumnDefBuilder","$state", asociacionGetCtrl]);
    function asociacionGetCtrl(AuthService,  $scope, $rootScope, AsociacionesService, $uibModal, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder, $state) {
        jQuery.fn.DataTable.ext.type.search.string = function (data) { return !data ? '' : typeof data === 'string' ? data.replace(/έ/g, 'ε').replace(/ύ/g, 'υ').replace(/ό/g, 'ο').replace(/ώ/g, 'ω').replace(/ά/g, 'α').replace(/ί/g, 'ι').replace(/ή/g, 'η').replace(/\n/g, ' ').replace(/[áÁ]/g, 'a').replace(/[éÉ]/g, 'e').replace(/[íÍ]/g, 'i').replace(/[óÓ]/g, 'o').replace(/[úÚ]/g, 'u').replace(/ê/g, 'e').replace(/î/g, 'i').replace(/ô/g, 'o').replace(/è/g, 'e').replace(/ï/g, 'i').replace(/ü/g, 'u').replace(/ã/g, 'a').replace(/õ/g, 'o').replace(/ç/g, 'c').replace(/ì/g, 'i') : data; };

        $rootScope.setVariable("CHficha", "fichapersonal.asociacion");
        $scope.loading = true;
        $scope.editarGestion = 0;
        $rootScope.idG = "";
        $scope.setId = function (id) {
            //alert(id);
            $rootScope.idG = id;
        }

        $scope.paramsDT = JSON.parse(localStorage.getItem('TableasociacionGet' + window.location.pathname)); //Recuperamos los parametros de filtrado en el DT
        if ($scope.paramsDT == null) {
            $scope.paramsDT = {};  //Puede que sean nulos, en dado caso se mostrara la pagina 1
            $scope.paramsDT.displayStart = 0;
        }

        $scope.dtOptions = DTOptionsBuilder.newOptions()
            .withOption('stateSaveCallback', stateSaveCallback)
            .withOption('stateLoadCallback', stateLoadCallback)
            .withOption('displayStart', $scope.paramsDT.displayStart);


        function stateSaveCallback(settings, data) {
            var stado = $('#TableasociacionGet').DataTable().state();
            localStorage.setItem('TableasociacionGet' + window.location.pathname, JSON.stringify(stado))
        }

        function stateLoadCallback(settings) {
            if ($scope.paramsDT != null) {
                return $scope.paramsDT;
            } else {
                return JSON.parse(localStorage.getItem('TableasociacionGet' + window.location.pathname))
            }

        }



        //Obtener los servicios de autenticacion
        $scope.authentication = AuthService.authentication;
        //numero usuario
        //Gestion de ficha
        $scope.idGF = $rootScope.GestionFichasClave;
        if ($scope.idGF == null) {
            $scope.clave = AuthService.authentication.userprofile.clavePersona;
        } else {
            $scope.clave = $scope.idGF;
            $scope.editarGestion = 1;
        }
        $rootScope.idG = "";
        $scope.setId = function (id) {
            //alert(id);
            $rootScope.idG = id;
        }

        //obtener por clave
        AsociacionesService.getbyclave($scope.clave).then(
            function (result) {
                $scope.registroasociacion = result.data;
            }
            ),
            function (err) {
                toastr.error("No se han podido cargar los registros de asociaciones");
            }

        //Modal Confirmación Eliminado
        $scope.open = function (asociacion) {
            $scope.descripcionRow = asociacion.asociacion.descripcion;
            var modalInstance = $uibModal.open({
                templateUrl: 'app/vistasGenericas/eliminacionFisica.html',
                controller: function ($uibModalInstance) {

                    $scope.ok = function () {
                        $scope.delete(asociacion, $uibModalInstance);
                    };

                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                scope: $scope
            });
        };

        //Eliminar
        $scope.delete = function (asociacion, $uibModalInstance) {
            AsociacionesService.delete(asociacion.asociacionesId).then(
                function (result) {
                    var idx = ($scope.registroasociacion.indexOf(asociacion));
                    $scope.registroasociacion.splice(idx, 1);
                    toastr.success(result.data);
                    $uibModalInstance.dismiss('close');
                },
                function (err) {
                    toastr.error(err.data.message);
                })
        };
        $scope.navegador = function () {
            $state.go("asociacionesEdit");
        };
    }
})();