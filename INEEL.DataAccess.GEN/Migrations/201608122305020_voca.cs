namespace INEEL.DataAccess.GEN.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class voca : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Vocabulario",
                c => new
                    {
                        VocabularioId = c.String(nullable: false, maxLength: 15),
                        Disponible = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.VocabularioId);
            
        }
        
        public override void Down()
        {
            DropTable("dbo.Vocabulario");
        }
    }
}
