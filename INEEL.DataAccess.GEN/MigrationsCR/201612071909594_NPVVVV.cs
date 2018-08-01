namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class NPVVVV : DbMigration
    {
        public override void Up()
        {
            AlterColumn("CR.tab_OportunidadNegocios", "FechaReactivacion", c => c.DateTime());
        }
        
        public override void Down()
        {
            AlterColumn("CR.tab_OportunidadNegocios", "FechaReactivacion", c => c.DateTime(nullable: false));
        }
    }
}
