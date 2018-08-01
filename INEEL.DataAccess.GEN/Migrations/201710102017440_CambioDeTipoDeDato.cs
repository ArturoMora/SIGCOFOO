namespace INEEL.DataAccess.GEN.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class CambioDeTipoDeDato : DbMigration
    {
        public override void Up()
        {
            AlterColumn("GEN.Proyectos", "egresos", c => c.Decimal(precision: 18, scale: 2));
        }
        
        public override void Down()
        {
            AlterColumn("GEN.Proyectos", "egresos", c => c.Single());
        }
    }
}
