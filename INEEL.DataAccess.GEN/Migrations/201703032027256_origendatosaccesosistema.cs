namespace INEEL.DataAccess.GEN.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class origendatosaccesosistema : DbMigration
    {
        public override void Up()
        {
            AddColumn("GEN.tab_AccesoSistema", "OrigenDatos", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("GEN.tab_AccesoSistema", "OrigenDatos");
        }
    }
}
