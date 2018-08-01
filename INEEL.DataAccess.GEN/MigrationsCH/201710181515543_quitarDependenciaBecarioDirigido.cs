namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class quitarDependenciaBecarioDirigido : DbMigration
    {
        public override void Up()
        {
            AlterColumn("CH.tab_BecarioDirigido", "FechaEfectiva", c => c.DateTime());
        }
        
        public override void Down()
        {
            AlterColumn("CH.tab_BecarioDirigido", "FechaEfectiva", c => c.DateTime(nullable: false));
        }
    }
}
