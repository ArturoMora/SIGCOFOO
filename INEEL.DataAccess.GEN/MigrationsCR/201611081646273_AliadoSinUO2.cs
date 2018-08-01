namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AliadoSinUO2 : DbMigration
    {
        public override void Up()
        {
            AddColumn("CR.tab_AreaActividadAdicional", "ClaveUnidad", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("CR.tab_AreaActividadAdicional", "ClaveUnidad");
        }
    }
}
