namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class m141116 : DbMigration
    {
        public override void Up()
        {
            //DropColumn("GEN.cat_EstadoFlujo", "FechaEfectiva");
        }
        
        public override void Down()
        {
            //AddColumn("GEN.cat_EstadoFlujo", "FechaEfectiva", c => c.DateTime(nullable: false));
        }
    }
}
