/*AYUDA:
personasService nombre de factory en empleado.service.js
*/

(function () {
    "use strict";
    angular
        .module("ineel.controllers")
        .controller("PersonasFilterGetCtrl", [
        "$scope",
        "$state",
        "$stateParams",
        "buscarPersonasService",
        "$uibModalInstance",
        "DTOptionsBuilder", PersonasFilterGetCtrl]);

    function PersonasFilterGetCtrl($scope, $state, $stateParams,
        personasService, $uibModalInstance, DTOptionsBuilder) {
        ////Controlador de modal [generico] de busqueda de personas
        ////Controlador de modal [generico] de busqueda de personas
        ////Controlador de modal [generico] de busqueda de personas
        jQuery.fn.DataTable.ext.type.search.string = function (data) { return !data ? '' : typeof data === 'string' ? data.replace(/έ/g, 'ε').replace(/ύ/g, 'υ').replace(/ό/g, 'ο').replace(/ώ/g, 'ω').replace(/ά/g, 'α').replace(/ί/g, 'ι').replace(/ή/g, 'η').replace(/\n/g, ' ').replace(/[áÁ]/g, 'a').replace(/[éÉ]/g, 'e').replace(/[íÍ]/g, 'i').replace(/[óÓ]/g, 'o').replace(/[úÚ]/g, 'u').replace(/ê/g, 'e').replace(/î/g, 'i').replace(/ô/g, 'o').replace(/è/g, 'e').replace(/ï/g, 'i').replace(/ü/g, 'u').replace(/ã/g, 'a').replace(/õ/g, 'o').replace(/ç/g, 'c').replace(/ì/g, 'i') : data; };
        $scope.nuevaBusqueda = false;
        $scope.persona = {};
        $scope.empleado = {};
        $scope.empleados = [];
        $scope.empleadoSelect = {};
        
        $scope.dtOptions = DTOptionsBuilder
            .newOptions()        
        .withOption('bStateSave', false)
        .withOption('language', { sSearch: "Filtrar" })
        .withOption('responsive', true);

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }

        $scope.buscar = function (persona) {
            if($scope.filtraPersonalActivo!=null || $scope.filtraPersonalActivo != undefined){
                if($scope.filtraPersonalActivo){
                    persona.esPersonaActiva=true;
                }
            }
            
            personasService.GetPersonas(persona).then(
                    function (result) {
                        $scope.empleados = result.data;
                        $scope.nuevaBusqueda = false;
                        if ($scope.empleados.length === 0) {
                            toastr.warning("Ning&uacute;n resultado");
                        } else {
                            toastr.success("Seleccione el registro dando click");
                        }
                    },
                    function (err) {
                        $scope.proyectos = [];
                        toastr.error(err.data.message || "Error al procesar su solicitud");
                        
                    }
                )
        }

        $scope.ok = function () {
            $scope.empleado = $scope.empleadoSelect.emp;
            $uibModalInstance.close($scope.empleado);
        }

    }


})();