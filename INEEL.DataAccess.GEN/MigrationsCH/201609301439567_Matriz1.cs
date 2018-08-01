namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Matriz1 : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "CH.tab_MtrizCompetencias",
                c => new
                    {
                        matrizId = c.Int(nullable: false, identity: true),
                        competenciaId = c.Int(nullable: false),
                        categoriaId = c.Int(nullable: false),
                        nivelId = c.Int(nullable: false),
                        periodo = c.String(maxLength: 4),
                        estado = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.matrizId)
                .ForeignKey("CH.cat_CategoriasPorFamilia", t => t.categoriaId, cascadeDelete: true)
                .ForeignKey("CH.tab_Competencias", t => t.competenciaId, cascadeDelete: true)
                .ForeignKey("CH.cat_DescripcionNiveles", t => t.nivelId, cascadeDelete: true)
                .Index(t => t.competenciaId)
                .Index(t => t.categoriaId)
                .Index(t => t.nivelId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("CH.tab_MtrizCompetencias", "nivelId", "CH.cat_DescripcionNiveles");
            DropForeignKey("CH.tab_MtrizCompetencias", "competenciaId", "CH.tab_Competencias");
            DropForeignKey("CH.tab_MtrizCompetencias", "categoriaId", "CH.cat_CategoriasPorFamilia");
            DropIndex("CH.tab_MtrizCompetencias", new[] { "nivelId" });
            DropIndex("CH.tab_MtrizCompetencias", new[] { "categoriaId" });
            DropIndex("CH.tab_MtrizCompetencias", new[] { "competenciaId" });
            DropTable("CH.tab_MtrizCompetencias");
        }
    }
}
