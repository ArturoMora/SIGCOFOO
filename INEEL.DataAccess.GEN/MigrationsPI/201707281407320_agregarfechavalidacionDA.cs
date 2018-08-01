namespace INEEL.DataAccess.GEN.MigrationsPI
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class agregarfechavalidacionDA : DbMigration
    {
        public override void Up()
        {
            AddColumn("PI.tab_DerechosAutor", "FechaValidacion", c => c.DateTime());
        }
        
        public override void Down()
        {
            DropColumn("PI.tab_DerechosAutor", "FechaValidacion");
        }
    }
}
