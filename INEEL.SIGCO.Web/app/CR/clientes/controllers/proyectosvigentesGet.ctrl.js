(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("proyectosvigentesGetCtrl", [
            "$scope",
            "MenuService",
            "ClientesCRService",
            "$timeout",
            "$state",
            "$uibModal",
            "DTColumnDefBuilder",
            "DTOptionsBuilder",
            proyectosvigentesGetCtrl
        ]);

    function proyectosvigentesGetCtrl($scope, MenuService, ClientesCRService, $timeout, $state, $uibModal,DTColumnDefBuilder, DTOptionsBuilder) {
        // $scope.muestraBoton = false;
        $scope.proyectos = {};
        $scope.busqueda = false;
        $scope.limpia = false;
        $scope.cte = {};

        //Importante
        //Las siguientes lineas permiten que el filtrado default de un datatable funcione, ya que durante todo el desarrollo del sigco no funcionaban (hasta ahora \(*u*)/ ) <== nel ya no
        //El filtrado no funciona cuando dentro de un <td> hay elementos html, como  lo son <a></a> , <div></div>, etc
        $scope.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef([0]).withOption('type', 'string') //definimos el tipo de datos de cada columna 
            
        ];
        

        //Combo box de empresas relacionadas
        ClientesCRService.GetEmpresasRelacionadas().then(function (res) {
            $scope.empresas = res.data;
        }, function (err) {
            toastr.error("Error al cargar los datos de empresas");
            console.log(err);
        });

        $scope.buscar = function () {
            ClientesCRService.GetConsultaParametrizadaClientes($scope.cte).then(
                function (response) {
                    $scope.proyectos = response.data;
                    $scope.busqueda = true;
                },
                function (error) {
                    toastr.error(error.data.messageDetail);
                }
            );
        };

        $scope.openProyecto = function () {
            $scope.modulo="CR";  //Importante: en el back hay una condicion para filtrar los proyectos de acuerdo a las necesidades del modulo de CR, sino se define este atributo no hay problema, solo no se tendra un resultado deseado
            $scope.proyectoSelect = {};
            $scope.subprogramasProyecto="61,63,64,65,67,68";  //Esta propiedad la recibe el modal de busqueda de proyectos, para asi filtrarlos por los subprogramas indicados
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/buscarProyecto.html',
                controller: 'ProyectosFilterSubprogramaCtrl as showCase',
                scope: $scope
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.cte.proyectoNombre = selectedItem.nombre;
                $scope.cte.proyectoId = selectedItem.proyectoId;
            });
        }

        $scope.openClientes = function () {
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/buscarClientesGEN/buscarClientesGEN.html',
                controller: 'BuscarClientesGENCtrl',
                scope: $scope
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.cte.nombreCliente = selectedItem.claveUnidadEmpresa!=null? selectedItem.nombreUnidadEmpresa : selectedItem.nombreEmpresa ;
                selectedItem.esEmpresa==true?  $scope.cte.empresaId=selectedItem.idEmpresa : $scope.cte.claveUnidadEmpresa= selectedItem.claveUnidadEmpresa;
                // $scope.cte.idEmpresa = selectedItem.idEmpresa!=null? selectedItem.idEmpresa : null;
                // $scope.cte.claveUnidadEmpresa = selectedItem.claveUnidadEmpresa!=null? selectedItem.claveUnidadEmpresa : null;
            });
        }

        //Se recuperan los datos de la previa busqueda ingresada por el usuario
        $scope.cte = MenuService.getVariable('busquedaClientes');
        // var origenClientes = MenuService.getVariable('origenClientes');

        // if (origenClientes != null || $scope.cte!=null) {
        //     $scope.muestraBoton = true;
        //     MenuService.deleteVariable('origenClientes');
        // }
        if ($scope.cte == null) {
            $scope.cte = {};
            $scope.paramsDT = {};
            $scope.paramsDT.displayStart = 0;
        } else {
            $scope.paramsDT = JSON.parse(localStorage.getItem('CRproyectosvigentes' + window.location.pathname)); //Recuperamos los parametros de filtrado en el DT
            if ($scope.paramsDT == null) {
                $scope.paramsDT = {};  //Puede que sean nulos, en dado caso se mostrara la pagina 1
                $scope.paramsDT.displayStart = 0;
            }
            $scope.buscar();
            MenuService.deleteVariable('busquedaClientes');
        }

        

        $scope.reset = function () {
            $scope.busqueda = false;
            $scope.limpia = true;
            $scope.unidadOselect = null;
            $scope.cte = {};
        };

        //para recuperar el paginado y x cosas del datatable
        $scope.dtOptions = DTOptionsBuilder.newOptions()
            .withOption('stateSaveCallback', stateSaveCallback)
            .withOption('stateLoadCallback', stateLoadCallback)
            .withOption('displayStart', $scope.paramsDT.displayStart)
            .withOption('order', [0,1, 'desc']);

        function stateSaveCallback(settings, data) {
            var stado = $('#CRproyectosvigentes').DataTable().state();
            localStorage.setItem('CRproyectosvigentes' + window.location.pathname, JSON.stringify(stado))
        }

        function stateLoadCallback(settings) {
            if ($scope.paramsDT != null && $scope.limpia) {
                $scope.paramsDT = {};
                $scope.paramsDT.displayStart = 0;
                $scope.limpia = false;
                return $scope.paramsDT;
            }
            if ($scope.paramsDT != null) {
                return $scope.paramsDT;
            } else {
                return JSON.parse(localStorage.getItem('CRproyectosvigentes' + window.location.pathname))
            }

        }

        $scope.generarPDF = function () {
            $scope.proyectospdf = $scope.proyectos;
            $timeout(creardocumentoPDF, 100);
        };

        var creardocumentoPDF = function () {
            var fecha = new Date();
            var doc = new jsPDF('l', 'pt');
            var imageHeader = logoINEELrepot_;
            var textoReporte = "Clientes con proyectos vigentes / no vigentes";

            if ($scope.cte.programasActivos ==1) {
                textoReporte = "Clientes con proyectos vigentes";
            }
            if ($scope.cte.programasActivos ==2) {
                textoReporte = "Clientes con proyectos no vigentes";
            }

            var totalPagesExp = "{total_pages_count_string}";
            var header = function (data) {
                doc.addImage(imageHeader, 'JPGE', 33, 5, 100, 51);
                doc.setFontSize(12);
                doc.text(textoReporte, 300, 40);
                doc.text('Información al ' + (fecha.getDate())+"/"+(fecha.getMonth()+1)+"/"+(fecha.getFullYear()), 670, 40);
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
                    fontSize: 10, halign: 'center', valign: 'middle',
                    textColor: 255, fillColor: [115, 135, 156], fontStyle: 'bold'
                },
                bodyStyles: { fontSize: 9, valign: 'middle', halign: 'left' }
            };

            // doc.setFontSize(12);
            // doc.text("Clientes con proyectos vigentes", 40, 40);
            var res = doc.autoTableHtmlToJson(document.getElementById("proyectosvigentes"));
            doc.autoTable(res.columns, res.data, options);
            // Total page number plugin only available in jspdf v1.0+
            if (typeof doc.putTotalPages === 'function') {
                doc.putTotalPages(totalPagesExp);
            }

            doc.save("RelacionClientesProyectos.pdf");
            $timeout(function () { $scope.proyectospdf = null; }, 100);

        };


        
        //La funcion removeAccents esta de manera global en el archivo globalINEEL.js
        var searchType = jQuery.fn.DataTable.ext.type.search;

        searchType.string = function (data) {
            return !data ?
                '' :
                typeof data === 'string' ?
                    removeAccents(data) :
                    data;
        };

        searchType.html = function (data) {
            return !data ?
                '' :
                typeof data === 'string' ?
                    removeAccents(data.replace(/<.*?>/g, '')) :
                    data;
        };

    }


})();