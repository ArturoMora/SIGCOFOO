(function () {
    "use strict";

    angular
        .module("ineel.controllers")
        .controller("buscarProductoInnovador", ["AuthService", "$scope", "$uibModal", "MenuService", "DTColumnDefBuilder", "DTOptionsBuilder", "productoInnovadorService", buscarProductoInnovador]);

    function buscarProductoInnovador(AuthService, $scope, $uibModal, MenuService, DTColumnDefBuilder, DTOptionsBuilder, productoInnovadorService) {
        $scope.ClavePersonaLogin = AuthService.authentication.userprofile.clavePersona;
        //Obtener GIbuscarProductoInnovador
        $scope.busqueda = false;
        $scope.limpia = false;
        //Obtener

        $scope.buscar = function () {
            productoInnovadorService.GetConsultaRevisarComite($scope.prod).then(
                function (result) {
                    $scope.registros = result.data;
                    $scope.busqueda = true;
                },
                function (err) {
                    toastr.error("No se han podido cargar los registros de productos innovadores.");
                });
        }
        
        //Se recuperan los parametros ingresados por el usuario
        $scope.prod = MenuService.getVariable('busquedaProductosInnovadores'); //parametros de busqueda del usuario
        if ($scope.prod == null) {
            $scope.prod = {};
            $scope.paramsDT = {};
            $scope.paramsDT.displayStart = 0;
        }
        else {
            $scope.paramsDT = JSON.parse(localStorage.getItem('GIbuscarProductoInnovador' + window.location.pathname)); //Recuperamos los parametros de filtrado en el DT
            if ($scope.paramsDT == null) {
                $scope.paramsDT = {};  //Puede que sean nulos, en dado caso se mostrara la pagina 1
                $scope.paramsDT.displayStart = 0;
            }
            $scope.buscar();
            MenuService.deleteVariable('busquedaProductosInnovadores');
        }


        //Opciones para el datatable
        $scope.dtOptions = DTOptionsBuilder.newOptions()
            .withOption('stateSaveCallback', stateSaveCallback)
            .withOption('stateLoadCallback', stateLoadCallback)
            .withOption('displayStart', $scope.paramsDT.displayStart);

        //funcion que guarda el estado del datatable
        function stateSaveCallback(settings, data) {
            var stado = $('#GIbuscarProductoInnovador').DataTable().state();
            localStorage.setItem('GIbuscarProductoInnovador' + window.location.pathname, JSON.stringify(stado))
        }

        //funcion que carga el estado del datatable
        function stateLoadCallback(settings) {
            if ($scope.paramsDT != null && $scope.limpia) {
                $scope.paramsDT = {};
                $scope.paramsDT.displayStart = 0;
                $scope.limpia = false;
                return $scope.paramsDT;
            }
            if ($scope.paramsDT != null) {
                return $scope.paramsDT;
            } else {
                return JSON.parse(localStorage.getItem('GIbuscarProductoInnovador' + window.location.pathname))
            }

        }

        $scope.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef([0,3]).withOption('type', 'string') //definimos el tipo de datos de cada columna 
            
        ];

        $scope.openProyecto = function () {
            $scope.desabilitar = true;
            $scope.proyectoSelect = {};
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/buscarProyecto.html',
                controller: 'ProyectosFilterSubprogramaCtrl as showCase',
                resolve: {
                    proyectoSelect: function () {
                        $scope.verproyecto = false;
                        return $scope.proyectoSelect;
                    }
                },
                scope: $scope
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.prod.proyectoNombre = selectedItem.nombre;
                $scope.prod.proyectoId = selectedItem.proyectoId;

            });
        }


        $scope.reset = function () {
            $scope.prod = {};
            $scope.busqueda = false;
            $scope.limpia = true;
        };
    }
})();