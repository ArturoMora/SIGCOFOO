/*AYUDA:
FooEntitiesService nombre de factory en RolesAdd.service.js
*/

(function () {
    "use strict";


    angular
      .module("ineelGEN")
      .controller("PersonasAddCtrl", ['$scope', 'personasService', 'categoriasService', 'plazaService', 'tipopersonaService', 'ubicacionService', 'unidadService', 'globalGet', '$state', PersonasAddCtrl]);

    function PersonasAddCtrl($scope, personasService, categoriasService, plazaService, tipopersonaService, ubicacionService, unidadService, globalGet, $state) {   
        
        //Variable API
        var API = globalGet.get("api");
       
        categoriasService.getAll().then(
            function (result) {
            $scope.categorias = result.data;
        },
          function (err) {
            console.error(err);
        });

        plazaService.getAll().then(
        function (result) {
            $scope.plaza = result.data;
        },
        function (err) {
            console.error(err);
        });

        tipopersonaService.getAll().then(
        function (result) {
            $scope.tpersona = result.data;
        },
        function (err) {
            console.error(err);
        });

        ubicacionService.getAll().then(
        function (result) {
            $scope.ubicacion = result.data;
        },
        function (err) {
            console.error(err);
        });

        unidadService.getAll().then(
        function (result) {
            $scope.unidad = result.data;
        },
        function (err) {
            console.error(err);
        });
                                 
        $scope.save = function () {
            if ($scope.PersonasForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                                                                    
                var Registro = {
                   
                    "clavePersona": $scope.registro.clavepersona,
                    "ruPersona": $scope.registro.claveunica,
                    "Nombre": $scope.registro.nombre,
                    "apellidoMaterno": $scope.registro.apellidomaterno,
                    "apelidoPaterno": $scope.registro.apellidopaterno,
                    "correo": $scope.registro.correo,
                    "experienciaPrevia": $scope.registro.experienciaprevia,
                    "cveCategoria": $scope.registro.categoriaselect,
                    "tipoPersona": $scope.registro.contratoselect,
                    "claveUnidad": $scope.registro.unidadselect,
                    "idUbicacion": $scope.registro.ubicacionselect,
                    "idPlaza": $scope.registro.plazaselect,
                    "estado": 1
                }                              
                       
                personasService.Add(Registro).then(
                                function (result) {
                                    toastr.success(result.data);
                                    $state.go("personas");
                                },
                                function (err) {
                                    console.error(err);
                                });
            }
        }      
                                 
    }

})();