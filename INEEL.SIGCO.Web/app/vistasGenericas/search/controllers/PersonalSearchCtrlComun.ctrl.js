(function () {
    "use strict";

    angular.module("ineel.controllers")
    .controller("PersonalSearchCtrlComun", ["$scope", "$rootScope", "$state", "$stateParams",
         "$http", "globalGet", "DTOptionsBuilder", "$compile", "authInterceptorService", "$filter", "$uibModal",
                 PersonalSearchCtrlComun]);

    function PersonalSearchCtrlComun($scope, $rootScope, $state, $stateParams,
    $http, globalGet, DTOptionsBuilder, $compile, authInterceptorService, $filter, $uibModal) {
        jQuery.fn.DataTable.ext.type.search.string = function (data) { return !data ? '' : typeof data === 'string' ? data.replace(/έ/g, 'ε').replace(/ύ/g, 'υ').replace(/ό/g, 'ο').replace(/ώ/g, 'ω').replace(/ά/g, 'α').replace(/ί/g, 'ι').replace(/ή/g, 'η').replace(/\n/g, ' ').replace(/[áÁ]/g, 'a').replace(/[éÉ]/g, 'e').replace(/[íÍ]/g, 'i').replace(/[óÓ]/g, 'o').replace(/[úÚ]/g, 'u').replace(/ê/g, 'e').replace(/î/g, 'i').replace(/ô/g, 'o').replace(/è/g, 'e').replace(/ï/g, 'i').replace(/ü/g, 'u').replace(/ã/g, 'a').replace(/õ/g, 'o').replace(/ç/g, 'c').replace(/ì/g, 'i') : data; };
        var date = new Date();
        var API = globalGet.get("api");
        var service = {};
        service.GetDataFirst = function (data) {
            var endPoint = API + "Personas/GetDataFirst";
            return $http.post(endPoint, data);
        }
        $scope.showResult = false;
        $scope.filtros = "todos";
        $scope.listaaptitudes = [];
        $scope.listaAptitudRanking = [];
        //$scope.dtOptionsApt = DTOptionsBuilder.newOptions().withOption('aaSorting', [2, 'desc']);
        
        //aptitudes por Julio
        $scope.loadaptitudes = function () {
            return $http.get(API + 'AptitudesCat/GetAll').then(function (response) {
                $scope.listaaptitudes = response.data;
            }, function (error) {
                $scope.listaaptitudes = [];
                toastr.warning("No fue posible cargar la lista", "Aptitudes");
            }
            );
        }; 
        $scope.loadFiltros = function () {
            $scope.showResult = false;
            if ($scope.filtros == 'aptitud') {
                $scope.loadaptitudes();
            }
            if ($scope.filtros == 'aptitudRanking') {
                $scope.loadaptitudes();
            }
        }
        //$scope.loadaptitudes();

        $scope.filtro = function ($query) {

            var aptitudesfiltradas = $scope.listaaptitudes.filter(function (aptitud) {
                return aptitud.nombre.toLowerCase().indexOf($query.toLowerCase()) != -1;
            });
            return aptitudesfiltradas;
        };


        // $scope.dtOptions = DTOptionsBuilder.newOptions()
        // .withOption('language', { sSearch: "Filtrar:" });
        //jQuery.fn.DataTable.ext.type.search.string = function acentos (data) { return !data ? '' : typeof data === 'string' ? data.replace(/έ/g, 'ε').replace(/ύ/g, 'υ').replace(/ό/g, 'ο').replace(/ώ/g, 'ω').replace(/ά/g, 'α').replace(/ί/g, 'ι').replace(/ή/g, 'η').replace(/\n/g, ' ').replace(/[áÁ]/g, 'a').replace(/[éÉ]/g, 'e').replace(/[íÍ]/g, 'i').replace(/[óÓ]/g, 'o').replace(/[úÚ]/g, 'u').replace(/ê/g, 'e').replace(/î/g, 'i').replace(/ô/g, 'o').replace(/è/g, 'e').replace(/ï/g, 'i').replace(/ü/g, 'u').replace(/ã/g, 'a').replace(/õ/g, 'o').replace(/ç/g, 'c').replace(/ì/g, 'i') : data; };
        $scope.registros = [];
        $scope.total = 0;
        function cargarTabla(aptitudes, busqueda) {
            //busqueda = $scope.search;
            var data = {
                "Aptitudes": aptitudes,
                "palabras": busqueda
            };
            service.GetDataFirst(data).then(
             function (result) {
                 $scope.registros = result.data.data;
                 $scope.total = result.data.recordsTotal;

             },
             function (error) { $scope.registros = []; }
         );


        }
        function getAptitudes(listaAptitudes) {
            var lista = "";
            var list = [];
            if (listaAptitudes != null && listaAptitudes.length > 0) {
                for (var i = 0; i < listaAptitudes.length; i++) {
                    list.push(listaAptitudes[i].id);
                }
                lista = list.join();
            }
            return lista;
        };
        //cargarTabla();

        $scope.buscar = function () {

            var table = $('#personasResult').DataTable();
            table
             .search('')
             .columns().search('')
             .draw();


            $scope.showResult = true;
            var busqueda = $scope.search;
            
            if ($scope.filtros == 'aptitudRanking') {
                $scope.listaAptitudRanking = [];
                var aptitudes = getAptitudes($scope.aptitudesempleado);
                return $http.get(API + 'Personas/GetDataByAptitudes/' + aptitudes).then(function (response) {
                    $scope.listaAptitudRanking = response.data;
                }, function (error) {
                    $scope.listaAptitudRanking = [];
                    toastr.warning("No fue posible cargar la lista de personas", "Aptitudes");
                }
                );
            } else {
                
                if ($scope.filtros == 'todos') {
                    cargarTabla("", busqueda);
                } else if ($scope.filtros == 'aptitud') {
                    var aptitudes = getAptitudes($scope.aptitudesempleado);
                    cargarTabla(aptitudes, "");
                } else {
                    var aptitudes = getAptitudes($scope.aptitudesempleado);
                    cargarTabla(aptitudes, busqueda);
                }
                
            }


        }
        $scope.openProfile = function (personaId) {
            $scope.personaIDSearch = personaId;
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: "app/vistasGenericas/_details/personal/PersonalComunProfile.html",
                controller: "PersonaProfileComunCtrl",
                resolve: {
                    datosUsuario: function () {
                    }
                },
                scope: $scope
            });

            //modalInstance.result.then(function (result) {
            //    $scope.persona.adjunto64 = result.adjunto64;
            //});

        }
    }
})();