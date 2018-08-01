namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class NuevoCampoAsignadoAON : DbMigration
    {
        public override void Up()
        {
            AddColumn("CR.tab_OportunidadNegocios", "AsignadoA", c => c.String(maxLength: 10));
        }
        
        public override void Down()
        {
            DropColumn("CR.tab_OportunidadNegocios", "AsignadoA");
        }
    }
}
