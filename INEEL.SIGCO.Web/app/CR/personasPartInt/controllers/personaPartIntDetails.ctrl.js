(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("PersonaPartIntDetailsCtrl", [
        "AuthService",
        "$scope",
        "$state",
        "$stateParams",
        "PersonasPartIntCRService",
        PersonaPartIntDetailsCtrl
        ]);

    function PersonaPartIntDetailsCtrl(AuthService, $scope, $state, $stateParams, PersonasPartIntCRService) {

        $scope.personaPartInt_id = $stateParams.id;
        $scope.authentication = AuthService.authentication;
      

        PersonasPartIntCRService.getPersonaPartIntFKById($scope.personaPartInt_id).then(
            function (result) {
                $scope.personasPartInt = result.data;
            },
            function (err) {
                console.error(err);
         });

      
    }
})();



