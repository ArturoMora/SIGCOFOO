//dependencia: globalINEEL.js <- uploadFileACH
; (function () {
    "use strict";

    angular
        .module("ineel.services")
        .controller("PropuestasFilterGetController", ['globalGet','$http','$scope', '$uibModalInstance', PropuestasFilterGetController])
        .factory('buscarPropuestaFactory', ['$http', '$q', 'globalGet','$uibModal', buscarPropuestaFactory]);
    function PropuestasFilterGetController(globalGet,$http,$scope, $uibModalInstance) {
        var API = globalGet.get("api");
        var service = {}; 
        $scope.propuestaSelect = {};
        service.GetAllForModal = function () {
            var endPoint = API + "propuestas/GetAllForModal";
            return $http.get(endPoint);
        }
        $scope.propuestas = [];
        service.GetAllForModal().then(
            function (r) { $scope.propuestas = r.data;   },
            function (err) { }
        );
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }
        $scope.ok = function (propuesta) {
            
            $uibModalInstance.close(propuesta);
        }


    }

    function buscarPropuestaFactory($http, $q, globalGet, $uibModal) {
        
        var API = globalGet.get("api");
        var service = {};   
       

        var _buscarPropuesta = function (scope) {
            
            var defered = $q.defer();
            var promise = defered.promise;  
            try {
                
                //$scope.propuesta = {};
                var modalInstance = $uibModal.open({
                    size: 'lg',
                    templateUrl: 'app/vistasGenericas/PropuestasFilterGet.html',
                    controller: 'PropuestasFilterGetController',
                    //resolve: {
                    //    propuesta: function () {
                    //        return $scope.propuesta;
                    //    }
                    //},
                    //scope: $scope,
                });
                modalInstance.result.then(function (selectedItem) {
                    
                    selectedItem.claveEmpPropuesta = $.trim(selectedItem.claveEmpPropuesta);
                    defered.resolve(selectedItem);
                },function(err) { defered.reject(err);}
                );
            }
            catch (error) { defered.reject(error); }; 
            return promise;
        };
        service.buscarPropuesta = _buscarPropuesta;
        
        return service;

    }

})();