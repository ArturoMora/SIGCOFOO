namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class quitaFechaRequeridaConvenio : DbMigration
    {
        public override void Up()
        {
            AlterColumn("CR.tab_Convenio", "FechaTermino", c => c.DateTime(nullable: true));
        }
        
        public override void Down()
        {
            AlterColumn("CR.tab_Convenio", "FechaTermino", c => c.DateTime(nullable: false));
        }
    }
}