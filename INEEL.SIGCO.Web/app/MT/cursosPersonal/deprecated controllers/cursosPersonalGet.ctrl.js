(function () {
    "use strict";

    angular
        .module("ineelMT")
        .controller("CursosPersonalGetCtrl", ["AuthService", "$scope", "$rootScope", "CursosPersonalServiceMT", "$state", "$uibModal", CursosPersonalGetCtrl]);

    function CursosPersonalGetCtrl(AuthService, $scope, $rootScope, CursosPersonalServiceMT, $state, $uibModal) {
        /******NOTA: ESTE ARCHIVO YA NO SE UTILIZA, EL CONTROLADOR  ESTA EN CH */
        /******NOTA: ESTE ARCHIVO YA NO SE UTILIZA, EL CONTROLADOR ESTA EN CH */
        /******NOTA: ESTE ARCHIVO YA NO SE UTILIZA, EL CONTROLADOR ESTA EN CH */
        $scope.authentication = AuthService.authentication;
        //obtener clave de usuario
        $scope.numEmp = AuthService.authentication.userprofile.clavePersona;
        //$rootScope.idG = "";
        //$scope.setId = function (id) {
        //    //alert(id);
        //    $rootScope.idG = id;
        //}
        //Obtener todos los registros del usuario que inicio sesion
        alert('fooooooa');
        CursosPersonalServiceMT.getbyclave($scope.numEmp).then(
            function (result) {
                $scope.registros = result.data;
                $scope.loading = false;
            },
            function (err) {
                toastr.error("No se han podido cargar los registros de curso Interno");
            }
            );

        $scope.open = function (registro) {
            $scope.descripcionRow = registro.titulo;
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


        $scope.detalleCursos = function (idReg) {
            $state.go("CursoDetails", { id: idReg });
        }

        //Eliminar registro SNI
        $scope.delete = function (registro, $uibModalInstance) {
            
            CursosPersonalServiceMT.delete(registro.cursoInternoId).then(
                    function (result) {
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