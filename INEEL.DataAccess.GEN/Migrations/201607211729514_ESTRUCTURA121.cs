namespace INEEL.DataAccess.GEN.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ESTRUCTURA121 : DbMigration
    {
        public override void Up()
        {
            AddColumn("GEN.tab_AccesoSistema", "contrasena", c => c.String(maxLength: 10));
        }
        
        public override void Down()
        {
            DropColumn("GEN.tab_AccesoSistema", "contrasena");
        }
    }
}
