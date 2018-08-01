namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class NuevoCampoLocalidadEMpresaContacto : DbMigration
    {
        public override void Up()
        {
            AddColumn("CR.cat_Contactos", "Localidad", c => c.String(maxLength: 200));
            AddColumn("CR.cat_Empresas", "Localidad", c => c.String(maxLength: 200));
        }
        
        public override void Down()
        {
            DropColumn("CR.cat_Empresas", "Localidad");
            DropColumn("CR.cat_Contactos", "Localidad");
        }
    }
}
