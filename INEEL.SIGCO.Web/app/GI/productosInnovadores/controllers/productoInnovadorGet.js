(function () {
    "use strict";

    angular
        .module("ineel.controllers")
        .controller("productoInnovadorGet", ["AuthService", "$scope", "$uibModal", "MenuService", "DTColumnDefBuilder", "DTOptionsBuilder", "productoInnovadorService", productoInnovadorGet]);

    function productoInnovadorGet(AuthService, $scope, $uibModal, MenuService, DTColumnDefBuilder, DTOptionsBuilder, productoInnovadorService) {
        $scope.ClavePersonaLogin = AuthService.authentication.userprofile.clavePersona;
        $scope.rolId = MenuService.getRolId();
        $scope.busqueda = false;
        $scope.limpia = false;
        $scope.prod={};

        $scope.buscar = function () {
            $scope.prod.clavePersona = $scope.ClavePersonaLogin;
            productoInnovadorService.GetConsultaMisProductos($scope.prod).then(
                function (result) {
                    $scope.registros = result.data;
                    $scope.busqueda = true;
                },
                function (err) {
                    toastr.error("No se han podido cargar los registros de productos innovadores.");
                });
        }

        $scope.paramsDT = JSON.parse(localStorage.getItem('GIMisproductosInnovadores' + window.location.pathname)); //Recuperamos los parametros de filtrado en el DT
        if ($scope.paramsDT == null) {
            $scope.paramsDT = {};  //Puede que sean nulos, en dado caso se mostrara la pagina 1
            $scope.paramsDT.displayStart = 0;
        }

        //Se recuperan los parametros ingresados por el usuario
        // $scope.prod = MenuService.getVariable('busquedaMisProductosInnovadores'); //parametros de busqueda del usuario
        // if ($scope.prod == null) {
        //     $scope.prod = {};
        //     $scope.paramsDT = {};
        //     $scope.paramsDT.displayStart = 0;
        // }
        // else {
        //     $scope.paramsDT = JSON.parse(localStorage.getItem('GIMisproductosInnovadores' + window.location.pathname)); //Recuperamos los parametros de filtrado en el DT
        //     if ($scope.paramsDT == null) {
        //         $scope.paramsDT = {};  //Puede que sean nulos, en dado caso se mostrara la pagina 1
        //         $scope.paramsDT.displayStart = 0;
        //     }
        //     $scope.buscar();
        //     MenuService.deleteVariable('busquedaMisProductosInnovadores');
        // }


        //Opciones para el datatable
        $scope.dtOptions = DTOptionsBuilder.newOptions()
            .withOption('stateSaveCallback', stateSaveCallback)
            .withOption('stateLoadCallback', stateLoadCallback)
            .withOption('displayStart', $scope.paramsDT.displayStart);

        //funcion que guarda el estado del datatable
        function stateSaveCallback(settings, data) {
            var stado = $('#GIMisproductosInnovadores').DataTable().state();
            localStorage.setItem('GIMisproductosInnovadores' + window.location.pathname, JSON.stringify(stado))
        }

        //funcion que carga el estado del datatable
        function stateLoadCallback(settings) {
            // if ($scope.paramsDT != null && $scope.limpia) {
            //     $scope.paramsDT = {};
            //     $scope.paramsDT.displayStart = 0;
            //     $scope.limpia = false;
            //     return $scope.paramsDT;
            // }
            if ($scope.paramsDT != null) {
                return $scope.paramsDT;
            } else {
                return JSON.parse(localStorage.getItem('GIMisproductosInnovadores' + window.location.pathname))
            }

        }


        $scope.dtColumnDefs = [
                    DTColumnDefBuilder.newColumnDef([0, 1, 3,4,5]).withOption('type', 'string') //definimos el tipo de datos de cada columna
                ];

        $scope.buscar();
        // $scope.reset = function () {
        //     $scope.prod = {};
        //     $scope.busqueda = false;
        //     $scope.limpia = true;
        // };
        //
        // $scope.openProyecto = function () {
        //     $scope.desabilitar = true;
        //     $scope.proyectoSelect = {};
        //     var modalInstance = $uibModal.open({
        //         size: 'lg',
        //         templateUrl: 'app/vistasGenericas/buscarProyecto.html',
        //         controller: 'ProyectosFilterSubprogramaCtrl as showCase',
        //         resolve: {
        //             proyectoSelect: function () {
        //                 $scope.verproyecto = false;
        //                 return $scope.proyectoSelect;
        //             }
        //         },
        //         scope: $scope
        //     });
        //     modalInstance.result.then(function (selectedItem) {
        //         $scope.prod.proyectoNombre = selectedItem.nombre;
        //         $scope.prod.proyectoId = selectedItem.proyectoId;
        //
        //     });
        // }


        //Eliminar
        $scope.delete = function (registro) {
            
            productoInnovadorService.delete(registro.productoId).then(
                function (result) {
                    var idx = ($scope.registros.indexOf(registro));
                    $scope.registros.splice(idx, 1);
                    toastr.success(result.data);
                },
            function (err) {
                toastr.error(err.data.message);
            });
        };

    }
})();
