namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ActualizaCambiosdeMarco : DbMigration
    {
        public override void Up()
        {
            //AddColumn("CR.cat_Contactos", "Localidad", c => c.String(maxLength: 200));
            //AddColumn("CR.cat_Empresas", "Localidad", c => c.String(maxLength: 200));
        }
        
        public override void Down()
        {
            //DropColumn("CR.cat_Empresas", "Localidad");
            //DropColumn("CR.cat_Contactos", "Localidad");
        }
    }
}
