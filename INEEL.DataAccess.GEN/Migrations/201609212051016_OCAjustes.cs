namespace INEEL.DataAccess.GEN.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class OCAjustes : DbMigration
    {
        public override void Up()
        {
            AddColumn("GEN.NuevoOC", "liga", c => c.String());
            AddColumn("GEN.cat_Ocs", "Nombre", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("GEN.cat_Ocs", "Nombre");
            DropColumn("GEN.NuevoOC", "liga");
        }
    }
}
