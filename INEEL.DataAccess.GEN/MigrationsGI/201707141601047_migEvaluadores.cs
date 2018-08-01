namespace INEEL.DataAccess.GEN.MigrationsGI
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class migEvaluadores : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "GI.cat_ComiteGI",
                c => new
                    {
                        Id = c.Int(nullable: false),
                        Nombre = c.String(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "GI.tab_EvaluadoresIdea",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        IdeaInnovadoraId = c.Int(nullable: false),
                        MiembrosGIId = c.Int(nullable: false),
                        Comentarios = c.String(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("GI.tab_IdeaInnovadora", t => t.IdeaInnovadoraId, cascadeDelete: true)
                .ForeignKey("GI.cat_MiembrosGI", t => t.MiembrosGIId, cascadeDelete: true)
                .Index(t => t.IdeaInnovadoraId)
                .Index(t => t.MiembrosGIId);
            
            CreateTable(
                "GI.cat_MiembrosGI",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        ClavePersona = c.String(nullable: false),
                        NombrePersona = c.String(nullable: false),
                        Activo = c.Boolean(nullable: false),
                        ComiteGIId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("GI.cat_ComiteGI", t => t.ComiteGIId, cascadeDelete: true)
                .Index(t => t.ComiteGIId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("GI.tab_EvaluadoresIdea", "MiembrosGIId", "GI.cat_MiembrosGI");
            DropForeignKey("GI.cat_MiembrosGI", "ComiteGIId", "GI.cat_ComiteGI");
            DropForeignKey("GI.tab_EvaluadoresIdea", "IdeaInnovadoraId", "GI.tab_IdeaInnovadora");
            DropIndex("GI.cat_MiembrosGI", new[] { "ComiteGIId" });
            DropIndex("GI.tab_EvaluadoresIdea", new[] { "MiembrosGIId" });
            DropIndex("GI.tab_EvaluadoresIdea", new[] { "IdeaInnovadoraId" });
            DropTable("GI.cat_MiembrosGI");
            DropTable("GI.tab_EvaluadoresIdea");
            DropTable("GI.cat_ComiteGI");
        }
    }
}
