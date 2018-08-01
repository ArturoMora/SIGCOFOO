(function () {
    "use strict";
    angular
        .module("ineelCR")
        .controller("reporteResultadosAliadosDetalleCtrl", [
            "$scope","$state",
            "$filter",
            'DTOptionsBuilder',
            'DTColumnBuilder',
            'ListasAlianzaCRService',
            '$uibModal',
            '$timeout',
            reporteAliadosCtrl]);
    function reporteAliadosCtrl($scope, $state,
        $filter, DTOptionsBuilder, DTColumnBuilder, ListasAlianzaCRService, $uibModal, $timeout) {
        //control de fecha para reportes 
        $scope.buscar = false;
        $scope.tabla = [];
        $scope.seleccionTipoOrg = false;
        $scope.tabla.push("tabla1");
        $scope.tabla.push("tabla2");
        $scope.tabla.push("tabla3");
        $scope.tabla.push("tabla4");

        $scope.endPos = 0;
        $scope.aliados = {};
        $scope.params = {};
        $scope.aliadosPDF = {};
        $scope.seleccion = []; //Leti
        $scope.mensajeresultados = "Filtre para mostrar resultados...";
        $scope.titulo = "Resultados por alianza"
        $scope.dtOptions = DTOptionsBuilder.newOptions().withButtons([
            {
                extend: 'csv',
                text: 'Excel',
                className: 'btn btn-info'
            },
            {
                text: 'PDF',
                key: '1',
                className: 'btn btn-info',
                action: function (e, dt, node, config) {
                    $scope.exportarpdfinfo();
                }
            }])
            .withDOM('ftr<"default"pB>')
            .withOption('order', false)
            .withOption('responsive',true)
            .withDisplayLength(5);

        // toggle selection for a given employee by name
        $scope.toggleSelection = function toggleSelection(tipoConvenioId) {

            var idx = $scope.seleccion.indexOf(tipoConvenioId);
            // is currently selected
            if (idx > -1) {
                $scope.seleccion.splice(idx, 1);
            }
            // is newly selected
            else {
                $scope.seleccion.push(tipoConvenioId);

            }
            $scope.seleccion;
        };
        $scope.validarFechasInicio = function () {
            //debugger;
            $scope.fechaActual = new Date();
            $scope.inicioDateComparacion = new Date($scope.fechaInicio);
            $scope.finalDateComparacion = new Date($scope.fechaTermino);
            //debugger;

            //if ($scope.inicioDateComparacion > $scope.fechaActual) {
            //    $scope.fechaInicio = "";
            //    //$scope.convenios.fechaTermino = $scope.convenios.fechaTerminoAnt;
            //    toastr.error("Fecha de inicio deber ser menor la fecha actual.");
            //    return false;
            //}
            //debugger;
            if ($scope.finalDateComparacion != undefined) {
                if ($scope.inicioDateComparacion > $scope.finalDateComparacion) {
                    $scope.fechaInicio = "";
                    //$scope.convenios.fechaTermino = $scope.convenios.fechaTerminoAnt;
                    toastr.error("Fecha de inicio deber ser menor a fecha de término ");
                    return false;
                }
            }
        }

        $scope.validarFechas = function () {
            //debugger;
            $scope.fechaActual = new Date();
            $scope.inicioDateComparacion = new Date($scope.fechaInicio);
            $scope.finalDateComparacion = new Date($scope.fechaTermino);
            //if ($scope.finalDateComparacion > $scope.fechaActual) {
            //    $scope.fechaTermino = "";
            //    toastr.error("Fecha de término deber ser menor la fecha actual.");
            //    return false;
            //}
            if ($scope.inicioDateComparacion > $scope.finalDateComparacion) {
                $scope.fechaTermino = "";
                toastr.error("Fecha de inicio deber ser menor a fecha de término");
                return false;
            }
        }
        $scope.limpiar = function () {
            //debugger;
            $state.reload();
            $scope.tipoOrganizacionId = 0;
            $scope.estadoConvenio = null;
            $scope.ambitoConvId = 0;
            $scope.fechaInicio = "";
            $scope.fechaTermino = "";
        }
        $scope.obtenerInformacion = function () {
            //obtener registros
            $scope.params = {};
            $scope.params.tipoOrganizacionId = $scope.tipoOrganizacionId;
            $scope.params.estadoConvenio = $scope.estadoConvenio;
            $scope.params.ambitoConvId = $scope.ambitoConvId;
            $scope.params.tipoConvenioId = $scope.seleccion;
            $scope.params.fechaInicio = $scope.fechaInicio;
            $scope.params.fechaTermino = $scope.fechaTermino;


            var dateFI = Date.parse($scope.fechaInicio);

            if (dateFI == undefined || dateFI == null) {
                toastr.error("Fecha de inicio no tiene el formato correcto");
                return;
            }


            var dateFT = Date.parse($scope.fechaTermino);

            if (dateFT == undefined || dateFT == null) {
                toastr.error("Fecha de termino no tiene el formato correcto");
                return;
            }
           

            
            ListasAlianzaCRService.getResListaAliados($scope.params).then(
                function (result) {
                    if (typeof result.data !== undefined && result.data != null && result.data.length > 0) {
                        $scope.aliados = result.data;

                    }
                    else {
                        $scope.mensajeresultados = "No se han encontrado resultados";
                        toastr.warning($scope.mensajeresultados);
                        $scope.aliados = [];
                    }

                },
                function (err) {
                    toastr.error("No se han podido cargar el contenido.");
                }
            );

        };

        ListasAlianzaCRService.getTiposConvenio().then(
            function (result) {
                $scope.tiposConvenio = result.data;
            },
            function (err) {
                toastr.error("No se han podido cargar los tipos de convenio");
            }
        );

        ListasAlianzaCRService.getAmbitos().then(
            function (result) {
                $scope.ambitosConv = result.data;
            },
            function (err) {
                toastr.error("No se han podido cargar los ambitos");
            }
        );

        ListasAlianzaCRService.getTiposOrganizacion().then(
            function (result) {
                $scope.tiposOrganizacion = result.data;
            },
            function (err) {
                toastr.error("No se han podido cargar los tipos de organización");
            }
        );

        var imageHeader = logoINEELrepot_;

        $scope.exportarpdfinfo = function () {
            //obtener registros
            $scope.params = {};
            $scope.params.tipoOrganizacionId = $scope.tipoOrganizacionId;
            $scope.params.estadoConvenio = $scope.estadoConvenio;
            $scope.params.ambitoConvId = $scope.ambitoConvId;
            $scope.params.tipoConvenioId = $scope.seleccion;
            $scope.params.fechaInicio = $scope.fechaInicio;
            $scope.params.fechaTermino = $scope.fechaTermino;

            ListasAlianzaCRService.getResListaAliadosPDF($scope.params).then(
                function (result) {
                    if (typeof result.data !== undefined && result.data != null && result.data.length > 0) {
                        $scope.aliadosPDF = result.data;
                        $timeout(exportpdf, 150);
                    }
                    else {
                        $scope.mensajeresultados = "No se han encontrado resultados";
                        toastr.warning($scope.mensajeresultados);
                        $scope.aliadosPDF = [];
                    }

                },
                function (err) {
                    toastr.error("No se han podido cargar el contenido.");
                }
            );

        };

        var exportpdf = function () {

            var doc = new jsPDF('l', 'pt');

            var header = function (data) {
                doc.setFontSize(20);
                doc.setTextColor(40);
                doc.setFontStyle('normal');
                doc.addImage(imageHeader, 'JPGE', data.settings.margin.left, 40, 150, 31);
                doc.text($scope.titulo, data.settings.margin.left + 170, 60);
                doc.setFontSize(8);
            };
            var totalPagesExp = "{total_pages_count_string}";
            var footer = function (data) {
                var str = "Página " + data.pageCount;
                // Total page number plugin only available in jspdf v1.0+
                if (typeof doc.putTotalPages === 'function') {
                    str = str + " de " + totalPagesExp;
                }
                doc.text(str, data.settings.margin.left, doc.internal.pageSize.height - 30);
            };

            var colsAliado = [
                { title: "Aliado", key: "nombreAliado" },
                { title: "Tipo Organizacion", key: "tipoOrganizacion" }];

            var colsConvenio = [
                { title: "Núm. Convenio", key: "convenioId" },
                { title: "Ambito", key: "ambito" },
                { title: "TipoConvenio", key: "tipoConv" },
                { title: "FInicio Conv", key: "fInicioConc" },
                { title: "FTermino  Conv", key: "fTerminoConv" }
            ];
            var colsProyectos = [
                { title: "Núm. Proyecto", key: "ProyectoId" },
                { title: "Nombre Proyecto", key: "NombreProy" },
                { title: "Año proyecto", key: "FInicioProy" }];

            var colsPropuestas = [
                { title: "Núm. Propuesta", key: "PropuestaId" },
                { title: "Nombre Propuesta", key: "NombreProp" },
                { title: "Año propuesta", key: "FInicioProp" }];
            var colsActAdic = [
                { title: "Actividad Adicional", key: "NombreActAdc" },
                { title: "Año ActAdic", key: "FechaActividad" }];

            //var endPos = 0;
            var inicio = 0;
            angular.forEach($scope.aliadosPDF, function (aliado) {
                //angular.forEach($scope.aliados, function (meal) {
                //debugger;
                var rowsAliado = [];
                var rowsProyecto = [];
                var rowsPropuesta = [];
                var rowsConvenio = [];
                var rowsActAdic = [];

                $scope.endPos = doc.autoTableEndPosY();
                var optionsAliado = {
                    beforePageContent: header,
                    afterPageContent: footer,
                    margin: { top: 105 },

                    styles: { cellPadding: 2, overflow: 'linebreak' },
                    headerStyles: { rowHeight: 15, fontSize: 8 },
                    bodyStyles: { rowHeight: 12, fontSize: 8, valign: 'top', halign: 'left' },
                    columnStyles: {
                        2: { columnWidth: 150 },
                        7: { halign: 'center' },
                        4: { halign: 'center' }
                    },
                    startY: $scope.endPos ? $scope.endPos + 40 : false
                };


                //Aliados
                debugger;

                rowsAliado.push({
                    "nombreAliado": (aliado.nombreAliado != null) ? aliado.nombreAliado : "Sin dato",
                    "tipoOrganizacion": (aliado.tipoOrganizacion != null) ? aliado.tipoOrganizacion : "Sin dato"
                });

                doc.autoTable(colsAliado, rowsAliado, optionsAliado);
                //Convenios
                debugger;


                angular.forEach(aliado.conveniosAliadoRes, function (convenio) {
                    rowsConvenio.push({
                        "convenioId": convenio.convenioId,
                        "ambito": (convenio.ambito != null) ? convenio.ambito : "Sin dato",
                        "tipoConv": (convenio.tipoConv != null) ? convenio.tipoConv : "Sin dato",
                        "fInicioConc": $filter('date')(convenio.fInicioConv, 'dd-MM-yyyy'),
                        "fTerminoConv": $filter('date')(convenio.fTerminoConv, 'dd-MM-yyyy')
                    });

                });
                if (rowsConvenio.length > 0) {
                    $scope.endPos = doc.autoTableEndPosY();
                    doc.autoTable(colsConvenio, rowsConvenio, {
                        beforePageContent: header,
                        afterPageContent: footer,
                        margin: { top: 105 },
                        styles: { cellPadding: 2, overflow: 'linebreak' },
                        headerStyles: { rowHeight: 15, fontSize: 8 },
                        bodyStyles: { rowHeight: 12, fontSize: 8, valign: 'top', halign: 'left' },
                        columnStyles: {
                            2: { columnWidth: 150 },
                            7: { halign: 'center' },
                            4: { halign: 'center' }
                        },
                        startY: $scope.endPos ? $scope.endPos + 10 : false
                    });
                }

                //Proyectos
                debugger;
                angular.forEach(aliado.proyectosAliadoRes, function (proyecto) {
                    rowsProyecto.push({
                        "ProyectoId": proyecto.proyectoId,
                        "NombreProy": proyecto.nombreProy,
                        "FInicioProy": $filter('date')(proyecto.fInicioProy, 'yyyy')
                    });
                });
                if (rowsProyecto.length > 0) {
                    $scope.endPos = doc.autoTableEndPosY();
                    doc.autoTable(colsProyectos, rowsProyecto, {
                        beforePageContent: header,
                        afterPageContent: footer,
                        margin: { top: 105 },
                        styles: { cellPadding: 2, overflow: 'linebreak' },
                        headerStyles: { rowHeight: 15, fontSize: 8 },
                        bodyStyles: { rowHeight: 12, fontSize: 8, valign: 'top', halign: 'left' },
                        columnStyles: {
                            2: { columnWidth: 150 },
                            7: { halign: 'center' },
                            4: { halign: 'center' }
                        },
                        startY: $scope.endPos ? $scope.endPos + 10 : false
                    });
                }

                //Propuestas
                debugger;
                angular.forEach(aliado.propuestasAliadoRes, function (propuesta) {
                    rowsPropuesta.push({
                        "PropuestaId": propuesta.propuestaId,
                        "NombreProp": propuesta.nombreProp,
                        "FInicioProp": $filter('date')(propuesta.fInicioProp, 'yyyy')
                    });


                });
                if (rowsPropuesta.length > 0) {
                    $scope.endPos = doc.autoTableEndPosY();
                    doc.autoTable(colsPropuestas, rowsPropuesta, {
                        beforePageContent: header,
                        afterPageContent: footer,
                        margin: { top: 105 },
                        styles: { cellPadding: 2, overflow: 'linebreak' },
                        headerStyles: { rowHeight: 15, fontSize: 8 },
                        bodyStyles: { rowHeight: 12, fontSize: 8, valign: 'top', halign: 'left' },
                        columnStyles: {
                            2: { columnWidth: 150 },
                            7: { halign: 'center' },
                            4: { halign: 'center' }
                        },
                        startY: $scope.endPos ? $scope.endPos + 10 : false
                    });
                }

                //Actividades Adicionales
                debugger;
                angular.forEach(aliado.actividadesAdicionalAliadoRes, function (actAdic) {
                    rowsActAdic.push({
                        "NombreActAdc": actAdic.nombreActAdc,
                        "FechaActividad": $filter('date')(actAdic.fechaActividad, 'yyyy')
                    });


                });
                if (rowsActAdic.length > 0) {
                    $scope.endPos = doc.autoTableEndPosY();
                    doc.autoTable(colsActAdic, rowsActAdic, {
                        beforePageContent: header,
                        afterPageContent: footer,
                        margin: { top: 105 },
                        styles: { cellPadding: 2, overflow: 'linebreak' },
                        headerStyles: { rowHeight: 15, fontSize: 8 },
                        bodyStyles: { rowHeight: 12, fontSize: 8, valign: 'top', halign: 'left' },
                        columnStyles: {
                            2: { columnWidth: 150 },
                            7: { halign: 'center' },
                            4: { halign: 'center' }
                        },
                        startY: $scope.endPos ? $scope.endPos + 10 : false
                    });
                }

            });

            // Total page number plugin only available in jspdf v1.0+
            if (typeof doc.putTotalPages === 'function') {
                doc.putTotalPages(totalPagesExp);
            }

            doc.save("ResultadosAlianzas.pdf");

        }
    }

})();

