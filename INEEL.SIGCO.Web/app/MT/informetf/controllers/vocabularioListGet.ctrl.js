(function () {
    "use strict";
    angular
        .module("ineelMT")
        .controller("vocabularioListGetCtrl", [
            "$scope",            
            "$http",            
            "AuthService",
            "globalGet",
            vocabularioListGetCtrl
        ])

    function vocabularioListGetCtrl($scope,
                    $http,                                     
                    AuthService, globalGet
                        ) {
        //alert("start ctrl");
        var API = globalGet.get("api");
        var endPoint = API + "Vocabulario/GetAllLike/"

        var tabla = this;
        tabla.disabled = undefined;
        tabla.searchEnabled = undefined;
        $scope.enable = function () {
            $scope.disabled = false;
        };

        $scope.disable = function () {
            $scope.disabled = true;
        };

        $scope.enableSearch = function () {
            $scope.searchEnabled = true;
            alert("enabed search");
        }
        $scope.enableSearch();


        tabla.enable = function () {
            tabla.disabled = false;
        };

        tabla.disable = function () {
            tabla.disabled = true;
        };

        tabla.elementosSelect = [];
        tabla.address = {};
        tabla.address.selected = undefined;
                        tabla.refreshelementosSelect = function (search) {
                            alert("refreshelementosSelect");
                            if (search != undefined && search.length > 1) {                            
                                //var params = { address: search, sensor: false };
                                tabla.message = "";
                                var getDatos = endPoint + search
                                return $http.get(
                                  getDatos                              
                                ).then(function (response) {
                                    console.log("select2");
                                    console.log(response);
                                    tabla.elementosSelect = response.data;
                                },
                                function () {
                                    console.log('ERROR!!!');
                                }
                                );
                            } else {
                                tabla.elementosSelect = [];
                                tabla.message = "Ingrese por lo menos dos caracteres y seleccione";
                            }
                        };

                       

    }
})();