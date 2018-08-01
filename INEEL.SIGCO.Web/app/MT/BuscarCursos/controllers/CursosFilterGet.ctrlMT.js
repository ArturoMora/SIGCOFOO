
(function () {
    "use strict";
    angular
        .module("ineelMT")
        .controller("CursosFilterGetCtrl", [
        "AuthService",
        "$scope",
        "$state",
        "$location",
        "$stateParams",
        "buscarCursosService", "globalGet", "$http",'$uibModal','$filter',
        "DTOptionsBuilder", "DTColumnBuilder", "$compile", "authInterceptorService", "$rootScope", "DTColumnDefBuilder", CursosFilterGetCtrl]);

    function CursosFilterGetCtrl(AuthService, $scope, $state,
        $location, $stateParams,
        buscarCursosService, globalGet, $http, $uibModal,$filter,
        DTOptionsBuilder, DTColumnBuilder, $compile, authInterceptorService, $rootScope, DTColumnDefBuilder) {


        jQuery.fn.DataTable.ext.type.search.string = function (data) { return !data ? '' : typeof data === 'string' ? data.replace(/έ/g, 'ε').replace(/ύ/g, 'υ').replace(/ό/g, 'ο').replace(/ώ/g, 'ω').replace(/ά/g, 'α').replace(/ί/g, 'ι').replace(/ή/g, 'η').replace(/\n/g, ' ').replace(/[áÁ]/g, 'a').replace(/[éÉ]/g, 'e').replace(/[íÍ]/g, 'i').replace(/[óÓ]/g, 'o').replace(/[úÚ]/g, 'u').replace(/ê/g, 'e').replace(/î/g, 'i').replace(/ô/g, 'o').replace(/è/g, 'e').replace(/ï/g, 'i').replace(/ü/g, 'u').replace(/ã/g, 'a').replace(/õ/g, 'o').replace(/ç/g, 'c').replace(/ì/g, 'i') : data; };


        var endPointProyectos = API + "Proyectos/GetProyectos/";
        var headers = authInterceptorService.requestServerSide();
        $scope.authentication = AuthService.authentication;
        $scope.Palabra = {};

        var tabla = this;

        tabla.dtInstance = {};
        tabla.registros = [];
        tabla.dtOptions = [];

        $scope.nueva = true;
        $scope.Palabras = '';
        $scope.FechaValida = false;

        $scope.proyecto = {};
        $scope.proyecto.selected = undefined;
        $scope.elementosSelectProyecto = [];

        $scope.elementosSelect = [];
     

        $scope.Palabra.proyecto = {};
        $scope.Palabra.proyecto.selected = undefined;


        $scope.botonBusqueda = true;

        $scope.fechaInicioSeleccionado = 0;
        $scope.fechaTerminoSeleccionado = 0;

        $scope.limpia = false;
        

        var API = globalGet.get("api");
        $(document).ready(function () {
            $("form").keypress(function (e) {
                if (e.which == 13) {
                    return false;
                }
            });
        });

        
        //Buscar Tipo de Cursos
        buscarCursosService.getTipoCurso().then(
             function (result) {
                 $scope.cursos = result.data;
             },
            function (err) {
                toastr.error("No se han podido cargar el catalogo de Tipos de Cursos.");
            }
        );

        //Buscar Autor
        $scope.openAutor = function () {
           
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
                $scope.Palabra.Autor = selectedItem.nombreCompleto;
                $scope.Palabra.Clave = selectedItem.clavePersona;
               
                if (selectedItem.nombreCompleto != undefined) {
                    $scope.AgregarPalabra(selectedItem.nombreCompleto);
                }
            });
           
        }

        ///Validar rango de fechas
        $scope.validarFechasInicio = function () {
            $scope.fechaActual = new Date();
            $scope.inicioDateComparacion = new Date($scope.Palabra.FechaInicio);
            $scope.finalDateComparacion  = new Date($scope.Palabra.FechaTermino);
            if ($scope.inicioDateComparacion > $scope.finalDateComparacion) {
                toastr.error("Fecha de inicio deber ser menor a fecha de término.");
                $scope.Palabra.FechaInicio = "dd/mm/yyyy";
                return false;
            }

            if ($scope.inicioDateComparacion < $scope.finalDateComparacion) {
                $scope.FechaValida = true;
            }

            $scope.fechaInicioSeleccionado = 1;
          
        }

        $scope.validarFechas = function () {
            $scope.fechaActual = new Date();
            $scope.inicioDateComparacion = new Date($scope.Palabra.FechaInicio);
            $scope.finalDateComparacion  = new Date($scope.Palabra.FechaTermino);
            if ($scope.inicioDateComparacion > $scope.finalDateComparacion) {
                toastr.error("Fecha de inicio deber ser menor a fecha de término.");
                $scope.Palabra.FechaTermino = "dd/mm/yyyy";
                return false;
            }
            if ($scope.inicioDateComparacion < $scope.finalDateComparacion) {
                $scope.FechaValida = true;
            }

            $scope.fechaTerminoSeleccionado = 1;
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
               
                $scope.proyectoNombre = selectedItem.nombre;
                $scope.proyectoId = selectedItem.proyectoId;
                $scope.Palabra.proyecto = selectedItem;
               
            });
            $scope.desabilitar = false;
        }

        $scope.AgregarPalabra = function (Palabra) {
            
            try {
                
                if (Palabra.Autor != "" && Palabra.Autor != undefined) {
                    if ($scope.Palabras != "") {
                        $scope.Palabras = $scope.Palabras + ", " + Palabra.Autor;
                    }
                    if ($scope.Palabras == "") {
                        $scope.Palabras = Palabra.Autor;
                    }
                }
                if (Palabra.Titulo != "" && Palabra.Titulo != undefined) {
                    if ($scope.Palabras != "") {
                        $scope.Palabras = $scope.Palabras + ", " + Palabra.Titulo;
                    }
                    if ($scope.Palabras == "") {
                        $scope.Palabras = Palabra.Titulo;
                    }
                }
                if (Palabra.FechaInicio != "" && Palabra.FechaInicio != undefined) {
                    if ($scope.Palabras != "") {
                        $scope.Palabras = $scope.Palabras + ", " + Palabra.FechaInicio.getDate() + '/' + (Palabra.FechaInicio.getMonth() + 1) + '/' + Palabra.FechaInicio.getFullYear();
                    }
                    if ($scope.Palabras == "") {
                        $scope.Palabras = Palabra.FechaInicio.getDate() + '/' + (Palabra.FechaInicio.getMonth() + 1) + '/' + Palabra.FechaInicio.getFullYear();
                    }
                }
                if (Palabra.FechaTermino != "" && Palabra.FechaTermino != undefined) {
                    if ($scope.Palabras != "") {
                        $scope.Palabras = $scope.Palabras + " - " + Palabra.FechaTermino.getDate() + '/' + (Palabra.FechaTermino.getMonth() + 1) + '/' + Palabra.FechaTermino.getFullYear();
                    }
                    if ($scope.Palabras == "") {
                        $scope.Palabras = Palabra.FechaTermino.getDate() + '/' + (Palabra.FechaTermino.getMonth() + 1) + '/' + Palabra.FechaTermino.getFullYear();
                    }
                }
                if (Palabra.TipoCurso != "" && Palabra.TipoCurso != undefined) {
                    if ($scope.Palabras != "") {
                        $scope.Palabras = $scope.Palabras + ", " + $scope.cursos[Palabra.TipoCurso - 1].descripcion;
                    }
                    if ($scope.Palabras == "") {
                        $scope.Palabras = $scope.cursos[Palabra.TipoCurso - 1].descripcion;
                    }
                }
                if ($scope.areaasignada != '') {
                    if ($scope.Palabras != "") {

                        if ($scope.areaasignada != null)
                            $scope.Palabras = $scope.Palabras + ", " + $scope.areaasignada.nombreUnidad;
                    }
                    if ($scope.Palabras == "") {

                        if ($scope.areaasignada != null)
                            $scope.Palabras = $scope.areaasignada.nombreUnidad;
                    }

                    if ($scope.areaasignada != null)
                           $scope.Palabra.claveUnidad = $scope.areaasignada.claveUnidad;
                   
                }
                if ($scope.proyectoNombre != "") {
                    if ($scope.Palabras != "") {
                        $scope.Palabras = $scope.Palabras + ", " + $scope.proyectoNombre;
                    }
                    if ($scope.Palabras == "") {
                        $scope.Palabras = $scope.proyectoNombre;
                    }
                }


                if ($scope.areaasignada != null) {
                    $scope.Palabra.Unidad = $scope.areaasignada;
                }
                else {
                    $scope.Palabra.Unidad = {};
                }
                               
                $rootScope.parametrosCursosMT = {};
                $rootScope.parametrosCursosMT.busqueda = Palabra;
             
            } catch (e) { }
        }



        $scope.LimpiarCampos = function () {
            $rootScope.parametrosCursosMT = {};

            tabla.dtOptions = [];
            $scope.limpia = true;
            
            $scope.Palabra.Autor = '';
            $scope.Palabra.Titulo = '';
            $scope.Palabra.proyecto = {};
            $scope.Palabra.FechaInicio = '';
            $scope.Palabra.FechaTermino = '';
            $scope.Palabra.TipoCurso = '';
            $scope.nueva = true;
            $scope.areaasignada = '';
            $scope.proyectoId = "";
            $scope.Palabra.claveUnidad = "";
            $scope.Palabra.Clave = "";

            $scope.proyectoNombre = "";
            $scope.proyectoId = "";

            $scope.fechaInicioSeleccionado = 0;
            $scope.fechaTerminoSeleccionado = 0;

            $scope.botonBusqueda = false;
            $scope.paramsDT.displayStart = 0;
            $rootScope.parametrosCursosMT = null;


         
        
        }

      
        $scope.paramsDT = JSON.parse(localStorage.getItem('MTBuscarCursosA1' + window.location.pathname)); //Recuperamos los parametrosCursosMT de filtrado en el DT
        if ($scope.paramsDT == null) {
            $scope.paramsDT = {};  //Puede que sean nulos, en dado caso se mostrara la pagina 1
            $scope.paramsDT.displayStart = 0;
        }

        tabla.dtColumns = [

           DTColumnBuilder.newColumn(null).withTitle('T&iacute;tulo').renderWith(actionsHtml).withOption('responsivePriority', '1').withClass('columnaTitulo').withClass("thMaxW300 sin-desborde"), ,
           DTColumnBuilder.newColumn(null).withTitle("Fecha en la que se impartió").withOption('defaultContent', '').renderWith(FormatFecha),
           DTColumnBuilder.newColumn("tipoCurso.descripcion", "Tipo de curso").withOption('defaultContent', ''),
           DTColumnBuilder.newColumn("proyecto.nombre", "Proyecto").withOption('defaultContent', ''),
 
        ];

        $scope.loadTable = function () {
            tabla.dtOptions = [];

            var proyectoId = "";
            var porque = "";
            var porque2 = "";

            if ($scope.Palabra.FechaTermino == 'undefined' || $scope.Palabra.FechaTermino == undefined || $scope.Palabra.FechaTermino == '' || $scope.Palabra.FechaTermino == "") {
            } else {
                porque = $scope.Palabra.FechaTermino.getDate() + '/' + ($scope.Palabra.FechaTermino.getMonth() + 1) + '/' + $scope.Palabra.FechaTermino.getFullYear();
            }

            if ($scope.Palabra.FechaInicio == 'undefined' || $scope.Palabra.FechaInicio == undefined || $scope.Palabra.FechaInicio == '' || $scope.Palabra.FechaInicio == "") {
            } else {
                porque2 = $scope.Palabra.FechaInicio.getDate() + '/' + ($scope.Palabra.FechaInicio.getMonth() + 1) + '/' + $scope.Palabra.FechaInicio.getFullYear();
            }


            try {
                proyectoId = $scope.proyectoId;
            } catch (e) { }

            tabla.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
                dataSrc: function (d) {
                    return d.data;
                },
                headers: headers,

                //IMPORTANTE atributos de entidad en el mismo orden en que se muestran para saber por que columna se quiere ORDENAR los datos
                data: {
                    "nameColumns": "titulo;fechaCurso;tipoCurso.descripcion;proyecto.nombre",
                    "Titulo": $scope.Palabra.Titulo,
                    "NuevaFechaInicio": porque2,//$scope.Palabra.FechaInicio.toString(),
                    "NuevaFechaTermino": porque,
                    "Tipo": $scope.Palabra.TipoCurso,
                    "proyectoId": proyectoId,
                    "ClaveUnidad": $scope.Palabra.claveUnidad,
                    "Autor": $scope.Palabra.Clave

                },
                url: API + "CursoInterno/getData",
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
       // .withOption('aaSorting', [0, 'desc']) // for default sorting column // here 0 means first column
                 .withOption('order', [1, 'desc'])
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

        function stateSaveCallback(settings, data) {
            var stado = $('#MTBuscarCursosA1').DataTable().state();
            localStorage.setItem('MTBuscarCursosA1' + window.location.pathname, JSON.stringify(stado))
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
        function detallesProyectos(data, type, full, meta) {
            if (data.proyectoId != null) {
                return '<td>' +
                '<a class="linkTabla" href="" load-proyectos idproyecto="' + data.proyecto.proyectoId + '" title="Detalle de proyecto">'
                    + data.proyecto.proyectoId + '</a>' + '-' + data.proyecto.nombre
                '</td>'
            } else {
                return 'Dato no disponible'
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
                return JSON.parse(localStorage.getItem('MTBuscarCursosA1' + window.location.pathname))
            }
        }
        
        function actionsHtml(data, type, full, meta) {
            tabla.registros[data.cursoInternoId] = data;
            return'<td>' +
                        '<a ui-sref="BuscarCursosDetails({id: '+data.cursoInternoId +', id2:'+data.cursoInternoId+'})" title="Detalles">'
                            + data.titulo  +
                         '</a>' +
                 '</td>'
        }

        function FormatFecha(data, type) {
            return ($filter('date')(data.fechaCurso, 'dd/MM/yyyy')).toString() + " - " + ($filter('date')(data.fechaTermino, 'dd/MM/yyyy')).toString();
        }

        $scope.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef([1]).withOption('type', 'date')
        ];



        $scope.buscar = function () {

            tabla.dtOptions = [];
                       
           
            try {

                if ($scope.areaasignada.tipoO < 2 || $scope.areaasignada.tipoO > 3) {
                    toastr.warning("Debe seleccionar una unidad de tipo Gerencia o División");
                    $scope.areaasignada = '';
                    return;
                }

            } catch (e) { }


            

            if ($scope.fechaInicioSeleccionado == 1 && $scope.fechaTerminoSeleccionado == 0) {                
                $scope.Palabra.FechaTermino = new Date();
            }

            if ($scope.fechaInicioSeleccionado == 0 && $scope.fechaTerminoSeleccionado == 1) {
                $scope.Palabra.FechaInicio = new Date(1975, 10, 25);               
            }


            $scope.AgregarPalabra($scope.Palabra);
            $scope.loadTable();
           
            $scope.botonBusqueda = true;
        }


       

        if (typeof $rootScope.parametrosCursosMT === 'undefined' || typeof $rootScope.parametrosCursosMT === null || typeof $rootScope.parametrosCursosMT === undefined || typeof $rootScope.parametrosCursosMT === "undefined") {
            $scope.botonBusqueda = false;
            $rootScope.parametrosCursosMT = null;
      
        } else {


            if (typeof $rootScope.parametrosCursosMT !== 'undefined' || typeof $rootScope.parametrosCursosMT !== null || typeof $rootScope.parametrosCursosMT === undefined || typeof $rootScope.parametrosCursosMT === "undefined") {

                if ($rootScope.parametrosCursosMT == null) {
                    $scope.botonBusqueda = false;
                    $rootScope.parametrosCursosMT = null;
                } else {


                    $scope.datosBusqueda = $rootScope.parametrosCursosMT.busqueda;

                    if ($scope.datosBusqueda != null) {

                        $scope.Palabra.Autor = $scope.datosBusqueda.Autor;
                        $scope.Palabra.Titulo = $scope.datosBusqueda.Titulo;
                        $scope.Palabra.FechaInicio = $scope.datosBusqueda.FechaInicio;
                        $scope.Palabra.FechaTermino = $scope.datosBusqueda.FechaTermino;

                        $scope.Palabra.TipoCurso = $scope.datosBusqueda.TipoCurso;
                        $scope.Palabra.Clave = $scope.datosBusqueda.Clave;

                        if ($scope.datosBusqueda.Unidad != null) {
                            $scope.areaasignada = $scope.datosBusqueda.Unidad;
                            $scope.Palabra.claveUnidad = $scope.datosBusqueda.ClaveUnidad;
                        }
                                           

                        if ($scope.datosBusqueda.proyecto != null) {
                            $scope.proyectoSelect = $scope.datosBusqueda.proyecto;
                            $scope.proyectoNombre = $scope.datosBusqueda.proyecto.nombre;
                            $scope.proyectoId = $scope.datosBusqueda.proyecto.proyectoId;
                        }

                    }

                    $scope.buscar();
                }

            }




        }
        


      

    }
})();