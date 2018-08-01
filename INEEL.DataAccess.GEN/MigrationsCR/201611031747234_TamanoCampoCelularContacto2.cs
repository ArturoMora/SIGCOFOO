namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class TamanoCampoCelularContacto2 : DbMigration
    {
        public override void Up()
        {
            AlterColumn("CR.cat_Contactos", "Telefono", c => c.String(maxLength: 31));
            AlterColumn("CR.cat_Contactos", "Correo", c => c.String(maxLength: 151));
        }
        
        public override void Down()
        {
            AlterColumn("CR.cat_Contactos", "Correo", c => c.String(maxLength: 150));
            AlterColumn("CR.cat_Contactos", "Telefono", c => c.String(maxLength: 30));
        }
    }
}
