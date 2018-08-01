(function () {
    "use strict";

    angular
        .module("ineelMT")
        .controller("publicacionCtrlGet", ["AuthService", "$scope", "$rootScope", "PublicacionService", "$uibModal", "$state", "DTOptionsBuilder", "DTColumnDefBuilder", publicacionCtrlGet]);

    function publicacionCtrlGet(AuthService, $scope, $rootScope, PublicacionService, $uibModal, $state, DTOptionsBuilder, DTColumnDefBuilder) {
        jQuery.fn.DataTable.ext.type.search.string = function (data) { return !data ? '' : typeof data === 'string' ? data.replace(/έ/g, 'ε').replace(/ύ/g, 'υ').replace(/ό/g, 'ο').replace(/ώ/g, 'ω').replace(/ά/g, 'α').replace(/ί/g, 'ι').replace(/ή/g, 'η').replace(/\n/g, ' ').replace(/[áÁ]/g, 'a').replace(/[éÉ]/g, 'e').replace(/[íÍ]/g, 'i').replace(/[óÓ]/g, 'o').replace(/[úÚ]/g, 'u').replace(/ê/g, 'e').replace(/î/g, 'i').replace(/ô/g, 'o').replace(/è/g, 'e').replace(/ï/g, 'i').replace(/ü/g, 'u').replace(/ã/g, 'a').replace(/õ/g, 'o').replace(/ç/g, 'c').replace(/ì/g, 'i') : data; };
        /******NOTA: ESTE ARCHIVO YA NO SE UTILIZA, EL CONTROLADOR PARA AGREGAR PUBLICACIONES ESTA EN CH */
        /******NOTA: ESTE ARCHIVO YA NO SE UTILIZA, EL CONTROLADOR PARA AGREGAR PUBLICACIONES ESTA EN CH */
        /******NOTA: ESTE ARCHIVO YA NO SE UTILIZA, EL CONTROLADOR PARA AGREGAR PUBLICACIONES ESTA EN CH */

        //Obtener los servicios de autenticacion
        $scope.authentication = AuthService.authentication;
        //obtener clave de usuario
        $scope.numEmp = AuthService.authentication.userprofile.clavePersona;
        //$rootScope.idG = "";
        //$scope.setId = function (id) {
        //    //alert(id);
        //    $rootScope.idG = id;
        //}
        //Obtener todos los registros del usuario que inicio sesion
        alert('foo');



      



        //paginado, filtros y demas cosas de un estado del Datatable
        $scope.paramsDT = JSON.parse(localStorage.getItem('CHPublicacionGet' + window.location.pathname)); //Recuperamos los parametros de filtrado en el DT
        if ($scope.paramsDT == null) {
            $scope.paramsDT = {};  //Puede que sean nulos, en dado caso se mostrara la pagina 1
            $scope.paramsDT.displayStart = 0;
        }



        $scope.dtOptions = DTOptionsBuilder.newOptions()
            .withOption('stateSaveCallback', stateSaveCallback)
            .withOption('stateLoadCallback', stateLoadCallback)
            .withOption('displayStart', $scope.paramsDT.displayStart);


        $scope.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef([1]).withOption('type', 'date'),
              DTColumnDefBuilder.newColumnDef([0]).withOption('type', 'string'),
               
        ];

        function stateSaveCallback(settings, data) {
            var stado = $('#CHPublicacionGet').DataTable().state();
            localStorage.setItem('CHPublicacionGet' + window.location.pathname, JSON.stringify(stado))
        }

        function stateLoadCallback(settings) {
            //if ($scope.paramsDT != null && $scope.limpia) {
            //    $scope.paramsDT = {};
            //    $scope.paramsDT.displayStart = 0;
            //    $scope.limpia = false;
            //    return $scope.paramsDT;
            //}
            if ($scope.paramsDT != null) {
                return $scope.paramsDT;
            } else {
                return JSON.parse(localStorage.getItem('CHPublicacionGet' + window.location.pathname))
            }

        }











        PublicacionService.getbyclave($scope.numEmp).then(
            function (result) {
                $scope.registros = result.data;
                $scope.loading = false;
            },
            function (err) {
                toastr.error("No se han podido cargar los registros de Publicacion");
            }
            );


        $scope.detallePublicacion = function (idReg) {
            $state.go("publicacionDetails", { id: idReg });
        }


        $scope.open = function (registro) {
            $scope.descripcionRow = registro.tituloPublicacion;
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


        //Eliminar registro SNI
        $scope.delete = function (registro, $uibModalInstance) {
            PublicacionService.delete(registro.publicacionId).then(
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
