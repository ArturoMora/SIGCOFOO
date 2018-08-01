(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("gradossniCtrl", [
            "AuthService",
            "$scope","$state",
            'InventarioRH',
            'FechaCHService',
            gradossniCtrl]);
    function gradossniCtrl(AuthService, $scope, $state,InventarioRH, FechaCHService) {
        //$scope.fechach = new Date();
        $scope.fechach = FechaCHService.fechainventariochget();
        var ok = new Date(FechaCHService.fechainventariochget()).toLocaleDateString("en-US");
        ok = ok.split('/').join('-');
        InventarioRH.informaciongradossni(ok).then(
            function (result) {
                $scope.resultados = result.data;
            });

        $scope.cambiafecha = function () {
            if ($scope.fechach === undefined) {
                return false;
            }

            var fecha = new Date($scope.fechach).toLocaleDateString("en-US");
            var fechaaux = new Date($scope.fechach);
            var auxfecha = new Date("01/01/2006");
            var fechaHoy = new Date();
            //ValidarFecha
            debugger;
            if (fechaaux > fechaHoy || fechaaux < auxfecha) {
                toastr.error("La fecha debe estar comprendida dentro del 01/01/2006 al " + fechaHoy.toLocaleDateString("es-ES"), '', { timeOut: 10000 });
                $scope.error = true;
                return false;
            } else {
                $scope.error = false;
            }
            FechaCHService.fechainventariochset($scope.fechach);
            ////////////////
            fecha = fecha.split('/').join('-');
            $state.reload();
            //InventarioRH.informaciongradossni(fecha).then(
            //    function (result) {
            //        $scope.resultados = result.data;
            //    });
        };

        $scope.exportGrafica = function () {
            var fecha = new Date($scope.fechach).toLocaleDateString("es-ES");

            var doc = new jsPDF('p', 'pt');
            //var doc = new jsPDF('l', 'mm');
            debugger;
            var imageHeader = logoINEELrepot_;
            //doc.addImage(imageHeader, 'JPGE', 50, 40, 150, 31);
            doc.addImage(imageHeader, 'JPGE', 50, 20, 150, 77);

            doc.setFontSize(12);
            doc.setFontType("bold");
            doc.text('Grados Académicos y SNI del personal de investigaci\u00F3n', 230, 60);
            doc.setFontSize(8);
            doc.setFontType("bold");
            doc.text('Informaci\u00F3n al ' + fecha, 380, 80);

            var res = doc.autoTableHtmlToJson(document.getElementById("gradoacademico"));
            doc.setFontSize(12);
            doc.text('Distribución de grados académicos por división', 40, 120);
            doc.autoTable(res.columns, res.data, {
                startY: 130,
                styles: { cellPadding: 2, overflow: 'linebreak' },
                headerStyles: { rowHeight: 15, fontSize: 8 },
                bodyStyles: { rowHeight: 12, fontSize: 8, valign: 'top', halign: 'left' },
                columnStyles: {
                    0: { columnWidth: 140 }
                }
            });

            var res = doc.autoTableHtmlToJson(document.getElementById("sni"));
            doc.setFontSize(12);
            doc.text('Investigadores miembros del SNI', 40, doc.autoTableEndPosY() + 50);
            doc.autoTable(res.columns, res.data, {
                startY: doc.autoTableEndPosY() + 60,
                styles: { cellPadding: 2, overflow: 'linebreak' },
                headerStyles: { rowHeight: 15, fontSize: 8 },
                bodyStyles: { rowHeight: 12, fontSize: 8, valign: 'top', halign: 'left' },
                columnStyles: {
                    0: { columnWidth: 140 }
                }
            });

            doc.save('GradosAcademicosySNI.pdf');
        };
    }

})();