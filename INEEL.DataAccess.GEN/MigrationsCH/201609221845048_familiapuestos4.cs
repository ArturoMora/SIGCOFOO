namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class familiapuestos4 : DbMigration
    {
        public override void Up()
        {
            AddColumn("CH.tab_FamiliaPuestos", "periodoId", c => c.Int(nullable: false));
            CreateIndex("CH.tab_FamiliaPuestos", "periodoId");
            AddForeignKey("CH.tab_FamiliaPuestos", "periodoId", "CH.cat_PeriodoEvaluacion", "PeriodoEvaluaionId", cascadeDelete: true);
            DropColumn("CH.tab_FamiliaPuestos", "periodo");
        }
        
        public override void Down()
        {
            AddColumn("CH.tab_FamiliaPuestos", "periodo", c => c.String(maxLength: 4));
            DropForeignKey("CH.tab_FamiliaPuestos", "periodoId", "CH.cat_PeriodoEvaluacion");
            DropIndex("CH.tab_FamiliaPuestos", new[] { "periodoId" });
            DropColumn("CH.tab_FamiliaPuestos", "periodoId");
        }
    }
}
