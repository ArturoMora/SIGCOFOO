(function () {
    "use strict";

    angular
        .module("ineelCH")
        .controller("estudiosCtrl", ['AuthService', 'DTOptionsBuilder', '$scope', 'InventarioRH', '$timeout', 'FormacionAcademicaService', '$state', 'FechaCHService', estudiosCtrl]);

    function estudiosCtrl(AuthService, DTOptionsBuilder, $scope, InventarioRH, $timeout, FormacionAcademicaService, $state, FechaCHService) {
        $scope.investigadores = {};
        $scope.parametrosconsulta = {};
        $scope.fecha = new Date();
        $scope.carrera = "";

        FormacionAcademicaService.getCarrera().then(
             function (result) {
                 $scope.carreras = result.data;
             },
            function (err) {
                toastr.error("No se han podido cargar el catalogo de carreras.");
            }
            );

        $scope.consultarinvestigadores = function () {
           
            var ok = document.getElementById("selectcarreras_value").value;
            if ($scope.selectedcarrera == undefined && (ok=="" || ok==undefined)) {
                toastr.warning("Favor de introducir la especialidad a filtrar", '', { timeOut: 10000 });
                return;
            }

           
            if ($scope.selectedcarrera != undefined) {
                $scope.carrera = $scope.selectedcarrera.title;
            } else {
                $scope.carrera = ok;
            }
            
            $scope.investigadores = {};
            $scope.parametrosconsulta.tipoConsulta = 1;
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
            var imageHeader = logoINEELrepot_;
            var bodyStyles= { fontSize: 9, valign: 'middle', halign: 'left' };
            var columnStyles= { 0: { halign: 'center' } };
             generateReportPDF_("ConsultaEstudiosPersonalVigente",
                "Consulta de estudios de personal vigente. ",
                "",
                "",
                'Información a la fecha: ' + ($scope.fecha.getDate()) + "/" + ($scope.fecha.getMonth() + 1) + "/" + $scope.fecha.getFullYear(),
                bodyStyles, columnStyles, 'estadistico',
                imageHeader
            );

            $scope.mostrar = false;
         };

         $scope.reset = function () {
             $state.reload();
         };

         $scope.dtOptions = DTOptionsBuilder.newOptions().withButtons([
             {
                 extend: 'excelHtml5',
                 text: '<i class="fa fa-download"></i> Descargar Excel',
                 className: 'btn btn-success',
                 title: 'ConsultaEstudiosPersonalVigente'
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

        $scope.$watch('carrera', function () {
            if (typeof $scope.carrera !== 'undefined')
                $scope.carrera = $scope.carrera.replace(/[áàäâ]/g, "a").replace(/[éèëê]/g, "e").replace(/[íìïî]/g, "i").replace(/[óòôö]/g, "o").replace(/[úùüü]/g, "u").toUpperCase();
        });

    }

})();