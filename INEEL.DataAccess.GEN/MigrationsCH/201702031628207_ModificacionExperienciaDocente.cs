namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ModificacionExperienciaDocente : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("CH.tab_ExperienciaDocente", "EventoId", "CH.cat_Eventos");
            DropForeignKey("CH.tab_ExperienciaDocente", "NivelCursoId", "CH.cat_NivelCurso");
            DropForeignKey("CH.tab_ExperienciaDocente", "PaisID", "CH.cat_Pais");
            DropIndex("CH.tab_ExperienciaDocente", new[] { "NivelCursoId" });
            DropIndex("CH.tab_ExperienciaDocente", new[] { "EventoId" });
            DropIndex("CH.tab_ExperienciaDocente", new[] { "PaisID" });
            AddColumn("CH.tab_ExperienciaDocente", "InstitucionID", c => c.Int(nullable: false));
            AddColumn("CH.tab_ExperienciaDocente", "GradoAcademicoId", c => c.Int(nullable: false));
            CreateIndex("CH.tab_ExperienciaDocente", "InstitucionID");
            CreateIndex("CH.tab_ExperienciaDocente", "GradoAcademicoId");
            AddForeignKey("CH.tab_ExperienciaDocente", "GradoAcademicoId", "CH.cat_GradoAcademico", "GradoAcademicoId", cascadeDelete: false);
            AddForeignKey("CH.tab_ExperienciaDocente", "InstitucionID", "CH.cat_Instituciones", "InstitucionID", cascadeDelete: false);
            DropColumn("CH.tab_ExperienciaDocente", "programa");
            DropColumn("CH.tab_ExperienciaDocente", "NivelCursoId");
            DropColumn("CH.tab_ExperienciaDocente", "EventoId");
            DropColumn("CH.tab_ExperienciaDocente", "NumeroHoras");
            DropColumn("CH.tab_ExperienciaDocente", "PaisID");
            DropColumn("CH.tab_ExperienciaDocente", "Lugar");
            DropColumn("CH.tab_ExperienciaDocente", "NumeroDias");
        }
        
        public override void Down()
        {
            AddColumn("CH.tab_ExperienciaDocente", "NumeroDias", c => c.Int(nullable: false));
            AddColumn("CH.tab_ExperienciaDocente", "Lugar", c => c.String(maxLength: 200));
            AddColumn("CH.tab_ExperienciaDocente", "PaisID", c => c.Int(nullable: false));
            AddColumn("CH.tab_ExperienciaDocente", "NumeroHoras", c => c.Int());
            AddColumn("CH.tab_ExperienciaDocente", "EventoId", c => c.Int(nullable: false));
            AddColumn("CH.tab_ExperienciaDocente", "NivelCursoId", c => c.Int(nullable: false));
            AddColumn("CH.tab_ExperienciaDocente", "programa", c => c.String(maxLength: 200));
            DropForeignKey("CH.tab_ExperienciaDocente", "InstitucionID", "CH.cat_Instituciones");
            DropForeignKey("CH.tab_ExperienciaDocente", "GradoAcademicoId", "CH.cat_GradoAcademico");
            DropIndex("CH.tab_ExperienciaDocente", new[] { "GradoAcademicoId" });
            DropIndex("CH.tab_ExperienciaDocente", new[] { "InstitucionID" });
            DropColumn("CH.tab_ExperienciaDocente", "GradoAcademicoId");
            DropColumn("CH.tab_ExperienciaDocente", "InstitucionID");
            CreateIndex("CH.tab_ExperienciaDocente", "PaisID");
            CreateIndex("CH.tab_ExperienciaDocente", "EventoId");
            CreateIndex("CH.tab_ExperienciaDocente", "NivelCursoId");
            AddForeignKey("CH.tab_ExperienciaDocente", "PaisID", "CH.cat_Pais", "PaisID", cascadeDelete: true);
            AddForeignKey("CH.tab_ExperienciaDocente", "NivelCursoId", "CH.cat_NivelCurso", "NivelCursoId", cascadeDelete: true);
            AddForeignKey("CH.tab_ExperienciaDocente", "EventoId", "CH.cat_Eventos", "EventoId", cascadeDelete: true);
        }
    }
}
