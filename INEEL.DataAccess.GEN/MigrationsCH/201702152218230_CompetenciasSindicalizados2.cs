namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class CompetenciasSindicalizados2 : DbMigration
    {
        public override void Up()
        {
            CreateIndex("CH.tab_EvaluacionEmpleadosSind", "idEvaluacionSin");
            CreateIndex("CH.tab_EvaluacionEmpleadosSind", "idCategoriaCompetencia");
            CreateIndex("CH.cat_MatrizCompetenciasSind", "idCategoria");
            CreateIndex("CH.cat_MatrizCompetenciasSind", "idRelacionCompetencias");
            CreateIndex("CH.cat_RelacionCompetenciasNivelSind", "idCompetencia");
            CreateIndex("CH.cat_RelacionCompetenciasNivelSind", "idNivel");
            CreateIndex("CH.cat_RegistroEvaluacionesSind", "idEvaluacionSin");
            CreateIndex("CH.cat_RegistroEvaluacionesSind", "idMatriz");
            CreateIndex("CH.cat_RelacionNivelesComportamientoSind", "idNivel");
            CreateIndex("CH.cat_RelacionNivelesComportamientoSind", "idComportamiento");
            CreateIndex("CH.cat_RelacionNivelesComportamientoSind", "idRelacionCompetencias");
            AddForeignKey("CH.tab_EvaluacionEmpleadosSind", "idCategoriaCompetencia", "CH.cat_CategoriasCompetenciasSind", "CategoriaId", cascadeDelete: true);
            AddForeignKey("CH.tab_EvaluacionEmpleadosSind", "idEvaluacionSin", "CH.tab_ListadoEmpleadosSind", "Id", cascadeDelete: true);
            AddForeignKey("CH.cat_MatrizCompetenciasSind", "idCategoria", "CH.cat_CategoriasCompetenciasSind", "CategoriaId", cascadeDelete: false);
            AddForeignKey("CH.cat_RelacionCompetenciasNivelSind", "idCompetencia", "CH.cat_CompetenciasSind", "CompetenciaId", cascadeDelete: true);
            AddForeignKey("CH.cat_RelacionCompetenciasNivelSind", "idNivel", "CH.cat_NivelesCompetencias", "NivelCompetenciaId", cascadeDelete: true);
            AddForeignKey("CH.cat_MatrizCompetenciasSind", "idRelacionCompetencias", "CH.cat_RelacionCompetenciasNivelSind", "id", cascadeDelete: true);
            AddForeignKey("CH.cat_RegistroEvaluacionesSind", "idEvaluacionSin", "CH.tab_EvaluacionEmpleadosSind", "id", cascadeDelete: true);
            AddForeignKey("CH.cat_RegistroEvaluacionesSind", "idMatriz", "CH.cat_MatrizCompetenciasSind", "id", cascadeDelete: true);
            AddForeignKey("CH.cat_RelacionNivelesComportamientoSind", "idComportamiento", "CH.cat_ComportamientosSind", "id", cascadeDelete: true);
            AddForeignKey("CH.cat_RelacionNivelesComportamientoSind", "idNivel", "CH.cat_NivelesCompetencias", "NivelCompetenciaId", cascadeDelete: true);
            AddForeignKey("CH.cat_RelacionNivelesComportamientoSind", "idRelacionCompetencias", "CH.cat_RelacionCompetenciasNivelSind", "id", cascadeDelete: false);
        }
        
        public override void Down()
        {
            DropForeignKey("CH.cat_RelacionNivelesComportamientoSind", "idRelacionCompetencias", "CH.cat_RelacionCompetenciasNivelSind");
            DropForeignKey("CH.cat_RelacionNivelesComportamientoSind", "idNivel", "CH.cat_NivelesCompetencias");
            DropForeignKey("CH.cat_RelacionNivelesComportamientoSind", "idComportamiento", "CH.cat_ComportamientosSind");
            DropForeignKey("CH.cat_RegistroEvaluacionesSind", "idMatriz", "CH.cat_MatrizCompetenciasSind");
            DropForeignKey("CH.cat_RegistroEvaluacionesSind", "idEvaluacionSin", "CH.tab_EvaluacionEmpleadosSind");
            DropForeignKey("CH.cat_MatrizCompetenciasSind", "idRelacionCompetencias", "CH.cat_RelacionCompetenciasNivelSind");
            DropForeignKey("CH.cat_RelacionCompetenciasNivelSind", "idNivel", "CH.cat_NivelesCompetencias");
            DropForeignKey("CH.cat_RelacionCompetenciasNivelSind", "idCompetencia", "CH.cat_CompetenciasSind");
            DropForeignKey("CH.cat_MatrizCompetenciasSind", "idCategoria", "CH.cat_CategoriasCompetenciasSind");
            DropForeignKey("CH.tab_EvaluacionEmpleadosSind", "idEvaluacionSin", "CH.tab_ListadoEmpleadosSind");
            DropForeignKey("CH.tab_EvaluacionEmpleadosSind", "idCategoriaCompetencia", "CH.cat_CategoriasCompetenciasSind");
            DropIndex("CH.cat_RelacionNivelesComportamientoSind", new[] { "idRelacionCompetencias" });
            DropIndex("CH.cat_RelacionNivelesComportamientoSind", new[] { "idComportamiento" });
            DropIndex("CH.cat_RelacionNivelesComportamientoSind", new[] { "idNivel" });
            DropIndex("CH.cat_RegistroEvaluacionesSind", new[] { "idMatriz" });
            DropIndex("CH.cat_RegistroEvaluacionesSind", new[] { "idEvaluacionSin" });
            DropIndex("CH.cat_RelacionCompetenciasNivelSind", new[] { "idNivel" });
            DropIndex("CH.cat_RelacionCompetenciasNivelSind", new[] { "idCompetencia" });
            DropIndex("CH.cat_MatrizCompetenciasSind", new[] { "idRelacionCompetencias" });
            DropIndex("CH.cat_MatrizCompetenciasSind", new[] { "idCategoria" });
            DropIndex("CH.tab_EvaluacionEmpleadosSind", new[] { "idCategoriaCompetencia" });
            DropIndex("CH.tab_EvaluacionEmpleadosSind", new[] { "idEvaluacionSin" });
        }
    }
}
