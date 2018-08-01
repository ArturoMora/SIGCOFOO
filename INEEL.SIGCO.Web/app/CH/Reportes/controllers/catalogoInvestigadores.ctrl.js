function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
};
(function () {
    "use strict";
    angular
        .module("ineelCH")
        .filter('filtraasistentes', function () {
            return function (investigadores) {
                var count = 0;
                for (var i = 0; i < investigadores.length; i++) {
                    if (investigadores[i].persona.clasificacion !== '@') {
                        count++;
                    }
                }
                return count;
            };
        })
        .controller("catalogoInvestigadoresCtrl", [
            "$scope",
            "$state",
            'DTOptionsBuilder',
            'InventarioRH',
            'FechaCHService',
            '$uibModal',
            '$filter',
            'MenuService',
            catalogoInvestigadoresCtrl]);
    function catalogoInvestigadoresCtrl($scope, $state, DTOptionsBuilder, InventarioRH,
        FechaCHService, $uibModal, $filter,
        MenuService) {
        $scope.getRolId = MenuService.getRolId();
        var unidadByUrl = getParameterByName('u'); 
        $scope.unidadByUrl = unidadByUrl;
        //alert(unidadByUrl);
        //control de fecha para reportes  
        $scope.fechach = FechaCHService.fechainventariochget();
        $scope.catInvestigadores = {};
        $scope.unidadOrganizacional = {};
        $scope.uoselecionada = {};
        $scope.investigadores = [];
        $scope.divisiones = [];
        $scope.mensajeresultados = "Filtre para mostrar resultados...";
        $scope.titulo = "Catálogo de investigadores";
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
            .withDOM('lftr<"default"ip><"clear">B')
            .withOption('order', false)
            .withDisplayLength(10);

        $scope.obtenerInformacion = function () {
            var claveUnidad = "";
            if (typeof $scope.uoselecionada === 'undefined' || $scope.uoselecionada.claveUnidad === "") {
                toastr.warning("seleccione una Unidad Organizacional", '', { timeOut: 10000 });
                $scope.error = true;
                return;
            }
            
            //obtener registros
            $scope.catInvestigadores.claveunidad = $scope.uoselecionada.claveUnidad;
            $scope.obtenerInformacionGo($scope.uoselecionada.claveUnidad);
        };

        $scope.obtenerInformacionGo = function (claveUnidad) {
            
            //obtener registros
            $scope.catInvestigadores.claveunidad = claveUnidad;
            $scope.catInvestigadores.fecha = $scope.fechach;
            InventarioRH.getInformacion($scope.catInvestigadores).then(
                function (result) {
                    if (typeof result.data !== undefined && result.data != null && result.data.length > 0) {
                        $scope.investigadores = result.data;
                        console.log($scope.investigadores);
                        $scope.totalinvestigadores = $filter('filtraasistentes')($scope.investigadores);
                    }
                    else {
                        $scope.mensajeresultados = "No se han encontrado resultados";
                        toastr.warning($scope.mensajeresultados, '', { timeOut: 10000 });
                        $scope.investigadores = [];
                    }

                },
                function (err) {
                    toastr.error("No se han podido cargar el catalogo de investigadores.", '', { timeOut: 10000 });
                }
            );

        };


        $scope.cambiafecha = function () {
            var fechaHoy = new Date();

            if ($scope.fechach > fechaHoy) {
                toastr.warning("La fecha no debe se mayor a la actual.", '', { timeOut: 10000 });
                $scope.fechach = new Date();
            } 
            FechaCHService.fechainventariochset($scope.fechach);

            $scope.uoselecionada = {};
            $scope.investigadores = {};
        };

        
        if (unidadByUrl != undefined && unidadByUrl != null) {
            InventarioRH.getUnidadById(unidadByUrl).then(
                function (result) {
                    if (result.data != null) {
                        $scope.uoselecionada = result.data;
                        $scope.obtenerInformacionGo(unidadByUrl);
                    }
                      
                },
                function (error) { }
            );            
        }


        jQuery.fn.DataTable.ext.type.search.string = function (data) {
            
            return !data ?
                '' :
                typeof data === 'string' ?
                    data
                        .replace(/έ/g, 'ε')
                        .replace(/[ύϋΰ]/g, 'υ')
                        .replace(/ό/g, 'ο')
                        .replace(/ώ/g, 'ω')
                        .replace(/ά/g, 'α')
                        .replace(/[ίϊΐ]/g, 'ι')
                        .replace(/ή/g, 'η')
                        .replace(/\n/g, ' ')
                        .replace(/á/g, 'a')
                        .replace(/é/g, 'e')
                        .replace(/í/g, 'i')
                        .replace(/ó/g, 'o')
                        .replace(/ú/g, 'u')
                        .replace(/ê/g, 'e')
                        .replace(/î/g, 'i')
                        .replace(/ô/g, 'o')
                        .replace(/è/g, 'e')
                        .replace(/ï/g, 'i')
                        .replace(/ü/g, 'u')
                        .replace(/ã/g, 'a')
                        .replace(/õ/g, 'o')
                        .replace(/ç/g, 'c')
                        .replace(/ì/g, 'i') :
                    data;
        };

        $scope.reset = function () {
            $scope.fechach = new Date();
            $scope.uoselecionada = {};
            $scope.investigadores = {};
        };

        $scope.exportpdf = function () {
            var imageHeader = logoINEELrepot_;

            var doc = new jsPDF('l', 'pt');

            var header = function (data) {
                doc.setFontSize(20);
                doc.setTextColor(40);
                doc.setFontStyle('normal');
                //doc.addImage(imageHeader, 'JPGE', data.settings.margin.left, 40, 150, 31);
                doc.addImage(imageHeader, 'PNG', data.settings.margin.left - 8, 20, 150, 77);
                doc.text($scope.titulo, data.settings.margin.left + 270, 60);
                doc.setFontSize(12);
                doc.text('Unidad Organizacional: ' + $scope.uoselecionada.nombreUnidad, data.settings.margin.left, 100);
                doc.text('Información a la fecha: ' + ($scope.fechach.getDate()) + "/" + ($scope.fechach.getMonth() + 1) + "/" + $scope.fechach.getFullYear(), data.settings.margin.left + 575, 100);
                doc.setFontSize(8);
                doc.text('*** Director de División / ** Gerente de Unidad / @ Asistente Administrativo', data.settings.margin.left, 110);
            };
            var totalPagesExp = "{total_pages_count_string}";
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
                margin: { top: 105 },
                startY: doc.autoTableEndPosY() + 130,
                styles: { cellPadding: 2, overflow: 'linebreak' },
                headerStyles: {
                    rowHeight: 15, fontSize: 8,
                    textColor: 255, fillColor: [115, 135, 156], fontStyle: 'bold'
                },
                bodyStyles: { rowHeight: 12, fontSize: 8, valign: 'top', halign: 'left' },
                columnStyles: {
                    2: { columnWidth: 100 },
                    3: { columnWidth: 150 },
                    4: { columnWidth: 150, halign: 'left' },
                    7: { halign: 'center' }
                    //4: { halign: 'left' }
                }
            };

            var res = doc.autoTableHtmlToJson(document.getElementById("tab_customers"));
            doc.autoTable(res.columns, res.data, options);
            // Total page number plugin only available in jspdf v1.0+
            if (typeof doc.putTotalPages === 'function') {
                doc.putTotalPages(totalPagesExp);
            }

            doc.save("catalogoInvestigadores.pdf");

        }
    }

})();

