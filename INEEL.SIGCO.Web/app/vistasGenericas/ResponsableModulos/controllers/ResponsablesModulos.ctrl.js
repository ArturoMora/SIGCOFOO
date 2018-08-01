(function () {
    "use strict";

    angular
        .module("ineel.controllers")
        .controller("ResponsablesModulosCtrl", ["AuthService", "$scope", "$rootScope", "$stateParams", "ResponsablesModulosService", "$uibModal", "$state", ResponsablesModulosCtrl]);

    function ResponsablesModulosCtrl(AuthService, $scope, $rootScope, $stateParams, ResponsablesModulosService, $uibModal, $state) {
        jQuery.fn.DataTable.ext.type.search.string = function (data) { return !data ? '' : typeof data === 'string' ? data.replace(/έ/g, 'ε').replace(/ύ/g, 'υ').replace(/ό/g, 'ο').replace(/ώ/g, 'ω').replace(/ά/g, 'α').replace(/ί/g, 'ι').replace(/ή/g, 'η').replace(/\n/g, ' ').replace(/[áÁ]/g, 'a').replace(/[éÉ]/g, 'e').replace(/[íÍ]/g, 'i').replace(/[óÓ]/g, 'o').replace(/[úÚ]/g, 'u').replace(/ê/g, 'e').replace(/î/g, 'i').replace(/ô/g, 'o').replace(/è/g, 'e').replace(/ï/g, 'i').replace(/ü/g, 'u').replace(/ã/g, 'a').replace(/õ/g, 'o').replace(/ç/g, 'c').replace(/ì/g, 'i') : data; };
        //Obtener los servicios de autenticacion
        $scope.authentication = AuthService.authentication;


        //Obtener todos los registros del usuario que inicio sesion
        ResponsablesModulosService.GetByRol().then(
            function (result) {
                $scope.registros = result.data;
                $scope.cont = 0;
                angular.forEach($scope.registros, function (item) {
                    if (item.idRol == 1) {
                        debugger;
                        ResponsablesModulosService.GetByClave(item.clavePersona).then(
                        function (result) {
                            $scope.CveAdminCH = item.clavePersona;
                            $scope.AdminCH = result.data.nombreCompleto;
                            $scope.MailAdminCH = result.data.correo;
                            $scope.ExtAdminCH = result.data.detallePersona.extension;
                        },
                        function (err) {
                            toastr.error("No se han podido cargar los registros.");
                        });
                    }
                    if (item.idRol == 2) {
                        ResponsablesModulosService.GetByClave(item.clavePersona).then(
                        function (result) {
                            $scope.CveAdminMT = item.clavePersona;
                            $scope.AdminMT = result.data.nombreCompleto;
                            $scope.MailAdminMT = result.data.correo;
                            $scope.ExtAdminMT = result.data.detallePersona.extension;
                        },
                        function (err) {
                            toastr.error("No se han podido cargar los registros.");
                        });
                    }
                    if (item.idRol == 15) {
                        ResponsablesModulosService.GetByClave(item.clavePersona).then(
                        function (result) {
                            $scope.CveAdminCR = item.clavePersona;
                            $scope.AdminCR = result.data.nombreCompleto;
                            $scope.MailAdminCR = result.data.correo;
                            $scope.ExtAdminCR = result.data.detallePersona.extension;
                        },
                        function (err) {
                            toastr.error("No se han podido cargar los registros.");
                        });
                    }
                    if (item.idRol == 3) {
                        ResponsablesModulosService.GetByClave(item.clavePersona).then(
                        function (result) {
                            $scope.CveAdminPI = item.clavePersona;
                            $scope.AdminPI = result.data.nombreCompleto;
                            $scope.MailAdminPI = result.data.correo;
                            $scope.ExtAdminPI = result.data.detallePersona.extension;
                        },
                        function (err) {
                            toastr.error("No se han podido cargar los registros.");
                        });
                    }
                    if (item.idRol == 1027) {
                        ResponsablesModulosService.GetByClave(item.clavePersona).then(
                        function (result) {
                            $scope.CveAdminCP = item.clavePersona;
                            $scope.AdminCP = result.data.nombreCompleto;
                            $scope.MailAdminCP = result.data.correo;
                            $scope.ExtAdminCP = result.data.detallePersona.extension;
                        },
                        function (err) {
                            toastr.error("No se han podido cargar los registros.");
                        });
                    }
                    if (item.idRol == 1028) {
                        ResponsablesModulosService.GetByClave(item.clavePersona).then(
                        function (result) {
                            $scope.CveAdminGI = item.clavePersona;
                            $scope.AdminGI = result.data.nombreCompleto;
                            $scope.MailAdminGI = result.data.correo;
                            $scope.ExtAdminGI = result.data.detallePersona.extension;
                        },
                        function (err) {
                            toastr.error("No se han podido cargar los registros.");
                        });
                    }
                });
                $scope.loading = false;
            },
            function (err) {
                toastr.error("No se han podido cargar los registros.");
            });


        $scope.openProfile = function (personaId) {
            debugger;
            $scope.personaIDSearch = personaId;
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: "app/vistasGenericas/_details/personal/PersonalComunProfile.html",
                controller: "PersonaProfileComunCtrl",
                resolve: {
                    datosUsuario: function () {
                    }
                },
                scope: $scope
            });
        }



    }
})();