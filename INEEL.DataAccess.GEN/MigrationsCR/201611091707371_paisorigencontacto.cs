namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class paisorigencontacto : DbMigration
    {
        public override void Up()
        {
            AddColumn("CR.cat_Contactos", "PaisOrigenId", c => c.Int());
            AlterColumn("CR.cat_Expertos", "ClavePersona", c => c.String(nullable: false, maxLength: 10));
        }
        
        public override void Down()
        {
            AlterColumn("CR.cat_Expertos", "ClavePersona", c => c.Int(nullable: false));
            DropColumn("CR.cat_Contactos", "PaisOrigenId");
        }
    }
}
