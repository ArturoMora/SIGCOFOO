(function () {
    "use strict";

    angular
        .module("ineel.controllers")
        .controller("buscarIdeaInnovadoraGet", ["AuthService", "$scope", "$filter", "DTOptionsBuilder", "DTColumnDefBuilder","IdeainnovadoraService","MenuService", buscarIdeaInnovadoraGet]);

    function buscarIdeaInnovadoraGet(AuthService, $scope, $filter, DTOptionsBuilder, DTColumnDefBuilder, IdeainnovadoraService, MenuService) {
        $scope.rolId = MenuService.getRolId();
        $scope.busqueda = false;
        $scope.limpia = false;
       

        $scope.buscar = function () {
            if (($scope.idea.fechaInicioComparacion != null || $scope.idea.fechaInicioComparacion != undefined) &&  //en caso de que la fecha de inicio esta definida pero no la final
                ($scope.idea.fechaFinalComparacion == null || $scope.idea.fechaFinalComparacion == undefined)) {

                $scope.idea.fechaFinalComparacion = new Date();
                $scope.idea.busquedaFecha="ok";
            }
            if (($scope.idea.fechaFinalComparacion != null || $scope.idea.fechaFinalComparacion != undefined) && //en caso de que la fecha final este definida pero no la inicial
                ($scope.idea.fechaInicioComparacion == null || $scope.idea.fechaInicioComparacion == undefined)) {

                $scope.idea.fechaInicioComparacion = new Date(1975, 10, 25);
                $scope.idea.busquedaFecha="ok";
            }
            if (($scope.idea.fechaFinalComparacion != null || $scope.idea.fechaFinalComparacion != undefined) && //en caso de que la fecha final este definida pero no la inicial
                ($scope.idea.fechaInicioComparacion != null || $scope.idea.fechaInicioComparacion != undefined)) {

                $scope.idea.busquedaFecha="ok";
            }
            if (($scope.idea.fechaInicioComparacion != null && $scope.idea.fechaFinalComparacion != null) && $scope.idea.fechaInicioComparacion > $scope.idea.fechaFinalComparacion) {
                toastr.error("Favor de introducir un rango válido de fechas");
                return false;
            }
            $scope.idea.busqueda = "general";
            //IdeainnovadoraService.getAllAceptadas2().then(
            IdeainnovadoraService.GetConsultaIdeas($scope.idea).then(
                function (result) {
                    $scope.registros = result.data;
                    if($scope.rolId!=1028){
                        $scope.registros = $filter('filter')($scope.registros,{"accesoPublico": true});
                    }
                    $scope.busqueda = true;
                },
                function (err) {
                    toastr.error("No se han podido cargar los registros de idea innovadora.");
                });
        }
        
        //Se recuperan los parametros ingresados por el usuario
        $scope.idea = MenuService.getVariable('busquedaIdeasInnovadorasGI'); //parametros de busqueda del usuario
        if ($scope.idea == null) {
            $scope.idea = {};
            $scope.paramsDT = {};
            $scope.paramsDT.displayStart = 0;
        }
        else {
            $scope.paramsDT = JSON.parse(localStorage.getItem('GIbuscarIdeaInnovadora' + window.location.pathname)); //Recuperamos los parametros de filtrado en el DT
            if ($scope.paramsDT == null) {
                $scope.paramsDT = {};  //Puede que sean nulos, en dado caso se mostrara la pagina 1
                $scope.paramsDT.displayStart = 0;
            }
            $scope.buscar();
            MenuService.deleteVariable('busquedaIdeasInnovadorasGI');
        }


        //Opciones para el datatable
        $scope.dtOptions = DTOptionsBuilder.newOptions()
            .withOption('stateSaveCallback', stateSaveCallback)
            .withOption('stateLoadCallback', stateLoadCallback)
            .withOption('order', [4, 'desc'])
            .withOption('displayStart', $scope.paramsDT.displayStart);

        //funcion que guarda el estado del datatable
        function stateSaveCallback(settings, data) {
            var stado = $('#GIbuscarIdeaInnovadora').DataTable().state();
            localStorage.setItem('GIbuscarIdeaInnovadora' + window.location.pathname, JSON.stringify(stado))
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
                return JSON.parse(localStorage.getItem('GIbuscarIdeaInnovadora' + window.location.pathname))
            }

        }

        $scope.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef([4]).withOption('type', 'date'), //definimos el tipo de datos de cada columna 
            DTColumnDefBuilder.newColumnDef([0,1,2]).withOption('type', 'string')
            
        ];


        $scope.reset = function () {
            $scope.idea = {};
            $scope.busqueda = false;
            $scope.limpia = true;
        
        };

        $scope.cambiar = function (registro) {
            if (registro.accesoPublico == true) {
                registro.tipoAcceso = 1;
            }else{
                registro.tipoAcceso = 2;
            }

            IdeainnovadoraService.updateTipoAcceso(registro);
        }

        $scope.regresar = function (registro) {
            if (registro.accesoPublico == true) {
                registro.accesoPublico = false;
                registro.tipoAcceso = 0;
            } else {
                registro.accesoPublico = true;
            }
            //for (var i = 0; i < $scope.registrosambitos.length; i++) {
            //    if ($scope.registrosambitos[i].ambitoId == id) {
            //        $scope.registrosambitos[i].estado = estado;
            //    }
            //}
        }
    }
})();