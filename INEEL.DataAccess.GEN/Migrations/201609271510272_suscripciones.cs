namespace INEEL.DataAccess.GEN.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class suscripciones : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "GEN.OCSuscripciones",
                c => new
                    {
                        ClaveEmpleado = c.Int(nullable: false),
                        OcsId = c.String(nullable: false, maxLength: 100),
                        suscrito = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => new { t.ClaveEmpleado, t.OcsId })
                .ForeignKey("GEN.cat_Ocs", t => t.OcsId, cascadeDelete: true)
                .Index(t => t.OcsId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("GEN.OCSuscripciones", "OcsId", "GEN.cat_Ocs");
            DropIndex("GEN.OCSuscripciones", new[] { "OcsId" });
            DropTable("GEN.OCSuscripciones");
        }
    }
}
