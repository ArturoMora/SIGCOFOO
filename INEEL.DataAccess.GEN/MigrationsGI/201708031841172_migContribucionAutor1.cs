namespace INEEL.DataAccess.GEN.MigrationsGI
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class migContribucionAutor1 : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "GI.cat_ContribucionAutor",
                c => new
                    {
                        Id = c.Int(nullable: false),
                        Contribucion = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            AddColumn("GI.tab_ProductoAutores", "ContribucionId", c => c.Int(nullable: false));
            CreateIndex("GI.tab_ProductoAutores", "ContribucionId");
            AddForeignKey("GI.tab_ProductoAutores", "ContribucionId", "GI.cat_ContribucionAutor", "Id", cascadeDelete: true);
        }
        
        public override void Down()
        {
            DropForeignKey("GI.tab_ProductoAutores", "ContribucionId", "GI.cat_ContribucionAutor");
            DropIndex("GI.tab_ProductoAutores", new[] { "ContribucionId" });
            DropColumn("GI.tab_ProductoAutores", "ContribucionId");
            DropTable("GI.cat_ContribucionAutor");
        }
    }
}
