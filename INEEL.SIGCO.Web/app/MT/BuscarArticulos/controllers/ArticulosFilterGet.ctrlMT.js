
(function () {
    "use strict";
    angular
        .module("ineelMT")
        .controller("ArticulosFilterGetCtrl", [
        "AuthService",
        "$scope",
        "$state",
        "$location",
        "$stateParams",
        "buscarArticulosService", "globalGet", "$http",'$uibModal','$filter',
        "DTOptionsBuilder", "DTColumnBuilder", "$compile", "authInterceptorService", "$rootScope", "DTColumnDefBuilder", ArticulosFilterGetCtrl]);

    function ArticulosFilterGetCtrl(AuthService, $scope, $state,  $location, $stateParams,  buscarArticulosService, globalGet, $http, $uibModal,$filter, DTOptionsBuilder, DTColumnBuilder, $compile, authInterceptorService, $rootScope, DTColumnDefBuilder) {

        jQuery.fn.DataTable.ext.type.search.string = function (data) { return !data ? '' : typeof data === 'string' ? data.replace(/έ/g, 'ε').replace(/ύ/g, 'υ').replace(/ό/g, 'ο').replace(/ώ/g, 'ω').replace(/ά/g, 'α').replace(/ί/g, 'ι').replace(/ή/g, 'η').replace(/\n/g, ' ').replace(/[áÁ]/g, 'a').replace(/[éÉ]/g, 'e').replace(/[íÍ]/g, 'i').replace(/[óÓ]/g, 'o').replace(/[úÚ]/g, 'u').replace(/ê/g, 'e').replace(/î/g, 'i').replace(/ô/g, 'o').replace(/è/g, 'e').replace(/ï/g, 'i').replace(/ü/g, 'u').replace(/ã/g, 'a').replace(/õ/g, 'o').replace(/ç/g, 'c').replace(/ì/g, 'i') : data; };

        $scope.authentication = AuthService.authentication;
        $scope.Palabra = {};

        var tabla = this;
                             

        tabla.dtInstance = {};
        tabla.registros = [];

        $scope.limpia = false;
        $scope.BotonBusqueda = false;

        $scope.nueva = true;
        $scope.Palabras ='';
        $scope.CveRevista = '';
        $scope.proyectoSelect = {};
        $scope.paramsDT = {};
        $scope.revistaSelect = "";
        $scope.revistanombreSelect = "";

        
        var headers = authInterceptorService.requestServerSide();

        var API = globalGet.get("api");
        $(document).ready(function () {
            $("form").keypress(function (e) {
                if (e.which == 13) {
                    return false;
                }
            });
        });


        var endPointProyectos = API + "Proyectos/GetProyectos/";

        $scope.obtenRevistas = function () {
            buscarArticulosService.getRevistas().then(
                 function (result) {
                     $scope.revistas = result.data;
                 },
                function (err) {
                    toastr.error("No se han podido cargar el catalogo de revistas.");
                }
            );
        }

        $scope.obtenRevistas();
        $scope.openRevistas = function () {
            $scope.proyectoSelect = {};
            $scope.revistaSelect = "";
            $scope.revistanombreSelect = "";
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/listarevistas.html',
                controller: 'listarevistasCtrl',
                resolve: {
                    proyectoSelect: function () {
                        $scope.verproyecto = false;
                        return $scope.proyectoSelect;
                    }
                },
                scope: $scope
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.revistaSelect = selectedItem;
                $scope.revistanombreSelect = selectedItem.revistaNombre;
                $scope.CveRevista = selectedItem.revistaId;
            });

        }
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
        

        $scope.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef([2]).withOption('type', 'date')
        ];




        $scope.loadTable = function () {
                     
            tabla.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
                dataSrc: function (d) {
                    return d.data;
                },
                headers: headers,
                //IMPORTANTE atributos de entidad en el mismo orden en que se muestran para saber por que columna se quiere ORDENAR los datos
                data: {
                    "nameColumns": "tituloPublicacion; revista.revistaNombre; fechaPublicacion",
                    "Titulo": $scope.Palabra.Titulo,
                    "Autor": $scope.Palabra.Externo,
                    "Becario": $scope.Palabra.Clave, //Usado becario para clave de autor interno                
                    "porContenido": $scope.CveRevista, //por Contenido Usado para Titulo de revista
                },
                url: API + "Publicacion/getData",
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
            .withOption('language', { sSearch: "Filtrar:" })
            .withOption('createdRow', createdRow)
            .withOption('order', [2, 'desc'])
            .withOption('stateSaveCallback', stateSaveCallback)
            .withOption('stateLoadCallback', stateLoadCallback)
            .withOption('displayStart', $scope.paramsDT.displayStart);

           
        }

        //Puede que sean nulos, en dado caso se mostrara la pagina 1
        $scope.paramsDT = JSON.parse(localStorage.getItem('articulosMT' + window.location.pathname)); //Recuperamos los parametrosArticulos de filtrado en el DT
        if ($scope.paramsDT == null) {
            $scope.paramsDT = {};         
            $scope.paramsDT.displayStart = 0;
        }

        tabla.dtColumns = [
               DTColumnBuilder.newColumn(null).withTitle('T&iacute;tulo').renderWith(actionsHtml).withOption('responsivePriority', '1').withClass('columnaTitulo').withClass("thMaxW300 sin-desborde"),
               DTColumnBuilder.newColumn("revista.revistaNombre", "Revista").withOption('responsivePriority', '1').withClass("thMaxW300 sin-desborde ").withClass("thMaxW300 sin-desborde"),
               DTColumnBuilder.newColumn("fechaPublicacion", "Fecha publicaci&oacute;n").withOption('defaultContent', '').renderWith(FormatFecha).withOption('defaultContent', ''),
        ];
   
        function actionsHtml(data, type, full, meta) {
            tabla.registros[data.publicacionId] = data;
            return '<td>' +
                        '<a ng-click="detalleRegistro(' + data.publicacionId + ')"   style="cursor:pointer" title="Detalles">'
                            + data.tituloPublicacion +
                         ' </a>' +
            '</td>'
        }

        $scope.detalleRegistro = function (id) {
            $state.go('BuscarArticulosDetails', { id: id });
        }

        function FormatFecha(data, type) {
            return $filter('date')($filter('getFecha')(data, ' '), 'dd/MM/yyyy');
        }

        function createdRow(row, data, dataIndex) { //IMPORTANTE para ng-click
           $compile(angular.element(row).contents())($scope);
        }

        function stateSaveCallback(settings, data) {
            var stado = $('#articulosMT').DataTable().state();
            localStorage.setItem('articulosMT' + window.location.pathname, JSON.stringify(stado))
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
                return JSON.parse(localStorage.getItem('articulosMT' + window.location.pathname))
            }

        }
              
        $scope.LimpiarCampos = function () {
            $rootScope.parametrosArticulos = {};
            $scope.limpia = true;
            $scope.Palabra.Autor = '';
            $scope.Palabra.Titulo = '';
            $scope.Palabra.Revista = '';
            $scope.Palabra.Externo = '';
            $scope.CveRevista = '';
            $scope.revistaSelect = "";
            $scope.Palabra.Clave = "";
            $scope.revistanombreSelect = "";
            $scope.$broadcast('angucomplete-alt:clearInput');

            // $scope.loadTable();
            tabla.dtOptions = [];
            $scope.BotonBusqueda = false;
            $scope.paramsDT.displayStart = 0;
            $rootScope.parametrosArticulos = null;
        }              

        $scope.buscar = function () {
            $rootScope.parametrosArticulos = {};
            $scope.BotonBusqueda = true;

            $scope.AgregarPalabra($scope.Palabra);
            $scope.loadTable();
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

                if (Palabra.Revista != "" && Palabra.Revista != undefined) {
                    if ($scope.Palabras != "") {
                        $scope.Palabras = $scope.Palabras + ", " + $scope.Palabra.Revista.originalObject.revistaNombre;
                    }
                    if ($scope.Palabras == "") {
                        $scope.Palabras = $scope.Palabra.Revista.originalObject.revistaNombre;
                    }
                    $scope.CveRevista = $scope.Palabra.Revista.originalObject.revistaId;
                }
                if (Palabra.Externo != "" && Palabra.Externo != undefined) {
                    if ($scope.Palabras != "") {
                        $scope.Palabras = $scope.Palabras + ", " + Palabra.Externo;
                    }
                    if ($scope.Palabras == "") {
                        $scope.Palabras = Palabra.Externo;
                    }
                }

                $rootScope.parametrosArticulos = {};

                $rootScope.parametrosArticulos.PalabraAutor = Palabra.Autor;
                $rootScope.parametrosArticulos.Becario = $scope.Palabra.Clave;
                $rootScope.parametrosArticulos.ClaveRevista = $scope.CveRevista;
                $rootScope.parametrosArticulos.Titulo = Palabra.Titulo;
                $rootScope.parametrosArticulos.externo = $scope.Palabra.Externo;
                $rootScope.parametrosArticulos.Revistas = $scope.Palabra.Revista.originalObject.revistaNombre;
                $rootScope.parametrosArticulos.RevistaId = $scope.Palabra.Revista.originalObject.revistaId;;

              

            } catch (e) { }
        }

        if ($rootScope.parametrosArticulos == 'undefined' || $rootScope.parametrosArticulos == null || $rootScope.parametrosArticulos == undefined || $rootScope.parametrosArticulos == "undefined") {
            $scope.BotonBusqueda = false;
            tabla.dtOptions = [];

        } else {
                      
            if (typeof $rootScope.parametrosArticulos.Titulo === 'undefined' || typeof $rootScope.parametrosArticulos.Titulo === null || typeof $rootScope.parametrosArticulos.Titulo === undefined || typeof  $rootScope.parametrosArticulos.Titulo === "undefined") {
                $scope.Palabra.Autor = "";
                $scope.Palabra.Titulo = "";

                $scope.Palabra.Externo = "";
                $scope.revistanombreSelect = "";
                $scope.CveRevista = "";

                $scope.Palabra.Clave = "";
                $scope.CveRevista = "";

                $scope.Palabra.Externo = "";
                              
            } else {
                $scope.Palabra.Autor = $rootScope.parametrosArticulos.PalabraAutor;
                $scope.Palabra.Titulo = $rootScope.parametrosArticulos.Titulo;

                $scope.Palabra.Externo = $rootScope.parametrosArticulos.Externo;
                $scope.revistanombreSelect = $rootScope.parametrosArticulos.Revistas;
                $scope.CveRevista = $rootScope.parametrosArticulos.RevistaId;

                $scope.Palabra.Clave = $rootScope.parametrosArticulos.Becario;
                $scope.CveRevista = $rootScope.parametrosArticulos.ClaveRevista;

                $scope.Palabra.Externo = $rootScope.parametrosArticulos.externo;



                $scope.buscar();
            }

        }

        if ($scope.BotonBusqueda == false) {
            tabla.dtOptions = [];
        }
        

    }
})();