(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("personalInvestigacionCtrl", ['AuthService', '$scope','$state' ,'InventarioRH', 'FechaCHService', personalInvestigacionCtrl]);
    function personalInvestigacionCtrl(AuthService, $scope, $state, InventarioRH, FechaCHService) {
        //$scope.fecha = new Date();
        $scope.fecha = FechaCHService.fechainventariochget();
        $scope.unidadOrganizacional = {};
        $scope.personalinvestigacion = {};
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

        $scope.consultarpersonal = function () {
            if (typeof $scope.divisionselected === 'undefined' || $scope.divisionselected === null) {
                toastr.warning("Favor de seleccionar un nivel para la consulta.", '', { timeOut: 10000 });
                return;
            }
            $scope.personalinvestigacion.fecha = $scope.fecha;
            $scope.personalinvestigacion.claveUnidad = $scope.divisionselected.claveUnidad;
            InventarioRH.getpersonalinvestigacion($scope.personalinvestigacion).then(
                function (response) {
                    if (response.data.length > 0) {
                        $scope.unidadesorg = response.data;
                    } else {
                        toastr.warning("El filtro no produjo ningun resultado.", '', { timeOut: 10000 });
                        $scope.unidadesorg = [];
                    }

                }
                , function (error) {

                }
            );
        }


        $scope.reset = function () {
            $scope.fecha = new Date();
            $scope.divisionselected = null;
            $scope.investigadores = {};
            $scope.unidadOrganizacional = {};
            $scope.personalinvestigacion = {};
            $scope.unidadesorg = null;
            $scope.cambiafecha();
        };

        $scope.cambiafecha = function () {
            var fechaHoy = new Date();
            if ($scope.fecha > fechaHoy) {
                toastr.warning("La fecha no debe se mayor a la actual.", '', { timeOut: 10000 });
                $scope.fecha = new Date();
            }
            FechaCHService.fechainventariochset($scope.fecha);
            $state.reload();
            //$scope.cargardivisiones();
        };

        $scope.exportpdf = function () {
            if ($scope.unidadesorg === null || $scope.unidadesorg.length <= 0) {
                toastr.warning("Favor de generar una consulta...", '', { timeOut: 10000 });
                return;
            }
            var bodyStyles = { fontSize: 10, valign: 'middle', halign: 'left' };
            var columnStyles = { 0: { halign: 'center' } };
            var imageHeader = logoINEELrepot_;
            generateReportPDF_("ConsultaEstadísticaPersonalInvestigación",
                "Consulta estadística de personal de investigación. ",
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
            //doc.text("Consulta estadística de personal de investigación. ", 40, 40);
            //doc.text('Información a la fecha: ' + ($scope.fecha.getDate()) + "/" + ($scope.fecha.getMonth() + 1) + "/" + $scope.fecha.getFullYear(), 310, 40);
            //var res = doc.autoTableHtmlToJson(document.getElementById("estadistico"));
            //doc.autoTable(res.columns, res.data, options);
            //// Total page number plugin only available in jspdf v1.0+
            //if (typeof doc.putTotalPages === 'function') {
            //    doc.putTotalPages(totalPagesExp);
            //}

            //doc.save("eEstadistico.pdf");

        };

        $scope.cargardivisiones();
    }
})();