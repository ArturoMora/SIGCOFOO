(function () {
    "use strict";

    angular
        .module("ineel")
        .controller("loginCtrl", ["$scope", "$state", "AuthService", "blockUI", "$timeout", loginCtrl]);

    function loginCtrl($scope, $state, AuthService, blockUI, $timeout) {
        
        $scope.btnClick = false;
        $scope.loginData = {
            userName: "",
            password: ""
        };

        $scope.message = "";

        $scope.login = function () {
            //if ($("#mc-action").val() != "captcha") {
            //    toastr.error("Prueba de dibujo no superada", "anti-bot");
            //    $("#dibujar").addClass("error");
            //    return;
            //} else {                

            //}
            $scope.btnClick = true;
            blockUI.start({message: "Espere..."});
            //blockUI.message('Espere...');
            AuthService.login($scope.loginData).then(
                function (response) {
                    //toastr.success("Bienvenido");
                    //$state.go('homeAuthorize');                    
                    
                        blockUI.stop();
                        $state.go('cargardatos');
                    
                                                              
                },
                function (err) {
                    blockUI.stop();
                    $scope.btnClick = false;
                                       
                    $scope.message = "Problema al autentificar";
                    try {
                        if (err.error != undefined && err.error === "The underlying provider failed on Open.") {
                            $scope.message = "Revise su conexión a intranet institucional";
                        } else {
                            $scope.message = err.error_description || err.error || "Problema al autentificar";
                        }
                    }catch(ex){}
                    toastr.error($scope.message);
                });

        };
    }
} ());