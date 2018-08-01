namespace INEEL.DataAccess.GEN.MigrationsMT
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class setClassIcono : DbMigration
    {
        public override void Up()
        {
            //AddColumn("GEN.cat_Funciones", "ClaseIcono", c => c.String());
        }
        
        public override void Down()
        {
            //DropColumn("GEN.cat_Funciones", "ClaseIcono");
        }
    }
}
