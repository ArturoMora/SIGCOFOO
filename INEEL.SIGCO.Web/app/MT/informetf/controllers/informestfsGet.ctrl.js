(function () {
    "use strict";
    angular
        .module("ineelMT")
        .controller("informestfsGetCtrl", [
            "$scope",
            "$rootScope",
            "$http",
            "$state",
            "$stateParams",
            "itfsService",
            "DTOptionsBuilder",
            "DTColumnBuilder",
            "$compile",
            "$uibModal",
            "globalGet",
            "$location",
            "AuthService",
            "$filter",
            "authInterceptorService",
            informestfsGetCtrl
        ])

    function informestfsGetCtrl($scope, $rootScope,
                    $http,
                    $state, $stateParams, itfsService,
                    DTOptionsBuilder,
                    DTColumnBuilder,
                    $compile,
                    $uibModal,
                    globalGet,
                    $location,
                    AuthService,
                    $filter,
                    authInterceptorService) {

      
        jQuery.fn.DataTable.ext.type.search.string = function (data) { return !data ? '' : typeof data === 'string' ? data.replace(/έ/g, 'ε').replace(/ύ/g, 'υ').replace(/ό/g, 'ο').replace(/ώ/g, 'ω').replace(/ά/g, 'α').replace(/ί/g, 'ι').replace(/ή/g, 'η').replace(/\n/g, ' ').replace(/[áÁ]/g, 'a').replace(/[éÉ]/g, 'e').replace(/[íÍ]/g, 'i').replace(/[óÓ]/g, 'o').replace(/[úÚ]/g, 'u').replace(/ê/g, 'e').replace(/î/g, 'i').replace(/ô/g, 'o').replace(/è/g, 'e').replace(/ï/g, 'i').replace(/ü/g, 'u').replace(/ã/g, 'a').replace(/õ/g, 'o').replace(/ç/g, 'c').replace(/ì/g, 'i') : data; };

        $scope.visible = true;
        toastr.clear();
        $scope.inicial = true;
        $scope.generaFolio= false;
        $scope.opcionesdeBusqueda = true;
        $rootScope.detallesItf = true;
        $scope.dataFull = 0;
        $scope.dataFull2 = 0;
        var headers = authInterceptorService.requestServerSide();
        $scope.persona = AuthService.authentication;


       
        $scope.loading = true;
        $scope.informeTFs = [];
        $scope.registro = {};
        var API = globalGet.get("api");
        $scope.urlDescarga = API + "InformeTecnicoFinal/GetFile";
        var endPoint = API + "Vocabulario/GetAllLike/"
        var endPointITFS = API + "TransferenciaRIIE/GetAllOCsSIGCO2/"
        var endPointProyectos = API + "Proyectos/GetProyectos/";
        var endPointUnidad = API + "UnidadOrganizacional/GetUnidadesSelectByNameLyke/";
        $scope.search = { palabras: "", noPalabras: "" };
        $scope.palabra = "";
        $scope.proyectoId = "";
        $scope.unidadId = "";
        $scope.unidad = {};
        $scope.autor = {};
        $scope.subprogramasProyecto = "61,63,65,67,68,71";  //Subprogramas por los cuales filtrar los resultados del modal de proyectos, si se elimina esta variable entonces el modal no aplica ningun filtro
        
        var tabla = this;
        tabla.dtInstance = {};
        tabla.registros = {};
        tabla.message = '';
        
        tabla.elementosSelect = [];
        tabla.elementosSelectProyecto = [];
        tabla.elementosSelectUnidad = [];
        tabla.vocabulario = {};
        tabla.vocabulario.selected = undefined;
        tabla.proyecto = {};
        tabla.proyecto.selected = undefined;
        tabla.unidad = {};
        tabla.unidad.selected = undefined;

        $scope.limpia = false;
        $scope.BotonBusqueda = false;



        $scope.generarFolio= function(){
            debugger;
            $scope.tableParams = $('#ITFBusquedaA1MT').DataTable().page.info();

            var Mail = {
                "Modulo": "Memoria Tecnológica",
                "Empleado": $scope.persona.nombreCompleto,
                "Seccion": "informes técnicos finales",  //Operaciones que se haran por esa seccion
                "TipoCorreo": "FoliosBusquedas",  //Plantilla del correo
                "ClavePersona": $scope.persona.userprofile.clavePersona,
                "Descripcion1": "<b>"+$scope.tableParams.recordsTotal+" registros</b>",
                "Descripcion2": "<b>Registros consultados :</b> "+ $scope.tableParams.recordsDisplay,
                "Parametros": "Título;Resumen;Año de elaboración;Proyecto;Unidad Organizacional;Autor / participante",
                "url": window.location.pathname,
                "ValoresParametros": $scope.search.titulo+";"
                                    +$scope.search.resumen+";"
                                    +$scope.search.anno+";"
                                    +$scope.registro.proyectoNombre+";"
                                    +$scope.unidad.nombreUnidad+";"
                                    +$scope.autor.nombreCompleto

            };

            itfsService.sendCorreo(Mail);
            toastr.success("Se ha enviado información a su correo", "Evidencia generada");
            $scope.generaFolio=false;
        }

        $scope.paramsDT = JSON.parse(localStorage.getItem('ITFBusquedaA1MT' + window.location.pathname)); //Recuperamos los parametrosArticulos de filtrado en el DT
        if ($scope.paramsDT == null) {
            $scope.paramsDT = {};  //Puede que sean nulos, en dado caso se mostrara la pagina 1
            $scope.paramsDT.displayStart = 0;
        }

        tabla.dtColumns = [            
             DTColumnBuilder.newColumn(null).withTitle('Proyecto').renderWith(detallesProyectos).withOption('responsivePriority', '1').withOption('defaultContent', '').withClass("thMaxW300 sin-desborde"),

            DTColumnBuilder.newColumn(null).withTitle('T&iacute;tulo').renderWith(detalles).withOption('responsivePriority', '1').withOption('defaultContent', '').withClass("thMaxW300 sin-desborde"),
            
            DTColumnBuilder.newColumn(null).withTitle("Resumen").renderWith(actionsHtmlTruncateResumen).withOption('defaultContent', '').withClass("thMaxW300 sin-desborde"),
            DTColumnBuilder.newColumn(null).withTitle('Jefe de proyecto').renderWith(detallesPersonas).withOption('responsivePriority', '1').withOption('defaultContent', '').withClass("thMaxW300 sin-desborde"),
        ];
        $scope.resetForm = function () {
            $scope.search = { palabras: "", noPalabras: "" };
        }
        //toastr.success("Sólo se muestran los I.T.F. publicados");
        $scope.loadTable = function () {            
            //alert("loadTable");
            //obtener registros
            
            $scope.inicial = false;
            $scope.EstadoFlujoId = 4;


            
        tabla.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
            dataSrc: function (d) {
                //console.log("datasrc");
                //$scope.$apply(function () {
                //    $scope.dataFull = d.data.length;
                //    //$scope.resetForm();                    
                //});
                
                return d.data;
            },

            
            headers:headers,
            //IMPORTANTE atributos de entidad en el mismo orden en que se muestran para saber por que columna se quiere ORDENAR los datos
            data: {
                "nameColumns": "proyectoId;titulo;itFgeneral.resumen;proyecto.nombreJefeProyecto",
                "palabras": $scope.search.palabras,
                "noPalabras": $scope.search.noPalabras,
                "porContenido": $scope.search.vocabulario,
                "proyectoId": $scope.registro.proyectoId,
                "resumen": $scope.search.resumen,
                "ClaveUnidad": $scope.unidadId,
                "EstadoFlujoId": $scope.EstadoFlujoId,
                "Autor": $scope.autor.clavePersona,
                "Titulo": $scope.search.titulo,
                "Anno": $scope.search.anno
            },
            url: API + "InformeTecnicoFinal/getData",
            type: "POST",
            error: function (err) {
                try {
                    //$scope.errorGetData = true;
                    debugger;
                    console.log(err);
                    toastr.error(err.statusText);                    
                } catch (e) { }
            }
        }).withOption('processing', true) //for show progress bar
        .withOption('serverSide', true) // for server side processing
        .withPaginationType('full_numbers') // for get full pagination options // first / last / prev / next and page numbers        
        .withDisplayLength(5) // Page size
        .withOption('aLengthMenu', [[5, 10, 20, 50], [5, 10, 20, 50]])
        .withOption('aaSorting', [1, 'asc']) // for default sorting column // here 0 means first column
        //.withOption('language', { sSearch: "Filtrar:" })
        .withOption('createdRow', createdRow)//IMPORTANTE para ng-click
        .withOption('stateSaveCallback', stateSaveCallback)
        .withOption('stateLoadCallback', stateLoadCallback)
        .withOption('displayStart', $scope.paramsDT.displayStart);
      
        }
        $scope.loading = false;
        
       // $scope.loadTable();
        $scope.inicial = true;
        function detalles(data, type, full, meta) {
            return '<td>' +
                        '<a class="linkTabla" ui-sref="ITFdetalles.infoGral({ id: \'' + data.informeTecnicoFinalId.toString() + '\',edit:false, foo:99  })" ng-click="paginaOrigen();" title="Detalles">'
                            + data.titulo + '</a>' +
            '</td>'
        }
        function detallesPersonas(data, type, full, meta) {
            if (data.proyecto.numjefeProyecto != null || data.proyecto.nombreJefeProyecto != null) {
                return '<td>' +
                '<a class="linkTabla" ng-click="openProfile(' + data.proyecto.numjefeProyecto.toString()+ ')" title="Detalle de empleado">'
                    + data.proyecto.numjefeProyecto + '</a>' + '-' + data.proyecto.nombreJefeProyecto
                '</td>'
            } else {
                return 'Dato no disponible'
            }
        }
        function detallesProyectos(data, type, full, meta) {
            if (data.proyecto.proyectoId != null ) {
                return '<td>' +
                '<a class="linkTabla" href="" load-proyectos idproyecto="'+data.proyecto.proyectoId+'" title="Detalle de proyecto">'
                    + data.proyecto.proyectoId + '</a>' + '-' + data.proyecto.nombre
                '</td>'
            } else {
                return 'Dato no disponible'
            }
        }
        function createdRow(row, data, dataIndex) { //IMPORTANTE para ng-click
            // Recompiling so we can bind Angular directive to the DT
            $compile(angular.element(row).contents())($scope);
        }      

        function actionsHtml(data, type, full, meta) {
         
            tabla.registros[data.informeTecnicoFinalId] = data;            
            return '<td>' +
                        '<a class="btn btn-default" ui-sref="ITFdetalles.infoGral({ id: \'' + data.informeTecnicoFinalId.toString() + '\',edit:false, foo:99  })" ng-click="paginaOrigen();" title="Detalles">'
                            + '<i class="glyphicon glyphicon-align-justify"></i>' +
                         '</a>'+
            '</td>'
        }
        function actionsHtmlTruncateResumen(data, type, full, meta) {
            try{
                var r = $filter('limitTo')(data.itFgeneral.resumen, 275);
                return '<td>' + r + '</td>';
            } catch (e) {
                return '<td></td>';
            }
            
        }


        function stateSaveCallback(settings, data) {
            var stado = $('#ITFBusquedaA1MT').DataTable().state();
            localStorage.setItem('ITFBusquedaA1MT' + window.location.pathname, JSON.stringify(stado))
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
                return JSON.parse(localStorage.getItem('ITFBusquedaA1MT' + window.location.pathname))
            }

        }

        // -------------------------- autocomplete vocabulario:
        tabla.disabled = undefined;
        tabla.searchEnabled = undefined;
        $scope.enable = function () {
            $scope.disabled = false;
        };

        $scope.disable = function () {
            $scope.disabled = true;
        };

        $scope.enableSearch = function () {
            $scope.searchEnabled = true;
        }

        $scope.enableSearch();


        tabla.enable = function () {
            tabla.disabled = false;
        };

        tabla.disable = function () {
            tabla.disabled = true;
        };


        $scope.pruebaITFS = function () {

            return $http.get(
                  endPointITFS
                ).then(function (response) {                    
                    // console.log(response);
                    // console.log("algo");
                }
                 );
        }

        
        tabla.refreshelementosSelect = function (search) {
            
            if (search != undefined && search.length > 1) {
               
                tabla.message = "";
                var getDatos = endPoint + search
                return $http.get(
                  getDatos
                ).then(function (response) {                    
                    // console.log(response);
                    tabla.elementosSelect = response.data;
                    if (tabla.elementosSelect == null || tabla.elementosSelect.length == 0) {
                        tabla.elementosSelect = [];
                        tabla.elementosSelect.push({"vocabularioId":"Sin resultados con este criterio"});
                    }
                },
                function () {

                    console.log('ERROR!!!');
                }
                );
            } else {
                tabla.elementosSelect = [];
                tabla.message = "Ingrese por lo menos dos caracteres y seleccione";
            }
        };
        
        tabla.refreshelementosSelectUnidad = function (search) {
           
            if (search != undefined && search.length > 1) {
               
                tabla.message = "";
                var getDatos = endPointUnidad + search
                return $http.get(
                  getDatos
                ).then(function (response) {
                    // console.log(response);
                    tabla.elementosSelectUnidad = response.data;
                    if (tabla.elementosSelectUnidad == null || tabla.elementosSelectUnidad.length == 0) {
                        tabla.elementosSelectUnidad = [];
                        tabla.elementosSelectUnidad.push({ "clave": "Sin resultados con este criterio", "unidad": "" });
                    }
                },
                function () {
                    console.log('ERROR!!!');
                }
                );
            } else {
                tabla.elementosSelectUnidad = [];
            }
        };
        $scope.onSelected = function (selectedItem) {          
            $scope.palabra = selectedItem;
        }
        
        $scope.onSelectedUnidad = function (selectedItem) {
           // $scope.porContenido();
            try {
               // $scope.limpiarAdjunto();
                $scope.unidadId = selectedItem.clave
            } catch (e) { }

            //$scope.loadTable();
            //$scope.porContenido();
        }
        $scope.mostrarTodo = function () {
            //alert("mostrar todo");

         

            $scope.limpia = true;
            $scope.BotonBusqueda = false;

            $scope.clean();
           
            $scope.unidad = {};
            $scope.search.palabras="";
            $scope.search.noPalabras = "";
            $scope.search.titulo = "";
            $scope.search.anno = "";
            $scope.search.vocabulario = "";
            $scope.search.resumen = "";
            $scope.palabra="";
            $scope.proyectoId = "";
            $scope.unidadId = "";
            $scope.limipiarSelects();
            $scope.autor = {};
            $scope.ProyectoSeleccionado = {};
            tabla.dtOptions = [];
            $scope.paramsDT.displayStart = 0;
            $scope.loadTable();
            $scope.generaFolio=false;
        }
        $scope.buscar = function () {
            //$scope.limipiarSelects();
            tabla.dtOptions = [];
            try {
                $scope.unidadId = $scope.unidad.claveUnidad;
                if ($scope.unidad.tipoO < 2 || $scope.unidad.tipoO > 3) {
                    toastr.warning("Debe seleccionar una unidad de tipo Gerencia o División");
                    return;
                }
            } catch (e) { };
            

            $rootScope.parametrosITFBUSQUEDAA1 = {

                unidad: $scope.unidad,
                proyecto: $scope.ProyectoSeleccionado,
                autor: $scope.autor,
                contenga: $scope.search.palabras,
                nocontenga: $scope.search.noPalabras,
                titulo : $scope.search.titulo, 
                annio: $scope.search.anno,
                vocabulario : $scope.search.vocabulario

            };

            $scope.loadTable();
            $scope.BotonBusqueda = true;
            $scope.generaFolio=true;
            
        }

        

        

        $scope.limipiarSelects = function () {            
            $scope.limpiarProyecto();
            $scope.limpiarUnidad();
            $scope.limpiarAdjunto();
           
        }
        $scope.limpiarUnidad = function () {
            try {
                tabla.unidad.selected = undefined;
            } catch (e) { }
            try {
                $scope.unidadId = "";
            } catch (e) { }
        }
        $scope.limpiarProyecto = function () {
            try {
                tabla.proyecto.selected = undefined;
            } catch (e) { }
            try {
                $scope.proyectoId = "";
            } catch (e) { }
        }
        $scope.limpiarAdjunto = function () {
            try {
                tabla.vocabulario.selected = undefined;
            } catch (e) { }
            try {
                $scope.palabra.vocabularioId = "";
            } catch (e) { }
        }

        $scope.porContenido = function () {
            //$scope.opcionesdeBusqueda = !$scope.opcionesdeBusqueda;
            $scope.search.palabras = "";
            $scope.search.noPalabras = "";
        }
        
        $scope.openAutor = function () {
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
                    $scope.autor = selectedItem;                              
            });
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
                $scope.registro.proyectoNombre = selectedItem.nombre;
                $scope.registro.proyectoId = selectedItem.proyectoId;
                $scope.ProyectoSeleccionado = selectedItem;
            });
            $scope.desabilitar = false;
        }    
        $scope.clean = function () {
            $scope.registro.proyectoNombre = null;
            $scope.registro.proyectoId = null;
        }


       
       
        if ($scope.BotonBusqueda == false) {
            tabla.dtOptions = [];
        }




        if ($rootScope.parametrosITFBUSQUEDAA1 == 'undefined' || $rootScope.parametrosITFBUSQUEDAA1 == null || $rootScope.parametrosITFBUSQUEDAA1 == undefined || $rootScope.parametrosITFBUSQUEDAA1 == "undefined") {
            $scope.botonBusqueda = false;
        } else {

            $scope.busquedaITF = $rootScope.parametrosITFBUSQUEDAA1;
            
            if ($scope.busquedaITF.proyecto != null) {
                $scope.registro.proyectoNombre = $scope.busquedaITF.proyecto.nombre;
                $scope.registro.proyectoId = $scope.busquedaITF.proyecto.proyectoId;
                $scope.ProyectoSeleccionado = $scope.busquedaITF.proyecto;
            }


            if ($scope.busquedaITF.autor != null) {
                $scope.autor = $scope.busquedaITF.autor;               
            }

            if ($scope.busquedaITF.unidad != null) {
                $scope.unidad = $scope.busquedaITF.unidad;
            }

            $scope.search.palabras = $scope.busquedaITF.contenga;
            $scope.search.noPalabras = $scope.busquedaITF.nocontenga;
            $scope.search.titulo = $scope.busquedaITF.titulo;
            $scope.search.anno = $scope.busquedaITF.annio;
            $scope.search.vocabulario = $scope.busquedaITF.vocabulario;

            $scope.botonBusqueda = true;

            $scope.buscar();

        }



      $scope.paginaOrigen = function(){
          
           $rootScope.origenITFPag = "ListaItf";

      }






    }
})();