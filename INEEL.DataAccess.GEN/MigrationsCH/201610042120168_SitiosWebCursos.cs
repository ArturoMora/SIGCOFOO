namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class SitiosWebCursos : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "CH.tab_SitioWebCurso",
                c => new
                    {
                        SitioWebCursoInternoId = c.Int(nullable: false, identity: true),
                        Url = c.String(nullable: false),
                        Descripcion = c.String(maxLength: 300),
                        FechaRegistro = c.DateTime(nullable: false),
                        Autor = c.String(nullable: false, maxLength: 250),
                        Estado = c.Boolean(nullable: false),
                        CursoInternoId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.SitioWebCursoInternoId)
                .ForeignKey("CH.tab_CursoInterno", t => t.CursoInternoId, cascadeDelete: true)
                .Index(t => t.CursoInternoId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("CH.tab_SitioWebCurso", "CursoInternoId", "CH.tab_CursoInterno");
            DropIndex("CH.tab_SitioWebCurso", new[] { "CursoInternoId" });
            DropTable("CH.tab_SitioWebCurso");
        }
    }
}
