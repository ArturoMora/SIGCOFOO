namespace INEEL.DataAccess.GEN.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class migTemplateCorreo : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "GEN.cat_CorreoTemplate",
                c => new
                    {
                        Id = c.String(nullable: false, maxLength: 150),
                        Header = c.String(),
                        Body = c.String(nullable: false),
                        Footer = c.String(),
                        Claves = c.String(),
                        Asunto = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
        }
        
        public override void Down()
        {
            DropTable("GEN.cat_CorreoTemplate");
        }
    }
}
