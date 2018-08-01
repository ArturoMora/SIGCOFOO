namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class quitarDependenciaBecarioDirigido5 : DbMigration
    {
        public override void Up()
        {
            DropColumn("CH.tab_BecarioDirigido", "ClaveUnidad");
            DropColumn("CH.tab_BecarioDirigido", "FechaEfectiva");
        }
        
        public override void Down()
        {
            AddColumn("CH.tab_BecarioDirigido", "FechaEfectiva", c => c.DateTime());
            AddColumn("CH.tab_BecarioDirigido", "ClaveUnidad", c => c.String(maxLength: 10));
        }
    }
}
