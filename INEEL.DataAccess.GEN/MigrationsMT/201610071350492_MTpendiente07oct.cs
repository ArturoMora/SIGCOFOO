namespace INEEL.DataAccess.GEN.MigrationsMT
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class MTpendiente07oct : DbMigration
    {
        public override void Up()
        {
            //AddColumn("CR.cat_Contactos", "EstadoContacto", c => c.String(maxLength: 200));
        }
        
        public override void Down()
        {
            //DropColumn("CR.cat_Contactos", "EstadoContacto");
        }
    }
}
