(function () {
    'use strict';
    angular
        .module("ineelGI")
        .controller('ideaInnovadoraAdd', ['$scope', 'AuthService', 'MenuService', 'comunCountService',
            'ngFabForm', 'IdeainnovadoraService', '$state', '$uibModal', 'adjuntarArchivo', IdeaInnovadoraAdd]);

    function IdeaInnovadoraAdd($scope, AuthService, MenuService, comunCountService,
        ngFabForm, IdeainnovadoraService, $state, $uibModal, adjuntarArchivo) {
        $scope.authentication = AuthService.authentication;
        $scope.ClavePersonaLogin = AuthService.authentication.userprofile.clavePersona;
        $scope.registro = {};
        $scope.comunidad = {};

       
         
        //Obtener grado proponente
        IdeainnovadoraService.getAllContribucion().then(
            function (result) {
                $scope.contribucion = result.data;

                $scope.proponente = {
                    clavePersona: $scope.ClavePersonaLogin,
                    contribucion: {
                        id: 0,
                        contribucion: "Principal"
                    },
                    nombrePersona: AuthService.authentication.userprofile.nombreCompleto
                };
                $scope.add_proponente();
            },
            function (err) {
                toastr.error(err);
            });
        
        
        $scope.getFileDetails = function (adjunto) {
            adjuntarArchivo.uploadOneFile(adjunto, 'pdf;doc;docx', '12').then(
                function (result) {
                    var Adjunto = { RutaCompleta: result.fullPathFile, nombre: result.nameFile, ModuloId: 'GI' };
                    $scope.registro.Adjunto = Adjunto;
                    $scope.ValidForm.$setDirty();
                },
                function (error) {
                    $(":file").filestyle('clear');
                }
            );
        }
        //Buscar proponente
        $scope.proponentes = [];
        $scope.proponente = {};
        $scope.auxColabora = [];
        $scope.PersonaSeleccionada = {};
        $scope.openUser = function () {
            $scope.empleado = {};
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/PersonasFilterGet.html',
                controller: 'PersonasFilterGetCtrl',
                resolve: {
                    empleado: function () {
                        return $scope.empleado;
                    }
                },
                scope: $scope
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.PersonaSeleccionada = selectedItem;
                $scope.proponente.clavePersona = $scope.PersonaSeleccionada.clavePersona;
                $scope.proponente.nombrePersona = $scope.PersonaSeleccionada.nombreCompleto;
                $scope.userAdd = true;
                $scope.ValidForm.$setDirty();
            });
        }
        //Agregar proponente 
        $scope.add_proponente = function () {
            
            if ($scope.proponente.contribucion != undefined) {
                var Registro = {
                    "clavePersona": $scope.proponente.clavePersona,
                    "contribucionProponenteId": $scope.proponente.contribucion.id,
                    "contribucionDescripcion":$scope.proponente.contribucion.contribucion,
                    "nombreCompleto": $scope.proponente.nombrePersona
                }
                $scope.userAdd = false;
                for (var i = 0; i < $scope.proponentes.length; i++) {
                    if ($scope.proponentes[i].clavePersona == Registro.clavePersona) {
                        toastr.error("El autor " + Registro.nombreCompleto + " ya existe dentro de la tabla de proponentes!");
                        $scope.PersonaSeleccionada.clavePersona = null;
                        $scope.proponente = {};
                        return false;
                    }
                }
                $scope.PersonaSeleccionada = null;
                $scope.proponentes.push(Registro);
                for (var i = $scope.contribucion.length - 1; i >= 0; i--) {
                    
                    if (($scope.contribucion[i].id == $scope.proponente.contribucion.id) && ($scope.proponente.contribucion.id == 0)) {
                        $scope.auxColabora.push($scope.contribucion[i]);
                        $scope.contribucion.splice(i, 1);
                    }
                }
                {
                    $scope.proponente.clavePersona = undefined
                    $scope.proponente.contribucion = undefined
                    $scope.proponente.nombrePersona = undefined
                }
            } else {
                toastr.error("Agregar contribución al proponente");
            }

        }
        //Eliminar proponente
        $scope.eliminarProponente = function (registro) {
            for (var i = 0; i < $scope.auxColabora.length; i++) {
                if ($scope.auxColabora[i].id == registro.contribucionProponenteId) {
                    $scope.contribucion.push($scope.auxColabora[i]);
                }
            }
            var idx = ($scope.proponentes.indexOf(registro));
            $scope.proponentes.splice(idx, 1);
            $scope.auxColabora.splice(idx, 1);
        };
        //Agregar
        $scope.agregar = function () {
            $scope.registro.clavePersona = $scope.ClavePersonaLogin;
            $scope.registro.estadoFlujoId = 1;
            $scope.registro.tipoAcceso = 2;//1:public o 2:privado
            $scope.registro.comunidad = null;
            var reg={
                'IdeaInnovadora': $scope.registro,
                'ListaAutores': $scope.proponentes
            }
            IdeainnovadoraService.add(reg).then(
                   function (result) {
                       toastr.success(result.data);
                       $state.go("ideaInnovadora");
                   },
                   function (err) {
                       console.error(err);
                       $scope.desabilitar = false;
                   });
        }

        $scope.$watch("registro.comunidad", function (newValue, oldValue) {
            
            //if (newValue === oldValue) {
            //    return;
            //}
            try{
                $scope.registro.comunidadPracticaId = $scope.registro.comunidad.comunidadId;
            }catch(err){}
        });       
    }
}());