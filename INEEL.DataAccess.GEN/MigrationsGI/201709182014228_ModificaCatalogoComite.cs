namespace INEEL.DataAccess.GEN.MigrationsGI
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ModificaCatalogoComite : DbMigration
    {
        public override void Up()
        {
            DropColumn("GI.cat_ComiteGI", "Id");
        }
        
        public override void Down()
        {
            AddColumn("GI.cat_ComiteGI", "Id", c => c.Int(nullable: false));
        }
    }
}
