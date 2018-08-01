namespace INEEL.DataAccess.GEN.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class vocDoc : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "GEN.VocabularioDocumento",
                c => new
                    {
                        VocabularioId = c.String(nullable: false, maxLength: 15),
                        AdjuntoId = c.Long(nullable: false),
                        Disponible = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => new { t.VocabularioId, t.AdjuntoId });
            
        }
        
        public override void Down()
        {
            DropTable("GEN.VocabularioDocumento");
        }
    }
}
