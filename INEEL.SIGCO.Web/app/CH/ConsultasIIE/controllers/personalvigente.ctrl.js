(function () {
    "use strict";

    angular
        .module("ineelCH")
        .filter('grado', function () {
            return function (formaciones, nivel, grado) {
                for (var f = 0; f < formaciones.length; f++) {
                    if (formaciones[f].gradoAcademicoId == nivel) {
                        var saltolinea = grado == 0 ? "  /<br>  " : "  /  "
                        return formaciones[f].carrera.descripcion + saltolinea + formaciones[f].institucion.descripcion;
                    }
                }


                return null;
            };
        })
        .filter('truncadecimales', function () {
            return function (edad) {
                return Math.floor(edad);
            };
        })
        .directive('numbersOnly', function () {
            return {
                require: 'ngModel',
                link: function (scope, element, attr, ngModelCtrl) {
                    function fromUser(text) {
                        if (text) {
                            var transformedInput = text.replace(/[^0-9]/g, '');

                            if (transformedInput !== text) {
                                ngModelCtrl.$setViewValue(transformedInput);
                                ngModelCtrl.$render();
                            }
                            return transformedInput;
                        }
                        return undefined;
                    }
                    ngModelCtrl.$parsers.push(fromUser);
                }
            };
        })
        .controller("personalvigenteCtrl", ['AuthService', '$scope', 'InventarioRH', '$timeout', personalvigenteCtrl]);

    function personalvigenteCtrl(AuthService, $scope, InventarioRH, $timeout) {
        $scope.investigadores = {};
        $scope.parametrosconsulta = {};
        $scope.fecha = new Date();

        $scope.consultarinvestigadores = function () {
            privateResetDatatable('estadistico');
            
            if ($scope.edadmedida === 1) {
                if ($scope.edadmaxima === undefined
                    || $scope.edadmaxima <= 0
                    || $scope.edadminima === undefined
                    || $scope.edadminima > $scope.edadmaxima) {
                    toastr.warning("Elija un rango de edad valido.", '', { timeOut: 10000 });
                    return false;
                }
            }
            $scope.investigadores = {};
            $scope.parametrosconsulta.rango = $scope.edadmedida;
            $scope.parametrosconsulta.edadMinima = $scope.edadminima;
            $scope.parametrosconsulta.edadMaxima = $scope.edadmaxima;
            $scope.parametrosconsulta.gradoacademico = $scope.gradoacademico;
            $scope.parametrosconsulta.antiguedad = $scope.antiguedad;
            $scope.parametrosconsulta.sexo = $scope.sexo;
            $scope.parametrosconsulta.fecha = $scope.fecha;
            InventarioRH.getpersonalvigentexfecha($scope.parametrosconsulta).then(
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

        var exportpdf = function () {
            if ($scope.investigadores === null || $scope.investigadores.length <= 0) {
                toastr.warning("Favor de generar una consulta...", '', { timeOut: 10000 });
                return;
            }

            var bodyStyles = { fontSize: 9, valign: 'middle', halign: 'left' };
            var columnStyles = {
                0: { halign: 'center' },
                2: { halign: 'center' },
                3: { halign: 'center' },
                4: { halign: 'center' }
            };
            var imageHeader = logoINEELrepot_;
            generateReportPDF_("ConsultaParametrizadaPersonalVigente",
                "Consulta parametrizada de personal vigente ",
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
            //        0: { halign: 'center' },
            //        2: { halign: 'center' },
            //        3: { halign: 'center' },
            //        4: { halign: 'center' }
            //    }
            //};

            //doc.setFontSize(12);
            //doc.text("Consulta de estudios de personal vigente. ", 40, 40);
            //doc.text('Información a la fecha: ' + ($scope.fecha.getDate()) + "/" + ($scope.fecha.getMonth() + 1) + "/" + $scope.fecha.getFullYear(), 355, 40);
            //var res = doc.autoTableHtmlToJson(document.getElementById("estadistico"));
            //doc.autoTable(res.columns, res.data, options);
            //// Total page number plugin only available in jspdf v1.0+
            //if (typeof doc.putTotalPages === 'function') {
            //    doc.putTotalPages(totalPagesExp);
            //}

            //doc.save("Estudios_Personal_Vigente.pdf");
            $timeout(function () { $scope.investpdf = null; }, 100);
        };

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

    }

})();