(function () {
    "use strict";

    angular
        .module("ineelMT")
        .controller("capitulosCtrlGet", ["AuthService", "$scope", "$rootScope", "CapituloService", "$uibModal", '$state', capitulosCtrlGet]);

    function capitulosCtrlGet(AuthService, $scope, $rootScope, CapituloService, $uibModal, $state) {
        /******NOTA: ESTE ARCHIVO YA NO SE UTILIZA, EL CONTROLADOR  ESTA EN CH */
        /******NOTA: ESTE ARCHIVO YA NO SE UTILIZA, EL CONTROLADOR ESTA EN CH */
        /******NOTA: ESTE ARCHIVO YA NO SE UTILIZA, EL CONTROLADOR ESTA EN CH */
        jQuery.fn.DataTable.ext.type.search.string = function (data) { return !data ? '' : typeof data === 'string' ? data.replace(/έ/g, 'ε').replace(/ύ/g, 'υ').replace(/ό/g, 'ο').replace(/ώ/g, 'ω').replace(/ά/g, 'α').replace(/ί/g, 'ι').replace(/ή/g, 'η').replace(/\n/g, ' ').replace(/[áÁ]/g, 'a').replace(/[éÉ]/g, 'e').replace(/[íÍ]/g, 'i').replace(/[óÓ]/g, 'o').replace(/[úÚ]/g, 'u').replace(/ê/g, 'e').replace(/î/g, 'i').replace(/ô/g, 'o').replace(/è/g, 'e').replace(/ï/g, 'i').replace(/ü/g, 'u').replace(/ã/g, 'a').replace(/õ/g, 'o').replace(/ç/g, 'c').replace(/ì/g, 'i') : data; };

        $scope.authentication = AuthService.authentication;
        $scope.numEmp = AuthService.authentication.userprofile.clavePersona;
        
        CapituloService.GetByClave($scope.numEmp).then(
            function (result) {
                $scope.registros = result.data;
            },
            function (err) {
                console.log(err);
                toastr.error("No se han podido cargar los registros de Capítulos");
            }
            );

        $scope.open = function (registro) {
            //$scope.descripcionRow = registro.tituloPonencia;           
            var modalInstance = $uibModal.open({
                templateUrl: 'app/vistasGenericas/eliminacionFisica.html',
                controller: function ($uibModalInstance) {

                    $scope.ok = function () {
                        $scope.delete(registro, $uibModalInstance);
                    };

                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                scope: $scope
            });
        };


        $rootScope.parametros = {};
        $scope.nombreMiga = function () {
            $rootScope.parametros.nombreM = "Mis capitulos";
        }

        $scope.detalleCapitulos = function (idReg) {
            $state.go("CapituloDetails", { id: idReg });
        }

        //Eliminar registro
        $scope.delete = function (registro, $uibModalInstance) {
            CapituloService.delete(registro.capitulosId).then(
                    function (result) {
                        debugger;
                        var idx = ($scope.registros.indexOf(registro));
                        $scope.registros.splice(idx, 1);
                        toastr.success(result.data);
                        $uibModalInstance.dismiss('close');
                    },
                    function (err) {
                        toastr.error(err.data.message);
                    });
        };


    }
})();