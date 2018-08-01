namespace INEEL.DataAccess.GEN.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class estado22 : DbMigration
    {
        public override void Up()
        {
            AddColumn("GEN.cat_EstadoFlujo", "DescripcionCorta", c => c.String(maxLength: 50));
            DropColumn("GEN.cat_EstadoFlujo", "DescripcionCorta2");
        }
        
        public override void Down()
        {
            AddColumn("GEN.cat_EstadoFlujo", "DescripcionCorta2", c => c.String(maxLength: 50));
            DropColumn("GEN.cat_EstadoFlujo", "DescripcionCorta");
        }
    }
}
