namespace INEEL.DataAccess.GEN.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class DeleteFechaEfectiva : DbMigration
    {
        public override void Up()
        {
            DropColumn("GEN.cat_EstadoFlujo", "FechaEfectiva");
        }
        
        public override void Down()
        {
            AddColumn("GEN.cat_EstadoFlujo", "FechaEfectiva", c => c.DateTime(nullable: false));
        }
    }
}
