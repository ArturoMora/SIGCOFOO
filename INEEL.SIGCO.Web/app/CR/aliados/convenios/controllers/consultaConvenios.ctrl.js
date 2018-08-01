(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("ConsultaConveniosCtrl", [
            "AuthService",
            "$scope",
            "$state",
            "AliadosCRService",
            "MenuService",
            "DTOptionsBuilder",
            ConsultaConveniosCtrl
        ]);

    function ConsultaConveniosCtrl(AuthService, $scope, $state, AliadosCRService, MenuService, DTOptionsBuilder) {
        
        $scope.authentication = AuthService.authentication;
        $scope.rolId = MenuService.getRolId();
        $scope.conv = {};

        //Empresas
        AliadosCRService.getEmpresas().then(function (res) {
            $scope.empresas = res.data;
        }, function (err) {
            toastr.error("Error al cargar los datos de empresas");
            console.log(err);
        });


        //Tipos de convenio
        AliadosCRService.getTiposConvenio().then(function (res) {
            $scope.tipos = res.data;
        }, function (err) {
            toastr.error("Error al cargar los tipos de convenio");
            console.log(err);
        });


        $scope.buscar = function () {
            
            if (($scope.conv.fechaInicioComparacion != null || $scope.conv.fechaInicioComparacion != undefined) &&  //en caso de que la fecha de inicio esta definida pero no la final
                ($scope.conv.fechaFinalComparacion == null || $scope.conv.fechaFinalComparacion == undefined)) {

                $scope.conv.fechaFinalComparacion = new Date();
                $scope.conv.busquedaFecha='ok';
            }
            if (($scope.conv.fechaFinalComparacion != null || $scope.conv.fechaFinalComparacion != undefined) && //en caso de que la fecha final este definida pero no la inicial
                ($scope.conv.fechaInicioComparacion == null || $scope.conv.fechaInicioComparacion == undefined)) {

                $scope.conv.fechaInicioComparacion = new Date(1975, 10, 25);
                $scope.conv.busquedaFecha='ok';
            }
            if (($scope.conv.fechaFinalComparacion != null || $scope.conv.fechaFinalComparacion != undefined) && //en caso de que el usuario escriba las fechas manualmente
                ($scope.conv.fechaInicioComparacion != null || $scope.conv.fechaInicioComparacion != undefined)) {

                $scope.conv.busquedaFecha='ok';
            }
            if (($scope.conv.fechaInicioComparacion != null && $scope.conv.fechaFinalComparacion != null) && $scope.conv.fechaInicioComparacion > $scope.conv.fechaFinalComparacion) {
                toastr.error("Favor de introducir un rango válido de fechas");
                return false;
            }
            AliadosCRService.GetConsultaParametrizadaExpertos($scope.conv).then(
                function (result) {
                    $scope.convenios = result.data;
                    $scope.busqueda = true;
                },
                function (err) {
                    toastr.error("No se han podido cargar los registros de convenios");
                    console.log(err);
                }
            );
        }

        //Se recuperan los datos de la previa busqueda ingresada por el usuario
        $scope.conv = MenuService.getVariable('busquedaConvenios');
        if ($scope.conv == null) {
            $scope.conv = {};
            $scope.paramsDT = {};
            $scope.paramsDT.displayStart = 0;
        } else {
            $scope.paramsDT = JSON.parse(localStorage.getItem('tablaConsultaConvenios' + window.location.pathname)); //Recuperamos los parametros de filtrado en el DT
            if ($scope.paramsDT == null) {
                $scope.paramsDT = {};  //Puede que sean nulos, en dado caso se mostrara la pagina 1
                $scope.paramsDT.displayStart = 0;
            }
            $scope.buscar();
            MenuService.deleteVariable('busquedaConvenios');
        }

        $scope.dtOptions = DTOptionsBuilder.newOptions()
            .withOption('order', [0, 'asc'])
            .withOption('stateSaveCallback', stateSaveCallback)
            .withOption('stateLoadCallback', stateLoadCallback)
            .withOption('displayStart', $scope.paramsDT.displayStart);
            

        function stateSaveCallback(settings, data) {
            var stado = $('#tablaConsultaConvenios').DataTable().state();
            localStorage.setItem('tablaConsultaConvenios' + window.location.pathname, JSON.stringify(stado));
        }

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
                return JSON.parse(localStorage.getItem('tablaConsultaConvenios' + window.location.pathname));
            }

        }

        $scope.reset = function () {
            $scope.busqueda = false;
            $scope.limpia = true;
            $scope.unidadOselect = null;
            $scope.conv = {};
        };

        


        //Obtiene Vigencia
        $scope.getVigencia = function (fechaInicio,fechaTermino) {
            var vigencia = false;

            $scope.fechaActual = new Date();
            var startDateComparacion = new Date(fechaInicio);

            var finalDateComparacion = (fechaTermino == null ? null : new Date(fechaTermino));

            if (startDateComparacion <= $scope.fechaActual && (finalDateComparacion ==null || finalDateComparacion >= $scope.fechaActual )) {
                vigencia = "Activo";
            }
            else {
                vigencia = "Inactivo";
            }
            return vigencia;
        }


        //La siguiente funcion esta de manera global en globalINEEL.js
        //function removeAccents(data) {
        //    return data
        //        .replace(/έ/g, 'ε').replace(/[ύϋΰ]/g, 'υ').replace(/ό/g, 'ο').replace(/ώ/g, 'ω').replace(/ά/g, 'α')
        //        .replace(/[ίϊΐ]/g, 'ι').replace(/ή/g, 'η').replace(/\n/g, ' ').replace(/á/g, 'a').replace(/é/g, 'e')
        //        .replace(/í/g, 'i').replace(/ó/g, 'o').replace(/ú/g, 'u').replace(/ê/g, 'e').replace(/î/g, 'i')
        //        .replace(/ô/g, 'o').replace(/è/g, 'e').replace(/ï/g, 'i').replace(/ü/g, 'u').replace(/ã/g, 'a')
        //        .replace(/õ/g, 'o').replace(/ç/g, 'c').replace(/ì/g, 'i');
        //}


        var searchType = jQuery.fn.DataTable.ext.type.search;

        searchType.string = function (data) {
            return !data ?
                '' :
                typeof data === 'string' ?
                    removeAccents(data) :
                    data;
        };

        searchType.html = function (data) {
            return !data ?
                '' :
                typeof data === 'string' ?
                    removeAccents(data.replace(/<.*?>/g, '')) :
                    data;
        };



    }


})();