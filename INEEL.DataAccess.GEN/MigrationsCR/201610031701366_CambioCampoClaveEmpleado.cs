namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class CambioCampoClaveEmpleado : DbMigration
    {
        public override void Up()
        {
            AddColumn("CR.tab_OportunidadNegocios", "ClaveEmpleado", c => c.String(maxLength: 250));
            DropColumn("CR.tab_OportunidadNegocios", "ClavePersona");
        }
        
        public override void Down()
        {
            AddColumn("CR.tab_OportunidadNegocios", "ClavePersona", c => c.String(nullable: false));
            DropColumn("CR.tab_OportunidadNegocios", "ClaveEmpleado");
        }
    }
}
