(function () {
    "use strict";

    angular
    .module("ineelMT")
    .controller("SoftwarePersonalGetCtrl", [
        "AuthService", "$rootScope",
        "$scope", 
         "globalGet", '$uibModal',
        "DTOptionsBuilder", "DTColumnBuilder", "$compile",
        "softwarePersonalService", '$filter', 'authInterceptorService', 'localStorageService', "DTColumnDefBuilder",

        SoftwarePersonalGetCtrl
    ])                

    function SoftwarePersonalGetCtrl(AuthService,$rootScope, $scope, 
         globalGet,  $uibModal,
        DTOptionsBuilder, DTColumnBuilder, $compile,
        softwarePersonalService, $filter, authInterceptorService, localStorageService, DTColumnDefBuilder) {
        $scope.re = [];
        var tabla = this;
        $scope.visible = true;
        tabla.dtInstance = {};                   
        tabla.registros = [];
        $scope.empleado = {};

        $scope.proyecto = {};
        $scope.proyecto.selected = undefined;
        $scope.elementosSelectProyecto = [];
      
        $scope.limpia = false;
        $scope.botonBusqueda = false;

        var API = globalGet.get("api");
        
        $scope.listaTipoSoftware = [];

        $scope.sw = {};


        tabla.dtOptions = [];

        $scope.default = function () {
            $scope.sw = {
                "ClaveUnidad": "",
                "proyectoId": "",
                "nombre": "",
                "numeroVersion": "",
                "anioVersion": "",
                "descripcionFuncional": "",
                "plataformaDesarrollo": "",
                "tipoSoftwareId": "",  
                "derechoAutor": "",
                "comentarios": ""
             };
        }
        $scope.default();


        $rootScope.parametros = {};
        $scope.nombreMiga = function () {
            $rootScope.parametros.nombreM = "Mi software";
        }

        var authData = localStorageService.get('authorizationData');
        var userId = "";
        try {
            userId = authData.userprofile.clavePersona
        } catch (e) { }
        var headers = authInterceptorService.requestServerSide();


        softwarePersonalService.TipoSoftwareGetAllOrder().then(
           function (result) {
               $scope.listaTipoSoftware = result.data;
           },
           function (err) {
               $scope.listaTipoSoftware = [];
               $rootScope.globalError(err);
       });



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
                $scope.empleado = selectedItem;
            });
        }


        $scope.openProyecto = function () {
           
            $scope.proyectoSelect = {};
            var modalInstance = $uibModal.open({
                size: 'lg',
                 templateUrl: 'app/vistasGenericas/buscarProyecto.html',
                controller: 'ProyectosFilterSubprogramaCtrl as showCase',
                resolve: {
                    proyectoSelect: function () {
                       
                        return $scope.proyectoSelect;
                    }
                },
                scope: $scope
            });
            modalInstance.result.then(function (selectedItem) {
           
                $scope.proyecto.selected = selectedItem;
            });
          
        }


      
        $scope.paramsDT = JSON.parse(localStorage.getItem('SoftwareMTA1b' + window.location.pathname)); //Recuperamos los parametros de filtrado en el DT
        if ($scope.paramsDT == null) {
            $scope.paramsDT = {};  //Puede que sean nulos, en dado caso se mostrara la pagina 1
            $scope.paramsDT.displayStart = 0;
        }
        
        tabla.dtColumns = [
          DTColumnBuilder.newColumn(null).withTitle('T&iacute;tulo del software').renderWith(detalles).withOption('responsivePriority', '1').withOption('defaultContent', '').withClass("thMaxW300 sin-desborde"),
          DTColumnBuilder.newColumn(null).withTitle("Tipo").renderWith(actionsHtmlTipoSw).withOption('responsivePriority', '2').withOption('defaultContent', ''),
          //DTColumnBuilder.newColumn(null).withTitle("Autor(es)").renderWith(actionsHtmlAutores).withOption('responsivePriority', '2').withOption('defaultContent', '').notSortable(),
          DTColumnBuilder.newColumn(null).withTitle("Autor(es)").renderWith(detallesPersonas).withOption('responsivePriority', '1').withOption('defaultContent', '').withClass("thMaxW300 sin-desborde"),
          //DTColumnBuilder.newColumn('proyecto.nombre', 'Proyecto').withOption('defaultContent', '--'),
          DTColumnBuilder.newColumn(null).withTitle('Proyecto').renderWith(detallesProyectos).withOption('responsivePriority', '1').withOption('defaultContent', '').withClass("thMaxW300 sin-desborde"),
            DTColumnBuilder.newColumn('nombreUnidadOrganizacional', 'Unidad organizacional').withOption('defaultContent', '--').notSortable(),
          DTColumnBuilder.newColumn(null).withTitle('Derecho autor').renderWith(detallesDA).withOption('defaultContent', '--').withClass("thMaxW300 sin-desborde")
     
        ];
            
        
        $scope.loadTable = function () {
            
            tabla.dtOptions = [];

            var proyectoId = "";
            var autorId = "";
            var UnidadId = "";

            if ($scope.claveUnidad != null)
                UnidadId = $scope.claveUnidad.claveUnidad;

            if ($scope.proyecto.selected != null)
                proyectoId = $scope.proyecto.selected.proyectoId;

            if ($scope.empleado != null)
                autorId = $scope.empleado.clavePersona;


            tabla.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
                dataSrc: function (d) {
                    console.log(d);
                    return d.data;
                },
                headers: headers,
                //IMPORTANTE atributos de entidad en el mismo orden en que se muestran para saber por que columna se quiere ORDENAR los datos
                data: {
                    "nameColumns": "nombre;tipoSoftwareId;nombre;proyecto.nombre;proyecto.unidadOrganizacional.nombreUnidad;derechoAutor",
                    "proyectoId": proyectoId,
                    "Tipo": $scope.sw.tipoSoftwareId,
                    "ClaveUnidad": UnidadId,
                    "DerechosAutorId": $scope.sw.derechosAutorId,
                    "Titulo": $scope.sw.nombre,
                    "Autor": autorId

                    //"ClaveUnidad": $scope.Palabra.claveUnidad,
                },
                url: API + "SoftwarePersonal/getData",
                type: "POST",
                error: function (err) {
                    try {
                        //$scope.errorGetData = true;
                        if (err.status == 401) {
                            toastr.error(err.statusText);
                            AuthService.logOut();
                        }                                                
                    } catch (e) { }
                }
            }).withOption('processing', true) //for show progress bar
            .withOption('serverSide', true) // for server side processing
            .withPaginationType('full_numbers') // for get full pagination options // first / last / prev / next and page numbers        
            .withDisplayLength(5) // Page size
            .withOption('aLengthMenu', [[5, 10, 20, 50], [5, 10, 20, 50]])
            .withOption('aaSorting', [0, 'desc']) // for default sorting column // here 0 means first column
            //.withOption('dom', '<"wrapper"ltip>')
            .withOption('language', { sSearch: "Filtrar:" })
            .withOption('createdRow', createdRow)//IMPORTANTE para ng-click
            .withOption('stateSaveCallback', stateSaveCallback)
            .withOption('stateLoadCallback', stateLoadCallback)
            .withOption('displayStart', $scope.paramsDT.displayStart);
        }
       

        function createdRow(row, data, dataIndex) { //IMPORTANTE para ng-click
            // Recompiling so we can bind Angular directive to the DT
            $compile(angular.element(row).contents())($scope);
        }
        function actionsHtmlTipoSw(data, type, full, meta) {
            return '<td>' + data.tipoSoftware.nombre + '</td>';

        }
        function actionsHtmlAutores(data, type, full, meta) {
            return '<td>' + $filter('getAutoresPersonas')(data.autores) + '</td>';
        }
        function actionsHtmlOpc(data, type, full, meta) {
            return '<td>' +
                '<a class="btn btn-default" ui-sref="SoftwarePersonalDetails({ id: ' + data.softwarePersonalId + '})" title="Detalles"><i class="glyphicon glyphicon-align-justify"></i></a>' +
                '</td>';
        }
        function detalles(data, type, full, meta) {
            return '<td>' +
                '<a class="linkTabla" ui-sref="SoftwarePersonalDetails({ id: ' + data.softwarePersonalId + '})" title="Detalles">' + data.nombre + '</a>' +
                '</td>';
        }
        function stateSaveCallback(settings, data) {
            var stado = $('#SoftwareMTA1b').DataTable().state();
            localStorage.setItem('SoftwareMTA1b' + window.location.pathname, JSON.stringify(stado))
        }
        function detallesProyectos(data, type, full, meta) {


            if (data.proyecto != null) {
                return '<td>' +
                '<a class="linkTabla" href="" load-proyectos idproyecto="' + data.proyecto.proyectoId + '" title="Detalle de proyecto">'
                    + data.proyecto.proyectoId + '</a>' + '-' + data.proyecto.nombre
                '</td>'
            } else {
                return 'Dato no disponible'
            }


        }
        function detallesPersonas(data, type, full, meta) {

            var listaAutores = "";

            if (data.autores != null || data.autores.length > 0) {


                for (var i = 0; i < data.autores.length; i++) {

                    if (data.autores.length > 0)
                       listaAutores = listaAutores + '<a class="linkTabla" ng-click="openProfile(' + data.autores[i].claveAutor + ')" title="Detalle de empleado">' + data.autores[i].claveAutor + '</a>' + '-' + data.autores[i].nombreCompleto + '<br/>';
                    
                }


                return '<td>' + listaAutores + '</td>'

            

            } else {
                return 'Dato no disponible'
            }
        }
        
        function detallesDA(data, type, full, meta) {
            
            if (data.derechosAutor != null ) {
                return data.derechosAutor.titulo;
            } 
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
                return JSON.parse(localStorage.getItem('SoftwareMTA1b' + window.location.pathname))
            }
        }


        $scope.dtColumnDefs = [
           DTColumnDefBuilder.newColumnDef([0, 1, 2,3]).withOption('type', 'string')
        ];
        
        $scope.limpiar = function () {
            $scope.sw.tipoSoftwareId = "";
            $scope.sw.nombre = "";
            $scope.sw.derechosAutorId = null;
            $scope.derechosAutor = null;
            $scope.claveUnidad = {};
            $scope.proyecto.selected = {};
            $scope.empleado = {};
            $scope.limpia = true;
            $scope.botonBusqueda = false;
        }
       

       

        $scope.buscar = function () {
            
            if($scope.derechosAutor!=null){
                $scope.sw.derechosAutorId= $scope.derechosAutor.derechosAutorId;
            }
            
               $rootScope.parametrosSOFTAA1MT = {};
                $rootScope.parametrosSOFTAA1MT = {

                    titulo: $scope.sw.nombre,
                    derecho: $scope.sw.derechosAutorId,
                    autor: $scope.empleado,
                    unidad: $scope.claveUnidad,
                    proyecto: $scope.proyecto.selected,
                    tipo: $scope.sw.tipoSoftwareId

                };

                $scope.loadTable();
                $scope.botonBusqueda = true;
          
        }



        if ($rootScope.parametrosSOFTAA1MT == 'undefined' || $rootScope.parametrosSOFTAA1MT == null || $rootScope.parametrosSOFTAA1MT == undefined || $rootScope.parametrosSOFTAA1MT == "undefined") {
            $scope.botonBusqueda = false;
        } else {

            $scope.datosBusqueda = $rootScope.parametrosSOFTAA1MT;


            $scope.sw.nombre = $scope.datosBusqueda.titulo;
            $scope.sw.derechoAutor = $scope.datosBusqueda.derecho;
            $scope.empleado = $scope.datosBusqueda.autor;
            $scope.sw.tipoSoftwareId = $scope.datosBusqueda.tipo;
            $scope.claveUnidad = $scope.datosBusqueda.unidad;
            $scope.proyecto.selected = $scope.datosBusqueda.proyecto;

            $scope.buscar();

        }



     

    }
})();