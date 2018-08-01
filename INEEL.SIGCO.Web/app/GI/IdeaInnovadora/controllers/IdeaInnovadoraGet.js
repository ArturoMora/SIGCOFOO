(function () {
    "use strict";

    angular
        .module("ineel.controllers")
        .controller("ideaInnovadoraGet", ["AuthService", "$scope", "MenuService", "DTColumnDefBuilder", "DTOptionsBuilder", "IdeainnovadoraService", IdeaInnovadoraGet]);

    function IdeaInnovadoraGet(AuthService, $scope, MenuService, DTColumnDefBuilder, DTOptionsBuilder, IdeainnovadoraService) {
        $scope.ClavePersonaLogin = AuthService.authentication.userprofile.clavePersona;
        $scope.busqueda = false;
        $scope.idea={};

        $scope.buscar = function () {
            // if (($scope.idea.fechaInicioComparacion != null || $scope.idea.fechaInicioComparacion != undefined) &&  //en caso de que la fecha de inicio esta definida pero no la final
            //     ($scope.idea.fechaFinalComparacion == null || $scope.idea.fechaFinalComparacion == undefined)) {
            //
            //     $scope.idea.fechaFinalComparacion = new Date();
            // }
            // if (($scope.idea.fechaFinalComparacion != null || $scope.idea.fechaFinalComparacion != undefined) && //en caso de que la fecha final este definida pero no la inicial
            //     ($scope.idea.fechaInicioComparacion == null || $scope.idea.fechaInicioComparacion == undefined)) {
            //
            //     $scope.idea.fechaInicioComparacion = new Date(1975, 10, 25);
            // }
            $scope.idea.ClavePersona = $scope.ClavePersonaLogin; //importante, ya que en el repositorio se validará si esta la clave del usuario para así poder traer sus registros
            //IdeainnovadoraService.getbyclave($scope.ClavePersonaLogin).then(
            IdeainnovadoraService.GetConsultaIdeas($scope.idea).then(
                function (result) {
                    $scope.registros = result.data;
                    $scope.busqueda = true;
                },
                function (err) {
                    toastr.error("No se han podido cargar los registros de idea innovadora.");
                });
        }

        $scope.paramsDT = JSON.parse(localStorage.getItem('GIMisideaInnovadorasConsulta' + window.location.pathname)); //Recuperamos los parametros de filtrado en el DT
        if ($scope.paramsDT == null) {
            $scope.paramsDT = {};  //Puede que sean nulos, en dado caso se mostrara la pagina 1
            $scope.paramsDT.displayStart = 0;
        }

        //Se recuperan los parametros ingresados por el usuario
        // $scope.idea = MenuService.getVariable('busquedaMisIdeasInnovadorasGI'); //parametros de busqueda del usuario
        // if ($scope.idea == null) {
        //     $scope.idea = {};
        //     $scope.paramsDT = {};
        //     $scope.paramsDT.displayStart = 0;
        // }
        // else {
        //     $scope.paramsDT = JSON.parse(localStorage.getItem('GIMisideaInnovadorasConsulta' + window.location.pathname)); //Recuperamos los parametros de filtrado en el DT
        //     if ($scope.paramsDT == null) {
        //         $scope.paramsDT = {};  //Puede que sean nulos, en dado caso se mostrara la pagina 1
        //         $scope.paramsDT.displayStart = 0;
        //     }
        //     $scope.buscar();
        //     MenuService.deleteVariable('busquedaMisIdeasInnovadorasGI');
        // }


        //Opciones para el datatable
        $scope.dtOptions = DTOptionsBuilder.newOptions()
            .withOption('stateSaveCallback', stateSaveCallback)
            .withOption('stateLoadCallback', stateLoadCallback)
            .withOption('order', [4, 'desc'])
            .withOption('displayStart', $scope.paramsDT.displayStart);

        //funcion que guarda el estado del datatable
        function stateSaveCallback(settings, data) {
            var stado = $('#GIMisideaInnovadorasConsulta').DataTable().state();
            localStorage.setItem('GIMisideaInnovadorasConsulta' + window.location.pathname, JSON.stringify(stado))
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
                return JSON.parse(localStorage.getItem('GIMisideaInnovadorasConsulta' + window.location.pathname))
            }

        }

        $scope.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef([4]).withOption('type', 'date'),
            DTColumnDefBuilder.newColumnDef([0,1,2]).withOption('type', 'string')

        ];

        $scope.reset = function () {
            $scope.busqueda = false;
            $scope.limpia = true;
            $scope.idea = {};
        };

        $scope.buscar();

        //Eliminar
        $scope.delete = function (registro, id) {
            IdeainnovadoraService.delete(registro.ideaInnovadoraId).then(
                function (result) {

                    var idx = ($scope.registros.indexOf(registro));
                    $scope.registros.splice(idx, 1);
                    toastr.success(result.data);
                },
                function (err) {
                    toastr.error(err.data.message);
                });
        };

        $scope.si = function () {
            //nada
        }
        $scope.no = function () {
            $scope.reset();
        }

    }
})();
