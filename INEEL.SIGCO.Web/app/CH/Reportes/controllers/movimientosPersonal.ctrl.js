(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("movimientosPersonalCtrl", [
            "AuthService",
            "$scope",
            "$state",
            "$filter",
            'InventarioRH',
            'FechaCHService',
            movimientosPersonalCtrl]);

    function movimientosPersonalCtrl(AuthService, $scope, $state, $filter, InventarioRH, FechaCHService) {
        $scope.imprimiendo=false;
        $scope.movimientospersonal = {};
        $scope.fechaTermino = new Date(); //Fecha actual
        $scope.fechaInicio= new Date($scope.fechaTermino.getFullYear(),0,1);  //Por default la fecha inicial es el primer dia del primer mes del anio actual
        

        $scope.buscar = function () {
            $scope.buscandoInformacion=true;
            /****Damos el formato a las fechas, asi las recibe el back */
            $scope.movimientospersonal.fechaInicio = ($filter('date')($scope.fechaInicio, 'yyyy-MM-dd')).toString();
            $scope.movimientospersonal.fechaTermino = ($filter('date')($scope.fechaTermino, 'yyyy-MM-dd')).toString();
            InventarioRH.movimientospersonal($scope.movimientospersonal).then(
                function (result) {
                    $scope.resultados = result.data;
                    $scope.buscandoInformacion=false;
                }, function (err) {
                    toastr.error("Error al cargar los datos del personal", '', { timeOut: 10000 });
                    console.log(err);
                });
        }

        $scope.buscar();
        

        // $scope.cambiafecha = function () {
        //     if ($scope.fechach === undefined) {
        //         return false;
        //     }

        //     var fecha = new Date($scope.fechach).toLocaleDateString("en-US");
        //     var fechaaux = new Date($scope.fechach);
        //     var auxfecha = new Date("01/01/2006");
        //     var fechaHoy = new Date();
        //     //ValidarFecha
        //     debugger;
        //     if (fechaaux > fechaHoy || fechaaux < auxfecha) {
        //         toastr.error("La fecha debe estar comprendida dentro del 01/01/2006 al " + fechaHoy.toLocaleDateString("es-ES"));
        //         $scope.error = true;
        //         return false;
        //     } else {
        //         $scope.error = false;
        //     }
        //     FechaCHService.fechainventariochset($scope.fechach);
        //     ////////////////
        //     fecha = fecha.split('/').join('-');
        //     $state.reload();
        // };

        $scope.exportGrafica = function () {
            $scope.imprimiendo=true;
            var fecha = new Date($scope.fechaTermino).toLocaleDateString("es-ES");

            var doc = new jsPDF('p', 'pt');
            
            var imageHeader = logoINEELrepot_;
            
            doc.addImage(imageHeader, 'JPGE', 20, 20, 150, 77);

            doc.setFontSize(12);
            doc.setFontType("bold");
            doc.text('Movimientos de personal de investigación y administrativo', 180, 60);
            doc.setFontSize(8);
            doc.setFontType("bold");
            doc.text('Informaci\u00F3n al ' + fecha, 420, 80);

            var res = doc.autoTableHtmlToJson(document.getElementById("tablaMovimientosPersonal"));
            
            doc.autoTable(res.columns, res.data, {
                startY: 130,
                styles: { cellPadding: 2, overflow: 'linebreak' },
                headerStyles: { rowHeight: 15, fontSize: 8 },
                bodyStyles: { rowHeight: 12, fontSize: 8, valign: 'top', halign: 'left' },
                columnStyles: {
                    0: { columnWidth: 140 }
                }
            });


            doc.save('MovimientosPersonal.pdf');
            $scope.imprimiendo=false;
        };
    }

})();