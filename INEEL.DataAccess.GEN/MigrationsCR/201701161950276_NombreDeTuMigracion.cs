namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class NombreDeTuMigracion : DbMigration
    {
        public override void Up()
        {
            AlterColumn("CR.cat_LineaDesarrolloTecnologico", "DesLinDesTec", c => c.String(maxLength: 600));
        }
        
        public override void Down()
        {
            AlterColumn("CR.cat_LineaDesarrolloTecnologico", "DesLinDesTec", c => c.String(maxLength: 300));
        }
    }
}
