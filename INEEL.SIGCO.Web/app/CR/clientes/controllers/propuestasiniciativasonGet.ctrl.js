(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("propuestasiniciativasonGetCtrl", [
            "$scope",
            "ClientesCRService",
            "$timeout",
            "MenuService",
            "DTColumnDefBuilder",
            "DTOptionsBuilder",
            propuestasiniciativasonGetCtrl
        ]);

    function propuestasiniciativasonGetCtrl($scope, ClientesCRService, $timeout, MenuService, DTColumnDefBuilder, DTOptionsBuilder) {
        jQuery.fn.DataTable.ext.type.search.string = function (data) { return !data ? '' : typeof data === 'string' ? data.replace(/έ/g, 'ε').replace(/ύ/g, 'υ').replace(/ό/g, 'ο').replace(/ώ/g, 'ω').replace(/ά/g, 'α').replace(/ί/g, 'ι').replace(/ή/g, 'η').replace(/\n/g, ' ').replace(/[áÁ]/g, 'a').replace(/[éÉ]/g, 'e').replace(/[íÍ]/g, 'i').replace(/[óÓ]/g, 'o').replace(/[úÚ]/g, 'u').replace(/ê/g, 'e').replace(/î/g, 'i').replace(/ô/g, 'o').replace(/è/g, 'e').replace(/ï/g, 'i').replace(/ü/g, 'u').replace(/ã/g, 'a').replace(/õ/g, 'o').replace(/ç/g, 'c').replace(/ì/g, 'i') : data; };

        $scope.propuestas = {};
        $scope.iniciativas = {};
        $scope.oportunidades = {};
        $scope.opcion = 1;



        $scope.obteneranios = function () {
            ClientesCRService.getaniosdepropuestas().then(
                function (response) {
                    if (typeof response.data !== 'undefined' && response.data != null) {
                        $scope.anios = response.data;
                        $scope.anioselected = $scope.anios[0];
                        $scope.obtenerinformacion($scope.opcion);
                    }
                },
                function (error) {
                    toastr.error(error.data.messageDetail);
                }
            );
        };

        $scope.obteneraniosiniciativas = function () {
            ClientesCRService.getaniosdeiniciativas().then(
                function (response) {
                    if (typeof response.data !== 'undefined' && response.data != null) {
                        $scope.aniosiniciativas = response.data;
                        $scope.aniosiniciativasselected = $scope.aniosiniciativas[0];
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
                    $scope.obtenerpropuestas();
                    break;
                case 2:
                    $scope.obteneriniciativas();
                    break;
                case 3:
                    $scope.obteneron();
                    break;
                default:
                    $scope.obtenerpropuestas();
            }
        }


        $scope.dtOptions = DTOptionsBuilder
            .newOptions()
            .withOption('order', [3, 'asc'])
            .withOption('responsive', true);


        $scope.obtenerpropuestas = function () {
            ClientesCRService.getpropuestas($scope.anioselected).then(
                function (response) {
                    if (typeof response.data !== 'undefined' && response.data != null) {
                        $scope.propuestas = response.data;

                    }
                },
                function (error) {
                    toastr.error(error.data.messageDetail);
                }
            );
        };

        $scope.obteneriniciativas = function () {

            ClientesCRService.getiniciativas($scope.aniosiniciativasselected).then(
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

            ClientesCRService.getoportunidades($scope.aniosonselected).then(
                function (response) {
                    if (typeof response.data !== 'undefined' && response.data != null) {
                        $scope.oportunidades = response.data;
                        
                    }
                },
                function (error) {
                    toastr.error(error.data.messageDetail);
                }
            );
        };


        $scope.generarpdfpropuestas = function () {
            $scope.propuestaspdf = $scope.propuestas;
            $timeout(generarPDFPropuestas, 100);
        }

        $scope.generarpdfiniciativas = function () {
            $scope.iniciativaspdf = $scope.iniciativas;
            $timeout(generarPDFIniciativas, 100);
        }

        $scope.generarpdfon = function () {
            $scope.oportunidadespdf = $scope.oportunidades;
            $timeout(generarPDFON, 100);
        }

        var generarPDFPropuestas = function () {
            var fecha = new Date();
            var doc = new jsPDF('l', 'pt');
            var imageHeader = logoINEELrepot_;

            var totalPagesExp = "{total_pages_count_string}";
            var header = function () {
                //tab,abajo,largo,ancho
                doc.addImage(imageHeader, 'JPGE', 33, 5, 100, 51);
                doc.setFontSize(12);
                doc.text("Propuestas en el instituto", 300, 40);
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
                    2: { halign: 'right' }
                }
            };

            var res = doc.autoTableHtmlToJson(document.getElementById("propuestas"));
            doc.autoTable(res.columns, res.data, options);
            // Total page number plugin only available in jspdf v1.0+
            if (typeof doc.putTotalPages === 'function') {
                doc.putTotalPages(totalPagesExp);
            }

            doc.save("Propuestas.pdf");
            $timeout(function () { $scope.propuestaspdf = null; }, 100);
        };

        var generarPDFIniciativas = function () {
            var fecha = new Date();
            var doc = new jsPDF('l', 'pt');
            var imageHeader = logoINEELrepot_;

            var totalPagesExp = "{total_pages_count_string}";
            var header = function (data) {
                doc.addImage(imageHeader, 'JPGE', 33, 5, 100, 51);
                doc.setFontSize(12);
                doc.text("Clientes con Iniciativas", 300, 40);
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
            var fecha = new Date();
            var doc = new jsPDF('l', 'pt');
            var imageHeader = logoINEELrepot_;

            var totalPagesExp = "{total_pages_count_string}";
            var header = function (data) {
                doc.addImage(imageHeader, 'JPGE', 33, 5, 100, 51);
                doc.setFontSize(12);
                doc.text("Clientes con Oportunidades de Negocio", 300, 40);
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

        $scope.obteneranios();
        $scope.obteneranioson();
        $scope.obteneraniosiniciativas();
    }


})();