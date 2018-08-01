namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class CampoClaveCategoria : DbMigration
    {
        public override void Up()
        {
            AlterColumn("CH.tab_EvaluacionTecnicas", "claveCategoria", c => c.String(maxLength: 20));
        }
        
        public override void Down()
        {
            AlterColumn("CH.tab_EvaluacionTecnicas", "claveCategoria", c => c.String(maxLength: 5));
        }
    }
}
