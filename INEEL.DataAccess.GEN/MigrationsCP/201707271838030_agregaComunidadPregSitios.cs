namespace INEEL.DataAccess.GEN.MigrationsCP
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class agregaComunidadPregSitios : DbMigration
    {
        public override void Up()
        {
            AddColumn("CP.tab_SitioInteres", "idCP", c => c.Int(nullable: false));
            AddColumn("CP.tab_Preguntas", "idCP", c => c.Int(nullable: false));
            CreateIndex("CP.tab_SitioInteres", "idCP");
            CreateIndex("CP.tab_Preguntas", "idCP");
            AddForeignKey("CP.tab_SitioInteres", "idCP", "CP.tab_Comunidades", "ComunidadId", cascadeDelete: false);
            AddForeignKey("CP.tab_Preguntas", "idCP", "CP.tab_Comunidades", "ComunidadId", cascadeDelete: false);
        }
        
        public override void Down()
        {
            DropForeignKey("CP.tab_Preguntas", "idCP", "CP.tab_Comunidades");
            DropForeignKey("CP.tab_SitioInteres", "idCP", "CP.tab_Comunidades");
            DropIndex("CP.tab_Preguntas", new[] { "idCP" });
            DropIndex("CP.tab_SitioInteres", new[] { "idCP" });
            DropColumn("CP.tab_Preguntas", "idCP");
            DropColumn("CP.tab_SitioInteres", "idCP");
        }
    }
}
