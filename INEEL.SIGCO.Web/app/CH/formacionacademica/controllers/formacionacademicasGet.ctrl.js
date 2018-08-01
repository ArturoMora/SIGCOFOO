(function () {
    "use strict";

    angular
        .module("ineelCH")
        .controller("formacionacademicaGetCtrl", [
            "AuthService"
            , "$scope", "$rootScope"
            , "FormacionAcademicaService"
            , "$uibModal"
            , "DTOptionsBuilder"
            , "$state"
            , formacionacademicaGetCtrl]);

    function formacionacademicaGetCtrl(AuthService, $scope, $rootScope, FormacionAcademicaService, $uibModal, DTOptionsBuilder, $state) {
        jQuery.fn.DataTable.ext.type.search.string = function (data) { return !data ? '' : typeof data === 'string' ? data.replace(/έ/g, 'ε').replace(/ύ/g, 'υ').replace(/ό/g, 'ο').replace(/ώ/g, 'ω').replace(/ά/g, 'α').replace(/ί/g, 'ι').replace(/ή/g, 'η').replace(/\n/g, ' ').replace(/[áÁ]/g, 'a').replace(/[éÉ]/g, 'e').replace(/[íÍ]/g, 'i').replace(/[óÓ]/g, 'o').replace(/[úÚ]/g, 'u').replace(/ê/g, 'e').replace(/î/g, 'i').replace(/ô/g, 'o').replace(/è/g, 'e').replace(/ï/g, 'i').replace(/ü/g, 'u').replace(/ã/g, 'a').replace(/õ/g, 'o').replace(/ç/g, 'c').replace(/ì/g, 'i') : data; };
        $rootScope.setVariable("CHficha", "fichapersonal.fa");
        $scope.authentication = AuthService.authentication;
        //$scope.numEmp = AuthService.authentication.userprofile.clavePersona;
        //paginado, filtros y demas cosas de un estado del Datatable

        $scope.paramsDT = JSON.parse(localStorage.getItem('CHformacionacademicasGet' + window.location.pathname)); //Recuperamos los parametros de filtrado en el DT
        if ($scope.paramsDT == null) {
            $scope.paramsDT = {};  //Puede que sean nulos, en dado caso se mostrara la pagina 1
            $scope.paramsDT.displayStart = 0;
        }


        $scope.dtOptions = DTOptionsBuilder.newOptions()
            .withOption('stateSaveCallback', stateSaveCallback)
            .withOption('stateLoadCallback', stateLoadCallback)
            .withOption('displayStart', $scope.paramsDT.displayStart);

        function stateSaveCallback(settings, data) {
            var stado = $('#CHformacionacademicasGet').DataTable().state();
            localStorage.setItem('CHformacionacademicasGet' + window.location.pathname, JSON.stringify(stado))
        }

        function stateLoadCallback(settings) {
            if ($scope.paramsDT != null) {
                return $scope.paramsDT;
            } else {
                return JSON.parse(localStorage.getItem('CHformacionacademicasGet' + window.location.pathname))
            }

        }


        $rootScope.idG = "";
        $scope.editarGestion = 0;
        //Gestion de ficha
        $scope.idGF = $rootScope.GestionFichasClave;
        if ($scope.idGF == null) {
            $scope.numEmp = AuthService.authentication.userprofile.clavePersona;
        } else {
            $scope.numEmp = $scope.idGF;
            $scope.editarGestion = 1;
        }
        //$scope.setId = function (id) {
        //    $rootScope.setGlobalID(id);
        //}
        
        FormacionAcademicaService.getbyclave($scope.numEmp).then(            
        function (result) {
            $scope.registrosfa = result.data;
            $scope.loading = false;
        },
        function (err) {
            toastr.error("No se han podido cargar los registros de formación académica.");
        }
        );

        $scope.delete = function (fa,$uibModalInstance) {
            FormacionAcademicaService.delete(fa.formacionAcademicaId).then(
                function (result) {                        
                    var idx = ($scope.registrosfa.indexOf(fa));
                    $scope.registrosfa.splice(idx, 1);
                    toastr.success(result.data);
                    $uibModalInstance.dismiss('close');
                },
                function (err) {
                    toastr.error(err.data.message);
                })
        };

        $scope.open = function(formaciona){
             $scope.descripcionRow = formaciona.gradoAcademico.descripcion;
            var modalInstance = $uibModal.open({
                templateUrl: 'app/vistasGenericas/eliminacionFisica.html',
                   controller: function ( $uibModalInstance) {
                      
                       $scope.ok = function () {
                        $scope.delete(formaciona,$uibModalInstance);
                       };

                       $scope.cancel = function () {
                           $uibModalInstance.dismiss('cancel');
                       };
                   },
                   scope: $scope  
            });
        };

        $scope.navegador = function () {
            $state.go("formacionedit");
        };
    }

})();