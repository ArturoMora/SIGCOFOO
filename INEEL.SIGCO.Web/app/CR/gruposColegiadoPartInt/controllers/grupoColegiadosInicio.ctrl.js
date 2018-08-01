(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("GruposColegiadosInicioCtrl", [
            "AuthService",
            "$scope",
            "DTOptionsBuilder",
            "GruposColegiadoPartIntCRService",
            "PersonasPartIntCRService",
            GruposColegiadosInicioCtrl
        ]);

    function GruposColegiadosInicioCtrl(AuthService, $scope, DTOptionsBuilder, GruposColegiadoPartIntCRService, PersonasPartIntCRService) {
        $scope.authentication = AuthService.authentication;


        $scope.dtOptions = DTOptionsBuilder.newOptions().withDOM('frt');
            

        GruposColegiadoPartIntCRService.getGruposColegiadoPartInt().then(
            function (result) {
                $scope.gruposColegiadoPartInt = result.data;
            },
            function (err) {
                console.error("No se han podido cargar los registros");
            }
        );

        PersonasPartIntCRService.getPersonasPartIntAllFKs().then(
           function (result) {
                            
               $scope.personasPartInt = result.data;

           },
           function (err) {
               console.error("No se han podido cargar los registros");
           }
           );

           
           function removeAccents(data) {
            return data
                .replace(/έ/g, 'ε')
                .replace(/[ύϋΰ]/g, 'υ')
                .replace(/ό/g, 'ο')
                .replace(/ώ/g, 'ω')
                .replace(/ά/g, 'α')
                .replace(/[ίϊΐ]/g, 'ι')
                .replace(/ή/g, 'η')
                .replace(/\n/g, ' ')
                .replace(/á/g, 'a')
                .replace(/é/g, 'e')
                .replace(/í/g, 'i')
                .replace(/ó/g, 'o')
                .replace(/ú/g, 'u')
                .replace(/ê/g, 'e')
                .replace(/î/g, 'i')
                .replace(/ô/g, 'o')
                .replace(/è/g, 'e')
                .replace(/ï/g, 'i')
                .replace(/ü/g, 'u')
                .replace(/ã/g, 'a')
                .replace(/õ/g, 'o')
                .replace(/ç/g, 'c')
                .replace(/ì/g, 'i');
        }


        var searchType = jQuery.fn.DataTable.ext.type.search;

        searchType.string = function (data) {
            return !data ?
                '' :
                typeof data === 'string' ?
                    removeAccents(data) :
                    data;
        };

        searchType.html = function (data) {
            return !data ?
                '' :
                typeof data === 'string' ?
                    removeAccents(data.replace(/<.*?>/g, '')) :
                    data;
        };

    }   
})();