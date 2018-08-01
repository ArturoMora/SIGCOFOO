(function () {
    "use strict";

    angular
        .module("ineel.controllers")
        .controller("tableroCtrl", ["AuthService", "$scope", "$rootScope", "$stateParams", "tableroService",  "$uibModal", "$state", tableroCtrl]);

    function tableroCtrl(AuthService, $scope, $rootScope, $stateParams, tableroService,  $uibModal, $state) {
        
        //Obtener los servicios de autenticacion
        $scope.authentication = AuthService.authentication;

        $scope.cadenaBusqueda = "";
        $scope.seleccionado = "";
        $scope.seleccionadocontrimestre = "";
                
        //Tipo de Informes de becario

        $scope.mesSemestre = (new Date()).getMonth().toString();

        $scope.semestre = "0";


        if ($scope.mesSemestre >= 0 && $scope.mesSemestre <= 2) { $scope.semestre = "1"; }
        if ($scope.mesSemestre >= 3 && $scope.mesSemestre <= 5) { $scope.semestre = "2"; }
        if ($scope.mesSemestre >= 6 && $scope.mesSemestre <= 8) { $scope.semestre = "3"; }
        if ($scope.mesSemestre >= 9 && $scope.mesSemestre <= 11) { $scope.semestre = "4"; }



        $scope.actual = (new Date()).getFullYear().toString();
        $scope.periodoSel = (new Date()).getFullYear().toString();
        $scope.trimestreSel = $scope.semestre;

        $scope.anios = [
            {
                "id": "2017",
                "descripcion": "2017"
            },
            {
                "id": "2018",
                "descripcion": "2018"
            },
            {
                "id": "2019",
                "descripcion": "2019"
             },
             {
                 "id": "2020",
                "descripcion": "2020"
             },
            {
                "id": "2021",
                "descripcion": "2021"
            },
            {
                "id": "2022",
                "descripcion": "2022"
            },
             {
                 "id": "2023",
                 "descripcion": "2023"
             },
            {
                "id": "2024",
                "descripcion": "2024"
             },
            {
                "id": "2025",
                "descripcion": "2025"
            },
            {
                "id": "2026",
                "descripcion": "2026"
            },
            {
                "id": "2027",
                "descripcion": "2027"
            },
            {
                "id": "2028",
                "descripcion": "2028"
            },
            {
                "id": "2029",
                "descripcion": "2029"
            },
            {
                "id": "2030",
                "descripcion": "2030"
            }

        ];

        //Tipo de Informes de becario
        $scope.trimestres = [
           {
               "id": "0",
               "descripcion": "Seleccione un trimestre"
           },
            {
                "id": "1",
                "descripcion": "1er Trimestre"
            },
            {
                "id": "2",
                "descripcion": "2do Trimestre"
            },
            {
                "id": "3",
                "descripcion": "3er Trimestre"
            },
            {
                "id": "4",
                "descripcion": "4to Trimestre"
            }
        ];

        $scope.actualizacionFichas = function () {

            $scope.seleccionado = $scope.periodoSel;
            tableroService.getActualizacionesPerfil($scope.periodoSel).then(
             function (result) {
                 $scope.ficha = result.data;                
             },
             function (err) {
                toastr.error(err);
             });
        }

        $scope.oportunidades = function () {

            $scope.cadenaBusqueda = $scope.periodoSel + "," + $scope.trimestreSel;

            if ($scope.trimestreSel == "1") { $scope.seleccionadocontrimestre = " 1er Trimestre " + $scope.periodoSel; }
            if ($scope.trimestreSel == "2") { $scope.seleccionadocontrimestre = " 2do Trimestre " + $scope.periodoSel; }
            if ($scope.trimestreSel == "3") { $scope.seleccionadocontrimestre = " 3er Trimestre " + $scope.periodoSel; }
            if ($scope.trimestreSel == "4") { $scope.seleccionadocontrimestre = " 4to Trimestre " + $scope.periodoSel; }


            tableroService.getOportunidades($scope.cadenaBusqueda).then(
             function (result) {
                 $scope.oportunidad = result.data;
             },
             function (err) {
                 toastr.error(err);
             });
        }

        $scope.piLicenciada = function () {

            $scope.seleccionado = $scope.periodoSel;
            tableroService.getpiLicencida($scope.periodoSel).then(
             function (result) {
                 $scope.plicenciada = result.data;
             },
             function (err) {
                 toastr.error(err);
             });
        }

        $scope.piInvestigador = function () {

            $scope.seleccionado = $scope.periodoSel;
            tableroService.getpiLicencidaXInvestigador($scope.periodoSel).then(
             function (result) {
                 $scope.plicenciadaxinv = result.data;
             },
             function (err) {
                 toastr.error(err);
             });
        }

        $scope.cpParticipantes = function () {

            $scope.cadenaBusqueda = $scope.periodoSel + "," + $scope.trimestreSel;

            if ($scope.trimestreSel == "1") { $scope.seleccionadocontrimestre = " 1er Trimestre " + $scope.periodoSel; }
            if ($scope.trimestreSel == "2") { $scope.seleccionadocontrimestre = " 2do Trimestre " + $scope.periodoSel; }
            if ($scope.trimestreSel == "3") { $scope.seleccionadocontrimestre = " 3er Trimestre " + $scope.periodoSel; }
            if ($scope.trimestreSel == "4") { $scope.seleccionadocontrimestre = " 4to Trimestre " + $scope.periodoSel; }

            tableroService.getParticipantesComunidad($scope.cadenaBusqueda).then(
             function (result) {
                 $scope.cParticipantes = result.data;
             },
             function (err) {
                 toastr.error(err);
             });
        }

        $scope.cpMapas = function () {

            $scope.cadenaBusqueda = $scope.periodoSel + "," + $scope.trimestreSel;

            if ($scope.trimestreSel == "1") { $scope.seleccionadocontrimestre = " 1er Trimestre " + $scope.periodoSel; }
            if ($scope.trimestreSel == "2") { $scope.seleccionadocontrimestre = " 2do Trimestre " + $scope.periodoSel; }
            if ($scope.trimestreSel == "3") { $scope.seleccionadocontrimestre = " 3er Trimestre " + $scope.periodoSel; }
            if ($scope.trimestreSel == "4") { $scope.seleccionadocontrimestre = " 4to Trimestre " + $scope.periodoSel; }

            tableroService.getMapasComunidad($scope.cadenaBusqueda).then(
             function (result) {
                 $scope.cMapas = result.data;
             },
             function (err) {
                 toastr.error(err);
             });
        }

        $scope.cpEstudios = function () {

            $scope.cadenaBusqueda = $scope.periodoSel + "," + $scope.trimestreSel;

            if ($scope.trimestreSel == "1") { $scope.seleccionadocontrimestre = " 1er Trimestre " + $scope.periodoSel; }
            if ($scope.trimestreSel == "2") { $scope.seleccionadocontrimestre = " 2do Trimestre " + $scope.periodoSel; }
            if ($scope.trimestreSel == "3") { $scope.seleccionadocontrimestre = " 3er Trimestre " + $scope.periodoSel; }
            if ($scope.trimestreSel == "4") { $scope.seleccionadocontrimestre = " 4to Trimestre " + $scope.periodoSel; }

            tableroService.getEstudiosComunidad($scope.cadenaBusqueda).then(
             function (result) {
                 $scope.cEstudios = result.data;
             },
             function (err) {
                 toastr.error(err);
             });
        }


        $scope.giPropuestas = function () {

            $scope.seleccionado = $scope.periodoSel;
            tableroService.getPropuestasEntreIdeas($scope.periodoSel).then(
             function (result) {
                 $scope.giPropuestas = result.data;
             },
             function (err) {
                 toastr.error(err);
             });
        }


        $scope.giIdeas = function () {

            $scope.seleccionado = $scope.periodoSel;
            tableroService.getIdeasEntreIdeas($scope.periodoSel).then(
             function (result) {
                 $scope.giIdeas = result.data;
             },
             function (err) {
                 toastr.error(err);
             });
        }

        $scope.indicadoresMT = function () {


            $scope.cadenaBusqueda = $scope.periodoSel + "," + $scope.trimestreSel;

            if ($scope.trimestreSel == "1") { $scope.seleccionadocontrimestre = " 1er Trimestre " + $scope.periodoSel; }
            if ($scope.trimestreSel == "2") { $scope.seleccionadocontrimestre = " 2do Trimestre " + $scope.periodoSel; }
            if ($scope.trimestreSel == "3") { $scope.seleccionadocontrimestre = " 3er Trimestre " + $scope.periodoSel; }
            if ($scope.trimestreSel == "4") { $scope.seleccionadocontrimestre = " 4to Trimestre " + $scope.periodoSel; }

            
            tableroService.getAccesosMT($scope.cadenaBusqueda).then(
             function (result) {
                 $scope.mtAccesos = result.data;
             },
             function (err) {
                 toastr.error(err);
             });
        }

        $scope.muestradatos = function () {

            $scope.actualizacionFichas();
            $scope.oportunidades();
            $scope.piLicenciada();
            $scope.piInvestigador();
            $scope.cpParticipantes();
            $scope.cpMapas();
            $scope.cpEstudios();
            $scope.giPropuestas();
            $scope.giIdeas();
            $scope.indicadoresMT();

        }


        $scope.muestradatos();
       


    }
})();