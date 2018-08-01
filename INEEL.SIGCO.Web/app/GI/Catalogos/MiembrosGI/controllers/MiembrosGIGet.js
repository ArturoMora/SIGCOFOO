(function () {
    "use strict";

    angular
        .module("ineel.controllers")
        .controller("MiembrosGIGet", ["AuthService", "$scope", "MenuService", "MiembrosGIService", IdeaInnovadoraGet]);

    function IdeaInnovadoraGet(AuthService, $scope, MenuService, MiembrosGIService) {
        jQuery.fn.DataTable.ext.type.search.string = function (data) { return !data ? '' : typeof data === 'string' ? data.replace(/έ/g, 'ε').replace(/ύ/g, 'υ').replace(/ό/g, 'ο').replace(/ώ/g, 'ω').replace(/ά/g, 'α').replace(/ί/g, 'ι').replace(/ή/g, 'η').replace(/\n/g, ' ').replace(/[áÁ]/g, 'a').replace(/[éÉ]/g, 'e').replace(/[íÍ]/g, 'i').replace(/[óÓ]/g, 'o').replace(/[úÚ]/g, 'u').replace(/ê/g, 'e').replace(/î/g, 'i').replace(/ô/g, 'o').replace(/è/g, 'e').replace(/ï/g, 'i').replace(/ü/g, 'u').replace(/ã/g, 'a').replace(/õ/g, 'o').replace(/ç/g, 'c').replace(/ì/g, 'i') : data; };
        MiembrosGIService.getGrupoEvaluadores().then(
            function (result) {
                $scope.gruposEvaluadores = result.data;
            },
            function (err) {
                toastr.error("No se han podido cargar los registros de grupos evaluadores.");
                console.log(err);
            });


        $scope.obtieneMiembros = function () {
            MenuService.setVariable("idGrupoEvaluador", $scope.grupoId);
            MiembrosGIService.getMiembrosActivosByGrupo($scope.grupoId).then(function (result) {
                $scope.miembros = result.data;
            }, function (err) {
                toastr.error("No se han podido cargar los registros de miembros.");
                console.log(err);
            });    
        }
        
        $scope.inactivaMiembro = function (miembro) {
            miembro.activo = false;
            MiembrosGIService.InactivaMiembro(miembro)
                .then(function (result) {
                        var idx = $scope.miembros.indexOf(miembro);
                        $scope.miembros.splice(idx,1);
                        toastr.success("Registro actualizado exitosamente!");
                    },
                    function(err) {
                        toastr.error("No se ha podido dar de baja al miembro.");
                        console.log(err);
                    });
        }

        $scope.checkID=function() {
            $scope.grupoId = MenuService.getVariable("idGrupoEvaluador");
            if ($scope.grupoId != null) {
                $scope.obtieneMiembros();
            }
            
        }

        $scope.checkID();


    }
})();