namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class TamanoCampoCelularContacto : DbMigration
    {
        public override void Up()
        {
            AlterColumn("CR.cat_Contactos", "Telefono", c => c.String(maxLength: 30));
            AlterColumn("CR.cat_Contactos", "Correo", c => c.String(maxLength: 150));
        }
        
        public override void Down()
        {
            AlterColumn("CR.cat_Contactos", "Correo", c => c.String(maxLength: 100));
            AlterColumn("CR.cat_Contactos", "Telefono", c => c.String(maxLength: 20));
        }
    }
}
