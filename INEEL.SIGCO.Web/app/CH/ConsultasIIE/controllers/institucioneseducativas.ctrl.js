(function () {
    "use strict";

    angular
        .module("ineelCH")
        .controller("institucioneseducativasCtrl", ['AuthService', 'DTOptionsBuilder','$scope', 'InventarioRH', '$timeout','$state','FormacionAcademicaService', institucioneseducativasCtrl]);

    function institucioneseducativasCtrl(AuthService, DTOptionsBuilder, $scope, InventarioRH, $timeout,$state, FormacionAcademicaService) {
        $scope.investigadores = {};
        $scope.parametrosconsulta = {};
        $scope.fecha = new Date();


        FormacionAcademicaService.getInstituciones().then(
             function (result) {
                 $scope.instituciones = result.data;
             },
            function (err) {
                toastr.error("No se han podido cargar el catalogo de instituciones.");
            }
            );

        
       
        $scope.consultarinvestigadores = function () {
            
            var ok = document.getElementById("selectinstituciones_value").value;
            if ($scope.selectinstituciones == undefined && (ok == "" || ok == undefined)) {
                toastr.warning("Favor de introducir la especialidad a filtrar", '', { timeOut: 10000 });
                return;
            }

            if ($scope.selectinstituciones != undefined) {
                $scope.carrera = $scope.selectinstituciones.title;
            } else {
                $scope.carrera = ok;
            }
            //if (typeof $scope.carrera === 'undefined' || $scope.carrera === null || $scope.carrera === "") {
            //    toastr.warning("Favor de introducir la especialidad a filtrar");
            //    return;
            //}
            $scope.investigadores = {};
            $scope.parametrosconsulta.tipoConsulta = 2;
            $scope.parametrosconsulta.texto = $scope.carrera;
            $scope.parametrosconsulta.gradoacademico = $scope.gradoacademico;
            $scope.parametrosconsulta.fecha = $scope.fecha;
            InventarioRH.getpersonalestudiosxfecha($scope.parametrosconsulta).then(
                function (response) {
                    if (response.data === null || response.data.length <= 0) {
                        toastr.warning("El filtro no produjo ningun resultado.", '', { timeOut: 10000 });
                        $scope.investigadores = [];
                    }
                    else {
                        $scope.investigadores = response.data;
                        $scope.columnasvisibles();
                    }

                }
                , function (error) {
                    toastr.error(error.message);
                }
            );

            
        }

        $scope.cambiafecha = function () {
            var fechaHoy = new Date();
            if ($scope.fecha > fechaHoy) {
                toastr.warning("La fecha no debe se mayor a la actual.", '', { timeOut: 10000 });
                $scope.fecha = new Date();
            }
            FechaCHService.fechainventariochset($scope.fecha);


        };
       
        $scope.exportar = function () {
            $scope.investpdf = $scope.investigadores;
            $timeout(exportpdf, 100);
        };
        $scope.mostrar = false;
        var exportpdf = function () {
            if ($scope.investigadores === null || $scope.investigadores.length <= 0) {
                toastr.warning("Favor de generar una consulta...", '', { timeOut: 10000 });
                return;
            }
            $scope.mostrar = true;
            var bodyStyles = { fontSize: 9, valign: 'middle', halign: 'left' };
            var columnStyles = { 0: { halign: 'center' } };
            var imageHeader = logoINEELrepot_;
            generateReportPDF_("ConsultaInstitucionesEducativasPersonalVigente",
                "Consulta de instituciones educativas del personal vigente. ",
                "",
                "",
                'Información a la fecha: ' + ($scope.fecha.getDate()) + "/" + ($scope.fecha.getMonth() + 1) + "/" + $scope.fecha.getFullYear(),
                bodyStyles, columnStyles, 'estadistico',
                imageHeader
            );

            //var doc = new jsPDF('l', 'pt');

            //var totalPagesExp = "{total_pages_count_string}";
            //var footer = function (data) {
            //    var str = "Página " + data.pageCount;
            //    // Total page number plugin only available in jspdf v1.0+
            //    if (typeof doc.putTotalPages === 'function') {
            //        str = str + " de " + totalPagesExp;
            //    }
            //    doc.text(str, data.settings.margin.left, doc.internal.pageSize.height - 30);
            //};


            //var options = {
            //    afterPageContent: footer,
            //    margin: { top: 50 },
            //    styles: { cellPadding: 2, overflow: 'linebreak' },
            //    headerStyles: {
            //        fontSize: 10, halign: 'center', valign: 'middle',
            //        textColor: 255, fillColor: [115, 135, 156], rowHeight: 23, fontStyle: 'bold'
            //    },
            //    bodyStyles: { fontSize: 9, valign: 'middle', halign: 'left' },
            //    columnStyles: {
            //        0: { halign: 'center' }
            //    }
            //};

            //doc.setFontSize(12);
            //doc.text("Consulta de instituciones educativas de personal vigente. ", 40, 40);
            //doc.text('Información a la fecha: ' + ($scope.fecha.getDate()) + "/" + ($scope.fecha.getMonth() + 1) + "/" + $scope.fecha.getFullYear(), 355, 40);
            //var res = doc.autoTableHtmlToJson(document.getElementById("estadistico"));
            //doc.autoTable(res.columns, res.data, options);
            //// Total page number plugin only available in jspdf v1.0+
            //if (typeof doc.putTotalPages === 'function') {
            //    doc.putTotalPages(totalPagesExp);
            //}

            //doc.save("InstitucionesEducativas_Personal_Vigente.pdf");
            $scope.mostrar = false;
        };
        $scope.dtOptions = DTOptionsBuilder.newOptions().withButtons([
            {
                extend: 'excelHtml5',
                text: '<i class="fa fa-download"></i> Descargar Excel',
                className: 'btn btn-success',
                title: 'ConsultaInstitucionesEducativasPersonalVigente'
            },
            {
                text: '<i class="fa fa-download"></i> Descargar PDF',
                key: '1',
                className: 'btn btn-success',
                action: function (e, dt, node, config) {
                    exportpdf();
                }
            }])
            .withDOM('lftr<"default"ip><"clear">B')
            .withOption('order', false)
            .withDisplayLength(10);
        $scope.columnasvisibles = function () {
            $scope.licvisible = false;
            $scope.maevisible = false;
            $scope.docvisible = false;
            $scope.titulo = "Licenciatura";
            switch ($scope.gradoacademico) {
                case 1:
                    $scope.licvisible = true;
                    break;
                case 2:
                    $scope.maevisible = true;
                    break;
                case 3:
                    $scope.docvisible = true;
                    break;
                default:
                    $scope.licvisible = true;
                    $scope.maevisible = true;
                    $scope.docvisible = true;
                    break;
            }
        }

        $scope.reset = function () {
            $state.reload();
        };

        $scope.$watch('carrera', function () {
            if (typeof $scope.carrera !== 'undefined')
                $scope.carrera = $scope.carrera.replace(/[áàäâ]/g, "a").replace(/[éèëê]/g, "e").replace(/[íìïî]/g, "i").replace(/[óòôö]/g, "o").replace(/[úùüü]/g, "u").toUpperCase();
        });

    }

})();