(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("BecarioExternoGetCtrl", ["AuthService", "DTOptionsBuilder", "$scope", "MenuService", "$rootScope", "BecarioExternoServiceCH", "$uibModal", "$state", BecarioExternoGetCtrl]);
    function BecarioExternoGetCtrl(AuthService, DTOptionsBuilder, $scope, MenuService, $rootScope, BecarioExternoServiceCH, $uibModal, $state) {

        jQuery.fn.DataTable.ext.type.search.string = function (data) { return !data ? '' : typeof data === 'string' ? data.replace(/έ/g, 'ε').replace(/ύ/g, 'υ').replace(/ό/g, 'ο').replace(/ώ/g, 'ω').replace(/ά/g, 'α').replace(/ί/g, 'ι').replace(/ή/g, 'η').replace(/\n/g, ' ').replace(/[áÁ]/g, 'a').replace(/[éÉ]/g, 'e').replace(/[íÍ]/g, 'i').replace(/[óÓ]/g, 'o').replace(/[úÚ]/g, 'u').replace(/ê/g, 'e').replace(/î/g, 'i').replace(/ô/g, 'o').replace(/è/g, 'e').replace(/ï/g, 'i').replace(/ü/g, 'u').replace(/ã/g, 'a').replace(/õ/g, 'o').replace(/ç/g, 'c').replace(/ì/g, 'i') : data; };

        $rootScope.setVariable("CHficha", "fichapersonal.becarioexterno");
        
        $scope.loading = true;
        $scope.editarGestion = 0;
        $scope.authentication = AuthService.authentication;

        //Seccion de guardado/recuperado de state de Datatable
        $scope.paramsDT = JSON.parse(localStorage.getItem('tableBecarioExterno' + window.location.pathname)); //Recuperamos los parametros de filtrado en el DT
        if ($scope.paramsDT == null) {
            $scope.paramsDT = {};  //Puede que sean nulos, en dado caso se mostrara la pagina 1
            $scope.paramsDT.displayStart = 0;
        }

        $scope.dtOptions = DTOptionsBuilder.newOptions()
            .withOption('stateSaveCallback', stateSaveCallback)
            .withOption('stateLoadCallback', stateLoadCallback)
            .withOption('displayStart', $scope.paramsDT.displayStart);


        function stateSaveCallback(settings, data) {
            var stado = $('#tableBecarioExterno').DataTable().state();
            localStorage.setItem('tableBecarioExterno' + window.location.pathname, JSON.stringify(stado))
        }

        function stateLoadCallback(settings) {
            if ($scope.paramsDT != null) {
                return $scope.paramsDT;
            } else {
                return JSON.parse(localStorage.getItem('tableBecarioExterno' + window.location.pathname))
            }

        }


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
            $rootScope.idG = id;
        }
        var controlModulo = window.location.pathname;

        
        //  BecarioExternoServiceCH.getByClave($scope.numEmp).then(
        var empleado=MenuService.getVariable('gestionFichaPersonal');
        $scope.cargaRegistrosBecarios=function(){
            
            if(empleado!=null){
                $scope.numeroEmpleado=empleado.numeroEmpleado;
            }else{
                $scope.numeroEmpleado= AuthService.authentication.userprofile.clavePersona;
            }
            BecarioExternoServiceCH.GetEstanciasDeInvestigadoresEnInstituto($scope.numeroEmpleado).then(
                function (result) {
                    $scope.becarios = result.data;
                    $scope.loading = false;
    
                },
                function (err) {
                    toastr.error("No se han podido cargar los registros de becario externo.");
                }
            );
        }

        $scope.cargaRegistrosBecarios();
        

        
    }
})();