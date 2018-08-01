//dependencia: globalINEEL.js <- uploadFileACH
; (function () {
    "use strict";

    angular
        .module("ineel.services")
        .controller("IdeaFilterGetController", ['globalGet','$http','$scope', '$uibModalInstance','AuthService', IdeaFilterGetController])
        .factory('buscarIdeaFactory', ['$http', '$q', 'globalGet','$uibModal', buscarIdeaFactory]);
    function IdeaFilterGetController(globalGet,$http,$scope, $uibModalInstance, AuthService) {
        var API = globalGet.get("api");
        var service = {}; 
        
        var clave = AuthService.authentication.userprofile.clavePersona;
        service.GetAllForModal = function (id) {
            var endPoint = API + "IdeaInnovadora/GetAllForModal/"+id;
            return $http.get(endPoint);
        }
        $scope.Idea = [];
        service.GetAllForModal(clave).then(
            function (r) { $scope.Idea = r.data;   },
            function (err) { }
        );
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }
        $scope.ok = function (Idea) {
            
            $uibModalInstance.close(Idea);
        }


    }

    function buscarIdeaFactory($http, $q, globalGet, $uibModal) {
        
        var API = globalGet.get("api");
        var service = {};   
       

        var _buscarIdea = function (scope) {
            
            var defered = $q.defer();
            var promise = defered.promise;  
            try {
                
                //$scope.propuesta = {};
                var modalInstance = $uibModal.open({
                    size: 'lg',
                    templateUrl: 'app/vistasGenericas/buscarIdea.html',
                    controller: 'IdeaFilterGetController',           
                });
                modalInstance.result.then(function (selectedItem) {
                    defered.resolve(selectedItem);
                },function(err) { defered.reject(err);}
                );
            }
            catch (error) { defered.reject(error); }; 
            return promise;
        };
        service.buscarIdea = _buscarIdea;
        
        return service;

    }

})();