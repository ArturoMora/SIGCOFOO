namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class CambiosEnTablasFamiliasPuestos3 : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("CH.tab_FamiliaPuestos", "TipoCompetenciaId", "CH.cat_TipoCompetencia");
            DropIndex("CH.tab_FamiliaPuestos", new[] { "TipoCompetenciaId" });
            DropColumn("CH.tab_FamiliaPuestos", "TipoCompetenciaId");
        }
        
        public override void Down()
        {
            AddColumn("CH.tab_FamiliaPuestos", "TipoCompetenciaId", c => c.Int(nullable: false));
            CreateIndex("CH.tab_FamiliaPuestos", "TipoCompetenciaId");
            AddForeignKey("CH.tab_FamiliaPuestos", "TipoCompetenciaId", "CH.cat_TipoCompetencia", "TipoCompetenciaId", cascadeDelete: true);
        }
    }
}
