(function () {
    "use strict";
    angular
        .module("ineelCR")
        .controller("reporteResultadosAliadosCtrl", [
            "$scope",
            'DTOptionsBuilder',
            'DTColumnBuilder',
            'ListasAlianzaCRService',
            '$uibModal',
            reporteAliadosCtrl]);
    function reporteAliadosCtrl($scope, DTOptionsBuilder, DTColumnBuilder, ListasAlianzaCRService, $uibModal) {
        //control de fecha para reportes 
       
        $scope.aliados = {};
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
                    $scope.exportpdf();
                }
            }])
            .withDOM('ftr<"default"pB>')
            .withOption('order', false)
            .withDisplayLength(10);    

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
            debugger;
            $scope.tipoOrganizacionId = 0;
            $scope.estadoConvenio = null;
            $scope.ambitoConvId = 0;
            //$scope.seleccion = [];
            $scope.fechaInicio = "";
            $scope.fechaTermino = "";
        }
        $scope.obtenerInformacion = function () {
            //obtener registros
            $scope.aliados = {};
            $scope.aliados.tipoOrganizacionId = $scope.tipoOrganizacionId;
            $scope.aliados.estadoConvenio = $scope.estadoConvenio;
            $scope.aliados.ambitoConvId = $scope.ambitoConvId;
            $scope.aliados.tipoConvenioId = $scope.seleccion;
            $scope.aliados.fechaInicio = $scope.fechaInicio;
            $scope.aliados.fechaTermino = $scope.fechaTermino;
            //debugger;
            ListasAlianzaCRService.getResListaAliados($scope.aliados).then(
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



        $scope.exportpdf = function () {


            var doc = new jsPDF('l', 'pt');

            var header = function (data) {
                doc.setFontSize(20);
                doc.setTextColor(40);
                doc.setFontStyle('normal');
                doc.addImage(imageHeader, 'JPGE', data.settings.margin.left, 40, 150, 31);
                doc.text($scope.titulo, data.settings.margin.left + 170, 60);
                doc.setFontSize(12);
                //doc.text('División: ' + $scope.divisionselected.nombreUnidad, data.settings.margin.left, 90);
                //if (typeof $scope.gerenciaselected !== 'undefined' && $scope.gerenciaselected != null)
                //    //doc.text('Gerencia: ' + $scope.gerenciaselected.nombreUnidad, data.settings.margin.left + 250, 90);
                //doc.text('Informacióna la fecha: ' + ($scope.fechach.getDate()) + "/" + ($scope.fechach.getMonth() + 1) + "/" + $scope.fechach.getFullYear(), data.settings.margin.left + 500, 90);
                doc.setFontSize(8);
                //doc.text('*** Director de División / ** Gerente de Unidad / @ Asistente Administrativo', data.settings.margin.left, 100);
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

            var options = {
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
                }
            };

            var res = doc.autoTableHtmlToJson(document.getElementById("tab_aliados"));
            doc.autoTable(res.columns, res.data, options);

            //var res = doc.autoTableHtmlToJson(document.getElementById("tab_proyectos"));
            //doc.autoTable(res.columns, res.data, options);

            //var options2 = {
            //    beforePageContent: header,
            //    afterPageContent: footer,
            //    margin: { top: 105 },

            //    styles: { cellPadding: 2, overflow: 'linebreak' },
            //    headerStyles: { rowHeight: 15, fontSize: 8 },
            //    bodyStyles: { rowHeight: 12, fontSize: 8, valign: 'top', halign: 'left' },
            //    columnStyles: {
            //        2: { columnWidth: 150 },
            //        7: { halign: 'center' },
            //        4: { halign: 'center' }
            //    },
            //    startY: doc.autoTableEndPosY() + 20
            //};
            //res = doc.autoTableHtmlToJson(document.getElementById("tab_propuestas"));
            //doc.autoTable(res.columns, res.data, options2);

            // Total page number plugin only available in jspdf v1.0+
            if (typeof doc.putTotalPages === 'function') {
                doc.putTotalPages(totalPagesExp);
            }

            doc.save("ResultadosAlianzas.pdf");

        }
    }

})();

