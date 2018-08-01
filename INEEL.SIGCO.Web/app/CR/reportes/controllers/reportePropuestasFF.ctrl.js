(function () {
    "use strict";
    angular
        .module("ineelCR")
        .controller("reportePropuestasCtrl", [
            "$scope",
            'DTOptionsBuilder',
            'ReportesFFCRService',
            '$uibModal',
            reportePropuestasCtrl]);
    function reportePropuestasCtrl($scope, DTOptionsBuilder, ReportesFFCRService, $uibModal) {
        //control de fecha para reportes 

        $scope.consultas = {};
        $scope.propuestasFF = {};
        $scope.unidadOrganizacional = {};
        $scope.mostrarFondo = false;
        $scope.mensajeresultados = "Filtre para mostrar resultados...";
        $scope.titulo = "Catálogo de propuestas por FF";
        $scope.dtOptions = DTOptionsBuilder.newOptions().withButtons([
            {
                extend: 'csv',
                text: '<i class="fa fa-download"></i> Exportar a Excel',
                className: 'btn btn-success'
            },
            {
                text: '<i class="fa fa-download"></i> Exportar a PDF',
                key: '1',
                className: 'btn btn-success',
                action: function (e, dt, node, config) {
                    $scope.exportpdf();
                }
            }])
            .withDOM('ftr<"default"pB>')
            .withOption('order', false)
            .withOption('responsive',true)
            .withDisplayLength(10);        

        $scope.obtenerInformacion = function () {
            debugger;
            var claveUnidad = "";
            //if (typeof $scope.uoselecionada === 'undefined' || $scope.uoselecionada.claveUnidad ===""){
            //    toastr.warning("seleccione una Unidad Organizacional");
            //    return;
            //}
            //obtener registros
            $scope.propuestasFF.fuenteFinanciamientoId = $scope.fuenteFinanciamientoId;
            $scope.propuestasFF.tipoFuenteFinanciamientoId = $scope.tipoFuenteFinanciamientoId;
            $scope.propuestasFF.fondoProgramaId = $scope.fondoProgramaId;
            $scope.propuestasFF.convocatoriaId = $scope.convocatoriaId;

            if ($scope.uoselecionada != undefined) {
                $scope.propuestasFF.claveunidad = $scope.uoselecionada.claveUnidad;
            } else {
                $scope.propuestasFF.claveunidad = "";
            }
           
            
            ReportesFFCRService.getPropuestasByFF($scope.propuestasFF).then(
                function (result) {
                    if (typeof result.data !== undefined && result.data != null && result.data.length > 0) {
                        $scope.consultas = result.data;

                    }
                    else {
                        $scope.mensajeresultados = "No se han encontrado resultados";
                        toastr.warning($scope.mensajeresultados);
                        $scope.consultas = [];
                    }

                },
                function (err) {
                    toastr.error("No se han podido cargar el contenido.");
                }
            );

        };

        //Limpia los filtros del formulario
        $scope.limpiar = function () {
            $scope.fuenteFinanciamientoId = 0;
            $scope.tipoFuenteFinanciamientoId = 0;
            $scope.fondoProgramaId = 0;
            $scope.convocatoriaId = 0;
            $scope.uoselecionada = undefined;

        }
        //obtener lista de Convocatorias
        $scope.consultarConvocatorias = function () {
            var fondo = 0;
            if ($scope.fondoProgramaId != null) {
                debugger;
                fondo = $scope.fondoProgramaId;
            }
            //else {
            ReportesFFCRService.getByFondo(fondo).then(
                     function (result) {
                         $scope.convocatorias = result.data;
                       
                     },
                    function (err) {
                        toastr.error("No se ha podido cargar los registros de las convocatorias");
                    }
                    );
            //}
        }
        //obtener lista de fondosPrograma 
        $scope.consultarFondos = function () {
            if ($scope.fuenteFinanciamientoId != null) {
                debugger;
                ReportesFFCRService.getFondosAllFKsByfuente($scope.fuenteFinanciamientoId).then(
                     function (result) {
                         $scope.fondosPrograma = result.data;
                         $scope.mostrarFondo = true;
                     },
                    function (err) {
                        toastr.error("No se ha podido cargar los registros de los Fondos o programas");
                    }
                    );
            }
            else {
                $scope.fondosPrograma = [];
            }
        }
        $scope.consultarFuentes = function () {
            var tipoFuente = 0;
            if ($scope.tipoFuenteFinanciamientoId != null) {
                tipoFuente = $scope.tipoFuenteFinanciamientoId;
            }
            //else {
                $scope.fondosPrograma = [];
                debugger;
                ReportesFFCRService.getFuenteByTipo(tipoFuente).then(
                     function (result) {
                         $scope.fuentesFinanciamiento = result.data;
                         $scope.mostrarFondo = false;
                     },
                    function (err) {
                        toastr.error("No se ha podido cargar los registros de los Fondos o programas");
                    }
                    );
            //}
        }
       

        //obtener lista de fuentes estado activo
        ReportesFFCRService.getFuentesFinanciamiento().then(
                 function (result) {
                     $scope.fuentesFinanciamiento = result.data;
                 },
                function (err) {
                    toastr.error("No se ha podido cargar los registros de las Fuentes de financiamiento");
                }
                );

        ReportesFFCRService.getTipoFuentes().then(
                 function (result) {
                     $scope.tiposFuenteFinanciamiento = result.data;
                 },
                function (err) {
                    toastr.error("No se ha podido cargar los registros de las Fuentes de financiamiento");
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
                //    doc.text('Gerencia: ' + $scope.gerenciaselected.nombreUnidad, data.settings.margin.left + 250, 90);
                ////doc.text('Informacióna la fecha: ' + ($scope.fechach.getDate()) + "/" + ($scope.fechach.getMonth() + 1) + "/" + $scope.fechach.getFullYear(), data.settings.margin.left + 500, 90);
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

            var res = doc.autoTableHtmlToJson(document.getElementById("tab_conv"));
            doc.autoTable(res.columns, res.data, options);
            // Total page number plugin only available in jspdf v1.0+
            if (typeof doc.putTotalPages === 'function') {
                doc.putTotalPages(totalPagesExp);
            }

            doc.save("propuestasPorFF.pdf");

        }
    }

})();

