namespace INEEL.DataAccess.GEN.MigrationsGI
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class migFechaRegistro : DbMigration
    {
        public override void Up()
        {
            AddColumn("GI.tab_ProductoGISolicitud", "FechaRegistro", c => c.DateTime(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("GI.tab_ProductoGISolicitud", "FechaRegistro");
        }
    }
}
