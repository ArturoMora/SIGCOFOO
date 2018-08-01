(function () {
    "use strict";

    angular
        .module("ineel.controllers")
        .controller("creafin", ["AuthService", "$scope", "$state", "MenuService", "DTColumnDefBuilder", "$uibModal", "DTOptionsBuilder", "creafinService", creafin]);

    function creafin(AuthService, $scope, $state, MenuService, DTColumnDefBuilder, $uibModal, DTOptionsBuilder, creafinService) {
        $scope.claveEmpleado = AuthService.authentication.userprofile.clavePersona;
        $scope.busqueda = false;
        $scope.limpia = false;

        


        


        creafinService.GetFactoresInnovacion().then(function (res) {
            $scope.factores = res.data;
        }, function (err) {
            toast.error("Error al cargar los datos de factores de innovación");
        });

        $scope.buscar = function () {
            //creafinService.GatAllCompendio2().then(
            creafinService.GetConsultaCompendio($scope.compendio).then(
                function (result) {
                    $scope.registros = result.data;
                    $scope.busqueda = true;
                },
                function (err) {
                    toastr.error("No se han podido cargar los registros de CREAFIN.");
                });
        }

        $scope.compendio = MenuService.getVariable('busquedaCompendio');
        if ($scope.compendio == null) {
            $scope.compendio = {};
            $scope.paramsDT = {};
            $scope.paramsDT.displayStart = 0;
        }
        else {
            $scope.paramsDT = JSON.parse(localStorage.getItem('GIcreafin' + window.location.pathname)); //Recuperamos los parametros de filtrado en el DT
            if ($scope.paramsDT == null) {
               $scope.paramsDT = {};  //Puede que sean nulos, en dado caso se mostrara la pagina 1
               $scope.paramsDT.displayStart = 0;
            }
            $scope.buscar();
            MenuService.deleteVariable('busquedaCompendio');
        }

        
        //Opciones para el datatable
        $scope.dtOptions = DTOptionsBuilder.newOptions()
           .withOption('stateSaveCallback', stateSaveCallback)
           .withOption('stateLoadCallback', stateLoadCallback)
           .withOption('displayStart', $scope.paramsDT.displayStart);

        //funcion que guarda el estado del datatable
        function stateSaveCallback(settings, data) {
           var stado = $('#GIcreafin').DataTable().state();
           localStorage.setItem('GIcreafin' + window.location.pathname, JSON.stringify(stado))
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
               return JSON.parse(localStorage.getItem('GIcreafin' + window.location.pathname))
           }

        }

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
                $scope.compendio.proyectoNombre = selectedItem.nombre;
                $scope.compendio.proyectoId = selectedItem.proyectoId;

            });
        }

        $scope.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef([1, 2, 4]).withOption('type', 'string') //definimos el tipo de datos de cada columna 
            
        ];

        $scope.reset = function () {
            var inputPeriodo = document.getElementById('periodo');
            inputPeriodo.value = "";
            $scope.Search.periodo.$dirty = false;
            $scope.Search.periodo.$invalid = false;
            //Search.periodo.$dirty && Search.periodo.$invalid
            $scope.compendio = {};
            $scope.busqueda = false;
            $scope.limpia = true;
        };

        $scope.si = function () {
            //nada
        }

        $scope.no = function () {
            $scope.reset();
        }
    }
})();