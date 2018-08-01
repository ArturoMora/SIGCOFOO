namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class quitarDependenciaBecarioDirigidoAgregadaporClave : DbMigration
    {
        public override void Up()
        {
            AddColumn("CH.tab_BecarioDirigido", "ClaveUnidad", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("CH.tab_BecarioDirigido", "ClaveUnidad");
        }
    }
}
