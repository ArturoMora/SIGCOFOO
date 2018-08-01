namespace INEEL.DataAccess.GEN.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddRecuperaPassword : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "GEN.RecuperaPassword",
                c => new
                    {
                        RecuperaPasswordId = c.Int(nullable: false, identity: true),
                        ClavePersona = c.String(maxLength: 10),
                        FechaRegistro = c.DateTime(nullable: false),
                        ValidezenMinnnutos = c.Int(nullable: false),
                        Activo = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.RecuperaPasswordId);
            
        }
        
        public override void Down()
        {
            DropTable("GEN.RecuperaPassword");
        }
    }
}
