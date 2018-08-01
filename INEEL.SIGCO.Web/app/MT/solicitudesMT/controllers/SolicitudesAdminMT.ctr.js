(function () {
    "use strict";

    var app = angular.module("ineelMT");

    app.controller("SolicitudesAdminMTCtrl", [
        "SolicitudesMTService",
        "AuthService",
        "$scope", "$rootScope", "DTOptionsBuilder","$filter",
         "$state", SolicitudesAdminMTCtrl]);
    function SolicitudesAdminMTCtrl(
        SolicitudesMTService,
        AuthService,
        $scope, $rootScope, DTOptionsBuilder, $filter,
        $state) {
        MTSolicitudITFGetAdminMT
        $scope.authentication = AuthService.authentication;
        MTSolicitudITFGetAdminMT
        $scope.insumos = 0;
        $scope.itfs = 0;
        $scope.registros = [];
        $scope.setAdmin = function () {
            $rootScope.isAdminMT = true;
        }
        
        SolicitudesMTService.SolicitudRevisionITF_ByAdminMT(
            $scope.authentication.userprofile.clavePersona).then(
            function(result) {
                //$scope.insumos = result.data.insumos;
                //$scope.itfs = result.data.itfs;
                $scope.registros = result.data;
                console.log($scope.registros);
            },
            function (err) {
                try{
                    toastr.error(err.data.exceptionMessage);
                }catch(e){}
                $scope.registros = [];
                console.log(err);
            }
        );
 

       

        $scope.loadInsumos = function () {           
            $state.go('SolicitudesInsumos');
        }

        $scope.paramsDT = JSON.parse(localStorage.getItem('MTSolicitudITFGetAdminMT' + window.location.pathname)); //Recuperamos los parametros de filtrado en el DT
        if ($scope.paramsDT == null) {
            $scope.paramsDT = {};  //Puede que sean nulos, en dado caso se mostrara la pagina 1
            $scope.paramsDT.displayStart = 0;
        }

        //Opciones de inicializacion en las tablas
        $scope.dtOptions = DTOptionsBuilder.newOptions()
            .withOption('stateSaveCallback', stateSaveCallback)
            .withOption('stateLoadCallback', stateLoadCallback)
            .withOption('displayStart', $scope.paramsDT.displayStart);

        //Por cada accion del Datatable se ejecuta este callback
        function stateSaveCallback(settings, data) {
            var stado = $('#MTSolicitudITFGetAdminMT').DataTable().state();
            localStorage.setItem('MTSolicitudITFGetAdminMT' + window.location.pathname, JSON.stringify(stado))
        }

        //En conjunto con el callback anterior se guarda y recupera el state del datatatable
        function stateLoadCallback(settings) {
            if ($scope.paramsDT != null) {
                return $scope.paramsDT;
            } else {
                return JSON.parse(localStorage.getItem('MTSolicitudITFGetAdminMT' + window.location.pathname))
            }

        }

  
        function removeAccents(data) {
            return data
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
                .replace(/ì/g, 'i');
        }


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

        ////////////////vista2:
        //$scope.dtOptions2 = DTOptionsBuilder.newOptions()
        //    .withOption('responsive', true)
        //    .withOption('initComplete',
        //    function () {
        //        this.api().columns().every(function () {
        //            var column = this;
        //            var x = column[0];
        //            var y = x["0"];
        //            if (y == 3) {
        //                var select = $('<select><option value=""></option></select>')
        //                    .appendTo($(column.footer()).empty())
        //                    .on('change', function () {
        //                        var val = $.fn.dataTable.util.escapeRegex(
        //                            $(this).val()
        //                        );

        //                        column
        //                            .search(val ? '^' + val + '$' : '', true, false)
        //                            .draw();
        //                    });

        //                column.data().unique().sort().each(function (d, j) {
        //                    select.append('<option value="' + d + '">' + d + '</option>')
        //                });
        //            }
        //        });
        //    }
        //    );
        //$scope.opc = "Pendientes";
        //$scope.registrosSolicitudes = [];
        //var original = [];
        //SolicitudesMTService.getAllsolicitudesITF().then(
        //    function (result) {
        //         original= result.data;
        //         $scope.registrosSolicitudes = $filter('filter')(original, { estadoFlujoId: 2 });
        //        $scope.loading = false;
        //    },
        //    function (err) {
        //        toastr.error("No se han podido cargar los registros de Solicitudes");
        //    }
        //);

        //$scope.solicitudChange = function (opc) {
        //    switch (opc) {
        //        case "Pendientes":
        //            $scope.registrosSolicitudes = $filter('filter')(original, { estadoFlujoId: 2 });
        //            break;
        //        case "Aceptadas":
        //            $scope.registrosSolicitudes = $filter('filter')(original, { estadoFlujoId: 3 });
        //            break;
        //        case "Rechazadas":
        //            $scope.registrosSolicitudes = $filter('filter')(original, { estadoFlujoId: 1 });
        //            break;
        //        case "Todas":
        //            $scope.registrosSolicitudes = original;
        //            break;
        //    }

        //}
    }
})();