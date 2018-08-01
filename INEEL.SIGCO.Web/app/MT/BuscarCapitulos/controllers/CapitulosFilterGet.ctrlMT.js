
(function () {
    "use strict";
    angular
        .module("ineelMT")
        .controller("CapitulosFilterGetCtrl", [
        "AuthService",
        "$scope",
        "$state",
        "$location",
        "$stateParams",
        "buscarCapitulosService", "globalGet", "$http", '$uibModal', '$filter',
        "DTOptionsBuilder", "DTColumnBuilder", "$compile", "authInterceptorService", "$rootScope", "DTColumnDefBuilder", CapitulosFilterGetCtrl]);

    function CapitulosFilterGetCtrl(AuthService, $scope, $state,
        $location, $stateParams,
        buscarCapitulosService, globalGet, $http, $uibModal, $filter,
        DTOptionsBuilder, DTColumnBuilder, $compile, authInterceptorService, $rootScope, DTColumnDefBuilder) {

        jQuery.fn.DataTable.ext.type.search.string = function (data) { return !data ? '' : typeof data === 'string' ? data.replace(/έ/g, 'ε').replace(/ύ/g, 'υ').replace(/ό/g, 'ο').replace(/ώ/g, 'ω').replace(/ά/g, 'α').replace(/ί/g, 'ι').replace(/ή/g, 'η').replace(/\n/g, ' ').replace(/[áÁ]/g, 'a').replace(/[éÉ]/g, 'e').replace(/[íÍ]/g, 'i').replace(/[óÓ]/g, 'o').replace(/[úÚ]/g, 'u').replace(/ê/g, 'e').replace(/î/g, 'i').replace(/ô/g, 'o').replace(/è/g, 'e').replace(/ï/g, 'i').replace(/ü/g, 'u').replace(/ã/g, 'a').replace(/õ/g, 'o').replace(/ç/g, 'c').replace(/ì/g, 'i') : data; };

                                              
        var headers = authInterceptorService.requestServerSide();

        $scope.authentication = AuthService.authentication;


        $scope.Palabra = {};

        var tabla = this;

        tabla.dtInstance = {};
        tabla.registros = [];
        tabla.dtOptions = [];

        $scope.limpia = false;

        $scope.nueva = true;
        $scope.Palabras = '';
        $scope.FechaValida = false;

        $scope.botonBusqueda = false;


             
        var API = globalGet.get("api");
        $(document).ready(function () {
            $("form").keypress(function (e) {
                if (e.which == 13) {
                    return false;
                }
            });
        });
          
     
        buscarCapitulosService.getPaises().then(
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
               
                if (selectedItem.nombreCompleto != undefined) {
                    $scope.AgregarPalabra(selectedItem.nombreCompleto);
                }
            });
            $scope.BuscarAutor = false;
        }
        
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
                if (Palabra.Capitulo != "" && Palabra.Capitulo != undefined) {
                    if ($scope.Palabras != "") {
                        $scope.Palabras = $scope.Palabras + ", " + Palabra.Capitulo;
                    }
                    if ($scope.Palabras == "") {
                        $scope.Palabras = Palabra.Capitulo;
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

                }
                if (Palabra.Editorial != "" && Palabra.Editorial != undefined) {
                    if ($scope.Palabras != "") {
                        $scope.Palabras = $scope.Palabras + ", " + Palabra.Editorial;
                    }
                    if ($scope.Palabras == "") {
                        $scope.Palabras = Palabra.Editorial;
                    }
                }
                if (Palabra.Editor != "" && Palabra.Editor != undefined) {
                    if ($scope.Palabras != "") {
                        $scope.Palabras = $scope.Palabras + ", " + Palabra.Editor;
                    }
                    if ($scope.Palabras == "") {
                        $scope.Palabras = Palabra.Editor;
                    }
                }
                               
                $rootScope.parametrosCapitulos = {};
                
                $rootScope.parametrosCapitulos.busqueda = Palabra;
                
            } catch (e) { }
        }
        

         $scope.paramsDT = JSON.parse(localStorage.getItem('MTBusquedaCapitulos1A' + window.location.pathname)); //Recuperamos los parametrosCapitulos de filtrado en el DT
         if ($scope.paramsDT == null) {
             $scope.paramsDT = {};  //Puede que sean nulos, en dado caso se mostrara la pagina 1
             $scope.paramsDT.displayStart = 0;
         }

        tabla.dtColumns = [
           DTColumnBuilder.newColumn(null).withTitle('Cap&iacute;tulo').renderWith(actionsHtml).withOption('responsivePriority', '1').withClass('columnaTitulo').withClass("thMaxW300 sin-desborde"),
           DTColumnBuilder.newColumn("tituloLibro", "Libro").withOption('responsivePriority', '1').withClass('columnaTitulo').withClass("thMaxW300 sin-desborde"),
           DTColumnBuilder.newColumn("year", "Fecha").withOption('defaultContent', '').renderWith(FormatFecha),
           DTColumnBuilder.newColumn("editorial", "Editorial").withOption('defaultContent', ''),
        ];

        
        $scope.loadTable = function () {
           
            var paisID = null;

            if ($scope.Palabra.paisID >= 1) {
                paisID = $scope.Palabra.paisID;
            } else {
                paisID = null;
            }

           
           
            tabla.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
                dataSrc: function (d) {
                    return d.data;
                },
                headers: headers,
                //IMPORTANTE atributos de entidad en el mismo orden en que se muestran para saber por que columna se quiere ORDENAR los datos
                data: {
                    "nameColumns": "tituloCapitulo;tituloLibro;year;editorial ",
                    "Capitulo": $scope.Palabra.Capitulo,
                    "Titulo": $scope.Palabra.Titulo,                   
                    "FechaInicio": $filter('date')($scope.Palabra.FechaInicio, 'dd/MM/yyyy'),//$scope.Palabra.FechaInicio.toString(),
                    "Editorial": $scope.Palabra.Editorial,
                    "Editor" : $scope.Palabra.Editor,
                    "Autor": $scope.Palabra.Externo, //AUTOR EXTERNO
                    "Becario": $scope.Palabra.Clave, //Autor Interno
                    "Tipo": paisID, //PAIS
                },
                url: API + "Capitulos/getData",
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
            //.withOption('aaSorting', [0, 'desc']) // for default sorting column // here 0 means first column
            .withOption('order', [2, 'desc'])
            .withOption('language', { sSearch: "Filtrar:" })
            .withOption('createdRow', createdRow)//IMPORTANTE para ng-click
            .withOption('stateSaveCallback', stateSaveCallback)
            .withOption('stateLoadCallback', stateLoadCallback)
            .withOption('displayStart', $scope.paramsDT.displayStart);
        }
       
        


        $scope.LimpiarCampos = function () {
            $scope.limpia = true;
            $scope.Palabra.Capitulo = "";
            $scope.Palabra.Titulo = "";
            $scope.Palabra.FechaInicio = "";
            $scope.Palabra.Editorial = "";
            $scope.Palabra.Editor = "";
            $scope.Palabra.Externo = "";
            $scope.Palabra.Clave = "";
            $scope.Palabra.Pais = "";
            $scope.Palabra.Autor = "";
            $scope.Palabra.paisID = 0;
            $scope.botonBusqueda = false;
            $scope.paramsDT.displayStart = 0;
            $rootScope.parametrosCapitulos = {};
            $rootScope.parametrosCapitulos = null;     
           
        }



        $scope.buscar = function () {
            $scope.AgregarPalabra($scope.Palabra);
            $scope.loadTable();
            $scope.botonBusqueda = true;
        }
        
        function stateSaveCallback(settings, data) {
            var stado = $('#MTBusquedaCapitulos1A').DataTable().state();
            localStorage.setItem('MTBusquedaCapitulos1A' + window.location.pathname, JSON.stringify(stado))
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
                return JSON.parse(localStorage.getItem('MTBusquedaCapitulos1A' + window.location.pathname))
            }
        }
       
        function actionsHtml(data, type, full, meta) {
            tabla.registros[data.capitulosId] = data;
            return '<td>' +
                        '<a ui-sref="BuscarCapitulosDetails({id: ' + data.capitulosId + '})" title="Detalles">'
                            +data.tituloCapitulo +
                         '</a>' +
            '</td>'
        }
               
        function FormatFecha(data, type) {
            return $filter('date')(data, 'yyyy');
        }//date filter ,
        

        function createdRow(row, data, dataIndex) { //IMPORTANTE para ng-click
            // Recompiling so we can bind Angular directive to the DT
            $compile(angular.element(row).contents())($scope);
        }

        $scope.dtColumnDefs = [
              DTColumnDefBuilder.newColumnDef([2]).withOption('type', 'number')
        ];

       

                          

        if (typeof $rootScope.parametrosCapitulos === 'undefined' || typeof $rootScope.parametrosCapitulos === null || typeof $rootScope.parametrosCapitulos === undefined || typeof  $rootScope.parametrosCapitulos === "undefined") {
            $scope.botonBusqueda = false;
            $rootScope.parametrosCapitulos = null;
        } else {

           
            if (typeof $rootScope.parametrosCapitulos !== 'undefined' || typeof $rootScope.parametrosCapitulos !== null || typeof $rootScope.parametrosCapitulos === undefined || typeof  $rootScope.parametrosCapitulos === "undefined") {
              
                   if($rootScope.parametrosCapitulos == null){
                      $scope.botonBusqueda = false;
                      $rootScope.parametrosCapitulos = null;                                             
                   }else{

                    $scope.datosBusqueda = $rootScope.parametrosCapitulos.busqueda;
                    $scope.Palabra.Autor = $scope.datosBusqueda.Autor;
                    $scope.Palabra.Clave = $scope.datosBusqueda.Clave;
                    $scope.Palabra.Externo = $scope.datosBusqueda.Externo;
                    $scope.Palabra.Titulo = $scope.datosBusqueda.Titulo;
                    $scope.Palabra.Capitulo = $scope.datosBusqueda.Capitulo;
                    $scope.Palabra.Editor = $scope.datosBusqueda.Editor;
                    $scope.Palabra.Editorial = $scope.datosBusqueda.Editorial;
                    $scope.Palabra.FechaInicio = $scope.datosBusqueda.FechaInicio;
                    $scope.Palabra.paisID = $scope.datosBusqueda.paisID;
                    $scope.buscar();
              }
            }
           

        }

 

    }
})();