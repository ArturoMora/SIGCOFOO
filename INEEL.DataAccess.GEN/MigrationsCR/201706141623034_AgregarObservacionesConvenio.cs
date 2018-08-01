namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AgregarObservacionesConvenio : DbMigration
    {
        public override void Up()
        {
            AddColumn("CR.tab_Convenio", "Observaciones", c => c.String(maxLength: 300));
            AddColumn("CR.tab_Convenio", "Indefinido", c => c.Boolean(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("CR.tab_Convenio", "Indefinido");
            DropColumn("CR.tab_Convenio", "Observaciones");
        }
    }
}
