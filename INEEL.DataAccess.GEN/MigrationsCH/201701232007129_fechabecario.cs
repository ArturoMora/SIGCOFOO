namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class fechabecario : DbMigration
    {
        public override void Up()
        {
            AlterColumn("CH.tab_BecarioDirigido", "FechaTermino", c => c.DateTime());
        }
        
        public override void Down()
        {
            AlterColumn("CH.tab_BecarioDirigido", "FechaTermino", c => c.DateTime(nullable: false));
        }
    }
}
