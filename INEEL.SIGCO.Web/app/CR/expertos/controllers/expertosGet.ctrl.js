(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("expertosGetCtrl", [
            "$scope",
            "ExpertosCRService",
            "DTOptionsBuilder",
            "MenuService",
            "$state",
            "$uibModal",
            expertosGetCtrl
        ]);

    function expertosGetCtrl($scope, ExpertosCRService, DTOptionsBuilder, MenuService, $state,$uibModal) {
        
        $scope.rolId = MenuService.getRolId();
        $scope.exp = {};
        $scope.busqueda = false;
        $scope.limpia = false;

        //Combo de paises relacionados
        ExpertosCRService.GetPaisesRelacionExpertos().then(function (res) {
            $scope.paises = res.data;
        }, function (err) {
            toastr.error("Error al cargar los datos de paises");
            console.log(err);
        });

        //Combo de empresas relacionadas
        ExpertosCRService.GetEmpresasRelacionExpertos().then(function (res) {
            $scope.empresas = res.data;
        }, function (err) {
            toastr.error("Error al cargar los datos de empresas");
            console.log(err);
        });


        //Combo de comunidades relacionadas
        ExpertosCRService.GetComunidadesRelacionExpertos().then(function (res) {
            $scope.comunidades = res.data;
        }, function (err) {
            toastr.error("Error al cargar los datos de comunidades");
            console.log(err);
        });


        //Combo de comunidades relacionadas
        ExpertosCRService.GetLineasRelacionExpertos().then(function (res) {
            $scope.lineas = res.data;
        }, function (err) {
            toastr.error("Error al cargar los datos de las l&iacute;neas de desarrollo");
            console.log(err);
        });

        $scope.buscar = function () {
            if ($scope.exp.fechaInicioComparacion == null || $scope.exp.fechaInicioComparacion == undefined) {
                $scope.exp.fechaInicioComparacion = new Date(1975, 10, 25);
            }
            if ($scope.exp.fechaFinalComparacion == null || $scope.exp.fechaFinalComparacion == undefined) {
                $scope.exp.fechaFinalComparacion = new Date();
            }
            ExpertosCRService.GetConsultaParametrizadaExpertos($scope.exp).then(function (res) {
                $scope.expertos = res.data;
                $scope.busqueda = true;
            }, function (err) {
                toastr.error("Error al cargar los datos de los expertos");
                console.log(err);
            })
        }


        //Se recuperan los datos de la previa busqueda ingresada por el usuario
        $scope.exp = MenuService.getVariable('busquedaExpertos');
        if ($scope.exp == null) {
            $scope.exp = {};
            $scope.paramsDT = {};
            $scope.paramsDT.displayStart = 0;
        } else {
            $scope.paramsDT = JSON.parse(localStorage.getItem('CRexpertosGet' + window.location.pathname)); //Recuperamos los parametros de filtrado en el DT
            if ($scope.paramsDT == null) {
                $scope.paramsDT = {};  //Puede que sean nulos, en dado caso se mostrara la pagina 1
                $scope.paramsDT.displayStart = 0;
            }
            $scope.buscar();
            MenuService.deleteVariable('busquedaExpertos');
        }

        $scope.editarRegistro = function (id) {
            MenuService.setVariable('busquedaExpertos', $scope.exp);
            $state.go('expertosedit', { id: id });
        }

        $scope.detalleRegistro = function (id) {
            MenuService.setVariable('busquedaExpertos', $scope.exp);
            $state.go('expertosdetails', { id: id });

        }

        $scope.dtOptions = DTOptionsBuilder.newOptions()
            .withOption('stateSaveCallback', stateSaveCallback)
            .withOption('stateLoadCallback', stateLoadCallback)
            .withOption('displayStart', $scope.paramsDT.displayStart)

        function stateSaveCallback(settings, data) {
            var stado = $('#CRexpertosGet').DataTable().state();
            localStorage.setItem('CRexpertosGet' + window.location.pathname, JSON.stringify(stado))
        }

        function stateLoadCallback(settings) {
            if ($scope.paramsDT != null && $scope.limpia) {
                $scope.paramsDT = {};
                $scope.paramsDT.displayStart = 0;
                $scope.limpia = false;
                return $scope.paramsDT;
            }
            if ($scope.paramsDT != null) {
                return $scope.paramsDT;
            } else {
                return JSON.parse(localStorage.getItem('CRexpertosGet' + window.location.pathname))
            }

        }

        $scope.reset = function () {
            $scope.busqueda = false;
            $scope.limpia = true;
            $scope.exp = {};
        };

        $scope.openModalEliminacion = function (registro) {
            $scope.descripcionRow = registro.nombreExperto;
            var modalInstance = $uibModal.open({
                templateUrl: 'app/vistasGenericas/eliminacionFisica.html',
                controller: function ($uibModalInstance) {
                    $scope.ok = function () {
                        $scope.deleteexperto(registro, $uibModalInstance);
                    };

                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                scope: $scope
            });
        };

        $scope.deleteexperto = function (experto, $uibModalInstance) {
                ExpertosCRService.delete(experto.expertoId).then(
                    function (result) {
                        var idx = $scope.expertos.indexOf(experto);
                        $scope.expertos.splice(idx, 1);
                        toastr.success(result.data);
                        $uibModalInstance.close();
                    },
                    function (err) {
                        console.error(err);
                        toastr.error(err.data.message);
                    });

        }

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