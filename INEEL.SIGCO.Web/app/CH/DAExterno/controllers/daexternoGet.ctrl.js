(function () {
    "use strict";

    angular
        .module("ineelCH")
        .controller("daexternoCtrlGet", [
            "AuthService"
            , "$scope"
            , "$rootScope"
            , "DerechosAutorService"
            , "DTOptionsBuilder"
            , "$uibModal"
            , "$state"
            , daexternoCtrlGet]);

    function daexternoCtrlGet(AuthService, $scope, $rootScope, DerechosAutorService, DTOptionsBuilder, $uibModal, $state) {

        jQuery.fn.DataTable.ext.type.search.string = function (data) { return !data ? '' : typeof data === 'string' ? data.replace(/έ/g, 'ε').replace(/ύ/g, 'υ').replace(/ό/g, 'ο').replace(/ώ/g, 'ω').replace(/ά/g, 'α').replace(/ί/g, 'ι').replace(/ή/g, 'η').replace(/\n/g, ' ').replace(/[áÁ]/g, 'a').replace(/[éÉ]/g, 'e').replace(/[íÍ]/g, 'i').replace(/[óÓ]/g, 'o').replace(/[úÚ]/g, 'u').replace(/ê/g, 'e').replace(/î/g, 'i').replace(/ô/g, 'o').replace(/è/g, 'e').replace(/ï/g, 'i').replace(/ü/g, 'u').replace(/ã/g, 'a').replace(/õ/g, 'o').replace(/ç/g, 'c').replace(/ì/g, 'i') : data; };
        $rootScope.setVariable("CHficha", "fichapersonal.daexterno");
        $scope.EmpleadoQueConsulta = $scope.authentication.userprofile.clavePersona;
        //Obtener los servicios de autenticacion
        $scope.authentication = AuthService.authentication;
        $scope.editarGestion = 0;

        //paginado, filtros y demas cosas de un estado del Datatable
        $scope.paramsDT = JSON.parse(localStorage.getItem('CHDAExternoGet' + window.location.pathname)); //Recuperamos los parametros de filtrado en el DT
        if ($scope.paramsDT == null) {
            $scope.paramsDT = {};  //Puede que sean nulos, en dado caso se mostrara la pagina 1
            $scope.paramsDT.displayStart = 0;
        }


        $scope.dtOptions = DTOptionsBuilder.newOptions()
            .withOption('stateSaveCallback', stateSaveCallback)
            .withOption('stateLoadCallback', stateLoadCallback)
            .withOption('displayStart', $scope.paramsDT.displayStart);

        function stateSaveCallback(settings, data) {
            var stado = $('#CHDAExternoGet').DataTable().state();
            localStorage.setItem('CHDAExternoGet' + window.location.pathname, JSON.stringify(stado))
        }

        function stateLoadCallback(settings) {
            if ($scope.paramsDT != null) {
                return $scope.paramsDT;
            } else {
                return JSON.parse(localStorage.getItem('CHDAExternoGet' + window.location.pathname))
            }

        }

        //obtener clave de usuario
        //Gestion de ficha
        $scope.idGF = $rootScope.GestionFichasClave;
        if ($scope.idGF == null) {
            $scope.numEmp = AuthService.authentication.userprofile.clavePersona;
        } else {
            $scope.numEmp = $scope.idGF;
            $scope.editarGestion = 1;
        }
        $rootScope.idG = "";
        $scope.setId = function (id) {
            //alert(id);
            $rootScope.idG = id;
        }
        //Obtener todos los registros del usuario que inicio sesion
        DerechosAutorService.GetByClaveAutorWithCoAutores($scope.numEmp).then(
            function (result) {
                $scope.registros = result.data;
                $scope.loading = false;
            },
            function (err) {
                toastr.error("No se han podido cargar los registros de derechos de autor.");
            }
        );

        //Eliminar registro SNI
        $scope.delete = function (registro) {
            DerechosAutorService.deleteda(registro.derechosAutorId).then(
                function (result) {
                    var idx = ($scope.registros.indexOf(registro));
                    $scope.registros.splice(idx, 1);
                    toastr.success(result.data);
                },
                function (err) {
                    toastr.error(err.data.message);
                    console.log(err);
                });
        };

        $scope.navegador = function () {
            $state.go("daexternoEdit");
        };
    }
})();