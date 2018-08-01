namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class campoUnidadON : DbMigration
    {
        public override void Up()
        {
            AddColumn("CR.tab_OportunidadNegocios", "ClaveUnidad", c => c.String(maxLength: 10));
        }
        
        public override void Down()
        {
            DropColumn("CR.tab_OportunidadNegocios", "ClaveUnidad");
        }
    }
}
