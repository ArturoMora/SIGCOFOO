(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("prospectosGetCtrl", [
            "$scope",
            "ClientesCRService",
            "$timeout",
            "DTOptionsBuilder",
            prospectosGetCtrl
        ]);

    function prospectosGetCtrl($scope, ClientesCRService, $timeout, DTOptionsBuilder) {
        $scope.iniciativas = {};
        $scope.oportunidades = {};
        $scope.opcion = 1;

        $scope.dtOptions = DTOptionsBuilder
                    .newOptions()
                    .withOption('responsive', true);

        $scope.obteneraniosiniciativas = function () {
            ClientesCRService.getaniosdeiniciativas().then(
                function (response) {
                    if (typeof response.data !== 'undefined' && response.data != null) {
                        $scope.aniosiniciativas = response.data;
                        $scope.aniosiniciativasselected = $scope.aniosiniciativas[0];
                        $scope.obtenerinformacion($scope.opcion);
                    }
                },
                function (error) {
                    toastr.error(error.data.messageDetail);
                }
            );
        };

        $scope.obteneranioson = function () {
            ClientesCRService.getaniosdeon().then(
                function (response) {
                    if (typeof response.data !== 'undefined' && response.data != null) {
                        $scope.anioson = response.data;
                        $scope.aniosonselected = $scope.anioson[0];
                    }
                },
                function (error) {
                    toastr.error(error.data.messageDetail);
                }
            );
        };


        $scope.obtenerinformacion = function (opcion) {
            $scope.opcion = opcion;
            switch (opcion) {
                case 1:
                    $scope.obteneriniciativas();
                    break;
                case 2:
                    $scope.obteneron();
                    break;
                default:
                    $scope.obteneriniciativas();
            }
        }

        $scope.obteneriniciativas = function () {

            ClientesCRService.getprospectosiniciativas().then(
                function (response) {
                    if (typeof response.data !== 'undefined' && response.data != null) {
                        $scope.iniciativas = response.data;

                    }
                },
                function (error) {
                    toastr.error(error.data.messageDetail);
                }
            );
        };

        $scope.obteneron = function () {

            ClientesCRService.getprospectoson().then(
                function (response) {
                    if (typeof response.data !== 'undefined' && response.data != null) {
                        $scope.oportunidades = response.data;
                        //MenuService.setVariable("proyectosvigentes",$scope.proyectos);
                    }
                },
                function (error) {
                    toastr.error(error.data.messageDetail);
                }
            );
        };

        $scope.generarpdfiniciativas = function () {
            $scope.iniciativaspdf = $scope.iniciativas;
            $timeout(generarPDFIniciativas, 100);
        }

        $scope.generarpdfon = function () {
            $scope.oportunidadespdf = $scope.oportunidades;
            $timeout(generarPDFON, 100);
        }

        var generarPDFIniciativas = function () {
            var fecha = new Date();
            var doc = new jsPDF('l', 'pt');
            var imageHeader = logoINEELrepot_;

            var totalPagesExp = "{total_pages_count_string}";
            var header = function (data) {
                doc.addImage(imageHeader, 'JPGE', 33, 5, 100, 51);
                doc.setFontSize(12);
                doc.text("Prospectos con Iniciativas", 300, 40);
                doc.text('Informaci\u00F3n al ' + (fecha.getDate()) + "/" + (fecha.getMonth() + 1) + "/" + (fecha.getFullYear()), 670, 40);
            };
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
                margin: { top: 50 },
                styles: { cellPadding: 2, overflow: 'linebreak' },
                headerStyles: {
                    fontSize: 10, halign: 'left', valign: 'middle',
                    textColor: 255, fillColor: [115, 135, 156], fontStyle: 'bold'
                },
                bodyStyles: { fontSize: 9, valign: 'middle', halign: 'left' },
                columnStyles: {
                    3: { halign: 'right' }
                }
            };

            var res = doc.autoTableHtmlToJson(document.getElementById("iniciativas"));
            doc.autoTable(res.columns, res.data, options);
            // Total page number plugin only available in jspdf v1.0+
            if (typeof doc.putTotalPages === 'function') {
                doc.putTotalPages(totalPagesExp);
            }

            doc.save("Iniciativas.pdf");
            $timeout(function () { $scope.iniciativaspdf = null; }, 100);
        };

        var generarPDFON = function () {
            var doc = new jsPDF('l', 'pt');
            var fecha = new Date();
            //var imageHeader = 'data:image/jpeg;base64,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';
            var imageHeader = logoINEELrepot_;

            var totalPagesExp = "{total_pages_count_string}";
            var header = function (data) {
                doc.setFontSize(12);
                doc.text("Prospectos con Oportunidades de Negocio", 380, 40);
                doc.addImage(imageHeader, 'JPGE', 33, 5, 100, 51);
                doc.text('Informaci\u00F3n al ' + (fecha.getDate()) + "/" + (fecha.getMonth() + 1) + "/" + (fecha.getFullYear()), 670, 40);
            };
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
                margin: { top: 50 },
                styles: { cellPadding: 2, overflow: 'linebreak' },
                headerStyles: {
                    fontSize: 10, halign: 'left', valign: 'middle',
                    textColor: 255, fillColor: [115, 135, 156], fontStyle: 'bold'
                },
                bodyStyles: { fontSize: 9, valign: 'middle', halign: 'left' }
            };

            var res = doc.autoTableHtmlToJson(document.getElementById("oportunidades"));
            doc.autoTable(res.columns, res.data, options);
            // Total page number plugin only available in jspdf v1.0+
            if (typeof doc.putTotalPages === 'function') {
                doc.putTotalPages(totalPagesExp);
            }

            doc.save("Oportunidades.pdf");
            $timeout(function () { $scope.oportunidadespdf = null; }, 100);
        };

        $scope.obtenerinformacion($scope.opcion);

    }
})();