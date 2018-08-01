
(function () {
    "use strict";
    angular
        .module("ineelMT")
        .controller("InformesBecariosFilterGetCtrl", [
        "AuthService",
        "$scope",
        "$state",
        "$location",
        "$stateParams",
        "buscarInformesBecariosService", "globalGet", "$http", '$uibModal', '$filter',
        "DTOptionsBuilder", "DTColumnBuilder", "$compile", "authInterceptorService", "$rootScope", InformesBecariosFilterGetCtrl]);

    function InformesBecariosFilterGetCtrl(AuthService, $scope, $state,
        $location, $stateParams,
        buscarInformesBecariosService, globalGet, $http, $uibModal, $filter,
        DTOptionsBuilder, DTColumnBuilder, $compile, authInterceptorService, $rootScope) {

        $scope.authentication = AuthService.authentication;
       
        $scope.Palabra = {};

        var tabla1 = this;
        var tabla2 = this;

        $scope.limpia = false;

        tabla1.dtInstance = {};
        tabla1.registros = [];
        tabla2.dtInstance = {};
        tabla2.registros = [];
        tabla1.dtOptions = [];
        tabla2.dtOptions = [];

        $scope.nueva = true;

        $scope.botonBusqueda = false;

        $scope.Palabras = "";
        $scope.CveInstitucion = "";
        $scope.NombreInstitucion = "";
        $scope.proyectoId = null;
        $scope.proyectoNombre = "";

        $scope.FechaValida = false;
        $scope.Palabra.selectedInforme = 1;

        $scope.fechaInicioSeleccionado = 0;
        $scope.fechaTerminoSeleccionado = 0;
     
        $scope.Palabra.proyecto = {};
        $scope.Palabra.asesor = {};
        $scope.Palabra.becario = {};
        $scope.Palabra.selectedinstitucion = {};

        var endPointProyectos = API + "Proyectos/GetProyectos/";
        var headers = authInterceptorService.requestServerSide();

        $scope.reload = function () {
            $state.reload();
        }

        var API = globalGet.get("api");
        $(document).ready(function () {
            $("form").keypress(function (e) {
                if (e.which == 13) {
                    return false;
                }
            });
        });







        //Tipo de Informes de becario
        $scope.Informes = [
                        {
                            "informeId": 0,
                            "descripcion": "Seleccione un tipo de informe"
                        },

            {
                "informeId": 1,
                "descripcion": "Becario interno"
            },
            {
                "informeId": 2,
                "descripcion": "Becario dirigido"
            }

        ];

        //Becario Interno
        buscarInformesBecariosService.getBecaInterna().then(
            function (result) {
                $scope.becasinternas = result.data;
            },
            function (err) {
                toastr.error("No se han podido cargar el catalogo de becas internas.");
            }
        );

        //Buscar Tipo de beca
        buscarInformesBecariosService.getTipoBeca().then(
            function (result) {
                 $scope.becas = result.data;
             },
            function (err) {
                toastr.error("No se han podido cargar el catalogo de Tipos de beca");
            }
        );

        //Buscar Instituciones
        buscarInformesBecariosService.getInstituciones().then(
            function (result) {
                 $scope.instituciones = result.data;
             },
            function (err) {
                toastr.error("No se han podido cargar el catalogo de Tipos de beca");
            }
        );


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
                $scope.Palabra.proyecto = selectedItem;
               
            });
        }

        //modal instituciones
        $scope.openInstituciones = function () {

            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/listainstituciones.html',
                controller: function ($scope, $uibModalInstance) {
                    $scope.institucion = {};
                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    }

                    $scope.ok = function (item) {
                        $uibModalInstance.close(item);
                    }
                },
                scope: $scope
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.Palabra.selectedinstitucion = selectedItem;
               
            });
           
        }

        //Buscar Asesor
        $scope.openAsesor = function () {
           
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
                $scope.Palabra.asesor = selectedItem;
              
                
            });
           
        }

        //Buscar Becario
        $scope.openBecario = function () {          
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

                $scope.Palabra.becario = selectedItem;
                              
            });
           
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

        $scope.AgregarPalabra = function (Palabra) {

            //try {
            //    if (Palabra.Asesor != "" && Palabra.Asesor != undefined) {
            //        if ($scope.Palabras != "") {
            //            $scope.Palabras = $scope.Palabras + ", " + Palabra.Asesor;
            //        }
            //        if ($scope.Palabras == "") {
            //            $scope.Palabras = Palabra.Asesor;
            //        }
            //    }
            //    if (Palabra.Becario != "" && Palabra.Becario != undefined) {
            //        if ($scope.Palabras != "") {
            //            $scope.Palabras = $scope.Palabras + ", " + Palabra.Becario;
            //        }
            //        if ($scope.Palabras == "") {
            //            $scope.Palabras = Palabra.Becario;
            //        }
            //    }
            //    if (Palabra.Titulo != "" && Palabra.Titulo != undefined) {
            //        if ($scope.Palabras != "") {
            //            $scope.Palabras = $scope.Palabras + ", " + Palabra.Titulo;
            //        }
            //        if ($scope.Palabras == "") {
            //            $scope.Palabras = Palabra.Titulo;
            //        }
            //    }

            //    if ($scope.CveInstitucion != "" && $scope.CveInstitucion != undefined) {
                    
            //        if ($scope.Palabras != "") {
            //            $scope.Palabras = $scope.Palabras + ", " + $scope.CveInstitucion;
            //        }
            //        if ($scope.Palabras == "") {
            //            $scope.Palabras = $scope.CveInstitucion;
            //        }
            //    }
            //    if (Palabra.FechaInicio != "" && Palabra.FechaInicio != undefined) {
            //        if ($scope.Palabras != "") {
            //            $scope.Palabras = $scope.Palabras + ", " + Palabra.FechaInicio.getDate() + '/' + (Palabra.FechaInicio.getMonth() + 1) + '/' + Palabra.FechaInicio.getFullYear();
            //        }
            //        if ($scope.Palabras == "") {
            //            $scope.Palabras = Palabra.FechaInicio.getDate() + '/' + (Palabra.FechaInicio.getMonth() + 1) + '/' + Palabra.FechaInicio.getFullYear();
            //        }
            //    }
            //    if (Palabra.FechaTermino != "" && Palabra.FechaTermino != undefined) {
            //        if ($scope.Palabras != "") {
            //            $scope.Palabras = $scope.Palabras + " - " + Palabra.FechaTermino.getDate() + '/' + (Palabra.FechaTermino.getMonth() + 1) + '/' + Palabra.FechaTermino.getFullYear();
            //        }
            //        if ($scope.Palabras == "") {
            //            $scope.Palabras = Palabra.FechaTermino.getDate() + '/' + (Palabra.FechaTermino.getMonth() + 1) + '/' + Palabra.FechaTermino.getFullYear();
            //        }
            //    }

            //    if (Palabra.TipoBeca1 != "" && Palabra.TipoBeca1 != undefined) {
            //        if ($scope.Palabras != "") {
            //            $scope.Palabras = $scope.Palabras + ", " + $scope.becasinternas[Palabra.TipoBeca1 - 1].descripcion;
            //        }
            //        if ($scope.Palabras == "") {
            //            $scope.Palabras = $scope.becasinternas[Palabra.TipoBeca1 - 1].descripcion;
            //        }
            //    }
            //    if (Palabra.TipoBeca2 != "" && Palabra.TipoBeca2 != undefined) {
            //        if ($scope.Palabras != "") {
            //            $scope.Palabras = $scope.Palabras + ", " + $scope.becas[Palabra.TipoBeca2 - 1].descripcion;
            //        }
            //        if ($scope.Palabras == "") {
            //            $scope.Palabras = $scope.becas[Palabra.TipoBeca2 - 1].descripcion;
            //        }
            //    }
            //    if ($scope.proyectoNombre != "" && $scope.proyectoNombre != undefined) {
            //        if ($scope.Palabras != "") {
            //            $scope.Palabras = $scope.Palabras + ", " + $scope.proyectoNombre;
            //        }
            //        if ($scope.Palabras == "") {
            //            $scope.Palabras = $scope.proyectoNombre;
            //        }
            //    }

            //    $scope.Palabra.selectedInforme = $scope.selectedInforme;


            //    $rootScope.parametrosBECARIOSMTA1 = {};
            //    $rootScope.parametrosBECARIOSMTA1 = Palabra;

            //} catch (e) { }

      

         


            $rootScope.parametrosBECARIOSMTA1 = {};
            $rootScope.parametrosBECARIOSMTA1 = $scope.Palabra;
        }

       

        $scope.LimpiarCampos = function () {
           
            $scope.limpia = true;
            $scope.botonBusqueda = false;

            $scope.Palabra = {};
           
            $scope.Palabras = "";
           
            $scope.Palabra.proyecto = {};
            $scope.Palabra.asesor = {};
            $scope.Palabra.becario = {};
            $scope.Palabra.selectedinstitucion = {};

            $scope.Palabra.Titulo = "";
            $scope.Palabra.FechaTermino = "";
            $scope.Palabra.FechaInicio = "";

            $scope.Palabra.TipoBeca1 = "";
            $scope.Palabra.TipoBeca2 = "";
         
            $scope.fechaInicioSeleccionado = 0;
            $scope.fechaTerminoSeleccionado = 0;

            $scope.Palabra.selectedInforme = 0;
           
        }

   
        $scope.paramsDT = JSON.parse(localStorage.getItem('MTBuscarInformesBecariosA1' + window.location.pathname)); //Recuperamos los parametros de filtrado en el DT
        if ($scope.paramsDT == null) {
            $scope.paramsDT = {};  //Puede que sean nulos, en dado caso se mostrara la pagina 1
            $scope.paramsDT.displayStart = 0;
        }

        //Becario Interno




        tabla1.dtColumns = [
            DTColumnBuilder.newColumn(null).withTitle('Becario').renderWith(actionsHtml).withOption('responsivePriority', '1').withClass('columnaTitulo').withOption('defaultContent', ''),
      
            DTColumnBuilder.newColumn("fechaInicioBeca", "Per&iacute;odo").withOption('defaultContent', '').renderWith(renderFecha),
            DTColumnBuilder.newColumn(null).withTitle("Instituci&oacute;n").renderWith(actionsHtmlIntitucion).withOption('defaultContent', ''),
            DTColumnBuilder.newColumn("becaInterna.descripcion", "Tipo de beca").withOption('defaultContent', '').renderWith(renderBeca),
        ];

        tabla2.dtColumns = [
          DTColumnBuilder.newColumn(null).withTitle('Becario').renderWith(actionsHtml).withOption('responsivePriority', '1').withClass('columnaTitulo').withOption('defaultContent', ''),
          DTColumnBuilder.newColumn("nombreEstancia", "Nombre estancia").withOption('defaultContent', '').renderWith(renderEstancia),

          DTColumnBuilder.newColumn("fechaInicioBeca", "Per&iacute;odo").withOption('defaultContent', '').renderWith(renderFecha),
          DTColumnBuilder.newColumn(null).withTitle("Instituci&oacute;n").renderWith(actionsHtmlIntitucion) .withOption('defaultContent', ''),
          DTColumnBuilder.newColumn("becaInterna.descripcion", "Tipo de beca").withOption('defaultContent', '').renderWith(renderBeca),
        ];

        $scope.loadTable1 = function () {
            var proyectoId = null;
            var FechaInicio = null;
            var FechaTermino = null;
            var claveAsesor = null;
            var claveBecario = null;
            var claveInstitucion = null;

            if ($scope.Palabra.asesor != null) {
                claveAsesor = $scope.Palabra.asesor.clavePersona;
            }

            if ($scope.Palabra.becario != null) {
                claveBecario = $scope.Palabra.becario.clavePersona;
            }

            if ($scope.Palabra.selectedinstitucion != null) {
                claveInstitucion = $scope.Palabra.selectedinstitucion.institucionID;
            }

            if ($scope.Palabra.proyecto != null) {
                proyectoId = $scope.Palabra.proyecto.proyectoId;
            }

            //try {
            //    FechaInicio = $filter('date')($scope.Palabra.FechaInicio, 'yyyy/MM/dd');
            //    FechaTermino = $filter('date')($scope.Palabra.FechaTermino, 'yyyy/MM/dd');
            //} catch (e) { }

          
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

            debugger;
            tabla1.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
                dataSrc: function (d) {
                    return d.data;
                },
                headers: headers,
                //IMPORTANTE atributos de entidad en el mismo orden en que se muestran para saber por que columna se quiere ORDENAR los datos
                data: {
                    "nameColumns": "fechaInicioBeca;fechaTerminoBeca;clavePersona;institucion.descripcion;becaInterna.descripcion;",
                    "Autor": claveAsesor,
                    "Becario": claveBecario,
                    "Titulo": $scope.Palabra.Titulo,
                    "Institucion": claveInstitucion,
                    "NuevaFechaInicio": porque2,
                    "NuevaFechaTermino": porque,
                    "Tipo": $scope.Palabra.TipoBeca1,
                    "proyectoId": proyectoId,
                },
                url: API + "BecarioInterno/getData",
                type: "POST",
                error: function (err) {
                    try {
                        //$scope.errorGetData = true;
                       // debugger;
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
        $scope.loadTable2 = function () {
            var proyectoId = null;
            var FechaInicio = null;
            var FechaTermino = null;
            var claveAsesor = null;
            var claveBecario = null;
            var claveInstitucion = null;

            if ($scope.Palabra.asesor != null) {
                claveAsesor = $scope.Palabra.asesor.clavePersona;
            }

            if ($scope.Palabra.becario != null) {
                claveBecario = $scope.Palabra.becario.clavePersona;
            }

            if ($scope.Palabra.selectedinstitucion != null) {
                claveInstitucion = $scope.Palabra.selectedinstitucion.institucionID;
            }

            if ($scope.Palabra.proyecto != null) {
                proyectoId = $scope.Palabra.proyecto.proyectoId;
            }

            //try {
            //    FechaInicio = $filter('date')($scope.Palabra.FechaInicio, 'yyyy/MM/dd');
            //    FechaTermino = $filter('date')($scope.Palabra.FechaTermino, 'yyyy/MM/dd');
            //} catch (e) { }

           
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

            debugger;
            tabla2.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
                dataSrc: function (d) {
                    return d.data;
                },
                headers: headers,
                //IMPORTANTE atributos de entidad en el mismo orden en que se muestran para saber por que columna se quiere ORDENAR los datos
                data: {
                    "nameColumns": "nombreBecario;fechaTermino;otorganteBeca;tipoBeca.descripcion;",
                    "Autor": claveAsesor,
                    "Becario": claveBecario,
                    "Titulo": $scope.Palabra.Titulo,
                    "Institucion": claveInstitucion,
                    "NuevaFechaInicio": porque2,//$scope.Palabra.FechaInicio.toString(),
                    "NuevaFechaTermino": porque,
                    "Tipo": $scope.Palabra.TipoBeca2,
                    "proyectoId": proyectoId,
                },
                
                url: API + "BecarioDirigido/getData",
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
        
        $scope.buscar = function () {

            if ($scope.Palabra.selectedInforme == 1 || $scope.Palabra.selectedInforme == 2) {
                tabla1.dtOptions = [];
                tabla2.dtOptions = [];
                $scope.botonBusqueda = true;

                //if ($scope.Palabra.FechaInicio == undefined && $scope.Palabra.FechaTermino != undefined) {
                //    toastr.error("Favor de indicar fecha de inicio");
                //    return;
                //    //$scope.Palabra.FechaInicio = "1/1/1985";
                //}
                //if ($scope.Palabra.FechaTermino == undefined && $scope.Palabra.FechaInicio != undefined) {
                //    toastr.error("Favor de indicar fecha de término");
                //    return;
                //    //$scope.Palabra.FechaTermino = new Date();
                //}

                if ($scope.fechaInicioSeleccionado == 1 && $scope.fechaTerminoSeleccionado == 0) {
                    $scope.Palabra.FechaTermino = new Date();
                }

                if ($scope.fechaInicioSeleccionado == 0 && $scope.fechaTerminoSeleccionado == 1) {
                    $scope.Palabra.FechaInicio = new Date(1975, 10, 25);
                }



                $scope.AgregarPalabra($scope.Palabra);
                //Buscar Becarios Internos
                if ($scope.Palabra.selectedInforme == 1) {
                    $scope.loadTable1();
                }
                //Buscar Becarios Externos
                if ($scope.Palabra.selectedInforme == 2) {
                    $scope.loadTable2();
                }
            }
        }

        function actionsHtmlIntitucion(data, type, full, meta) {

            if (($scope.Palabra.selectedInforme == null) || ($scope.Palabra.selectedInforme == 1)) {
                return "<td>" + data.institucion.descripcion + "</td>";
            } else
                if ($scope.Palabra.selectedInforme == 2) {
                    if (data.otorganteBeca == undefined || data.otorganteBeca == null || data.otorganteBeca == 'null') {
                        data.otorganteBeca = ' ';
                    }
                    return "<td>" + data.otorganteBeca + "</td>";
                }
                else {
                    return '<td></td>';
                }  
        }
        function actionsHtml(data, type, full, meta) {
           
            if (($scope.Palabra.selectedInforme == null) || ($scope.Palabra.selectedInforme == 1)) {
                if ($scope.Palabra.selectedInforme == null || $scope.Palabra.selectedInforme == 1)
                    try {
                        if ($scope.Palabra.TipoBeca1 != null && $scope.Palabra.TipoBeca1 != '') {
                            tabla1.registros[data.becarioInternoId] = data;
                            return '<td>' +
                                        '<a class="btn btn-default" ui-sref="BuscarInformesBecariosDetails({id: ' + data.becarioInternoId + ', id2:' + $scope.Palabra.selectedInforme + '})" title="Detalles">'
                                            + '<i class="glyphicon glyphicon-align-justify"></i>' +
                                         '</a>' +
                            '</td>'
                        }
                    } catch (ex) { }
            } else
                if ($scope.Palabra.selectedInforme == 2) {
                    
                    try {
                        if ($scope.Palabra.TipoBeca2 != null && $scope.Palabra.TipoBeca2 != '') {
                            tabla2.registros[data.becarioDirigidoId] = data;
                            return '<td>' +
                                        '<a class="btn btn-default" ui-sref="BuscarInformesBecariosDetails({id: ' + data.becarioDirigidoId + ', id2:' + $scope.Palabra.selectedInforme + '})" title="Detalles">'
                                            + '<i class="glyphicon glyphicon-align-justify"></i>' +
                                         '</a>' +
                            '</td>'
                        }
                    } catch (ex) { }
                }
                else {
                    return '<td></td>';
                }
            return '<td></td>';
        }
        function renderFecha(data, type, row, meta) {
            if ($scope.Palabra.selectedInforme == 1) {
                var d1 = $filter('date')(row.fechaInicioBeca, 'dd/MM/yyyy');
                var d2 = $filter('date')($filter('getFecha')(row.fechaTerminoBeca, ''), 'dd/MM/yyyy');
                if (d2 == undefined || d2 == null) {
                    d2 = 'Sin definir';
                }
                return d1 + ' - ' + d2;
            }
            if ($scope.Palabra.selectedInforme == 2) {
                var d1 = $filter('date')(row.fechaInicio, 'dd/MM/yyyy');
                var d2 = $filter('date')(row.fechaTermino, 'dd/MM/yyyy');
                var d2 = $filter('date')($filter('getFecha')(row.fechaTermino, ''), 'dd/MM/yyyy');
                if (d2 == undefined || d2 == null) {
                    d2 = 'Sin definir';
                }
                return d1 + ' - ' + d2;
            }
        }
        function renderBecario(data, type, row, meta) {
            if ($scope.Palabra.selectedInforme == 1) {
                return row.clavePersona;
            }
            if ($scope.Palabra.selectedInforme == 2) {
                return row.nombreBecario;
            }
        }
        function renderEstancia(data, type, row, meta) {
            if ($scope.Palabra.selectedInforme == 1) {
                return "";
            }
            if ($scope.Palabra.selectedInforme == 2) {
                return row.nombreEstancia;
            }
        }
        function actionsHtml(data, type, full, meta) {
            if ($scope.Palabra.selectedInforme == 1) {
                tabla1.registros[data.becarioInternoId] = data;
                return '<td>' +
                            '<a  ui-sref="BuscarInformesBecariosDetails({id: ' + data.becarioInternoId + ', id2:' + $scope.Palabra.selectedInforme + '})" title="Detalles">'
                                + data.clavePersona +
                             '</a>' +
                '</td>'
            }
            if ($scope.Palabra.selectedInforme == 2) {
                tabla2.registros[data.becarioDirigidoId] = data;
                return '<td>' +
                            '<a ui-sref="BuscarInformesBecariosDetails({id: ' + data.becarioDirigidoId + ', id2:' + $scope.Palabra.selectedInforme + '})" title="Detalles">'
                                + data.nombreBecario +
                             '</a>' +
                '</td>'
            }
        }
        function renderBeca(data, type, row, meta) {
            if ($scope.Palabra.selectedInforme == 1) {
                return row.becaInterna.descripcion;
            }
            if ($scope.Palabra.selectedInforme == 2) {
                return row.tipoBeca.descripcion;
            }
        }
        function stateSaveCallback(settings, data) {
            var stado = $('#MTBuscarInformesBecariosA1').DataTable().state();
            localStorage.setItem('MTBuscarInformesBecariosA1' + window.location.pathname, JSON.stringify(stado))
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
                return JSON.parse(localStorage.getItem('MTBuscarInformesBecariosA1' + window.location.pathname))
            }
        }
        function createdRow(row, data, dataIndex) { //IMPORTANTE para ng-click
            // Recompiling so we can bind Angular directive to the DT
            $compile(angular.element(row).contents())($scope);
        }


        if ($rootScope.parametrosBECARIOSMTA1 == 'undefined' || $rootScope.parametrosBECARIOSMTA1 == null || $rootScope.parametrosBECARIOSMTA1 == undefined || $rootScope.parametrosBECARIOSMTA1 == "undefined") {
            $scope.botonBusqueda = false;
        } else {


          
            $scope.Palabra = $rootScope.parametrosBECARIOSMTA1;               
            
            $scope.buscar();

        }

    }
})();