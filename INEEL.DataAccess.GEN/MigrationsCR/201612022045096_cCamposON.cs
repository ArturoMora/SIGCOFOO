namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class cCamposON : DbMigration
    {
        public override void Up()
        {
            AddColumn("CR.tab_OportunidadNegocios", "FechaReactivacion", c => c.DateTime(nullable: false));
            AddColumn("CR.tab_OportunidadNegocios", "NoIniciativa", c => c.String(maxLength: 100));
            AddColumn("CR.tab_OportunidadNegocios", "NoPropuesta", c => c.String(maxLength: 100));
        }
        
        public override void Down()
        {
            DropColumn("CR.tab_OportunidadNegocios", "NoPropuesta");
            DropColumn("CR.tab_OportunidadNegocios", "NoIniciativa");
            DropColumn("CR.tab_OportunidadNegocios", "FechaReactivacion");
        }
    }
}
