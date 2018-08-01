(function () {
    "use strict";

    var app = angular.module("ineelMT")
    .filter("getTipoAcceso", function () {
        return function (input) {
            return input ? 'Público' : 'Privado';
        }
    });

    app.controller("NuevoItfGetCtrl", ["$scope", "$rootScope",
        "$state", "$stateParams", "itfsService", "DTOptionsBuilder", "DTColumnDefBuilder", "AuthService", "$location", "$uibModal", NuevoItfGetCtrl]);
 


    function NuevoItfGetCtrl($scope, $rootScope,
        $state, $stateParams, itfsService, DTOptionsBuilder, DTColumnDefBuilder, AuthService, $location, $uibModal) {

        //jQuery.fn.DataTable.ext.type.search.string = function (data) { return !data ? '' : typeof data === 'string' ? data.replace(/έ/g, 'ε').replace(/ύ/g, 'υ').replace(/ό/g, 'ο').replace(/ώ/g, 'ω').replace(/ά/g, 'α').replace(/ί/g, 'ι').replace(/ή/g, 'η').replace(/\n/g, ' ').replace(/[áÁ]/g, 'a').replace(/[éÉ]/g, 'e').replace(/[íÍ]/g, 'i').replace(/[óÓ]/g, 'o').replace(/[úÚ]/g, 'u').replace(/ê/g, 'e').replace(/î/g, 'i').replace(/ô/g, 'o').replace(/è/g, 'e').replace(/ï/g, 'i').replace(/ü/g, 'u').replace(/ã/g, 'a').replace(/õ/g, 'o').replace(/ç/g, 'c').replace(/ì/g, 'i') : data; };




        $scope.cantidadProyectos = -1;
        toastr.clear();
        $scope.authentication = AuthService.authentication;
        $scope.proyecto = {};
        $scope.registrosProyecto = [];
        $scope.itf = {};
        $scope.itfs = [];
        $scope.loading = true;
        $scope.proyectoSeleccionado = false;


       

        var numJefe = $scope.authentication.userprofile.clavePersona;

        itfsService.getProyectosPropios(numJefe).then(
        function (result) {
            $scope.registrosProyecto = result.data;
            $scope.registrosProyecto.push({ "proyectoId": "mostrar", "nombre": "todos" });
            $scope.loading = false;

            toastr.clear();
            //toastr.options = { positionClass: "toast-top-center" };

        },
        function (err) {
            $scope.loading = false;
           // console.error(err);
        });
        $scope.cargartodos = function () {
            itfsService.getAllByClaveEmpleado(numJefe).then(
                function (result) {
                    console.log(result);
                    if (result.data != null) {
                        $scope.cantidadProyectos = result.data.length;
                        $scope.itfs = result.data;
                    } else {
                        $scope.cantidadProyectos = 0;
                        $scope.itfs = [];
                    }

                },
                function (error) {
                    console.log(error);
                }
             );
        }
        $scope.cargartodos();

        $scope.dtColumnDefs = [

          DTColumnDefBuilder.newColumnDef([0,1,2]).withOption('type', 'string'),

        ];

        $scope.onSelectedProyecto = function (selectedItem) {

           
            if (selectedItem.proyectoId === "mostrar") {
                $scope.cargartodos();
                $scope.proyectoSeleccionado = false;
            } else {
                $scope.proyectoSeleccionado = true;
                //itfsService.CountNumeroProyectoConITF({ "Cadena": selectedItem.proyectoId }).then(
                itfsService.getAllByProyecto(selectedItem.proyectoId).then(
                    function (result) {
                      //  console.log(result);
                        if (result.data != null) {
                            $scope.cantidadProyectos = result.data.length;
                            $scope.itfs = result.data;
                        } else {
                            $scope.cantidadProyectos = 0;
                            $scope.itfs = [];
                        }

                    },
                    function (error) {
                        console.log(error);
                    }
                    );
            }
            //selectedItem.proyectoId;
            //TODO: verificar cuantos itfs tiene asociados
        }
        $scope.agregarConfirmado = function (proyectoId, itf) {
            itfsService.getProyecto(proyectoId).then(
               function (result) {
                   itf.titulo = result.data.nombre;
                   itfsService.create(itf).then(
                        function (result) {
                            toastr.success(proyectoId, "se ha creado el ITF asociado al proyecto ");
                            $location.path('/ITF/' + itf.informeTecnicoFinalId + '/true/' + 1 + '/infoGral');
                        },
                        function (err) {
                            console.error(err);
                            toastr.error("Error en la solicitud", "no es posible crear el Informe Técnico Final con el id: " + $scope.itf.informeTecnicoFinalId);
                        });
               },
               function (err) {
                   console.error(err);
               });
        }
        $scope.agregar = function (proyectoId) {
            try {
                if ($scope.proyecto.selected.proyectoId == 'mostrar') {
                    toastr.info("Seleccione un proyecto");
                    return;
                }
            }catch(e){}
            
            if (!proyectoId) {
                toastr.info("Seleccione un proyecto");
            } else {
                itfsService.CountITFByProyecto(proyectoId).then(
                    function (result) {
                        $scope.cantidadProyectos = result.data;
                        $scope.sendCreate($scope.cantidadProyectos);
                    },
                    function (error) {
                        toastr.error("Error al procesar la solicitud");
                        console.log();
                    }
                );

                $scope.sendCreate = function (cant) {
                    if ($scope.itfs != null && $scope.itfs.length > 0) {
                        for (var i = 0; i < $scope.itfs.length; i++) {
                            
                            if ($scope.itfs[i].estadoITFFlujoId==0) {
                                toastr.info(proyectoId, "Cuenta con un registro en estado de edici&oacute;n del proyecto");
                                return;
                            }
                        }
                    }
                    
                    $scope.itf = {
                        informeTecnicoFinalId: proyectoId + "-" + cant,
                        proyectoId: proyectoId,
                        evaluaciones: [],
                        adjuntoITF: [],
                        estadoITFFlujoId: 0,

                    };
                    $scope.message = "&#191;Desea <strong>Agregar</strong> nuevo Informe T&eacute;cnico Final al proyecto <strong>" + proyectoId + "</strong>?";
                    var modalInstance = $uibModal.open({
                        templateUrl: 'app/vistasGenericas/Confirmacion.html',
                        controller: function ($uibModalInstance) {
                            $scope.ok = function () {
                                $scope.agregarConfirmado(proyectoId, $scope.itf);
                                $uibModalInstance.dismiss('cancel');

                            };
                            $scope.cancel = function () {
                                $uibModalInstance.dismiss('cancel');
                            };
                        },
                        scope: $scope
                    });
                }



            }

        }
        $scope.eliminar = function (informe) {
            $scope.message = "&#191;Desea <strong>eliminar</strong> el Informe T&eacute;cnico Final al proyecto <strong>" + informe.proyectoId + "</strong>?";
            var modalInstance = $uibModal.open({
                templateUrl: 'app/vistasGenericas/Confirmacion.html',
                controller: function ($uibModalInstance) {
                    $scope.ok = function () {
                        $scope.eliminarConfirmado(informe);
                        $uibModalInstance.dismiss('cancel');

                    };
                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                scope: $scope
            });
        }
        $scope.eliminarConfirmado = function (informe) {
            informe.eliminado = true;
            itfsService.delete(informe).then(
                function (result) {
                    toastr.success(result.data);
                    $state.reload();
                },
                function (error) {
                    toastr.error("Error al procesar la solicitud");
                    console.log();
                }
            );

        };


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


        $(document).ready(function () {
            var table = $('#MTnuevoITF').DataTable();
        });



      $scope.paginaOrigen = function(){
          
           $rootScope.origenITFPag = "AddITF";

      }


    }
})();