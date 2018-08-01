namespace INEEL.DataAccess.GEN.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class paisorigencontacto : DbMigration
    {
        public override void Up()
        {
            //AddColumn("CR.cat_Contactos", "PaisOrigenId", c => c.Int());
        }
        
        public override void Down()
        {
            //DropColumn("CR.cat_Contactos", "PaisOrigenId");
        }
    }
}
