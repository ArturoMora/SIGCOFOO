namespace INEEL.DataAccess.GEN.MigrationsMT
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class cambio02Sep27 : DbMigration
    {
        public override void Up()
        {
            //AddColumn("CR.cat_Empresas", "LocalidadRS", c => c.String(maxLength: 200));
        }
        
        public override void Down()
        {
            //DropColumn("CR.cat_Empresas", "LocalidadRS");
        }
    }
}
