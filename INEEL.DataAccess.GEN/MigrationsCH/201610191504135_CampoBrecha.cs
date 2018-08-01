namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class CampoBrecha : DbMigration
    {
        public override void Up()
        {
            AlterColumn("CH.tab_EvaluacionTecnicas", "brecha", c => c.String());
        }
        
        public override void Down()
        {
            AlterColumn("CH.tab_EvaluacionTecnicas", "brecha", c => c.String(maxLength: 500));
        }
    }
}
