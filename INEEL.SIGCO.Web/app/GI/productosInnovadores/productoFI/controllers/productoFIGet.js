(function () {
    "use strict";

    angular
        .module("ineel.controllers")
        .controller("productoFI", ["AuthService", "$scope", "productoInnovadorService", "DTColumnDefBuilder", "MenuService", "DTOptionsBuilder","$uibModal", productoFI]);

    function productoFI(AuthService, $scope, productoInnovadorService, DTColumnDefBuilder, MenuService, DTOptionsBuilder, $uibModal) {

        $scope.ClavePersonaLogin = AuthService.authentication.userprofile.clavePersona;
        $scope.rolId = MenuService.getRolId();
        $scope.prod = {};
        $scope.busqueda = false;
        $scope.limpia = false;
        //Obtener

        $scope.buscar = function () {
            if ($scope.rolId == 1028) {
                //productoInnovadorService.getAllRevisarComite2().then(
                productoInnovadorService.GetConsultaSolicitudesFI($scope.prod).then(
                    function (result) {
                        $scope.busqueda = true;
                        $scope.registros = result.data;
                    },
                    function (err) {
                        toastr.error("No se han podido cargar los registros de productos innovadores.");
                    });
            } else {
                $scope.prod.clavePersona = $scope.ClavePersonaLogin;
                //productoInnovadorService.GetAllByEvaluadorFI($scope.ClavePersonaLogin).then(
                productoInnovadorService.GetConsultaSolicitudesFI($scope.prod).then(
                    function (result) {
                        $scope.busqueda = true;
                        $scope.registros = result.data;
                    },
                    function (err) {
                        toastr.error("No se han podido cargar los registros de productos innovadores.");
                    });
            }
        }

        $scope.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef([0,3,7]).withOption('type', 'string') //definimos el tipo de datos de cada columna 
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
            $scope.unidadOselect = null;

        };


        //Se recuperan los parametros ingresados por el usuario
        $scope.prod = MenuService.getVariable('busquedaSolicitudesFI'); //parametros de busqueda del usuario
        if ($scope.prod == null) {
            $scope.prod = {};
            $scope.paramsDT = {};
            $scope.paramsDT.displayStart = 0;
        }
        else {
            $scope.paramsDT = JSON.parse(localStorage.getItem('GIproductoFI' + window.location.pathname)); //Recuperamos los parametros de filtrado en el DT
            if ($scope.paramsDT == null) {
                $scope.paramsDT = {};  //Puede que sean nulos, en dado caso se mostrara la pagina 1
                $scope.paramsDT.displayStart = 0;
            }
            $scope.buscar();
            MenuService.deleteVariable('busquedaSolicitudesFI');
        }


        //Opciones para el datatable
        $scope.dtOptions = DTOptionsBuilder.newOptions()
            .withOption('stateSaveCallback', stateSaveCallback)
            .withOption('stateLoadCallback', stateLoadCallback)
            .withOption('displayStart', $scope.paramsDT.displayStart);

        //funcion que guarda el estado del datatable
        function stateSaveCallback(settings, data) {
            var stado = $('#GIproductoFI').DataTable().state();
            localStorage.setItem('GIproductoFI' + window.location.pathname, JSON.stringify(stado))
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
                return JSON.parse(localStorage.getItem('GIproductoFI' + window.location.pathname))
            }

        }

    }

})();