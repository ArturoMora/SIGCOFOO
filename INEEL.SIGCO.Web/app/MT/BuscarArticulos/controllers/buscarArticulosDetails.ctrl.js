(function () {
    "use strict";
    angular
        .module("ineel.controllers")
        .controller("BuscarArticulosDetailsCtrl", ['AuthService', '$scope', 'buscarArticulosService', "$stateParams", "globalGet", "$rootScope", 'IndicadoresMTService', BuscarArticulosDetailsCtrl]);

    function BuscarArticulosDetailsCtrl(AuthService, $scope, buscarArticulosService, $stateParams, globalGet, $rootScope, IndicadoresMTService) {

        jQuery.fn.DataTable.ext.type.search.string = function (data) { return !data ? '' : typeof data === 'string' ? data.replace(/έ/g, 'ε').replace(/ύ/g, 'υ').replace(/ό/g, 'ο').replace(/ώ/g, 'ω').replace(/ά/g, 'α').replace(/ί/g, 'ι').replace(/ή/g, 'η').replace(/\n/g, ' ').replace(/[áÁ]/g, 'a').replace(/[éÉ]/g, 'e').replace(/[íÍ]/g, 'i').replace(/[óÓ]/g, 'o').replace(/[úÚ]/g, 'u').replace(/ê/g, 'e').replace(/î/g, 'i').replace(/ô/g, 'o').replace(/è/g, 'e').replace(/ï/g, 'i').replace(/ü/g, 'u').replace(/ã/g, 'a').replace(/õ/g, 'o').replace(/ç/g, 'c').replace(/ì/g, 'i') : data; };

        var API = globalGet.get("api");
        
        var id = $stateParams.id;

        $scope.urlDescarga = API + "Descarga/GetFile";

        if ($rootScope.parametrosArticulos == 'undefined' || $rootScope.parametrosArticulos == null || $rootScope.parametrosArticulos == undefined || $rootScope.parametrosArticulos == "undefined") {

        } else {


            $rootScope.parametrosArticulos.PalabraAutor = $rootScope.parametrosArticulos.PalabraAutor;
            $rootScope.parametrosArticulos.Titulo = $rootScope.parametrosArticulos.Titulo;
            $rootScope.parametrosArticulos.Revistas = $rootScope.parametrosArticulos.Revistas;
            $rootScope.parametrosArticulos.RevistaId = $rootScope.parametrosArticulos.RevistaId;
            $rootScope.parametrosArticulos.externo = $rootScope.parametrosArticulos.externo;
            $rootScope.parametrosArticulos.Becario = $rootScope.parametrosArticulos.Becario;
            $rootScope.parametrosArticulos.ClaveRevista = $rootScope.parametrosArticulos.ClaveRevista;
            $rootScope.parametrosArticulos.externo = $rootScope.parametrosArticulos.externo;
            
        }





        //Obtener datos de usuario
        $scope.authentication = AuthService.authentication;
        //Extraer informacion del usuario//
        //obtener el registro a mostrar
        buscarArticulosService.getbyid(id).then(
            function (result) {
                buscarArticulosService.Persona(result.data.clavePersona).then(
                function (result) {
                    $scope.registro.nombrePersona = result.data.nombreCompleto;
                });
                buscarArticulosService.getByPublicacion(result.data.publicacionId).then(
                function (result) {
                    $scope.autoriie = result.data;
                });
                buscarArticulosService.getByPublicacionExt(result.data.publicacionId).then(
               function (result) {
                   $scope.autorexterno = result.data;
               });
                $scope.registro = result.data;
                if ($scope.registro.fechaPublicacion != null) {
                    $scope.registro.fechaPublicacion = new Date($scope.registro.fechaPublicacion);
                    if ($scope.registro.fechaPublicacion.getFullYear() == 1900 || $scope.registro.fechaPublicacion.getFullYear() == 1899) {
                        $scope.inicioAux = $scope.registro.fechaPublicacion;
                        $scope.registro.fechaPublicacion = null;
                    }
                }
                var array = $scope.registro.paginas.split('-');
                $scope.registro.paginasde = array[0];
                $scope.registro.paginashasta = array[1];
                if ($scope.registro.adjunto == null) {
                    $scope.regFile = true;
                } else {
                    $scope.regFile = false;
                    $scope.archivos = 1;
                }
            },
            function (error) {
                toastr.error(error);
            });


        $scope.registraAcceso = function () {

           

            var datos = {
                "claveEmpleado": $scope.ClavePersonaLogin,
                "fecha": new Date(),
                "modulo": "MT",
                "ocID"  : "ART"
            }

            IndicadoresMTService.AddAccesoModulosOC(datos).then(
                function (result) {
                    //$scope.soliResult = result.data;
                },
                function (error) {
                    toastr.error(error);
                });
        }

        $scope.registraAcceso();


    }
})();