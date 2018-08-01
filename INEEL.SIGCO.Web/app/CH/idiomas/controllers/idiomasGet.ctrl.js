(function () {
    "use strict";

    angular
        .module("ineelCH")
        .controller("idiomasGetCtrl", ["AuthService", "$scope", "IdiomasService", "$uibModal", "DTOptionsBuilder","$rootScope","$state", idiomasGetCtrl]);

    function idiomasGetCtrl(AuthService, $scope, IdiomasService, $uibModal, DTOptionsBuilder, $rootScope, $state) {
        jQuery.fn.DataTable.ext.type.search.string = function (data) { return !data ? '' : typeof data === 'string' ? data.replace(/έ/g, 'ε').replace(/ύ/g, 'υ').replace(/ό/g, 'ο').replace(/ώ/g, 'ω').replace(/ά/g, 'α').replace(/ί/g, 'ι').replace(/ή/g, 'η').replace(/\n/g, ' ').replace(/[áÁ]/g, 'a').replace(/[éÉ]/g, 'e').replace(/[íÍ]/g, 'i').replace(/[óÓ]/g, 'o').replace(/[úÚ]/g, 'u').replace(/ê/g, 'e').replace(/î/g, 'i').replace(/ô/g, 'o').replace(/è/g, 'e').replace(/ï/g, 'i').replace(/ü/g, 'u').replace(/ã/g, 'a').replace(/õ/g, 'o').replace(/ç/g, 'c').replace(/ì/g, 'i') : data; };
        $rootScope.setVariable("CHficha", "fichapersonal.idiomas");
        $scope.authentication = AuthService.authentication;

        //paginado, filtros y demas cosas de un estado del Datatable
        $scope.paramsDT = JSON.parse(localStorage.getItem('CHIdiomasGet' + window.location.pathname)); //Recuperamos los parametros de filtrado en el DT
        if ($scope.paramsDT == null) {
            $scope.paramsDT = {};  //Puede que sean nulos, en dado caso se mostrara la pagina 1
            $scope.paramsDT.displayStart = 0;
        }


        $scope.dtOptions = DTOptionsBuilder.newOptions()
            .withOption('stateSaveCallback', stateSaveCallback)
            .withOption('stateLoadCallback', stateLoadCallback)
            .withOption('displayStart', $scope.paramsDT.displayStart);

        function stateSaveCallback(settings, data) {
            var stado = $('#CHIdiomasGet').DataTable().state();
            localStorage.setItem('CHIdiomasGet' + window.location.pathname, JSON.stringify(stado))
        }

        function stateLoadCallback(settings) {
            if ($scope.paramsDT != null) {
                return $scope.paramsDT;
            } else {
                return JSON.parse(localStorage.getItem('CHIdiomasGet' + window.location.pathname))
            }

        }


        //Gestion de ficha
        $scope.idGF = $rootScope.GestionFichasClave;
        $scope.editarGestion = 0;
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
        IdiomasService.getbyclave($scope.numEmp).then(
            function (result) {
                $scope.idiomas = result.data;
            },
            function (err) {
                toastr.error("No se han podido cargar los registros de idiomas.");
            }
        );
        $scope.delete = function (idioma, $uibModalInstance) {
                IdiomasService.delete(idioma.idiomasId).then(
                    function (result) {
                        var idx = ($scope.idiomas.indexOf(idioma));
                        $scope.idiomas.splice(idx, 1);
                        toastr.success(result.data);
                        $uibModalInstance.dismiss('close');
                    },
                    function (err) {
                        toastr.error(err.data.message);
                        $uibModalInstance.dismiss('close');

                    });
        };
        $scope.open = function(idioma){
             $scope.descripcionRow = idioma.idioma.descripcion;
            var modalInstance = $uibModal.open({
                templateUrl: 'app/vistasGenericas/eliminacionFisica.html',
                   controller: function ( $uibModalInstance) {
                      
                       $scope.ok = function () {
                        $scope.delete(idioma,$uibModalInstance);
                       };

                       $scope.cancel = function () {
                           $uibModalInstance.dismiss('cancel');
                       };
                   },
                   scope: $scope  
            });
        };

        $scope.navegador = function () {
            $state.go("idiomasedit");
        };
    }

})();