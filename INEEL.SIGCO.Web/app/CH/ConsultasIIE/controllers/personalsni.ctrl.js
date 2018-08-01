(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("personalsniCtrl", ['AuthService', '$scope', '$rootScope', '$state', 'InventarioRH', 'FechaCHService', personalsniCtrl]);
    function personalsniCtrl(AuthService, $scope, $rootScope, $state, InventarioRH, FechaCHService) {
        // $scope.fecha = new Date();
        $scope.fecha = FechaCHService.fechainventariochget();
        $scope.unidadOrganizacional = {};
        $scope.personalsni = {};
        $scope.unidadesorg = null;
        $scope.cargardivisiones = function () {
            //llenar combo divisiones
            $scope.divisiones = null;
            $scope.unidadesorg = null;
            $scope.unidadOrganizacional.claveunidad = '01';
            $scope.unidadOrganizacional.fechaEfectiva = $scope.fecha;
            InventarioRH.getdivision($scope.unidadOrganizacional).then(
                function (result) {
                    if (result.data != null && result.data.length > 0 && typeof result.data[0].children !== undefined) {
                        $scope.divisiones = result.data[0].children;
                        $scope.divisiones.push({ claveUnidad: '01', nombreUnidad: "Institucional" });
                    }
                }, function (err) {
                    console.log(err.message);
                });
        }

        $scope.consultarpersonalsni = function () {
            if (typeof $scope.divisionselected === 'undefined' || $scope.divisionselected === null) {
                toastr.warning("Favor de seleccionar un nivel para la consulta.", '', { timeOut: 10000 });
                return;
            }
            $scope.personalsni.fecha = $scope.fecha;
            $scope.personalsni.claveUnidad = $scope.divisionselected.claveUnidad;
            InventarioRH.getpersonalsni($scope.personalsni).then(
                function (response) {
                    if (response.data.length > 0) {
                        $scope.unidadesorg = response.data;
                    } else {
                        toastr.warning("El filtro no produjo ningun resultado.", '', { timeOut: 10000 });
                        $scope.unidadesorg = [];
                    }

                }
                , function (error) {
                    toastr.error(error.message);
                }
            );
        }

        $scope.reset = function () {
            $scope.fecha = new Date();
            $scope.unidadOrganizacional = {};
            $scope.personalsni = {};
            $scope.unidadesorg = null;
            $scope.divisionselected = null;
        };

        $scope.cambiafecha = function () {
            debugger
            var fehcaMininma = $rootScope.datePicker.FechaOptions.minDate;
            var fechaHoy = new Date();
            if (Date.parse($scope.fecha )) {
                
            if ($scope.fecha > fechaHoy) {
                toastr.warning("La fecha no debe se mayor a la actual.", '', { timeOut: 10000 });
                $scope.fecha = new Date();
            }else 
            if (fehcaMininma > $scope.fecha) {                
                $scope.fecha = new Date();
            } else {
                FechaCHService.fechainventariochset($scope.fecha);
                $state.reload();
            }
            } else {
                //Not a valid date
            }
            
            //$scope.cargardivisiones();
        };

        $scope.iradetalle = function (unidad) {
            $rootScope.unidad = unidad;
            $state.go("analisissni");
        }

        $scope.exportpdf = function () {
            if ($scope.unidadesorg === null || $scope.unidadesorg.length <= 0) {
                toastr.warning("Favor de generar una consulta...", '', { timeOut: 10000 });
                return;
            }
            var bodyStyles = { fontSize: 10, valign: 'middle', halign: 'left' };
            var columnStyles = { 0: { halign: 'center' } };
            var imageHeader = logoINEELrepot_;
            generateReportPDF_("ConsultaEstadísticaPersonalInvestigaciónSNI",
                "Consulta estadística de personal de investigación en S.N.I.",
                "",
                'Unidad Organizacional: ' + $scope.divisionselected.nombreUnidad,
                'Información a la fecha: ' + ($scope.fecha.getDate()) + "/" + ($scope.fecha.getMonth() + 1) + "/" + $scope.fecha.getFullYear(),
                bodyStyles, columnStyles, 'estadistico',
                imageHeader
            );

            //var doc = new jsPDF('p', 'pt');


            //var totalPagesExp = "{total_pages_count_string}";


            //var options = {
            //    margin: { top: 50 },
            //    styles: { cellPadding: 2 },
            //    headerStyles: {
            //        fontSize: 10, halign: 'center', valign: 'middle',
            //        textColor: 255, fillColor: [115, 135, 156], rowHeight: 23, fontStyle: 'bold'
            //    },
            //    bodyStyles: { fontSize: 10, valign: 'middle', halign: 'center' },
            //    columnStyles: {
            //        0: { halign: 'left' }
            //    }
            //};

            //doc.setFontSize(12);
            //doc.text("Consulta estadística de personal de investigación en S.N.I.", 40, 40);
            //doc.text('Información a la fecha: ' + ($scope.fecha.getDate()) + "/" + ($scope.fecha.getMonth() + 1) + "/" + $scope.fecha.getFullYear(), 355, 40);
            //var res = doc.autoTableHtmlToJson(document.getElementById("estadistico"));
            //doc.autoTable(res.columns, res.data, options);
            //// Total page number plugin only available in jspdf v1.0+
            //if (typeof doc.putTotalPages === 'function') {
            //    doc.putTotalPages(totalPagesExp);
            //}

            //doc.save("estadisticoSNI.pdf");

        };

        $scope.cargardivisiones();
    }
})();