namespace INEEL.DataAccess.GEN.MigrationsPI
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class fechesolicitudnull : DbMigration
    {
        public override void Up()
        {
            AlterColumn("PI.tab_DerechosAutor", "FechaSolicitud", c => c.DateTime());
        }
        
        public override void Down()
        {
            AlterColumn("PI.tab_DerechosAutor", "FechaSolicitud", c => c.DateTime(nullable: false));
        }
    }
}
