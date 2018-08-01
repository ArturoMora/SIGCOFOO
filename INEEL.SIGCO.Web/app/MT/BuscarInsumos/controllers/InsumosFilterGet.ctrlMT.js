
(function () {
    "use strict";
    angular
        .module("ineelMT")
        .controller("InsumosFilterGetCtrl", [
        "AuthService",
        "$scope",
        "$state",
        "$stateParams",
        "buscarInsumosService", "globalGet", "$http", '$uibModal',
        "DTOptionsBuilder", "DTColumnBuilder", "$compile", "authInterceptorService", "$rootScope", InsumosFilterGetCtrl]);

    function InsumosFilterGetCtrl(AuthService, $scope, $state, $stateParams,
        buscarInsumosService, globalGet, $http,$uibModal,
        DTOptionsBuilder, DTColumnBuilder, $compile, authInterceptorService, $rootScope) {

        jQuery.fn.DataTable.ext.type.search.string = function (data) { return !data ? '' : typeof data === 'string' ? data.replace(/έ/g, 'ε').replace(/ύ/g, 'υ').replace(/ό/g, 'ο').replace(/ώ/g, 'ω').replace(/ά/g, 'α').replace(/ί/g, 'ι').replace(/ή/g, 'η').replace(/\n/g, ' ').replace(/[áÁ]/g, 'a').replace(/[éÉ]/g, 'e').replace(/[íÍ]/g, 'i').replace(/[óÓ]/g, 'o').replace(/[úÚ]/g, 'u').replace(/ê/g, 'e').replace(/î/g, 'i').replace(/ô/g, 'o').replace(/è/g, 'e').replace(/ï/g, 'i').replace(/ü/g, 'u').replace(/ã/g, 'a').replace(/õ/g, 'o').replace(/ç/g, 'c').replace(/ì/g, 'i') : data; };


        $scope.authentication = AuthService.authentication;
        var headers = authInterceptorService.requestServerSide();

        var API = globalGet.get("api");
        var endPointProyectos = API + "Proyectos/GetProyectos/";

        $scope.tipoInsumoId = "";
        $scope.claveUnidad = {};
        $scope.jefeProyecto = {};

        $scope.limpia = false;
        $scope.botonBusqueda = false;
       
         $scope.proyecto = {};
        
        var tabla = this;
        tabla.dtInstance = {};
        tabla.registros = [];
        tabla.dtOptions = [];
       
        var API = globalGet.get("api");
        $(document).ready(function () {
            $("form").keypress(function (e) {
                if (e.which == 13) {
                    return false;
                }
            });
        });

     

        //Buscar Jefe
        $scope.openJefe = function () {
            
            $scope.empleado = {};
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/PersonasFilterGet.html',
                controller: 'PersonasFilterGetCtrl',
                resolve: {
                    empleado: function () {
                        $scope.verpersona = false;
                        return $scope.empleado;
                    }
                },
                scope: $scope,
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.jefeProyecto = selectedItem;
                
            });
           
        }


        $scope.obtenInsumos = function () {
            buscarInsumosService.getTipoInsumo().then(
                function (result) {
                    $scope.TipoInsumo = result.data;//aqui
                },
                function (err) {
                    console.error(err);
                });
        }
        $scope.obtenInsumos();

     
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
        
                $scope.proyecto = selectedItem;
                $scope.proyectoNombre = selectedItem.nombre;
                $scope.proyectoId = selectedItem.proyectoId;
            });
          


        }



        $scope.paramsDT = JSON.parse(localStorage.getItem('MTBuscarInsumosAI' + window.location.pathname)); //Recuperamos los parametrosInsumosMT de filtrado en el DT
        if ($scope.paramsDT == null) {
            $scope.paramsDT = {};  //Puede que sean nulos, en dado caso se mostrara la pagina 1
            $scope.paramsDT.displayStart = 0;
        }

        tabla.dtColumns = [
            DTColumnBuilder.newColumn(null).withTitle('Insumo').renderWith(actionsHtmlOpc).withClass('columnaTitulo').withOption('defaultContent', '').withClass("thMaxW300 sin-desborde"),
            DTColumnBuilder.newColumn("tipoInsumo.descripcionInsumo", "Tipo").withOption('defaultContent', ''),
             DTColumnBuilder.newColumn(null).withTitle('Proyecto').renderWith(detallesProyectos).withOption('responsivePriority', '1').withOption('defaultContent', '').withClass("thMaxW300 sin-desborde"),
            // DTColumnBuilder.newColumn(null).withTitle('Proyecto').renderWith(actionsHtmlProy).withOption('defaultContent', '--'),
             DTColumnBuilder.newColumn(null).withTitle('Jefe de proyecto').renderWith(detallesPersonas).withOption('responsivePriority', '1').withOption('defaultContent', '').withClass("thMaxW300 sin-desborde"),
           // DTColumnBuilder.newColumn("informeTecnicoFinal.proyecto.nombreJefeProyecto", "Jefe de proyecto").withOption('responsivePriority', '2').withOption('defaultContent', ''),
            DTColumnBuilder.newColumn("responsableIns", "Responsable").withOption('defaultContent', '').withClass("thMaxW300 sin-desborde"),
            DTColumnBuilder.newColumn("ubicacionResIns", "Ubicaci&oacute;n").withOption('defaultContent', '').withClass("thMaxW300 sin-desborde"),
          
        ];
        
        $scope.loadTable = function () {
               
           

           
            tabla.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
                dataSrc: function (d) {
                                    
                    return d.data;
                },
                headers: headers,
                //IMPORTANTE atributos de entidad en el mismo orden en que se muestran para saber por que columna se quiere ORDENAR los datos
                data: {
                    "nameColumns": "tipoInsumo.descripcionInsumo;nombreIns;informeTecnicoFinal.proyecto.proyectoId;informeTecnicoFinal.proyecto.nombreJefeProyecto;responsableIns;ubicacionResIns;tipoAcceso.nombre",
                    "palabras": $scope.PalabraClave,
                    "proyectoId": $scope.proyecto.proyectoId,
                    "NumjefeProyecto": $scope.jefeProyecto.clavePersona,
                    //"Autor": $scope.Palabra.Clave,
                    //"Titulo": $scope.Palabra.Titulo,
                    //"FechaInicio": $filter('date')($scope.Palabra.FechaInicio, 'yyyy/MM/dd'),//$scope.Palabra.FechaInicio.toString(),
                    //"FechaFin": $filter('date')($scope.Palabra.FechaTermino, 'yyyy/MM/dd'),
                    "Tipo": $scope.tipoInsumoId,
                    "ClaveUnidad": $scope.claveUnidad.claveUnidad
                    
                    //"ClaveUnidad": $scope.Palabra.claveUnidad,
                },
                url: API + "Insumos/getData",
                type: "POST",
                error: function (err) {
                    try {
                        //$scope.errorGetData = true;
                       
                    } catch (e) { }
                }
            }).withOption('processing', true) //for show progress bar
            .withOption('serverSide', true) // for server side processing
            .withPaginationType('full_numbers') // for get full pagination options // first / last / prev / next and page numbers        
            .withDisplayLength(5) // Page size
            .withOption('aLengthMenu', [[5, 10, 20, 50], [5, 10, 20, 50]])
            .withOption('aaSorting', [0, 'desc']) // for default sorting column // here 0 means first column
            .withOption('language', { sSearch: "Filtrar:" })
            .withOption('createdRow', createdRow)//IMPORTANTE para ng-click
            .withOption('stateSaveCallback', stateSaveCallback)
            .withOption('stateLoadCallback', stateLoadCallback)
            .withOption('displayStart', $scope.paramsDT.displayStart);
        }





        function actionsHtmlProy(data, type, full, meta) {
            return '<td>' + data.informeTecnicoFinal.proyecto.proyectoId + " - " + data.informeTecnicoFinal.proyecto.nombre + '</td>';
        }

        function actionsHtmlNivel(data, type, full, meta) {
            var r = "Reservado";

            if (data.tipoAccesoIns == 'True') {
                r = "P&uacute;blico";
            }

            return '<td>' + r + '</td>';
        }

        function actionsHtmlOpc(data, type, full, meta) {
            return '<td>' + '<a ui-sref="BuscarInsumosDetails({id:\'' + data.insumosId + '\', id2:\'' + $scope.PalabraClave + '\'})" title="Detalles">' + data.nombreIns + '</a>' + '</td>';
        }
      
        function stateSaveCallback(settings, data) {
            var stado = $('#MTBuscarInsumosAI').DataTable().state();
            localStorage.setItem('MTBuscarInsumosAI' + window.location.pathname, JSON.stringify(stado))
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
                return JSON.parse(localStorage.getItem('MTBuscarInsumosAI' + window.location.pathname))
            }
        }

        function createdRow(row, data, dataIndex) { //IMPORTANTE para ng-click
            // Recompiling so we can bind Angular directive to the DT
            $compile(angular.element(row).contents())($scope);
        }

      
        function detallesProyectos(data, type, full, meta) {
            if (data.informeTecnicoFinal.proyecto.proyectoId != null) {
                return '<td>' +
                '<a class="linkTabla" href="" load-proyectos idproyecto="' + data.informeTecnicoFinal.proyecto.proyectoId + '" title="Detalle de proyecto">'
                    + data.informeTecnicoFinal.proyecto.proyectoId + '</a>' + '-' + data.informeTecnicoFinal.proyecto.nombre
                '</td>'
            } else {
                return 'Dato no disponible'
            }
        }
        function detallesPersonas(data, type, full, meta) {
            if (data.informeTecnicoFinal.proyecto.numjefeProyecto != null || data.informeTecnicoFinal.proyecto.nombreJefeProyecto != null) {
                return '<td>' +
                '<a class="linkTabla" ng-click="openProfile(' + data.informeTecnicoFinal.proyecto.numjefeProyecto.toString() + ')" title="Detalle de empleado">'
                    + data.informeTecnicoFinal.proyecto.numjefeProyecto + '</a>' + '-' + data.informeTecnicoFinal.proyecto.nombreJefeProyecto
                '</td>'
            } else {
                return 'Dato no disponible'
            }
        }
        

        $scope.limpiar = function () {

            debugger;
            tabla.dtOptions = [];
            
            $scope.proyecto = {};
            $scope.claveUnidad = {};
            $scope.jefeProyecto = {};
           
            $scope.tipoInsumoId = null;
            $scope.proyectoNombre = "";
            $scope.proyectoId = "";
          

           
            $scope.PalabraClave = "";

            $scope.botonBusqueda = false;
            $scope.limpia = true;
        }



        $scope.buscar = function () {
            debugger;
            $rootScope.parametrosInsumosMT = {};
            $rootScope.parametrosInsumosMT = {

                proyecto: $scope.proyecto,
                jefe: $scope.jefeProyecto,
                palabras: $scope.PalabraClave,
                tipo: $scope.tipoInsumoId,
                unidad: $scope.claveUnidad


            };

            tabla.dtOptions = [];
            $scope.loadTable();
            $scope.botonBusqueda = true;

        }


        if ($rootScope.parametrosInsumosMT == 'undefined' || $rootScope.parametrosInsumosMT == null || $rootScope.parametrosInsumosMT == undefined || $rootScope.parametrosInsumosMT == "undefined") {
            $scope.botonBusqueda = false;
        } else {


            $scope.datosBusqueda = $rootScope.parametrosInsumosMT;
           

            debugger;
            $scope.proyecto = $scope.datosBusqueda.proyecto;
            $scope.jefeProyecto = $scope.datosBusqueda.jefe;
            $scope.PalabraClave = $scope.datosBusqueda.palabras;
            $scope.tipoInsumoId = $scope.datosBusqueda.tipo;
            $scope.claveUnidad = $scope.datosBusqueda.unidad;

            if ($scope.proyecto != null) {
                $scope.proyectoNombre = $scope.proyecto.nombre;
                $scope.proyectoId = $scope.proyecto.proyectoId;
            }

            $scope.buscar();

        }


       

    }
})();