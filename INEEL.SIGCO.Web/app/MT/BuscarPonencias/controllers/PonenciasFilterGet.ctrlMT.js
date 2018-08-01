
(function () {
    "use strict";
    angular
        .module("ineelMT")
        .controller("PonenciasFilterGetCtrl", [
        "AuthService",
        "$scope",
        "$state",
        "$location",
        "$stateParams",
        "buscarPonenciasService", "globalGet", "$http", '$uibModal', '$filter',
        "DTOptionsBuilder", "DTColumnBuilder", "$compile", "authInterceptorService", "$rootScope", "DTColumnDefBuilder", PonenciasFilterGetCtrl]);

    function PonenciasFilterGetCtrl(AuthService, $scope, $state,
        $location, $stateParams,
        buscarPonenciasService, globalGet, $http, $uibModal, $filter,
        DTOptionsBuilder, DTColumnBuilder, $compile, authInterceptorService, $rootScope, DTColumnDefBuilder) {
        jQuery.fn.DataTable.ext.type.search.string = function (data) { return !data ? '' : typeof data === 'string' ? data.replace(/έ/g, 'ε').replace(/ύ/g, 'υ').replace(/ό/g, 'ο').replace(/ώ/g, 'ω').replace(/ά/g, 'α').replace(/ί/g, 'ι').replace(/ή/g, 'η').replace(/\n/g, ' ').replace(/[áÁ]/g, 'a').replace(/[éÉ]/g, 'e').replace(/[íÍ]/g, 'i').replace(/[óÓ]/g, 'o').replace(/[úÚ]/g, 'u').replace(/ê/g, 'e').replace(/î/g, 'i').replace(/ô/g, 'o').replace(/è/g, 'e').replace(/ï/g, 'i').replace(/ü/g, 'u').replace(/ã/g, 'a').replace(/õ/g, 'o').replace(/ç/g, 'c').replace(/ì/g, 'i') : data; };


        var endPointProyectos = API + "Proyectos/GetProyectos/";
        var headers = authInterceptorService.requestServerSide();
        $scope.authentication = AuthService.authentication;
        
        $scope.fechaInicioSeleccionado = 0;
        $scope.fechaTerminoSeleccionado = 0;


        $scope.limpia = false;
        $scope.nueva = true;
        $scope.botonBusqueda = false;
        $scope.FechaValida = false;

        $scope.Palabra = {};
        $scope.PaisID = "";

     

        var tabla = this;
        tabla.dtInstance = {};
        tabla.registros = [];
        tabla.dtOptions = [];
        $scope.Palabras = '';
      


        var API = globalGet.get("api");
        $(document).ready(function () {
            $("form").keypress(function (e) {
                if (e.which == 13) {
                    return false;
                }
            });
        });


       


        buscarPonenciasService.getPaises().then(
            function (result) {
                $scope.paises = result.data;
            },
            function (err) {
                toastr.error(err);
        });


        //Buscar Autor
        $scope.openAutor = function () {
            $scope.BuscarAutor = true;
            $scope.desabilitarBuscarAsesor = true;
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
                $scope.Palabra.Autor = selectedItem.nombreCompleto;
                $scope.Palabra.Clave = selectedItem.clavePersona;
                //$scope.Palabras = selectedItem.nombreCompleto;
                if (selectedItem.nombreCompleto != undefined) {
                    $scope.AgregarPalabra(selectedItem.nombreCompleto);
                }
            });
            $scope.BuscarAutor = false;
        }

        ///Validar rango de fechas
        $scope.validarFechasInicio = function () {
            $scope.fechaActual = new Date();
            $scope.inicioDateComparacion = new Date($scope.Palabra.FechaInicio);
            $scope.finalDateComparacion = new Date($scope.Palabra.FechaTermino);
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
            $scope.finalDateComparacion = new Date($scope.Palabra.FechaTermino);
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

        ////Proyecto
        //$scope.onSelectedProyecto = function (selectedItem) {
        //    try {
        //        $scope.Palabra.Proyecto = selectedItem.proyectoId;
        //        AgregarPalabra($scope.Palabra.Proyecto);
        //        LimpiarCampos('Proyecto');
        //    } catch (e) { }
        //}

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
                if (Palabra.Externo != "" && Palabra.Externo != undefined) {
                    if ($scope.Palabras != "") {
                        $scope.Palabras = $scope.Palabras + ", " + Palabra.Externo;
                    }
                    if ($scope.Palabras == "") {
                        $scope.Palabras = Palabra.Externo;
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
                if (Palabra.paisID != "" && Palabra.paisID != undefined) {
                    if ($scope.Palabras != "") {
                        $scope.Palabras = $scope.Palabras + ", " + Palabra.paisID;
                    }
                    if ($scope.Palabras == "") {
                        $scope.Palabras = Palabra.paisID;
                    }
                    //Palabra.Pais = Palabra.Pais.paisID;
                    try {
                        $scope.PaisID = Palabra.paisID;
                    }catch(e){}

                }

                $rootScope.parametrosPnenciasMT = {};
                $rootScope.parametrosPnenciasMT.busqueda = Palabra;

            } catch (e) { }
        }

        //$scope.limpiarSelectProyecto = function () {
        //    $scope.elementosSelect = [];
        //    $scope.elementosSelectProyecto = [];
        //    $scope.Palabra.proyecto = {};
        //    $scope.Palabra.proyecto.selected = undefined;
        //    $scope.$broadcast('angucomplete-alt:clearInput');
        //    $scope.Palabra.Pais = undefined;
        //}

        $scope.LimpiarCampos = function () {

          
            tabla.dtOptions = [];
            $scope.limpia = true;

            //$scope.Palabra = {};
            $scope.Palabra.Autor = '';
            $scope.Palabra.Externo = '';
            $scope.Palabra.Titulo = '';
            $scope.Palabra.FechaInicio = '';
            $scope.Palabra.FechaTermino = '';
            $scope.Palabra.paisID = '';
            $scope.nueva = true;
            $scope.botonBusqueda = false;
            $scope.paramsDT.displayStart = 0;
            $scope.fechaInicioSeleccionado = 0;
            $scope.fechaTerminoSeleccionado = 0;
        }

        //$scope.refreshelementosSelectProyecto = function (search) {
        //    ////alert("refreshelementosSelect");
        //    if (search != undefined && search.length > 1) {
        //        //var params = { vocabulario: search, sensor: false };

        //        var getDatos = endPointProyectos + search
        //        return $http.get(
        //          getDatos
        //        ).then(function (response) {
        //            console.log(response);
        //            $scope.elementosSelectProyecto = response.data;
        //            if ($scope.elementosSelectProyecto == null || $scope.elementosSelectProyecto.length == 0) {
        //                $scope.elementosSelectProyecto = [];
        //                $scope.elementosSelectProyecto.push({ "Palabra.proyectoId": "Sin resultados con este criterio", "nombre": "" });
        //            }
        //        },
        //        function () {
        //            console.log('ERROR!!!');
        //        }
        //        );
        //    } else {
        //        $scope.elementosSelectProyecto = [];
        //    }
        //};


        $scope.paramsDT = JSON.parse(localStorage.getItem('MTBuscarPonenciasA1' + window.location.pathname)); //Recuperamos los parametrosPnenciasMT de filtrado en el DT
        if ($scope.paramsDT == null) {
            $scope.paramsDT = {};  //Puede que sean nulos, en dado caso se mostrara la pagina 1
            $scope.paramsDT.displayStart = 0;
        }


        tabla.dtColumns = [
           DTColumnBuilder.newColumn(null).withTitle('T&iacute;tulo').renderWith(actionsHtml).withOption('responsivePriority', '1').withClass('columnaTitulo').withClass("thMaxW300 sin-desborde"),
           DTColumnBuilder.newColumn("fechaInicio", "Fecha congreso").withOption('defaultContent', '').renderWith(FormatFecha),
           DTColumnBuilder.newColumn("congreso.nombreCongreso", "Evento").withOption('defaultContent', ''),
           DTColumnBuilder.newColumn("pais.descripcion", "Lugar").withOption('defaultContent', ''),
        ];

        $scope.loadTable = function () {
        
            var porque = "";

          

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

          
            
            var proyectoId = null;
            try {
                proyectoId = $scope.Palabra.proyecto.selected.proyectoId;
            } catch (e) { }


            tabla.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
                dataSrc: function (d) {

                    return d.data;
                },
                headers: headers,
                //IMPORTANTE atributos de entidad en el mismo orden en que se muestran para saber por que columna se quiere ORDENAR los datos
                data: {
                    "nameColumns": "tituloPonencia;fechaInicio;congreso.nombreCongreso;pais.descripcion",
                    "Autor": $scope.Palabra.Externo,
                    "Becario": $scope.Palabra.Clave,
                    "Titulo": $scope.Palabra.Titulo,
                    "NuevaFechaInicio": porque2,//$scope.Palabra.FechaInicio.toString(),
                    "NuevaFechaTermino": porque,
                    "Tipo": $scope.Palabra.paisID,
                },
                url: API + "Ponencia/getData",
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



       
        $scope.buscar = function () {
          
            tabla.dtOptions = [];
                   
            try {

                if ($scope.areaasignada.tipoO < 2 || $scope.areaasignada.tipoO > 3) {
                    toastr.warning("Debe seleccionar una unidad de tipo Gerencia o División");
                    return;
                }

            } catch (e) { }

            //var tmpPalabra = $scope.Palabra;

            if ($scope.fechaInicioSeleccionado == 1 && $scope.fechaTerminoSeleccionado == 0) {
                $scope.Palabra.FechaTermino = new Date();
            }

            if ($scope.fechaInicioSeleccionado == 0 && $scope.fechaTerminoSeleccionado == 1) {
                $scope.Palabra.FechaInicio = new Date(1975, 10, 25);
            }

            $scope.AgregarPalabra($scope.Palabra);
            $scope.loadTable();


            $scope.nueva = false;
            //$scope.Palabra = tmpPalabra;
            $scope.botonBusqueda = true;
        }

        function actionsHtml(data, type, full, meta) {
            tabla.registros[data.ponenciaId] = data;
            return '<td>' +
                        '<a ui-sref="BuscarPonenciasDetails({id: ' + data.ponenciaId + '})" title="Detalles">'
                            + data.tituloPonencia +
                         '</a>' +
            '</td>'
        }

        function FormatFecha(data, type) {
            return $filter('date')(data, 'dd/MM/yyyy');
        }//date filter ,

       
        function stateSaveCallback(settings, data) {
            var stado = $('#MTBuscarPonenciasA1').DataTable().state();
            localStorage.setItem('MTBuscarPonenciasA1' + window.location.pathname, JSON.stringify(stado))
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
                return JSON.parse(localStorage.getItem('MTBuscarPonenciasA1' + window.location.pathname))
            }
        }


        function createdRow(row, data, dataIndex) { //IMPORTANTE para ng-click
            // Recompiling so we can bind Angular directive to the DT
            $compile(angular.element(row).contents())($scope);
        }

        $scope.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef([1]).withOption('type', 'date')
        ];


        if ($rootScope.parametrosPnenciasMT == 'undefined' || $rootScope.parametrosPnenciasMT == null || $rootScope.parametrosPnenciasMT == undefined || $rootScope.parametrosPnenciasMT == "undefined") {
            $scope.BotonBusqueda = false;
        } else {

            $scope.datosBusqueda = $rootScope.parametrosPnenciasMT.busqueda;
           
           
            $scope.Palabra.Externo = $scope.datosBusqueda.Externo;
            $scope.Palabra.Clave = $scope.datosBusqueda.Clave;
            $scope.Palabra.Titulo = $scope.datosBusqueda.Titulo;
            $scope.Palabra.FechaTermino = $scope.datosBusqueda.FechaTermino;
            $scope.Palabra.FechaInicio = $scope.datosBusqueda.fechaInicio;
            $scope.Palabra.paisID = $scope.datosBusqueda.paisID;
                        
             $scope.Palabra.Autor = $scope.datosBusqueda.Autor;
           
             $scope.nueva = true;


            $scope.buscar();

        }


      

    

    }
})();