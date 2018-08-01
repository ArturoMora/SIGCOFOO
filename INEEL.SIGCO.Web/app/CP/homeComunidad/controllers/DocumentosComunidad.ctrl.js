(function () {
    "use strict";

    angular
        .module("ineelCP")
        .controller("DocumentosComunidadGetCtrl", [
            "AuthService",
            "authInterceptorService",
            "$scope",
            "$state",
            "$stateParams",
            "globalGet",
            "DocumentoCPService",
            "RolesUsuarioCPService",
            "$uibModal",
            DocumentosComunidadGetCtrl
        ]);


    function DocumentosComunidadGetCtrl(AuthService, authInterceptorService, $scope, $state, $stateParams, globalGet, DocumentoCPService, RolesUsuarioCPService, $uibModal) {
        $scope.InformacionMiembro = {};
        $scope.authentication = AuthService.authentication;
        $scope.comunidad_id = $stateParams.id;

        $scope.autor = AuthService.authentication.nombreCompleto;
        $scope.userLogin = AuthService.authentication.userprofile.clavePersona;

        var datosUsuarioComunidad = {
            "id": $scope.comunidad.comunidadId,
            "claveEmpleado": $scope.userLogin
        }


        $scope.agregarDocumento = function () {
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/CP/homeComunidad/documentosModal/documentoAdd.html',
                controller: 'documentoCPAddCtrl',
                scope: $scope
            });
        }

        $scope.cargaDatosUsuario = function () {

            RolesUsuarioCPService.getRolesUsuario(datosUsuarioComunidad).then(
                function (result) {
                    $scope.InformacionMiembro = result.datosMiembro;
                    // $scope.identificaTipo = result;
                    $scope.identificaTipo= $scope.rol; //Esta propiedad viene heredada del homeCP y puede ser accedida desde cualquier seccion de la comunidad

                    if ($scope.identificaTipo.invitado == true) {
                        $scope.documentosInvitadoComunidad();
                    } else {

                        $scope.documentosComunidad();
                    }


                }, function (err) {
                    toastr.error("No se han podido cargar los registros de la comunidad");
                    console.log(err);
                });
        }


        $scope.modificarDocumento = function (id) {
            $scope.idDocumentoActualizar = id;

            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/CP/homeComunidad/documentosModal/documentoEdit.html',
                controller: 'documentoCPEditCtrl',
                scope: $scope
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.documento.push(selectedItem);
            });

        }

        $scope.deleteDocumento = function (obj) {

            DocumentoCPService.delete(obj.documentoId).then(
                function (result) {
                    var idx = ($scope.documentos.indexOf(obj));
                    $scope.documentos.splice(idx, 1);
                    toastr.success("Documento eliminado exitosamente!");
                },
                function (err) {
                    toastr.error("No se han podido eliminar el registro");
                });
        }


        $scope.documentosComunidad = function () {
            DocumentoCPService.getByComunidad2($scope.comunidad.comunidadId).then(
                function (result) {
                    $scope.documentos = result.data;

                },
                function (err) {
                    toastr.error("No se han podido cargar los registros");
                });
        }

        $scope.documentosInvitadoComunidad = function () {
            DocumentoCPService.getByInvitadoComunidad($scope.comunidad.comunidadId).then(
                function (result) {
                    $scope.documentos = result.data;

                },
                function (err) {
                    toastr.error("No se han podido cargar los registros");
                });
        }


        $scope.cargaDatosUsuario();

        //La funcion removeAccents esta accesible de manera global en globalINEEL.js

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