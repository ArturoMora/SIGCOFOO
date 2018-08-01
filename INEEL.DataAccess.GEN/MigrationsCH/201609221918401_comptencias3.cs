namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class comptencias3 : DbMigration
    {
        public override void Up()
        {
            AddColumn("CH.tab_Competencias", "periodoId", c => c.Int(nullable: false));
            CreateIndex("CH.tab_Competencias", "periodoId");
            AddForeignKey("CH.tab_Competencias", "periodoId", "CH.cat_PeriodoEvaluacion", "PeriodoEvaluaionId", cascadeDelete: true);
            DropColumn("CH.tab_Competencias", "Periodo");
        }
        
        public override void Down()
        {
            AddColumn("CH.tab_Competencias", "Periodo", c => c.String(maxLength: 4));
            DropForeignKey("CH.tab_Competencias", "periodoId", "CH.cat_PeriodoEvaluacion");
            DropIndex("CH.tab_Competencias", new[] { "periodoId" });
            DropColumn("CH.tab_Competencias", "periodoId");
        }
    }
}
