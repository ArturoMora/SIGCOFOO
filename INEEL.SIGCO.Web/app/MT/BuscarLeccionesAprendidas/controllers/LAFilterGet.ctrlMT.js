
(function () {
    "use strict";
    angular
        .module("ineelMT")
        .controller("LAFilterGetCtrl", [
        "AuthService",
        "$scope",
        "$state",
        "$stateParams",
        "buscarLAService", "globalGet", "$http", '$uibModal',
        "DTOptionsBuilder", "DTColumnBuilder", "$compile", "authInterceptorService", "$rootScope", LAFilterGetCtrl]);

    function LAFilterGetCtrl(AuthService, $scope, $state, $stateParams,
        buscarLAService, globalGet, $http,$uibModal,
        DTOptionsBuilder, DTColumnBuilder, $compile, authInterceptorService, $rootScope) {
        jQuery.fn.DataTable.ext.type.search.string = function (data) { return !data ? '' : typeof data === 'string' ? data.replace(/έ/g, 'ε').replace(/ύ/g, 'υ').replace(/ό/g, 'ο').replace(/ώ/g, 'ω').replace(/ά/g, 'α').replace(/ί/g, 'ι').replace(/ή/g, 'η').replace(/\n/g, ' ').replace(/[áÁ]/g, 'a').replace(/[éÉ]/g, 'e').replace(/[íÍ]/g, 'i').replace(/[óÓ]/g, 'o').replace(/[úÚ]/g, 'u').replace(/ê/g, 'e').replace(/î/g, 'i').replace(/ô/g, 'o').replace(/è/g, 'e').replace(/ï/g, 'i').replace(/ü/g, 'u').replace(/ã/g, 'a').replace(/õ/g, 'o').replace(/ç/g, 'c').replace(/ì/g, 'i') : data; };

        $scope.authentication = AuthService.authentication;
        var headers = authInterceptorService.requestServerSide();

        var API = globalGet.get("api");
        var endPointProyectos = API + "Proyectos/GetProyectos/";
        var endPointEmpresas = API + "Empresas/GetAllForSelect/15";
                                 

        var tabla = this;

        tabla.dtInstance = {};
        tabla.registros = [];
       

        
        $scope.limpia = false;
        $scope.botonBusqueda = false;


        
        
        $scope.Palabra = "";


        $scope.jefe = {};
    
        $scope.registros = [];
       

        $scope.proyecto = {};


        $scope.elementosSelect = [];
        $scope.elementosSelectProyecto = [];
        $scope.elementosSelectEmpresa = [];
    
        $scope.empresa = {};
        $scope.empresa.selected = undefined;
      

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
                $scope.proyecto = selectedItem;
                $scope.proyectoNombre = $scope.proyecto.nombre;
            });
        }

        //Buscar Jefe
        $scope.openJefe = function () {
            $scope.empleado = {};
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/PersonasFilterGet.html',
                controller: 'PersonasFilterGetCtrl',
                resolve: {
                    empleado: function () {
                      
                        return $scope.empleado;
                    }
                },
                scope: $scope,
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.jefe = selectedItem;
            });
        }

        $scope.refreshelementosSelectEmpresas = function (search) {
            ////alert("refreshelementosSelect");
            if (search != undefined && search.length > 1) {
                //var params = { vocabulario: search, sensor: false };

                var getDatos = endPointEmpresas;
                return $http.post(getDatos, { "numero": 15, "cadena": search }).then(function (response) {
                  
                    $scope.elementosSelectEmpresa = response.data;
                    if ($scope.elementosSelectEmpresa == null || $scope.elementosSelectEmpresa.length == 0) {
                        $scope.elementosSelectEmpresa = [];
                        $scope.elementosSelectEmpresa.push({ "proyectoId": "Sin resultados con este criterio", "nombre": "" });
                    }
                },
                function (error) {
                    console.log('ERROR!!!');
                    console.log(error);
                }
                );
            } else {
                $scope.elementosSelectEmpresa = [];
            }
        };

        


        $scope.paramsDT = JSON.parse(localStorage.getItem('MTBuscarLAA1' + window.location.pathname)); //Recuperamos los parametros de filtrado en el DT
        if ($scope.paramsDT == null) {
            $scope.paramsDT = {};  //Puede que sean nulos, en dado caso se mostrara la pagina 1
            $scope.paramsDT.displayStart = 0;
        }


        tabla.dtColumns = [     
           DTColumnBuilder.newColumn(null).withTitle('Proyecto').renderWith(detalles).withOption('responsivePriority', '1').withOption('defaultContent', '').withClass("thMaxW300 sin-desborde"),
           DTColumnBuilder.newColumn("lAproy.clave", "Palabras clave").withClass("thMaxW300 sin-desborde"),
          // DTColumnBuilder.newColumn("proyecto.empresa.nombreEmpresa", "Empresa").withOption('defaultContent', ''),
           DTColumnBuilder.newColumn(null).withTitle('Cliente').renderWith(actionsHtmlEmpre).withClass('thAjuste text-center'),
           DTColumnBuilder.newColumn(null).withTitle('Jefe de proyecto').renderWith(detallesPersonas).withOption('responsivePriority', '1').withOption('defaultContent', '').withClass("thMaxW300 sin-desborde"),
        ];

       
        $scope.loadTable = function () {
           
            //var proyectoId = null;
            //var jefePRoy = null;

            tabla.dtOptions = [];

            var empresaId = ""
            var claveUnidad = "";

            //try {
            //    proyectoId = $scope.proyecto.selected.proyectoId;
            //} catch (e) { }
            //try {
            //    jefePRoy = $scope.jefe.clavePersona;
            //} catch (e) { }
            //try{
            //    empresaId = $scope.empresa.selected.clave;
            //} catch (e) { }
            //try{
            //    claveUnidad = $scope.claveUnidad.claveUnidad;
            //}catch(e){}
           

            if ($scope.claveUnidad != null)
                claveUnidad = $scope.claveUnidad.claveUnidad;

            if ($scope.empresa.selected != null)
                empresaId = $scope.empresa.selected.clave;

           

            tabla.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
                dataSrc: function (d) {
                                       
                    return d.data;
                },
                headers: headers,
                //IMPORTANTE atributos de entidad en el mismo orden en que se muestran para saber por que columna se quiere ORDENAR los datos
                data: {
                    "nameColumns": "proyecto.proyectoId;lAproy.clave;proyecto.empresa.nombreEmpresa;proyecto.empresa.nombreEmpresa;proyecto.nombreJefeProyecto",
                  
                    "proyectoId": $scope.proyecto.proyectoId,
                    "palabras": $scope.Palabra,
                    "NumjefeProyecto": $scope.jefe.clavePersona,
                    "EmpresaId": empresaId,
                    "ClaveUnidad": claveUnidad
                },
                url: API + "LAproy/getData/4",
                type: "POST",
                error: function (err) {
                    try {
                        //$scope.errorGetData = true;
                        console.log(err);
                        toastr.error(err.statusText);
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

        function actionsHtmlNivel(data, type, full, meta) {
            var r = "Reservado";
            if (data.tipoAccesoIns == 'True') {
                r = "P&uacute;blico";
            }
            return r;
        }

        function actionsHtmlOpc(data, type, full, meta) {
            return '<td>' +
            '<a class="btn btn-default" ui-sref="LeccionesAprendidasCapacidadDetails({id:\'' + data.informeTecnicoFinalId + '\', id2:\'' + $scope.Palabra + '\'})" title="Detalles"><i class="glyphicon glyphicon-align-justify"></i></a>' +
            '</td>';
        }

        function detalles(data, type, full, meta) {
            return '<td>' +
                '<a class="linkTabla" href="" load-proyectos idproyecto="' + data.proyecto.proyectoId + '" title="Detalle de proyecto">'
                    + data.proyecto.proyectoId + '</a>' + '-'+
            '<a class="linkTabla" ui-sref="LeccionesAprendidasCapacidadDetails({id:\'' + data.informeTecnicoFinalId + '\', id2:\'' + $scope.Palabra + '\'})" title="Detalles">'
            + data.proyecto.nombre + '</a>' +
            '</td>';
        }
        function detallesProyectos(data, type, full, meta) {
            if (data.proyecto.proyectoId != null) {
                return '<td>' +
                '<a class="linkTabla" href="" load-proyectos idproyecto="' + data.proyecto.proyectoId + '" title="Detalle de proyecto">'
                    + data.proyecto.proyectoId + '</a>' + '-' + data.proyecto.nombre
                '</td>'
            } else {
                return 'Dato no disponible'
            }
        }
        function detallesPersonas(data, type, full, meta) {
            if (data.proyecto.numjefeProyecto != null || data.proyecto.nombreJefeProyecto != null) {
                return '<td>' +
                '<a class="linkTabla" ng-click="openProfile(' + data.proyecto.numjefeProyecto.toString() + ')" title="Detalle de empleado">'
                    + data.proyecto.numjefeProyecto + '</a>' + '-' + data.proyecto.nombreJefeProyecto
                '</td>'
            } else {
                return 'Dato no disponible'
            }
        }

        function actionsHtmlEmpre(data, type, full, meta) {
            var r = "";
           

            if (((data.proyecto != undefined) && (data.proyecto.empresa != undefined))) {
                r = data.proyecto.empresa.nombreEmpresa;
                if ((data.proyecto.unidadOrganizacionalEmpresas != undefined)) {
                    r = r + " / " + data.proyecto.unidadOrganizacionalEmpresas.nombreUnidad;
                }

            }
            return '<td>' + r + '</td>';
        }

        function createdRow(row, data, dataIndex) { //IMPORTANTE para ng-click
            // Recompiling so we can bind Angular directive to the DT
            $compile(angular.element(row).contents())($scope);
        }

        function stateSaveCallback(settings, data) {
            var stado = $('#MTBuscarLAA1').DataTable().state();
            localStorage.setItem('MTBuscarLAA1' + window.location.pathname, JSON.stringify(stado))
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
                return JSON.parse(localStorage.getItem('MTBuscarLAA1' + window.location.pathname))
            }
        }

        //$scope.loadTable();




      





        $scope.limpiar = function () {
          
            $scope.Palabra = '';
            $scope.jefe = {};
            $scope.proyecto = {};
            $scope.empresa = {};
            $scope.claveUnidad = {};
            $scope.proyectoNombre = "";
          
            $scope.limpia = true;
            $scope.botonBusqueda = false;

            $scope.paramsDT.displayStart = 0;
           
        }

        $scope.buscar = function () {

           

            $rootScope.parametrosLAA1MT = {};
            $rootScope.parametrosLAA1MT = {

                proyecto : $scope.proyecto,
                jefe     : $scope.jefe,
                palabras : $scope.Palabra,
                cliente  : $scope.empresa.selected,
                unidad   : $scope.claveUnidad

            };

            $scope.loadTable();
            $scope.botonBusqueda = true;
        }
     

        if ($rootScope.parametrosLAA1MT == 'undefined' || $rootScope.parametrosLAA1MT == null || $rootScope.parametrosLAA1MT == undefined || $rootScope.parametrosLAA1MT == "undefined") {
            $scope.botonBusqueda = false;
        } else {

            $scope.datosBusqueda = $rootScope.parametrosLAA1MT;


            $scope.proyecto = $scope.datosBusqueda.proyecto;
            $scope.jefe = $scope.datosBusqueda.jefe;
            $scope.Palabra = $scope.datosBusqueda.palabras;
            $scope.empresa.selected = $scope.datosBusqueda.cliente;
            $scope.claveUnidad = $scope.datosBusqueda.unidad;
            $scope.proyectoNombre = $scope.datosBusqueda.proyecto.nombre;

            $scope.buscar();

        }

   
        if ($scope.botonBusqueda == false) {
            tabla.dtOptions = [];
        }


    }
})();