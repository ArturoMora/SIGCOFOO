(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("personalsnidatosCtrl", ['AuthService', '$scope','$state', 'InventarioRH', 'DTOptionsBuilder', 'FechaCHService', personalsnidatosCtrl]);
    function personalsnidatosCtrl(AuthService, $scope, $state, InventarioRH, DTOptionsBuilder, FechaCHService) {
        //$scope.fecha = new Date();
        $scope.fecha = FechaCHService.fechainventariochget();
        $scope.unidadOrganizacional = {};
        $scope.personalsni = {};
        $scope.investigadores = null;
        $scope.cargardivisiones = function () {
            //llenar combo divisiones
            $scope.divisiones = null;
            $scope.investigadores = null;
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

        //Para referencias sobre las opciones del datatables https://datatables.net/reference/option/buttons
        $scope.dtOptions = DTOptionsBuilder.newOptions().withButtons([
            {
                extend: 'excelHtml5',
                text: '<i class="fa fa-download"></i> Descargar Excel',
                className: 'btn btn-success',
                title: 'catalogoInvestigadores'
            },
            {
                text: '<i class="fa fa-download"></i> Descargar PDF',
                key: '1',
                className: 'btn btn-success',
                action: function (e, dt, node, config) {
                    $scope.exportpdf();
                }
            }])
            .withDOM('lftr<"default"ip><"clear">B');

        $scope.consultarpersonalsni = function () {
            if (typeof $scope.divisionselected === 'undefined' || $scope.divisionselected === null) {
                toastr.warning("Favor de seleccionar un nivel para la consulta.", '', { timeOut: 10000 });
                return;
            }
            $scope.personalsni.fecha = $scope.fecha;
            $scope.personalsni.claveUnidad = $scope.divisionselected.claveUnidad;
            InventarioRH.getpersonalsnidatos($scope.personalsni).then(
                function (response) {
                    if (response.data.length > 0) {
                        $scope.investigadores = response.data;
                        
                    } else {
                        $scope.investigadores = [];
                        toastr.warning("No hay resultados para la busqueda.", '', { timeOut: 10000 });
                    }

                }
                , function (error) {
                    toastr.error(error.message);
                }
            );
        }

        $scope.reset = function () {
            $scope.fecha = new Date();
            $scope.divisionselected = null;
            $scope.investigadores = {};
            $scope.cargardivisiones();
        };

        $scope.cambiafecha = function () {
            var fechaHoy = new Date();
            if ($scope.fecha > fechaHoy) {
                toastr.warning("La fecha no debe se mayor a la actual.", '', { timeOut: 10000 });
                $scope.fecha = new Date();
            }
            FechaCHService.fechainventariochset($scope.fecha);
            
            $scope.cargardivisiones();
        };


        var bodyStyles = { fontSize: 8, valign: 'middle', halign: 'left' };
        var columnStyles= { };
        $scope.exportpdf = function () {
            if ($scope.investigadores === null || $scope.investigadores.length <= 0) {
                toastr.warning("Favor de generar una consulta...", '', { timeOut: 10000 });
                return;
            }
            var imageHeader = logoINEELrepot_;
            generateReportPDF_("ConsultaDatosPersonalInvestigaciónSNI",
                "Consulta de datos de personal de investigación en SNI",
                "",
                'Unidad Organizacional: ' + $scope.divisionselected.nombreUnidad,
                'Información a la fecha: ' + ($scope.fecha.getDate()) + "/" + ($scope.fecha.getMonth() + 1) + "/" + $scope.fecha.getFullYear(),
                bodyStyles, columnStyles, 'estadistico',
                imageHeader
            );
           

        };

        ///Funcion para remover acentos en las busquedas del datatable
        var searchType = jQuery.fn.DataTable.ext.type.search;
        searchType.string = function (data) {
            return !data ?
                '' :
                typeof data === 'string' ?
                    removeAccents(data) :  //La funcion removeAccents es global, se encuentra al findel del archivo globalINEEL.js
                    data;
        };

        searchType.html = function (data) {
            return !data ?
                '' :
                typeof data === 'string' ?
                    removeAccents(data.replace(/<.*?>/g, '')) :
                    data;
        };

        //end acentos

        $scope.cargardivisiones();
    }
})();