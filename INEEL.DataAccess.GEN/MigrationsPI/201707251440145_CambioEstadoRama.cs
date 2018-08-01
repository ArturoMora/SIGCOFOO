namespace INEEL.DataAccess.GEN.MigrationsPI
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class CambioEstadoRama : DbMigration
    {
        public override void Up()
        {
            AlterColumn("PI.cat_Ramas", "Estado", c => c.Boolean(nullable: false));
        }
        
        public override void Down()
        {
            AlterColumn("PI.cat_Ramas", "Estado", c => c.Int(nullable: false));
        }
    }
}
