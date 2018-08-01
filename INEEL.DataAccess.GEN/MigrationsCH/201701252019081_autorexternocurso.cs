namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class autorexternocurso : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "CH.tab_AutorExternoCursoInterno",
                c => new
                    {
                        AutorExternoCursoInternoId = c.Int(nullable: false, identity: true),
                        CursoInternoId = c.Int(nullable: false),
                        NombreCompleto = c.String(),
                    })
                .PrimaryKey(t => t.AutorExternoCursoInternoId)
                .ForeignKey("CH.tab_CursoInterno", t => t.CursoInternoId, cascadeDelete: true)
                .Index(t => t.CursoInternoId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("CH.tab_AutorExternoCursoInterno", "CursoInternoId", "CH.tab_CursoInterno");
            DropIndex("CH.tab_AutorExternoCursoInterno", new[] { "CursoInternoId" });
            DropTable("CH.tab_AutorExternoCursoInterno");
        }
    }
}
