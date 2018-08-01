namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class TamanoCPContacto : DbMigration
    {
        public override void Up()
        {
            AlterColumn("CR.cat_Contactos", "CP", c => c.String(maxLength: 10));
        }
        
        public override void Down()
        {
            AlterColumn("CR.cat_Contactos", "CP", c => c.String(maxLength: 5));
        }
    }
}
