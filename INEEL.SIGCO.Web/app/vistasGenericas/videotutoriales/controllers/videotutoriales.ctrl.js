(function () {
    "use strict";

    angular
        .module("ineel.controllers")
        .controller("videotutorialesCtrl", ["AuthService", "$scope", "$rootScope", "$stateParams", "$uibModal", "$sce", "$state", videotutorialesCtrl]);

    function videotutorialesCtrl(AuthService, $scope, $rootScope, $stateParams, $uibModal, $sce, $state) {
        
        //Obtener los servicios de autenticacion
        $scope.authentication = AuthService.authentication;
        $scope.tituloVideo;
        $scope.urlVideo;



        $scope.abrirModal = function(titulo, url)
        {
            // alert("hola");
            if (url=='' || url==null){
                return false;
            }
            $scope.tituloVideo = titulo;
            $scope.urlVideo = $sce.trustAsResourceUrl(url);
            $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/mostrarVideo.html',
                controller: 'ModalInstanceCtrl',
                scope: $scope,
                
            });


           
        }



        var ModalInstanceCtrl = function ($scope, $modalInstance) {
            $scope.cancel = function () {
                $scope.tituloVideo = "";
                $scope.urlVideo = "";
                $modalInstance.dismiss('cancel');
            };


        };


    }
})();