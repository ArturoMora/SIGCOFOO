namespace INEEL.DataAccess.GEN.MigrationsMT
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class corregirMT : DbMigration
    {
        public override void Up()
        {
            //AlterColumn("CR.cat_Contactos", "Puesto", c => c.String(maxLength: 200));
        }
        
        public override void Down()
        {
            //AlterColumn("CR.cat_Contactos", "Puesto", c => c.String(nullable: false, maxLength: 200));
        }
    }
}
