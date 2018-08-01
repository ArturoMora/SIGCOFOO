namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Modificacion4 : DbMigration
    {
        public override void Up()
        {
            CreateIndex("CH.tab_Asociaciones", "EstadoFlujoId");
            CreateIndex("CH.tab_Ponencia", "EstadoFlujoId");
            CreateIndex("CH.tab_Publicacion", "EstadoFlujoId");
            CreateIndex("CH.tab_BecarioDirigido", "EstadoFlujoId");
            CreateIndex("CH.tab_BecarioInterno", "EstadoFlujoId");
            CreateIndex("CH.tab_Distincion", "EstadoFlujoId");
            CreateIndex("CH.tab_ExperienciaDocente", "EstadoFlujoId");
            CreateIndex("CH.tab_ExperienciaExterna", "EstadoFlujoId");
            CreateIndex("CH.tab_FormacionAcademica", "EstadoFlujoId");
            CreateIndex("CH.tab_Idioma", "EstadoFlujoId");
            CreateIndex("CH.tab_SNI", "EstadoFlujoId");
            CreateIndex("CH.tab_Solicitud", "EstadoFlujoId");
            CreateIndex("CH.tab_TesisDirigida", "EstadoFlujoId");
            AddForeignKey("CH.tab_Asociaciones", "EstadoFlujoId", "GEN.cat_EstadoFlujo", "EstadoFlujoId", cascadeDelete: true);
            AddForeignKey("CH.tab_Ponencia", "EstadoFlujoId", "GEN.cat_EstadoFlujo", "EstadoFlujoId", cascadeDelete: true);
            AddForeignKey("CH.tab_Publicacion", "EstadoFlujoId", "GEN.cat_EstadoFlujo", "EstadoFlujoId", cascadeDelete: true);
            AddForeignKey("CH.tab_BecarioDirigido", "EstadoFlujoId", "GEN.cat_EstadoFlujo", "EstadoFlujoId", cascadeDelete: true);
            AddForeignKey("CH.tab_BecarioInterno", "EstadoFlujoId", "GEN.cat_EstadoFlujo", "EstadoFlujoId", cascadeDelete: true);
            AddForeignKey("CH.tab_Distincion", "EstadoFlujoId", "GEN.cat_EstadoFlujo", "EstadoFlujoId", cascadeDelete: true);
            AddForeignKey("CH.tab_ExperienciaDocente", "EstadoFlujoId", "GEN.cat_EstadoFlujo", "EstadoFlujoId", cascadeDelete: true);
            AddForeignKey("CH.tab_ExperienciaExterna", "EstadoFlujoId", "GEN.cat_EstadoFlujo", "EstadoFlujoId", cascadeDelete: true);
            AddForeignKey("CH.tab_FormacionAcademica", "EstadoFlujoId", "GEN.cat_EstadoFlujo", "EstadoFlujoId", cascadeDelete: true);
            AddForeignKey("CH.tab_Idioma", "EstadoFlujoId", "GEN.cat_EstadoFlujo", "EstadoFlujoId", cascadeDelete: true);
            AddForeignKey("CH.tab_SNI", "EstadoFlujoId", "GEN.cat_EstadoFlujo", "EstadoFlujoId", cascadeDelete: true);
            AddForeignKey("CH.tab_Solicitud", "EstadoFlujoId", "GEN.cat_EstadoFlujo", "EstadoFlujoId", cascadeDelete: true);
            AddForeignKey("CH.tab_TesisDirigida", "EstadoFlujoId", "GEN.cat_EstadoFlujo", "EstadoFlujoId", cascadeDelete: true);
        }
        
        public override void Down()
        {
            DropForeignKey("CH.tab_TesisDirigida", "EstadoFlujoId", "GEN.cat_EstadoFlujo");
            DropForeignKey("CH.tab_Solicitud", "EstadoFlujoId", "GEN.cat_EstadoFlujo");
            DropForeignKey("CH.tab_SNI", "EstadoFlujoId", "GEN.cat_EstadoFlujo");
            DropForeignKey("CH.tab_Idioma", "EstadoFlujoId", "GEN.cat_EstadoFlujo");
            DropForeignKey("CH.tab_FormacionAcademica", "EstadoFlujoId", "GEN.cat_EstadoFlujo");
            DropForeignKey("CH.tab_ExperienciaExterna", "EstadoFlujoId", "GEN.cat_EstadoFlujo");
            DropForeignKey("CH.tab_ExperienciaDocente", "EstadoFlujoId", "GEN.cat_EstadoFlujo");
            DropForeignKey("CH.tab_Distincion", "EstadoFlujoId", "GEN.cat_EstadoFlujo");
            DropForeignKey("CH.tab_BecarioInterno", "EstadoFlujoId", "GEN.cat_EstadoFlujo");
            DropForeignKey("CH.tab_BecarioDirigido", "EstadoFlujoId", "GEN.cat_EstadoFlujo");
            DropForeignKey("CH.tab_Publicacion", "EstadoFlujoId", "GEN.cat_EstadoFlujo");
            DropForeignKey("CH.tab_Ponencia", "EstadoFlujoId", "GEN.cat_EstadoFlujo");
            DropForeignKey("CH.tab_Asociaciones", "EstadoFlujoId", "GEN.cat_EstadoFlujo");
            DropIndex("CH.tab_TesisDirigida", new[] { "EstadoFlujoId" });
            DropIndex("CH.tab_Solicitud", new[] { "EstadoFlujoId" });
            DropIndex("CH.tab_SNI", new[] { "EstadoFlujoId" });
            DropIndex("CH.tab_Idioma", new[] { "EstadoFlujoId" });
            DropIndex("CH.tab_FormacionAcademica", new[] { "EstadoFlujoId" });
            DropIndex("CH.tab_ExperienciaExterna", new[] { "EstadoFlujoId" });
            DropIndex("CH.tab_ExperienciaDocente", new[] { "EstadoFlujoId" });
            DropIndex("CH.tab_Distincion", new[] { "EstadoFlujoId" });
            DropIndex("CH.tab_BecarioInterno", new[] { "EstadoFlujoId" });
            DropIndex("CH.tab_BecarioDirigido", new[] { "EstadoFlujoId" });
            DropIndex("CH.tab_Publicacion", new[] { "EstadoFlujoId" });
            DropIndex("CH.tab_Ponencia", new[] { "EstadoFlujoId" });
            DropIndex("CH.tab_Asociaciones", new[] { "EstadoFlujoId" });
        }
    }
}
